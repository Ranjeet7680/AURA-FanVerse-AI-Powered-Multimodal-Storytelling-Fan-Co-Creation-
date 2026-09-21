import React, { useEffect, useState } from 'react';
import { Loader2, Bolt, BookOpen, Mic, Palette } from 'lucide-react';

interface WelcomeLoadingProps {
  onComplete: () => void;
}

export const WelcomeLoading: React.FC<WelcomeLoadingProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState<number>(84);
  const [statusText, setStatusText] = useState<string>('Synthesizing Multiverse Neural Weights...');
  const [countdown, setCountdown] = useState<number>(2);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setStatusText('Quantum Realm Unlocked! Synapses Ready.');
          return 100;
        }
        if (prev > 92) {
          setStatusText('Synchronizing Fan Resonance Matrix...');
        }
        return prev + 4;
      });
    }, 120);

    const countdownTimer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownTimer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(countdownTimer);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-[#151026] text-white flex flex-col items-center justify-between p-6 select-none overflow-hidden">
      {/* Background Ambient Orbs */}
      <div className="absolute -top-24 -left-20 w-80 h-80 rounded-full bg-purple-600/20 blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-24 w-88 h-88 rounded-full bg-pink-600/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-72 h-72 rounded-full bg-cyan-600/20 blur-3xl pointer-events-none" />

      {/* Top Header Pills */}
      <div className="w-full max-w-md flex items-center justify-between z-10 pt-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1d182f]/80 backdrop-blur-md border border-cyan-500/30">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-[10px] font-extrabold tracking-wider text-cyan-300 uppercase font-mono">
            NODE: NEURAL-09
          </span>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1d182f]/80 backdrop-blur-md border border-pink-500/30">
          <span className="w-1.5 h-1.5 rounded-full bg-pink-400" />
          <span className="text-[10px] font-extrabold uppercase text-pink-300 font-mono">
            v4.8 QUANTUM
          </span>
        </div>
      </div>

      {/* Central Glowing Emblem */}
      <div className="flex flex-col items-center justify-center my-auto z-10 text-center max-w-sm">
        <div className="relative flex items-center justify-center my-6">
          <div className="absolute w-64 h-64 rounded-full bg-gradient-to-tr from-purple-500/30 via-pink-500/25 to-cyan-500/25 blur-2xl animate-pulse" />
          <div className="relative w-44 h-44 rounded-full flex items-center justify-center bg-gradient-to-b from-[#2c273e]/80 to-[#100b21]/90 p-2 shadow-2xl border border-purple-500/30">
            <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center bg-[#100b21] relative p-4">
              {/* SVG Vector Emblem */}
              <svg className="w-28 h-28" viewBox="0 0 120 120" fill="none">
                <defs>
                  <linearGradient id="auraGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#06B6D4" />
                    <stop offset="50%" stopColor="#A855F7" />
                    <stop offset="100%" stopColor="#EC4899" />
                  </linearGradient>
                </defs>
                <circle cx="60" cy="60" r="44" stroke="url(#auraGlow)" strokeWidth="2" opacity="0.4" />
                <path d="M60 22 L86 78 L72 78 L60 52 L48 78 L34 78 Z" fill="url(#auraGlow)" />
                <circle cx="60" cy="40" r="5" fill="#FFFFFF" />
                <path d="M42 66 L78 66" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 mb-2 border border-purple-400/30">
          <span className="text-[10px] font-extrabold tracking-widest uppercase font-mono">GENESIS PROTOCOL</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">
          AURA <span className="text-purple-400">FANVERSE</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1 max-w-xs">
          Multimodal AI-Powered Storytelling & Living Sports Fan Worlds
        </p>
      </div>

      {/* Bottom Loading Progress & Shards */}
      <div className="w-full max-w-md flex flex-col gap-4 z-10 pb-6">
        <div className="w-full rounded-2xl p-4 bg-[#211c33]/80 backdrop-blur-xl border border-slate-800 shadow-xl flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
              <span className="text-slate-200 truncate">{statusText}</span>
            </div>
            <span className="text-cyan-400 font-bold font-mono">{progress}%</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 rounded-full bg-[#100b21] p-0.5 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-1">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              Shard: 1,024 / 1,200
            </span>
            <span>Latency: 14ms</span>
          </div>
        </div>

        {/* Triple Node Status Cards */}
        <div className="grid grid-cols-3 gap-2">
          <div className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-[#1d182f]/80 border border-slate-800 text-center">
            <BookOpen className="w-4 h-4 text-purple-400 mb-1" />
            <span className="text-[11px] text-slate-200 font-semibold truncate w-full">Lore Engine</span>
            <span className="text-[9px] font-extrabold text-cyan-400 font-mono">ONLINE</span>
          </div>
          <div className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-[#1d182f]/80 border border-slate-800 text-center">
            <Mic className="w-4 h-4 text-pink-400 mb-1" />
            <span className="text-[11px] text-slate-200 font-semibold truncate w-full">Voice Synth</span>
            <span className="text-[9px] font-extrabold text-pink-400 font-mono">READY</span>
          </div>
          <div className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-[#1d182f]/80 border border-slate-800 text-center">
            <Palette className="w-4 h-4 text-cyan-400 mb-1" />
            <span className="text-[11px] text-slate-200 font-semibold truncate w-full">Canvas Gen</span>
            <span className="text-[9px] font-extrabold text-purple-400 font-mono animate-pulse">ACTIVE</span>
          </div>
        </div>

        {/* Enter Portal Action Button */}
        <button
          onClick={onComplete}
          className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 text-white font-bold text-sm shadow-xl shadow-purple-600/30 active:scale-95 transition-all flex items-center justify-center gap-2 hover:opacity-95"
        >
          <Bolt className="w-4 h-4 fill-white" />
          <span>ENTER THE MULTIVERSE {countdown > 0 ? `(${countdown}s)` : '→'}</span>
        </button>
      </div>
    </div>
  );
};
