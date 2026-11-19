/* Mini-game 1: Rakit Bento Sehat — mengisi 4 sekat kotak bekal untuk teman hewan (3 ronde) */
import { ArrowRight, RefreshCw, Sparkles, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  ANIMAL_FRIENDS,
  BENTO_SLOT_META,
  FOOD_ITEMS,
  getItemsForBentoSlot,
} from '../../data/foods';
import { audioEngine } from '../../lib/audioEngine';
import { evaluateBento } from '../../lib/gameApi';
import type {
  BentoEvaluationResponse,
  BentoSlotKey,
  FoodItem,
  MascotExpression,
} from '../../types';
import { MoomooBanner } from '../KokiMoomoo';

interface RakitBentoGameProps {
  isSpeaking: boolean;
  onCompleteSession: () => void;
}

const SLOT_ORDER: BentoSlotKey[] = [
  'karbohidrat',
  'protein',
  'sayur_buah',
  'minuman_camilan',
];

const EMPTY_SLOTS: Record<BentoSlotKey, FoodItem | null> = {
  karbohidrat: null,
  protein: null,
  sayur_buah: null,
  minuman_camilan: null,
};

export function RakitBentoGame({
  isSpeaking,
  onCompleteSession,
}: RakitBentoGameProps) {
  const [round, setRound] = useState(0); // 0, 1, 2
  const [slots, setSlots] = useState<Record<BentoSlotKey, FoodItem | null>>(EMPTY_SLOTS);
  const [activeSlot, setActiveSlot] = useState<BentoSlotKey>('karbohidrat');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<BentoEvaluationResponse | null>(null);
  const [expression, setExpression] = useState<MascotExpression>('senang');
  const [bannerMessage, setBannerMessage] = useState('');

  const animal = ANIMAL_FRIENDS[round % ANIMAL_FRIENDS.length];
  const shelfItems = getItemsForBentoSlot(activeSlot);
  const filledCount = SLOT_ORDER.filter((key) => slots[key] !== null).length;
  const allFilled = filledCount === 4;

  useEffect(() => {
    const intro = `Ronde ${round + 1}! Yuk siapkan kotak bekal sehat untuk ${animal.name}. Ketuk makanan di bawah!`;
    setBannerMessage(intro);
    setExpression('senang');
    audioEngine.speak(intro);
  }, [round, animal.name]);

  const handleSelectSlot = (slotKey: BentoSlotKey) => {
    if (evaluation || isEvaluating) return;
    audioEngine.playPop();
    setActiveSlot(slotKey);
    const meta = BENTO_SLOT_META[slotKey];
    audioEngine.speak(`${meta.label}. ${meta.hint}`);
  };

  const handlePickFood = (food: FoodItem) => {
    if (evaluation || isEvaluating) return;
    audioEngine.playPop();
    audioEngine.speak(food.name);

    const updated = { ...slots, [activeSlot]: food };
    setSlots(updated);

    const nextEmpty = SLOT_ORDER.find((key) => updated[key] === null);
    if (nextEmpty) {
      setActiveSlot(nextEmpty);
    }
  };

  const runEvaluation = async (currentSlots: Record<BentoSlotKey, FoodItem | null>) => {
    const chosen = SLOT_ORDER.map((k) => currentSlots[k]).filter(
      (item): item is FoodItem => item !== null,
    );
    if (chosen.length < 4) return;

    setIsEvaluating(true);
    setExpression('berpikir');
    setBannerMessage('Koki Moomoo sedang mencicipi bekal buatanmu…');

    const result = await evaluateBento(animal.name, chosen);
    setIsEvaluating(false);
    setEvaluation(result);
    setExpression(result.mascot_expression);
    setBannerMessage(result.moomoo_voice_text);

    if (result.status === 'bento_sempurna') {
      audioEngine.playDingDong();
    } else {
      audioEngine.playBoing();
    }
    audioEngine.speak(result.moomoo_voice_text);
  };

  const handleServe = () => {
    if (!allFilled || isEvaluating) return;
    audioEngine.playPop();
    void runEvaluation(slots);
  };

  const handleGentleSwap = () => {
    if (!evaluation?.suggested_swap_id) return;
    const swapFood = FOOD_ITEMS.find((f) => f.id === evaluation.suggested_swap_id);
    if (!swapFood) return;

    audioEngine.playPop();

    const targetSlotKey =
      SLOT_ORDER.find((k) => slots[k]?.health_status === 'camilan_sesekali') ??
      (swapFood.category === 'minuman_sehat' ? 'minuman_camilan' : 'sayur_buah');

    const updated = { ...slots, [targetSlotKey]: swapFood };
    setSlots(updated);
    setEvaluation(null);
    void runEvaluation(updated);
  };

  const handleNextRound = () => {
    audioEngine.playPop();
    if (round >= 2) {
      onCompleteSession();
      return;
    }
    setSlots(EMPTY_SLOTS);
    setActiveSlot('karbohidrat');
    setEvaluation(null);
    setRound((prev) => prev + 1);
  };

  const suggestedFood = evaluation?.suggested_swap_id
    ? FOOD_ITEMS.find((f) => f.id === evaluation.suggested_swap_id)
    : null;

  return (
    <main className="w-full max-w-5xl mx-auto px-4 pb-10 pt-2 flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl border-2 ${animal.bgClass} ${animal.borderClass}`}>
          <span className="text-4xl select-none" aria-hidden="true">
            {animal.emoji}
          </span>
          <div>
            <p className="font-display text-lg font-bold text-slate-900">
              Bekal untuk {animal.name}
            </p>
            <p className="text-sm font-medium text-slate-700">{animal.favoriteHint}</p>
          </div>
        </div>

        <div className="px-4 py-2 rounded-2xl bg-white border-2 border-amber-200 font-display font-bold text-lg text-amber-900 tabular-nums">
          Ronde {round + 1} dari 3
        </div>
      </div>

      <MoomooBanner
        expression={expression}
        message={bannerMessage}
        isSpeaking={isSpeaking}
        isCooking={isEvaluating}
        onRepeatSpeech={() => audioEngine.speak(bannerMessage)}
      />

      {/* Kotak Bekal 4 Sekat */}
      <section aria-label="Kotak bekal bento 4 sekat" className="bg-white border-4 border-orange-200 rounded-3xl p-4 sm:p-6 shadow-sm">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {SLOT_ORDER.map((slotKey) => {
            const meta = BENTO_SLOT_META[slotKey];
            const item = slots[slotKey];
            const isSelected = activeSlot === slotKey && !evaluation;
            return (
              <button
                key={slotKey}
                type="button"
                onClick={() => handleSelectSlot(slotKey)}
                className={`min-h-[136px] rounded-3xl border-3 p-3 flex flex-col items-center justify-center gap-1.5 transition-transform duration-150 active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-300 ${
                  isSelected
                    ? `${meta.accentBg} border-orange-500 ring-4 ring-orange-200`
                    : item
                      ? `${meta.accentBg} ${meta.accentBorder}`
                      : 'bg-slate-50 border-dashed border-slate-300 hover:bg-slate-100'
                }`}
              >
                <span className="text-xs sm:text-sm font-bold text-slate-600">
                  {meta.shortLabel}
                </span>
                {item ? (
                  <>
                    <span className="text-5xl sm:text-6xl select-none animate-pop" aria-hidden="true">
                      {item.emoji}
                    </span>
                    <span className="font-display text-base font-bold text-slate-900 text-center leading-tight">
                      {item.name}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-4xl opacity-40 select-none" aria-hidden="true">
                      {meta.emoji}
                    </span>
                    <span className="text-sm font-semibold text-slate-500">
                      Ketuk isi
                    </span>
                  </>
                )}
              </button>
            );
          })}
        </div>

        {/* Tombol Sajikan atau Hasil Evaluasi */}
        {!evaluation ? (
          <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-base font-semibold text-slate-700 tabular-nums">
              Sekat terisi: <strong>{filledCount}</strong> dari 4
            </p>
            <button
              type="button"
              disabled={!allFilled || isEvaluating}
              onClick={handleServe}
              className={`w-full sm:w-auto min-h-[68px] px-8 py-3 rounded-2xl font-display font-bold text-xl flex items-center justify-center gap-2 transition-transform duration-150 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300 ${
                allFilled && !isEvaluating
                  ? 'bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white cursor-pointer shadow-sm'
                  : 'bg-slate-200 text-slate-500 cursor-not-allowed'
              }`}
            >
              <Sparkles className="w-6 h-6 shrink-0" />
              <span className="whitespace-nowrap">
                {isEvaluating ? 'Mencicipi…' : 'Sajikan Bekal!'}
              </span>
            </button>
          </div>
        ) : (
          <div className="mt-5 p-4 rounded-2xl bg-amber-50 border-2 border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-4 animate-pop">
            <div className="flex items-center gap-2">
              {evaluation.status === 'bento_sempurna' ? (
                <div className="flex items-center gap-1" aria-label="Tiga bintang">
                  <Star className="w-8 h-8 fill-amber-400 text-amber-500" />
                  <Star className="w-8 h-8 fill-amber-400 text-amber-500" />
                  <Star className="w-8 h-8 fill-amber-400 text-amber-500" />
                </div>
              ) : (
                <div className="flex items-center gap-1" aria-label="Dua bintang semangat">
                  <Star className="w-8 h-8 fill-amber-400 text-amber-500" />
                  <Star className="w-8 h-8 fill-amber-400 text-amber-500" />
                </div>
              )}
              <span className="font-display text-lg font-bold text-slate-900">
                {evaluation.status === 'bento_sempurna'
                  ? 'Bento Super Bergizi!'
                  : 'Yuk Coba Tukar Lembut!'}
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 w-full sm:w-auto">
              {evaluation.status === 'perlu_tukar_lembut' && suggestedFood ? (
                <button
                  type="button"
                  onClick={handleGentleSwap}
                  className="min-h-[64px] px-5 py-3 rounded-2xl bg-sky-600 hover:bg-sky-700 active:scale-95 text-white font-display font-bold text-lg flex items-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300"
                >
                  <RefreshCw className="w-5 h-5 shrink-0" />
                  <span className="whitespace-nowrap">
                    Tukar ke {suggestedFood.emoji} {suggestedFood.name}
                  </span>
                </button>
              ) : null}

              <button
                type="button"
                onClick={handleNextRound}
                className="min-h-[64px] px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-display font-bold text-lg flex items-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300"
              >
                <span className="whitespace-nowrap">
                  {round >= 2 ? 'Ambil Stiker!' : 'Ronde Berikutnya'}
                </span>
                <ArrowRight className="w-5 h-5 shrink-0" />
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Rak Pilihan Makanan untuk Sekat Aktif */}
      {!evaluation ? (
        <section aria-label="Pilihan makanan" className="bg-white border-2 border-amber-200 rounded-3xl p-4 sm:p-5">
          <div className="flex items-center justify-between gap-2 mb-3">
            <h3 className="font-display text-xl font-bold text-slate-900">
              Pilih untuk Sekat {BENTO_SLOT_META[activeSlot].shortLabel}:
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {shelfItems.map((item) => {
              const isChosen = slots[activeSlot]?.id === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handlePickFood(item)}
                  className={`min-h-[112px] rounded-2xl border-2 p-3 flex flex-col items-center justify-center gap-1.5 transition-transform duration-150 active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-300 ${
                    isChosen
                      ? 'bg-amber-100 border-amber-500'
                      : 'bg-amber-50/50 hover:bg-amber-50 border-amber-200'
                  }`}
                >
                  <span className="text-5xl select-none" aria-hidden="true">
                    {item.emoji}
                  </span>
                  <span className="font-display text-sm sm:text-base font-bold text-slate-900 text-center leading-tight">
                    {item.name}
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      ) : null}
    </main>
  );
}
