import { useState } from 'react';
import { Navbar, type ActiveTabType } from './components/Navbar';
import { MicroNarratives } from './components/MicroNarratives';
import { TacticalCoPilot } from './components/TacticalCoPilot';
import { MatchAnalytics } from './components/MatchAnalytics';
import { CricketStadium3D } from './components/CricketStadium3D';
import { AthletePassport } from './components/AthletePassport';
import { RLSimulator } from './components/RLSimulator';
import { CyberSecurityCenter } from './components/CyberSecurityCenter';
import { Trophy, Globe, Flame } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTabType>('reels');
  const [selectedLang, setSelectedLang] = useState<string>('en');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedLang={selectedLang}
        setSelectedLang={setSelectedLang}
      />

      {/* Hero Header Sub-Bar */}
      <div className="border-b border-slate-800 bg-slate-900/40 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-4">
            <span className="flex items-center gap-1.5 text-slate-300 font-medium">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              ICC Women's T20 World Cup Final
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400">Dubai International Stadium</span>
            <span className="text-slate-600">•</span>
            <span className="text-purple-400 font-semibold flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" />
              8.4M Global Live Digital Viewers
            </span>
          </div>

          <div className="flex items-center space-x-3 text-slate-400">
            <span className="flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-indigo-400" />
              12 Regional AI Audio Streams
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-emerald-400 font-semibold">FastAPI Enterprise Core: Connected</span>
          </div>
        </div>
      </div>

      {/* Main Dynamic Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'reels' && <MicroNarratives selectedLang={selectedLang} />}
        {activeTab === 'tactical' && <TacticalCoPilot />}
        {activeTab === 'stadium3d' && <CricketStadium3D />}
        {activeTab === 'analytics' && <MatchAnalytics />}
        {activeTab === 'rl' && <RLSimulator />}
        {activeTab === 'cybersecurity' && <CyberSecurityCenter />}
        {activeTab === 'athletes' && <AthletePassport />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            <strong>AURA FanVerse Enterprise</strong> — Designed for the ICC Global Hackathon 2026. Showcasing at Dubai AI Festival.
          </p>
          <div className="flex items-center space-x-4 text-slate-400">
            <span>Powered by Multimodal Deep Learning, 3D WebGL, Q-Learning RL & Cyber Shield</span>
            <span>•</span>
            <span className="text-pink-400 font-medium">Supporting Women in Sport</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
