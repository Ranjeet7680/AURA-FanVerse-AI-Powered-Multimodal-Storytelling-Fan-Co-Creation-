export interface PredictionResult {
  team1WinProbability: number;
  team2WinProbability: number;
  confidence: number;
  features: { name: string; weight: number; value: number }[];
}

export interface MatchFeatures {
  format: 'T20' | 'ODI' | 'Test';
  gender: 'male' | 'female';
  tossWinnerBatted: boolean;
  team1BatFirst: boolean;
  innings1Runs: number;
  innings1RR: number;
  innings1Wickets: number;
}

export class MatchPredictor {
  private weights: number[];
  private bias: number;
  private trained: boolean = false;
  private featureNames: string[] = [
    'format', 'gender', 'tossWinnerBatted', 'team1BatFirst', 
    'innings1Runs', 'innings1RR', 'innings1Wickets'
  ];
  private mins: number[] = new Array(7).fill(0);
  private maxs: number[] = new Array(7).fill(1);
  
  constructor() {
    this.weights = new Array(7).fill(0);
    this.bias = 0;
  }

  private sigmoid(z: number): number {
    return 1 / (1 + Math.exp(-z));
  }
  
  private encodeFeatures(f: MatchFeatures | any): number[] {
    const formatEnc = f.format === 'T20' ? 0 : (f.format === 'Test' || f.format === 'MDM' ? 2 : 1);
    const genderEnc = f.gender === 'male' ? 0 : 1;
    const tossWinnerBatted = f.tossWinnerBatted ? 1 : 0;
    const team1BatFirst = f.team1BatFirst ? 1 : 0;
    return [
      formatEnc,
      genderEnc,
      tossWinnerBatted,
      team1BatFirst,
      f.innings1Runs || 0,
      f.innings1RR || 0,
      f.innings1Wickets || 0
    ];
  }

  private normalize(features: number[]): number[] {
    return features.map((val, i) => {
      const range = this.maxs[i] - this.mins[i];
      if (range === 0) return 0;
      return (val - this.mins[i]) / range;
    });
  }

  async train(): Promise<{ accuracy: number; samplesUsed: number }> {
    try {
      const response = await fetch('/data/model_training_data.json');
      if (!response.ok) {
         throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      if (!Array.isArray(data) || data.length === 0) {
        return { accuracy: 0, samplesUsed: 0 };
      }

      // Extract raw features and targets
      const X_raw: number[][] = [];
      const y: number[] = [];

      data.forEach((match: any) => {
          // parse raw match to features
          const f = this.encodeFeatures({
             format: match.info?.match_type || 'T20',
             gender: match.info?.gender || 'male',
             tossWinnerBatted: match.info?.toss?.decision === 'bat',
             team1BatFirst: true, // simplified for now or extracted
             innings1Runs: match.innings?.[0]?.runs || 0,
             innings1RR: (match.innings?.[0]?.runs || 0) / (match.innings?.[0]?.overs || 20),
             innings1Wickets: match.innings?.[0]?.wickets || 0
          });
          X_raw.push(f);
          const target = match.info?.outcome?.winner ? 1 : 0; // Simple target extraction
          y.push(target);
      });

      // Calculate min/max for normalization
      const nFeatures = 7;
      this.mins = new Array(nFeatures).fill(Infinity);
      this.maxs = new Array(nFeatures).fill(-Infinity);

      X_raw.forEach(row => {
        row.forEach((val, j) => {
          if (val < this.mins[j]) this.mins[j] = val;
          if (val > this.maxs[j]) this.maxs[j] = val;
        });
      });

      // Normalize X
      const X = X_raw.map(row => this.normalize(row));

      // Gradient Descent
      const learningRate = 0.01;
      const iterations = 1000;
      const m = X.length;

      this.weights = new Array(nFeatures).fill(0);
      this.bias = 0;

      for (let iter = 0; iter < iterations; iter++) {
        let dw = new Array(nFeatures).fill(0);
        let db = 0;

        for (let i = 0; i < m; i++) {
          const z = X[i].reduce((sum, val, j) => sum + val * this.weights[j], 0) + this.bias;
          const a = this.sigmoid(z);
          const dz = a - y[i];

          for (let j = 0; j < nFeatures; j++) {
            dw[j] += X[i][j] * dz;
          }
          db += dz;
        }

        for (let j = 0; j < nFeatures; j++) {
          this.weights[j] -= learningRate * (dw[j] / m);
        }
        this.bias -= learningRate * (db / m);
      }
      
      // Calculate accuracy
      let correct = 0;
      for (let i = 0; i < m; i++) {
          const z = X[i].reduce((sum, val, j) => sum + val * this.weights[j], 0) + this.bias;
          const pred = this.sigmoid(z) >= 0.5 ? 1 : 0;
          if (pred === y[i]) correct++;
      }

      this.trained = true;
      return { accuracy: correct / m, samplesUsed: m };
    } catch (e) {
      console.error("Failed to train model", e);
      return { accuracy: 0, samplesUsed: 0 };
    }
  }

  predict(features: MatchFeatures): PredictionResult {
    if (!this.trained) {
      console.warn("Predictor not trained. Call train() first. Returning default values.");
      return {
        team1WinProbability: 0.5,
        team2WinProbability: 0.5,
        confidence: 0,
        features: []
      };
    }

    const rawFeatures = this.encodeFeatures(features);
    const normalizedFeatures = this.normalize(rawFeatures);
    
    let z = this.bias;
    const featureContributions: { name: string; weight: number; value: number }[] = [];
    
    normalizedFeatures.forEach((val, i) => {
      z += val * this.weights[i];
      featureContributions.push({
        name: this.featureNames[i],
        weight: this.weights[i],
        value: val
      });
    });

    const prob = this.sigmoid(z);
    
    return {
      team1WinProbability: prob,
      team2WinProbability: 1 - prob,
      confidence: Math.abs(prob - 0.5) * 2,
      features: featureContributions
    };
  }

  getModelStats(): { weights: number[]; bias: number; featureNames: string[] } {
    return {
      weights: this.weights,
      bias: this.bias,
      featureNames: this.featureNames
    };
  }
}

export const matchPredictor = new MatchPredictor();
