import { useState } from 'react';
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
import { Trophy, Globe, Flame } from 'lucide-react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';

// Unique AI-generated aesthetic background wallpapers per page
const PAGE_BACKGROUNDS: Record<ActiveTabType, { bgImage: string; glowFrom: string; glowTo: string }> = {
  discover: {
    bgImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
    glowFrom: 'rgba(168, 85, 247, 0.15)', // Purple
    glowTo: 'rgba(6, 182, 212, 0.12)',   // Cyan
  },
  reels: {
    bgImage: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1600&q=80',
    glowFrom: 'rgba(236, 72, 153, 0.18)', // Pink
    glowTo: 'rgba(168, 85, 247, 0.12)',
  },
  tactical: {
    bgImage: 'https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?auto=format&fit=crop&w=1600&q=80',
    glowFrom: 'rgba(99, 102, 241, 0.18)', // Indigo
    glowTo: 'rgba(168, 85, 247, 0.14)',
  },
  stadium3d: {
    bgImage: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1600&q=80',
    glowFrom: 'rgba(6, 182, 212, 0.22)', // Cyan arena
    glowTo: 'rgba(236, 72, 153, 0.12)',
  },
  analytics: {
    bgImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80',
    glowFrom: 'rgba(16, 185, 129, 0.16)', // Emerald
    glowTo: 'rgba(99, 102, 241, 0.12)',
  },
  rl: {
    bgImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80',
    glowFrom: 'rgba(245, 158, 11, 0.18)', // Amber
    glowTo: 'rgba(168, 85, 247, 0.14)',
  },
  cybersecurity: {
    bgImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1600&q=80',
    glowFrom: 'rgba(239, 68, 68, 0.20)', // Red threat
    glowTo: 'rgba(168, 85, 247, 0.14)',
  },
  athletes: {
    bgImage: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1600&q=80',
    glowFrom: 'rgba(236, 72, 153, 0.20)', // Pink
    glowTo: 'rgba(6, 182, 212, 0.14)',
  },
  profile: {
    bgImage: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1600&q=80',
    glowFrom: 'rgba(168, 85, 247, 0.22)', // Purple
    glowTo: 'rgba(245, 158, 11, 0.12)',
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

  const currentBg = PAGE_BACKGROUNDS[activeTab] || PAGE_BACKGROUNDS.discover;

  return (
    <div className="min-h-screen bg-[#090514] text-slate-100 flex flex-col font-sans selection:bg-purple-500 selection:text-white relative overflow-x-hidden">
      {/* Dynamic Per-Page AI Generated Background Wallpaper */}
      <div
        className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-1000 bg-cover bg-center bg-no-repeat opacity-15"
        style={{ backgroundImage: `url(${currentBg.bgImage})` }}
      />

      {/* Cyber Glow Orbs matching page theme */}
      <div
        className="fixed -top-32 -left-32 w-96 h-96 rounded-full blur-[128px] pointer-events-none z-0 transition-all duration-1000"
        style={{ backgroundColor: currentBg.glowFrom }}
      />
      <div
        className="fixed -bottom-32 -right-32 w-96 h-96 rounded-full blur-[128px] pointer-events-none z-0 transition-all duration-1000"
        style={{ backgroundColor: currentBg.glowTo }}
      />

      {/* 3D Header Console (Navbar) */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      {/* Live Match Sub-Bar / Tournament Ribbon */}
      <div className="bg-gradient-to-r from-purple-950/60 via-[#100b21]/90 to-indigo-950/60 border-b border-purple-500/20 py-2 px-4 relative z-10 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center space-x-2 text-xs text-slate-300 font-mono">
            <span className="flex items-center space-x-1 text-emerald-400 font-semibold">
              <Globe className="w-3.5 h-3.5" />
              <span>{t('nav.live_mesh')}</span>
            </span>
            <span>•</span>
            <span className="text-purple-300">IND-W vs AUS-W (Dubai)</span>
            <span>•</span>
            <span className="text-amber-400 flex items-center space-x-1">
              <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>{t('nav.over_live')}</span>
            </span>
          </div>

          <div className="flex items-center space-x-3 text-[11px] font-mono">
            <span className="flex items-center space-x-1 text-cyan-300">
              <Trophy className="w-3.5 h-3.5 text-cyan-400" />
              <span>5 Languages Synchronized</span>
            </span>
            <span className="text-slate-600">|</span>
            <span className="px-2.5 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Zero-Trust Guard: Active
            </span>
          </div>
        </div>
      </div>

      {/* Main Viewport Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
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
      </main>

      {/* Modern Footer */}
      <footer className="border-t border-slate-900/80 bg-[#100b21]/90 backdrop-blur-md py-6 text-center text-xs text-slate-500 relative z-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            <strong>AURA FanVerse</strong> — ICC Global Hackathon 2026. Flagship Showcase at Dubai AI Festival.
          </p>
          <div className="flex items-center space-x-4 text-slate-400">
            <span>Powered by Three.js WebGL, Web Audio SFX & Deep Learning</span>
            <span>•</span>
            <span className="text-pink-400 font-medium">Elevating Women in Sport</span>
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
