import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';

@Component({
  selector: 'app-card-panel',
  standalone: true,
  imports: [],
  templateUrl: './card-panel.component.html',
  styleUrl: './card-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardPanelComponent {
  readonly title = input.required<string>();
  readonly collapsible = input<boolean>(true);
  readonly collapsed = model<boolean>(false);

  toggle(): void {
    this.collapsed.update((value) => !value);
  }
}
