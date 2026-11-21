import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { CharacterService } from '../../../../core/services/character.service';
import { ABILITY_ORDER, formatModifier, type AbilityName } from '../../../../core/models/ability-scores.model';
import { CLASSES } from '../../../../core/models/class.model';
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

  toJson(): CharacterSheet {
    return {
      name: this.service.characterName() || 'Senza nome',
      baseAbilities: { ...this.service.abilities() },
      race: this.service.selectedRace(),
      classLevels: [...this.service.classLevels()],
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
