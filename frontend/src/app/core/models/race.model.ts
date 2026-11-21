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

export type FlyManeuverability = 'clumsy' | 'poor' | 'average' | 'good' | 'perfect';

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

export interface Speeds {
  land: number;
  burrow?: number;
  climb?: number;
  fly?: number;
  flyManeuverability?: FlyManeuverability;
  swim?: number;
}

export interface Senses {
  darkvision?: number;
  lowLightVision?: boolean;
  blindsense?: number;
  blindsight?: number;
  scent?: boolean;
  other?: string;
}

export interface EnergyResistances {
  acid?: number;
  cold?: number;
  electricity?: number;
  fire?: number;
  sonic?: number;
}

interface RaceBase {
  name: string;
  size: SizeCategory;
  type?: string;
  subtype?: string;
  racialHitDice?: number;
  abilityModifiers: Partial<Record<AbilityName, number>>;
  racialTraits: string[];
  favoredClass: string;
  speeds?: Speeds;
  naturalArmor?: number;
  naturalAttacks?: string[];
  senses?: Senses;
  immunities?: string[];
  vulnerabilities?: string[];
  energyResistances?: EnergyResistances;
  damageReduction?: string;
  spellResistance?: number;
  fastHealing?: number;
}

export interface Race extends RaceBase {
  id: string;
  baseSpeed: number;
}

export interface CustomRace extends RaceBase {
  isCustom: true;
  speeds: Speeds;
  naturalArmor: number;
}

export type RaceSelection = Race | CustomRace;

export function isCustomRace(race: RaceSelection): race is CustomRace {
  return 'isCustom' in race && race.isCustom === true;
}

export function raceSpeeds(race: RaceSelection): Speeds {
  if (race.speeds) {
    return race.speeds;
  }
  return { land: (race as Race).baseSpeed };
}

export const RACES: readonly Race[] = [
  {
    id: 'human',
    name: 'Umano',
    size: 'Medium',
    type: 'Umanoide',
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
    type: 'Umanoide',
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
    type: 'Umanoide',
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
    type: 'Umanoide',
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
    type: 'Umanoide',
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
    type: 'Umanoide',
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
    type: 'Umanoide',
    baseSpeed: 30,
    abilityModifiers: { STR: 2, INT: -2, CHA: -2 },
    racialTraits: ['Scurovisione 18 metri', 'Tempra fisica da mezzorco'],
    favoredClass: 'Barbaro',
  },
  {
    id: 'aarakocra',
    name: 'Aarakocra',
    size: 'Medium',
    type: 'Umanoide mostruoso',
    baseSpeed: 20,
    speeds: { land: 20, fly: 90, flyManeuverability: 'average' },
    naturalArmor: 1,
    abilityModifiers: { DEX: 4, WIS: 2 },
    racialTraits: [
      'Volo 90m (manovrabilità media)',
      '2 attacchi naturali con artigli',
      '+2 a Artigianato (alchimia) e Conoscenze (natura)',
      '+2 a Ascoltare e Osservare',
    ],
    favoredClass: 'Ranger',
  },
  {
    id: 'aasimar',
    name: 'Aasimar',
    size: 'Medium',
    type: 'Esterno',
    subtype: 'Nativo',
    baseSpeed: 30,
    abilityModifiers: { WIS: 2, CHA: 2 },
    energyResistances: { acid: 5, cold: 5, electricity: 5 },
    racialTraits: [
      'Resistenze ad acido, freddo ed elettricità 5',
      '+2 a Ascoltare e Osservare',
      'Luce diurna (1/giorno)',
    ],
    favoredClass: 'Paladino',
  },
  {
    id: 'tiefling',
    name: 'Tiefling',
    size: 'Medium',
    type: 'Esterno',
    subtype: 'Nativo',
    baseSpeed: 30,
    abilityModifiers: { DEX: 2, INT: 2, CHA: -2 },
    senses: { darkvision: 18 },
    energyResistances: { cold: 5, electricity: 5, fire: 5 },
    racialTraits: [
      'Scurovisione 18 metri',
      'Resistenze a freddo, elettricità e fuoco 5',
      '+2 a Raggirare e Nascondersi',
      'Oscurità (1/giorno)',
    ],
    favoredClass: 'Ladro',
  },
  {
    id: 'dragonborn',
    name: 'Dragonborn',
    size: 'Medium',
    type: 'Umanoide',
    subtype: 'Draconico',
    baseSpeed: 30,
    abilityModifiers: { CON: 2, DEX: -2 },
    racialTraits: [
      'Sottotipo Draconico',
      '+2 a schivata contro i draghi',
      'Immunità a presenza spaventosa',
      'Arma a soffio, ali o sensi (a scelta)',
    ],
    favoredClass: 'Qualsiasi',
  },
  {
    id: 'goliath',
    name: 'Goliath',
    size: 'Medium',
    type: 'Umanoide mostruoso',
    baseSpeed: 30,
    abilityModifiers: { STR: 4, DEX: -2, CON: 2 },
    senses: { darkvision: 18 },
    racialTraits: [
      'Scurovisione 18 metri',
      'Costituzione Possente (considerato una taglia più grande)',
      '+2 a Percepire Intenzioni',
    ],
    favoredClass: 'Barbaro',
  },
  {
    id: 'catfolk',
    name: 'Catfolk',
    size: 'Medium',
    type: 'Umanoide',
    subtype: 'Catfolk',
    baseSpeed: 40,
    naturalArmor: 1,
    abilityModifiers: { DEX: 4, CHA: 2 },
    senses: { lowLightVision: true },
    racialTraits: [
      'Visione crepuscolare',
      'Armatura naturale +1',
      '+2 a Ascoltare e Muoversi Silenziosamente',
    ],
    favoredClass: 'Ranger',
  },
  {
    id: 'shifter',
    name: 'Shifter',
    size: 'Medium',
    type: 'Umanoide',
    subtype: 'Mutaforma',
    baseSpeed: 30,
    abilityModifiers: { DEX: 2, INT: -2, CHA: -2 },
    senses: { lowLightVision: true },
    racialTraits: [
      'Visione crepuscolare',
      'Mutaforma (shifting) 1/giorno',
      'Bonus razziale alle abilità in base al tratto',
    ],
    favoredClass: 'Ranger',
  },
  {
    id: 'changeling',
    name: 'Changeling',
    size: 'Medium',
    type: 'Umanoide',
    subtype: 'Mutaforma',
    baseSpeed: 30,
    abilityModifiers: {},
    racialTraits: [
      'Cambiare sembianze (minor change shape)',
      '+2 a Raggirare, Intimidire e Percepire Intenzioni',
      'Sottotipo Mutaforma',
    ],
    favoredClass: 'Ladro',
  },
  {
    id: 'orc',
    name: 'Orco',
    size: 'Medium',
    type: 'Umanoide',
    subtype: 'Orco',
    baseSpeed: 30,
    abilityModifiers: { STR: 4, INT: -2, WIS: -2, CHA: -2 },
    senses: { darkvision: 18 },
    racialTraits: ['Scurovisione 18 metri', 'Sensibilità alla luce'],
    favoredClass: 'Barbaro',
  },
  {
    id: 'goblin',
    name: 'Goblin',
    size: 'Small',
    type: 'Umanoide',
    subtype: 'Goblinide',
    baseSpeed: 30,
    abilityModifiers: { STR: -2, DEX: 2, CHA: -2 },
    senses: { darkvision: 18 },
    racialTraits: [
      'Scurovisione 18 metri',
      'Taglia Piccola',
      '+4 a Muoversi Silenziosamente e Cavalcare',
    ],
    favoredClass: 'Ladro',
  },
  {
    id: 'hobgoblin',
    name: 'Hobgoblin',
    size: 'Medium',
    type: 'Umanoide',
    subtype: 'Goblinide',
    baseSpeed: 30,
    abilityModifiers: { DEX: 2, CON: 2 },
    senses: { darkvision: 18 },
    racialTraits: ['Scurovisione 18 metri', '+4 a Muoversi Silenziosamente'],
    favoredClass: 'Guerriero',
  },
  {
    id: 'kobold',
    name: 'Coboldo',
    size: 'Small',
    type: 'Umanoide',
    subtype: 'Draconico, Rettiloide',
    baseSpeed: 30,
    naturalArmor: 1,
    abilityModifiers: { STR: -4, DEX: 2, CON: -2 },
    senses: { darkvision: 18 },
    racialTraits: [
      'Scurovisione 18 metri',
      'Armatura naturale +1',
      'Taglia Piccola',
      '+2 a Artigianato (trappole), Nascondersi, Cercare e Muoversi Silenziosamente',
    ],
    favoredClass: 'Stregone',
  },
  {
    id: 'lizardfolk',
    name: 'Lucertoloide',
    size: 'Medium',
    type: 'Umanoide',
    subtype: 'Rettiloide',
    baseSpeed: 30,
    naturalArmor: 5,
    abilityModifiers: { STR: 2, CON: 2, INT: -2 },
    racialTraits: [
      'Armatura naturale +5',
      '2 attacchi naturali (artigli e morso)',
      '+4 a Equilibrio, Saltare e Nuotare',
    ],
    favoredClass: 'Druido',
  },
  {
    id: 'gnoll',
    name: 'Gnoll',
    size: 'Medium',
    type: 'Umanoide',
    subtype: 'Gnoll',
    baseSpeed: 30,
    naturalArmor: 1,
    abilityModifiers: { STR: 4, CON: 2, INT: -2, CHA: -2 },
    senses: { darkvision: 18 },
    racialTraits: ['Scurovisione 18 metri', 'Armatura naturale +1', '+2 a Ascoltare e Osservare'],
    favoredClass: 'Ranger',
  },
  {
    id: 'bugbear',
    name: 'Bugbear',
    size: 'Medium',
    type: 'Umanoide',
    subtype: 'Goblinide',
    baseSpeed: 30,
    naturalArmor: 3,
    abilityModifiers: { STR: 4, DEX: 2, CON: 2, CHA: -2 },
    senses: { darkvision: 18 },
    racialTraits: [
      'Scurovisione 18 metri',
      'Armatura naturale +3',
      '+4 a Muoversi Silenziosamente',
    ],
    favoredClass: 'Ladro',
  },
  {
    id: 'half-giant',
    name: 'Mezzogigante',
    size: 'Medium',
    type: 'Gigante',
    baseSpeed: 30,
    abilityModifiers: { STR: 2, DEX: -2, CON: 2 },
    senses: { lowLightVision: true },
    racialTraits: [
      'Visione crepuscolare',
      'Potenza (considerato una taglia più grande per lanci e carico)',
      'Tratti da gigante',
    ],
    favoredClass: 'Guerriero Psichico',
  },
  {
    id: 'illumian',
    name: 'Illumian',
    size: 'Medium',
    type: 'Umanoide',
    subtype: 'Umano',
    baseSpeed: 30,
    abilityModifiers: {},
    racialTraits: [
      'Sigilli luminosi (bonus abilità o incantesimi)',
      '+2 a una abilità basata sui sigilli',
      'Talento bonus al 1° livello',
    ],
    favoredClass: 'Qualsiasi',
  },
  {
    id: 'raptoran',
    name: 'Raptoran',
    size: 'Medium',
    type: 'Umanoide',
    baseSpeed: 30,
    abilityModifiers: {},
    senses: { lowLightVision: true },
    racialTraits: [
      'Visione crepuscolare',
      'Volo limitato (a livelli crescenti)',
      '+2 a Osservare e +10 a Saltare',
    ],
    favoredClass: 'Chierico',
  },
  {
    id: 'spellscale',
    name: 'Spellscale',
    size: 'Medium',
    type: 'Umanoide',
    subtype: 'Draconico',
    baseSpeed: 30,
    abilityModifiers: { CON: -2, CHA: 2 },
    senses: { lowLightVision: true },
    racialTraits: ['Visione crepuscolare', 'Sottotipo Draconico', 'Affinità arcana'],
    favoredClass: 'Stregone',
  },
  {
    id: 'warforged',
    name: 'Warforged',
    size: 'Medium',
    type: 'Costrutto',
    subtype: 'Costrutto Vivente',
    baseSpeed: 30,
    abilityModifiers: { CON: 2, WIS: -2, CHA: -2 },
    racialTraits: [
      'Costrutto Vivente (immunità parziali)',
      'Armatura composita integrata',
      'Non necessita di mangiare, bere o dormire',
    ],
    favoredClass: 'Guerriero',
  },
  {
    id: 'elan',
    name: 'Elan',
    size: 'Medium',
    type: 'Aberrazione',
    baseSpeed: 30,
    abilityModifiers: { CHA: -2 },
    racialTraits: ['Resistenza psionica', 'Riparazione (1/giorno)', 'Tratti da aberrazione'],
    favoredClass: 'Psion',
  },
  {
    id: 'maenad',
    name: 'Maenad',
    size: 'Medium',
    type: 'Umanoide',
    baseSpeed: 30,
    abilityModifiers: {},
    racialTraits: ['Furia interiore (1/giorno)', 'Talento psionico naturale'],
    favoredClass: 'Wilder',
  },
  {
    id: 'xeph',
    name: 'Xeph',
    size: 'Medium',
    type: 'Umanoide',
    baseSpeed: 30,
    abilityModifiers: { STR: -2, DEX: 2 },
    senses: { darkvision: 18 },
    racialTraits: ['Scurovisione 18 metri', 'Scatto psionico (3/giorno)'],
    favoredClass: 'Soulknife',
  },
  {
    id: 'dromite',
    name: 'Dromite',
    size: 'Small',
    type: 'Umanoide mostruoso',
    baseSpeed: 20,
    naturalArmor: 3,
    abilityModifiers: { STR: -2, WIS: -2, CHA: 2 },
    racialTraits: ['Armatura naturale +3', 'Taglia Piccola', 'Energia psionica (1/giorno)'],
    favoredClass: 'Wilder',
  },
  {
    id: 'drow',
    name: 'Drow',
    size: 'Medium',
    type: 'Umanoide',
    subtype: 'Elfo',
    baseSpeed: 30,
    abilityModifiers: { DEX: 2, CON: -2, INT: 2, CHA: 2 },
    senses: { darkvision: 36 },
    racialTraits: [
      'Scurovisione 36 metri',
      'Immunità al sonno magico',
      'Sensibilità alla luce',
      '+2 a Ascoltare, Cercare e Osservare',
    ],
    favoredClass: 'Mago o Chierico',
  },
  {
    id: 'duergar',
    name: 'Duergar',
    size: 'Medium',
    type: 'Umanoide',
    subtype: 'Nano',
    baseSpeed: 20,
    abilityModifiers: { CON: 2, CHA: -4 },
    senses: { darkvision: 36 },
    racialTraits: [
      'Scurovisione 36 metri',
      'Immunità a paralisi e veleni',
      '+4 a Muoversi Silenziosamente',
      'Sensibilità alla luce',
    ],
    favoredClass: 'Guerriero',
  },
  {
    id: 'svirfneblin',
    name: 'Svirfneblin',
    size: 'Small',
    type: 'Umanoide',
    subtype: 'Gnomo',
    baseSpeed: 20,
    abilityModifiers: { STR: -2, DEX: 2, WIS: 2, CHA: -4 },
    senses: { darkvision: 36, lowLightVision: true },
    racialTraits: [
      'Scurovisione 36 metri',
      'Taglia Piccola',
      '+2 a Artigianato (alchimia), Nascondersi e Ascoltare',
      'Immunità a visioni illusorie',
    ],
    favoredClass: 'Ladro',
  },
  {
    id: 'genasi-air',
    name: 'Genasi dell\u2019Aria',
    size: 'Medium',
    type: 'Esterno',
    subtype: 'Nativo',
    baseSpeed: 30,
    abilityModifiers: { DEX: 2, INT: 2, WIS: -2, CHA: -2 },
    racialTraits: ['Levitazione (1/giorno)', 'Respiro senza aria'],
    favoredClass: 'Guerriero',
  },
  {
    id: 'genasi-earth',
    name: 'Genasi della Terra',
    size: 'Medium',
    type: 'Esterno',
    subtype: 'Nativo',
    baseSpeed: 30,
    abilityModifiers: { STR: 2, CON: 2, WIS: -2, CHA: -2 },
    racialTraits: ['Passo senza tracce (1/giorno)', 'Affinità con la terra'],
    favoredClass: 'Guerriero',
  },
  {
    id: 'genasi-fire',
    name: 'Genasi del Fuoco',
    size: 'Medium',
    type: 'Esterno',
    subtype: 'Nativo',
    baseSpeed: 30,
    abilityModifiers: { INT: 2, CHA: -2 },
    racialTraits: ['Resistenza al fuoco 5', 'Controllo delle fiamme (1/giorno)'],
    favoredClass: 'Guerriero',
  },
  {
    id: 'genasi-water',
    name: 'Genasi dell\u2019Acqua',
    size: 'Medium',
    type: 'Esterno',
    subtype: 'Nativo',
    baseSpeed: 30,
    speeds: { land: 30, swim: 30 },
    abilityModifiers: { CON: 2, WIS: -2 },
    racialTraits: ['Nuotare 30m', 'Respirare sott\u2019acqua', 'Creare acqua (1/giorno)'],
    favoredClass: 'Guerriero',
  },
  {
    id: 'thri-kreen',
    name: 'Thri-kreen',
    size: 'Medium',
    type: 'Umanoide mostruoso',
    baseSpeed: 40,
    naturalArmor: 3,
    abilityModifiers: { STR: 2, DEX: 4, INT: -2, WIS: 2, CHA: -4 },
    senses: { darkvision: 18 },
    racialTraits: [
      'Scurovisione 18 metri',
      'Armatura naturale +3',
      'Quattro braccia (combattere con armi multiple)',
      '+30 a Saltare',
    ],
    favoredClass: 'Ranger',
  },
  {
    id: 'vanara',
    name: 'Vanara',
    size: 'Medium',
    type: 'Umanoide',
    baseSpeed: 30,
    speeds: { land: 30, climb: 20 },
    abilityModifiers: {},
    racialTraits: ['Scalata 20m', '+8 a Scalare', '+4 a Equilibrio e Saltare'],
    favoredClass: 'Sciamano',
  },
  {
    id: 'nezumi',
    name: 'Nezumi',
    size: 'Medium',
    type: 'Umanoide',
    baseSpeed: 40,
    abilityModifiers: { CON: 2, CHA: -2 },
    senses: { lowLightVision: true },
    racialTraits: ['Visione crepuscolare', 'Immunità alla corruzione delle Shadowlands', '+2 a Nascondersi e Muoversi Silenziosamente'],
    favoredClass: 'Ladro',
  },
  {
    id: 'kender',
    name: 'Kender',
    size: 'Small',
    type: 'Umanoide',
    subtype: 'Kender',
    baseSpeed: 20,
    abilityModifiers: { STR: -2, DEX: 2, WIS: -2 },
    racialTraits: ['Immunità alla paura', 'Taglia Piccola', '+2 a Scassinare, Rapidità di Mano e Osservare'],
    favoredClass: 'Ladro',
  },
  {
    id: 'aventi',
    name: 'Aventi',
    size: 'Medium',
    type: 'Umanoide',
    subtype: 'Acquatico',
    baseSpeed: 30,
    speeds: { land: 30, swim: 30 },
    abilityModifiers: {},
    racialTraits: ['Nuotare 30m', '+8 a Nuotare', 'Respirare sott\u2019acqua'],
    favoredClass: 'Qualsiasi',
  },
  {
    id: 'asherati',
    name: 'Asherati',
    size: 'Medium',
    type: 'Umanoide',
    baseSpeed: 30,
    naturalArmor: 1,
    abilityModifiers: {},
    racialTraits: ['Armatura naturale +1', '+2 a Nascondersi e Muoversi Silenziosamente', 'Attraversare la sabbia'],
    favoredClass: 'Ladro',
  },
  {
    id: 'azurin',
    name: 'Azurin',
    size: 'Medium',
    type: 'Umanoide',
    subtype: 'Umano, Incarnum',
    baseSpeed: 30,
    abilityModifiers: {},
    racialTraits: ['Talento bonus al 1° livello', '1 punto essenza bonus'],
    favoredClass: 'Soulborn',
  },
  {
    id: 'darfellan',
    name: 'Darfellan',
    size: 'Medium',
    type: 'Umanoide',
    subtype: 'Acquatico',
    baseSpeed: 20,
    speeds: { land: 20, swim: 40 },
    abilityModifiers: { STR: 2, DEX: -2 },
    racialTraits: ['Nuotare 40m', '+8 a Nuotare', 'Morso naturale'],
    favoredClass: 'Barbaro',
  },
  {
    id: 'buomman',
    name: 'Buomman',
    size: 'Medium',
    type: 'Umanoide',
    subtype: 'Extraplanare',
    baseSpeed: 30,
    abilityModifiers: { WIS: 2, CHA: -2 },
    senses: { lowLightVision: true },
    racialTraits: ['Visione crepuscolare', '+2 a Ascoltare', 'Canto purificatore'],
    favoredClass: 'Monaco',
  },
  {
    id: 'chaond',
    name: 'Chaond',
    size: 'Medium',
    type: 'Esterno',
    subtype: 'Nativo',
    baseSpeed: 30,
    abilityModifiers: { DEX: 4, CON: 2, CHA: -2 },
    energyResistances: { acid: 5, cold: 5, sonic: 5 },
    racialTraits: ['Resistenze ad acido, freddo e sonico 5', '+2 a Fuggire e Acrobazia'],
    favoredClass: 'Qualsiasi (prima classe)',
  },
];
