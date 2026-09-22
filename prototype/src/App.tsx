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

export function App() {
  const [showLoadingSplash, setShowLoadingSplash] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<ActiveTabType>('discover');
  const [selectedLang, setSelectedLang] = useState<string>('en');
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
    <div className="min-h-screen bg-[#151026] text-slate-100 flex flex-col selection:bg-purple-500 selection:text-white relative overflow-x-hidden">
      {/* Dynamic AI Background Wallpaper (Custom Per Page) */}
      <div
        className="fixed inset-0 pointer-events-none transition-all duration-700 bg-cover bg-center opacity-15 mix-blend-screen"
        style={{ backgroundImage: `url(${currentBg.bgImage})` }}
      />

      {/* Dynamic Ambient Color Radial Glow Orbs */}
      <div
        className="fixed top-0 left-1/4 w-[600px] h-[600px] rounded-full blur-[140px] pointer-events-none transition-all duration-1000"
        style={{ background: currentBg.glowFrom }}
      />
      <div
        className="fixed bottom-0 right-1/4 w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none transition-all duration-1000"
        style={{ background: currentBg.glowTo }}
      />

      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedLang={selectedLang}
        setSelectedLang={setSelectedLang}
        user={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      {/* Auth Modal (Sign In + OTP + Biometrics) */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(user) => {
          soundFX.playSuccessChime();
          setCurrentUser(user);
          setActiveTab('profile');
        }}
      />

      {/* Live Match 3D Ribbon Sub-Bar */}
      <div className="border-b border-purple-500/20 bg-gradient-to-r from-[#170e30]/90 via-[#100824]/90 to-[#170e30]/90 backdrop-blur-xl py-2 z-10 relative shadow-[0_4px_16px_rgba(0,0,0,0.4)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-3">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold shadow-[0_2px_8px_rgba(245,158,11,0.2)]">
              <Trophy className="w-3.5 h-3.5 text-amber-400 drop-shadow animate-bounce" />
              ICC Women's T20 World Cup Final
            </span>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span className="text-slate-300 font-mono hidden sm:inline">Dubai International Stadium</span>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span className="px-2.5 py-1 rounded-xl bg-pink-500/10 border border-pink-500/30 text-pink-300 font-bold flex items-center gap-1.5 shadow-[0_2px_8px_rgba(236,72,153,0.2)]">
              <Flame className="w-3.5 h-3.5 text-pink-400 fill-pink-400 animate-pulse" />
              8.4M Fans Synced Live
            </span>
          </div>

          <div className="flex items-center space-x-3 text-slate-300 font-mono text-[11px]">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300">
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              12 Regional AI Streams
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
        {activeTab === 'reels' && <MicroNarratives selectedLang={selectedLang} />}
        {activeTab === 'tactical' && (
          <TacticalCoPilot selectedLang={selectedLang} onSelectLang={setSelectedLang} />
        )}
        {activeTab === 'stadium3d' && (
          <CricketStadium3D selectedLang={selectedLang} onSelectLang={setSelectedLang} />
        )}
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
    </div>
  );
}

export default App;
