/* Komponen akar Bento Ceria! — mengelola layar pembuka audio, navigasi 4 mini-game, dan hadiah stiker */
import { Play } from 'lucide-react';
import { useEffect, useState } from 'react';
import { CelebrationModal } from './components/CelebrationModal';
import { KokiMoomooSvg } from './components/KokiMoomoo';
import { MainMenu } from './components/MainMenu';
import { StickerBoardModal } from './components/StickerBoardModal';
import { TopBar } from './components/TopBar';
import { DetektifKebersihanGame } from './components/games/DetektifKebersihanGame';
import { RakitBentoGame } from './components/games/RakitBentoGame';
import { SortirKeranjangGame } from './components/games/SortirKeranjangGame';
import { TebakMakananGame } from './components/games/TebakMakananGame';
import { audioEngine } from './lib/audioEngine';
import {
  awardNextSticker,
  loadPlayerProgress,
  savePlayerProgress,
} from './lib/storage';
import type { MiniGameId, PlayerProgress } from './types';

const GAME_TITLES: Record<Exclude<MiniGameId, 'menu'>, string> = {
  rakit_bento: 'Rakit Bento Sehat',
  sortir_keranjang: 'Sortir Keranjang Belanja',
  detektif_kebersihan: 'Detektif Kebersihan',
  tebak_makanan: 'Tebak Makanan Rahasia',
};

export default function App() {
  const [hasStarted, setHasStarted] = useState(false);
  const [activeGame, setActiveGame] = useState<MiniGameId>('menu');
  const [sessionKey, setSessionKey] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [progress, setProgress] = useState<PlayerProgress>(() => loadPlayerProgress());
  const [showStickerBoard, setShowStickerBoard] = useState(false);
  const [celebrationStickerId, setCelebrationStickerId] = useState<string | null>(null);

  useEffect(() => {
    audioEngine.setMuted(progress.is_muted);
  }, [progress.is_muted]);

  useEffect(() => {
    return audioEngine.subscribeSpeaking(setIsSpeaking);
  }, []);

  const handleStartApp = () => {
    audioEngine.unlock();
    audioEngine.playPop();
    setHasStarted(true);
    audioEngine.speak(
      'Halo Koki Cilik! Aku Koki Moomoo. Yuk pilih permainan seru di layar!',
    );
  };

  const handleToggleMute = () => {
    const nextMuted = !progress.is_muted;
    const nextProgress = { ...progress, is_muted: nextMuted };
    setProgress(nextProgress);
    savePlayerProgress(nextProgress);
    audioEngine.setMuted(nextMuted);
    if (!nextMuted) {
      audioEngine.unlock();
      audioEngine.playPop();
      audioEngine.speak('Suara Koki Moomoo sudah aktif lagi!');
    }
  };

  const handleSelectGame = (gameId: Exclude<MiniGameId, 'menu'>) => {
    setCelebrationStickerId(null);
    setSessionKey((prev) => prev + 1);
    setActiveGame(gameId);
  };

  const handleGoHome = () => {
    audioEngine.stopSpeech();
    setCelebrationStickerId(null);
    setActiveGame('menu');
    audioEngine.speak('Mau main yang mana lagi? Pilih sesukamu ya!');
  };

  const handleCompleteMiniGame = () => {
    const { nextProgress, newStickerId } = awardNextSticker(progress);
    setProgress(nextProgress);
    setCelebrationStickerId(newStickerId);
    audioEngine.playFanfare();
    audioEngine.speak(
      'Yeay! Kamu hebat sekali! Kamu dapat satu stiker bintang koki baru!',
    );
  };

  const handlePlayAgain = () => {
    setCelebrationStickerId(null);
    setSessionKey((prev) => prev + 1);
  };

  if (!hasStarted) {
    return (
      <div className="min-h-screen bg-[#FFFBF0] flex items-center justify-center p-4">
        <div className="w-full max-w-lg bg-white border-4 border-amber-300 rounded-3xl p-7 sm:p-10 text-center flex flex-col items-center gap-5 shadow-md">
          <div className="animate-float">
            <KokiMoomooSvg expression="bersorak" size={160} />
          </div>

          <div className="space-y-2">
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-slate-900">
              Bento Ceria!
            </h1>
            <p className="text-lg sm:text-xl font-medium text-slate-700 leading-snug">
              Belajar makanan super dan hidup bersih sambil bermain bersama Koki Moomoo!
            </p>
          </div>

          <button
            type="button"
            onClick={handleStartApp}
            className="w-full min-h-[72px] px-8 py-4 rounded-3xl bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-display font-bold text-2xl flex items-center justify-center gap-3 transition-transform duration-150 shadow-sm focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-300 cursor-pointer"
          >
            <Play className="w-7 h-7 fill-white shrink-0" />
            <span className="whitespace-nowrap">Ayo Mulai Bermain!</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFBF0] text-slate-900">
      <TopBar
        activeGame={activeGame}
        stickersCount={progress.stickers_earned.length}
        isMuted={progress.is_muted}
        onGoHome={handleGoHome}
        onOpenStickers={() => setShowStickerBoard(true)}
        onToggleMute={handleToggleMute}
      />

      {activeGame === 'menu' ? (
        <MainMenu isSpeaking={isSpeaking} onSelectGame={handleSelectGame} />
      ) : null}

      {activeGame === 'rakit_bento' ? (
        <RakitBentoGame
          key={`bento-${sessionKey}`}
          isSpeaking={isSpeaking}
          onCompleteSession={handleCompleteMiniGame}
        />
      ) : null}

      {activeGame === 'sortir_keranjang' ? (
        <SortirKeranjangGame
          key={`sortir-${sessionKey}`}
          isSpeaking={isSpeaking}
          onCompleteSession={handleCompleteMiniGame}
        />
      ) : null}

      {activeGame === 'detektif_kebersihan' ? (
        <DetektifKebersihanGame
          key={`kebersihan-${sessionKey}`}
          isSpeaking={isSpeaking}
          onCompleteSession={handleCompleteMiniGame}
        />
      ) : null}

      {activeGame === 'tebak_makanan' ? (
        <TebakMakananGame
          key={`tebak-${sessionKey}`}
          isSpeaking={isSpeaking}
          onCompleteSession={handleCompleteMiniGame}
        />
      ) : null}

      {celebrationStickerId && activeGame !== 'menu' ? (
        <CelebrationModal
          gameTitle={GAME_TITLES[activeGame]}
          earnedStickerId={celebrationStickerId}
          onPlayAgain={handlePlayAgain}
          onBackToMenu={handleGoHome}
        />
      ) : null}

      {showStickerBoard ? (
        <StickerBoardModal
          earnedIds={progress.stickers_earned}
          onClose={() => setShowStickerBoard(false)}
        />
      ) : null}
    </div>
  );
}
