import React, { useState } from 'react';
import { Award, Heart, Sparkles, CheckCircle2, DollarSign } from 'lucide-react';
import confetti from 'canvas-confetti';
import { MOCK_ATHLETES, type AthleteProfile } from '../data/mockMatchData';
import { useLanguage } from '../context/LanguageContext';

export const AthletePassport: React.FC = () => {
  const { t } = useLanguage();
  const [athletes, setAthletes] = useState<AthleteProfile[]>(MOCK_ATHLETES);
  const [supportedId, setSupportedId] = useState<string | null>(null);
  const [userTokens, setUserTokens] = useState<number>(350);

  const handleSupport = (id: string) => {
    if (userTokens < 50) return;

    // Trigger celebratory confetti effect
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.7 }
    });

    setUserTokens((prev) => prev - 50);
    setSupportedId(id);

    setAthletes((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          return {
            ...a,
            currentFund: a.currentFund + 50,
            stats: {
              ...a.stats,
              fanTokensSupported: a.stats.fanTokensSupported + 50
            }
          };
        }
        return a;
      })
    );

    setTimeout(() => {
      setSupportedId(null);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Banner */}
      <div className="bg-gradient-to-r from-pink-950/40 via-purple-950/30 to-slate-900 border border-pink-500/20 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-pink-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Heart className="w-4 h-4 text-pink-500 fill-pink-500" />
            <span>{t('athletes.badge', 'Empowerment & Grassroots Inclusivity')}</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            {t('athletes.title', 'Athlete Digital Passport & Micro-Sponsorship Hub')}
          </h2>
          <p className="text-sm text-slate-300 max-w-2xl mt-1">
            {t('athletes.desc', 'Bridging the grassroots funding divide. Fans back women athletes and academy talent directly, earning verified digital credentials while funding gear, travel, and training clinics.')}
          </p>
        </div>

        {/* User Balance Token Pill */}
        <div className="flex items-center space-x-3 bg-slate-900 border border-slate-700 p-3 rounded-2xl">
          <div className="w-10 h-10 rounded-xl bg-pink-500/20 border border-pink-500/30 flex items-center justify-center text-pink-400 font-bold">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block">{t('athletes.balance', 'Your Fan Balance')}</span>
            <span className="text-base font-extrabold text-white">{userTokens} {t('athletes.tokens', 'Fan Tokens')}</span>
          </div>
        </div>
      </div>

      {/* Athlete Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {athletes.map((athlete) => {
          const fundPercentage = Math.min(100, Math.round((athlete.currentFund / athlete.targetFund) * 100));
          const isJustSupported = supportedId === athlete.id;

          return (
            <div
              key={athlete.id}
              className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-all duration-300 flex flex-col justify-between group shadow-lg"
            >
              <div>
                {/* Top Image & Hero Badge */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-950">
                  <img
                    src={athlete.image}
                    alt={athlete.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                    {athlete.badges.map((b, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-pink-300 border border-pink-500/30"
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-extrabold text-white leading-tight">{athlete.name}</h3>
                      <p className="text-xs text-purple-300 font-medium">{athlete.role} • {athlete.team}</p>
                    </div>
                  </div>
                </div>

                {/* Body Content & Stats */}
                <div className="p-5 space-y-4">
                  {/* Key Stats Strip */}
                  <div className="grid grid-cols-3 gap-2 bg-slate-950/60 rounded-xl p-2.5 border border-slate-800 text-center">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-mono">Matches</span>
                      <span className="font-bold text-white text-xs">{athlete.stats.matches}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-mono">Strike Rate</span>
                      <span className="font-bold text-emerald-400 text-xs">{athlete.stats.strikeRate}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-mono">
                        {athlete.stats.wickets ? 'Wickets' : 'High Score'}
                      </span>
                      <span className="font-bold text-pink-400 text-xs">
                        {athlete.stats.wickets || athlete.stats.highScore}
                      </span>
                    </div>
                  </div>

                  {/* Journey Bio */}
                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                    {athlete.journey}
                  </p>

                  {/* Grassroots Fund Progress */}
                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-200 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                        Grassroots Equipment Goal
                      </span>
                      <span className="font-mono text-pink-400 font-bold">{fundPercentage}%</span>
                    </div>

                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-pink-500 to-purple-600 transition-all duration-500"
                        style={{ width: `${fundPercentage}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                      <span>\${athlete.currentFund} raised</span>
                      <span>Target: \${athlete.targetFund}</span>
                    </div>

                    <p className="text-[11px] text-slate-400 italic">
                      "{athlete.fundPurpose}"
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Support Button */}
              <div className="p-5 pt-0">
                <button
                  onClick={() => handleSupport(athlete.id)}
                  disabled={userTokens < 50}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-md ${
                    isJustSupported
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white shadow-pink-600/20'
                  }`}
                >
                  {isJustSupported ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{t('athletes.backed_success', 'Athlete Backed! +50 Sparks')}</span>
                    </>
                  ) : (
                    <>
                      <Heart className="w-4 h-4 fill-white" />
                      <span>{t('athletes.back_athlete', 'Back with 50 Tokens')}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Sustainability / Governance Pledge */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-emerald-400" />
          <span>
            <strong>ICC Future Stars Transparency Protocol:</strong> 100% of grassroots micro-pledges are directly audited and distributed to registered academies.
          </span>
        </div>
        <span className="text-purple-400 font-semibold cursor-pointer hover:underline">
          View Impact Audit Ledger →
        </span>
      </div>
    </div>
  );
};
