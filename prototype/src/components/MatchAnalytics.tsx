import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { TrendingUp, BarChart3, PieChart as PieIcon, ShieldAlert } from 'lucide-react';
import { LIVE_OVER_METRICS, SHOT_SCATTER_DATA } from '../data/mockMatchData';

export const MatchAnalytics: React.FC = () => {
  const [activeMetric, setActiveMetric] = useState<'winProb' | 'runRate'>('winProb');

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
            <span>Interactive Telemetry & Predictive Analytics</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Live Tactical Graphs, Win Curves & Radar Comparison
          </h2>
          <p className="text-sm text-slate-300 max-w-2xl mt-1">
            Deep ball-by-ball machine learning curves modeling win probability swings, phase-wise wagon distribution, and team battle comparisons.
          </p>
        </div>
        <div className="flex items-center space-x-2 bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveMetric('winProb')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeMetric === 'winProb'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Win Probability
          </button>
          <button
            onClick={() => setActiveMetric('runRate')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeMetric === 'runRate'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Run Rate Momentum
          </button>
        </div>
      </div>

      {/* Main Graphs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Chart 1: Dynamic Win Probability Area Graph */}
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

          {/* Area Chart Container */}
          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              {activeMetric === 'winProb' ? (
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
              ) : (
                <BarChart data={LIVE_OVER_METRICS}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                  <XAxis dataKey="over" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '0.75rem',
                      fontSize: '12px'
                    }}
                  />
                  <Bar dataKey="runs" name="Runs Scored" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="runRate" name="Current Run Rate" fill="#ec4899" radius={[6, 6, 0, 0]} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 bg-slate-950/50 p-3 rounded-xl border border-slate-800">
            <span className="flex items-center gap-1.5 text-slate-300">
              <ShieldAlert className="w-3.5 h-3.5 text-purple-400" />
              Turning Point: Over 14.3 (+7.8% Win Swing on Smriti's boundary over extra cover)
            </span>
            <span className="font-mono text-emerald-400">ML Confidence: 94.2%</span>
          </div>
        </div>

        {/* Chart 2: Radar Comparison Chart */}
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

          <div className="text-[11px] text-slate-400 text-center bg-slate-950/40 p-2 rounded-lg">
            India holds advantage in <strong className="text-purple-300">Spin Control (+12%)</strong> and <strong className="text-purple-300">Catch Conversion (+4%)</strong>.
          </div>
        </div>

        {/* Chart 3: Shot Execution & Control Breakdown Bar Chart */}
        <div className="lg:col-span-12 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-pink-400" />
                Shot Control & Scoring Efficiency by Zone
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Breakdown of runs scored vs control percentage
              </p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 font-mono">
              Total Boundaries: 18
            </span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={SHOT_SCATTER_DATA} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
                <XAxis dataKey="shot" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    fontSize: '12px'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="runs" name="Runs Scored" fill="#ec4899" radius={[6, 6, 0, 0]} />
                <Bar dataKey="controlPct" name="Control %" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
