import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type BadgeVariant = 'neutral' | 'bab' | 'ac' | 'save' | 'hp';

@Component({
  selector: 'app-badge-indicator',
  standalone: true,
  imports: [],
  templateUrl: './badge-indicator.component.html',
  styleUrl: './badge-indicator.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BadgeIndicatorComponent {
  readonly label = input.required<string>();
  readonly value = input.required<string | number>();
  readonly variant = input<BadgeVariant>('neutral');
}
