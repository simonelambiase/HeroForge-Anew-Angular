import { ChangeDetectionStrategy, Component, computed, inject, input, model } from '@angular/core';

import { I18nService } from '../../../core/services/i18n.service';
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
  readonly i18n = inject(I18nService);

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
  readonly decreaseLabel = computed(() => `${this.i18n.t('abilities.decrease')} ${this.label()}`);
  readonly increaseLabel = computed(() => `${this.i18n.t('abilities.increase')} ${this.label()}`);

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
