export type BabProgression = 'good' | 'average' | 'poor';
export type SaveProgression = 'good' | 'poor';

export interface CharacterClass {
  id: string;
  name: string;
  hitDie: number;
  babProgression: BabProgression;
  fortProgression: SaveProgression;
  refProgression: SaveProgression;
  willProgression: SaveProgression;
  skillPointsPerLevel: number;
  classSkills: string[];
}

export const CLASSES: readonly CharacterClass[] = [
  {
    id: 'fighter',
    name: 'Guerriero',
    hitDie: 10,
    babProgression: 'good',
    fortProgression: 'good',
    refProgression: 'poor',
    willProgression: 'poor',
    skillPointsPerLevel: 2,
    classSkills: ['Scalare', 'Nuotare', 'Saltare', 'Cavalcare'],
  },
  {
    id: 'wizard',
    name: 'Mago',
    hitDie: 4,
    babProgression: 'poor',
    fortProgression: 'poor',
    refProgression: 'poor',
    willProgression: 'good',
    skillPointsPerLevel: 2,
    classSkills: ['Conoscenze (arcano)', 'Sapienza Magica', 'Concentrazione'],
  },
  {
    id: 'rogue',
    name: 'Ladro',
    hitDie: 6,
    babProgression: 'average',
    fortProgression: 'poor',
    refProgression: 'good',
    willProgression: 'poor',
    skillPointsPerLevel: 8,
    classSkills: ['Disattivare Congegni', 'Nascondersi', 'Percepire Intenzioni', 'Scassinare'],
  },
  {
    id: 'cleric',
    name: 'Chierico',
    hitDie: 8,
    babProgression: 'average',
    fortProgression: 'good',
    refProgression: 'poor',
    willProgression: 'good',
    skillPointsPerLevel: 2,
    classSkills: ['Conoscenze (religioni)', 'Guarire', 'Concentrazione'],
  },
  {
    id: 'barbarian',
    name: 'Barbaro',
    hitDie: 12,
    babProgression: 'good',
    fortProgression: 'good',
    refProgression: 'poor',
    willProgression: 'poor',
    skillPointsPerLevel: 4,
    classSkills: ['Ascoltare', 'Sopravvivenza', 'Intimidire', 'Scalare'],
  },
  {
    id: 'paladin',
    name: 'Paladino',
    hitDie: 10,
    babProgression: 'good',
    fortProgression: 'good',
    refProgression: 'poor',
    willProgression: 'poor',
    skillPointsPerLevel: 2,
    classSkills: ['Cavalcare', 'Guarire', 'Diplomazia'],
  },
  {
    id: 'ranger',
    name: 'Ranger',
    hitDie: 8,
    babProgression: 'good',
    fortProgression: 'good',
    refProgression: 'good',
    willProgression: 'poor',
    skillPointsPerLevel: 6,
    classSkills: ['Sopravvivenza', 'Nascondersi', 'Ascoltare', 'Cercare'],
  },
  {
    id: 'bard',
    name: 'Bardo',
    hitDie: 6,
    babProgression: 'average',
    fortProgression: 'poor',
    refProgression: 'good',
    willProgression: 'good',
    skillPointsPerLevel: 6,
    classSkills: ['Diplomazia', 'Intrattenere', 'Conoscenze (varie)'],
  },
  {
    id: 'druid',
    name: 'Druido',
    hitDie: 8,
    babProgression: 'average',
    fortProgression: 'good',
    refProgression: 'poor',
    willProgression: 'good',
    skillPointsPerLevel: 4,
    classSkills: ['Sopravvivenza', 'Conoscenze (natura)', 'Guarire'],
  },
  {
    id: 'monk',
    name: 'Monaco',
    hitDie: 8,
    babProgression: 'average',
    fortProgression: 'good',
    refProgression: 'good',
    willProgression: 'good',
    skillPointsPerLevel: 4,
    classSkills: ['Equilibrio', 'Saltare', 'Muoversi Silenziosamente'],
  },
  {
    id: 'sorcerer',
    name: 'Stregone',
    hitDie: 4,
    babProgression: 'poor',
    fortProgression: 'poor',
    refProgression: 'poor',
    willProgression: 'good',
    skillPointsPerLevel: 2,
    classSkills: ['Conoscenze (arcano)', 'Sapienza Magica', 'Concentrazione'],
  },
];

export function calculateBabForLevel(level: number, progression: BabProgression): number {
  switch (progression) {
    case 'good':
      return level;
    case 'average':
      return Math.floor((level * 3) / 4);
    case 'poor':
      return Math.floor(level / 2);
  }
}

export function calculateBaseSave(level: number, progression: SaveProgression): number {
  return progression === 'good' ? 2 + Math.floor(level / 2) : Math.floor(level / 3);
}

/** Esperienza cumulativa D&D 3.5 necessaria per raggiungere il livello indicato. */
export function calculateExperienceForLevel(level: number): number {
  return ((level * (level - 1)) / 2) * 1000;
}
