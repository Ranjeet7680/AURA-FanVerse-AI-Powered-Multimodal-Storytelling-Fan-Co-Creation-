import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Target,
  Compass,
  Activity,
  ChevronRight,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Bot,
  Lightbulb,
  Radio,
  AudioWaveform,
  Globe2
} from 'lucide-react';
import {
  SUPPORTED_LANGUAGES,
  LOCALIZED_TACTICAL_QUERIES,
  UI_TRANSLATIONS,
  generateTacticalAIResponse,
  type LocalizedTacticalQuery
} from '../data/tacticalLocalization';
import { voiceAssistant } from '../services/voiceAssistant';
import { soundFX } from '../services/soundFX';

interface TacticalCoPilotProps {
  selectedLang?: string;
  onSelectLang?: (lang: string) => void;
}

export const TacticalCoPilot: React.FC<TacticalCoPilotProps> = ({
  selectedLang = 'en',
  onSelectLang
}) => {
  const [currentLang, setCurrentLang] = useState<string>(selectedLang);
  const [selectedQuery, setSelectedQuery] = useState<LocalizedTacticalQuery>(LOCALIZED_TACTICAL_QUERIES[0]);
  const [customInput, setCustomInput] = useState<string>('');
  const [speakingIndex, setSpeakingIndex] = useState<number | null>(null);
  const [isAiSpeaking, setIsAiSpeaking] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isV2VEnabled, setIsV2VEnabled] = useState<boolean>(true); // Voice-to-Voice enabled by default
  const [suggestedCategory, setSuggestedCategory] = useState<'All' | 'Captaincy' | 'Spin' | 'Powerplay'>('All');

  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Sync with prop when parent updates
  useEffect(() => {
    if (selectedLang && selectedLang !== currentLang) {
      setCurrentLang(selectedLang);
    }
  }, [selectedLang]);

  // UI translations helper
  const t = (key: string): string => {
    const table = UI_TRANSLATIONS[key];
    if (!table) return key;
    return table[currentLang] || table.en || key;
  };

  const activeLangConfig = SUPPORTED_LANGUAGES[currentLang] || SUPPORTED_LANGUAGES.en;
  const isRtl = activeLangConfig.dir === 'rtl';

  // Initial greeting and conversation log in active language
  const [chatLog, setChatLog] = useState<{ role: 'user' | 'assistant'; text: string; query?: LocalizedTacticalQuery }[]>([
    {
      role: 'assistant',
      text: UI_TRANSLATIONS.aiGreeting[currentLang] || UI_TRANSLATIONS.aiGreeting.en
    },
    {
      role: 'user',
      text: LOCALIZED_TACTICAL_QUERIES[0].question[currentLang] || LOCALIZED_TACTICAL_QUERIES[0].question.en
    },
    {
      role: 'assistant',
      text: LOCALIZED_TACTICAL_QUERIES[0].answer[currentLang] || LOCALIZED_TACTICAL_QUERIES[0].answer.en,
      query: LOCALIZED_TACTICAL_QUERIES[0]
    }
  ]);

  // Update initial messages when language changes
  const handleLanguageChange = (langCode: string) => {
    soundFX.playClick();
    setCurrentLang(langCode);
    if (onSelectLang) {
      onSelectLang(langCode);
    }
    voiceAssistant.stopSpeaking();
    setIsAiSpeaking(false);
    setSpeakingIndex(null);

    // Refresh greeting and current query text in new language
    const newGreeting = UI_TRANSLATIONS.aiGreeting[langCode] || UI_TRANSLATIONS.aiGreeting.en;
    const newQueryQ = selectedQuery.question[langCode] || selectedQuery.question.en;
    const newQueryA = selectedQuery.answer[langCode] || selectedQuery.answer.en;

    setChatLog([
      { role: 'assistant', text: newGreeting },
      { role: 'user', text: newQueryQ },
      { role: 'assistant', text: newQueryA, query: selectedQuery }
    ]);
  };

  // Scroll chat to bottom on new message
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatLog, isAiSpeaking]);

  // Text-to-Voice: Read text aloud on demand
  const handleSpeakText = (text: string, index: number) => {
    soundFX.playClick();
    if (speakingIndex === index) {
      voiceAssistant.stopSpeaking();
      setSpeakingIndex(null);
      setIsAiSpeaking(false);
      return;
    }

    setSpeakingIndex(index);
    setIsAiSpeaking(true);

    voiceAssistant.speakText(
      text,
      currentLang,
      () => {
        setIsAiSpeaking(true);
      },
      () => {
        setSpeakingIndex(null);
        setIsAiSpeaking(false);
      },
      () => {
        setSpeakingIndex(null);
        setIsAiSpeaking(false);
      }
    );
  };

  const handleStopAllAudio = () => {
    soundFX.playClick();
    voiceAssistant.stopSpeaking();
    setSpeakingIndex(null);
    setIsAiSpeaking(false);
  };

  // Voice-to-Voice: Microphone input with auto AI voice playback
  const handleToggleVoiceInput = () => {
    soundFX.playClick();

    if (isListening) {
      voiceAssistant.stopListening();
      setIsListening(false);
      return;
    }

    // Cancel any current TTS
    voiceAssistant.stopSpeaking();
    setSpeakingIndex(null);
    setIsAiSpeaking(false);

    const started = voiceAssistant.startListening(
      currentLang,
      (transcript: string) => {
        soundFX.playSuccess();
        setIsListening(false);
        setCustomInput('');

        // 1. Post user message to chat
        setChatLog((prev) => [...prev, { role: 'user', text: transcript }]);

        // 2. Generate contextual tactical response in active language
        setTimeout(() => {
          const aiReply = generateTacticalAIResponse(transcript, currentLang);
          soundFX.playSuccessChime();

          setChatLog((prev) => {
            const newLog = [
              ...prev,
              { role: 'assistant' as const, text: aiReply, query: selectedQuery }
            ];
            const newIndex = newLog.length - 1;

            // 3. Voice-to-Voice: If V2V mode is on, automatically speak the AI reply!
            if (isV2VEnabled) {
              setSpeakingIndex(newIndex);
              setIsAiSpeaking(true);
              voiceAssistant.speakText(
                aiReply,
                currentLang,
                () => setIsAiSpeaking(true),
                () => {
                  setSpeakingIndex(null);
                  setIsAiSpeaking(false);
                },
                () => {
                  setSpeakingIndex(null);
                  setIsAiSpeaking(false);
                }
              );
            }

            return newLog;
          });
        }, 500);
      },
      () => {
        setIsListening(true);
        soundFX.playPortal();
      },
      () => {
        setIsListening(false);
      },
      () => {
        setIsListening(false);
      }
    );

    if (!started) {
      alert('Speech Recognition is not available or blocked in this browser. Please allow microphone permissions or type your question.');
    }
  };

  // Preset Selection
  const handleSelectPreset = (q: LocalizedTacticalQuery) => {
    soundFX.playClick();
    setSelectedQuery(q);

    const questionText = q.question[currentLang] || q.question.en;
    const answerText = q.answer[currentLang] || q.answer.en;

    setChatLog((prev) => {
      const newLog = [
        ...prev,
        { role: 'user' as const, text: questionText },
        { role: 'assistant' as const, text: answerText, query: q }
      ];

      // If V2V mode is enabled, speak the answer
      if (isV2VEnabled) {
        const nextIdx = newLog.length - 1;
        setSpeakingIndex(nextIdx);
        setIsAiSpeaking(true);
        voiceAssistant.speakText(
          answerText,
          currentLang,
          () => setIsAiSpeaking(true),
          () => {
            setSpeakingIndex(null);
            setIsAiSpeaking(false);
          },
          () => {
            setSpeakingIndex(null);
            setIsAiSpeaking(false);
          }
        );
      }

      return newLog;
    });
  };

  // Manual Text Send
  const handleSendCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;

    soundFX.playClick();
    const userText = customInput;
    setCustomInput('');

    setChatLog((prev) => [...prev, { role: 'user', text: userText }]);

    setTimeout(() => {
      const aiReply = generateTacticalAIResponse(userText, currentLang);
      soundFX.playSuccessChime();

      setChatLog((prev) => {
        const newLog = [
          ...prev,
          { role: 'assistant' as const, text: aiReply, query: selectedQuery }
        ];

        if (isV2VEnabled) {
          const nextIdx = newLog.length - 1;
          setSpeakingIndex(nextIdx);
          setIsAiSpeaking(true);
          voiceAssistant.speakText(
            aiReply,
            currentLang,
            () => setIsAiSpeaking(true),
            () => {
              setSpeakingIndex(null);
              setIsAiSpeaking(false);
            },
            () => {
              setSpeakingIndex(null);
              setIsAiSpeaking(false);
            }
          );
        }

        return newLog;
      });
    }, 500);
  };

  // Filter suggested questions
  const filteredQueries = LOCALIZED_TACTICAL_QUERIES.filter((q) => {
    if (suggestedCategory === 'All') return true;
    return q.category === suggestedCategory;
  });

  return (
    <div className={`space-y-6 ${isRtl ? 'font-sans' : ''}`} dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-950/60 via-purple-950/40 to-slate-900 border border-indigo-500/20 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl relative overflow-hidden">
        {/* Ambient Top Light */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-pink-500 opacity-60" />

        <div className="space-y-1 z-10">
          <div className="flex items-center space-x-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
            <Compass className="w-4 h-4" />
            <span>{t('headerTag')}</span>
            <span className="px-2 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-400/40 text-cyan-300 text-[10px] font-mono">
              Voice-to-Voice AI
            </span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            {t('headerTitle')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            {t('headerSubtitle')}
          </p>
        </div>

        {/* Header Badges: Language Pill & Telemetry */}
        <div className="flex flex-wrap items-center gap-2 z-10">
          {/* Active Language Badge */}
          <div className="flex items-center gap-1.5 bg-slate-900/90 border border-purple-500/30 px-3 py-1.5 rounded-xl text-xs text-slate-200 shadow-md">
            <Globe2 className="w-3.5 h-3.5 text-purple-400" />
            <span className="font-bold">{activeLangConfig.flag} {activeLangConfig.nativeName}</span>
          </div>

          <div className="flex items-center space-x-2 bg-indigo-500/10 border border-indigo-400/20 px-3 py-1.5 rounded-xl text-xs text-indigo-300">
            <Activity className="w-4 h-4 text-indigo-400 animate-pulse" />
            <span>{t('telemetryActive')}</span>
          </div>
        </div>
      </div>

      {/* Language Selector Bar & Voice-to-Voice Mode Toggle Deck */}
      <div className="bg-[#120a2a]/80 border border-purple-500/20 rounded-2xl p-3 sm:p-4 flex flex-col md:flex-row items-center justify-between gap-3 shadow-lg">
        {/* 5 Language Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap w-full md:w-auto justify-center sm:justify-start">
          <span className="text-xs font-bold text-slate-400 mr-1 flex items-center gap-1">
            <Globe2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Language:</span>
          </span>
          {Object.values(SUPPORTED_LANGUAGES).map((lang) => {
            const isSelected = currentLang === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all transform duration-150 ${
                  isSelected
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-[0_4px_12px_rgba(236,72,153,0.4)] -translate-y-0.5 ring-1 ring-pink-400/50'
                    : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/60'
                }`}
              >
                <span>{lang.flag}</span>
                <span>{lang.nativeName}</span>
              </button>
            );
          })}
        </div>

        {/* Voice-to-Voice Auto-Speak Toggle Switch */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-700 px-3 py-1.5 rounded-xl text-xs">
            <Radio className={`w-3.5 h-3.5 ${isV2VEnabled ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} />
            <span className="text-slate-300 font-semibold">{t('v2vMode')}:</span>
            <button
              onClick={() => {
                soundFX.playClick();
                setIsV2VEnabled(!isV2VEnabled);
              }}
              className={`px-2 py-0.5 rounded-md font-mono text-[11px] font-bold transition-colors ${
                isV2VEnabled
                  ? 'bg-emerald-500 text-black shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {isV2VEnabled ? 'ON (Auto-Speak)' : 'OFF'}
            </button>
          </div>

          {/* Quick Stop Audio Button if voice is speaking */}
          {isAiSpeaking && (
            <button
              onClick={handleStopAllAudio}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pink-600/90 hover:bg-pink-500 text-white text-xs font-bold transition-all shadow-md animate-pulse"
              title="Stop current voice playback"
            >
              <VolumeX className="w-3.5 h-3.5" />
              <span>{t('stopSpeaking')}</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Interactive 2D Cricket Oval & Field Placement Map */}
        <div className="lg:col-span-6 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Target className="w-4 h-4 text-purple-400" />
                <span>{t('fieldVisualizer')}</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {t('bowlerVsBatter')}:{' '}
                <span className="text-purple-300 font-semibold">{selectedQuery.bowler}</span> vs{' '}
                <span className="text-pink-300 font-semibold">{selectedQuery.batter}</span>
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-mono">
              {selectedQuery.fieldFocus[currentLang] || selectedQuery.fieldFocus.en}
            </span>
          </div>

          {/* Simulated 2D Cricket Oval */}
          <div className="relative w-full aspect-square max-w-[420px] mx-auto rounded-full bg-emerald-950/40 border-2 border-dashed border-emerald-500/30 flex items-center justify-center p-4 overflow-hidden shadow-inner">
            {/* 30-Yard Inner Circle */}
            <div className="absolute w-[65%] h-[65%] rounded-full border border-emerald-400/40 bg-emerald-900/20 pointer-events-none flex items-center justify-center">
              <span className="text-[10px] text-emerald-400/60 font-mono -mt-24">30-Yd Circle</span>
            </div>

            {/* Central Pitch Strip */}
            <div className="absolute w-10 h-32 bg-amber-900/40 border border-amber-500/30 rounded flex flex-col justify-between items-center py-1.5 z-0">
              <div className="w-6 h-1 bg-white/70 rounded-full" />
              <span className="text-[9px] text-amber-300 font-mono rotate-90">PITCH</span>
              <div className="w-6 h-1 bg-white/70 rounded-full" />
            </div>

            {/* Fielders Placement Nodes */}
            {selectedQuery.recommendedFieldingPositions.map((pos, idx) => {
              const posName = pos.name[currentLang] || pos.name.en;
              const posRole = pos.role[currentLang] || pos.role.en;
              return (
                <div
                  key={idx}
                  style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-10"
                >
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold shadow-md transition-all duration-300 ${
                      pos.highlight
                        ? 'bg-pink-500 text-white ring-4 ring-pink-500/30 scale-125 animate-bounce'
                        : 'bg-indigo-600 text-white hover:scale-125 hover:bg-indigo-400'
                    }`}
                  >
                    {idx + 1}
                  </div>
                  {/* Tooltip on hover */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-slate-900 text-white text-[10px] py-1 px-2 rounded shadow-lg border border-slate-700 whitespace-nowrap z-20 font-medium pointer-events-none">
                    {posName} ({posRole})
                  </div>
                </div>
              );
            })}

            {/* Compass Directions */}
            <span className="absolute top-2 text-[10px] font-bold text-slate-500">{t('offSide')}</span>
            <span className="absolute bottom-2 text-[10px] font-bold text-slate-500">{t('legSide')}</span>
          </div>

          {/* Win Probability Delta Strip */}
          <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800 flex items-center justify-between">
            <div className="text-xs">
              <span className="text-slate-400 block font-mono">{t('predictedOutcome')}</span>
              <span className="text-white font-semibold">
                {t('winProb')}: {selectedQuery.winProbability.before}% →{' '}
                <span className="text-emerald-400 font-bold">{selectedQuery.winProbability.after}%</span> (
                {selectedQuery.winProbability.team[currentLang] || selectedQuery.winProbability.team.en})
              </span>
            </div>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
              +{selectedQuery.winProbability.after - selectedQuery.winProbability.before}% {t('optimal')}
            </span>
          </div>
        </div>

        {/* Right: Conversational Tactical Chat & Suggested Questions */}
        <div className="lg:col-span-6 flex flex-col h-[590px] bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          {/* Suggested Questions Header & Category Filter Tabs */}
          <div className="p-4 border-b border-slate-800 bg-slate-950/60 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                <span>{t('suggestedQuestions')} ({filteredQueries.length})</span>
              </span>
              <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded">
                {t('clickToAnalyze')}
              </span>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 text-xs">
              {(['All', 'Captaincy', 'Spin', 'Powerplay'] as const).map((cat) => {
                const catLabel =
                  cat === 'All'
                    ? t('catAll')
                    : cat === 'Captaincy'
                    ? t('catCaptaincy')
                    : cat === 'Spin'
                    ? t('catSpin')
                    : t('catPowerplay');
                return (
                  <button
                    key={cat}
                    onClick={() => {
                      soundFX.playClick();
                      setSuggestedCategory(cat);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                      suggestedCategory === cat
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'bg-slate-800/60 text-slate-400 hover:text-white'
                    }`}
                  >
                    {catLabel}
                  </button>
                );
              })}
            </div>

            {/* Suggested Question Chips List */}
            <div className="flex flex-col gap-1.5 max-h-36 overflow-y-auto pr-1">
              {filteredQueries.map((q) => {
                const questionText = q.question[currentLang] || q.question.en;
                return (
                  <button
                    key={q.id}
                    onClick={() => handleSelectPreset(q)}
                    className="text-left text-xs text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-800 p-2.5 rounded-xl border border-slate-700/60 flex items-center justify-between transition-all group"
                  >
                    <span className="truncate pr-2">{questionText}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-purple-400 flex-shrink-0" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Audio Waveform Banner (When AI is speaking or listening) */}
          {(isAiSpeaking || isListening) && (
            <div className="px-4 py-2 bg-gradient-to-r from-purple-950/80 via-pink-950/60 to-slate-900 border-b border-purple-500/30 flex items-center justify-between text-xs animate-in slide-in-from-top-1">
              <div className="flex items-center gap-2">
                <AudioWaveform className="w-4 h-4 text-pink-400 animate-pulse" />
                <span className="text-pink-300 font-semibold font-mono">
                  {isListening ? t('listeningNow') : `${t('aiSpeaking')} (${activeLangConfig.nativeName})`}
                </span>
              </div>
              {isAiSpeaking && (
                <button
                  onClick={handleStopAllAudio}
                  className="text-[10px] text-slate-300 hover:text-white bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700"
                >
                  {t('stopSpeaking')}
                </button>
              )}
            </div>
          )}

          {/* Chat Messages Log */}
          <div ref={chatContainerRef} className="flex-1 p-4 overflow-y-auto space-y-3">
            {chatLog.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed relative group ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                      : 'bg-slate-800/90 text-slate-200 border border-slate-700/70 shadow-sm'
                  }`}
                >
                  {msg.role === 'assistant' && (
                    <div className="flex items-center justify-between text-purple-400 font-semibold mb-1 text-[11px]">
                      <div className="flex items-center gap-1.5">
                        <Bot className="w-3.5 h-3.5 text-cyan-400" />
                        <span>AURA Tactical Intelligence</span>
                        <span className="text-[9px] font-mono px-1.5 py-0.2 bg-purple-500/20 text-purple-300 rounded border border-purple-500/30">
                          {activeLangConfig.nativeName}
                        </span>
                      </div>
                      {/* Text-to-Voice Speaker Icon */}
                      <button
                        onClick={() => handleSpeakText(msg.text, i)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          speakingIndex === i
                            ? 'bg-purple-600 text-white animate-pulse shadow-md'
                            : 'hover:bg-slate-700 text-slate-400 hover:text-cyan-300'
                        }`}
                        title="Text-to-Voice (Read aloud in native language)"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Chat Input with Speech Recognition Microphone */}
          <form onSubmit={handleSendCustom} className="p-3 border-t border-slate-800 bg-slate-950/80 flex items-center gap-2">
            {/* Microphone Button for Voice-to-Voice Input */}
            <button
              type="button"
              onClick={handleToggleVoiceInput}
              className={`p-2.5 rounded-xl border transition-all flex-shrink-0 ${
                isListening
                  ? 'bg-pink-600 border-pink-500 text-white animate-pulse shadow-lg shadow-pink-600/40 ring-2 ring-pink-400'
                  : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/50'
              }`}
              title={isListening ? 'Listening in progress... Click to stop' : `Voice-to-Voice: Speak in ${activeLangConfig.nativeName}`}
            >
              {isListening ? (
                <Mic className="w-4 h-4 text-white animate-bounce" />
              ) : (
                <MicOff className="w-4 h-4" />
              )}
            </button>

            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder={isListening ? t('listeningNow') : t('inputPlaceholder')}
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
            />

            <button
              type="submit"
              disabled={!customInput.trim()}
              className="bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:hover:bg-purple-600 text-white p-2.5 rounded-xl transition-all shadow-md shadow-purple-600/30 active:scale-95 flex-shrink-0"
              title="Send question"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
