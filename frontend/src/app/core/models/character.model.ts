import type { AbilityName } from './ability-scores.model';
import type { Race } from './race.model';
import type { Armor, Weapon } from './equipment.model';

export interface ClassLevel {
  classId: string;
  level: number;
}

export interface CharacterSheet {
  name: string;
  baseAbilities: Record<AbilityName, number>;
  race: Race | null;
  classLevels: ClassLevel[];
  skillRanks: Record<string, number>;
  selectedFeats: string[];
  equippedWeapons: Weapon[];
  equippedArmor: Armor | null;
}
