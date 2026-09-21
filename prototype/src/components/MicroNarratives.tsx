import React, { useState } from 'react';
import { Play, Pause, Volume2, Share2, Sparkles, Zap, ChevronRight, MessageSquareQuote, TrendingUp } from 'lucide-react';
import { MOCK_REELS, type MicroReel } from '../data/mockMatchData';

interface MicroNarrativesProps {
  selectedLang: string;
}

export const MicroNarratives: React.FC<MicroNarrativesProps> = ({ selectedLang }) => {
  const [selectedReel, setSelectedReel] = useState<MicroReel>(MOCK_REELS[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Speech synthesis simulation for multi-language audio commentary
  const handlePlayVoice = (text: string, lang: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      if (isSpeaking) {
        setIsSpeaking(false);
        return;
      }
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === 'hi' ? 'hi-IN' : lang === 'es' ? 'es-ES' : lang === 'ar' ? 'ar-SA' : lang === 'ta' ? 'ta-IN' : 'en-US';
      utterance.rate = 1.05;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const currentCaption = selectedReel.caption[selectedLang] || selectedReel.caption['en'];

  return (
    <div className="space-y-6">
      {/* Top Banner / Feature Callout */}
      <div className="bg-gradient-to-r from-purple-900/40 via-indigo-900/30 to-slate-900 border border-purple-500/20 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-purple-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Autonomous Multimodal Highlight Pipeline</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Vertical Micro-Narratives & Multi-Language Synthesis
          </h2>
          <p className="text-sm text-slate-300 max-w-2xl mt-1">
            Raw ICC broadcast video converted into 9:16 vertical storytelling reels in under 45 seconds with automated ball telemetry, tactical annotations, and commentary in 12+ languages.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <span className="px-3 py-1.5 rounded-xl bg-purple-500/20 border border-purple-400/30 text-purple-300 text-xs font-medium flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-yellow-400" />
            Edge Ingestion Latency: 38s
          </span>
        </div>
      </div>

      {/* Main Reel Viewer & Feed Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Interactive 9:16 Vertical Reel Player */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative w-full max-w-[340px] aspect-[9/16] rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-800 bg-black flex flex-col justify-between p-4 group">
            {/* Background Thumbnail / Mock Video Frame */}
            <img
              src={selectedReel.videoThumb}
              alt={selectedReel.title}
              className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ${
                isPlaying ? 'scale-105' : 'scale-100'
              }`}
            />
            {/* Subtle Gradient Overlays for Readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/90 pointer-events-none" />

            {/* Top Reel Header */}
            <div className="relative z-10 flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-pink-600/90 text-white shadow-lg backdrop-blur-sm">
                {selectedReel.badge}
              </span>
              <div className="flex items-center space-x-2">
                <span className="text-xs bg-black/60 px-2 py-0.5 rounded-full text-slate-300 backdrop-blur-sm font-mono">
                  {selectedReel.duration}
                </span>
                <button
                  onClick={() => handlePlayVoice(currentCaption, selectedLang)}
                  className={`p-2 rounded-full backdrop-blur-md transition-colors ${
                    isSpeaking ? 'bg-purple-600 text-white animate-bounce' : 'bg-black/60 text-slate-200 hover:bg-black/80'
                  }`}
                  title="Listen to AI commentary in selected language"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Center Play/Pause Toggle Indicator */}
            <div className="relative z-10 flex justify-center items-center my-auto">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center text-white shadow-xl hover:scale-110 transition-transform"
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
              </button>
            </div>

            {/* Bottom Real-time Telemetry & Story Captions */}
            <div className="relative z-10 space-y-3">
              {/* Telemetry Strip Pill */}
              <div className="bg-slate-900/85 backdrop-blur-md rounded-xl p-2.5 border border-slate-700/60 shadow-lg text-xs grid grid-cols-2 gap-2 text-slate-200">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-mono">Exit Velocity</span>
                  <span className="font-bold text-pink-400">{selectedReel.metrics.exitVelocity}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-mono">Launch Angle</span>
                  <span className="font-bold text-indigo-300">{selectedReel.metrics.launchAngle}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-mono">Trajectory</span>
                  <span className="font-bold text-emerald-400">{selectedReel.metrics.distance}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-mono">Win Prob Swing</span>
                  <span className="font-bold text-amber-400 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {selectedReel.metrics.winProbChange}
                  </span>
                </div>
              </div>

              {/* Player Info & Caption */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-base leading-tight drop-shadow-md">
                    {selectedReel.player}
                  </h3>
                  <span className="text-[11px] text-purple-300 font-semibold">{selectedReel.role}</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed bg-black/40 backdrop-blur-sm p-2 rounded-lg border border-white/10">
                  {currentCaption}
                </p>
              </div>

              {/* Social / Co-Creation Strip */}
              <div className="flex items-center justify-between pt-1 text-xs text-slate-300 border-t border-white/10">
                <span className="text-[11px] text-slate-400 font-mono">ICC Telemetry Sync: 100%</span>
                <button className="flex items-center space-x-1 hover:text-pink-400 transition-colors">
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Syndicate 9:16</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Reel Carousel Feed & Tactical Breakdown Card */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <MessageSquareQuote className="w-5 h-5 text-purple-400" />
              Live Match Highlight Feed ({MOCK_REELS.length} generated)
            </h3>
            <span className="text-xs text-slate-400">Auto-synced with Dubai Match Broadcast</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {MOCK_REELS.map((reel) => {
              const isSelected = selectedReel.id === reel.id;
              return (
                <div
                  key={reel.id}
                  onClick={() => setSelectedReel(reel)}
                  className={`cursor-pointer rounded-xl p-3.5 border transition-all duration-200 text-left relative overflow-hidden group ${
                    isSelected
                      ? 'bg-purple-950/40 border-purple-500 shadow-lg shadow-purple-900/20 ring-1 ring-purple-500'
                      : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex space-x-3">
                    <div className="relative w-20 h-28 rounded-lg overflow-hidden flex-shrink-0 bg-slate-800">
                      <img
                        src={reel.videoThumb}
                        alt={reel.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <span className="absolute bottom-1 right-1 text-[10px] bg-black/80 px-1 rounded text-white font-mono">
                        {reel.duration}
                      </span>
                    </div>

                    <div className="flex flex-col justify-between flex-1 min-w-0">
                      <div>
                        <span className="text-[10px] font-semibold text-pink-400 block truncate">
                          {reel.matchContext}
                        </span>
                        <h4 className="font-bold text-sm text-white line-clamp-2 mt-0.5 leading-snug">
                          {reel.title}
                        </h4>
                      </div>

                      <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                        <span className="truncate text-purple-300 font-medium">{reel.player}</span>
                        <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? 'rotate-90 text-purple-400' : 'text-slate-600'}`} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Deep-Dive Tactical Breakdown for selected reel */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3 mt-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-bold tracking-wider text-indigo-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                AI Multimodal Tactical Note
              </span>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Confidence: 96.8%
              </span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              {selectedReel.tacticalInsight}
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="text-xs px-2.5 py-1 bg-slate-800 text-slate-300 rounded-lg border border-slate-700">
                Fielding Strategy: Aggressive Ring
              </span>
              <span className="text-xs px-2.5 py-1 bg-slate-800 text-slate-300 rounded-lg border border-slate-700">
                Pitch Condition: True Bounce
              </span>
              <span className="text-xs px-2.5 py-1 bg-slate-800 text-slate-300 rounded-lg border border-slate-700">
                Shot Execution Score: 9.6/10
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

