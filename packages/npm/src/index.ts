/**
 * AURA FanVerse Official TypeScript Client SDK
 * Supports telemetry verification, PINN physics calculation, and tactical co-pilot endpoints.
 */

export interface TelemetryPacket {
  packet_id: string;
  timestamp: string;
  speed_kmh: number;
  spin_rpm: number;
  deviation_deg: number;
  signature: string;
}

export interface TacticalRecommendation {
  phase: 'powerplay' | 'middle' | 'death';
  optimal_formation: string;
  field_coordinates: Array<{ fielder_id: number; x: number; y: number; role: string }>;
  win_probability_swing: number;
  confidence: number;
}

export interface MultilingualTranslation {
  code: 'te' | 'hi' | 'ta' | 'en' | 'es' | 'ar';
  nativeName: string;
  dir: 'ltr' | 'rtl';
}

export class AuraFanVerseClient {
  private baseUrl: string;
  private apiKey?: string;

  constructor(options: { baseUrl?: string; apiKey?: string } = {}) {
    this.baseUrl = options.baseUrl || 'http://localhost:8000';
    this.apiKey = options.apiKey;
  }

  public async getHealth(): Promise<{ status: string; version: string }> {
    const res = await fetch(`${this.baseUrl}/api/health`);
    if (!res.ok) throw new Error(`Health check failed: ${res.statusText}`);
    return res.json();
  }

  public async getTacticalAdvice(payload: {
    score: number;
    wickets: number;
    overs: number;
    target?: number;
  }): Promise<TacticalRecommendation> {
    const res = await fetch(`${this.baseUrl}/api/tactical`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(this.apiKey ? { Authorization: `Bearer ${this.apiKey}` } : {}) },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error(`Tactical query failed: ${res.statusText}`);
    return res.json();
  }

  public async verifyTelemetry(packet: TelemetryPacket): Promise<{ verified: boolean; message: string }> {
    const res = await fetch(`${this.baseUrl}/api/security/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(packet)
    });
    return res.json();
  }
}

export default AuraFanVerseClient;
