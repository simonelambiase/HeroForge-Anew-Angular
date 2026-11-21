import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { CharacterService } from '../../../../core/services/character.service';
import {
  CLASSES,
  type BabProgression,
  type CharacterClass,
  type SaveProgression,
} from '../../../../core/models/class.model';
import { CardPanelComponent } from '../../../../shared/components/card-panel/card-panel.component';
import { SelectorCardComponent } from '../../../../shared/components/selector-card/selector-card.component';

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
}
