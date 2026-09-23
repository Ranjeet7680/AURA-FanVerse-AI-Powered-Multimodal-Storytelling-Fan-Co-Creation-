import React, { useState } from 'react';
import {
  Play,
  Volume2,
  Share2,
  Sparkles,
  Zap,
  ChevronRight,
  MessageSquareQuote,
  TrendingUp,
  ExternalLink,
  Tv,
  Layers,
  Video,
  Clock,
  Eye,
  Film
} from 'lucide-react';
import { MOCK_REELS, MOCK_LONG_VIDEOS, type MicroReel, type LongMatchVideo } from '../data/mockMatchData';
import { soundFX } from '../services/soundFX';
import { useLanguage } from '../context/LanguageContext';

interface MicroNarrativesProps {
  selectedLang?: string;
}

export const MicroNarratives: React.FC<MicroNarrativesProps> = ({ selectedLang }) => {
  const { language, t, getSpeechLangCode } = useLanguage();
  const activeLang = selectedLang || language;
  const [mediaFormat, setMediaFormat] = useState<'shorts' | 'long'>('shorts');
  const [selectedReel, setSelectedReel] = useState<MicroReel>(MOCK_REELS[0]);
  const [selectedLongVideo, setSelectedLongVideo] = useState<LongMatchVideo>(MOCK_LONG_VIDEOS[0]);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'interactive' | 'embed'>('embed');

  const categories = ['All', 'Masterclass', 'Pace Attack', 'Clutch Defense', 'Captaincy', 'Fielding', 'Spin Magic', 'Power Hitting', 'Death Bowling', 'Grassroots Talent', 'Wicketkeeping', 'Final Moments'];

  const categoryKeys: Record<string, string> = {
    'All': 'shorts.all',
    'Masterclass': 'shorts.cat_masterclass',
    'Pace Attack': 'shorts.cat_pace',
    'Clutch Defense': 'shorts.cat_clutch',
    'Captaincy': 'shorts.cat_captaincy',
    'Fielding': 'shorts.cat_fielding',
    'Spin Magic': 'shorts.cat_spin',
    'Power Hitting': 'shorts.cat_power',
    'Death Bowling': 'shorts.cat_death',
    'Grassroots Talent': 'shorts.cat_grassroots',
    'Wicketkeeping': 'shorts.cat_wicketkeeping',
    'Final Moments': 'shorts.cat_final',
  };

  // Speech synthesis simulation for multi-language audio commentary
  const handlePlayVoice = (text: string) => {
    soundFX.playClick();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      if (isSpeaking) {
        setIsSpeaking(false);
        return;
      }
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = getSpeechLangCode();
      utterance.rate = 1.05;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSelectReel = (reel: MicroReel) => {
    soundFX.playClick();
    setSelectedReel(reel);
  };

  const filteredReels =
    activeCategory === 'All'
      ? MOCK_REELS
      : MOCK_REELS.filter((r) => r.category === activeCategory);

  const currentCaption = selectedReel.caption[activeLang] || selectedReel.caption[language] || selectedReel.caption['en'];

  return (
    <div className="space-y-6">
      {/* Top Banner / Feature Callout */}
      <div className="bg-gradient-to-r from-purple-900/40 via-indigo-900/30 to-slate-900 border border-purple-500/20 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center space-x-2 text-purple-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>{t('shorts.badge', 'Autonomous Multimodal Highlight Pipeline')}</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            {t('shorts.title', 'Vertical Micro-Narratives & Multi-Language Synthesis')}
          </h2>
          <p className="text-sm text-slate-300 max-w-2xl mt-1">
            {t('shorts.desc', 'Raw ICC broadcast video converted into 9:16 vertical storytelling reels in under 45 seconds with automated ball telemetry, tactical annotations, and commentary in 12+ languages.')}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="px-3 py-1.5 rounded-xl bg-purple-500/20 border border-purple-400/30 text-purple-300 text-xs font-medium flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-yellow-400" />
            {t('shorts.edge_ingestion', 'Edge Ingestion: 38s')}
          </span>
          {/* Format Switcher: 9:16 Shorts vs 16:9 Long Videos */}
          <div className="flex items-center p-1 rounded-xl bg-[#120d22] border border-cyan-500/30">
            <button
              onClick={() => {
                soundFX.playClick();
                setMediaFormat('shorts');
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                mediaFormat === 'shorts'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              <span>{t('shorts.tab_shorts', '9:16 Shorts')} ({MOCK_REELS.length})</span>
            </button>
            <button
              onClick={() => {
                soundFX.playClick();
                setMediaFormat('long');
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                mediaFormat === 'long'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>{t('shorts.tab_long', '16:9 Full Match')} ({MOCK_LONG_VIDEOS.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* LONG MATCH VIDEO EXPERIENCE (When mediaFormat === 'long') */}
      {mediaFormat === 'long' ? (
        <div className="space-y-6">
          {/* Full-width 16:9 Theater Player */}
          <div className="rounded-3xl overflow-hidden bg-[#161129] border border-cyan-500/30 shadow-2xl">
            <div className="aspect-video w-full bg-black relative">
              <iframe
                src={`https://www.youtube.com/embed/${selectedLongVideo.youtubeId}?autoplay=1&mute=0&rel=0&controls=1`}
                title={selectedLongVideo.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Video Meta Info Bar */}
            <div className="p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      {selectedLongVideo.badge}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {selectedLongVideo.channel}
                    </span>
                  </div>
                  <h3 className="text-xl font-extrabold text-white">
                    {selectedLongVideo.title}
                  </h3>
                </div>

                <div className="flex items-center gap-3">
                  <a
                    href={`https://youtu.be/${selectedLongVideo.youtubeId}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-xl bg-[#211c33] hover:bg-[#2c273e] text-cyan-300 text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition-all"
                  >
                    <span>Watch on YouTube</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <button
                    onClick={() => soundFX.playClick()}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md active:scale-95"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share Broadcast</span>
                  </button>
                </div>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed">
                {selectedLongVideo.description}
              </p>

              {/* Tactical Breakdown Pill */}
              <div className="p-4 rounded-2xl bg-[#100b21] border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    AI Deep-Dive Match Architecture Note
                  </span>
                  <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                    Confidence: 99.1%
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {selectedLongVideo.tacticalAnalysis}
                </p>
              </div>

              {/* Key Match Chapters / Moments */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                  Indexed Tactical Chapters:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {selectedLongVideo.keyMoments.map((km, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-[#1a142c] border border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="text-pink-400 font-mono font-bold block">{km.timestamp}</span>
                        <span className="text-white font-medium">{km.title}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono bg-slate-800 px-2 py-0.5 rounded">
                        {km.over}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Full Match Playlist Grid (All 4 Videos) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-bold text-white flex items-center gap-2">
                <Video className="w-5 h-5 text-cyan-400" />
                <span>Extended Match Analyses & Documentaries ({MOCK_LONG_VIDEOS.length})</span>
              </h4>
              <span className="text-xs text-slate-400">16:9 Widescreen Stream Feeds</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {MOCK_LONG_VIDEOS.map((vid) => {
                const isSelected = selectedLongVideo.id === vid.id;
                return (
                  <div
                    key={vid.id}
                    onClick={() => {
                      soundFX.playClick();
                      setSelectedLongVideo(vid);
                    }}
                    className={`cursor-pointer rounded-2xl overflow-hidden border transition-all duration-200 group flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#1e1738] border-cyan-400 shadow-xl shadow-cyan-900/20 ring-1 ring-cyan-400'
                        : 'bg-[#161129] border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="relative aspect-video w-full overflow-hidden bg-black">
                      <img
                        src={vid.thumbnail}
                        alt={vid.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute bottom-2 right-2 text-xs bg-black/85 px-1.5 py-0.5 rounded text-white font-mono flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {vid.duration}
                      </span>
                      <span className="absolute top-2 left-2 text-[10px] bg-cyan-600/90 px-2 py-0.5 rounded text-white font-bold">
                        {vid.category}
                      </span>
                    </div>

                    <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                      <h5 className="font-bold text-xs sm:text-sm text-white line-clamp-2 group-hover:text-cyan-300 transition-colors">
                        {vid.title}
                      </h5>

                      <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3 text-cyan-400" />
                          {vid.views}
                        </span>
                        <span className="text-purple-300 font-semibold truncate max-w-[100px]">
                          {vid.channel}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* SHORTS 9:16 EXPERIENCE (When mediaFormat === 'shorts') */
        <>
          {/* Category Pills Strip */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none text-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  soundFX.playClick();
                  setActiveCategory(cat);
                }}
                className={`px-3.5 py-1.5 rounded-full font-medium whitespace-nowrap transition-all ${
                  activeCategory === cat
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                    : 'bg-[#1a142c] text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {categoryKeys[cat] ? t(categoryKeys[cat], cat) : cat}
              </button>
            ))}
          </div>

          {/* Main Reel Viewer & Feed Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Interactive 9:16 Vertical Reel Player (Supports Direct Embedded YouTube Shorts) */}
            <div className="lg:col-span-5 flex flex-col items-center space-y-4">
              {/* Mode Switcher */}
              <div className="flex items-center justify-between w-full max-w-[340px] px-1 text-xs">
                <div className="flex items-center gap-1 bg-[#161129] p-1 rounded-xl border border-slate-800">
                  <button
                    onClick={() => {
                      soundFX.playClick();
                      setViewMode('embed');
                    }}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition-all ${
                      viewMode === 'embed' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Tv className="w-3.5 h-3.5" />
                    <span>Live Video</span>
                  </button>
                  <button
                    onClick={() => {
                      soundFX.playClick();
                      setViewMode('interactive');
                    }}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition-all ${
                      viewMode === 'interactive' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Telemetry HUD</span>
                  </button>
                </div>

                <a
                  href={`https://youtube.com/shorts/${selectedReel.youtubeId}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] font-mono text-cyan-400 hover:underline flex items-center gap-1 font-semibold"
                >
                  <span>Open on YouTube</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

          {/* 9:16 Aspect Video Enclosure */}
          <div className="relative w-full max-w-[340px] aspect-[9/16] rounded-3xl overflow-hidden shadow-2xl border-4 border-purple-500/30 bg-black flex flex-col justify-between">
            {viewMode === 'embed' ? (
              /* Direct Responsive Embedded YouTube Shorts Player */
              <iframe
                src={`https://www.youtube.com/embed/${selectedReel.youtubeId}?autoplay=1&mute=0&loop=1&playlist=${selectedReel.youtubeId}&controls=1&rel=0`}
                title={selectedReel.title}
                className="w-full h-full object-cover border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              /* Interactive Telemetry HUD Overlaid Mock Frame */
              <div className="relative w-full h-full flex flex-col justify-between p-4">
                <img
                  src={selectedReel.videoThumb}
                  alt={selectedReel.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/90 pointer-events-none" />

                {/* Top Reel Header */}
                <div className="relative z-10 flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-pink-600/90 text-white shadow-lg backdrop-blur-sm">
                    {selectedReel.badge}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs bg-black/60 px-2 py-0.5 rounded-full text-slate-300 backdrop-blur-sm font-mono">
                      {selectedReel.duration}
                    </span>
                    <button
                      onClick={() => handlePlayVoice(currentCaption)}
                      className={`p-2 rounded-full backdrop-blur-md transition-colors ${
                        isSpeaking
                          ? 'bg-purple-600 text-white animate-bounce'
                          : 'bg-black/60 text-slate-200 hover:bg-black/80'
                      }`}
                      title="Listen to AI commentary in selected language"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Center Play indicator */}
                <div className="relative z-10 flex justify-center items-center my-auto">
                  <button
                    onClick={() => {
                      soundFX.playPortal();
                      setViewMode('embed');
                    }}
                    className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center text-white shadow-xl hover:scale-110 transition-transform"
                  >
                    <Play className="w-6 h-6 ml-1" />
                  </button>
                </div>

                {/* Bottom Real-time Telemetry & Story Captions */}
                <div className="relative z-10 space-y-2.5">
                  <div className="bg-slate-900/85 backdrop-blur-md rounded-xl p-2.5 border border-slate-700/60 shadow-lg text-xs grid grid-cols-2 gap-2 text-slate-200">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-mono">Exit Velocity</span>
                      <span className="font-bold text-pink-400">{selectedReel.metrics.exitVelocity}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-mono">Launch Angle</span>
                      <span className="font-bold text-indigo-300">{selectedReel.metrics.launchAngle}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-mono">Trajectory</span>
                      <span className="font-bold text-emerald-400">{selectedReel.metrics.distance}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-mono">Win Prob Swing</span>
                      <span className="font-bold text-amber-400 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        {selectedReel.metrics.winProbChange}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-white text-base leading-tight drop-shadow-md">
                        {selectedReel.player}
                      </h3>
                      <span className="text-[11px] text-purple-300 font-semibold">{selectedReel.role}</span>
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed bg-black/50 backdrop-blur-sm p-2 rounded-lg border border-white/10">
                      {currentCaption}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-xs text-slate-300 border-t border-white/10">
                    <span className="text-[11px] text-slate-400 font-mono">ICC Telemetry Sync: 100%</span>
                    <button
                      onClick={() => soundFX.playClick()}
                      className="flex items-center space-x-1 hover:text-pink-400 transition-colors"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Syndicate 9:16</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick AI Voice Commentary Bar below Video */}
          <div className="w-full max-w-[340px] p-3 rounded-2xl bg-[#1d182f] border border-slate-800 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 truncate">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-ping" />
              <span className="truncate text-slate-300 font-medium">
                {selectedReel.player}: {selectedReel.title}
              </span>
            </div>
            <button
              onClick={() => handlePlayVoice(currentCaption)}
              className={`p-2 rounded-xl flex items-center gap-1.5 text-xs font-bold transition-all ${
                isSpeaking
                  ? 'bg-purple-600 text-white animate-pulse'
                  : 'bg-purple-600/20 text-purple-300 hover:bg-purple-600 hover:text-white'
              }`}
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>{isSpeaking ? t('shorts.stop_audio', 'Stop Voice') : t('shorts.play_audio', 'Listen in Voice')}</span>
            </button>
          </div>
        </div>

        {/* Right: Reel Carousel Feed & Tactical Breakdown Card */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <MessageSquareQuote className="w-5 h-5 text-purple-400" />
              <span>Live Match Highlight Feed</span>
              <span className="text-xs font-mono font-bold text-pink-400 bg-pink-500/10 px-2 py-0.5 rounded-full border border-pink-500/20">
                {filteredReels.length} Videos
              </span>
            </h3>
            <span className="text-xs text-slate-400 hidden sm:inline-block">
              Auto-synced with Dubai Match Broadcast
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-h-[620px] overflow-y-auto pr-1">
            {filteredReels.map((reel) => {
              const isSelected = selectedReel.id === reel.id;
              return (
                <div
                  key={reel.id}
                  onClick={() => handleSelectReel(reel)}
                  className={`cursor-pointer rounded-2xl p-3 border transition-all duration-200 text-left relative overflow-hidden group ${
                    isSelected
                      ? 'bg-purple-950/40 border-purple-500 shadow-lg shadow-purple-900/20 ring-1 ring-purple-500'
                      : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex space-x-3">
                    <div className="relative w-20 h-28 rounded-xl overflow-hidden flex-shrink-0 bg-slate-800">
                      <img
                        src={reel.videoThumb}
                        alt={reel.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <span className="absolute bottom-1 right-1 text-[10px] bg-black/80 px-1 rounded text-white font-mono">
                        {reel.duration}
                      </span>
                      {reel.category && (
                        <span className="absolute top-1 left-1 text-[9px] bg-purple-600/90 px-1 rounded text-white font-bold">
                          {reel.category}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col justify-between flex-1 min-w-0">
                      <div>
                        <span className="text-[10px] font-semibold text-pink-400 block truncate">
                          {reel.matchContext}
                        </span>
                        <h4 className="font-bold text-sm text-white line-clamp-2 mt-0.5 leading-snug group-hover:text-purple-300 transition-colors">
                          {reel.title}
                        </h4>
                      </div>

                      <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                        <span className="truncate text-purple-300 font-medium">{reel.player}</span>
                        <ChevronRight
                          className={`w-4 h-4 transition-transform ${
                            isSelected ? 'rotate-90 text-purple-400' : 'text-slate-600'
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Deep-Dive Tactical Breakdown for selected reel */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3 mt-4 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-bold tracking-wider text-indigo-400 flex items-center gap-1.5 font-mono">
                <Sparkles className="w-3.5 h-3.5" />
                {t('shorts.tactical_breakdown', 'AI Multimodal Tactical Note')}
              </span>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Confidence: 98.4%
              </span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              {selectedReel.tacticalInsight}
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="text-xs px-2.5 py-1 bg-slate-800 text-slate-300 rounded-lg border border-slate-700">
                {t('shorts.exit_velocity', 'Exit Velocity')}: {selectedReel.metrics.exitVelocity}
              </span>
              <span className="text-xs px-2.5 py-1 bg-slate-800 text-slate-300 rounded-lg border border-slate-700">
                {t('shorts.win_prob_delta', 'Win Swing')}: {selectedReel.metrics.winProbChange}
              </span>
              <span className="text-xs px-2.5 py-1 bg-slate-800 text-slate-300 rounded-lg border border-slate-700">
                {t('shorts.launch_angle', 'Launch Angle')}: {selectedReel.metrics.launchAngle}
              </span>
            </div>
          </div>
        </div>
      </div>
        </>
      )}
    </div>
  );
};


