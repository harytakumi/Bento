/* Definisi tipe data utama untuk aplikasi Bento Ceria! */

export type FoodCategory =
  | 'karbohidrat'
  | 'protein'
  | 'sayur'
  | 'buah'
  | 'minuman_sehat'
  | 'camilan_sesekali';

export type HealthStatus = 'makanan_super' | 'camilan_sesekali';

export type MascotExpression = 'senang' | 'berpikir' | 'bersorak';

export type MiniGameId =
  | 'menu'
  | 'rakit_bento'
  | 'sortir_keranjang'
  | 'detektif_kebersihan'
  | 'tebak_makanan';

export type BentoSlotKey = 'karbohidrat' | 'protein' | 'sayur_buah' | 'minuman_camilan';

export interface FoodItem {
  id: string;
  name: string;
  emoji: string;
  category: FoodCategory;
  health_status: HealthStatus;
  color: string;
  kid_benefit: string;
  riddle_clues?: string;
  riddle_fact?: string;
}

export interface HygieneOption {
  emoji: string;
  badgeEmoji: string;
  label: string;
  feedback: string;
}

export interface HygienePair {
  id: string;
  scenario_voice: string;
  healthy_option: HygieneOption;
  unhealthy_option: HygieneOption;
}

export interface AnimalFriend {
  id: string;
  name: string;
  emoji: string;
  favoriteHint: string;
  bgClass: string;
  borderClass: string;
}

export interface BentoEvaluationResponse {
  status: 'bento_sempurna' | 'perlu_tukar_lembut';
  mascot_expression: MascotExpression;
  moomoo_voice_text: string;
  suggested_swap_id: string | null;
  source?: 'gemini' | 'offline';
}

export interface StickerItem {
  id: string;
  name: string;
  emoji: string;
  bgClass: string;
}

export interface PlayerProgress {
  stickers_earned: string[];
  total_sessions: number;
  is_muted: boolean;
}
