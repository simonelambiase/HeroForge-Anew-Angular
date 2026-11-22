import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { CharacterService } from '../../../../core/services/character.service';
import { I18nService } from '../../../../core/services/i18n.service';
import { ABILITY_ORDER, formatModifier, type AbilityName } from '../../../../core/models/ability-scores.model';
import { SKILLS } from '../../../../core/models/skill.model';
import { isCustomRace } from '../../../../core/models/race.model';
import { CLASS_IDS_WITH_OPTIONS } from '../../../../core/models/class-options.model';
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
  readonly i18n = inject(I18nService);
  readonly abilityOrder = ABILITY_ORDER;

  readonly abilityLabels = computed<Record<AbilityName, string>>(() => {
    const labels = {} as Record<AbilityName, string>;
    for (const name of ABILITY_ORDER) {
      labels[name] = this.i18n.t('abilities.full.' + name);
    }
    return labels;
  });

  readonly babLabel = computed(() => this.formatSigned(this.service.baseAttackBonus()));
  readonly armorClass = computed(() => `${this.service.armorClass()}`);
  readonly hitPoints = computed(() => `${this.service.totalHitPoints()}`);
  readonly fortitude = computed(() => this.formatSigned(this.service.savingThrows().fortitude));
  readonly reflex = computed(() => this.formatSigned(this.service.savingThrows().reflex));
  readonly will = computed(() => this.formatSigned(this.service.savingThrows().will));

  readonly selectedSkills = computed(() =>
    SKILLS.filter((skill) => (this.service.skillRanks()[skill.id] ?? 0) > 0),
  );

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

  raceName(): string {
    const race = this.service.selectedRace();
    if (!race) {
      return this.i18n.t('sheet.noRace');
    }
    return isCustomRace(race) ? race.name : this.i18n.getRaceName(race.id);
  }

  className(classId: string): string {
    return this.i18n.getClassName(classId);
  }

  classOptionsSummary(classId: string): string {
    const options = this.service.classOptions();

    switch (classId) {
      case 'cleric': {
        const domains = options.cleric.domains.map((id) => this.i18n.getDomainName(id)).join(', ') || '—';
        const channeling =
          options.cleric.channeling === 'turn' ? this.i18n.t('class.turn') : this.i18n.t('class.rebuke');
        return this.i18n.t('sheet.clericSummary', {
          deity: this.i18n.getDeityName(options.cleric.deity),
          domains,
          channeling,
        });
      }
      case 'wizard': {
        const specialization = this.i18n.getSchoolName(options.wizard.specialization);
        const prohibited = options.wizard.prohibitedSchools
          .map((id) => this.i18n.getSchoolName(id))
          .join(', ');
        const familiar = options.wizard.familiar
          ? this.i18n.getFamiliarName(options.wizard.familiar)
          : '—';
        const prohibitedText = prohibited ? ` (${this.i18n.t('sheet.prohibited')}: ${prohibited})` : '';
        return this.i18n.t('sheet.wizardSummary', {
          specialization,
          prohibited: prohibitedText,
          familiar,
        });
      }
      case 'ranger': {
        const style = this.i18n.getCombatStyleName(options.ranger.combatStyle);
        const enemy = options.ranger.favoredEnemy
          ? this.i18n.getFavoredEnemyName(options.ranger.favoredEnemy)
          : '—';
        const companion = options.ranger.animalCompanion
          ? this.i18n.getAnimalCompanionName(options.ranger.animalCompanion)
          : '—';
        return this.i18n.t('sheet.rangerSummary', { style, enemy, companion });
      }
      case 'barbarian': {
        return this.i18n.t('sheet.barbarianSummary', {
          variant: this.i18n.getRageVariantName(options.barbarian.rageVariant),
        });
      }
      case 'druid': {
        return this.i18n.t('sheet.druidSummary', {
          companion: options.druid.animalCompanion
            ? this.i18n.getAnimalCompanionName(options.druid.animalCompanion)
            : '—',
        });
      }
      case 'monk': {
        return this.i18n.t('sheet.monkSummary', {
          style: this.i18n.getMonkStyleName(options.monk.monkStyle),
        });
      }
      default:
        return '';
    }
  }

  toJson(): CharacterSheet {
    return {
      name: this.service.characterName() || this.i18n.t('sheet.unnamed'),
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
    anchor.download = 'heroforge-anew-angular-character.json';
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
