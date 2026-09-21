import React, { useState } from 'react';
import { Sparkles, Activity, Shield, Users, Radio, Globe2, Cpu, Lock, Box, User, LogIn, Compass, Volume2, VolumeX } from 'lucide-react';
import { soundFX } from '../services/soundFX';

export type ActiveTabType = 'discover' | 'reels' | 'tactical' | 'stadium3d' | 'analytics' | 'rl' | 'cybersecurity' | 'athletes' | 'profile';

interface NavbarProps {
  activeTab: ActiveTabType;
  setActiveTab: (tab: ActiveTabType) => void;
  selectedLang: string;
  setSelectedLang: (lang: string) => void;
  user: { name: string; handle: string; sparks: number } | null;
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  selectedLang,
  setSelectedLang,
  user,
  onOpenAuth,
}) => {
  const [isMuted, setIsMuted] = useState<boolean>(soundFX.getMuted());

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिंदी (Hindi)' },
    { code: 'es', label: 'Español' },
    { code: 'ar', label: 'العربية (Arabic)' },
    { code: 'ta', label: 'தமிழ் (Tamil)' },
  ];

  const handleTabChange = (tab: ActiveTabType) => {
    soundFX.playClick();
    setActiveTab(tab);
  };

  const handleToggleSound = () => {
    const muted = soundFX.toggleMute();
    setIsMuted(muted);
    if (!muted) soundFX.playSuccessChime();
  };

  return (
    <header className="sticky top-0 z-50 bg-[#151026]/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Tag */}
          <div
            onClick={() => handleTabChange('discover')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#211c33] border border-purple-500/30 flex items-center justify-center shadow-lg group-hover:border-purple-400 transition-colors">
              <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-pink-400 via-purple-300 to-cyan-400 bg-clip-text text-transparent">
                  AURA FanVerse
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  AI v4.9
                </span>
              </div>
              <p className="text-xs text-slate-400">Multimodal AI • 3D WebGL • Fullstack</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden xl:flex space-x-1 bg-[#100b21]/80 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => handleTabChange('discover')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === 'discover'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-pink-400" />
              <span>Discover</span>
            </button>

            <button
              onClick={() => handleTabChange('reels')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === 'reels'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Radio className="w-3.5 h-3.5 text-purple-400" />
              <span>Micro-Narratives</span>
            </button>

            <button
              onClick={() => handleTabChange('tactical')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === 'tactical'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-purple-400" />
              <span>Tactical Co-Pilot</span>
            </button>

            <button
              onClick={() => handleTabChange('stadium3d')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === 'stadium3d'
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Box className="w-3.5 h-3.5 text-cyan-400" />
              <span>3D Stadium</span>
            </button>

            <button
              onClick={() => handleTabChange('analytics')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === 'analytics'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>Match Radar</span>
            </button>

            <button
              onClick={() => handleTabChange('rl')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === 'rl'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Cpu className="w-3.5 h-3.5 text-amber-400" />
              <span>RL Agent</span>
            </button>

            <button
              onClick={() => handleTabChange('cybersecurity')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === 'cybersecurity'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Lock className="w-3.5 h-3.5 text-red-400" />
              <span>Cyber Shield</span>
            </button>

            <button
              onClick={() => handleTabChange('athletes')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === 'athletes'
                  ? 'bg-pink-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-pink-400" />
              <span>Athlete Hub</span>
            </button>

            {user && (
              <button
                onClick={() => handleTabChange('profile')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                  activeTab === 'profile'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <User className="w-3.5 h-3.5 text-purple-300" />
                <span>Profile</span>
              </button>
            )}
          </nav>

          {/* Multilingual Selector & User Actions */}
          <div className="flex items-center space-x-3">
            {/* Audio SFX Toggle Button */}
            <button
              onClick={handleToggleSound}
              className="p-2 rounded-xl bg-[#1d182f] border border-slate-700/80 text-slate-300 hover:text-cyan-400 transition-colors"
              title={isMuted ? 'Unmute Futuristic UI SFX' : 'Mute UI SFX'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-cyan-400 animate-pulse" />}
            </button>

            <div className="flex items-center space-x-1.5 bg-[#1d182f] border border-slate-700/80 px-2.5 py-1.5 rounded-lg text-xs">
              <Globe2 className="w-3.5 h-3.5 text-purple-400" />
              <select
                value={selectedLang}
                onChange={(e) => {
                  soundFX.playClick();
                  setSelectedLang(e.target.value);
                }}
                className="bg-transparent text-slate-200 font-medium focus:outline-none cursor-pointer"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code} className="bg-slate-900 text-slate-200">
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>

            {user ? (
              <button
                onClick={() => handleTabChange('profile')}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#211c33] border border-purple-500/30 hover:border-purple-400 transition-colors"
              >
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-[10px] text-white font-bold">
                  {user.name.charAt(0)}
                </div>
                <span className="text-xs font-semibold text-white truncate max-w-[80px]">{user.name}</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  soundFX.playPortalSweep();
                  onOpenAuth();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold shadow-md hover:opacity-95 active:scale-95 transition-all"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
