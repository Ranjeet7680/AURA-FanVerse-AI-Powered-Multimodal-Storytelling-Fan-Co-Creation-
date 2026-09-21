import React, { useState } from 'react';
import {
  Send,
  Target,
  Compass,
  Activity,
  ChevronRight,
  Volume2,
  Mic,
  MicOff,
  Bot,
  Lightbulb
} from 'lucide-react';
import { MOCK_TACTICAL_QUERIES, type TacticalQuery } from '../data/mockMatchData';
import { soundFX } from '../services/soundFX';

export const TacticalCoPilot: React.FC = () => {
  const [selectedQuery, setSelectedQuery] = useState<TacticalQuery>(MOCK_TACTICAL_QUERIES[0]);
  const [customInput, setCustomInput] = useState<string>('');
  const [speakingIndex, setSpeakingIndex] = useState<number | null>(null);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [suggestedCategory, setSuggestedCategory] = useState<'All' | 'Captaincy' | 'Spin' | 'Powerplay'>('All');

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
      recognition.lang = 'en-US';

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

    // Simulate AI Tactical Reasoning response
    setChatLog((prev) => [...prev, { role: 'user', text: userText }]);

    setTimeout(() => {
      soundFX.playSuccess();
      setChatLog((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: `Tactical telemetry analysis for "${userText}": Based on Dubai Stadium's dimensions (68m boundary on the western flank) and the current over-rate, shifting fielders into deep mid-wicket minimizes the 6-run probability by 18.2%. Expected win equity shifts by +4.6%.`,
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

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-slate-900 border border-indigo-500/20 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
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
        <div className="lg:col-span-6 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
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
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-mono">
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

        {/* Right: Conversational Tactical Chat & Suggested Questions */}
        <div className="lg:col-span-6 flex flex-col h-[580px] bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          {/* Suggested Questions Header & Category Filter Tabs */}
          <div className="p-4 border-b border-slate-800 bg-slate-950/50 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                <span>AI Suggested Tactical Questions ({filteredQueries.length})</span>
              </span>
              <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded">
                Click to Analyze
              </span>
            </div>

            {/* Category Filter Pills */}
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

            {/* Suggested Question Chips List */}
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

          {/* Chat Messages Log */}
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
                        title="Read out response aloud (Text-to-Speech)"
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

          {/* Bottom Chat Input with Speech Recognition Microphone */}
          <form onSubmit={handleSendCustom} className="p-3 border-t border-slate-800 bg-slate-950/70 flex items-center gap-2">
            <button
              type="button"
              onClick={handleToggleVoiceInput}
              className={`p-2.5 rounded-xl border transition-all ${
                isListening
                  ? 'bg-pink-600 border-pink-500 text-white animate-pulse shadow-lg shadow-pink-600/30'
                  : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white hover:border-slate-600'
              }`}
              title={isListening ? 'Listening... Speak your question' : 'Click to Speak via Microphone'}
            >
              {isListening ? <Mic className="w-4 h-4 text-white" /> : <MicOff className="w-4 h-4" />}
            </button>

            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder={isListening ? 'Listening to your voice...' : 'Ask tactical AI (e.g. why did the captain set a deep slip?)...'}
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
    </div>
  );
};
