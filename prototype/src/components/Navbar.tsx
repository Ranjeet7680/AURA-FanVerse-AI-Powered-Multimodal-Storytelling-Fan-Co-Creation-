import React from 'react';
import { Sparkles, Activity, Shield, Users, Radio, Globe2, Cpu, Lock } from 'lucide-react';

export type ActiveTabType = 'reels' | 'tactical' | 'analytics' | 'athletes' | 'rl' | 'cybersecurity';

interface NavbarProps {
  activeTab: ActiveTabType;
  setActiveTab: (tab: ActiveTabType) => void;
  selectedLang: string;
  setSelectedLang: (lang: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  selectedLang,
  setSelectedLang,
}) => {
  const languages = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिंदी (Hindi)' },
    { code: 'es', label: 'Español' },
    { code: 'ar', label: 'العربية (Arabic)' },
    { code: 'ta', label: 'தமிழ் (Tamil)' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Tag */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500 via-purple-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-500/25">
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-pink-400 via-purple-300 to-indigo-400 bg-clip-text text-transparent">
                  AURA FanVerse
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Fullstack AI
                </span>
              </div>
              <p className="text-xs text-slate-400">Deep Learning • RL Agent • Cyber Shield</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden xl:flex space-x-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setActiveTab('reels')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === 'reels'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Micro-Narratives</span>
            </button>

            <button
              onClick={() => setActiveTab('tactical')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === 'tactical'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Tactical Co-Pilot</span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === 'analytics'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Match Radar</span>
            </button>

            <button
              onClick={() => setActiveTab('rl')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === 'rl'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Cpu className="w-3.5 h-3.5 text-amber-400" />
              <span>RL Agent</span>
            </button>

            <button
              onClick={() => setActiveTab('cybersecurity')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === 'cybersecurity'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Lock className="w-3.5 h-3.5 text-red-400" />
              <span>Cyber Shield</span>
            </button>

            <button
              onClick={() => setActiveTab('athletes')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === 'athletes'
                  ? 'bg-pink-600 text-white shadow-md shadow-pink-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-pink-400" />
              <span>Athlete Hub</span>
            </button>
          </nav>

          {/* Multilingual Selector & Live Status */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1.5 bg-slate-800/70 border border-slate-700/80 px-2.5 py-1.5 rounded-lg text-xs">
              <Globe2 className="w-3.5 h-3.5 text-purple-400" />
              <select
                value={selectedLang}
                onChange={(e) => setSelectedLang(e.target.value)}
                className="bg-transparent text-slate-200 font-medium focus:outline-none cursor-pointer"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code} className="bg-slate-900 text-slate-200">
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Live Match Pill */}
            <div className="flex items-center space-x-1.5 px-2.5 py-1.5 bg-rose-500/10 border border-rose-500/30 rounded-full text-xs font-semibold text-rose-400 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              <span>LIVE • 142/3</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
