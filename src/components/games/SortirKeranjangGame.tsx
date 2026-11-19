/* Mini-game 2: Sortir Keranjang Belanja — Keranjang Hijau (Makanan Super) vs Keranjang Kuning (Sesekali Saja) */
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { FOOD_ITEMS } from '../../data/foods';
import { audioEngine } from '../../lib/audioEngine';
import { generateRiddleOrStory } from '../../lib/gameApi';
import type { FoodItem, HealthStatus, MascotExpression } from '../../types';
import { MoomooBanner } from '../KokiMoomoo';

interface SortirKeranjangGameProps {
  isSpeaking: boolean;
  onCompleteSession: () => void;
}

function pickThreeSortirItems(): FoodItem[] {
  const supers = FOOD_ITEMS.filter((f) => f.health_status === 'makanan_super');
  const treats = FOOD_ITEMS.filter((f) => f.health_status === 'camilan_sesekali');

  const shuffledSuper = [...supers].sort(() => Math.random() - 0.5);
  const shuffledTreat = [...treats].sort(() => Math.random() - 0.5);

  return [shuffledSuper[0], shuffledTreat[0], shuffledSuper[1]].sort(
    () => Math.random() - 0.5,
  );
}

export function SortirKeranjangGame({
  isSpeaking,
  onCompleteSession,
}: SortirKeranjangGameProps) {
  const sessionItems = useMemo(() => pickThreeSortirItems(), []);
  const [round, setRound] = useState(0);
  const [solved, setSolved] = useState(false);
  const [wobble, setWobble] = useState(false);
  const [expression, setExpression] = useState<MascotExpression>('senang');
  const [bannerMessage, setBannerMessage] = useState('');

  const currentItem = sessionItems[round];

  useEffect(() => {
    const prompt = `Ini ${currentItem.name}! Masuk ke Keranjang Hijau Makanan Super atau Keranjang Kuning Camilan Sesekali?`;
    setBannerMessage(prompt);
    setExpression('senang');
    audioEngine.speak(prompt);
  }, [round, currentItem.name]);

  const handleChooseBasket = async (choice: HealthStatus) => {
    if (solved) return;

    if (choice === currentItem.health_status) {
      audioEngine.playDingDong();
      setSolved(true);
      setExpression('bersorak');
      const fallbackText = `Benar sekali! ${currentItem.kid_benefit}`;
      setBannerMessage(fallbackText);
      audioEngine.speak(fallbackText);

      // Perkaya kalimat cerita singkat lewat Gemini bila tersedia (tanpa mengganggu jika lambat)
      const story = await generateRiddleOrStory('sortir', currentItem);
      if (story.source === 'gemini' && story.voice_text) {
        setBannerMessage(story.voice_text);
      }
    } else {
      audioEngine.playBoing();
      setWobble(true);
      setTimeout(() => setWobble(false), 480);
      setExpression('berpikir');
      const hint =
        currentItem.health_status === 'makanan_super'
          ? `Wah hampir! ${currentItem.name} itu bikin tubuh sehat dan kuat setiap hari. Yuk coba ketuk Keranjang Hijau!`
          : `Wah hampir! ${currentItem.name} itu manis atau gurih sekali, jadi cukup sesekali saja. Yuk coba ketuk Keranjang Kuning!`;
      setBannerMessage(hint);
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
          Sortir Keranjang Belanja
        </h2>
        <div className="px-4 py-2 rounded-2xl bg-white border-2 border-emerald-200 font-display font-bold text-lg text-emerald-900 tabular-nums">
          Ronde {round + 1} dari 3
        </div>
      </div>

      <MoomooBanner
        expression={expression}
        message={bannerMessage}
        isSpeaking={isSpeaking}
        onRepeatSpeech={() => audioEngine.speak(bannerMessage)}
      />

      {/* Kartu Makanan Besar di Tengah */}
      <section className="flex flex-col items-center gap-5">
        <button
          type="button"
          onClick={() => {
            audioEngine.playPop();
            audioEngine.speak(currentItem.name);
          }}
          className={`w-full max-w-sm rounded-3xl bg-white border-4 border-amber-300 p-6 flex flex-col items-center gap-2 shadow-sm transition-transform duration-150 active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-300 ${
            wobble ? 'animate-wobble' : ''
          }`}
        >
          <span className="text-8xl sm:text-9xl select-none" aria-hidden="true">
            {currentItem.emoji}
          </span>
          <span className="font-display text-3xl font-bold text-slate-900">
            {currentItem.name}
          </span>
          {solved ? (
            <span className="inline-flex items-center gap-1.5 text-emerald-700 font-bold text-base mt-1">
              <CheckCircle2 className="w-5 h-5" />
              Sudah Masuk Keranjang!
            </span>
          ) : (
            <span className="text-sm font-medium text-slate-500">
              Ketuk gambar untuk dengar namanya
            </span>
          )}
        </button>

        {/* 2 Keranjang Raksasa */}
        {!solved ? (
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => void handleChooseBasket('makanan_super')}
              className="min-h-[140px] rounded-3xl bg-emerald-100 hover:bg-emerald-200 border-4 border-emerald-400 p-5 flex items-center gap-4 text-left transition-transform duration-150 active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-400"
            >
              <span className="text-6xl select-none shrink-0" aria-hidden="true">
                🥗
              </span>
              <div>
                <span className="font-display text-2xl font-bold text-emerald-950 block">
                  Keranjang Hijau
                </span>
                <span className="text-base font-bold text-emerald-800">
                  Makanan Super (Boleh Setiap Hari)
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => void handleChooseBasket('camilan_sesekali')}
              className="min-h-[140px] rounded-3xl bg-amber-100 hover:bg-amber-200 border-4 border-amber-400 p-5 flex items-center gap-4 text-left transition-transform duration-150 active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-400"
            >
              <span className="text-6xl select-none shrink-0" aria-hidden="true">
                🍩
              </span>
              <div>
                <span className="font-display text-2xl font-bold text-amber-950 block">
                  Keranjang Kuning
                </span>
                <span className="text-base font-bold text-amber-900">
                  Camilan Sesekali Saja
                </span>
              </div>
            </button>
          </div>
        ) : (
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
        )}
      </section>
    </main>
  );
}
