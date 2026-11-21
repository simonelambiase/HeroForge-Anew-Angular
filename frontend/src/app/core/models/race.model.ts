import type { AbilityName } from './ability-scores.model';

export type SizeCategory =
  | 'Fine'
  | 'Diminutive'
  | 'Tiny'
  | 'Small'
  | 'Medium'
  | 'Large'
  | 'Huge'
  | 'Gargantuan'
  | 'Colossal';

export const SIZE_AC_MODIFIERS: Readonly<Record<SizeCategory, number>> = {
  Fine: 8,
  Diminutive: 4,
  Tiny: 2,
  Small: 1,
  Medium: 0,
  Large: -1,
  Huge: -2,
  Gargantuan: -4,
  Colossal: -8,
};

export interface Race {
  id: string;
  name: string;
  size: SizeCategory;
  baseSpeed: number;
  abilityModifiers: Partial<Record<AbilityName, number>>;
  racialTraits: string[];
  favoredClass: string;
}

export const RACES: readonly Race[] = [
  {
    id: 'human',
    name: 'Umano',
    size: 'Medium',
    baseSpeed: 30,
    abilityModifiers: {},
    racialTraits: [
      'Talento bonus al 1° livello',
      '4 punti abilità bonus al 1° livello',
      '+1 punto abilità per livello',
    ],
    favoredClass: 'Qualsiasi',
  },
  {
    id: 'elf',
    name: 'Elfo',
    size: 'Medium',
    baseSpeed: 30,
    abilityModifiers: { DEX: 2, CON: -2 },
    racialTraits: [
      'Immunità al sonno magico',
      '+2 a Percezione, Ascoltare e Cercare',
      'Visione crepuscolare',
      'Competenza in arco lungo e spada lunga',
    ],
    favoredClass: 'Mago',
  },
  {
    id: 'dwarf',
    name: 'Nano',
    size: 'Medium',
    baseSpeed: 20,
    abilityModifiers: { CON: 2, CHA: -2 },
    racialTraits: [
      'Scurovisione 18 metri',
      'Movimento 6 metri anche in armatura',
      '+2 ai tiri salvezza contro veleni',
      'Bonus contro giganti e orchi',
    ],
    favoredClass: 'Guerriero',
  },
  {
    id: 'halfling',
    name: 'Halfling',
    size: 'Small',
    baseSpeed: 20,
    abilityModifiers: { DEX: 2, STR: -2 },
    racialTraits: [
      'Taglia Piccola',
      '+2 a Nascondersi e Muoversi Silenziosamente',
      '+1 ai tiri salvezza',
      '+2 a Saltare, Scalare e Raccogliere Informazioni',
    ],
    favoredClass: 'Ladro',
  },
  {
    id: 'gnome',
    name: 'Gnomo',
    size: 'Small',
    baseSpeed: 20,
    abilityModifiers: { CON: 2, STR: -2 },
    racialTraits: [
      'Taglia Piccola',
      'Scurovisione 18 metri',
      '+2 a Nascondersi',
      'Trucchetti da illusione (1/giorno)',
    ],
    favoredClass: 'Bardo',
  },
  {
    id: 'half-elf',
    name: 'Mezzelfo',
    size: 'Medium',
    baseSpeed: 30,
    abilityModifiers: {},
    racialTraits: [
      'Immunità al sonno magico',
      'Visione crepuscolare',
      '+1 a Percezione, Ascoltare e Cercare',
      '+2 a Diplomazia e Raccogliere Informazioni',
    ],
    favoredClass: 'Qualsiasi',
  },
  {
    id: 'half-orc',
    name: 'Mezzorco',
    size: 'Medium',
    baseSpeed: 30,
    abilityModifiers: { STR: 2, INT: -2, CHA: -2 },
    racialTraits: ['Scurovisione 18 metri', 'Tempra fisica da mezzorco'],
    favoredClass: 'Barbaro',
  },
];
