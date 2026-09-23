import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar, type ActiveTabType } from './components/Navbar';
import { WelcomeLoading } from './components/WelcomeLoading';
import { WelcomeLanding } from './components/WelcomeLanding';
import { AuthModal } from './components/AuthModal';
import { UserProfile } from './components/UserProfile';
import { MicroNarratives } from './components/MicroNarratives';
import { TacticalCoPilot } from './components/TacticalCoPilot';
import { MatchAnalytics } from './components/MatchAnalytics';
import { CricketStadium3D } from './components/CricketStadium3D';
import { AthletePassport } from './components/AthletePassport';
import { RLSimulator } from './components/RLSimulator';
import { CyberSecurityCenter } from './components/CyberSecurityCenter';
import { soundFX } from './services/soundFX';
import { Trophy, Globe, Flame, Zap, ArrowRight, ShieldCheck, Activity } from 'lucide-react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';

// Unique AI-generated aesthetic background wallpapers per page
const PAGE_BACKGROUNDS: Record<ActiveTabType, { bgImage: string; glowFrom: string; glowTo: string }> = {
  discover: {
    bgImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
    glowFrom: 'rgba(168, 85, 247, 0.18)', // Purple
    glowTo: 'rgba(6, 182, 212, 0.15)',   // Cyan
  },
  reels: {
    bgImage: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1600&q=80',
    glowFrom: 'rgba(236, 72, 153, 0.20)', // Pink
    glowTo: 'rgba(168, 85, 247, 0.14)',
  },
  tactical: {
    bgImage: 'https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?auto=format&fit=crop&w=1600&q=80',
    glowFrom: 'rgba(99, 102, 241, 0.22)', // Indigo
    glowTo: 'rgba(168, 85, 247, 0.16)',
  },
  stadium3d: {
    bgImage: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1600&q=80',
    glowFrom: 'rgba(6, 182, 212, 0.25)', // Cyan arena
    glowTo: 'rgba(236, 72, 153, 0.15)',
  },
  analytics: {
    bgImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80',
    glowFrom: 'rgba(16, 185, 129, 0.18)', // Emerald
    glowTo: 'rgba(99, 102, 241, 0.14)',
  },
  rl: {
    bgImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80',
    glowFrom: 'rgba(245, 158, 11, 0.20)', // Amber
    glowTo: 'rgba(168, 85, 247, 0.15)',
  },
  cybersecurity: {
    bgImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1600&q=80',
    glowFrom: 'rgba(239, 68, 68, 0.22)', // Red threat
    glowTo: 'rgba(168, 85, 247, 0.15)',
  },
  athletes: {
    bgImage: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1600&q=80',
    glowFrom: 'rgba(236, 72, 153, 0.22)', // Pink
    glowTo: 'rgba(6, 182, 212, 0.15)',
  },
  profile: {
    bgImage: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1600&q=80',
    glowFrom: 'rgba(168, 85, 247, 0.24)', // Purple
    glowTo: 'rgba(245, 158, 11, 0.14)',
  },
};

function AppContent() {
  const { language, t } = useLanguage();
  const [showLoadingSplash, setShowLoadingSplash] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<ActiveTabType>('discover');
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<{
    name: string;
    handle: string;
    sparks: number;
  } | null>({
    name: 'Kira Nova',
    handle: '@Kira_Nova',
    sparks: 4850,
  });

  // Welcome Loading Splash Handler
  if (showLoadingSplash) {
    return (
      <WelcomeLoading
        onComplete={() => {
          soundFX.playPortalSweep();
          setShowLoadingSplash(false);
        }}
      />
    );
  }

  const handleLogout = () => {
    soundFX.playClick();
    setCurrentUser(null);
    setActiveTab('discover');
  };

  const handleTabSwitch = (tab: ActiveTabType) => {
    soundFX.playClick();
    setActiveTab(tab);
  };

  const currentBg = PAGE_BACKGROUNDS[activeTab] || PAGE_BACKGROUNDS.discover;

  return (
    <div className="min-h-screen bg-[#080415] text-slate-100 flex flex-col font-sans selection:bg-purple-500 selection:text-white relative overflow-x-hidden">
      {/* Dynamic Per-Page AI Generated Background Wallpaper */}
      <div
        className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-1000 bg-cover bg-center bg-no-repeat opacity-20"
        style={{ backgroundImage: `url(${currentBg.bgImage})` }}
      />

      {/* Cyber Grid Texture Overlay */}
      <div className="fixed inset-0 pointer-events-none z-0 cyber-grid-pattern opacity-40" />

      {/* Dynamic Animated Cyber Glow Orbs */}
      <div
        className="fixed -top-32 -left-32 w-[32rem] h-[32rem] rounded-full blur-[140px] pointer-events-none z-0 transition-all duration-1000 glow-ambient"
        style={{ backgroundColor: currentBg.glowFrom }}
      />
      <div
        className="fixed -bottom-32 -right-32 w-[32rem] h-[32rem] rounded-full blur-[140px] pointer-events-none z-0 transition-all duration-1000 glow-ambient"
        style={{ backgroundColor: currentBg.glowTo, animationDelay: '-3s' }}
      />

      {/* 3D Header Console (Navbar) */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      {/* Live Match Dynamic Broadcast Ribbon & Animated Ticker */}
      <div className="bg-gradient-to-r from-purple-950/70 via-[#100b21]/95 to-indigo-950/70 border-b border-purple-500/25 py-2 px-4 relative z-10 backdrop-blur-xl shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-2.5 text-xs">
          {/* Left Static Indicator */}
          <div className="flex items-center space-x-2 text-xs font-mono flex-shrink-0">
            <span className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold">
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t('nav.live_mesh', 'ICC LIVE TOURNAMENT MESH')}</span>
            </span>
            <span className="text-purple-300 font-medium hidden sm:inline">
              {t('ribbon.tournament', "ICC Women's T20 World Cup Final")}
            </span>
          </div>

          {/* Center Smooth Scrolling Marquee Ticker */}
          <div className="overflow-hidden relative flex-1 max-w-2xl mx-auto h-6 rounded-lg bg-black/30 border border-white/5 flex items-center px-2">
            <div className="animate-marquee items-center gap-8 font-mono text-[11px] text-slate-300 whitespace-nowrap">
              <span className="flex items-center gap-1.5 text-amber-300 font-bold">
                <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-pulse" />
                OVER 14.3: Harmanpreet Kaur sweeps Sophie Ecclestone for FOUR! (124/2, Req: 44 off 33)
              </span>
              <span className="text-cyan-300 flex items-center gap-1">
                <Activity className="w-3.5 h-3.5" />
                Win Probability: IND 68.4% (+4.2% swing) • AUS 31.6%
              </span>
              <span className="text-purple-300 flex items-center gap-1">
                <Zap className="w-3 h-3 text-pink-400" />
                Tactical Shift: Deep backward square leg deployed at 72m boundary
              </span>
              <span className="text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Zero-Trust Canon: Block #819,412 Signed & Validated
              </span>
              {/* Duplicate for seamless continuous roll */}
              <span className="flex items-center gap-1.5 text-amber-300 font-bold">
                <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-pulse" />
                OVER 14.3: Harmanpreet Kaur sweeps Sophie Ecclestone for FOUR! (124/2, Req: 44 off 33)
              </span>
              <span className="text-cyan-300 flex items-center gap-1">
                <Activity className="w-3.5 h-3.5" />
                Win Probability: IND 68.4% (+4.2% swing) • AUS 31.6%
              </span>
            </div>
          </div>

          {/* Right Status Badges & Quick Action Chips */}
          <div className="flex items-center justify-end space-x-2 text-[11px] font-mono flex-shrink-0">
            <button
              onClick={() => handleTabSwitch('stadium3d')}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1 ${
                activeTab === 'stadium3d'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
              }`}
            >
              <span>3D Field</span>
              <ArrowRight className="w-3 h-3 text-cyan-400" />
            </button>
            <button
              onClick={() => handleTabSwitch('tactical')}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1 ${
                activeTab === 'tactical'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-400/40 shadow-[0_0_10px_rgba(168,85,247,0.3)]'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
              }`}
            >
              <span>AI Co-Pilot</span>
              <Zap className="w-3 h-3 text-purple-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Viewport Content with Framer Motion Page Transitions */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 14, filter: 'blur(3px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -14, filter: 'blur(3px)' }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="w-full"
          >
            {activeTab === 'discover' && (
              <WelcomeLanding
                onEnterDashboard={() => {
                  soundFX.playClick();
                  setActiveTab('reels');
                }}
                onOpenAuth={() => {
                  soundFX.playPortalSweep();
                  setIsAuthOpen(true);
                }}
              />
            )}
            {activeTab === 'reels' && <MicroNarratives selectedLang={language} />}
            {activeTab === 'tactical' && <TacticalCoPilot />}
            {activeTab === 'stadium3d' && <CricketStadium3D />}
            {activeTab === 'analytics' && <MatchAnalytics />}
            {activeTab === 'rl' && <RLSimulator />}
            {activeTab === 'cybersecurity' && <CyberSecurityCenter />}
            {activeTab === 'athletes' && <AthletePassport />}
            {activeTab === 'profile' && currentUser && (
              <UserProfile user={currentUser} onLogout={handleLogout} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Modern Footer with Specular Highlight Rim */}
      <footer className="border-t border-purple-500/20 bg-[#0d071f]/95 backdrop-blur-xl py-6 text-center text-xs text-slate-500 relative z-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <p>
              <strong className="text-slate-300">AURA FanVerse</strong> — ICC Global Hackathon 2026. Flagship Showcase at Dubai AI Festival.
            </p>
          </div>
          <div className="flex items-center space-x-4 text-slate-400">
            <span>Powered by Three.js WebGL, Web Audio SFX & Deep Learning</span>
            <span>•</span>
            <span className="text-pink-400 font-medium flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5 text-pink-400 inline" /> Elevating Women in Sport
            </span>
          </div>
        </div>
      </footer>

      {/* Authentication Modal */}
      {isAuthOpen && (
        <AuthModal
          isOpen={isAuthOpen}
          onClose={() => setIsAuthOpen(false)}
          onLoginSuccess={(user) => {
            setCurrentUser(user);
            setIsAuthOpen(false);
          }}
        />
      )}
    </div>
  );
}

export function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;
