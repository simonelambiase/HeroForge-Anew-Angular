import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { CharacterService } from '../../../../core/services/character.service';
import { ABILITY_ORDER, formatModifier } from '../../../../core/models/ability-scores.model';
import { RACES, type Race } from '../../../../core/models/race.model';
import { CardPanelComponent } from '../../../../shared/components/card-panel/card-panel.component';
import { SelectorCardComponent } from '../../../../shared/components/selector-card/selector-card.component';

@Component({
  selector: 'app-race-step',
  standalone: true,
  imports: [CardPanelComponent, SelectorCardComponent],
  templateUrl: './race-step.component.html',
  styleUrl: './race-step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RaceStepComponent {
  readonly service = inject(CharacterService);
  readonly races = RACES;

  isSelected(raceId: string): boolean {
    return this.service.selectedRace()?.id === raceId;
  }

  selectRace(race: Race): void {
    this.service.selectRace(race);
  }

  raceDescription(race: Race): string {
    return `${race.size} · Velocità ${race.baseSpeed}m · Classe preferita: ${race.favoredClass}`;
  }

  abilityModifierBadges(race: Race): string[] {
    return ABILITY_ORDER.filter((name) => (race.abilityModifiers[name] ?? 0) !== 0).map(
      (name) => `${formatModifier(race.abilityModifiers[name] ?? 0)} ${name}`,
    );
  }
}
