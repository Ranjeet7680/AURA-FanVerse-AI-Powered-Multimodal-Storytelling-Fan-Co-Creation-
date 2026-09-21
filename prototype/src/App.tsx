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
import { Trophy, Globe, Flame } from 'lucide-react';

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
    return <WelcomeLoading onComplete={() => setShowLoadingSplash(false)} />;
  }

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab('discover');
  };

  return (
    <div className="min-h-screen bg-[#151026] text-slate-100 flex flex-col selection:bg-purple-500 selection:text-white">
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
          setCurrentUser(user);
          setActiveTab('profile');
        }}
      />

      {/* Live Match Sub-Bar */}
      <div className="border-b border-slate-800 bg-[#1d182f]/60 py-2.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-3">
            <span className="flex items-center gap-1.5 text-slate-200 font-semibold">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              ICC Women's T20 World Cup Final
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400">Dubai International Stadium</span>
            <span className="text-slate-600">•</span>
            <span className="text-purple-400 font-semibold flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-pink-500 fill-pink-500 animate-pulse" />
              8.4M Fans Synced
            </span>
          </div>

          <div className="flex items-center space-x-3 text-slate-400">
            <span className="flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              12 Regional AI Streams
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-emerald-400 font-semibold">Zero-Trust Guard: Active</span>
          </div>
        </div>
      </div>

      {/* Main Viewport Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'discover' && (
          <WelcomeLanding
            onEnterDashboard={() => setActiveTab('reels')}
            onOpenAuth={() => setIsAuthOpen(true)}
          />
        )}
        {activeTab === 'reels' && <MicroNarratives selectedLang={selectedLang} />}
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
      <footer className="border-t border-slate-900 bg-[#100b21] py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            <strong>AURA FanVerse</strong> — ICC Global Hackathon 2026. Flagship Showcase at Dubai AI Festival.
          </p>
          <div className="flex items-center space-x-4 text-slate-400">
            <span>Powered by Three.js, Deep Learning & Q-Learning</span>
            <span>•</span>
            <span className="text-pink-400 font-medium">Elevating Women in Sport</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
