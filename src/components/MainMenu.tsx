/* Menu utama Bento Ceria! dengan 4 kartu mini-game raksasa ramah anak */
import { useRef } from 'react';
import { audioEngine } from '../lib/audioEngine';
import type { MiniGameId } from '../types';
import { MoomooBanner } from './KokiMoomoo';

interface MainMenuProps {
  isSpeaking: boolean;
  onSelectGame: (gameId: Exclude<MiniGameId, 'menu'>) => void;
}

interface GameCardItem {
  id: Exclude<MiniGameId, 'menu'>;
  title: string;
  subtitle: string;
  emoji: string;
  cardClass: string;
  badgeClass: string;
  speechTitle: string;
}

const GAME_CARDS: GameCardItem[] = [
  {
    id: 'rakit_bento',
    title: 'Rakit Bento Sehat',
    subtitle: 'Isi 4 sekat kotak bekal teman hewan!',
    emoji: '🍱',
    cardClass: 'bg-orange-100 hover:bg-orange-200 border-orange-300 text-slate-900',
    badgeClass: 'bg-white/90 text-orange-800',
    speechTitle: 'Rakit Bento Sehat! Ayo susun bekal lezat untuk teman hewan.',
  },
  {
    id: 'sortir_keranjang',
    title: 'Sortir Keranjang Belanja',
    subtitle: 'Pilih keranjang hijau atau kuning!',
    emoji: '🧺',
    cardClass: 'bg-emerald-100 hover:bg-emerald-200 border-emerald-300 text-slate-900',
    badgeClass: 'bg-white/90 text-emerald-800',
    speechTitle: 'Sortir Keranjang Belanja! Pisahkan makanan super dan camilan sesekali.',
  },
  {
    id: 'detektif_kebersihan',
    title: 'Detektif Kebersihan',
    subtitle: 'Temukan makanan yang bersih dan aman!',
    emoji: '🧼',
    cardClass: 'bg-sky-100 hover:bg-sky-200 border-sky-300 text-slate-900',
    badgeClass: 'bg-white/90 text-sky-800',
    speechTitle: 'Detektif Kebersihan! Ayo pilih kebiasaan bersih dan sehat.',
  },
  {
    id: 'tebak_makanan',
    title: 'Tebak Makanan Rahasia',
    subtitle: 'Dengar teka-teki suara Koki Moomoo!',
    emoji: '❓',
    cardClass: 'bg-amber-100 hover:bg-amber-200 border-amber-300 text-slate-900',
    badgeClass: 'bg-white/90 text-amber-900',
    speechTitle: 'Tebak Makanan Rahasia! Dengarkan petunjuk suara dari Koki Moomoo.',
  },
];

const WELCOME_MESSAGE =
  'Halo Koki Cilik! Aku Koki Moomoo. Yuk sentuh salah satu permainan seru di bawah ini!';

export function MainMenu({ isSpeaking, onSelectGame }: MainMenuProps) {
  const lastHoverSpokenRef = useRef<string>('');

  const handleCardHover = (card: GameCardItem) => {
    if (lastHoverSpokenRef.current === card.id) return;
    lastHoverSpokenRef.current = card.id;
    audioEngine.speak(card.title);
  };

  return (
    <main className="w-full max-w-5xl mx-auto px-4 pb-10 pt-2 flex flex-col gap-6">
      <MoomooBanner
        expression="senang"
        message={WELCOME_MESSAGE}
        isSpeaking={isSpeaking}
        onRepeatSpeech={() => audioEngine.speak(WELCOME_MESSAGE)}
      />

      <section aria-label="Pilihan permainan">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {GAME_CARDS.map((card) => (
            <button
              key={card.id}
              type="button"
              onMouseEnter={() => handleCardHover(card)}
              onFocus={() => handleCardHover(card)}
              onClick={() => {
                audioEngine.playPop();
                onSelectGame(card.id);
              }}
              className={`group min-h-[168px] sm:min-h-[196px] rounded-3xl border-4 p-6 flex items-center gap-5 text-left transition-transform duration-150 hover:-translate-y-1 active:scale-[0.98] shadow-sm focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-400 cursor-pointer ${card.cardClass}`}
            >
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white/85 border-2 border-white flex items-center justify-center shrink-0 transition-transform duration-150 group-hover:scale-105">
                <span className="text-6xl sm:text-7xl select-none" aria-hidden="true">
                  {card.emoji}
                </span>
              </div>

              <div className="flex flex-col gap-2 min-w-0">
                <span className={`inline-block self-start px-3 py-1 rounded-full text-xs sm:text-sm font-bold ${card.badgeClass}`}>
                  3 Ronde Seru
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-bold leading-tight text-slate-900">
                  {card.title}
                </h2>
                <p className="text-base sm:text-lg font-medium text-slate-700 leading-snug">
                  {card.subtitle}
                </p>
              </div>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}
