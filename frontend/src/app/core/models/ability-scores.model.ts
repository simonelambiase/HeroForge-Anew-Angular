export type AbilityName = 'STR' | 'DEX' | 'CON' | 'INT' | 'WIS' | 'CHA';

export const ABILITY_ORDER: readonly AbilityName[] = [
  'STR',
  'DEX',
  'CON',
  'INT',
  'WIS',
  'CHA',
];

export interface AbilityScore {
  name: AbilityName;
  base: number;
  racialBonus: number;
  total: number;
}

export interface AbilityModifier {
  name: AbilityName;
  score: number;
  modifier: number;
}

export const POINT_BUY_MIN = 8;
export const POINT_BUY_MAX = 18;
export const POINT_BUY_PRESETS: readonly number[] = [15, 22, 25, 28, 32];

/** Costo Point Buy standard D&D 3.5 (punteggio da 8 a 18). */
export const POINT_BUY_COSTS: Readonly<Record<number, number>> = {
  8: 0,
  9: 1,
  10: 2,
  11: 3,
  12: 4,
  13: 5,
  14: 6,
  15: 8,
  16: 10,
  17: 13,
  18: 16,
};

export interface PointBuyState {
  budget: number;
  spent: number;
  remaining: number;
}

export const DEFAULT_ABILITIES: Readonly<Record<AbilityName, number>> = {
  STR: 10,
  DEX: 10,
  CON: 10,
  INT: 10,
  WIS: 10,
  CHA: 10,
};

/** Modificatore di caratteristica D&D 3.5: Math.floor((score - 10) / 2). */
export function calculateAbilityModifier(score: number): number {
  return Math.floor((score - 10) / 2);
}

export function calculatePointBuyCost(score: number): number {
  return POINT_BUY_COSTS[score] ?? 0;
}

export function calculatePointBuySpent(scores: Record<AbilityName, number>): number {
  return ABILITY_ORDER.reduce(
    (sum, name) => sum + calculatePointBuyCost(scores[name]),
    0,
  );
}

export function formatModifier(modifier: number): string {
  return modifier >= 0 ? `+${modifier}` : `${modifier}`;
}
