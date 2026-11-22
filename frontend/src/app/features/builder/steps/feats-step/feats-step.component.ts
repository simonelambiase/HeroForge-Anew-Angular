import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';

import { CharacterService } from '../../../../core/services/character.service';
import { I18nService } from '../../../../core/services/i18n.service';
import { FEATS, type Feat, type FeatType } from '../../../../core/models/feat.model';
import { CardPanelComponent } from '../../../../shared/components/card-panel/card-panel.component';
import { SelectorCardComponent } from '../../../../shared/components/selector-card/selector-card.component';

type FeatFilter = 'all' | FeatType;

@Component({
  selector: 'app-feats-step',
  standalone: true,
  imports: [CardPanelComponent, SelectorCardComponent],
  templateUrl: './feats-step.component.html',
  styleUrl: './feats-step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatsStepComponent {
  readonly service = inject(CharacterService);
  readonly i18n = inject(I18nService);
  readonly feats = FEATS;
  readonly filter = signal<FeatFilter>('all');

  readonly filters: FeatFilter[] = [
    'all',
    'general',
    'combat',
    'metamagic',
    'item_creation',
    'racial',
  ];

  readonly filteredFeats = computed(() => {
    const current = this.filter();
    if (current === 'all') {
      return this.feats;
    }

    return this.feats.filter((feat) => feat.type === current);
  });

  readonly selectedCount = computed(() => this.service.selectedFeats().length);

  isSelected(featId: string): boolean {
    return this.service.selectedFeats().includes(featId);
  }

  canToggle(featId: string): boolean {
    if (this.isSelected(featId)) {
      return true;
    }

    return this.service.selectedFeats().length < this.service.availableFeatsCount();
  }

  toggle(feat: Feat): void {
    if (!this.canToggle(feat.id)) {
      return;
    }

    this.service.toggleFeat(feat.id);
  }

  featDescription(feat: Feat): string {
    const prerequisite = this.i18n.getFeatPrerequisite(feat.id);
    const prefix = prerequisite
      ? `${this.i18n.t('feats.prerequisitesLabel')}: ${prerequisite}`
      : this.i18n.t('feats.noPrerequisite');
    return `${prefix}. ${this.i18n.getFeatBenefit(feat.id)}`;
  }
}
