import React from 'react';
import { Bolt, Verified, Share2, Award, BookOpen, Star, Headphones, Flame, LogOut } from 'lucide-react';

interface UserProfileProps {
  user: {
    name: string;
    handle: string;
    sparks: number;
  };
  onLogout: () => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ user, onLogout }) => {
  return (
    <div className="space-y-6">
      {/* Dynamic Ambient Banner Card */}
      <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl border border-slate-800 bg-[#1d182f]">
        {/* Banner Graphic Backdrop */}
        <div className="relative h-48 w-full bg-gradient-to-r from-purple-900 via-pink-900 to-indigo-950 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1200&q=80"
            alt="Cyber Banner"
            className="w-full h-full object-cover opacity-60 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#151026] via-transparent to-black/30" />

          {/* Floating Sparks Balance Pill */}
          <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#100b21]/80 backdrop-blur-md border border-cyan-500/30 text-cyan-300 shadow-lg">
            <Bolt className="w-4 h-4 fill-cyan-400 text-cyan-400 animate-pulse" />
            <span className="font-extrabold text-sm text-white font-mono">{user.sparks.toLocaleString()}</span>
            <span className="text-xs text-cyan-400">Sparks</span>
          </div>

          <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#100b21]/80 backdrop-blur-md border border-pink-500/30 text-pink-300 text-xs">
            <span className="w-2 h-2 rounded-full bg-pink-400 animate-ping" />
            <span className="font-mono uppercase text-[10px] font-bold">Synapse Connected</span>
          </div>
        </div>

        {/* Profile Details & Avatar Strip */}
        <div className="relative px-6 pb-6 pt-2 flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4 -mt-16 z-10">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <div className="relative">
              <div className="w-28 h-28 rounded-full p-1 bg-gradient-to-tr from-cyan-400 via-purple-500 to-pink-500 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
                  alt={user.name}
                  className="w-full h-full object-cover rounded-full bg-[#100b21]"
                />
              </div>
              <div className="absolute bottom-1 right-1 w-7 h-7 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-lg border-2 border-[#151026]">
                <Verified className="w-4 h-4" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h2 className="text-2xl font-extrabold text-white">{user.name}</h2>
                <span className="text-xs text-cyan-400 font-mono">{user.handle}</span>
              </div>
              <p className="text-xs text-purple-300 font-semibold mt-0.5">
                Senior Lore Architect & Multiverse Director
              </p>
              <p className="text-xs text-slate-400 max-w-md mt-1 leading-relaxed">
                Architecting alternate timeline branches across the Obsidian Nebula. Multimodal prompt synthesist & neural audio worldbuilder.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold shadow-lg shadow-purple-600/30 hover:opacity-95 active:scale-95 transition-transform">
              <BookOpen className="w-3.5 h-3.5" />
              <span>New Chapter</span>
            </button>
            <button className="p-2 rounded-full bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors">
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-red-950/60 text-red-300 hover:bg-red-900/60 text-xs font-semibold border border-red-800/60 transition-colors"
              title="Logout session"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Lore Stat Matrix */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#1d182f] border border-slate-800 rounded-2xl p-4 shadow-xl text-center">
        <div className="p-2">
          <span className="text-2xl font-extrabold text-white block">14.2K</span>
          <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Followers</span>
        </div>
        <div className="p-2">
          <span className="text-2xl font-extrabold text-purple-400 block">38</span>
          <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Active Stories</span>
        </div>
        <div className="p-2">
          <span className="text-2xl font-extrabold text-pink-400 block">2.4M</span>
          <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Fan Reads</span>
        </div>
        <div className="p-2">
          <span className="text-2xl font-extrabold text-cyan-400 block">99.4%</span>
          <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Canon Coherence</span>
        </div>
      </div>

      {/* Badges & Accolades Strip */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-cyan-400" />
            Badges & Multiverse Accolades
          </h3>
          <span className="text-xs font-mono text-purple-400">Level 18 Director</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl bg-[#211c33] border border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
              <Star className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block leading-tight">AI Master Promptsmith</span>
              <span className="text-[10px] text-slate-400">Top 0.5% Accuracy</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#211c33] border border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block leading-tight">Canon Pioneer 2026</span>
              <span className="text-[10px] text-slate-400">Council Voted</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#211c33] border border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-pink-500/20 text-pink-400 flex items-center justify-center shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block leading-tight">Audio Dramatist</span>
              <span className="text-[10px] text-slate-400">400k Listeners</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#211c33] border border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block leading-tight">100-Day Streak</span>
              <span className="text-[10px] text-slate-400">Unbroken Synapse</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pinned Showcase Universe Card */}
      <div className="bg-[#1d182f] border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase text-pink-400 font-mono tracking-wider">
            Pinned Multiverse Showcase • Vol. 2
          </span>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono">
            94% Coherence
          </span>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="w-full md:w-48 h-28 rounded-xl overflow-hidden bg-black shrink-0">
            <img
              src="https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=600&q=80"
              alt="Universe Arc"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 space-y-1">
            <h4 className="text-base font-bold text-white">The Obsidian Horizon — Vol. 2: The Quantum Singularity</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              The singularity gate has breached sector 7. Commander Vane races against corrupted AI overseers to restore the core nexus before timeline unraveling occurs across ICC tournament zones.
            </p>
            <div className="flex items-center gap-3 pt-2 text-xs text-slate-400">
              <span className="text-purple-300 font-semibold">142 Forks Active</span>
              <span>•</span>
              <span className="text-cyan-400">Full Voiceover Enabled</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
