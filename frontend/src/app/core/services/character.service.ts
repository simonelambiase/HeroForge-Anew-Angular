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
import {
  DEFAULT_CLASS_OPTIONS,
  KNOWLEDGE_DOMAIN_ID,
  RAT_FAMILIAR_ID,
  TOAD_FAMILIAR_ID,
  WEASEL_FAMILIAR_ID,
  type BarbarianOptions,
  type CharacterClassOptions,
  type ClericOptions,
  type DruidOptions,
  type MonkOptions,
  type RangerOptions,
  type WizardOptions,
} from '../models/class-options.model';
import type { ClassLevel } from '../models/character.model';
import { SKILLS, skillSizeModifier, skillSynergyBonus, type SkillTotal } from '../models/skill.model';
import {
  carryingCapacityForStrength,
  type Armor,
  type CarryingCapacity,
  type Weapon,
} from '../models/equipment.model';

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
  private readonly _skillRanks = signal<Record<string, number>>({});
  private readonly _selectedFeats = signal<string[]>([]);
  private readonly _equippedWeapons = signal<Weapon[]>([]);
  private readonly _equippedArmor = signal<Armor | null>(null);
  private readonly _classOptions = signal<CharacterClassOptions>({ ...DEFAULT_CLASS_OPTIONS });

  readonly characterName = this._characterName.asReadonly();
  readonly abilities = this._abilities.asReadonly();
  readonly selectedRace = this._selectedRace.asReadonly();
  readonly classLevels = this._classLevels.asReadonly();
  readonly skillRanks = this._skillRanks.asReadonly();
  readonly selectedFeats = this._selectedFeats.asReadonly();
  readonly equippedWeapons = this._equippedWeapons.asReadonly();
  readonly equippedArmor = this._equippedArmor.asReadonly();
  readonly classOptions = this._classOptions.asReadonly();

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

  readonly iterativeAttacks = computed(() => {
    const bab = this.baseAttackBonus();
    const attacks: number[] = [];
    let attack = bab;

    while (attack >= 1) {
      attacks.push(attack);
      attack -= 5;
    }

    if (attacks.length === 0) {
      attacks.push(bab);
    }

    return attacks.map((value) => (value >= 0 ? `+${value}` : `${value}`)).join('/');
  });

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
    const familiarBonus = this.familiarSavingBonus();

    return {
      fortitude: base.fortitude + modifiers.CON.modifier + familiarBonus.fortitude,
      reflex: base.reflex + modifiers.DEX.modifier + familiarBonus.reflex,
      will: base.will + modifiers.WIS.modifier,
    };
  });

  readonly armorClass = computed(() => {
    const dexterityModifier = this.abilityModifiers().DEX.modifier;
    const size = this._selectedRace()?.size ?? 'Medium';
    const armor = this._equippedArmor();
    const maxDexBonus = armor?.maxDexBonus ?? null;
    const effectiveDexterity =
      maxDexBonus === null ? dexterityModifier : Math.min(dexterityModifier, maxDexBonus);

    return 10 + effectiveDexterity + SIZE_AC_MODIFIERS[size] + (armor?.armorBonus ?? 0);
  });

  readonly touchArmorClass = computed(() => {
    const dexterityModifier = this.abilityModifiers().DEX.modifier;
    const size = this._selectedRace()?.size ?? 'Medium';
    const armor = this._equippedArmor();
    const maxDexBonus = armor?.maxDexBonus ?? null;
    const effectiveDexterity =
      maxDexBonus === null ? dexterityModifier : Math.min(dexterityModifier, maxDexBonus);

    return 10 + effectiveDexterity + SIZE_AC_MODIFIERS[size];
  });

  readonly flatFootedArmorClass = computed(() => {
    const dexterityModifier = this.abilityModifiers().DEX.modifier;
    const size = this._selectedRace()?.size ?? 'Medium';
    const armor = this._equippedArmor();

    return 10 + SIZE_AC_MODIFIERS[size] + (armor?.armorBonus ?? 0) + Math.min(0, dexterityModifier);
  });

  readonly defensiveFightingBonus = computed<{ fightingDefensively: number; totalDefense: number }>(
    () => {
      const tumbleRanks = this._skillRanks()['tumble'] ?? 0;
      const hasImprovedTumble = tumbleRanks >= 5;

      return {
        fightingDefensively: hasImprovedTumble ? 3 : 2,
        totalDefense: hasImprovedTumble ? 6 : 4,
      };
    },
  );

  readonly maxClassSkillRanks = computed(() => this.totalLevel() + 3);

  readonly maxCrossClassSkillRanks = computed(() => Math.floor((this.totalLevel() + 3) / 2));

  readonly availableSkillPoints = computed(() => {
    const totalLevel = this.totalLevel();
    if (totalLevel <= 0) {
      return 0;
    }

    const intelligenceModifier = Math.max(1, this.abilityModifiers().INT.modifier);
    const isHuman = this._selectedRace()?.id === 'human';

    let points = 0;
    let firstClassLevelProcessed = false;

    for (const classLevel of this._classLevels()) {
      const characterClass = this.findClass(classLevel.classId);
      if (!characterClass) {
        continue;
      }

      const perLevel = characterClass.skillPointsPerLevel + intelligenceModifier;

      for (let i = 0; i < classLevel.level; i++) {
        if (!firstClassLevelProcessed) {
          points += perLevel * 4 + (isHuman ? 4 : 0);
          firstClassLevelProcessed = true;
        } else {
          points += perLevel + (isHuman ? 1 : 0);
        }
      }
    }

    return points;
  });

  readonly spentSkillPoints = computed(() => {
    let spent = 0;

    for (const [skillId, ranks] of Object.entries(this._skillRanks())) {
      spent += ranks * (this.isClassSkill(skillId) ? 1 : 2);
    }

    return spent;
  });

  readonly remainingSkillPoints = computed(
    () => this.availableSkillPoints() - this.spentSkillPoints(),
  );

  readonly availableFeatsCount = computed(() => {
    const totalLevel = this.totalLevel();
    if (totalLevel <= 0) {
      return 0;
    }

    let count = 1;
    for (const level of [3, 6, 9, 12, 15, 18]) {
      if (totalLevel >= level) {
        count += 1;
      }
    }

    if (this._selectedRace()?.id === 'human') {
      count += 1;
    }

    if (this._classLevels().some((classLevel) => classLevel.classId === 'fighter')) {
      count += 1;
    }

    return count;
  });

  readonly totalWeight = computed(() => {
    const weaponsWeight = this._equippedWeapons().reduce((sum, weapon) => sum + weapon.weight, 0);
    const armorWeight = this._equippedArmor()?.weight ?? 0;
    return weaponsWeight + armorWeight;
  });

  readonly carryingCapacity = computed<CarryingCapacity>(() =>
    carryingCapacityForStrength(this.finalAbilities().STR.total),
  );

  readonly loadCategory = computed(() => {
    const weight = this.totalWeight();
    const capacity = this.carryingCapacity();

    if (weight <= capacity.light) {
      return 'Leggero';
    }
    if (weight <= capacity.medium) {
      return 'Medio';
    }
    if (weight <= capacity.heavy) {
      return 'Pesante';
    }
    return 'Oltre il massimo';
  });

  readonly totalSkills = computed<SkillTotal[]>(() => {
    const ranks = this._skillRanks();
    const modifiers = this.abilityModifiers();
    const size = this._selectedRace()?.size ?? 'Medium';
    const armor = this._equippedArmor();

    return SKILLS.map((skill) => {
      const rankCount = ranks[skill.id] ?? 0;
      const isClassSkill = this.isClassSkill(skill.id);
      const keyAbilityModifier = modifiers[skill.keyAbility].modifier;
      const sizeModifier = skillSizeModifier(skill.id, size);
      const armorPenalty = skill.armorCheckPenalty ? (armor?.armorCheckPenalty ?? 0) : 0;
      const synergyBonus = skillSynergyBonus(skill.id, ranks);

      return {
        skill,
        ranks: rankCount,
        isClassSkill,
        keyAbilityModifier,
        sizeModifier,
        armorPenalty,
        synergyBonus,
        total: rankCount + keyAbilityModifier + sizeModifier + armorPenalty + synergyBonus,
      };
    });
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

    const toadBonus =
      this.hasClassLevels('wizard') && this._classOptions().wizard.familiar === TOAD_FAMILIAR_ID
        ? 3
        : 0;

    return hitPoints + toadBonus;
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

  setSkillRank(skillId: string, ranks: number): void {
    if (ranks <= 0) {
      this._skillRanks.update((current) => {
        const next = { ...current };
        delete next[skillId];
        return next;
      });
      return;
    }

    this._skillRanks.update((current) => ({ ...current, [skillId]: ranks }));
  }

  toggleFeat(featId: string): void {
    this._selectedFeats.update((current) =>
      current.includes(featId)
        ? current.filter((id) => id !== featId)
        : [...current, featId],
    );
  }

  toggleWeapon(weapon: Weapon): void {
    this._equippedWeapons.update((current) =>
      current.some((equipped) => equipped.id === weapon.id)
        ? current.filter((equipped) => equipped.id !== weapon.id)
        : [...current, weapon],
    );
  }

  setEquippedArmor(armor: Armor | null): void {
    this._equippedArmor.set(armor);
  }

  toggleArmor(armor: Armor): void {
    this._equippedArmor.update((current) => (current?.id === armor.id ? null : armor));
  }

  setClericOptions(options: Partial<ClericOptions>): void {
    this._classOptions.update((current) => ({
      ...current,
      cleric: { ...current.cleric, ...options },
    }));
  }

  setWizardOptions(options: Partial<WizardOptions>): void {
    this._classOptions.update((current) => ({
      ...current,
      wizard: { ...current.wizard, ...options },
    }));
  }

  setRangerOptions(options: Partial<RangerOptions>): void {
    this._classOptions.update((current) => ({
      ...current,
      ranger: { ...current.ranger, ...options },
    }));
  }

  setBarbarianOptions(options: Partial<BarbarianOptions>): void {
    this._classOptions.update((current) => ({
      ...current,
      barbarian: { ...current.barbarian, ...options },
    }));
  }

  setDruidOptions(options: Partial<DruidOptions>): void {
    this._classOptions.update((current) => ({
      ...current,
      druid: { ...current.druid, ...options },
    }));
  }

  setMonkOptions(options: Partial<MonkOptions>): void {
    this._classOptions.update((current) => ({
      ...current,
      monk: { ...current.monk, ...options },
    }));
  }

  isClassSkill(skillId: string): boolean {
    const skill = SKILLS.find((candidate) => candidate.id === skillId);
    if (!skill) {
      return false;
    }

    if (skillId.startsWith('knowledge-') && this.hasKnowledgeDomain()) {
      return true;
    }

    return this._classLevels().some((classLevel) => {
      const characterClass = this.findClass(classLevel.classId);
      return characterClass?.classSkills.includes(skill.name) ?? false;
    });
  }

  maxRanksFor(skillId: string): number {
    return this.isClassSkill(skillId)
      ? this.maxClassSkillRanks()
      : this.maxCrossClassSkillRanks();
  }

  hasClassLevels(classId: string): boolean {
    return this._classLevels().some((classLevel) => classLevel.classId === classId);
  }

  private hasKnowledgeDomain(): boolean {
    return (
      this.hasClassLevels('cleric') &&
      this._classOptions().cleric.domains.includes(KNOWLEDGE_DOMAIN_ID)
    );
  }

  private familiarSavingBonus(): { fortitude: number; reflex: number } {
    if (!this.hasClassLevels('wizard')) {
      return { fortitude: 0, reflex: 0 };
    }

    const familiar = this._classOptions().wizard.familiar;
    return {
      fortitude: familiar === RAT_FAMILIAR_ID ? 2 : 0,
      reflex: familiar === WEASEL_FAMILIAR_ID ? 2 : 0,
    };
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
