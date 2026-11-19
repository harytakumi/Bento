/* Mini-game 4: Tebak Makanan Rahasia — teka-teki suara Koki Moomoo dengan 3 kartu gambar besar (3 ronde) */
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { FOOD_ITEMS } from '../../data/foods';
import { audioEngine } from '../../lib/audioEngine';
import { generateRiddleOrStory, getRiddleLocally } from '../../lib/gameApi';
import type { FoodItem, MascotExpression } from '../../types';
import { MoomooBanner } from '../KokiMoomoo';

interface TebakMakananGameProps {
  isSpeaking: boolean;
  onCompleteSession: () => void;
}

interface RiddleRound {
  target: FoodItem;
  options: FoodItem[];
}

function buildRiddleRounds(): RiddleRound[] {
  const candidates = FOOD_ITEMS.filter((f) => f.health_status === 'makanan_super');
  const shuffled = [...candidates].sort(() => Math.random() - 0.5);
  const targets = shuffled.slice(0, 3);

  return targets.map((target) => {
    const distractors = candidates
      .filter((c) => c.id !== target.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 2);
    const options = [target, ...distractors].sort(() => Math.random() - 0.5);
    return { target, options };
  });
}

export function TebakMakananGame({
  isSpeaking,
  onCompleteSession,
}: TebakMakananGameProps) {
  const rounds = useMemo(() => buildRiddleRounds(), []);
  const [round, setRound] = useState(0);
  const [solved, setSolved] = useState(false);
  const [wobbleId, setWobbleId] = useState<string | null>(null);
  const [expression, setExpression] = useState<MascotExpression>('senang');
  const [riddleText, setRiddleText] = useState('');
  const [funFact, setFunFact] = useState('');

  const currentRound = rounds[round];

  useEffect(() => {
    let active = true;
    const localRiddle = getRiddleLocally(currentRound.target);

    setExpression('senang');
    setRiddleText(localRiddle.voice_text);
    setFunFact(localRiddle.fun_fact);
    audioEngine.speak(localRiddle.voice_text);

    // Ambil variasi teka-teki dari Gemini bila tersedia (untuk ronde aktif jika belum selesai)
    void generateRiddleOrStory('tebak_makanan', currentRound.target).then((res) => {
      if (!active || res.source !== 'gemini') return;
      setRiddleText((prev) => {
        if (prev === localRiddle.voice_text) {
          audioEngine.speak(res.voice_text);
          return res.voice_text;
        }
        return prev;
      });
      setFunFact(res.fun_fact);
    });

    return () => {
      active = false;
    };
  }, [round, currentRound.target]);

  const handlePickCard = (item: FoodItem) => {
    if (solved) return;

    if (item.id === currentRound.target.id) {
      audioEngine.playDingDong();
      setSolved(true);
      setExpression('bersorak');
      setRiddleText(funFact);
      audioEngine.speak(funFact);
    } else {
      audioEngine.playBoing();
      setWobbleId(item.id);
      setTimeout(() => setWobbleId(null), 480);
      setExpression('berpikir');
      const hint = `Wah, itu ${item.name}! Coba dengarkan petunjuk warna dan bentuknya sekali lagi ya.`;
      setRiddleText(hint);
      audioEngine.speak(hint);
    }
  };

  const handleNext = () => {
    audioEngine.playPop();
    if (round >= 2) {
      onCompleteSession();
      return;
    }
    setSolved(false);
    setRound((prev) => prev + 1);
  };

  return (
    <main className="w-full max-w-5xl mx-auto px-4 pb-10 pt-2 flex flex-col gap-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display text-2xl font-bold text-slate-900">
          Tebak Makanan Rahasia
        </h2>
        <div className="px-4 py-2 rounded-2xl bg-white border-2 border-amber-200 font-display font-bold text-lg text-amber-900 tabular-nums">
          Ronde {round + 1} dari 3
        </div>
      </div>

      <MoomooBanner
        expression={expression}
        message={riddleText}
        isSpeaking={isSpeaking}
        onRepeatSpeech={() => audioEngine.speak(riddleText)}
      />

      <section aria-label="Pilihan tebak makanan" className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {currentRound.options.map((item) => {
          const isCorrect = solved && item.id === currentRound.target.id;
          const isWobbling = wobbleId === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handlePickCard(item)}
              className={`relative min-h-[210px] rounded-3xl border-4 p-6 flex flex-col items-center justify-center gap-3 transition-transform duration-150 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-300 ${
                isCorrect
                  ? 'bg-emerald-50 border-emerald-500 scale-[1.03]'
                  : 'bg-white hover:bg-amber-50 border-amber-200 active:scale-95 cursor-pointer'
              } ${isWobbling ? 'animate-wobble' : ''}`}
            >
              {isCorrect ? (
                <div className="absolute top-3 right-3 flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-600 text-white font-display font-bold text-sm animate-pop">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Benar!</span>
                </div>
              ) : null}

              <span className="text-8xl select-none" aria-hidden="true">
                {item.emoji}
              </span>
              <span className="font-display text-2xl font-bold text-slate-900 text-center">
                {item.name}
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
