/* Layar perayaan penuh konfeti bintang & hadiah Stiker Koki Moomoo setelah menyelesaikan 3 ronde */
import { Home, RotateCcw } from 'lucide-react';
import { STICKER_CATALOG } from '../data/foods';
import { audioEngine } from '../lib/audioEngine';
import { KokiMoomooSvg } from './KokiMoomoo';

interface CelebrationModalProps {
  gameTitle: string;
  earnedStickerId: string;
  onPlayAgain: () => void;
  onBackToMenu: () => void;
}

const CONFETTI_ITEMS = [
  { emoji: '⭐', left: '8%', delay: '0s' },
  { emoji: '🌟', left: '20%', delay: '0.4s' },
  { emoji: '🎉', left: '34%', delay: '0.2s' },
  { emoji: '✨', left: '48%', delay: '0.7s' },
  { emoji: '⭐', left: '62%', delay: '0.1s' },
  { emoji: '🎊', left: '76%', delay: '0.5s' },
  { emoji: '🌟', left: '90%', delay: '0.3s' },
];

export function CelebrationModal({
  gameTitle,
  earnedStickerId,
  onPlayAgain,
  onBackToMenu,
}: CelebrationModalProps) {
  const sticker =
    STICKER_CATALOG.find((s) => s.id === earnedStickerId) ?? STICKER_CATALOG[0];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="celebration-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/55 p-4 overflow-y-auto"
    >
      <div className="relative w-full max-w-lg bg-white border-4 border-amber-300 rounded-3xl p-6 sm:p-8 text-center overflow-hidden shadow-xl animate-pop">
        {/* Konfeti bintang ceria */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-64 overflow-hidden" aria-hidden="true">
          {CONFETTI_ITEMS.map((item, idx) => (
            <span
              key={idx}
              style={{ left: item.left, animationDelay: item.delay }}
              className="absolute -top-4 text-3xl animate-confetti"
            >
              {item.emoji}
            </span>
          ))}
        </div>

        <div className="relative z-10 flex flex-col items-center gap-4">
          <KokiMoomooSvg expression="bersorak" isSpeaking={false} size={136} />

          <h2
            id="celebration-title"
            className="font-display text-3xl sm:text-4xl font-bold text-slate-900"
          >
            Yeay! Kamu Hebat!
          </h2>

          <p className="text-lg font-medium text-slate-700">
            Kamu sudah menyelesaikan semua ronde di <strong className="text-amber-700">{gameTitle}</strong>!
          </p>

          <div className={`w-full rounded-3xl border-2 border-amber-300 ${sticker.bgClass} p-5 flex flex-col items-center gap-2`}>
            <span className="text-sm font-bold text-amber-900">
              Hadiah Stiker Baru Untukmu
            </span>
            <span className="text-6xl select-none" aria-hidden="true">
              {sticker.emoji}
            </span>
            <span className="font-display text-2xl font-bold text-slate-900">
              {sticker.name}
            </span>
          </div>

          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                audioEngine.playPop();
                onPlayAgain();
              }}
              className="min-h-[64px] px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-display font-bold text-lg flex items-center justify-center gap-2 transition-transform duration-150 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300 cursor-pointer"
            >
              <RotateCcw className="w-6 h-6 shrink-0" />
              <span className="whitespace-nowrap">Main Lagi</span>
            </button>

            <button
              type="button"
              onClick={() => {
                audioEngine.playPop();
                onBackToMenu();
              }}
              className="min-h-[64px] px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-display font-bold text-lg flex items-center justify-center gap-2 transition-transform duration-150 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-300 cursor-pointer"
            >
              <Home className="w-6 h-6 shrink-0" />
              <span className="whitespace-nowrap">Pilih Game Lain</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
