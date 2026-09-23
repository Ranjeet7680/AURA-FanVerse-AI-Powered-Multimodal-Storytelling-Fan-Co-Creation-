import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Activity, Cpu, Sparkles, Maximize2 } from 'lucide-react';
import { soundFX } from '../services/soundFX';

interface AnimationDiagramModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AnimationDiagramModal: React.FC<AnimationDiagramModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        soundFX.playClick();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            soundFX.playClick();
            onClose();
          }}
          className="absolute inset-0 bg-black/85 backdrop-blur-xl"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-6xl max-h-[92vh] flex flex-col bg-gradient-to-b from-[#181135] via-[#120b29] to-[#0a0518] border border-purple-500/40 rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_50px_rgba(168,85,247,0.25)] overflow-hidden z-10"
        >
          {/* Top Specular Glow Line */}
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-pink-500 opacity-90" />

          {/* Modal Header */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-purple-500/20 bg-purple-950/30 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-purple-600 to-pink-500 p-0.5 shadow-lg shadow-purple-500/30">
                <div className="w-full h-full bg-[#120b29] rounded-[10px] flex items-center justify-center">
                  <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-black text-white tracking-tight flex items-center gap-1.5">
                    <span>AURA Animation & Telemetry Engine</span>
                    <span className="hidden sm:inline-flex text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                      Live 60 FPS
                    </span>
                  </h3>
                </div>
                <p className="text-xs text-slate-400 hidden sm:block">
                  Interactive real-time circuit diagram • Multimodal pipeline & 6-language reactive synapse
                </p>
              </div>
            </div>

            {/* Header Right Actions */}
            <div className="flex items-center gap-2">
              <a
                href="/animation_diagram.html"
                target="_blank"
                rel="noreferrer"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-900/40 hover:bg-purple-800/60 border border-purple-500/30 text-xs font-semibold text-purple-200 transition-all shadow hover:shadow-cyan-500/20"
                title="Open Standalone Full Window"
              >
                <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Full Window</span>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </a>

              <button
                onClick={() => {
                  soundFX.playClick();
                  onClose();
                }}
                className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors border border-white/10"
                aria-label="Close Diagram"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Diagram Frame Body */}
          <div className="relative flex-1 p-2 sm:p-3 overflow-hidden bg-[#0c071d]">
            <iframe
              src="/animation_diagram.html"
              title="AURA Live Architecture & Animation Diagram"
              className="w-full h-[62vh] sm:h-[68vh] md:h-[72vh] rounded-2xl border border-purple-500/20 shadow-inner bg-[#100a26]"
            />
          </div>

          {/* Modal Footer with Feature Badges */}
          <div className="px-4 sm:px-6 py-2.5 bg-[#0e0822] border-t border-purple-500/20 flex flex-wrap items-center justify-between gap-2 text-xs flex-shrink-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="flex items-center gap-1 text-slate-400">
                <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                <span className="text-slate-300 font-semibold">Modes:</span>
              </span>
              <span className="px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-300 border border-purple-500/20 text-[11px]">
                1. Dataflow Circuit
              </span>
              <span className="px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-[11px]">
                2. 3D Stadium Radar
              </span>
              <span className="px-2 py-0.5 rounded-md bg-pink-500/10 text-pink-300 border border-pink-500/20 text-[11px]">
                3. 6-Lang Synapse (TE/HI/TA/EN/ES/AR)
              </span>
            </div>

            <div className="flex items-center gap-3 text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <Cpu className="w-3 h-3 text-cyan-400" />
                <span>WebGL Web Audio & HMAC Guard</span>
              </span>
              <button
                onClick={() => {
                  soundFX.playClick();
                  onClose();
                }}
                className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
