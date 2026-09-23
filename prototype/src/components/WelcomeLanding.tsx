import React, { useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
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
  Play,
  Disc3
} from 'lucide-react';
import { soundFX } from '../services/soundFX';
import { useLanguage } from '../context/LanguageContext';

interface WelcomeLandingProps {
  onEnterDashboard: () => void;
  onOpenAuth: () => void;
}

export const WelcomeLanding: React.FC<WelcomeLandingProps> = ({ onEnterDashboard, onOpenAuth }) => {
  const { t } = useLanguage();

  const getPollOptionText = (id: number) => {
    if (id === 1) return t('poll.opt1');
    if (id === 2) return t('poll.opt2');
    return t('poll.opt3');
  };

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
    // Confetti celebration burst
    try {
      confetti({
        particleCount: 75,
        spread: 65,
        origin: { y: 0.7 },
        colors: ['#a855f7', '#ec4899', '#06b6d4', '#10b981', '#f59e0b']
      });
    } catch (e) {
      console.log('Confetti trigger', e);
    }
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
      {/* Top Hero Section with 3D Holographic Visuals */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-[#1e1538] via-[#140e28] to-[#0c071d] p-6 sm:p-12 border border-purple-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.15)]"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none glow-ambient" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-600/20 rounded-full blur-3xl pointer-events-none glow-ambient" style={{ animationDelay: '-3s' }} />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#271b45]/90 border border-cyan-400/40 backdrop-blur-md shadow-inner">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span className="text-xs font-extrabold text-cyan-300 uppercase tracking-widest font-mono">
                {t('hero.badge')}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
              {t('hero.title_pre')}{' '}
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_2px_12px_rgba(168,85,247,0.4)]">
                {t('hero.title_gradient')}
              </span>{' '}
              {t('hero.title_post')}
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl font-medium">
              {t('hero.desc')}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-4">
              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => {
                  soundFX.playPortal();
                  onEnterDashboard();
                }}
                className="px-6 py-3.5 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 text-white font-black text-xs sm:text-sm shadow-xl shadow-purple-600/30 transition-all flex items-center gap-2 shimmer-effect"
              >
                <span>{t('hero.cta_dashboard')}</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => {
                  soundFX.playClick();
                  onOpenAuth();
                }}
                className="px-6 py-3.5 rounded-full bg-[#21173d] hover:bg-[#2e2054] text-slate-200 font-bold text-xs sm:text-sm border border-purple-500/40 shadow-lg transition-all flex items-center gap-2"
              >
                <Cpu className="w-4 h-4 text-purple-400" />
                <span>{t('hero.cta_auth')}</span>
              </motion.button>
            </div>
          </div>

          {/* Right Floating 3D Holographic Sphere / Badge */}
          <div className="hidden lg:flex flex-col items-center justify-center relative flex-shrink-0 animate-float-slow">
            <div className="relative w-52 h-52 rounded-full p-2 bg-gradient-to-tr from-cyan-500 via-purple-600 to-pink-500 shadow-[0_0_40px_rgba(168,85,247,0.4)]">
              <div className="w-full h-full rounded-full bg-[#120a26] flex flex-col items-center justify-center p-6 text-center border border-white/10 relative overflow-hidden">
                <div className="cyber-scanline opacity-60" />
                <Sparkles className="w-10 h-10 text-cyan-300 drop-shadow-[0_0_12px_rgba(6,182,212,0.8)] mb-2 animate-pulse" />
                <span className="text-white font-black text-sm uppercase tracking-wider">AURA 3D Mesh</span>
                <span className="text-[11px] font-mono text-cyan-400 mt-1">ICC Canon V5.2</span>
                <span className="text-[10px] text-pink-300 font-bold mt-1">60 FPS WebGL</span>
              </div>
            </div>
            <div className="absolute -bottom-3 px-3 py-1 rounded-full bg-[#1b1035] border border-cyan-400/40 text-[10px] font-mono text-cyan-300 shadow-md">
              ⚡ LIVE SYNAPSE MESH
            </div>
          </div>
        </div>
      </motion.div>

      {/* Featured Fan-CoCreated Storyboards */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Flame className="w-5 h-5 text-pink-400 animate-pulse" />
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">{t('featured.title')}</h2>
              <p className="text-xs text-slate-400">{t('featured.subtitle')}</p>
            </div>
          </div>
          <button
            onClick={() => {
              soundFX.playClick();
              onEnterDashboard();
            }}
            className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold group"
          >
            <span>{t('featured.view_all')}</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1 */}
          <motion.div
            whileHover={{ y: -8, scale: 1.015 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="group relative rounded-2xl overflow-hidden bg-[#18112c] border border-purple-500/30 hover:border-purple-400 transition-all duration-300 shadow-xl hover:shadow-[0_12px_30px_rgba(168,85,247,0.25)] flex flex-col justify-between"
          >
            <div className="relative h-44 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=800&q=80"
                alt="Cyber Valkyrie Smriti"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#18112c] via-transparent to-black/40" />
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-purple-400/40 text-[10px] font-mono font-bold text-purple-300 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping" />
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
                {t('featured.card1_title')}
              </h3>
              <p className="text-xs text-slate-400 line-clamp-2">
                {t('featured.card1_desc')}
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
                  <Play className="w-3 h-3 fill-current" /> {t('featured.card1_watch')}
                </button>
              </div>
            </div>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            whileHover={{ y: -8, scale: 1.015 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="group relative rounded-2xl overflow-hidden bg-[#18112c] border border-pink-500/30 hover:border-pink-400 transition-all duration-300 shadow-xl hover:shadow-[0_12px_30px_rgba(236,72,153,0.25)] flex flex-col justify-between"
          >
            <div className="relative h-44 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80"
                alt="Quantum Yorker Breakdown"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#18112c] via-transparent to-black/40" />
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-pink-400/40 text-[10px] font-mono font-bold text-pink-300 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-ping" />
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
                {t('featured.card2_title')}
              </h3>
              <p className="text-xs text-slate-400 line-clamp-2">
                {t('featured.card2_desc')}
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
                  <Play className="w-3 h-3 fill-current" /> {t('featured.card2_inspect')}
                </button>
              </div>
            </div>
          </motion.div>

          {/* Card 3 */}
          <motion.div
            whileHover={{ y: -8, scale: 1.015 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="group relative rounded-2xl overflow-hidden bg-[#18112c] border border-cyan-500/30 hover:border-cyan-400 transition-all duration-300 shadow-xl hover:shadow-[0_12px_30px_rgba(6,182,212,0.25)] flex flex-col justify-between"
          >
            <div className="relative h-44 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80"
                alt="Future Star Nepal"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#18112c] via-transparent to-black/40" />
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-cyan-400/40 text-[10px] font-mono font-bold text-cyan-300 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
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
                {t('featured.card3_title')}
              </h3>
              <p className="text-xs text-slate-400 line-clamp-2">
                {t('featured.card3_desc')}
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
                  <Play className="w-3 h-3 fill-current" /> {t('featured.card3_tip')}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Live Co-Creation Rooms */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Radio className="w-5 h-5 text-cyan-400 animate-pulse" />
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">{t('arenas.title')}</h2>
              <p className="text-xs text-slate-400">{t('arenas.subtitle')}</p>
            </div>
          </div>
          <span className="text-[11px] font-mono text-green-400 bg-green-500/10 px-2.5 py-1 rounded-full border border-green-500/30 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-ping" />
            {t('arenas.active_badge')}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div
            whileHover={{ y: -6 }}
            className="p-4 rounded-2xl bg-[#1a1233] border border-purple-500/30 hover:border-purple-400 transition-all flex flex-col justify-between space-y-3 shadow-lg"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-600/30 text-purple-400 flex items-center justify-center font-bold text-xs">
                  #1
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{t('arenas.room1_title')}</h4>
                  <span className="text-[11px] text-slate-400">{t('arenas.room1_sub')}</span>
                </div>
              </div>
              <span className="text-xs font-mono text-purple-300 font-bold bg-purple-500/10 px-2 py-0.5 rounded">
                {t('arenas.room1_creators')}
              </span>
            </div>
            <div className="space-y-1.5">
              <div className="text-[11px] text-slate-300 font-mono flex items-center gap-1.5">
                {t('arenas.room1_scene')}
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '78%' }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                  className="bg-gradient-to-r from-purple-500 to-cyan-400 h-full"
                />
              </div>
            </div>
            <button
              onClick={() => {
                soundFX.playPortal();
                onEnterDashboard();
              }}
              className="w-full py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white font-bold text-xs transition-all border border-purple-500/30 active:scale-95"
            >
              {t('arenas.join_btn')}
            </button>
          </motion.div>

          <motion.div
            whileHover={{ y: -6 }}
            className="p-4 rounded-2xl bg-[#1a1233] border border-pink-500/30 hover:border-pink-400 transition-all flex flex-col justify-between space-y-3 shadow-lg"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-pink-600/30 text-pink-400 flex items-center justify-center font-bold text-xs">
                  #2
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{t('arenas.room2_title')}</h4>
                  <span className="text-[11px] text-slate-400">{t('arenas.room2_sub')}</span>
                </div>
              </div>
              <span className="text-xs font-mono text-pink-300 font-bold bg-pink-500/10 px-2 py-0.5 rounded">
                {t('arenas.room2_creators')}
              </span>
            </div>
            <div className="space-y-1.5">
              <div className="text-[11px] text-slate-300 font-mono flex items-center gap-1.5">
                {t('arenas.room2_scene')}
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '92%' }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                  className="bg-gradient-to-r from-pink-500 to-amber-400 h-full"
                />
              </div>
            </div>
            <button
              onClick={() => {
                soundFX.playPortal();
                onEnterDashboard();
              }}
              className="w-full py-2 rounded-xl bg-pink-600/20 hover:bg-pink-600 text-pink-300 hover:text-white font-bold text-xs transition-all border border-pink-500/30 active:scale-95"
            >
              {t('arenas.join_btn')}
            </button>
          </motion.div>

          <motion.div
            whileHover={{ y: -6 }}
            className="p-4 rounded-2xl bg-[#1a1233] border border-cyan-500/30 hover:border-cyan-400 transition-all flex flex-col justify-between space-y-3 shadow-lg"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-cyan-600/30 text-cyan-400 flex items-center justify-center font-bold text-xs">
                  #3
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{t('arenas.room3_title')}</h4>
                  <span className="text-[11px] text-slate-400">{t('arenas.room3_sub')}</span>
                </div>
              </div>
              <span className="text-xs font-mono text-cyan-300 font-bold bg-cyan-500/10 px-2 py-0.5 rounded">
                {t('arenas.room3_creators')}
              </span>
            </div>
            <div className="space-y-1.5">
              <div className="text-[11px] text-slate-300 font-mono flex items-center gap-1.5">
                {t('arenas.room3_scene')}
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '65%' }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                  className="bg-gradient-to-r from-cyan-500 to-green-400 h-full"
                />
              </div>
            </div>
            <button
              onClick={() => {
                soundFX.playPortal();
                onEnterDashboard();
              }}
              className="w-full py-2 rounded-xl bg-cyan-600/20 hover:bg-cyan-600 text-cyan-300 hover:text-white font-bold text-xs transition-all border border-cyan-500/30 active:scale-95"
            >
              {t('arenas.join_btn')}
            </button>
          </motion.div>
        </div>
      </section>

      {/* Two-Column Section: Interactive Lore Poll & Trending Multimodal Audio Reel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Community Lore Vote Poll */}
        <div className="p-6 rounded-3xl bg-[#191130] border border-purple-500/30 shadow-xl space-y-5 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-purple-400 flex items-center gap-1.5">
                <Vote className="w-4 h-4" /> {t('poll.badge')}
              </span>
              <span className="text-[10px] font-mono text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                {t('poll.closes')}
              </span>
            </div>
            <h3 className="text-lg font-extrabold text-white">
              {t('poll.title')}
            </h3>
            <p className="text-xs text-slate-400">
              {t('poll.desc')}
            </p>
          </div>

          <div className="space-y-2.5">
            {voteStats.map(opt => (
              <button
                key={opt.id}
                onClick={() => handleVote(opt.id)}
                className={`w-full p-3.5 rounded-xl border text-left transition-all relative overflow-hidden flex items-center justify-between group active:scale-[0.99] ${
                  selectedVote === opt.id
                    ? 'bg-purple-900/50 border-purple-400 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                    : 'bg-[#130d24] border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                {/* Visual percentage bar fill with Framer Motion spring */}
                {voted && (
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${opt.pct}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="absolute top-0 bottom-0 left-0 bg-purple-600/25 pointer-events-none"
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
                  <span className="text-xs font-semibold">{getPollOptionText(opt.id)}</span>
                </div>
                <div className="relative z-10 flex items-center gap-2 font-mono text-xs font-bold text-purple-300">
                  <span>{opt.pct}%</span>
                </div>
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
            <span>{t('poll.total_votes')}</span>
            <span className="text-cyan-400 font-mono font-bold">{t('poll.sparks_reward')}</span>
          </div>
        </div>

        {/* Trending Multimodal Audio Player Card with Dancing Waveform */}
        <div className="p-6 rounded-3xl bg-[#191130] border border-cyan-500/30 shadow-xl space-y-5 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400 flex items-center gap-1.5">
                <Volume2 className="w-4 h-4" /> {t('audio.badge')}
              </span>
              <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                {t('audio.dialects')}
              </span>
            </div>
            <h3 className="text-lg font-extrabold text-white">
              {t('audio.title')}
            </h3>
            <p className="text-xs text-slate-400">
              {t('audio.desc')}
            </p>
          </div>

          {/* Animated Waveform & Player */}
          <div className="p-4 rounded-2xl bg-[#120a24] border border-slate-800/80 space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span className="text-purple-400 font-bold flex items-center gap-1.5">
                <Disc3 className={`w-3.5 h-3.5 ${isPlayingLoreAudio ? 'animate-spin text-cyan-400' : ''}`} />
                WAV: SHARJAH_OVER19_SYNTH.FLAC
              </span>
              <span>01:14 / 02:45</span>
            </div>

            {/* Audio Waveform Equalizer Bars */}
            <div className="flex items-center gap-1 h-14 justify-between px-1">
              {[1, 2, 3, 4, 5, 2, 1, 4, 3, 5, 2, 4, 1, 3, 5, 2, 4, 1, 3, 5, 2, 4, 1, 3].map(
                (barNum, idx) => (
                  <div
                    key={idx}
                    className={`w-1.5 rounded-full transition-all duration-300 ${
                      isPlayingLoreAudio
                        ? `bg-gradient-to-t from-purple-500 via-pink-500 to-cyan-400 wave-bar-${barNum}`
                        : 'bg-slate-700/60 h-3'
                    }`}
                    style={
                      isPlayingLoreAudio
                        ? { animationDelay: `${(idx % 5) * 0.12}s` }
                        : { height: '30%' }
                    }
                  />
                )
              )}
            </div>

            {/* Audio Control Row */}
            <div className="flex items-center justify-between pt-1">
              <button
                onClick={toggleLoreAudio}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-purple-600/20 active:scale-95 transition-all shimmer-effect"
              >
                {isPlayingLoreAudio ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                    <span>{t('audio.pause')}</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{t('audio.preview')}</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => soundFX.playClick()}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all active:scale-95"
                  title="Bookmark Reel"
                >
                  <Bookmark className="w-4 h-4" />
                </button>
                <button
                  onClick={() => soundFX.playClick()}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all active:scale-95"
                  title="Share Stream"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
            <span>Model: ElevenLabs Multilingual V2 + Gemini Flash</span>
            <span className="text-cyan-400 font-mono font-bold">{t('audio.latency')}</span>
          </div>
        </div>
      </div>

      {/* Pillars of Creation (Feature Grid) */}
      <div className="space-y-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 font-mono">
            {t('pillars.tag')}
          </span>
          <h2 className="text-2xl font-bold text-white mt-1">{t('pillars.title')}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <motion.div
            whileHover={{ y: -6, scale: 1.01 }}
            className="p-6 rounded-2xl bg-[#1a1233] border border-purple-500/20 shadow-xl space-y-3 flex flex-col justify-between"
          >
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">{t('pillars.p1_title')}</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {t('pillars.p1_desc')}
              </p>
            </div>
            <span className="text-[11px] font-bold text-purple-300 font-mono">Sub-45s Latency</span>
          </motion.div>

          <motion.div
            whileHover={{ y: -6, scale: 1.01 }}
            className="p-6 rounded-2xl bg-[#1a1233] border border-pink-500/20 shadow-xl space-y-3 flex flex-col justify-between"
          >
            <div className="w-12 h-12 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">{t('pillars.p2_title')}</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {t('pillars.p2_desc')}
              </p>
            </div>
            <span className="text-[11px] font-bold text-pink-300 font-mono">Real-Time Coordinate Radar</span>
          </motion.div>

          <motion.div
            whileHover={{ y: -6, scale: 1.01 }}
            className="p-6 rounded-2xl bg-[#1a1233] border border-cyan-500/20 shadow-xl space-y-3 flex flex-col justify-between"
          >
            <div className="w-12 h-12 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">{t('pillars.p3_title')}</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {t('pillars.p3_desc')}
              </p>
            </div>
            <span className="text-[11px] font-bold text-cyan-300 font-mono">Direct Athlete Passports</span>
          </motion.div>
        </div>
      </div>

      {/* Relic Codex & Multiverse Branches Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-pink-400">
              {t('codex.tag')}
            </span>
            <h2 className="text-xl font-bold text-white mt-0.5">{t('codex.title')}</h2>
          </div>
          <span className="text-xs font-mono text-slate-400">{t('codex.total')}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div
            whileHover={{ y: -5 }}
            className="p-4 rounded-2xl bg-[#150f29] border border-slate-800 hover:border-purple-500/40 transition-all space-y-2.5"
          >
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white">{t('codex.card1_title')}</h4>
            <p className="text-xs text-slate-400">{t('codex.card1_desc')}</p>
            <span className="text-[10px] font-mono text-purple-300 block">34 Branching Stories</span>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="p-4 rounded-2xl bg-[#150f29] border border-slate-800 hover:border-pink-500/40 transition-all space-y-2.5"
          >
            <div className="w-9 h-9 rounded-xl bg-pink-500/10 text-pink-400 flex items-center justify-center font-bold">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white">{t('codex.card2_title')}</h4>
            <p className="text-xs text-slate-400">{t('codex.card2_desc')}</p>
            <span className="text-[10px] font-mono text-pink-300 block">Rare NFT Artifact</span>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="p-4 rounded-2xl bg-[#150f29] border border-slate-800 hover:border-cyan-500/40 transition-all space-y-2.5"
          >
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold">
              <Zap className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white">{t('codex.card3_title')}</h4>
            <p className="text-xs text-slate-400">{t('codex.card3_desc')}</p>
            <span className="text-[10px] font-mono text-cyan-300 block">Awarded to 418 Fans</span>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="p-4 rounded-2xl bg-[#150f29] border border-slate-800 hover:border-amber-500/40 transition-all space-y-2.5"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
              <Cpu className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white">{t('codex.card4_title')}</h4>
            <p className="text-xs text-slate-400">{t('codex.card4_desc')}</p>
            <span className="text-[10px] font-mono text-amber-300 block">Interactive Simulator</span>
          </motion.div>
        </div>
      </section>

      {/* Community Stats Bar with Confetti and Glow */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="p-6 rounded-2xl bg-[#1a1233] border border-purple-500/20 flex flex-wrap items-center justify-between gap-4 shadow-xl"
      >
        <div className="flex items-center gap-4">
          <div className="flex -space-x-2.5">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white font-bold text-xs ring-2 ring-[#1a1233]">
              K
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-pink-600 to-amber-500 flex items-center justify-center text-white font-bold text-xs ring-2 ring-[#1a1233]">
              M
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center text-white font-bold text-xs ring-2 ring-[#1a1233]">
              Z
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-cyan-300 font-bold text-xs ring-2 ring-[#1a1233]">
              +8k
            </div>
          </div>
          <div>
            <span className="text-sm font-bold text-white block">{t('community.creators')}</span>
            <span className="text-xs text-slate-400">{t('community.active_desc')}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 bg-cyan-500/10 px-3.5 py-2 rounded-full border border-cyan-500/20">
            <ShieldCheck className="w-4 h-4" />
            <span>{t('community.verified')}</span>
          </div>
          <button
            onClick={() => {
              soundFX.playPortal();
              onEnterDashboard();
            }}
            className="px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-95 text-white font-bold text-xs transition-all shadow-md active:scale-95 shimmer-effect"
          >
            {t('community.enter')}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
