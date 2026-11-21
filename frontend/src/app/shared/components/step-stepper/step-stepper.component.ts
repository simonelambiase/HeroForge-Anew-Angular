import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';

@Component({
  selector: 'app-step-stepper',
  standalone: true,
  imports: [],
  templateUrl: './step-stepper.component.html',
  styleUrl: './step-stepper.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepStepperComponent {
  readonly steps = input.required<string[]>();
  readonly currentStep = model.required<number>();

  goTo(index: number): void {
    this.currentStep.set(index);
  }
}
