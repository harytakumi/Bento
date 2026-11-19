/* Modal Papan Koleksi Stiker Bintang Koki Moomoo */
import { X } from 'lucide-react';
import { STICKER_CATALOG } from '../data/foods';
import { audioEngine } from '../lib/audioEngine';

interface StickerBoardModalProps {
  earnedIds: string[];
  onClose: () => void;
}

export function StickerBoardModal({ earnedIds, onClose }: StickerBoardModalProps) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="sticker-board-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/55 p-4 overflow-y-auto"
    >
      <div className="w-full max-w-2xl bg-white border-4 border-amber-300 rounded-3xl p-6 sm:p-8 shadow-xl animate-pop">
        <div className="flex items-center justify-between gap-4 mb-5">
          <div>
            <h2
              id="sticker-board-title"
              className="font-display text-2xl sm:text-3xl font-bold text-slate-900"
            >
              Papan Stiker Koki Moomoo
            </h2>
            <p className="text-base text-slate-600 mt-1">
              Terkumpul <strong className="tabular-nums text-amber-700">{earnedIds.length}</strong> dari {STICKER_CATALOG.length} stiker ceria!
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              audioEngine.playPop();
              onClose();
            }}
            aria-label="Tutup papan stiker"
            className="min-w-[64px] min-h-[64px] rounded-2xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-800 flex items-center justify-center transition-transform duration-150 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-300 cursor-pointer"
          >
            <X className="w-7 h-7" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          {STICKER_CATALOG.map((sticker) => {
            const isEarned = earnedIds.includes(sticker.id);
            return (
              <button
                key={sticker.id}
                type="button"
                onClick={() => {
                  audioEngine.playPop();
                  if (isEarned) {
                    audioEngine.speak(`Ini stiker ${sticker.name}! Hebat sekali!`);
                  } else {
                    audioEngine.speak(`Mainkan permainan untuk membuka stiker ${sticker.name}!`);
                  }
                }}
                className={`min-h-[120px] rounded-3xl p-3 flex flex-col items-center justify-center gap-2 border-2 transition-transform duration-150 active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-300 ${
                  isEarned
                    ? `${sticker.bgClass} border-amber-300 text-slate-900`
                    : 'bg-slate-50 border-dashed border-slate-300 text-slate-500'
                }`}
              >
                <span
                  className={`text-5xl select-none ${isEarned ? '' : 'opacity-30 grayscale'}`}
                  aria-hidden="true"
                >
                  {sticker.emoji}
                </span>
                <span className="font-display text-sm sm:text-base font-bold text-center leading-tight">
                  {sticker.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
