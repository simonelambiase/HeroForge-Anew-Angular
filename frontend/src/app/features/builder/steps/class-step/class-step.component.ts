import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';

import { CharacterService } from '../../../../core/services/character.service';
import {
  CLASSES,
  type BabProgression,
  type CharacterClass,
  type ClassCategory,
  type SaveProgression,
} from '../../../../core/models/class.model';
import {
  CLASS_IDS_WITH_OPTIONS,
  COMBAT_STYLES,
  DEITIES,
  DOMAINS,
  DRUID_ANIMAL_COMPANIONS,
  FAMILIARS,
  FAVORED_ENEMIES,
  MAGIC_SCHOOLS,
  MONK_STYLES,
  RAGE_VARIANTS,
  RANGER_ANIMAL_COMPANIONS,
  type CombatStyle,
  type MonkStyle,
  type RageVariant,
  type WizardSchoolId,
  type WizardSpecialization,
} from '../../../../core/models/class-options.model';
import { CardPanelComponent } from '../../../../shared/components/card-panel/card-panel.component';
import { SelectorCardComponent } from '../../../../shared/components/selector-card/selector-card.component';

type ClassCategoryFilter = ClassCategory | 'all';

@Component({
  selector: 'app-class-step',
  standalone: true,
  imports: [CardPanelComponent, SelectorCardComponent],
  templateUrl: './class-step.component.html',
  styleUrl: './class-step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClassStepComponent {
  readonly service = inject(CharacterService);
  readonly classes = CLASSES;

  readonly categories: readonly { id: ClassCategoryFilter; label: string }[] = [
    { id: 'all', label: 'Tutte' },
    { id: 'core', label: 'Base PHB' },
    { id: 'base-expanded', label: 'Avanzate' },
    { id: 'prestige', label: 'Prestigio' },
  ];

  readonly activeCategory = signal<ClassCategoryFilter>('all');

  readonly visibleClasses = computed(() => {
    const activeCategory = this.activeCategory();
    if (activeCategory === 'all') {
      return CLASSES;
    }
    return CLASSES.filter((characterClass) => characterClass.category === activeCategory);
  });

  readonly classLevelsWithOptions = computed(() =>
    this.service.classLevels().filter((classLevel) => CLASS_IDS_WITH_OPTIONS.includes(classLevel.classId)),
  );

  readonly prohibitedSchoolLimit = computed(() =>
    this.maxProhibitedSchools(this.service.classOptions().wizard.specialization),
  );

  readonly rageDescription = computed(
    () =>
      RAGE_VARIANTS.find((variant) => variant.id === this.service.classOptions().barbarian.rageVariant)
        ?.description ?? '',
  );

  readonly monkDescription = computed(
    () =>
      MONK_STYLES.find((style) => style.id === this.service.classOptions().monk.monkStyle)
        ?.description ?? '',
  );

  readonly deities = DEITIES;
  readonly domains = DOMAINS;
  readonly magicSchools = MAGIC_SCHOOLS;
  readonly familiars = FAMILIARS;
  readonly favoredEnemies = FAVORED_ENEMIES;
  readonly combatStyles = COMBAT_STYLES;
  readonly rangerCompanions = RANGER_ANIMAL_COMPANIONS;
  readonly druidCompanions = DRUID_ANIMAL_COMPANIONS;
  readonly rageVariants = RAGE_VARIANTS;
  readonly monkStyles = MONK_STYLES;

  selectCategory(category: ClassCategoryFilter): void {
    this.activeCategory.set(category);
  }

  isSelected(classId: string): boolean {
    return this.service.classLevels().some((classLevel) => classLevel.classId === classId);
  }

  levelFor(classId: string): number {
    return this.service.classLevels().find((classLevel) => classLevel.classId === classId)?.level ?? 0;
  }

  addClass(classId: string): void {
    this.service.addClass(classId);
  }

  incrementLevel(classId: string): void {
    this.service.setClassLevel(classId, this.levelFor(classId) + 1);
  }

  decrementLevel(classId: string): void {
    this.service.setClassLevel(classId, this.levelFor(classId) - 1);
  }

  removeClass(classId: string): void {
    this.service.removeClass(classId);
  }

  className(classId: string): string {
    return CLASSES.find((characterClass) => characterClass.id === classId)?.name ?? classId;
  }

  classDescription(characterClass: CharacterClass): string {
    return `DV d${characterClass.hitDie} · BAB ${this.babLabel(characterClass.babProgression)} · ${characterClass.skillPointsPerLevel} abilità`;
  }

  saveBadges(characterClass: CharacterClass): string[] {
    return [
      `Tempra ${this.saveLabel(characterClass.fortProgression)}`,
      `Riflessi ${this.saveLabel(characterClass.refProgression)}`,
      `Volontà ${this.saveLabel(characterClass.willProgression)}`,
    ];
  }

  babLabel(progression: BabProgression): string {
    switch (progression) {
      case 'good':
        return 'Buono';
      case 'average':
        return 'Medio';
      case 'poor':
        return 'Scarso';
    }
  }

  saveLabel(progression: SaveProgression): string {
    return progression === 'good' ? 'Buono' : 'Scarso';
  }

  isDomainSelected(domainId: string): boolean {
    return this.service.classOptions().cleric.domains.includes(domainId);
  }

  toggleDomain(domainId: string): void {
    const domains = [...this.service.classOptions().cleric.domains];
    const index = domains.indexOf(domainId);

    if (index >= 0) {
      domains.splice(index, 1);
    } else if (domains.length < 2) {
      domains.push(domainId);
    }

    this.service.setClericOptions({ domains });
  }

  isProhibitedSchool(schoolId: string): boolean {
    return this.service.classOptions().wizard.prohibitedSchools.includes(schoolId as WizardSchoolId);
  }

  toggleProhibitedSchool(schoolId: string): void {
    const prohibited = [...this.service.classOptions().wizard.prohibitedSchools];
    const index = prohibited.indexOf(schoolId as WizardSchoolId);

    if (index >= 0) {
      prohibited.splice(index, 1);
    } else {
      const max = this.maxProhibitedSchools(this.service.classOptions().wizard.specialization);
      if (prohibited.length < max) {
        prohibited.push(schoolId as WizardSchoolId);
      }
    }

    this.service.setWizardOptions({ prohibitedSchools: prohibited });
  }

  setClericDeity(event: Event): void {
    this.service.setClericOptions({ deity: this.eventValue(event) });
  }

  setClericChanneling(event: Event): void {
    this.service.setClericOptions({
      channeling: this.eventValue(event) === 'rebuke' ? 'rebuke' : 'turn',
    });
  }

  setWizardSpecialization(event: Event): void {
    const specialization = this.eventValue(event) as WizardSpecialization;
    const max = this.maxProhibitedSchools(specialization);
    const prohibitedSchools = this.service.classOptions().wizard.prohibitedSchools.slice(0, max);
    this.service.setWizardOptions({ specialization, prohibitedSchools });
  }

  setFamiliar(event: Event): void {
    this.service.setWizardOptions({ familiar: this.eventValue(event) });
  }

  setRangerCombatStyle(event: Event): void {
    this.service.setRangerOptions({ combatStyle: this.eventValue(event) as CombatStyle });
  }

  setRangerFavoredEnemy(event: Event): void {
    this.service.setRangerOptions({ favoredEnemy: this.eventValue(event) });
  }

  setRangerAnimalCompanion(event: Event): void {
    this.service.setRangerOptions({ animalCompanion: this.eventValue(event) });
  }

  setRageVariant(event: Event): void {
    this.service.setBarbarianOptions({ rageVariant: this.eventValue(event) as RageVariant });
  }

  setDruidAnimalCompanion(event: Event): void {
    this.service.setDruidOptions({ animalCompanion: this.eventValue(event) });
  }

  setMonkStyle(event: Event): void {
    this.service.setMonkOptions({ monkStyle: this.eventValue(event) as MonkStyle });
  }

  private eventValue(event: Event): string {
    return (event.target as HTMLSelectElement).value;
  }

  private maxProhibitedSchools(specialization: WizardSpecialization): number {
    if (specialization === 'generalist') {
      return 0;
    }
    return specialization === 'divination' ? 1 : 2;
  }
}
