import React, { useState } from 'react';
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
    // Simulating verified cryptographic cipher authentication
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
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-[#151026] border border-purple-500/30 rounded-3xl p-6 shadow-2xl overflow-hidden">
        {/* Background Ambient Orbs */}
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-pink-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div className="flex items-center justify-between mb-4 z-10 relative">
          {step === 'otp' ? (
            <button
              onClick={() => setStep('login')}
              className="p-2 rounded-full bg-slate-800/80 text-slate-300 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1d182f] border border-cyan-500/20">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-[10px] font-bold text-cyan-300 uppercase font-mono">Multiverse v4.9</span>
            </div>
          )}

          <button
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-white px-3 py-1 rounded-full bg-slate-800/60"
          >
            Cancel
          </button>
        </div>

        {step === 'login' ? (
          /* Step 1: Login Form */
          <div className="space-y-4 relative z-10">
            <div className="text-center space-y-1">
              <h2 className="text-2xl font-bold text-white tracking-tight">
                {t('auth.title', 'AURA Lorekeeper Access')}
              </h2>
              <p className="text-xs text-slate-400">
                {t('auth.subtitle', 'Sign in with cryptographic keypass or email verification')}
              </p>
            </div>

            <form onSubmit={handleSendCode} className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Fingerprint className="w-3.5 h-3.5 text-cyan-400" />
                    {t('auth.email_label', 'Creator Email or Web3 Handle')}
                  </span>
                  <span className="text-cyan-400 text-[10px] uppercase font-mono">Secured</span>
                </label>
                <div className="flex items-center bg-[#100b21] border border-slate-700/80 rounded-xl px-3.5 py-2.5 shadow-inner focus-within:border-purple-500">
                  <Mail className="w-4 h-4 text-slate-500 mr-2" />
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
                    placeholder={t('auth.email_placeholder', 'lorekeeper@auraverse.io')}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 hover:opacity-95 active:scale-95 transition-all"
              >
                <span>{t('auth.send_code', 'Generate Verification Cipher')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleBiometricFill}
                className="w-full py-2.5 rounded-xl bg-[#211c33] hover:bg-[#2c273e] text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 border border-slate-800 transition-colors"
              >
                <Fingerprint className="w-4 h-4 text-cyan-400" />
                <span>{t('auth.biometric', 'Use Biometric Passkey')}</span>
              </button>
            </form>

            <div className="relative flex items-center my-3">
              <div className="flex-grow h-px bg-slate-800" />
              <span className="px-2 text-[10px] text-slate-500 uppercase font-mono">or connect with credentials</span>
              <div className="flex-grow h-px bg-slate-800" />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => verifyFinalCode('DISCORD')}
                className="p-2.5 rounded-xl bg-[#1d182f] hover:bg-[#211c33] border border-slate-800 text-xs text-slate-200 flex items-center gap-2"
              >
                <div className="w-6 h-6 rounded bg-[#5865F2]/20 flex items-center justify-center text-[#5865F2] font-bold text-[10px]">
                  D
                </div>
                <div className="text-left">
                  <span className="block font-bold text-[11px] leading-tight">Discord</span>
                  <span className="text-[9px] text-slate-400">Sync Roles</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => verifyFinalCode('WALLET')}
                className="p-2.5 rounded-xl bg-[#1d182f] hover:bg-[#211c33] border border-slate-800 text-xs text-slate-200 flex items-center gap-2"
              >
                <div className="w-6 h-6 rounded bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold text-[10px]">
                  W
                </div>
                <div className="text-left">
                  <span className="block font-bold text-[11px] leading-tight">Web3 Wallet</span>
                  <span className="text-[9px] text-cyan-400">Fan Tokens</span>
                </div>
              </button>
            </div>
          </div>
        ) : (
          /* Step 2: 6-Digit OTP Screen */
          <div className="space-y-4 relative z-10 text-center">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-white tracking-tight">Verify Neural Link</h2>
              <p className="text-xs text-slate-400">
                Enter the 6-digit sync code beamed to <span className="text-purple-400 font-semibold">{identifier}</span>
              </p>
            </div>

            {/* 6 Digit Slots */}
            <div className="flex justify-center items-center gap-2 my-4">
              {[0, 1, 2, 3, 4, 5].map((idx) => {
                const digit = otpDigits[idx] || '';
                const isActive = idx === otpDigits.length;
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
                <button
                  key={k}
                  type="button"
                  onClick={() => handleKeypadPress(k)}
                  className="h-11 rounded-xl bg-[#211c33] hover:bg-[#2c273e] text-white font-bold text-sm shadow-sm active:scale-95 transition-transform"
                >
                  {k}
                </button>
              ))}
              <button
                type="button"
                onClick={handleBiometricFill}
                className="h-11 rounded-xl bg-[#1d182f] text-pink-400 hover:text-white flex items-center justify-center active:scale-95"
                title="Biometric Fill"
              >
                <Fingerprint className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => handleKeypadPress('0')}
                className="h-11 rounded-xl bg-[#211c33] hover:bg-[#2c273e] text-white font-bold text-sm shadow-sm active:scale-95"
              >
                0
              </button>
              <button
                type="button"
                onClick={handleBackspace}
                className="h-11 rounded-xl bg-[#1d182f] text-slate-400 hover:text-white flex items-center justify-center active:scale-95"
                title="Backspace"
              >
                ⌫
              </button>
            </div>

            {/* Confirm / Synchronize Button */}
            <button
              onClick={() => verifyFinalCode(otpDigits.join(''))}
              disabled={isVerifying || otpDigits.length < 6}
              className="w-full py-3 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 hover:opacity-95 active:scale-95 transition-all disabled:opacity-50 mt-3"
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
            </button>
          </div>
        )}

        {/* Quantum Security Micro Badge */}
        <div className="mt-4 pt-3 border-t border-slate-800 text-center flex items-center justify-center gap-1.5 text-[10px] text-slate-500 font-mono">
          <Shield className="w-3.5 h-3.5 text-cyan-400" />
          <span>Zero-Trust Quantum Encrypted Session</span>
        </div>
      </div>
    </div>
  );
};
