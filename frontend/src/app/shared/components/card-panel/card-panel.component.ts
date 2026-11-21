import { ChangeDetectionStrategy, Component, inject, input, model } from '@angular/core';

import { I18nService } from '../../../core/services/i18n.service';

@Component({
  selector: 'app-card-panel',
  standalone: true,
  imports: [],
  templateUrl: './card-panel.component.html',
  styleUrl: './card-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardPanelComponent {
  private readonly i18n = inject(I18nService);

  readonly title = input.required<string>();
  readonly collapsible = input<boolean>(true);
  readonly collapsed = model<boolean>(false);

  toggle(): void {
    this.collapsed.update((value) => !value);
  }

  collapseLabel(): string {
    return this.collapsed() ? this.i18n.t('common.expand') : this.i18n.t('common.collapse');
  }
}
