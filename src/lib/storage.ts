/* Penyimpanan progres stiker anak dan pengaturan suara di localStorage */
import { STICKER_CATALOG } from '../data/foods';
import type { PlayerProgress } from '../types';

const STORAGE_KEY = 'bento_ceria_progress_v1';

const DEFAULT_PROGRESS: PlayerProgress = {
  stickers_earned: [],
  total_sessions: 0,
  is_muted: false,
};

export function loadPlayerProgress(): PlayerProgress {
  if (typeof window === 'undefined') return DEFAULT_PROGRESS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROGRESS;
    const parsed = JSON.parse(raw) as Partial<PlayerProgress>;
    return {
      stickers_earned: Array.isArray(parsed.stickers_earned)
        ? parsed.stickers_earned.filter((id): id is string => typeof id === 'string')
        : [],
      total_sessions: typeof parsed.total_sessions === 'number' ? parsed.total_sessions : 0,
      is_muted: Boolean(parsed.is_muted),
    };
  } catch {
    return DEFAULT_PROGRESS;
  }
}

export function savePlayerProgress(progress: PlayerProgress): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    /* Abaikan jika storage penuh atau diblokir */
  }
}

export function awardNextSticker(current: PlayerProgress): {
  nextProgress: PlayerProgress;
  newStickerId: string;
} {
  const unowned = STICKER_CATALOG.filter(
    (sticker) => !current.stickers_earned.includes(sticker.id),
  );
  const chosen =
    unowned.length > 0
      ? unowned[0]
      : STICKER_CATALOG[current.total_sessions % STICKER_CATALOG.length];

  const nextStickers = current.stickers_earned.includes(chosen.id)
    ? current.stickers_earned
    : [...current.stickers_earned, chosen.id];

  const nextProgress: PlayerProgress = {
    ...current,
    stickers_earned: nextStickers,
    total_sessions: current.total_sessions + 1,
  };

  savePlayerProgress(nextProgress);
  return { nextProgress, newStickerId: chosen.id };
}
