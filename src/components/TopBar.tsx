/* Bilah atas aplikasi Bento Ceria! dengan tombol Rumah, Papan Stiker Koki, dan Mute/Unmute */
import { Award, Home, Volume2, VolumeX } from 'lucide-react';
import { audioEngine } from '../lib/audioEngine';
import type { MiniGameId } from '../types';

interface TopBarProps {
  activeGame: MiniGameId;
  stickersCount: number;
  isMuted: boolean;
  onGoHome: () => void;
  onOpenStickers: () => void;
  onToggleMute: () => void;
}

export function TopBar({
  activeGame,
  stickersCount,
  isMuted,
  onGoHome,
  onOpenStickers,
  onToggleMute,
}: TopBarProps) {
  return (
    <header className="w-full max-w-5xl mx-auto flex items-center justify-between gap-3 px-4 pt-4 pb-2">
      <div className="flex items-center gap-3 min-w-0">
        {activeGame !== 'menu' ? (
          <button
            type="button"
            onClick={() => {
              audioEngine.playPop();
              onGoHome();
            }}
            className="min-w-[64px] min-h-[64px] px-4 py-2 rounded-2xl bg-white border-2 border-amber-300 hover:bg-amber-50 active:scale-95 text-slate-800 font-display font-bold text-base flex items-center gap-2 transition-transform duration-150 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-300 cursor-pointer"
            aria-label="Kembali ke menu utama"
          >
            <Home className="w-6 h-6 text-amber-600 shrink-0" />
            <span className="whitespace-nowrap">Menu</span>
          </button>
        ) : null}

        <div className="flex items-center gap-2.5 min-w-0">
          <span className="text-3xl sm:text-4xl select-none" aria-hidden="true">
            🍱
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight truncate">
            Bento Ceria!
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2.5 shrink-0">
        <button
          type="button"
          onClick={() => {
            audioEngine.playPop();
            onOpenStickers();
          }}
          className="min-h-[64px] px-4 py-2 rounded-2xl bg-amber-100 hover:bg-amber-200 border-2 border-amber-300 active:scale-95 text-amber-950 font-display font-bold text-base sm:text-lg flex items-center gap-2 transition-transform duration-150 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-400 cursor-pointer"
          aria-label={`Lihat papan stiker koki, terkumpul ${stickersCount} stiker`}
        >
          <Award className="w-6 h-6 text-amber-700 shrink-0" />
          <span className="tabular-nums whitespace-nowrap">{stickersCount} Stiker</span>
        </button>

        <button
          type="button"
          onClick={onToggleMute}
          className={`min-w-[64px] min-h-[64px] px-4 py-2 rounded-2xl border-2 active:scale-95 font-display font-bold text-base flex items-center justify-center gap-2 transition-transform duration-150 focus-visible:outline-none focus-visible:ring-4 cursor-pointer ${
            isMuted
              ? 'bg-rose-50 border-rose-300 text-rose-800 hover:bg-rose-100 focus-visible:ring-rose-300'
              : 'bg-emerald-50 border-emerald-300 text-emerald-900 hover:bg-emerald-100 focus-visible:ring-emerald-300'
          }`}
          aria-label={isMuted ? 'Nyalakan suara' : 'Matikan suara'}
        >
          {isMuted ? (
            <VolumeX className="w-6 h-6 shrink-0" />
          ) : (
            <Volume2 className="w-6 h-6 shrink-0" />
          )}
          <span className="hidden sm:inline whitespace-nowrap">
            {isMuted ? 'Suara Mati' : 'Suara Aktif'}
          </span>
        </button>
      </div>
    </header>
  );
}
