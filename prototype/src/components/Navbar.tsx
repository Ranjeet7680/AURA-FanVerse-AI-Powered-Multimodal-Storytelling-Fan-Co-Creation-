import React, { useState } from 'react';
import {
  Sparkles,
  Activity,
  Shield,
  Users,
  Radio,
  Globe2,
  Cpu,
  Lock,
  Box,
  User,
  LogIn,
  Compass,
  Volume2,
  VolumeX,
  Menu,
  X
} from 'lucide-react';
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

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
    setIsMobileMenuOpen(false);
  };

  const handleToggleSound = () => {
    const muted = soundFX.toggleMute();
    setIsMuted(muted);
    if (!muted) soundFX.playSuccessChime();
  };

  return (
    <header className="sticky top-0 z-50 bg-[#120c24]/90 backdrop-blur-2xl border-b border-purple-500/20 shadow-[0_12px_32px_rgba(0,0,0,0.65)] relative">
      {/* 3D Top Specular Light Highlight Line */}
      <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400 to-pink-500 opacity-80" />
      {/* 3D Ambient Bottom Glow Edge */}
      <div className="absolute -bottom-[1px] inset-x-0 h-[1px] bg-gradient-to-r from-purple-500/20 via-pink-500/40 to-cyan-500/20" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 py-2 gap-2">
          {/* Brand Logo with 3D Embossed Coin Effect */}
          <div
            onClick={() => handleTabChange('discover')}
            className="flex items-center space-x-2.5 cursor-pointer group select-none transition-transform active:scale-95 flex-shrink-0"
          >
            {/* 3D Isometric Emblem */}
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-b from-[#2e2354] via-[#1a1338] to-[#0e0922] border-t border-purple-400/60 border-l border-purple-400/40 border-b-2 border-black/80 shadow-[0_6px_16px_rgba(147,51,234,0.35),inset_0_2px_4px_rgba(255,255,255,0.2)] flex items-center justify-center transform group-hover:-translate-y-0.5 transition-all">
                <Sparkles className="w-5 h-5 text-cyan-300 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)] animate-pulse" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#120c24] shadow-[0_0_8px_rgba(16,185,129,0.9)]" />
            </div>

            <div className="flex flex-col justify-center">
              <div className="flex items-center space-x-1.5 whitespace-nowrap">
                <span className="font-black text-lg sm:text-xl tracking-tight bg-gradient-to-r from-white via-purple-100 to-pink-400 bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(168,85,247,0.4)]">
                  AURA FanVerse
                </span>
                <span className="text-[9px] uppercase font-black tracking-wider px-1.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-400/40 shadow-[0_1px_4px_rgba(6,182,212,0.2)] hidden sm:inline-block font-mono">
                  v4.9
                </span>
              </div>
              <p className="text-[10px] text-slate-400 tracking-wide font-medium hidden sm:block whitespace-nowrap leading-tight">
                Multimodal Canon • 3D Stadium • Live Fandom
              </p>
            </div>
          </div>

          {/* Desktop Navigation 3D Floating Console Strip */}
          <nav className="hidden lg:flex items-center space-x-1 bg-[#100924]/90 p-1 rounded-2xl border-t border-white/10 border-b border-black/80 shadow-[0_6px_18px_rgba(0,0,0,0.5),inset_0_1px_2px_rgba(255,255,255,0.06)] text-[11px] flex-shrink">
            <button
              onClick={() => handleTabChange('discover')}
              className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-xl font-bold transition-all transform duration-150 whitespace-nowrap ${
                activeTab === 'discover'
                  ? 'bg-gradient-to-b from-purple-500 to-pink-600 text-white shadow-[0_4px_12px_rgba(236,72,153,0.4),inset_0_1px_1px_rgba(255,255,255,0.4)] -translate-y-0.5'
                  : 'text-slate-400 hover:text-white hover:bg-white/5 active:translate-y-0.5'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-pink-300 drop-shadow" />
              <span>Discover</span>
            </button>

            <button
              onClick={() => handleTabChange('reels')}
              className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-xl font-bold transition-all transform duration-150 whitespace-nowrap ${
                activeTab === 'reels'
                  ? 'bg-gradient-to-b from-purple-500 to-indigo-600 text-white shadow-[0_4px_12px_rgba(168,85,247,0.45),inset_0_1px_1px_rgba(255,255,255,0.4)] -translate-y-0.5'
                  : 'text-slate-400 hover:text-white hover:bg-white/5 active:translate-y-0.5'
              }`}
            >
              <Radio className="w-3.5 h-3.5 text-purple-300 drop-shadow animate-pulse" />
              <span>Shorts</span>
            </button>

            <button
              onClick={() => handleTabChange('tactical')}
              className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-xl font-bold transition-all transform duration-150 whitespace-nowrap ${
                activeTab === 'tactical'
                  ? 'bg-gradient-to-b from-purple-600 to-violet-700 text-white shadow-[0_4px_12px_rgba(139,92,246,0.45),inset_0_1px_1px_rgba(255,255,255,0.4)] -translate-y-0.5'
                  : 'text-slate-400 hover:text-white hover:bg-white/5 active:translate-y-0.5'
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-purple-300 drop-shadow" />
              <span>Tactical AI</span>
            </button>

            <button
              onClick={() => handleTabChange('stadium3d')}
              className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-xl font-bold transition-all transform duration-150 whitespace-nowrap ${
                activeTab === 'stadium3d'
                  ? 'bg-gradient-to-b from-cyan-500 to-blue-600 text-white shadow-[0_4px_14px_rgba(6,182,212,0.5),inset_0_1px_1px_rgba(255,255,255,0.4)] -translate-y-0.5 ring-1 ring-cyan-300/40'
                  : 'text-slate-400 hover:text-cyan-300 hover:bg-white/5 active:translate-y-0.5'
              }`}
            >
              <Box className="w-3.5 h-3.5 text-cyan-300 drop-shadow" />
              <span>3D Stadium</span>
            </button>

            <button
              onClick={() => handleTabChange('analytics')}
              className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-xl font-bold transition-all transform duration-150 whitespace-nowrap ${
                activeTab === 'analytics'
                  ? 'bg-gradient-to-b from-emerald-500 to-teal-700 text-white shadow-[0_4px_12px_rgba(16,185,129,0.45),inset_0_1px_1px_rgba(255,255,255,0.4)] -translate-y-0.5'
                  : 'text-slate-400 hover:text-white hover:bg-white/5 active:translate-y-0.5'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-emerald-300 drop-shadow" />
              <span>Radar</span>
            </button>

            <button
              onClick={() => handleTabChange('rl')}
              className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-xl font-bold transition-all transform duration-150 whitespace-nowrap ${
                activeTab === 'rl'
                  ? 'bg-gradient-to-b from-amber-500 to-orange-600 text-white shadow-[0_4px_12px_rgba(245,158,11,0.45),inset_0_1px_1px_rgba(255,255,255,0.4)] -translate-y-0.5'
                  : 'text-slate-400 hover:text-white hover:bg-white/5 active:translate-y-0.5'
              }`}
            >
              <Cpu className="w-3.5 h-3.5 text-amber-300 drop-shadow" />
              <span>RL Agent</span>
            </button>

            <button
              onClick={() => handleTabChange('cybersecurity')}
              className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-xl font-bold transition-all transform duration-150 whitespace-nowrap ${
                activeTab === 'cybersecurity'
                  ? 'bg-gradient-to-b from-red-500 to-rose-700 text-white shadow-[0_4px_12px_rgba(239,68,68,0.45),inset_0_1px_1px_rgba(255,255,255,0.4)] -translate-y-0.5'
                  : 'text-slate-400 hover:text-white hover:bg-white/5 active:translate-y-0.5'
              }`}
            >
              <Lock className="w-3.5 h-3.5 text-red-300 drop-shadow" />
              <span>Cyber Shield</span>
            </button>

            <button
              onClick={() => handleTabChange('athletes')}
              className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-xl font-bold transition-all transform duration-150 whitespace-nowrap ${
                activeTab === 'athletes'
                  ? 'bg-gradient-to-b from-pink-500 to-rose-600 text-white shadow-[0_4px_12px_rgba(236,72,153,0.45),inset_0_1px_1px_rgba(255,255,255,0.4)] -translate-y-0.5'
                  : 'text-slate-400 hover:text-white hover:bg-white/5 active:translate-y-0.5'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-pink-300 drop-shadow" />
              <span>Athletes</span>
            </button>

            {user && (
              <button
                onClick={() => handleTabChange('profile')}
                className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-xl font-bold transition-all transform duration-150 whitespace-nowrap ${
                  activeTab === 'profile'
                    ? 'bg-gradient-to-b from-purple-500 to-indigo-600 text-white shadow-[0_4px_12px_rgba(168,85,247,0.45),inset_0_1px_1px_rgba(255,255,255,0.4)] -translate-y-0.5'
                    : 'text-slate-400 hover:text-white hover:bg-white/5 active:translate-y-0.5'
                }`}
              >
                <User className="w-3.5 h-3.5 text-purple-200 drop-shadow" />
                <span>Profile</span>
              </button>
            )}
          </nav>

          {/* Right Header 3D Tactile Buttons */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            {/* 3D Audio SFX Synthesizer Toggle */}
            <button
              onClick={handleToggleSound}
              className="p-2 rounded-2xl bg-gradient-to-b from-[#241a45] to-[#120b29] border-t border-purple-400/40 border-b border-black shadow-[0_4px_10px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.15)] text-slate-300 hover:text-cyan-400 hover:border-cyan-400/50 transition-all active:translate-y-0.5"
              title={isMuted ? 'Unmute Futuristic UI SFX' : 'Mute UI SFX'}
            >
              {isMuted ? (
                <VolumeX className="w-3.5 h-3.5 text-slate-500" />
              ) : (
                <Volume2 className="w-3.5 h-3.5 text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)] animate-pulse" />
              )}
            </button>

            {/* 3D Beveled Language Selector */}
            <div className="flex items-center space-x-1 bg-gradient-to-b from-[#241a45] to-[#120b29] border-t border-purple-400/40 border-b border-black shadow-[0_4px_10px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.15)] px-2 py-1.5 rounded-2xl text-xs">
              <Globe2 className="w-3.5 h-3.5 text-purple-400 drop-shadow" />
              <select
                value={selectedLang}
                onChange={(e) => {
                  soundFX.playClick();
                  setSelectedLang(e.target.value);
                }}
                className="bg-transparent text-slate-200 font-bold focus:outline-none cursor-pointer text-xs"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code} className="bg-slate-900 text-slate-200">
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 3D Profile Avatar or 3D Beveled Sign In Button */}
            {user ? (
              <button
                onClick={() => handleTabChange('profile')}
                className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-gradient-to-b from-[#2a1d52] to-[#150d30] border-t border-purple-400/50 border-b border-black shadow-[0_4px_12px_rgba(0,0,0,0.5),inset_0_1px_2px_rgba(255,255,255,0.2)] hover:border-pink-400/60 transition-all active:translate-y-0.5"
              >
                <div className="w-6 h-6 rounded-xl bg-gradient-to-tr from-cyan-400 via-purple-500 to-pink-500 p-0.5 shadow-md flex items-center justify-center">
                  <div className="w-full h-full bg-[#120c24] rounded-[10px] flex items-center justify-center text-[10px] text-white font-black">
                    {user.name.charAt(0)}
                  </div>
                </div>
                <div className="text-left hidden sm:block">
                  <span className="text-xs font-bold text-white block leading-none">
                    {user.name}
                  </span>
                  <span className="text-[10px] text-cyan-400 font-mono font-semibold">
                    {user.sparks} ⚡
                  </span>
                </div>
              </button>
            ) : (
              <button
                onClick={() => {
                  soundFX.playPortal();
                  onOpenAuth();
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-gradient-to-b from-purple-500 to-pink-600 text-white text-xs font-black shadow-[0_4px_14px_rgba(236,72,153,0.5),inset_0_1px_2px_rgba(255,255,255,0.4)] hover:opacity-95 active:translate-y-0.5 transition-all"
              >
                <LogIn className="w-3.5 h-3.5 drop-shadow" />
                <span>Sign In</span>
              </button>
            )}

            {/* 3D Mobile Menu Toggle Button */}
            <button
              onClick={() => {
                soundFX.playClick();
                setIsMobileMenuOpen(!isMobileMenuOpen);
              }}
              className="p-2.5 rounded-2xl bg-gradient-to-b from-[#241a45] to-[#120b29] border-t border-purple-400/40 border-b border-black shadow-[0_4px_10px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.15)] text-slate-300 hover:text-white xl:hidden transition-all active:translate-y-0.5"
              title="Toggle Menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-4 h-4 text-pink-400" />
              ) : (
                <Menu className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {isMobileMenuOpen && (
          <div className="xl:hidden py-3 px-2 border-t border-slate-800 bg-[#120d22]/95 backdrop-blur-xl rounded-b-2xl animate-in slide-in-from-top-2 duration-200">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-xs">
              <button
                onClick={() => handleTabChange('discover')}
                className={`flex items-center space-x-2 p-2 rounded-lg font-medium ${
                  activeTab === 'discover' ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' : 'text-slate-300 hover:bg-slate-800/60'
                }`}
              >
                <Compass className="w-3.5 h-3.5 text-pink-400" />
                <span>Discover</span>
              </button>
              <button
                onClick={() => handleTabChange('reels')}
                className={`flex items-center space-x-2 p-2 rounded-lg font-medium ${
                  activeTab === 'reels' ? 'bg-purple-600 text-white' : 'text-slate-300 hover:bg-slate-800/60'
                }`}
              >
                <Radio className="w-3.5 h-3.5 text-purple-400" />
                <span>Shorts & Reels</span>
              </button>
              <button
                onClick={() => handleTabChange('tactical')}
                className={`flex items-center space-x-2 p-2 rounded-lg font-medium ${
                  activeTab === 'tactical' ? 'bg-purple-600 text-white' : 'text-slate-300 hover:bg-slate-800/60'
                }`}
              >
                <Activity className="w-3.5 h-3.5 text-purple-400" />
                <span>Tactical Co-Pilot</span>
              </button>
              <button
                onClick={() => handleTabChange('stadium3d')}
                className={`flex items-center space-x-2 p-2 rounded-lg font-medium ${
                  activeTab === 'stadium3d' ? 'bg-cyan-600 text-white' : 'text-slate-300 hover:bg-slate-800/60'
                }`}
              >
                <Box className="w-3.5 h-3.5 text-cyan-400" />
                <span>3D Stadium</span>
              </button>
              <button
                onClick={() => handleTabChange('analytics')}
                className={`flex items-center space-x-2 p-2 rounded-lg font-medium ${
                  activeTab === 'analytics' ? 'bg-purple-600 text-white' : 'text-slate-300 hover:bg-slate-800/60'
                }`}
              >
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>Match Radar</span>
              </button>
              <button
                onClick={() => handleTabChange('rl')}
                className={`flex items-center space-x-2 p-2 rounded-lg font-medium ${
                  activeTab === 'rl' ? 'bg-amber-600 text-white' : 'text-slate-300 hover:bg-slate-800/60'
                }`}
              >
                <Cpu className="w-3.5 h-3.5 text-amber-400" />
                <span>RL Agent</span>
              </button>
              <button
                onClick={() => handleTabChange('cybersecurity')}
                className={`flex items-center space-x-2 p-2 rounded-lg font-medium ${
                  activeTab === 'cybersecurity' ? 'bg-red-600 text-white' : 'text-slate-300 hover:bg-slate-800/60'
                }`}
              >
                <Lock className="w-3.5 h-3.5 text-red-400" />
                <span>Cyber Shield</span>
              </button>
              <button
                onClick={() => handleTabChange('athletes')}
                className={`flex items-center space-x-2 p-2 rounded-lg font-medium ${
                  activeTab === 'athletes' ? 'bg-pink-600 text-white' : 'text-slate-300 hover:bg-slate-800/60'
                }`}
              >
                <Users className="w-3.5 h-3.5 text-pink-400" />
                <span>Athlete Hub</span>
              </button>
              {user && (
                <button
                  onClick={() => handleTabChange('profile')}
                  className={`flex items-center space-x-2 p-2 rounded-lg font-medium ${
                    activeTab === 'profile' ? 'bg-purple-600 text-white' : 'text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <User className="w-3.5 h-3.5 text-purple-300" />
                  <span>Profile ({user.sparks}⚡)</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
