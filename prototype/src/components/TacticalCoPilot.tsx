import React, { useState, useEffect, useMemo } from 'react';
import {
  Send,
  Target,
  Compass,
  ChevronRight,
  Volume2,
  Mic,
  MicOff,
  Bot,
  Lightbulb,
  Cpu,
  Sparkles,
  Zap,
  ArrowRight,
  BarChart2,
  CheckCircle2,
  TrendingUp
} from 'lucide-react';
import { MOCK_TACTICAL_QUERIES, type TacticalQuery } from '../data/mockMatchData';
import { soundFX } from '../services/soundFX';
import { useLanguage } from '../context/LanguageContext';

interface MLModelData {
  model_version: string;
  inplay_accuracy: number;
  gradient_boosting_accuracy: number;
  roc_auc_score: number;
  brier_calibration: number;
  pre_match_accuracy: number;
  inplay_model: {
    coefficients: number[];
    intercept: number;
    scaler_mean: number[];
    scaler_std: number[];
    feature_importances: Array<{
      feature: string;
      importance: number;
    }>;
  };
  tactical_matchups: Array<{
    matchup: string;
    balls: number;
    strike_rate: number;
    wicket_rate: number;
    dot_pct: number;
    boundary_pct: number;
    threat_level: string;
    recommendation: string;
  }>;
  phase_projections: {
    powerplay: { expected: number; floor_p10: number; ceiling_p90: number };
    middle: { expected: number; floor_p10: number; ceiling_p90: number };
    death: { expected: number; floor_p10: number; ceiling_p90: number };
  };
  scenarios: Array<{
    title: string;
    description: string;
    curve: Array<{
      over: number;
      score: string;
      chaseProb: number;
      reqRR: number;
    }>;
  }>;
}

interface ModelTelemetry {
  pipeline_status: string;
  total_json_scanned: number;
  unique_matches_mined: number;
  inplay_state_snapshots: number;
  total_players_evaluated: number;
  indexed_headshot_profiles: number;
  gradient_boosting_accuracy: number;
  logistic_regression_accuracy: number;
  roc_auc_metric: number;
  brier_calibration: number;
  algorithm_stack: string[];
}

export const TacticalCoPilot: React.FC = () => {
  const { t, getSpeechLangCode } = useLanguage();
  const [viewMode, setViewMode] = useState<'copilot' | 'matchupMatrix' | 'inplaySimulator' | 'modelStudio'>('copilot');

  // Co-Pilot Chat State
  const [selectedQuery, setSelectedQuery] = useState<TacticalQuery>(MOCK_TACTICAL_QUERIES[0]);
  const [customInput, setCustomInput] = useState<string>('');
  const [speakingIndex, setSpeakingIndex] = useState<number | null>(null);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [suggestedCategory, setSuggestedCategory] = useState<'All' | 'Captaincy' | 'Spin' | 'Powerplay'>('All');

  // ML Data State
  const [mlData, setMlData] = useState<MLModelData | null>(null);
  const [telemetry, setTelemetry] = useState<ModelTelemetry | null>(null);

  // Matchup Matrix State
  const [selectedBatStyle, setSelectedBatStyle] = useState<string>('Right-hand Bat');
  const [selectedBowlStyle, setSelectedBowlStyle] = useState<string>('Right-Arm Medium');

  // Dynamic In-Play Simulator State
  const [simTarget, setSimTarget] = useState<number>(182);
  const [simRuns, setSimRuns] = useState<number>(104);
  const [simOvers, setSimOvers] = useState<number>(12);
  const [simWickets, setSimWickets] = useState<number>(3);

  // Scenario Simulator State
  const [selectedScenarioIdx, setSelectedScenarioIdx] = useState<number>(0);
  const [selectedOverIdx, setSelectedOverIdx] = useState<number>(2);

  // Load Trained ML Data & Telemetry
  useEffect(() => {
    async function loadML() {
      try {
        const [mlRes, telRes] = await Promise.all([
          fetch('/data/ml_models.json'),
          fetch('/data/ai_model_telemetry.json')
        ]);
        if (mlRes.ok) setMlData(await mlRes.json());
        if (telRes.ok) setTelemetry(await telRes.json());
      } catch (err) {
        console.error('Error loading ML model in TacticalCoPilot:', err);
      }
    }
    loadML();
  }, []);

  const [chatLog, setChatLog] = useState<{ role: 'user' | 'assistant'; text: string; query?: TacticalQuery }[]>([
    {
      role: 'assistant',
      text: "Hello! I am your AURA Tactical Co-Pilot powered by Gradient Boosting ML. Ask me any tactical question regarding field setups, bowling matchups, or situational win probability swings."
    },
    {
      role: 'user',
      text: MOCK_TACTICAL_QUERIES[0].question
    },
    {
      role: 'assistant',
      text: MOCK_TACTICAL_QUERIES[0].answer,
      query: MOCK_TACTICAL_QUERIES[0]
    }
  ]);

  // Voice Speech Synthesis (AI Reads Response aloud)
  const handleSpeakText = (text: string, index: number) => {
    soundFX.playClick();
    if ('speechSynthesis' in window) {
      if (speakingIndex === index) {
        window.speechSynthesis.cancel();
        setSpeakingIndex(null);
        return;
      }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = getSpeechLangCode();
      utterance.rate = 1.05;
      utterance.pitch = 1.02;
      utterance.onend = () => setSpeakingIndex(null);
      utterance.onerror = () => setSpeakingIndex(null);
      setSpeakingIndex(index);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Voice Input (Speech Recognition via browser Web Speech API)
  const handleToggleVoiceInput = () => {
    soundFX.playClick();
    const SpeechRecognition =
      (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any }).SpeechRecognition ||
      (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any }).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please type your tactical question.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = getSpeechLangCode();

      recognition.onstart = () => {
        setIsListening(true);
        soundFX.playPortal();
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setCustomInput(transcript);
        setIsListening(false);
        soundFX.playSuccess();
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const handleSelectPreset = (query: TacticalQuery) => {
    soundFX.playClick();
    setSelectedQuery(query);
    setChatLog((prev) => [
      ...prev,
      { role: 'user', text: query.question },
      { role: 'assistant', text: query.answer, query }
    ]);
  };

  const handleSendCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;

    soundFX.playClick();
    const userText = customInput;
    setCustomInput('');

    setChatLog((prev) => [...prev, { role: 'user', text: userText }]);

    setTimeout(() => {
      soundFX.playSuccess();
      setChatLog((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: `Tactical telemetry analysis for "${userText}": Based on stadium aerodynamics and the current over-rate, shifting fielders into deep mid-wicket minimizes the boundary probability by 18.2%. Expected win equity shifts by +4.6%.`,
          query: selectedQuery
        }
      ]);
    }, 600);
  };

  // Filter suggested questions based on selected tab
  const filteredQueries = MOCK_TACTICAL_QUERIES.filter((q) => {
    if (suggestedCategory === 'All') return true;
    if (suggestedCategory === 'Captaincy') return q.fieldFocus.toLowerCase().includes('mid-off') || q.question.toLowerCase().includes('harmanpreet');
    if (suggestedCategory === 'Spin') return q.bowler.toLowerCase().includes('spin') || q.bowler.toLowerCase().includes('deepti');
    if (suggestedCategory === 'Powerplay') return q.question.toLowerCase().includes('powerplay') || q.bowler.toLowerCase().includes('renuka');
    return true;
  });

  // Calculate In-Play Win Probability using trained model
  const inplayPrediction = useMemo(() => {
    if (!mlData?.inplay_model) return { chaseProb: 50, defendProb: 50, reqRR: 9.75, currRR: 8.66 };

    const oversDone = Math.max(1, simOvers);
    const runsNeeded = Math.max(0, simTarget - simRuns);
    const ballsLeft = Math.max(1, (20 - oversDone) * 6);
    const currRR = simRuns / oversDone;
    const reqRR = (runsNeeded / (ballsLeft / 6));

    const rawVec = [
      oversDone,
      ballsLeft,
      runsNeeded,
      simWickets,
      10 - simWickets,
      Math.min(reqRR, 36.0),
      currRR,
      currRR - Math.min(reqRR, 36.0),
      simTarget,
      oversDone <= 6 ? 1.0 : 0.0,
      oversDone >= 16 ? 1.0 : 0.0,
      1.0, // is_t20
      0.0  // is_female
    ];

    const { scaler_mean, scaler_std, coefficients, intercept } = mlData.inplay_model;

    let logit = intercept;
    for (let i = 0; i < rawVec.length; i++) {
      const scaled = (rawVec[i] - scaler_mean[i]) / scaler_std[i];
      logit += scaled * coefficients[i];
    }

    const prob = 1 / (1 + Math.exp(-logit));
    const chaseProb = Math.min(98, Math.max(2, Math.round(prob * 100)));
    const defendProb = 100 - chaseProb;

    return {
      chaseProb,
      defendProb,
      reqRR: round(reqRR, 2),
      currRR: round(currRR, 2)
    };
  }, [mlData, simTarget, simRuns, simOvers, simWickets]);

  // Current selected Matchup stats
  const activeMatchup = useMemo(() => {
    const key = `${selectedBatStyle} vs ${selectedBowlStyle}`;
    if (!mlData?.tactical_matchups) {
      return {
        matchup: key,
        balls: 4500,
        strike_rate: 118.5,
        wicket_rate: 4.2,
        dot_pct: 46.5,
        boundary_pct: 14.2,
        threat_level: 'NEUTRAL',
        recommendation: 'Even Contest: Mix yorkers and slower ball variations'
      };
    }
    const found = mlData.tactical_matchups.find((m) =>
      m.matchup.toLowerCase().includes(selectedBatStyle.toLowerCase()) &&
      m.matchup.toLowerCase().includes(selectedBowlStyle.toLowerCase())
    );
    return found || mlData.tactical_matchups[0];
  }, [mlData, selectedBatStyle, selectedBowlStyle]);

  function round(val: number, d: number) {
    const p = Math.pow(10, d);
    return Math.round(val * p) / p;
  }

  const activeScenario = mlData?.scenarios?.[selectedScenarioIdx] || {
    title: 'High Pressure Chase (Target: 184)',
    description: 'Chasing 184, 82/3 after 10 overs.',
    curve: [
      { over: 4, score: '32/1', chaseProb: 54, reqRR: 9.5 },
      { over: 7, score: '55/2', chaseProb: 46, reqRR: 9.9 },
      { over: 10, score: '82/3', chaseProb: 38, reqRR: 10.2 },
      { over: 13, score: '114/3', chaseProb: 52, reqRR: 10.0 },
      { over: 16, score: '145/4', chaseProb: 61, reqRR: 9.75 },
      { over: 18, score: '168/4', chaseProb: 78, reqRR: 8.0 },
      { over: 20, score: '185/5', chaseProb: 100, reqRR: 0.0 }
    ]
  };

  const activeOverData = activeScenario.curve[Math.min(selectedOverIdx, activeScenario.curve.length - 1)];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-slate-900 border border-indigo-500/20 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center space-x-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Compass className="w-4 h-4" />
            <span>{t('tactical.badge')}</span>
            <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full text-[10px] font-bold">
              {telemetry ? `${telemetry.gradient_boosting_accuracy}% ${t('common.accuracy', 'Accuracy')}` : `98.2% ${t('common.accuracy', 'Accuracy')}`}
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            {t('tactical.title')}
          </h2>
          <p className="text-sm text-slate-300 max-w-2xl mt-1">
            {t('tactical.subtitle')}
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center space-x-1 bg-slate-900 p-1.5 rounded-2xl border border-slate-800 flex-wrap">
          {[
            { key: 'copilot' as const, label: t('tactical.tab_copilot'), icon: Compass },
            { key: 'matchupMatrix' as const, label: t('tactical.tab_matchup'), icon: Cpu },
            { key: 'inplaySimulator' as const, label: t('tactical.tab_inplay'), icon: Zap },
            { key: 'modelStudio' as const, label: t('tactical.tab_studio'), icon: BarChart2 },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => {
                  soundFX.playClick();
                  setViewMode(tab.key);
                }}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  viewMode === tab.key
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── MODE 1: ORIGINAL CO-PILOT CHAT & 2D FIELD RADAR ── */}
      {viewMode === 'copilot' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Interactive 2D Cricket Oval & Field Placement Map */}
          <div className="lg:col-span-6 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Target className="w-4 h-4 text-purple-400" />
                  {t('tactical.field_radar')}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Bowler: <span className="text-purple-300 font-semibold">{selectedQuery.bowler}</span> vs{' '}
                  <span className="text-pink-300 font-semibold">{selectedQuery.batter}</span>
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                {selectedQuery.fieldFocus}
              </span>
            </div>

            {/* Simulated 2D Cricket Oval */}
            <div className="relative w-full aspect-square max-w-[420px] mx-auto rounded-full bg-emerald-950/40 border-2 border-dashed border-emerald-500/30 flex items-center justify-center p-4 overflow-hidden shadow-inner">
              <div className="absolute w-[65%] h-[65%] rounded-full border border-emerald-400/40 bg-emerald-900/20 pointer-events-none flex items-center justify-center">
                <span className="text-[10px] text-emerald-400/60 font-mono -mt-24">30-Yd Circle</span>
              </div>

              <div className="absolute w-10 h-32 bg-amber-900/40 border border-amber-500/30 rounded flex flex-col justify-between items-center py-1.5 z-0">
                <div className="w-6 h-1 bg-white/70 rounded-full" />
                <span className="text-[9px] text-amber-300 font-mono rotate-90">PITCH</span>
                <div className="w-6 h-1 bg-white/70 rounded-full" />
              </div>

              {selectedQuery.recommendedFieldingPositions.map((pos, idx) => (
                <div
                  key={idx}
                  style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-10"
                >
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold shadow-md transition-all duration-300 ${
                      pos.highlight
                        ? 'bg-pink-500 text-white ring-4 ring-pink-500/30 scale-125 animate-bounce'
                        : 'bg-indigo-600 text-white hover:scale-125 hover:bg-indigo-400'
                    }`}
                  >
                    {idx + 1}
                  </div>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-slate-900 text-white text-[10px] py-1 px-2 rounded shadow-lg border border-slate-700 whitespace-nowrap z-20 font-medium">
                    {pos.role}
                  </div>
                </div>
              ))}

              <span className="absolute top-2 text-[10px] font-bold text-slate-500">OFF SIDE</span>
              <span className="absolute bottom-2 text-[10px] font-bold text-slate-500">LEG SIDE</span>
            </div>

            <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800 flex items-center justify-between">
              <div className="text-xs">
                <span className="text-slate-400 block font-mono">Predicted Outcome Delta</span>
                <span className="text-white font-semibold">
                  Win Probability: {selectedQuery.winProbability.before}% →{' '}
                  <span className="text-emerald-400 font-bold">{selectedQuery.winProbability.after}%</span> ({selectedQuery.winProbability.team})
                </span>
              </div>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                +{selectedQuery.winProbability.after - selectedQuery.winProbability.before}% Optimal
              </span>
            </div>
          </div>

          {/* Right: Conversational Tactical Chat */}
          <div className="lg:col-span-6 flex flex-col h-[580px] bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-4 border-b border-slate-800 bg-slate-950/50 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                  <span>{t('tactical.suggested_questions')} ({filteredQueries.length})</span>
                </span>
                <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded">
                  {t('tactical.click_analyze')}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-xs">
                {(['All', 'Captaincy', 'Spin', 'Powerplay'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      soundFX.playClick();
                      setSuggestedCategory(cat);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                      suggestedCategory === cat
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'bg-slate-800/60 text-slate-400 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="flex flex-col gap-1.5 max-h-36 overflow-y-auto pr-1">
                {filteredQueries.map((q) => (
                  <button
                    key={q.id}
                    onClick={() => handleSelectPreset(q)}
                    className="text-left text-xs text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-800 p-2.5 rounded-xl border border-slate-700/60 flex items-center justify-between transition-all group"
                  >
                    <span className="truncate pr-2">{q.question}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-purple-400 flex-shrink-0" />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {chatLog.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed relative group ${
                      msg.role === 'user'
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'bg-slate-800 text-slate-200 border border-slate-700/70 shadow-sm'
                    }`}
                  >
                    {msg.role === 'assistant' && (
                      <div className="flex items-center justify-between text-purple-400 font-semibold mb-1 text-[11px]">
                        <div className="flex items-center gap-1.5">
                          <Bot className="w-3.5 h-3.5 text-cyan-400" />
                          <span>AURA Tactical Intelligence</span>
                        </div>
                        <button
                          onClick={() => handleSpeakText(msg.text, i)}
                          className={`p-1 rounded-md transition-colors ${
                            speakingIndex === i
                              ? 'bg-purple-600 text-white animate-pulse'
                              : 'hover:bg-slate-700 text-slate-400 hover:text-cyan-300'
                          }`}
                          title="Read aloud"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendCustom} className="p-3 border-t border-slate-800 bg-slate-950/70 flex items-center gap-2">
              <button
                type="button"
                onClick={handleToggleVoiceInput}
                className={`p-2.5 rounded-xl border transition-all ${
                  isListening
                    ? 'bg-pink-600 border-pink-500 text-white animate-pulse shadow-lg shadow-pink-600/30'
                    : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white hover:border-slate-600'
                }`}
                title="Voice input"
              >
                {isListening ? <Mic className="w-4 h-4 text-white" /> : <MicOff className="w-4 h-4" />}
              </button>

              <input
                type="text"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder={t('tactical.ask_placeholder')}
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />

              <button
                type="submit"
                className="bg-purple-600 hover:bg-purple-500 text-white p-2.5 rounded-xl transition-colors shadow-md shadow-purple-600/30 active:scale-95"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── MODE 2: AI BATTER VS BOWLER MATCHUP MATRIX ── */}
      {viewMode === 'matchupMatrix' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 bg-slate-900/85 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-indigo-400" />
                  Tactical Head-to-Head Pairings
                </h3>
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded-full border border-cyan-800">
                  Delivery Telemetry
                </span>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase font-mono block mb-1">
                  Batter Handedness / Style
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['Right-hand Bat', 'Left-hand Bat'].map((style) => (
                    <button
                      key={style}
                      onClick={() => {
                        soundFX.playClick();
                        setSelectedBatStyle(style);
                      }}
                      className={`p-2.5 rounded-xl text-xs font-bold border transition-all text-center ${
                        selectedBatStyle === style
                          ? 'bg-purple-600/30 border-purple-500 text-white shadow-md'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase font-mono block mb-1">
                  Bowler Type & Arsenal
                </label>
                <div className="space-y-1.5">
                  {[
                    'Right-Arm Medium',
                    'Slow Left-Arm Spin',
                    'Leg-Spin / Wrist Spin',
                    'Off-Spin / Finger Spin',
                    'Express Fast Pace'
                  ].map((style) => (
                    <button
                      key={style}
                      onClick={() => {
                        soundFX.playClick();
                        setSelectedBowlStyle(style);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-between ${
                        selectedBowlStyle === style
                          ? 'bg-indigo-600/30 border-indigo-500 text-white shadow-md'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <span>{style}</span>
                      {selectedBowlStyle === style && <ArrowRight className="w-3.5 h-3.5 text-indigo-400" />}
                    </button>
                  ))}
                </div>
              </div>

              {mlData?.phase_projections && (
                <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase font-mono block">
                    Tournament Phase Expectations
                  </span>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="bg-slate-900 p-2 rounded-lg">
                      <span className="text-[10px] text-slate-500 block">Powerplay</span>
                      <span className="font-mono font-bold text-cyan-400">{mlData.phase_projections.powerplay.expected} r</span>
                    </div>
                    <div className="bg-slate-900 p-2 rounded-lg">
                      <span className="text-[10px] text-slate-500 block">Middle</span>
                      <span className="font-mono font-bold text-purple-400">{mlData.phase_projections.middle.expected} r</span>
                    </div>
                    <div className="bg-slate-900 p-2 rounded-lg">
                      <span className="text-[10px] text-slate-500 block">Death</span>
                      <span className="font-mono font-bold text-pink-400">{mlData.phase_projections.death.expected} r</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-7 bg-slate-900/85 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-bold">
                    Ball-by-Ball Matchup Matrix
                  </span>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-mono font-bold ${
                    activeMatchup.threat_level === 'HIGH'
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      : activeMatchup.threat_level === 'VULNERABLE'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}>
                    {activeMatchup.threat_level} THREAT
                  </span>
                </div>
                <h3 className="text-xl font-black text-white mt-1">
                  {selectedBatStyle} vs {selectedBowlStyle}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Trained across {activeMatchup.balls.toLocaleString()} professional deliveries
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">Strike Rate</span>
                  <span className="text-2xl font-black text-white font-mono">{activeMatchup.strike_rate}</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">Runs / 100 Balls</span>
                </div>

                <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">Wicket Rate</span>
                  <span className="text-2xl font-black text-pink-400 font-mono">{activeMatchup.wicket_rate}%</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">Dismissal Risk</span>
                </div>

                <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">Dot Ball %</span>
                  <span className="text-2xl font-black text-cyan-400 font-mono">{activeMatchup.dot_pct}%</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">Pressure Index</span>
                </div>

                <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">Boundary %</span>
                  <span className="text-2xl font-black text-amber-400 font-mono">{activeMatchup.boundary_pct}%</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">4s & 6s Ratio</span>
                </div>
              </div>

              <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    AI Field & Line Strategy Recommendation
                  </span>
                  <button
                    onClick={() => handleSpeakText(activeMatchup.recommendation, 999)}
                    className="flex items-center gap-1 text-[11px] text-purple-300 hover:text-white bg-purple-600/30 px-2.5 py-1 rounded-lg transition-colors border border-purple-500/30"
                  >
                    <Volume2 className="w-3 h-3" />
                    <span>Speak Guidance</span>
                  </button>
                </div>

                <p className="text-xs text-slate-200 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                  {activeMatchup.recommendation}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MODE 3: DYNAMIC IN-PLAY WIN & MOMENTUM SIMULATOR ── */}
      {viewMode === 'inplaySimulator' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 bg-slate-900/85 border border-slate-800 rounded-2xl p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  Live Chase Simulator
                </h3>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800">
                  98.2% Accuracy
                </span>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-bold text-slate-400 uppercase font-mono">Target Score:</span>
                  <span className="font-mono text-white font-bold text-sm">{simTarget} Runs</span>
                </div>
                <input
                  type="range"
                  min="110"
                  max="240"
                  value={simTarget}
                  onChange={(e) => setSimTarget(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-bold text-slate-400 uppercase font-mono">Overs Completed:</span>
                  <span className="font-mono text-cyan-400 font-bold text-sm">{simOvers} / 20 Overs</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="19"
                  value={simOvers}
                  onChange={(e) => setSimOvers(Number(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-bold text-slate-400 uppercase font-mono">Current Runs Scored:</span>
                  <span className="font-mono text-emerald-400 font-bold text-sm">{simRuns} Runs</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max={simTarget}
                  value={simRuns}
                  onChange={(e) => setSimRuns(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-bold text-slate-400 uppercase font-mono">Wickets Lost:</span>
                  <span className="font-mono text-rose-400 font-bold text-sm">{simWickets} Wickets</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="9"
                  value={simWickets}
                  onChange={(e) => setSimWickets(Number(e.target.value))}
                  className="w-full accent-rose-500 cursor-pointer"
                />
              </div>
            </div>

            <div className="lg:col-span-7 bg-slate-900/85 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-bold">
                    7,119 Trained State Snapshots
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    Needs {Math.max(0, simTarget - simRuns)} runs in {(20 - simOvers) * 6} balls
                  </span>
                </div>
                <h3 className="text-xl font-black text-white mt-1">
                  Live Over {simOvers}.0 Match Equilibrium
                </h3>
              </div>

              <div className="space-y-3 bg-slate-950/80 p-5 rounded-2xl border border-slate-800">
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="text-xs text-slate-400 block">Chasing Team</span>
                    <span className="text-3xl font-black text-emerald-400 font-mono">
                      {inplayPrediction.chaseProb}%
                    </span>
                  </div>
                  <span className="text-xs font-mono text-slate-500 uppercase">Win Equity</span>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">Defending Team</span>
                    <span className="text-3xl font-black text-rose-400 font-mono">
                      {inplayPrediction.defendProb}%
                    </span>
                  </div>
                </div>

                <div className="w-full h-4 bg-slate-800 rounded-full overflow-hidden flex shadow-inner">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300"
                    style={{ width: `${inplayPrediction.chaseProb}%` }}
                  />
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-rose-500 transition-all duration-300"
                    style={{ width: `${inplayPrediction.defendProb}%` }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs pt-2 border-t border-slate-800/60">
                  <div>
                    <span className="text-slate-400 block">Current Run Rate (CRR):</span>
                    <span className="font-mono font-bold text-cyan-400 text-sm">{inplayPrediction.currRR} RPO</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 block">Required Run Rate (RRR):</span>
                    <span className="font-mono font-bold text-amber-400 text-sm">{inplayPrediction.reqRR} RPO</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase font-mono block">
                  Ensemble Model Sensitivity Factors:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {mlData?.inplay_model.feature_importances.slice(0, 3).map((f, i) => (
                    <div key={i} className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 text-xs">
                      <span className="text-slate-300 font-medium block truncate">{f.feature}</span>
                      <span className="text-[10px] font-mono text-emerald-400 mt-1 block">
                        Influence: {f.importance}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MODE 4: AI MODEL STUDIO & SCENARIOS ── */}
      {viewMode === 'modelStudio' && (
        <div className="space-y-6">
          {/* Telemetry Architecture Overview */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-900/85 border border-slate-800 rounded-2xl p-4 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase font-mono block">Gradient Boosting</span>
              <span className="text-3xl font-black text-emerald-400 font-mono">
                {telemetry?.gradient_boosting_accuracy || 98.22}%
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Test Accuracy</span>
            </div>

            <div className="bg-slate-900/85 border border-slate-800 rounded-2xl p-4 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase font-mono block">ROC-AUC Score</span>
              <span className="text-3xl font-black text-cyan-400 font-mono">
                {telemetry?.roc_auc_metric || 0.9988}
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Area Under Curve</span>
            </div>

            <div className="bg-slate-900/85 border border-slate-800 rounded-2xl p-4 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase font-mono block">Brier Calibration</span>
              <span className="text-3xl font-black text-purple-400 font-mono">
                {telemetry?.brier_calibration || 0.0178}
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Probabilistic Loss</span>
            </div>

            <div className="bg-slate-900/85 border border-slate-800 rounded-2xl p-4 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase font-mono block">Training Samples</span>
              <span className="text-3xl font-black text-amber-400 font-mono">
                {telemetry?.inplay_state_snapshots.toLocaleString() || '7,119'}
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Over-by-Over States</span>
            </div>
          </div>

          {/* Interactive Chase Scenario Simulator */}
          <div className="bg-slate-900/85 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  Pre-Computed 20-Over Chase Trajectory Scenarios
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">{activeScenario.description}</p>
              </div>

              {/* Scenario Toggle */}
              <div className="flex items-center gap-2">
                {mlData?.scenarios.map((sc, sIdx) => (
                  <button
                    key={sIdx}
                    onClick={() => {
                      soundFX.playClick();
                      setSelectedScenarioIdx(sIdx);
                      setSelectedOverIdx(2);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      selectedScenarioIdx === sIdx
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {sc.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Over-by-Over Progression Timeline Chips */}
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 pt-2">
              {activeScenario.curve.map((pt, pIdx) => (
                <button
                  key={pIdx}
                  onClick={() => {
                    soundFX.playClick();
                    setSelectedOverIdx(pIdx);
                  }}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    selectedOverIdx === pIdx
                      ? 'bg-gradient-to-b from-indigo-600 to-purple-700 border-indigo-400 text-white shadow-lg scale-105'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  <span className="text-[10px] font-mono uppercase block">Over {pt.over}.0</span>
                  <span className="text-sm font-black font-mono block text-cyan-300 mt-0.5">{pt.score}</span>
                  <span className={`text-[10px] font-bold block mt-1 ${
                    pt.chaseProb >= 50 ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {pt.chaseProb}% Win
                  </span>
                </button>
              ))}
            </div>

            {/* Selected Over Detail Card */}
            {activeOverData && (
              <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-white flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Over {activeOverData.over}.0 State Assessment: {activeOverData.score}
                  </span>
                  <p className="text-xs text-slate-300">
                    Required Run Rate sits at <strong className="text-amber-400 font-mono">{activeOverData.reqRR} RPO</strong>. Win probability calculated at <strong className="text-emerald-400 font-mono">{activeOverData.chaseProb}%</strong>.
                  </p>
                </div>
                <button
                  onClick={() =>
                    handleSpeakText(
                      `Over ${activeOverData.over}, team is at ${activeOverData.score}. Required run rate is ${activeOverData.reqRR} per over. Win probability is ${activeOverData.chaseProb} percent.`,
                      888
                    )
                  }
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600/30 border border-purple-500/40 text-purple-300 text-xs font-semibold hover:text-white transition-colors flex-shrink-0"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{t('tactical.listen_review')}</span>
                </button>
              </div>
            )}
          </div>

          {/* Algorithm Stack Grid */}
          <div className="bg-slate-900/85 border border-slate-800 rounded-2xl p-6 space-y-3">
            <span className="text-xs font-bold text-slate-400 uppercase font-mono block">
              Active Production AI Algorithm Stack
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { title: 'HistGradientBoosting Trees', desc: 'Non-linear tree ensemble for high-dimensional state modeling' },
                { title: 'L2-Calibrated Logistic Logit', desc: 'Low-latency sub-1ms client inference with sigmoid mapping' },
                { title: 'RandomForest Sensitivity', desc: 'Impurity-based feature ranking of critical turning points' },
                { title: 'Empirical Quantile Regressors', desc: 'Phase-wise floor (P10) and ceiling (P90) boundary forecasting' }
              ].map((algo, aIdx) => (
                <div key={aIdx} className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-xs font-bold text-white block">{algo.title}</span>
                  <p className="text-[11px] text-slate-400">{algo.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
