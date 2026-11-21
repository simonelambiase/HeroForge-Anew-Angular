import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';

import { CharacterService } from '../../../../core/services/character.service';
import { I18nService } from '../../../../core/services/i18n.service';
import {
  ABILITY_ORDER,
  calculatePointBuyCost,
  calculatePointBuySpent,
  POINT_BUY_MAX,
  POINT_BUY_MIN,
  POINT_BUY_PRESETS,
  type AbilityName,
} from '../../../../core/models/ability-scores.model';
import { CardPanelComponent } from '../../../../shared/components/card-panel/card-panel.component';
import { StatBoxComponent } from '../../../../shared/components/stat-box/stat-box.component';

type AbilityMethod = 'pointBuy' | 'manual';

@Component({
  selector: 'app-abilities-step',
  standalone: true,
  imports: [CardPanelComponent, StatBoxComponent],
  templateUrl: './abilities-step.component.html',
  styleUrl: './abilities-step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AbilitiesStepComponent {
  readonly service = inject(CharacterService);
  readonly i18n = inject(I18nService);
  readonly abilityOrder = ABILITY_ORDER;
  readonly pointBuyPresets = POINT_BUY_PRESETS;

  readonly method = signal<AbilityMethod>('pointBuy');
  readonly budget = signal<number>(25);

  readonly minScore = computed(() => (this.method() === 'pointBuy' ? POINT_BUY_MIN : 3));
  readonly maxScore = POINT_BUY_MAX;

  readonly abilityLabels = computed<Record<AbilityName, string>>(() => ({
    STR: this.i18n.t('abilities.full.STR'),
    DEX: this.i18n.t('abilities.full.DEX'),
    CON: this.i18n.t('abilities.full.CON'),
    INT: this.i18n.t('abilities.full.INT'),
    WIS: this.i18n.t('abilities.full.WIS'),
    CHA: this.i18n.t('abilities.full.CHA'),
  }));

  readonly spentPoints = computed(() => calculatePointBuySpent(this.service.abilities()));
  readonly remainingPoints = computed(() => this.budget() - this.spentPoints());

  setMethod(method: AbilityMethod): void {
    this.method.set(method);
    if (method === 'pointBuy') {
      for (const name of ABILITY_ORDER) {
        if (this.service.abilities()[name] < POINT_BUY_MIN) {
          this.service.setAbility(name, POINT_BUY_MIN);
        }
      }
    }
  }

  setBudget(budget: number): void {
    this.budget.set(budget);
  }

  setAbility(name: AbilityName, value: number): void {
    this.service.setAbility(name, value);
  }

  racialBonusFor(name: AbilityName): number {
    return this.service.selectedRace()?.abilityModifiers[name] ?? 0;
  }

  canIncrement(name: AbilityName): boolean {
    const score = this.service.abilities()[name];
    if (score >= POINT_BUY_MAX) {
      return false;
    }
    if (this.method() === 'manual') {
      return true;
    }
    const cost = calculatePointBuyCost(score + 1) - calculatePointBuyCost(score);
    return this.remainingPoints() >= cost;
  }

  canDecrement(name: AbilityName): boolean {
    return this.service.abilities()[name] > this.minScore();
  }
}
