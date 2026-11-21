import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { CharacterService } from '../../../../core/services/character.service';
import { ABILITY_ORDER, formatModifier, type AbilityName } from '../../../../core/models/ability-scores.model';
import { CLASSES } from '../../../../core/models/class.model';
import {
  CLASS_IDS_WITH_OPTIONS,
  MONK_STYLES,
  RAGE_VARIANTS,
  domainName,
  familiarName,
  schoolName,
} from '../../../../core/models/class-options.model';
import type { CharacterSheet } from '../../../../core/models/character.model';
import { BadgeIndicatorComponent } from '../../../../shared/components/badge-indicator/badge-indicator.component';

@Component({
  selector: 'app-sheet-preview',
  standalone: true,
  imports: [BadgeIndicatorComponent],
  templateUrl: './sheet-preview.component.html',
  styleUrl: './sheet-preview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SheetPreviewComponent {
  readonly service = inject(CharacterService);
  readonly abilityOrder = ABILITY_ORDER;

  readonly abilityLabels: Record<AbilityName, string> = {
    STR: 'Forza',
    DEX: 'Destrezza',
    CON: 'Costituzione',
    INT: 'Intelligenza',
    WIS: 'Saggezza',
    CHA: 'Carisma',
  };

  readonly babLabel = computed(() => this.formatSigned(this.service.baseAttackBonus()));
  readonly armorClass = computed(() => `${this.service.armorClass()}`);
  readonly hitPoints = computed(() => `${this.service.totalHitPoints()}`);
  readonly fortitude = computed(() => this.formatSigned(this.service.savingThrows().fortitude));
  readonly reflex = computed(() => this.formatSigned(this.service.savingThrows().reflex));
  readonly will = computed(() => this.formatSigned(this.service.savingThrows().will));

  readonly classLevelsWithOptions = computed(() =>
    this.service.classLevels().filter((classLevel) => CLASS_IDS_WITH_OPTIONS.includes(classLevel.classId)),
  );

  updateName(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.service.setCharacterName(target.value);
  }

  modifierLabel(name: AbilityName): string {
    return formatModifier(this.service.abilityModifiers()[name].modifier);
  }

  baseSaveLabel(value: number): string {
    return this.formatSigned(value);
  }

  className(classId: string): string {
    return CLASSES.find((characterClass) => characterClass.id === classId)?.name ?? classId;
  }

  classOptionsSummary(classId: string): string {
    const options = this.service.classOptions();

    switch (classId) {
      case 'cleric': {
        const domains = options.cleric.domains.map(domainName).join(', ') || '—';
        const channeling = options.cleric.channeling === 'turn' ? 'Scacciare' : 'Intimorire';
        return `Divinità: ${options.cleric.deity} | Domini: ${domains} | ${channeling}`;
      }
      case 'wizard': {
        const specialization = schoolName(options.wizard.specialization);
        const prohibited = options.wizard.prohibitedSchools.map(schoolName).join(', ');
        const familiar = options.wizard.familiar ? familiarName(options.wizard.familiar) : '—';
        const prohibitedText = prohibited ? ` (Proibite: ${prohibited})` : '';
        return `Scuola: ${specialization}${prohibitedText} | Familiare: ${familiar}`;
      }
      case 'ranger': {
        const style =
          options.ranger.combatStyle === 'archery'
            ? 'Tiro con l\u2019Arco'
            : 'Combattere con Due Armi';
        const enemy = options.ranger.favoredEnemy || '—';
        const companion = options.ranger.animalCompanion || '—';
        return `Stile: ${style} | Nemico prescelto: ${enemy} | Compagno: ${companion}`;
      }
      case 'barbarian': {
        const variant =
          RAGE_VARIANTS.find((item) => item.id === options.barbarian.rageVariant)?.name ??
          options.barbarian.rageVariant;
        return `Ira: ${variant}`;
      }
      case 'druid': {
        return `Compagno animale: ${options.druid.animalCompanion || '—'}`;
      }
      case 'monk': {
        const style =
          MONK_STYLES.find((item) => item.id === options.monk.monkStyle)?.name ?? options.monk.monkStyle;
        return `Stile: ${style}`;
      }
      default:
        return '';
    }
  }

  toJson(): CharacterSheet {
    return {
      name: this.service.characterName() || 'Senza nome',
      baseAbilities: { ...this.service.abilities() },
      race: this.service.selectedRace(),
      classLevels: [...this.service.classLevels()],
      skillRanks: { ...this.service.skillRanks() },
      selectedFeats: [...this.service.selectedFeats()],
      equippedWeapons: [...this.service.equippedWeapons()],
      equippedArmor: this.service.equippedArmor(),
    };
  }

  exportJson(): void {
    const blob = new Blob([JSON.stringify(this.toJson(), null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'hakrom-character.json';
    anchor.click();
    URL.revokeObjectURL(url);
  }

  print(): void {
    window.print();
  }

  private formatSigned(value: number): string {
    return value >= 0 ? `+${value}` : `${value}`;
  }
}
