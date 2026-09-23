import React, { useState, useRef, useEffect } from 'react';
import { Globe2, Check, Sparkles } from 'lucide-react';
import { useLanguage, SUPPORTED_LANGUAGES } from '../context/LanguageContext';
import { soundFX } from '../services/soundFX';

export const FloatingLanguageSwitcher: React.FC = () => {
  const { language, setLanguage, currentOption } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="fixed bottom-5 right-5 z-40 select-none">
      {/* Popover Language Selector Card */}
      {isOpen && (
        <div className="mb-3 w-72 rounded-3xl bg-[#130c2b]/95 border border-purple-500/50 shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_24px_rgba(168,85,247,0.3)] backdrop-blur-2xl p-3 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="px-3 py-2 border-b border-purple-500/25 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-300">
              <Globe2 className="w-4 h-4 text-cyan-400" />
              <span>Change Language / భాషను మార్చండి</span>
            </div>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono font-bold">
              6 Sync
            </span>
          </div>

          <div className="py-2 space-y-1 max-h-72 overflow-y-auto scrollbar-none">
            {SUPPORTED_LANGUAGES.map((lang) => {
              const isActive = language === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => {
                    soundFX.playClick();
                    setLanguage(lang.code);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-left transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-600/40 to-pink-600/30 border border-purple-400/60 text-white shadow-[0_2px_10px_rgba(168,85,247,0.3)]'
                      : 'hover:bg-white/5 text-slate-300 hover:text-white border border-transparent'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-xl leading-none">{lang.flag}</span>
                    <div>
                      <div className="text-xs font-bold leading-tight flex items-center gap-1.5">
                        <span>{lang.nativeName}</span>
                        {lang.dir === 'rtl' && (
                          <span className="text-[9px] uppercase px-1 rounded bg-amber-500/20 text-amber-300 font-mono">
                            RTL
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono leading-tight">
                        {lang.label}
                      </div>
                    </div>
                  </div>

                  {isActive ? (
                    <div className="w-5 h-5 rounded-full bg-cyan-400/20 text-cyan-300 flex items-center justify-center">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  ) : null}
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-purple-500/20 text-center">
            <span className="text-[10px] font-mono text-purple-300/70 flex items-center justify-center gap-1">
              <Sparkles className="w-3 h-3 text-pink-400 inline" />
              Instant Mesh Synchronization
            </span>
          </div>
        </div>
      )}

      {/* Floating Trigger Pill */}
      <button
        type="button"
        onClick={() => {
          soundFX.playClick();
          setIsOpen((prev) => !prev);
        }}
        className={`group flex items-center gap-2 px-3.5 py-2 rounded-full bg-gradient-to-b from-[#2a1b52] via-[#1a113a] to-[#100a26] border border-purple-400/50 hover:border-cyan-400/80 text-white shadow-[0_8px_24px_rgba(0,0,0,0.7),0_0_16px_rgba(168,85,247,0.35)] hover:shadow-[0_8px_28px_rgba(6,182,212,0.45)] transition-all transform active:scale-95 duration-200 ${
          isOpen ? 'ring-2 ring-cyan-400/60 scale-105' : 'hover:-translate-y-0.5'
        }`}
        title="Quick Language Switcher"
      >
        <span className="text-base leading-none drop-shadow">{currentOption?.flag || '🌐'}</span>
        <span className="text-xs font-bold tracking-wide text-slate-100 flex items-center gap-1 font-mono">
          <span>{currentOption?.nativeName}</span>
          <span className="text-[10px] text-purple-300 uppercase">({currentOption?.code})</span>
        </span>
        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
      </button>
    </div>
  );
};
