import type { AbilityName } from './ability-scores.model';
import type { Race } from './race.model';

export interface ClassLevel {
  classId: string;
  level: number;
}

export interface CharacterSheet {
  name: string;
  baseAbilities: Record<AbilityName, number>;
  race: Race | null;
  classLevels: ClassLevel[];
}
