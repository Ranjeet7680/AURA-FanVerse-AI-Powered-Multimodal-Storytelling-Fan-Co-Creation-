import React, { useState } from 'react';
import { Send, Sparkles, Target, Compass, HelpCircle, Activity, ChevronRight } from 'lucide-react';
import { MOCK_TACTICAL_QUERIES, type TacticalQuery } from '../data/mockMatchData';

export const TacticalCoPilot: React.FC = () => {
  const [selectedQuery, setSelectedQuery] = useState<TacticalQuery>(MOCK_TACTICAL_QUERIES[0]);
  const [customInput, setCustomInput] = useState<string>('');
  const [chatLog, setChatLog] = useState<{ role: 'user' | 'assistant'; text: string; query?: TacticalQuery }[]>([
    {
      role: 'assistant',
      text: "Hello! I am your AURA Tactical Co-Pilot. Ask me any tactical question regarding field setups, bowling matchups, or win probability shifts in today's match."
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

  const handleSelectPreset = (query: TacticalQuery) => {
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

    const userText = customInput;
    setCustomInput('');

    // Simulate AI Tactical Reasoning response
    setChatLog((prev) => [...prev, { role: 'user', text: userText }]);

    setTimeout(() => {
      setChatLog((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: `Tactical telemetry analysis for "${userText}": Based on Dubai Stadium's dimensions (68m boundary on the western flank) and the current over-rate, shifting fielders into deep mid-wicket minimizes the 6-run probability by 18.2%.`,
          query: selectedQuery
        }
      ]);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-slate-900 border border-indigo-500/20 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Compass className="w-4 h-4" />
            <span>Interactive Match Companion</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Tactical Co-Pilot & 2D Field Radar
          </h2>
          <p className="text-sm text-slate-300 max-w-2xl mt-1">
            Real-time conversational AI grounded in live ICC ball telemetry, field coordinates, and situational win probability models.
          </p>
        </div>
        <div className="flex items-center space-x-2 bg-indigo-500/10 border border-indigo-400/20 px-3 py-1.5 rounded-xl text-xs text-indigo-300">
          <Activity className="w-4 h-4 text-indigo-400 animate-pulse" />
          <span>Telemetry Sync: Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Interactive 2D Cricket Oval & Field Placement Map */}
        <div className="lg:col-span-6 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Target className="w-4 h-4 text-purple-400" />
                Dynamic Field Placement Visualizer
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Bowler: <span className="text-purple-300 font-semibold">{selectedQuery.bowler}</span> vs{' '}
                <span className="text-pink-300 font-semibold">{selectedQuery.batter}</span>
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              {selectedQuery.fieldFocus}
            </span>
          </div>

          {/* Simulated 2D Cricket Oval */}
          <div className="relative w-full aspect-square max-w-[420px] mx-auto rounded-full bg-emerald-950/40 border-2 border-dashed border-emerald-500/30 flex items-center justify-center p-4 overflow-hidden shadow-inner">
            {/* 30-Yard Inner Circle */}
            <div className="absolute w-[65%] h-[65%] rounded-full border border-emerald-400/40 bg-emerald-900/20 pointer-events-none flex items-center justify-center">
              <span className="text-[10px] text-emerald-400/60 font-mono -mt-24">30-Yd Circle</span>
            </div>

            {/* Central Pitch Strip */}
            <div className="absolute w-10 h-32 bg-amber-900/40 border border-amber-500/30 rounded flex flex-col justify-between items-center py-1.5 z-0">
              <div className="w-6 h-1 bg-white/70 rounded-full" />
              <span className="text-[9px] text-amber-300 font-mono rotate-90">PITCH</span>
              <div className="w-6 h-1 bg-white/70 rounded-full" />
            </div>

            {/* Fielders Placement Nodes */}
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
                {/* Tooltip on hover */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-slate-900 text-white text-[10px] py-1 px-2 rounded shadow-lg border border-slate-700 whitespace-nowrap z-20 font-medium">
                  {pos.name} ({pos.role})
                </div>
              </div>
            ))}

            {/* Compass Directions */}
            <span className="absolute top-2 text-[10px] font-bold text-slate-500">OFF SIDE</span>
            <span className="absolute bottom-2 text-[10px] font-bold text-slate-500">LEG SIDE</span>
          </div>

          {/* Win Probability Delta Strip */}
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

        {/* Right: Conversational Tactical Chat & Prompt Presets */}
        <div className="lg:col-span-6 flex flex-col h-[560px] bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden">
          {/* Preset Questions Chips */}
          <div className="p-4 border-b border-slate-800 bg-slate-950/40">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 mb-2">
              <HelpCircle className="w-3.5 h-3.5 text-purple-400" />
              Tactical Prompts Asked By Fans:
            </span>
            <div className="flex flex-col gap-2">
              {MOCK_TACTICAL_QUERIES.map((q) => (
                <button
                  key={q.id}
                  onClick={() => handleSelectPreset(q)}
                  className="text-left text-xs text-slate-300 hover:text-white bg-slate-800/50 hover:bg-slate-800 p-2 rounded-lg border border-slate-700/50 flex items-center justify-between transition-colors group"
                >
                  <span className="truncate">{q.question}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-purple-400 flex-shrink-0" />
                </button>
              ))}
            </div>
          </div>

          {/* Chat Messages Log */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {chatLog.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-slate-800 text-slate-200 border border-slate-700/70 shadow-sm'
                  }`}
                >
                  {msg.role === 'assistant' && (
                    <div className="flex items-center gap-1.5 text-purple-400 font-semibold mb-1 text-[11px]">
                      <Sparkles className="w-3 h-3" />
                      <span>AURA Tactical Intelligence</span>
                    </div>
                  )}
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Chat Input */}
          <form onSubmit={handleSendCustom} className="p-3 border-t border-slate-800 bg-slate-950/60 flex items-center gap-2">
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="Ask a tactical question (e.g. why did the captain set a deep slip?)..."
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
            <button
              type="submit"
              className="bg-purple-600 hover:bg-purple-500 text-white p-2 rounded-xl transition-colors shadow-md shadow-purple-600/30"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
