import { ChangeDetectionStrategy, Component, computed, input, model } from '@angular/core';

import {
  calculateAbilityModifier,
  formatModifier,
  type AbilityName,
} from '../../../core/models/ability-scores.model';

@Component({
  selector: 'app-stat-box',
  standalone: true,
  imports: [],
  templateUrl: './stat-box.component.html',
  styleUrl: './stat-box.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatBoxComponent {
  readonly name = input.required<AbilityName>();
  readonly label = input.required<string>();
  readonly score = model.required<number>();
  readonly racialBonus = input<number>(0);
  readonly min = input<number>(3);
  readonly max = input<number>(18);
  readonly canIncrement = input<boolean>(true);
  readonly canDecrement = input<boolean>(true);

  readonly total = computed(() => this.score() + this.racialBonus());
  readonly modifier = computed(() => calculateAbilityModifier(this.total()));
  readonly modifierLabel = computed(() => formatModifier(this.modifier()));
  readonly racialBonusLabel = computed(() => formatModifier(this.racialBonus()));

  increment(): void {
    if (!this.canIncrement()) {
      return;
    }
    this.score.update((value) => Math.min(this.max(), value + 1));
  }

  decrement(): void {
    if (!this.canDecrement()) {
      return;
    }
    this.score.update((value) => Math.max(this.min(), value - 1));
  }
}
