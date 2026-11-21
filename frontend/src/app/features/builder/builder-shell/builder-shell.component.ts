import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';

import { CharacterService } from '../../../core/services/character.service';
import { I18nService, type SupportedLanguage } from '../../../core/services/i18n.service';
import { OpenRouterService } from '../../../core/services/openrouter.service';
import { BadgeIndicatorComponent } from '../../../shared/components/badge-indicator/badge-indicator.component';
import { StepStepperComponent } from '../../../shared/components/step-stepper/step-stepper.component';
import { AiAssistantPanelComponent } from '../../ai-advisor/components/ai-assistant-panel/ai-assistant-panel.component';
import { AbilitiesStepComponent } from '../steps/abilities-step/abilities-step.component';
import { RaceStepComponent } from '../steps/race-step/race-step.component';
import { ClassStepComponent } from '../steps/class-step/class-step.component';
import { SkillsStepComponent } from '../steps/skills-step/skills-step.component';
import { FeatsStepComponent } from '../steps/feats-step/feats-step.component';
import { EquipmentStepComponent } from '../steps/equipment-step/equipment-step.component';
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
    SkillsStepComponent,
    FeatsStepComponent,
    EquipmentStepComponent,
    SheetPreviewComponent,
  ],
  templateUrl: './builder-shell.component.html',
  styleUrl: './builder-shell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BuilderShellComponent {
  readonly service = inject(CharacterService);
  readonly aiService = inject(OpenRouterService);
  readonly i18n = inject(I18nService);

  readonly stepLabels = computed(() => [
    this.i18n.t('stepper.abilities'),
    this.i18n.t('stepper.race'),
    this.i18n.t('stepper.class'),
    this.i18n.t('stepper.skills'),
    this.i18n.t('stepper.feats'),
    this.i18n.t('stepper.equipment'),
    this.i18n.t('stepper.sheet'),
  ]);

  readonly badgeLabels = computed(() => ({
    bab: this.i18n.t('badges.bab'),
    ac: this.i18n.t('badges.ac'),
    fortitude: this.i18n.t('badges.fortitude'),
    reflex: this.i18n.t('badges.reflex'),
    will: this.i18n.t('badges.will'),
    hp: this.i18n.t('badges.hp'),
  }));

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
    this.currentStep.update((value) => Math.min(this.stepLabels().length - 1, value + 1));
  }

  setLanguage(language: SupportedLanguage): void {
    this.i18n.setLanguage(language);
  }

  toggleAiPanel(): void {
    this.aiPanelOpen.update((value) => !value);
  }

  private formatSigned(value: number): string {
    return value >= 0 ? `+${value}` : `${value}`;
  }
}
