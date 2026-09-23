import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Fingerprint, Shield, ArrowLeft, ArrowRight, CheckCircle2, RefreshCw } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: { name: string; handle: string; sparks: number }) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const { t } = useLanguage();
  const [step, setStep] = useState<'login' | 'otp'>('login');
  const [identifier, setIdentifier] = useState<string>('lorekeeper@auraverse.io');
  const [otpDigits, setOtpDigits] = useState<string[]>(['4', '9', '1']);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier) return;
    setStep('otp');
  };

  const handleKeypadPress = (digit: string) => {
    if (otpDigits.length < 6) {
      const next = [...otpDigits, digit];
      setOtpDigits(next);
      if (next.length === 6) {
        verifyFinalCode(next.join(''));
      }
    }
  };

  const handleBackspace = () => {
    if (otpDigits.length > 0) {
      setOtpDigits(otpDigits.slice(0, -1));
    }
  };

  const handleBiometricFill = () => {
    const full = ['8', '2', '0', '7', '4', '6'];
    setOtpDigits(full);
    verifyFinalCode(full.join(''));
  };

  const verifyFinalCode = (code: string) => {
    setIsVerifying(true);
    if (code) {
      console.log('Synchronizing node with code:', code);
    }
    setTimeout(() => {
      setIsVerifying(false);
      onLoginSuccess({
        name: 'Kira Nova',
        handle: '@Kira_Nova',
        sparks: 4850,
      });
      onClose();
    }, 900);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 16 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="relative w-full max-w-md bg-[#140e28] border border-purple-500/40 rounded-3xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden neon-border-dynamic"
        >
          {/* Background Ambient Orbs */}
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl pointer-events-none glow-ambient" />
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-pink-600/20 rounded-full blur-3xl pointer-events-none glow-ambient" style={{ animationDelay: '-3s' }} />

          {/* Top Header */}
          <div className="flex items-center justify-between mb-4 z-10 relative">
            {step === 'otp' ? (
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setStep('login')}
                className="p-2 rounded-full bg-slate-800/80 text-slate-300 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4" />
              </motion.button>
            ) : (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1d182f] border border-cyan-500/30">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span className="text-[10px] font-bold text-cyan-300 uppercase font-mono">AURA SYNAPSE v5.2</span>
              </div>
            )}

            <button
              onClick={onClose}
              className="text-xs text-slate-400 hover:text-white px-3 py-1 rounded-full bg-slate-800/60 transition-colors"
            >
              Cancel
            </button>
          </div>

          <AnimatePresence mode="wait">
            {step === 'login' ? (
              /* Step 1: Login Form */
              <motion.div
                key="step-login"
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
                transition={{ duration: 0.2 }}
                className="space-y-4 relative z-10"
              >
                <div className="text-center space-y-1">
                  <h2 className="text-2xl font-black text-white tracking-tight">
                    {t('auth.title', 'AURA Lorekeeper Access')}
                  </h2>
                  <p className="text-xs text-slate-400 font-medium">
                    {t('auth.subtitle', 'Sign in with cryptographic keypass or email verification')}
                  </p>
                </div>

                <form onSubmit={handleSendCode} className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                      <span>{t('auth.identifier_label', 'Universal Fanverse ID or ENS')}</span>
                      <span className="text-[10px] text-cyan-400 font-mono">ICC Web3 DID</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        placeholder={t('auth.identifier_placeholder', 'fan@auraverse.io')}
                        required
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#1d182f] border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors font-mono"
                      />
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full py-3 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 hover:opacity-95 transition-all shimmer-effect"
                  >
                    <span>{t('auth.cta_send', 'Generate Verification Cipher')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </form>

                <div className="relative flex items-center justify-center my-4">
                  <div className="border-t border-slate-800 w-full" />
                  <span className="bg-[#140e28] px-3 text-[10px] text-slate-500 uppercase font-mono absolute">
                    or biometric passkey
                  </span>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={handleBiometricFill}
                  className="w-full py-2.5 rounded-xl bg-[#1d182f] hover:bg-[#251f3b] text-slate-200 text-xs font-semibold border border-slate-700 flex items-center justify-center gap-2 transition-all"
                >
                  <Fingerprint className="w-4 h-4 text-pink-400" />
                  <span>{t('auth.cta_passkey', 'Fast Biometric Passkey (WebAuthn)')}</span>
                </motion.button>
              </motion.div>
            ) : (
              /* Step 2: 6-Digit Cipher Keypad */
              <motion.div
                key="step-otp"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.2 }}
                className="space-y-4 relative z-10"
              >
                <div className="text-center space-y-1">
                  <h2 className="text-xl font-bold text-white tracking-tight">
                    Enter Verification Cipher
                  </h2>
                  <p className="text-xs text-slate-400 font-mono">
                    Cipher dispatched to: <span className="text-purple-300 font-semibold">{identifier}</span>
                  </p>
                </div>

                {/* 6-Digit Display */}
                <div className="flex items-center justify-center gap-2 pt-2">
                  {[0, 1, 2, 3, 4, 5].map((idx) => {
                    const digit = otpDigits[idx];
                    const isActive = otpDigits.length === idx;
                    return (
                      <div
                        key={idx}
                        className={`w-11 h-13 rounded-xl flex flex-col items-center justify-center font-bold text-lg font-mono border transition-all ${
                          digit
                            ? 'bg-[#2c273e] border-purple-500 text-purple-300 shadow-inner'
                            : isActive
                            ? 'bg-[#3b364e] border-cyan-400 text-cyan-400 animate-pulse'
                            : 'bg-[#1d182f] border-slate-800 text-slate-600'
                        }`}
                      >
                        <span>{digit}</span>
                        <div className={`w-3 h-0.5 rounded-full mt-1 ${digit ? 'bg-purple-400' : 'bg-transparent'}`} />
                      </div>
                    );
                  })}
                </div>

                {/* Tactile Numeric Keypad */}
                <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto pt-2">
                  {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((k) => (
                    <motion.button
                      whileTap={{ scale: 0.92 }}
                      key={k}
                      type="button"
                      onClick={() => handleKeypadPress(k)}
                      className="h-11 rounded-xl bg-[#211c33] hover:bg-[#2c273e] text-white font-bold text-sm shadow-sm transition-transform"
                    >
                      {k}
                    </motion.button>
                  ))}
                  <motion.button
                    whileTap={{ scale: 0.92 }}
                    type="button"
                    onClick={handleBiometricFill}
                    className="h-11 rounded-xl bg-[#1d182f] text-pink-400 hover:text-white flex items-center justify-center"
                    title="Biometric Fill"
                  >
                    <Fingerprint className="w-5 h-5" />
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.92 }}
                    type="button"
                    onClick={() => handleKeypadPress('0')}
                    className="h-11 rounded-xl bg-[#211c33] hover:bg-[#2c273e] text-white font-bold text-sm shadow-sm"
                  >
                    0
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.92 }}
                    type="button"
                    onClick={handleBackspace}
                    className="h-11 rounded-xl bg-[#1d182f] text-slate-400 hover:text-white flex items-center justify-center"
                    title="Backspace"
                  >
                    ⌫
                  </motion.button>
                </div>

                {/* Confirm / Synchronize Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => verifyFinalCode(otpDigits.join(''))}
                  disabled={isVerifying || otpDigits.length < 6}
                  className="w-full py-3 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 hover:opacity-95 transition-all disabled:opacity-50 mt-3 shimmer-effect"
                >
                  {isVerifying ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Synchronizing Neural Node...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Confirm & Synchronize Link</span>
                    </>
                  )}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Quantum Security Micro Badge */}
          <div className="mt-4 pt-3 border-t border-slate-800 text-center flex items-center justify-center gap-1.5 text-[10px] text-slate-500 font-mono">
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            <span>Zero-Trust Quantum Encrypted Session</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
