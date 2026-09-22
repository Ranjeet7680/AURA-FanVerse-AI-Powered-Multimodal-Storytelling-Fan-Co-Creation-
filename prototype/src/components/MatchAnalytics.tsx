import React, { useState, useEffect, useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import {
  TrendingUp,
  BarChart3,
  PieChart as PieIcon,
  Cpu,
  Users,
  Search,
  CheckCircle2,
  Sliders,
  Calendar,
  Award
} from 'lucide-react';
import { LIVE_OVER_METRICS } from '../data/mockMatchData';
import { soundFX } from '../services/soundFX';

interface MLModelData {
  model_version: string;
  trained_samples: number;
  accuracy: number;
  win_model: {
    coefficients: number[];
    intercept: number;
    scaler_mean: number[];
    scaler_std: number[];
    feature_importances: Array<{
      feature: string;
      weight: number;
      impact: string;
      magnitude: number;
    }>;
  };
  score_model: {
    coefficients: number[];
    intercept: number;
    features: string[];
  };
  team_ratings: Record<string, {
    power: number;
    matches: number;
    win_rate: number;
    batting_rr: number;
    bowling_rr: number;
    nrr: number;
  }>;
  venue_averages: Record<string, {
    matches: number;
    avg_score: number;
    bat_first_win_pct: number;
  }>;
}

interface Player {
  name: string;
  country: string;
  role: string;
  image: string;
  batting_style: string;
  bowling_style: string;
  total_runs: number;
  total_wickets: number;
  t20_runs: number;
  t20_wickets: number;
  odi_runs: number;
  odi_wickets: number;
  test_runs: number;
  test_wickets: number;
  odi_avg: number;
  t20_sr: number;
  bowling_econ: number;
  impact_score: number;
}

interface RecentMatch {
  id: string;
  date: string;
  teams: string[];
  gender: string;
  format: string;
  event: string;
  venue: string;
  city: string;
  toss: string;
  winner: string;
  margin: string;
  player_of_match: string;
  inns1: { team: string; runs: number; wickets: number; overs: number };
  inns2: { team: string; runs: number; wickets: number; overs: number };
}

export const MatchAnalytics: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'mlPredictor' | 'liveTelemetry' | 'playerDatabase' | 'matchExplorer'>('mlPredictor');

  // ML Data State
  const [mlData, setMlData] = useState<MLModelData | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [matches, setMatches] = useState<RecentMatch[]>([]);

  // ML Predictor Interactive Form State
  const [team1, setTeam1] = useState<string>('India');
  const [team2, setTeam2] = useState<string>('Australia');
  const [format, setFormat] = useState<'T20' | 'ODI' | 'Test'>('T20');
  const [tossWinner, setTossWinner] = useState<'team1' | 'team2'>('team1');
  const [tossDecision, setTossDecision] = useState<'bat' | 'field'>('bat');
  const [inns1Runs, setInns1Runs] = useState<number>(178);
  const [gender, setGender] = useState<'male' | 'female'>('male');

  // Player search & filter
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [countryFilter, setCountryFilter] = useState<string>('all');

  // Match filter
  const [matchGenderFilter, setMatchGenderFilter] = useState<'all' | 'female' | 'male'>('all');
  const [matchFormatFilter, setMatchFormatFilter] = useState<'all' | 'T20' | 'ODI' | 'MDM'>('all');

  // Load JSON Artifacts
  useEffect(() => {
    async function loadData() {
      try {
        const [mlRes, playersRes, matchesRes] = await Promise.all([
          fetch('/data/ml_models.json'),
          fetch('/data/players_top.json'),
          fetch('/data/recent_matches.json')
        ]);
        if (mlRes.ok) setMlData(await mlRes.json());
        if (playersRes.ok) setPlayers(await playersRes.json());
        if (matchesRes.ok) setMatches(await matchesRes.json());
      } catch (err) {
        console.error('Error loading cricket ML datasets:', err);
      }
    }
    loadData();
  }, []);

  // Compute ML Win Probability dynamically
  const prediction = useMemo(() => {
    if (!mlData) return { team1Prob: 50, team2Prob: 50, projectedScore: 165 };

    const t1Stats = mlData.team_ratings[team1] || { power: 75 };
    const t2Stats = mlData.team_ratings[team2] || { power: 75 };
    const powerDiff = t1Stats.power - t2Stats.power;

    const t1TossWin = tossWinner === 'team1' ? 1.0 : 0.0;
    const tossBat = tossDecision === 'bat' ? 1.0 : 0.0;
    const isT20 = format === 'T20' ? 1.0 : 0.0;
    const isODI = format === 'ODI' ? 1.0 : 0.0;
    const isFemale = gender === 'female' ? 1.0 : 0.0;
    const inns1RRDiff = (inns1Runs / (format === 'T20' ? 20 : 50)) - 7.5;

    const rawFeatures = [powerDiff, t1TossWin, tossBat, isT20, isODI, isFemale, inns1RRDiff];
    const { scaler_mean, scaler_std, coefficients, intercept } = mlData.win_model;

    let logit = intercept;
    for (let i = 0; i < rawFeatures.length; i++) {
      const scaled = (rawFeatures[i] - scaler_mean[i]) / scaler_std[i];
      logit += scaled * coefficients[i];
    }

    // Sigmoid function
    const prob = 1 / (1 + Math.exp(-logit));
    const team1Prob = Math.min(96, Math.max(4, Math.round(prob * 100)));
    const team2Prob = 100 - team1Prob;

    // Projected 1st innings score from Ridge model
    const { coefficients: sCoefs, intercept: sIntercept } = mlData.score_model;
    const projScore = Math.round(
      sIntercept +
      (t1Stats.power * sCoefs[0]) +
      (isT20 * sCoefs[1]) +
      (isODI * sCoefs[2]) +
      (isFemale * sCoefs[3]) +
      (tossBat * sCoefs[4])
    );

    return { team1Prob, team2Prob, projectedScore: Math.max(120, projScore) };
  }, [mlData, team1, team2, format, tossWinner, tossDecision, inns1Runs, gender]);

  // Filtered Players
  const filteredPlayers = useMemo(() => {
    return players.filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.country.toLowerCase().includes(searchQuery.toLowerCase());
      const matchRole = roleFilter === 'all' || p.role.toLowerCase() === roleFilter.toLowerCase();
      const matchCountry = countryFilter === 'all' || p.country.toLowerCase() === countryFilter.toLowerCase();
      return matchSearch && matchRole && matchCountry;
    });
  }, [players, searchQuery, roleFilter, countryFilter]);

  // Filtered Matches
  const filteredMatches = useMemo(() => {
    return matches.filter((m) => {
      const matchGender = matchGenderFilter === 'all' || m.gender === matchGenderFilter;
      const matchFormat = matchFormatFilter === 'all' || m.format.includes(matchFormatFilter);
      return matchGender && matchFormat;
    });
  }, [matches, matchGenderFilter, matchFormatFilter]);

  // Unique countries for filter
  const uniqueCountries = useMemo(() => {
    const set = new Set(players.map((p) => p.country).filter(Boolean));
    return Array.from(set).sort();
  }, [players]);

  const teamList = useMemo(() => {
    if (!mlData) return ['India', 'Australia', 'England', 'Pakistan', 'South Africa', 'New Zealand'];
    return Object.keys(mlData.team_ratings).sort();
  }, [mlData]);

  const radarData = [
    { metric: 'Powerplay Strike', IND: 142, AUS: 128 },
    { metric: 'Dot Ball % (Bowling)', IND: 48, AUS: 42 },
    { metric: 'Boundary Frequency', IND: 18.5, AUS: 16.2 },
    { metric: 'Spin Control', IND: 84, AUS: 72 },
    { metric: 'Death Overs Economy', IND: 7.8, AUS: 9.1 },
    { metric: 'Catch Conversion %', IND: 92, AUS: 88 }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950/40 via-purple-950/30 to-slate-900 border border-emerald-500/20 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <TrendingUp className="w-4 h-4" />
            <span>AI Predictive Analytics • 1,761 Match Cricsheet Dataset</span>
            <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-400 rounded-full text-[10px] font-bold">ML v4.9</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Cricket Match Radar & Machine Learning Hub
          </h2>
          <p className="text-sm text-slate-300 max-w-2xl mt-1">
            Trained on 1,761 professional matches and 90,308 player profiles with 83.05% predictive accuracy across international and league formats.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center space-x-1.5 bg-slate-900 p-1.5 rounded-2xl border border-slate-800 flex-wrap">
          {[
            { key: 'mlPredictor' as const, label: 'ML Win Predictor', icon: Cpu },
            { key: 'playerDatabase' as const, label: 'Top Players (400)', icon: Users },
            { key: 'matchExplorer' as const, label: 'Recent Matches', icon: Calendar },
            { key: 'liveTelemetry' as const, label: 'Live Charts', icon: BarChart3 },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => {
                  soundFX.playClick();
                  setActiveTab(tab.key);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === tab.key
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
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

      {/* ── TAB 1: INTERACTIVE ML MATCH WIN PREDICTOR ── */}
      {activeTab === 'mlPredictor' && (
        <div className="space-y-6">
          {/* Main Predictor Deck */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Input Controls */}
            <div className="lg:col-span-5 bg-slate-900/85 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-emerald-400" />
                  Match Simulation Parameters
                </h3>
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded-full border border-cyan-800">
                  83.05% Accuracy
                </span>
              </div>

              {/* Team 1 vs Team 2 */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase font-mono block mb-1">Team 1</label>
                  <select
                    value={team1}
                    onChange={(e) => setTeam1(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-semibold focus:outline-none focus:border-emerald-500"
                  >
                    {teamList.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase font-mono block mb-1">Team 2</label>
                  <select
                    value={team2}
                    onChange={(e) => setTeam2(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-semibold focus:outline-none focus:border-emerald-500"
                  >
                    {teamList.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Format & Competition Type */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase font-mono block mb-1">Format</label>
                  <div className="flex rounded-xl bg-slate-950 border border-slate-700 p-1">
                    {(['T20', 'ODI', 'Test'] as const).map((f) => (
                      <button
                        key={f}
                        onClick={() => setFormat(f)}
                        className={`flex-1 py-1 rounded-lg text-xs font-bold transition-all ${
                          format === f ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400'
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase font-mono block mb-1">Gender</label>
                  <div className="flex rounded-xl bg-slate-950 border border-slate-700 p-1">
                    {(['male', 'female'] as const).map((g) => (
                      <button
                        key={g}
                        onClick={() => setGender(g)}
                        className={`flex-1 py-1 rounded-lg text-xs font-bold capitalize transition-all ${
                          gender === g ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Toss Winner & Decision */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase font-mono block mb-1">Toss Winner</label>
                  <select
                    value={tossWinner}
                    onChange={(e) => setTossWinner(e.target.value as 'team1' | 'team2')}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-semibold focus:outline-none"
                  >
                    <option value="team1">{team1}</option>
                    <option value="team2">{team2}</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase font-mono block mb-1">Decision</label>
                  <select
                    value={tossDecision}
                    onChange={(e) => setTossDecision(e.target.value as 'bat' | 'field')}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-semibold focus:outline-none"
                  >
                    <option value="bat">Elected to Bat</option>
                    <option value="field">Elected to Field</option>
                  </select>
                </div>
              </div>

              {/* 1st Innings Runs Slider */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-bold text-slate-400 uppercase font-mono">1st Innings Runs:</span>
                  <span className="font-mono text-emerald-400 font-bold text-sm">{inns1Runs} Runs</span>
                </div>
                <input
                  type="range"
                  min="80"
                  max="350"
                  value={inns1Runs}
                  onChange={(e) => setInns1Runs(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-0.5">
                  <span>80 (Defendable)</span>
                  <span>180 (Par)</span>
                  <span>350 (Massive)</span>
                </div>
              </div>
            </div>

            {/* Prediction Output & Live Win Gauge */}
            <div className="lg:col-span-7 bg-slate-900/85 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-bold">
                    Real-Time Machine Learning Inference
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Model Converged
                  </span>
                </div>
                <h3 className="text-xl font-black text-white mt-1">
                  {team1} vs {team2}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {format} • {gender === 'female' ? "Women's" : "Men's"} • {tossWinner === 'team1' ? team1 : team2} won toss ({tossDecision})
                </p>
              </div>

              {/* Dynamic Win Probability Dual Gauge */}
              <div className="space-y-3 bg-slate-950/80 p-5 rounded-2xl border border-slate-800">
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="text-xs text-slate-400 block">{team1}</span>
                    <span className="text-3xl font-black text-emerald-400 font-mono">
                      {prediction.team1Prob}%
                    </span>
                  </div>
                  <span className="text-xs font-mono text-slate-500 uppercase">Win Probability</span>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">{team2}</span>
                    <span className="text-3xl font-black text-amber-400 font-mono">
                      {prediction.team2Prob}%
                    </span>
                  </div>
                </div>

                {/* Animated Probability Bar */}
                <div className="w-full h-4 bg-slate-800 rounded-full overflow-hidden flex shadow-inner">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                    style={{ width: `${prediction.team1Prob}%` }}
                  />
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-rose-500 transition-all duration-500"
                    style={{ width: `${prediction.team2Prob}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                  <span>Projected 1st Innings: <strong className="text-white font-mono">{prediction.projectedScore}</strong></span>
                  <span>Predicted Winner: <strong className="text-emerald-400 font-bold">{prediction.team1Prob >= 50 ? team1 : team2}</strong></span>
                </div>
              </div>

              {/* Feature Weights / Model Explanations */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase font-mono block">
                  Top Influencing Feature Weights:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {mlData?.win_model.feature_importances.slice(0, 3).map((f, idx) => (
                    <div key={idx} className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 text-xs">
                      <span className="text-slate-300 font-medium block truncate">{f.feature}</span>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-[10px] font-mono text-emerald-400">Impact: {f.magnitude}x</span>
                        <span className="text-[9px] text-slate-500 uppercase">{f.impact}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: TOP PLAYERS DATABASE (400 PROFILES) ── */}
      {activeTab === 'playerDatabase' && (
        <div className="space-y-4">
          {/* Search & Filter Bar */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by player or country..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none"
              >
                <option value="all">All Roles</option>
                <option value="Batsman">Batsman</option>
                <option value="Bowler">Bowler</option>
                <option value="Allrounder">Allrounder</option>
              </select>

              <select
                value={countryFilter}
                onChange={(e) => setCountryFilter(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none"
              >
                <option value="all">All Countries</option>
                {uniqueCountries.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Players Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredPlayers.slice(0, 32).map((p, idx) => (
              <div
                key={idx}
                className="bg-slate-900/85 border border-slate-800 rounded-2xl p-4 space-y-3 hover:border-emerald-500/40 transition-all group"
              >
                <div className="flex items-center gap-3">
                  {p.image ? (
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-12 h-12 rounded-full object-cover border border-purple-500/30 bg-slate-800"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-600 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
                      {p.name.charAt(0)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-white truncate group-hover:text-emerald-400 transition-colors">
                      {p.name}
                    </h4>
                    <span className="text-[11px] text-slate-400 block truncate">{p.country} • {p.role}</span>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-amber-400 bg-amber-950/50 px-2 py-0.5 rounded-md border border-amber-800/40">
                    {p.impact_score}★
                  </span>
                </div>

                {/* Stats Breakdown */}
                <div className="grid grid-cols-3 gap-1.5 bg-slate-950/60 p-2 rounded-xl text-center text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Runs</span>
                    <span className="font-mono font-bold text-white">{p.total_runs.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Wickets</span>
                    <span className="font-mono font-bold text-white">{p.total_wickets}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">ODI Avg</span>
                    <span className="font-mono font-bold text-cyan-400">{p.odi_avg || '-'}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                  <span>{p.batting_style}</span>
                  <span className="text-purple-400 font-medium">{p.t20_sr ? `SR ${p.t20_sr}` : ''}</span>
                </div>
              </div>
            ))}
          </div>

          {filteredPlayers.length > 32 && (
            <p className="text-center text-xs text-slate-500 py-2">
              Showing 32 of {filteredPlayers.length} players. Use filters or search to refine.
            </p>
          )}
        </div>
      )}

      {/* ── TAB 3: RECENT MATCHES EXPLORER ── */}
      {activeTab === 'matchExplorer' && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex items-center justify-between bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex-wrap gap-3">
            <span className="text-xs font-bold text-slate-400 uppercase font-mono">
              Displaying 120 Curated Professional Matches from 1,761 Dataset
            </span>
            <div className="flex items-center gap-2">
              <select
                value={matchGenderFilter}
                onChange={(e) => setMatchGenderFilter(e.target.value as any)}
                className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200"
              >
                <option value="all">All Divisions</option>
                <option value="female">Women's Matches</option>
                <option value="male">Men's Matches</option>
              </select>
              <select
                value={matchFormatFilter}
                onChange={(e) => setMatchFormatFilter(e.target.value as any)}
                className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200"
              >
                <option value="all">All Formats</option>
                <option value="T20">T20 / IT20</option>
                <option value="ODI">ODI / 50-Over</option>
                <option value="MDM">Multi-Day / Test</option>
              </select>
            </div>
          </div>

          {/* Matches Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMatches.slice(0, 24).map((m, idx) => (
              <div
                key={idx}
                className="bg-slate-900/85 border border-slate-800 rounded-2xl p-5 space-y-3 hover:border-cyan-500/40 transition-all"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono text-[10px] font-bold">
                    {m.format} • {m.gender.toUpperCase()}
                  </span>
                  <span className="text-[11px] text-slate-400">{m.date}</span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-white">
                    {m.teams[0]} vs {m.teams[1]}
                  </h4>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">{m.event} • {m.venue}</p>
                </div>

                {/* Inning Scores */}
                <div className="space-y-1 bg-slate-950/60 p-2.5 rounded-xl text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-300">{m.inns1.team}:</span>
                    <span className="font-bold text-white">{m.inns1.runs}/{m.inns1.wickets} ({m.inns1.overs} ov)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">{m.inns2.team}:</span>
                    <span className="font-bold text-white">{m.inns2.runs}/{m.inns2.wickets} ({m.inns2.overs} ov)</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800">
                  <span className="text-emerald-400 font-bold">{m.winner} won</span>
                  <span className="text-slate-400 text-[11px]">{m.margin}</span>
                </div>

                {m.player_of_match && (
                  <div className="flex items-center gap-1.5 text-[11px] text-amber-400 bg-amber-950/30 px-2 py-1 rounded-lg">
                    <Award className="w-3 h-3" />
                    <span>POTM: {m.player_of_match}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 4: ORIGINAL LIVE TELEMETRY CHARTS ── */}
      {activeTab === 'liveTelemetry' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Area Chart Container */}
          <div className="lg:col-span-8 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-emerald-400" />
                  Live Match Trajectory (Over 10 to Over 16)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  IND-W vs AUS-W • Dubai International Stadium
                </p>
              </div>
              <div className="flex items-center space-x-3 text-xs">
                <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> India-W (69%)
                </span>
                <span className="flex items-center gap-1 text-amber-400 font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Australia-W (31%)
                </span>
              </div>
            </div>

            <div className="h-72 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={LIVE_OVER_METRICS}>
                  <defs>
                    <linearGradient id="colorInd" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
                    </linearGradient>
                    <linearGradient id="colorAus" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.6} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                  <XAxis dataKey="over" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} domain={[0, 100]} unit="%" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '0.75rem',
                      fontSize: '12px',
                      color: '#f8fafc'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="indProb"
                    name="India Win Prob %"
                    stroke="#10b981"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorInd)"
                  />
                  <Area
                    type="monotone"
                    dataKey="ausProb"
                    name="Australia Win Prob %"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    fillOpacity={0.5}
                    fill="url(#colorAus)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Radar Comparison Chart */}
          <div className="lg:col-span-4 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4 flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-purple-400" />
                Tactical Balance Radar
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Head-to-head metric efficiency today
              </p>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                  <PolarGrid stroke="#334155" />
                  <PolarAngleAxis dataKey="metric" stroke="#94a3b8" fontSize={10} />
                  <PolarRadiusAxis angle={30} domain={[0, 150]} stroke="#475569" fontSize={9} />
                  <Radar name="IND-W" dataKey="IND" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.5} />
                  <Radar name="AUS-W" dataKey="AUS" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.3} />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
