import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';

@Component({
  selector: 'app-selector-card',
  standalone: true,
  imports: [],
  templateUrl: './selector-card.component.html',
  styleUrl: './selector-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectorCardComponent {
  readonly title = input.required<string>();
  readonly description = input<string>('');
  readonly badges = input<string[]>([]);
  readonly selected = model<boolean>(false);
  readonly disabled = input<boolean>(false);

  select(): void {
    if (this.disabled()) {
      return;
    }
    this.selected.set(true);
  }
}
