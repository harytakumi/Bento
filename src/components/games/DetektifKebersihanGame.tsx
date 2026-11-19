/* Mini-game 3: Detektif Kebersihan — memilih 1 dari 2 kartu kondisi bersih dan aman (3 ronde) */
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { HYGIENE_PAIRS } from '../../data/foods';
import { audioEngine } from '../../lib/audioEngine';
import type { MascotExpression } from '../../types';
import { MoomooBanner } from '../KokiMoomoo';

interface DetektifKebersihanGameProps {
  isSpeaking: boolean;
  onCompleteSession: () => void;
}

export function DetektifKebersihanGame({
  isSpeaking,
  onCompleteSession,
}: DetektifKebersihanGameProps) {
  const roundPairs = useMemo(
    () =>
      [...HYGIENE_PAIRS]
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map((pair) => ({
          pair,
          healthyFirst: Math.random() >= 0.5,
        })),
    [],
  );

  const [round, setRound] = useState(0);
  const [solved, setSolved] = useState(false);
  const [dimmedUnhealthy, setDimmedUnhealthy] = useState(false);
  const [wobbleUnhealthy, setWobbleUnhealthy] = useState(false);
  const [expression, setExpression] = useState<MascotExpression>('senang');
  const [bannerMessage, setBannerMessage] = useState('');

  const current = roundPairs[round];

  useEffect(() => {
    setBannerMessage(current.pair.scenario_voice);
    setExpression('senang');
    audioEngine.speak(current.pair.scenario_voice);
  }, [round, current.pair.scenario_voice]);

  const handleSelectOption = (isHealthy: boolean) => {
    if (solved) return;

    if (isHealthy) {
      audioEngine.playDingDong();
      setSolved(true);
      setExpression('bersorak');
      setBannerMessage(current.pair.healthy_option.feedback);
      audioEngine.speak(current.pair.healthy_option.feedback);
    } else {
      audioEngine.playBoing();
      setDimmedUnhealthy(true);
      setWobbleUnhealthy(true);
      setTimeout(() => setWobbleUnhealthy(false), 480);
      setExpression('berpikir');
      setBannerMessage(current.pair.unhealthy_option.feedback);
      audioEngine.speak(current.pair.unhealthy_option.feedback);
    }
  };

  const handleNext = () => {
    audioEngine.playPop();
    if (round >= 2) {
      onCompleteSession();
      return;
    }
    setSolved(false);
    setDimmedUnhealthy(false);
    setRound((prev) => prev + 1);
  };

  const cards = current.healthyFirst
    ? [
        { isHealthy: true, option: current.pair.healthy_option },
        { isHealthy: false, option: current.pair.unhealthy_option },
      ]
    : [
        { isHealthy: false, option: current.pair.unhealthy_option },
        { isHealthy: true, option: current.pair.healthy_option },
      ];

  return (
    <main className="w-full max-w-5xl mx-auto px-4 pb-10 pt-2 flex flex-col gap-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display text-2xl font-bold text-slate-900">
          Detektif Kebersihan
        </h2>
        <div className="px-4 py-2 rounded-2xl bg-white border-2 border-sky-200 font-display font-bold text-lg text-sky-900 tabular-nums">
          Ronde {round + 1} dari 3
        </div>
      </div>

      <MoomooBanner
        expression={expression}
        message={bannerMessage}
        isSpeaking={isSpeaking}
        onRepeatSpeech={() => audioEngine.speak(bannerMessage)}
      />

      <section className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {cards.map(({ isHealthy, option }) => {
          const isDimmed = !isHealthy && dimmedUnhealthy;
          const isWobbling = !isHealthy && wobbleUnhealthy;
          const showSuccess = isHealthy && solved;

          return (
            <button
              key={option.label}
              type="button"
              onClick={() => handleSelectOption(isHealthy)}
              className={`relative min-h-[240px] rounded-3xl border-4 p-6 flex flex-col items-center justify-center gap-4 transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300 ${
                showSuccess
                  ? 'bg-emerald-50 border-emerald-500 scale-[1.02]'
                  : isDimmed
                    ? 'bg-slate-100 border-slate-300 opacity-50'
                    : 'bg-white hover:bg-sky-50 border-sky-200 active:scale-95 cursor-pointer'
              } ${isWobbling ? 'animate-wobble' : ''}`}
            >
              {showSuccess ? (
                <div className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1.5 rounded-full bg-emerald-600 text-white font-display font-bold text-sm animate-pop">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Bersih!</span>
                </div>
              ) : null}

              <div className="relative flex items-center justify-center w-32 h-32 rounded-3xl bg-sky-50 border-2 border-sky-100">
                <span className="text-7xl select-none" aria-hidden="true">
                  {option.emoji}
                </span>
                <span
                  className="absolute -bottom-2 -right-2 text-4xl bg-white rounded-full p-1 border-2 border-slate-200 select-none"
                  aria-hidden="true"
                >
                  {option.badgeEmoji}
                </span>
              </div>

              <span className="font-display text-2xl font-bold text-slate-900 text-center">
                {option.label}
              </span>
            </button>
          );
        })}
      </section>

      {solved ? (
        <div className="flex justify-center pt-1">
          <button
            type="button"
            onClick={handleNext}
            className="min-h-[68px] px-8 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-display font-bold text-xl flex items-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300 animate-pop"
          >
            <span className="whitespace-nowrap">
              {round >= 2 ? 'Ambil Stiker!' : 'Ronde Berikutnya'}
            </span>
            <ArrowRight className="w-6 h-6 shrink-0" />
          </button>
        </div>
      ) : null}
    </main>
  );
}
