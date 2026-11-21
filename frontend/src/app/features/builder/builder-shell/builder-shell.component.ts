import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';

import { CharacterService } from '../../../core/services/character.service';
import { OpenRouterService } from '../../../core/services/openrouter.service';
import { BadgeIndicatorComponent } from '../../../shared/components/badge-indicator/badge-indicator.component';
import { StepStepperComponent } from '../../../shared/components/step-stepper/step-stepper.component';
import { AiAssistantPanelComponent } from '../../ai-advisor/components/ai-assistant-panel/ai-assistant-panel.component';
import { AbilitiesStepComponent } from '../steps/abilities-step/abilities-step.component';
import { RaceStepComponent } from '../steps/race-step/race-step.component';
import { ClassStepComponent } from '../steps/class-step/class-step.component';
import { SheetPreviewComponent } from '../steps/sheet-preview/sheet-preview.component';

@Component({
  selector: 'app-builder-shell',
  standalone: true,
  imports: [
    StepStepperComponent,
    BadgeIndicatorComponent,
    AiAssistantPanelComponent,
    AbilitiesStepComponent,
    RaceStepComponent,
    ClassStepComponent,
    SheetPreviewComponent,
  ],
  templateUrl: './builder-shell.component.html',
  styleUrl: './builder-shell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BuilderShellComponent {
  readonly service = inject(CharacterService);
  readonly aiService = inject(OpenRouterService);
  readonly stepLabels = ['Abilità', 'Razza', 'Classe', 'Scheda'];
  readonly currentStep = signal<number>(0);
  readonly aiPanelOpen = signal<boolean>(false);

  readonly bab = computed(() => this.formatSigned(this.service.baseAttackBonus()));
  readonly armorClass = computed(() => `${this.service.armorClass()}`);
  readonly hitPoints = computed(() => `${this.service.totalHitPoints()}`);
  readonly fortitude = computed(() => this.formatSigned(this.service.savingThrows().fortitude));
  readonly reflex = computed(() => this.formatSigned(this.service.savingThrows().reflex));
  readonly will = computed(() => this.formatSigned(this.service.savingThrows().will));

  previous(): void {
    this.currentStep.update((value) => Math.max(0, value - 1));
  }

  next(): void {
    this.currentStep.update((value) => Math.min(this.stepLabels.length - 1, value + 1));
  }

  toggleAiPanel(): void {
    this.aiPanelOpen.update((value) => !value);
  }

  private formatSigned(value: number): string {
    return value >= 0 ? `+${value}` : `${value}`;
  }
}
