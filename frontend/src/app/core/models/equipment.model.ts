export type WeaponCategory = 'simple' | 'martial' | 'exotic';

export interface Weapon {
  id: string;
  name: string;
  category: WeaponCategory;
  damageSmall: string;
  damageMedium: string;
  critical: string;
  rangeIncrement: number;
  weight: number;
  damageType: string;
}

export type ArmorType = 'light' | 'medium' | 'heavy' | 'shield';

export interface Armor {
  id: string;
  name: string;
  type: ArmorType;
  armorBonus: number;
  maxDexBonus: number | null;
  armorCheckPenalty: number;
  arcaneSpellFailure: number;
  weight: number;
}

export interface CarryingCapacity {
  light: number;
  medium: number;
  heavy: number;
}

export const WEAPON_CATEGORY_LABELS: Readonly<Record<WeaponCategory, string>> = {
  simple: 'Semplici',
  martial: 'Marziali',
  exotic: 'Esotiche',
};

export const ARMOR_TYPE_LABELS: Readonly<Record<ArmorType, string>> = {
  light: 'Leggera',
  medium: 'Media',
  heavy: 'Pesante',
  shield: 'Scudo',
};

export const WEAPONS: readonly Weapon[] = [
  { id: 'dagger', name: 'Pugnale', category: 'simple', damageSmall: '1d3', damageMedium: '1d4', critical: '19-20/x2', rangeIncrement: 10, weight: 1, damageType: 'P/S' },
  { id: 'club', name: 'Randello', category: 'simple', damageSmall: '1d4', damageMedium: '1d6', critical: 'x2', rangeIncrement: 10, weight: 3, damageType: 'C' },
  { id: 'light-mace', name: 'Mazza leggera', category: 'simple', damageSmall: '1d4', damageMedium: '1d6', critical: 'x2', rangeIncrement: 0, weight: 4, damageType: 'C' },
  { id: 'heavy-mace', name: 'Mazza pesante', category: 'simple', damageSmall: '1d6', damageMedium: '1d8', critical: 'x2', rangeIncrement: 0, weight: 8, damageType: 'C' },
  { id: 'quarterstaff', name: 'Bastone ferrato', category: 'simple', damageSmall: '1d4/1d4', damageMedium: '1d6/1d6', critical: 'x2', rangeIncrement: 0, weight: 4, damageType: 'C' },
  { id: 'shortspear', name: 'Lancia corta', category: 'simple', damageSmall: '1d4', damageMedium: '1d6', critical: 'x2', rangeIncrement: 20, weight: 3, damageType: 'P' },
  { id: 'spear', name: 'Lancia', category: 'simple', damageSmall: '1d6', damageMedium: '1d8', critical: 'x3', rangeIncrement: 20, weight: 6, damageType: 'P' },
  { id: 'javelin', name: 'Giavellotto', category: 'simple', damageSmall: '1d4', damageMedium: '1d6', critical: 'x2', rangeIncrement: 30, weight: 2, damageType: 'P' },
  { id: 'sling', name: 'Fionda', category: 'simple', damageSmall: '1d3', damageMedium: '1d4', critical: 'x2', rangeIncrement: 50, weight: 0, damageType: 'C' },
  { id: 'light-crossbow', name: 'Balestra leggera', category: 'simple', damageSmall: '1d6', damageMedium: '1d8', critical: '19-20/x2', rangeIncrement: 80, weight: 4, damageType: 'P' },
  { id: 'shortsword', name: 'Spada corta', category: 'martial', damageSmall: '1d4', damageMedium: '1d6', critical: '19-20/x2', rangeIncrement: 0, weight: 2, damageType: 'P' },
  { id: 'longsword', name: 'Spada lunga', category: 'martial', damageSmall: '1d6', damageMedium: '1d8', critical: '19-20/x2', rangeIncrement: 0, weight: 4, damageType: 'T' },
  { id: 'greatsword', name: 'Spadone', category: 'martial', damageSmall: '1d10', damageMedium: '2d6', critical: '19-20/x2', rangeIncrement: 0, weight: 8, damageType: 'T' },
  { id: 'rapier', name: 'Stocco', category: 'martial', damageSmall: '1d4', damageMedium: '1d6', critical: '18-20/x2', rangeIncrement: 0, weight: 2, damageType: 'P' },
  { id: 'scimitar', name: 'Scimitarra', category: 'martial', damageSmall: '1d4', damageMedium: '1d6', critical: '18-20/x2', rangeIncrement: 0, weight: 4, damageType: 'T' },
  { id: 'battleaxe', name: 'Ascia da battaglia', category: 'martial', damageSmall: '1d6', damageMedium: '1d8', critical: 'x3', rangeIncrement: 0, weight: 6, damageType: 'T' },
  { id: 'greataxe', name: 'Ascia bipenne', category: 'martial', damageSmall: '1d10', damageMedium: '1d12', critical: 'x3', rangeIncrement: 0, weight: 12, damageType: 'T' },
  { id: 'warhammer', name: 'Martello da guerra', category: 'martial', damageSmall: '1d6', damageMedium: '1d8', critical: 'x3', rangeIncrement: 0, weight: 5, damageType: 'C' },
  { id: 'shortbow', name: 'Arco corto', category: 'martial', damageSmall: '1d4', damageMedium: '1d6', critical: 'x3', rangeIncrement: 60, weight: 2, damageType: 'P' },
  { id: 'longbow', name: 'Arco lungo', category: 'martial', damageSmall: '1d6', damageMedium: '1d8', critical: 'x3', rangeIncrement: 100, weight: 3, damageType: 'P' },
  { id: 'bastard-sword', name: 'Spada bastarda', category: 'exotic', damageSmall: '1d8', damageMedium: '1d10', critical: '19-20/x2', rangeIncrement: 0, weight: 6, damageType: 'T' },
  { id: 'dwarven-waraxe', name: 'Ascia da guerra nanica', category: 'exotic', damageSmall: '1d8', damageMedium: '1d10', critical: 'x3', rangeIncrement: 0, weight: 8, damageType: 'T' },
];

export const ARMOR: readonly Armor[] = [
  { id: 'padded', name: 'Imbottita', type: 'light', armorBonus: 1, maxDexBonus: 8, armorCheckPenalty: 0, arcaneSpellFailure: 5, weight: 10 },
  { id: 'leather', name: 'Cuoio', type: 'light', armorBonus: 2, maxDexBonus: 6, armorCheckPenalty: 0, arcaneSpellFailure: 10, weight: 15 },
  { id: 'studded-leather', name: 'Cuoio borchiato', type: 'light', armorBonus: 3, maxDexBonus: 5, armorCheckPenalty: -1, arcaneSpellFailure: 15, weight: 20 },
  { id: 'chain-shirt', name: 'Camicia di maglia', type: 'light', armorBonus: 4, maxDexBonus: 4, armorCheckPenalty: -2, arcaneSpellFailure: 20, weight: 25 },
  { id: 'hide', name: 'Pelli', type: 'medium', armorBonus: 3, maxDexBonus: 4, armorCheckPenalty: -3, arcaneSpellFailure: 20, weight: 25 },
  { id: 'scale-mail', name: 'Scaglie', type: 'medium', armorBonus: 4, maxDexBonus: 3, armorCheckPenalty: -4, arcaneSpellFailure: 25, weight: 30 },
  { id: 'chainmail', name: 'Cotta di maglia', type: 'medium', armorBonus: 5, maxDexBonus: 2, armorCheckPenalty: -5, arcaneSpellFailure: 30, weight: 40 },
  { id: 'breastplate', name: 'Corazza', type: 'medium', armorBonus: 5, maxDexBonus: 3, armorCheckPenalty: -4, arcaneSpellFailure: 25, weight: 30 },
  { id: 'splint-mail', name: 'Armatura a stecche', type: 'heavy', armorBonus: 6, maxDexBonus: 0, armorCheckPenalty: -7, arcaneSpellFailure: 40, weight: 45 },
  { id: 'banded-mail', name: 'Armatura a fasce', type: 'heavy', armorBonus: 6, maxDexBonus: 1, armorCheckPenalty: -6, arcaneSpellFailure: 35, weight: 35 },
  { id: 'half-plate', name: 'Mezza armatura a piastre', type: 'heavy', armorBonus: 7, maxDexBonus: 0, armorCheckPenalty: -7, arcaneSpellFailure: 40, weight: 50 },
  { id: 'full-plate', name: 'Armatura a piastre completa', type: 'heavy', armorBonus: 8, maxDexBonus: 1, armorCheckPenalty: -6, arcaneSpellFailure: 35, weight: 50 },
  { id: 'buckler', name: 'Brocco', type: 'shield', armorBonus: 1, maxDexBonus: null, armorCheckPenalty: -1, arcaneSpellFailure: 5, weight: 5 },
  { id: 'light-shield', name: 'Scudo leggero (acciaio)', type: 'shield', armorBonus: 1, maxDexBonus: null, armorCheckPenalty: -1, arcaneSpellFailure: 5, weight: 6 },
  { id: 'heavy-shield', name: 'Scudo pesante (acciaio)', type: 'shield', armorBonus: 2, maxDexBonus: null, armorCheckPenalty: -2, arcaneSpellFailure: 15, weight: 15 },
  { id: 'tower-shield', name: 'Scudo torre', type: 'shield', armorBonus: 4, maxDexBonus: 2, armorCheckPenalty: -10, arcaneSpellFailure: 50, weight: 45 },
];

const CARRYING_CAPACITY_TABLE: Readonly<Record<number, CarryingCapacity>> = {
  1: { light: 3, medium: 6, heavy: 10 },
  2: { light: 6, medium: 13, heavy: 20 },
  3: { light: 10, medium: 20, heavy: 30 },
  4: { light: 13, medium: 26, heavy: 40 },
  5: { light: 16, medium: 33, heavy: 50 },
  6: { light: 20, medium: 40, heavy: 60 },
  7: { light: 23, medium: 46, heavy: 70 },
  8: { light: 26, medium: 53, heavy: 80 },
  9: { light: 30, medium: 60, heavy: 90 },
  10: { light: 33, medium: 66, heavy: 100 },
  11: { light: 38, medium: 76, heavy: 115 },
  12: { light: 43, medium: 86, heavy: 130 },
  13: { light: 50, medium: 100, heavy: 150 },
  14: { light: 58, medium: 116, heavy: 175 },
  15: { light: 66, medium: 133, heavy: 200 },
  16: { light: 76, medium: 153, heavy: 230 },
  17: { light: 86, medium: 173, heavy: 260 },
  18: { light: 100, medium: 200, heavy: 300 },
  19: { light: 116, medium: 233, heavy: 350 },
  20: { light: 133, medium: 266, heavy: 400 },
  21: { light: 153, medium: 306, heavy: 460 },
  22: { light: 173, medium: 346, heavy: 520 },
  23: { light: 200, medium: 400, heavy: 600 },
  24: { light: 233, medium: 466, heavy: 700 },
  25: { light: 266, medium: 533, heavy: 800 },
  26: { light: 306, medium: 613, heavy: 920 },
  27: { light: 346, medium: 693, heavy: 1040 },
  28: { light: 400, medium: 800, heavy: 1200 },
  29: { light: 466, medium: 933, heavy: 1400 },
};

/** Capacità di carico D&D 3.5 in base alla Forza (in libbre). */
export function carryingCapacityForStrength(strength: number): CarryingCapacity {
  const score = Math.max(1, Math.floor(strength));
  if (score <= 29) {
    return CARRYING_CAPACITY_TABLE[score];
  }

  const base = 20 + ((score - 20) % 10);
  const multiplier = 4 ** Math.floor((score - 20) / 10);
  const row = CARRYING_CAPACITY_TABLE[base];

  return {
    light: row.light * multiplier,
    medium: row.medium * multiplier,
    heavy: row.heavy * multiplier,
  };
}
