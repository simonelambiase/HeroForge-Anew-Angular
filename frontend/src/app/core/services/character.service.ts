import { computed, Injectable, signal } from '@angular/core';

import {
  ABILITY_ORDER,
  calculateAbilityModifier,
  DEFAULT_ABILITIES,
  type AbilityModifier,
  type AbilityName,
  type AbilityScore,
} from '../models/ability-scores.model';
import { SIZE_AC_MODIFIERS, type Race } from '../models/race.model';
import {
  calculateBabForLevel,
  calculateBaseSave,
  CLASSES,
  type CharacterClass,
} from '../models/class.model';
import type { ClassLevel } from '../models/character.model';

export interface SavingThrows {
  fortitude: number;
  reflex: number;
  will: number;
}

@Injectable({ providedIn: 'root' })
export class CharacterService {
  private readonly _characterName = signal('');
  private readonly _abilities = signal<Record<AbilityName, number>>({ ...DEFAULT_ABILITIES });
  private readonly _selectedRace = signal<Race | null>(null);
  private readonly _classLevels = signal<ClassLevel[]>([]);

  readonly characterName = this._characterName.asReadonly();
  readonly abilities = this._abilities.asReadonly();
  readonly selectedRace = this._selectedRace.asReadonly();
  readonly classLevels = this._classLevels.asReadonly();

  readonly finalAbilities = computed<Record<AbilityName, AbilityScore>>(() => {
    const base = this._abilities();
    const race = this._selectedRace();
    const result = {} as Record<AbilityName, AbilityScore>;

    for (const name of ABILITY_ORDER) {
      const racialBonus = race?.abilityModifiers[name] ?? 0;
      result[name] = {
        name,
        base: base[name],
        racialBonus,
        total: base[name] + racialBonus,
      };
    }

    return result;
  });

  readonly abilityModifiers = computed<Record<AbilityName, AbilityModifier>>(() => {
    const final = this.finalAbilities();
    const result = {} as Record<AbilityName, AbilityModifier>;

    for (const name of ABILITY_ORDER) {
      const score = final[name].total;
      result[name] = { name, score, modifier: calculateAbilityModifier(score) };
    }

    return result;
  });

  readonly totalLevel = computed(() =>
    this._classLevels().reduce((sum, classLevel) => sum + classLevel.level, 0),
  );

  readonly baseAttackBonus = computed(() => this.calculateBab(this._classLevels()));

  readonly baseSavingThrows = computed<SavingThrows>(() => {
    let fortitude = 0;
    let reflex = 0;
    let will = 0;

    for (const classLevel of this._classLevels()) {
      const characterClass = this.findClass(classLevel.classId);
      if (!characterClass) {
        continue;
      }

      fortitude += calculateBaseSave(classLevel.level, characterClass.fortProgression);
      reflex += calculateBaseSave(classLevel.level, characterClass.refProgression);
      will += calculateBaseSave(classLevel.level, characterClass.willProgression);
    }

    return { fortitude, reflex, will };
  });

  readonly savingThrows = computed<SavingThrows>(() => {
    const base = this.baseSavingThrows();
    const modifiers = this.abilityModifiers();

    return {
      fortitude: base.fortitude + modifiers.CON.modifier,
      reflex: base.reflex + modifiers.DEX.modifier,
      will: base.will + modifiers.WIS.modifier,
    };
  });

  readonly armorClass = computed(() => {
    const dexterityModifier = this.abilityModifiers().DEX.modifier;
    const size = this._selectedRace()?.size ?? 'Medium';
    return 10 + dexterityModifier + SIZE_AC_MODIFIERS[size];
  });

  readonly totalHitPoints = computed(() => {
    const constitutionModifier = this.abilityModifiers().CON.modifier;
    const classLevels = this._classLevels();

    let hitPoints = constitutionModifier * this.totalLevel();
    let isFirstLevel = true;

    for (const classLevel of classLevels) {
      const characterClass = this.findClass(classLevel.classId);
      if (!characterClass) {
        continue;
      }

      for (let i = 0; i < classLevel.level; i++) {
        hitPoints += isFirstLevel ? characterClass.hitDie : characterClass.hitDie / 2;
        isFirstLevel = false;
      }
    }

    return hitPoints;
  });

  setCharacterName(name: string): void {
    this._characterName.set(name);
  }

  setAbility(name: AbilityName, value: number): void {
    this._abilities.update((abilities) => ({ ...abilities, [name]: value }));
  }

  selectRace(race: Race | null): void {
    this._selectedRace.set(race);
  }

  addClass(classId: string): void {
    this._classLevels.update((levels) =>
      levels.some((classLevel) => classLevel.classId === classId)
        ? levels
        : [...levels, { classId, level: 1 }],
    );
  }

  setClassLevel(classId: string, level: number): void {
    if (level <= 0) {
      this.removeClass(classId);
      return;
    }

    this._classLevels.update((levels) =>
      levels.map((classLevel) =>
        classLevel.classId === classId ? { ...classLevel, level } : classLevel,
      ),
    );
  }

  removeClass(classId: string): void {
    this._classLevels.update((levels) =>
      levels.filter((classLevel) => classLevel.classId !== classId),
    );
  }

  private findClass(classId: string): CharacterClass | undefined {
    return CLASSES.find((characterClass) => characterClass.id === classId);
  }

  private calculateBab(levels: ClassLevel[]): number {
    let total = 0;

    for (const classLevel of levels) {
      const characterClass = this.findClass(classLevel.classId);
      if (characterClass) {
        total += calculateBabForLevel(classLevel.level, characterClass.babProgression);
      }
    }

    return total;
  }
}
