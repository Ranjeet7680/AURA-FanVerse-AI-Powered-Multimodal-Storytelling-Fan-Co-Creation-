import React, { useState } from 'react';
import {
  Sparkles,
  Users,
  ArrowRight,
  ShieldCheck,
  Heart,
  Flame,
  Radio,
  Vote,
  Volume2,
  Bookmark,
  Share2,
  CheckCircle2,
  TrendingUp,
  Cpu,
  Eye,
  Layers,
  Zap,
  Play
} from 'lucide-react';
import { soundFX } from '../services/soundFX';

interface WelcomeLandingProps {
  onEnterDashboard: () => void;
  onOpenAuth: () => void;
}

export const WelcomeLanding: React.FC<WelcomeLandingProps> = ({ onEnterDashboard, onOpenAuth }) => {
  // Interactive poll state
  const [selectedVote, setSelectedVote] = useState<number | null>(null);
  const [voted, setVoted] = useState(false);
  const [voteStats, setVoteStats] = useState([
    { id: 1, text: 'Deploy the Quantum Googly Trap', votes: 64, pct: 64 },
    { id: 2, text: 'Hold standard off-stump length corridor', votes: 24, pct: 24 },
    { id: 3, text: 'Bring in boundary sweeper for slog sweep', votes: 12, pct: 12 },
  ]);

  // Audio preview playing state
  const [isPlayingLoreAudio, setIsPlayingLoreAudio] = useState(false);

  const handleVote = (id: number) => {
    soundFX.playClick();
    setSelectedVote(id);
    setVoted(true);
    setVoteStats(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, votes: item.votes + 1, pct: Math.min(100, item.pct + 2) }
          : { ...item, pct: Math.max(1, item.pct - 1) }
      )
    );
    soundFX.playSuccess();
  };

  const toggleLoreAudio = () => {
    if (!isPlayingLoreAudio) {
      soundFX.playPortal();
      setIsPlayingLoreAudio(true);
    } else {
      soundFX.playClick();
      setIsPlayingLoreAudio(false);
    }
  };

  return (
    <div className="space-y-12 pb-16">
      {/* Top Hero Section */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-[#1d182f] via-[#151026] to-[#100b21] p-6 sm:p-12 border border-purple-500/20 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2c273e]/80 border border-cyan-500/30 backdrop-blur-md shadow-inner">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-xs font-extrabold text-cyan-300 uppercase tracking-widest font-mono">
              GENESIS V2.4 CANON PROTOCOL &bull; DUBAI AI SHOWCASE
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Co-Create <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">Infinite Canon</span> With AI & Your Fandom
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            Step into an ethereal collaborative realm where live women's cricket telemetry ignites autonomous vertical micro-stories, 3D stadium physics, and conversational tactical co-piloting.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-4">
            <button
              onClick={() => {
                soundFX.playPortal();
                onEnterDashboard();
              }}
              className="px-6 py-3.5 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-purple-600/25 active:scale-95 transition-all flex items-center gap-2 hover:opacity-95"
            >
              <span>Launch Live Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                soundFX.playClick();
                onOpenAuth();
              }}
              className="px-6 py-3.5 rounded-full bg-[#211c33] hover:bg-[#2c273e] text-slate-200 font-bold text-xs sm:text-sm border border-slate-700 shadow-md transition-all active:scale-95 flex items-center gap-2"
            >
              <Cpu className="w-4 h-4 text-purple-400" />
              <span>Sign In / Lorekeeper Access</span>
            </button>
          </div>
        </div>
      </div>

      {/* Featured Fan-CoCreated Storyboards (Horizontal Snap Carousel) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Flame className="w-5 h-5 text-pink-400 animate-pulse" />
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Featured Multimodal Storyboards</h2>
              <p className="text-xs text-slate-400">Autonomous video-to-manga adaptations generated in real-time</p>
            </div>
          </div>
          <button
            onClick={() => {
              soundFX.playClick();
              onEnterDashboard();
            }}
            className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold"
          >
            <span>View All (28)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1 */}
          <div className="group relative rounded-2xl overflow-hidden bg-[#1a152e] border border-purple-500/30 hover:border-purple-400/70 transition-all duration-300 shadow-xl hover:shadow-purple-500/10 flex flex-col justify-between">
            <div className="relative h-44 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=800&q=80"
                alt="Cyber Valkyrie Smriti"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a152e] via-transparent to-black/40" />
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-purple-400/40 text-[10px] font-mono font-bold text-purple-300 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                AI MANGA REEL #049
              </div>
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
                <span className="font-bold flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5 text-cyan-400" /> 124.8K
                </span>
                <span className="bg-purple-600/80 px-2 py-0.5 rounded text-[10px] font-mono">CANONICAL</span>
              </div>
            </div>
            <div className="p-4 space-y-2.5">
              <h3 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                The Sharjah Mirage: Smriti's 140km/h Counter-Assault
              </h3>
              <p className="text-xs text-slate-400 line-clamp-2">
                Reconstructed from over 18 ball telemetry. Shonen manga aesthetic generated with Stable Diffusion XL LoRA and Hindi commentary synthesis.
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                <span className="font-mono text-cyan-400">Co-Authored: @AeroNova</span>
                <button
                  onClick={() => {
                    soundFX.playClick();
                    onEnterDashboard();
                  }}
                  className="hover:text-white flex items-center gap-1 text-purple-400 font-semibold"
                >
                  <Play className="w-3 h-3" /> Watch Story
                </button>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="group relative rounded-2xl overflow-hidden bg-[#1a152e] border border-pink-500/30 hover:border-pink-400/70 transition-all duration-300 shadow-xl hover:shadow-pink-500/10 flex flex-col justify-between">
            <div className="relative h-44 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80"
                alt="Quantum Yorker Breakdown"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a152e] via-transparent to-black/40" />
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-pink-400/40 text-[10px] font-mono font-bold text-pink-300 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-pink-400" />
                TACTICAL HUD REEL #112
              </div>
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
                <span className="font-bold flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5 text-cyan-400" /> 89.4K
                </span>
                <span className="bg-pink-600/80 px-2 py-0.5 rounded text-[10px] font-mono">PHYSICS-PINN</span>
              </div>
            </div>
            <div className="p-4 space-y-2.5">
              <h3 className="text-sm font-bold text-white group-hover:text-pink-300 transition-colors">
                Harmanpreet's Leg-Side Trap: Probability Breakdown
              </h3>
              <p className="text-xs text-slate-400 line-clamp-2">
                Deep Q-Learning MDP analysis explaining the placement of backward square leg and deep mid-wicket against Sophie Ecclestone.
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                <span className="font-mono text-cyan-400">Co-Authored: @StrategistX</span>
                <button
                  onClick={() => {
                    soundFX.playClick();
                    onEnterDashboard();
                  }}
                  className="hover:text-white flex items-center gap-1 text-pink-400 font-semibold"
                >
                  <Play className="w-3 h-3" /> Inspect Replay
                </button>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="group relative rounded-2xl overflow-hidden bg-[#1a152e] border border-cyan-500/30 hover:border-cyan-400/70 transition-all duration-300 shadow-xl hover:shadow-cyan-500/10 flex flex-col justify-between">
            <div className="relative h-44 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80"
                alt="Future Star Nepal"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a152e] via-transparent to-black/40" />
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-cyan-400/40 text-[10px] font-mono font-bold text-cyan-300 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                GRASSROOTS REEL #018
              </div>
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
                <span className="font-bold flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5 text-cyan-400" /> 51.2K
                </span>
                <span className="bg-cyan-600/80 px-2 py-0.5 rounded text-[10px] font-mono">MICRO-GRANT</span>
              </div>
            </div>
            <div className="p-4 space-y-2.5">
              <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                Kathmandu to Lord's: Puja Mahato's 5-Wicket Odyssey
              </h3>
              <p className="text-xs text-slate-400 line-clamp-2">
                Community-funded story highlighting Nepal U-19 fast bowler with direct micro-tipping passport integration.
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                <span className="font-mono text-cyan-400">Co-Authored: @HimalayanLore</span>
                <button
                  onClick={() => {
                    soundFX.playClick();
                    onEnterDashboard();
                  }}
                  className="hover:text-white flex items-center gap-1 text-cyan-400 font-semibold"
                >
                  <Play className="w-3 h-3" /> Tip Athlete
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Co-Creation Rooms (Active Hubs) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Radio className="w-5 h-5 text-cyan-400 animate-pulse" />
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Live Co-Creation Arenas</h2>
              <p className="text-xs text-slate-400">Real-time multiplayer rooms synthesizing match narratives</p>
            </div>
          </div>
          <span className="text-[11px] font-mono text-green-400 bg-green-500/10 px-2.5 py-1 rounded-full border border-green-500/30 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-ping" />
            3 ARENAS ACTIVE
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-[#1d182f] border border-slate-800 hover:border-purple-500/40 transition-all flex flex-col justify-between space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-600/30 text-purple-400 flex items-center justify-center font-bold text-xs">
                  #1
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Cyber-Valkyrie Writers</h4>
                  <span className="text-[11px] text-slate-400">Match: IND-W vs AUS-W (Finals)</span>
                </div>
              </div>
              <span className="text-xs font-mono text-purple-300 font-bold bg-purple-500/10 px-2 py-0.5 rounded">
                84 Creators
              </span>
            </div>
            <div className="space-y-1.5">
              <div className="text-[11px] text-slate-300 font-mono flex items-center gap-1.5">
                <span className="text-cyan-400">Current Scene:</span> Harmanpreet's reverse-sweep in 19th over
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-purple-500 to-cyan-400 h-full w-[78%]" />
              </div>
            </div>
            <button
              onClick={() => {
                soundFX.playPortal();
                onEnterDashboard();
              }}
              className="w-full py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white font-bold text-xs transition-all border border-purple-500/30"
            >
              Join Co-Creation Session
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-[#1d182f] border border-slate-800 hover:border-pink-500/40 transition-all flex flex-col justify-between space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-pink-600/30 text-pink-400 flex items-center justify-center font-bold text-xs">
                  #2
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Tactical Analysis Guild</h4>
                  <span className="text-[11px] text-slate-400">Field Geometry & Spin Trajectories</span>
                </div>
              </div>
              <span className="text-xs font-mono text-pink-300 font-bold bg-pink-500/10 px-2 py-0.5 rounded">
                126 Creators
              </span>
            </div>
            <div className="space-y-1.5">
              <div className="text-[11px] text-slate-300 font-mono flex items-center gap-1.5">
                <span className="text-pink-400">Current Scene:</span> PINN aerodynamic drift on 62km/h leg break
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-pink-500 to-amber-400 h-full w-[92%]" />
              </div>
            </div>
            <button
              onClick={() => {
                soundFX.playPortal();
                onEnterDashboard();
              }}
              className="w-full py-2 rounded-xl bg-pink-600/20 hover:bg-pink-600 text-pink-300 hover:text-white font-bold text-xs transition-all border border-pink-500/30"
            >
              Join Co-Creation Session
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-[#1d182f] border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-cyan-600/30 text-cyan-400 flex items-center justify-center font-bold text-xs">
                  #3
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Grassroots Spotlight Studio</h4>
                  <span className="text-[11px] text-slate-400">Nepal, Thailand & Scotland Stars</span>
                </div>
              </div>
              <span className="text-xs font-mono text-cyan-300 font-bold bg-cyan-500/10 px-2 py-0.5 rounded">
                62 Creators
              </span>
            </div>
            <div className="space-y-1.5">
              <div className="text-[11px] text-slate-300 font-mono flex items-center gap-1.5">
                <span className="text-cyan-400">Current Scene:</span> Crowdsourced grant milestone 5,000 Sparks
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-cyan-500 to-green-400 h-full w-[65%]" />
              </div>
            </div>
            <button
              onClick={() => {
                soundFX.playPortal();
                onEnterDashboard();
              }}
              className="w-full py-2 rounded-xl bg-cyan-600/20 hover:bg-cyan-600 text-cyan-300 hover:text-white font-bold text-xs transition-all border border-cyan-500/30"
            >
              Join Co-Creation Session
            </button>
          </div>
        </div>
      </section>

      {/* Two-Column Section: Interactive Lore Poll & Trending Multimodal Audio Reel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Community Lore Vote Poll */}
        <div className="p-6 rounded-3xl bg-[#1a152e] border border-purple-500/30 shadow-xl space-y-5 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-purple-400 flex items-center gap-1.5">
                <Vote className="w-4 h-4" /> CANON GOVERNANCE PROPOSAL #88
              </span>
              <span className="text-[10px] font-mono text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                CLOSES IN 04:18:22
              </span>
            </div>
            <h3 className="text-lg font-extrabold text-white">
              Tactical Dilemma: What should captain Harmanpreet bowl in Over 19.4?
            </h3>
            <p className="text-xs text-slate-400">
              The winning choice determines the generated shonen anime climax and unlocks double fan Sparks for tactical voters.
            </p>
          </div>

          <div className="space-y-2.5">
            {voteStats.map(opt => (
              <button
                key={opt.id}
                onClick={() => handleVote(opt.id)}
                className={`w-full p-3.5 rounded-xl border text-left transition-all relative overflow-hidden flex items-center justify-between group ${
                  selectedVote === opt.id
                    ? 'bg-purple-900/40 border-purple-400 text-white'
                    : 'bg-[#151026] border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                {/* Visual percentage bar fill */}
                {voted && (
                  <div
                    className="absolute top-0 bottom-0 left-0 bg-purple-600/20 transition-all duration-700 pointer-events-none"
                    style={{ width: `${opt.pct}%` }}
                  />
                )}
                <div className="relative z-10 flex items-center gap-3">
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      selectedVote === opt.id
                        ? 'border-purple-400 bg-purple-500 text-white'
                        : 'border-slate-600'
                    }`}
                  >
                    {selectedVote === opt.id && <CheckCircle2 className="w-3 h-3 text-white" />}
                  </div>
                  <span className="text-xs font-semibold">{opt.text}</span>
                </div>
                <div className="relative z-10 flex items-center gap-2 font-mono text-xs font-bold text-purple-300">
                  <span>{opt.pct}%</span>
                </div>
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
            <span>Total community votes: 3,489</span>
            <span className="text-cyan-400 font-mono font-bold">+50 Sparks Upon Voting</span>
          </div>
        </div>

        {/* Trending Multimodal Audio Player Card */}
        <div className="p-6 rounded-3xl bg-[#1a152e] border border-cyan-500/30 shadow-xl space-y-5 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400 flex items-center gap-1.5">
                <Volume2 className="w-4 h-4" /> MULTILINGUAL AI COMMENTARY SYNTH
              </span>
              <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                12 DIALECTS READY
              </span>
            </div>
            <h3 className="text-lg font-extrabold text-white">
              Bengali & Tamil Voice Synthesis: "The Six That Shook Sharjah"
            </h3>
            <p className="text-xs text-slate-400">
              Listen to the neural voice clone adapting intensity, crowd roar acoustics, and pitch cadence dynamically based on win probability shifts.
            </p>
          </div>

          {/* Simulated Waveform & Player */}
          <div className="p-4 rounded-2xl bg-[#130e24] border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span className="text-purple-400 font-bold">WAV: SHARJAH_OVER19_SYNTH.FLAC</span>
              <span>01:14 / 02:45</span>
            </div>

            {/* Audio Waveform Bars */}
            <div className="flex items-center gap-1 h-12 justify-between px-1">
              {[40, 70, 25, 90, 60, 45, 80, 100, 65, 30, 85, 95, 40, 60, 75, 90, 50, 70, 85, 40, 95, 70, 55, 30].map(
                (h, idx) => (
                  <div
                    key={idx}
                    className={`w-1.5 rounded-full transition-all duration-300 ${
                      isPlayingLoreAudio
                        ? 'bg-gradient-to-t from-purple-500 to-cyan-400 animate-pulse'
                        : 'bg-slate-700'
                    }`}
                    style={{
                      height: isPlayingLoreAudio ? `${Math.max(20, (h * (idx % 2 === 0 ? 1 : 0.8)))}%` : `${h * 0.4}%`,
                      animationDelay: `${idx * 40}ms`
                    }}
                  />
                )
              )}
            </div>

            {/* Audio Control Row */}
            <div className="flex items-center justify-between pt-1">
              <button
                onClick={toggleLoreAudio}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-purple-600/20 active:scale-95 transition-all"
              >
                {isPlayingLoreAudio ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                    <span>Pause Stream</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Preview Neural Voice</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => soundFX.playClick()}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all"
                  title="Bookmark Reel"
                >
                  <Bookmark className="w-4 h-4" />
                </button>
                <button
                  onClick={() => soundFX.playClick()}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all"
                  title="Share Stream"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
            <span>Model: ElevenLabs Multilingual V2 + Gemini Flash</span>
            <span className="text-cyan-400 font-mono font-bold">Latency: 280ms</span>
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

      {/* Relic Codex & Multiverse Branches Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-pink-400">
              ARCHIVES & RELIC NODES
            </span>
            <h2 className="text-xl font-bold text-white mt-0.5">Canonical Sport Artefacts & Timeline Trees</h2>
          </div>
          <span className="text-xs font-mono text-slate-400">Total Artifacts: 1,420</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-[#161129] border border-slate-800 hover:border-purple-500/40 transition-all space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white">What-If Branch #44</h4>
            <p className="text-xs text-slate-400">Alternative history where Sophie Devine opened the bowling with leg-spin.</p>
            <span className="text-[10px] font-mono text-purple-300 block">34 Branching Stories</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#161129] border border-slate-800 hover:border-pink-500/40 transition-all space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-pink-500/10 text-pink-400 flex items-center justify-center font-bold">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white">Hawk-Eye Spin Relic</h4>
            <p className="text-xs text-slate-400">3D mathematical trajectory token signed by ICC telemetric feed.</p>
            <span className="text-[10px] font-mono text-pink-300 block">Rare NFT Artifact</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#161129] border border-slate-800 hover:border-cyan-500/40 transition-all space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold">
              <Zap className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white">Clutch Over Master</h4>
            <p className="text-xs text-slate-400">Fan badge minted for correctly forecasting the penultimate over yorker.</p>
            <span className="text-[10px] font-mono text-cyan-300 block">Awarded to 418 Fans</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#161129] border border-slate-800 hover:border-amber-500/40 transition-all space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
              <Cpu className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white">Quantum Physics Node</h4>
            <p className="text-xs text-slate-400">Run physics-informed neural network tests on any historical delivery.</p>
            <span className="text-[10px] font-mono text-amber-300 block">Interactive Simulator</span>
          </div>
        </div>
      </section>

      {/* Community Stats Bar */}
      <div className="p-6 rounded-2xl bg-[#1d182f] border border-slate-800 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="flex -space-x-2.5">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white font-bold text-xs ring-2 ring-[#1d182f]">
              K
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-pink-600 to-amber-500 flex items-center justify-center text-white font-bold text-xs ring-2 ring-[#1d182f]">
              M
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center text-white font-bold text-xs ring-2 ring-[#1d182f]">
              Z
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-cyan-300 font-bold text-xs ring-2 ring-[#1d182f]">
              +8k
            </div>
          </div>
          <div>
            <span className="text-sm font-bold text-white block">140,000+ Fan Co-Creators Globally</span>
            <span className="text-xs text-slate-400">Active across 850+ canonical women's cricket tournaments & story arcs</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 bg-cyan-500/10 px-3.5 py-2 rounded-full border border-cyan-500/20">
            <ShieldCheck className="w-4 h-4" />
            <span>Verified ICC Canon Ledger #8802</span>
          </div>
          <button
            onClick={() => {
              soundFX.playPortal();
              onEnterDashboard();
            }}
            className="px-4 py-2 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-all shadow-md active:scale-95"
          >
            Enter Now
          </button>
        </div>
      </div>
    </div>
  );
};

