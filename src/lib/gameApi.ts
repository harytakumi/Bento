/* Klien API Gemini server-side beserta evaluator & bank teka-teki lokal untuk mode Offline Fallback */
import { FOOD_ITEMS } from '../data/foods';
import type { BentoEvaluationResponse, FoodItem } from '../types';

export function evaluateBentoLocally(
  animalName: string,
  selectedItems: FoodItem[],
): BentoEvaluationResponse {
  const superCount = selectedItems.filter(
    (item) => item.health_status === 'makanan_super',
  ).length;
  const hasProduce = selectedItems.some(
    (item) => item.category === 'sayur' || item.category === 'buah',
  );

  if (superCount >= 3 && hasProduce) {
    return {
      status: 'bento_sempurna',
      mascot_expression: 'bersorak',
      moomoo_voice_text: `Hore! Bekal untuk ${animalName} lengkap bergizi dan penuh warna. Kamu koki cilik yang hebat!`,
      suggested_swap_id: null,
      source: 'offline',
    };
  }

  const healthyProduces = FOOD_ITEMS.filter(
    (f) => f.category === 'buah' || f.category === 'sayur',
  );
  const healthyDrinks = FOOD_ITEMS.filter((f) => f.category === 'minuman_sehat');
  const firstSweet = selectedItems.find((i) => i.health_status === 'camilan_sesekali');

  let suggested: FoodItem =
    healthyProduces[Math.floor(Math.random() * healthyProduces.length)] ?? FOOD_ITEMS[0];

  if (!hasProduce) {
    suggested = healthyProduces.find((p) => p.id === 'pisang') ?? healthyProduces[0];
  } else if (firstSweet?.category === 'camilan_sesekali' && (firstSweet.id === 'soda' || firstSweet.id === 'boba_manis')) {
    suggested = healthyDrinks[0] ?? suggested;
  }

  return {
    status: 'perlu_tukar_lembut',
    mascot_expression: 'berpikir',
    moomoo_voice_text: `Wah, kamu sudah rajin mengisi bekal ${animalName}! Yuk tukar satu camilan dengan ${suggested.name} biar makin kuat.`,
    suggested_swap_id: suggested.id,
    source: 'offline',
  };
}

export async function evaluateBento(
  animalName: string,
  selectedItems: FoodItem[],
): Promise<BentoEvaluationResponse> {
  const healthyCandidates = FOOD_ITEMS.filter(
    (f) => f.health_status === 'makanan_super',
  ).map((f) => ({ id: f.id, name: f.name }));

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8500);

  try {
    const response = await fetch('/api/evaluate-bento', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        animalName,
        selectedItems: selectedItems.map((i) => ({
          id: i.id,
          name: i.name,
          category: i.category,
          health_status: i.health_status,
        })),
        healthyCandidates,
      }),
    });

    if (!response.ok) {
      return evaluateBentoLocally(animalName, selectedItems);
    }

    const data = (await response.json()) as BentoEvaluationResponse;
    if (!data || !data.moomoo_voice_text) {
      return evaluateBentoLocally(animalName, selectedItems);
    }
    return data;
  } catch {
    return evaluateBentoLocally(animalName, selectedItems);
  } finally {
    clearTimeout(timeoutId);
  }
}

export interface RiddleResult {
  voice_text: string;
  fun_fact: string;
  source: 'gemini' | 'offline';
}

export function getRiddleLocally(targetItem: FoodItem): RiddleResult {
  return {
    voice_text:
      targetItem.riddle_clues ||
      `Aku makanan berwarna ${targetItem.color}. ${targetItem.kid_benefit} Ayo tebak aku siapa!`,
    fun_fact: targetItem.riddle_fact || targetItem.kid_benefit,
    source: 'offline',
  };
}

export async function generateRiddleOrStory(
  gameType: 'tebak_makanan' | 'sortir' | 'kebersihan',
  targetItem: FoodItem,
): Promise<RiddleResult> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8500);

  try {
    const response = await fetch('/api/generate-riddle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        gameType,
        targetItem: {
          id: targetItem.id,
          name: targetItem.name,
          category: targetItem.category,
          color: targetItem.color,
          kid_benefit: targetItem.kid_benefit,
        },
      }),
    });

    if (!response.ok) {
      return getRiddleLocally(targetItem);
    }

    const data = (await response.json()) as { voice_text?: string; fun_fact?: string };
    if (!data.voice_text) {
      return getRiddleLocally(targetItem);
    }

    return {
      voice_text: data.voice_text,
      fun_fact: data.fun_fact || targetItem.kid_benefit,
      source: 'gemini',
    };
  } catch {
    return getRiddleLocally(targetItem);
  } finally {
    clearTimeout(timeoutId);
  }
}
