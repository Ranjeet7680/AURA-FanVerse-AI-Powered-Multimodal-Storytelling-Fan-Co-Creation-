import React from 'react';
import { Sparkles, Users, ArrowRight, ShieldCheck, Heart } from 'lucide-react';

interface WelcomeLandingProps {
  onEnterDashboard: () => void;
  onOpenAuth: () => void;
}

export const WelcomeLanding: React.FC<WelcomeLandingProps> = ({ onEnterDashboard, onOpenAuth }) => {
  return (
    <div className="space-y-10 pb-12">
      {/* Top Hero Section */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-[#1d182f] via-[#151026] to-[#100b21] p-6 sm:p-10 border border-purple-500/20 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2c273e]/80 border border-cyan-500/30 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-xs font-extrabold text-cyan-300 uppercase tracking-widest font-mono">
              GENESIS V2.4 CANON PROTOCOL
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Co-Create <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">Infinite Canon</span> With AI & Your Fandom
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            Step into an ethereal collaborative realm where live cricket broadcast telemetry ignites autonomous vertical micro-stories, 3D stadium physics, and conversational tactical co-piloting.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-4">
            <button
              onClick={onEnterDashboard}
              className="px-6 py-3.5 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-purple-600/25 active:scale-95 transition-all flex items-center gap-2 hover:opacity-95"
            >
              <span>Explore Main Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenAuth}
              className="px-6 py-3.5 rounded-full bg-[#211c33] hover:bg-[#2c273e] text-slate-200 font-bold text-xs sm:text-sm border border-slate-700 shadow-md transition-all active:scale-95"
            >
              Sign In / Lorekeeper Access
            </button>
          </div>
        </div>
      </div>

      {/* Pillars of Creation (Feature Grid) */}
      <div className="space-y-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 font-mono">
            Pillars of Creation
          </span>
          <h2 className="text-2xl font-bold text-white mt-1">Multi-Threaded AI Architecture</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-6 rounded-2xl bg-[#1d182f] border border-slate-800 shadow-xl space-y-3 flex flex-col justify-between">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Multimodal Story Engine</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Text, voice commentary, vertical video reframing & live HUD telemetry synthesized synchronously in under 45 seconds.
              </p>
            </div>
            <span className="text-[11px] font-bold text-purple-300 font-mono">Sub-45s Latency</span>
          </div>

          <div className="p-6 rounded-2xl bg-[#1d182f] border border-slate-800 shadow-xl space-y-3 flex flex-col justify-between">
            <div className="w-12 h-12 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Collaborative Tactical Co-Pilot</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Demystifies captaincy field placements with conversational AI, dynamic 2D field radar, and 3D WebGL physics.
              </p>
            </div>
            <span className="text-[11px] font-bold text-pink-300 font-mono">Real-Time Coordinate Radar</span>
          </div>

          <div className="p-6 rounded-2xl bg-[#1d182f] border border-slate-800 shadow-xl space-y-3 flex flex-col justify-between">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Grassroots Future Stars Fund</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Fans pledge micro-tokens to female athletes with 15% ring-fenced to provide kits and travel for associate nation academies.
              </p>
            </div>
            <span className="text-[11px] font-bold text-cyan-300 font-mono">Direct Athlete Passports</span>
          </div>
        </div>
      </div>

      {/* Community Stats Bar */}
      <div className="p-5 rounded-2xl bg-[#1d182f] border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            <div className="w-9 h-9 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-xs">K</div>
            <div className="w-9 h-9 rounded-full bg-pink-600 flex items-center justify-center text-white font-bold text-xs">M</div>
            <div className="w-9 h-9 rounded-full bg-cyan-600 flex items-center justify-center text-white font-bold text-xs">Z</div>
          </div>
          <div>
            <span className="text-xs font-bold text-white block">140K+ Fan Co-Creators</span>
            <span className="text-[11px] text-slate-400">Active across 850+ canonical sporting arcs</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 bg-cyan-500/10 px-3 py-1.5 rounded-full border border-cyan-500/20">
          <ShieldCheck className="w-4 h-4" />
          <span>Verified ICC Canon Ledger</span>
        </div>
      </div>
    </div>
  );
};
