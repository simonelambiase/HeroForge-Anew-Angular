import { ChangeDetectionStrategy, Component, computed, inject, model, signal } from '@angular/core';

import { CharacterService } from '../../../../core/services/character.service';
import { OpenRouterService } from '../../../../core/services/openrouter.service';
import { ABILITY_ORDER } from '../../../../core/models/ability-scores.model';
import { CLASSES } from '../../../../core/models/class.model';
import { AiSettingsComponent } from '../ai-settings/ai-settings.component';

type AiTab = 'build' | 'lore' | 'rules';

interface ChatEntry {
  role: 'user' | 'assistant';
  content: string;
}

@Component({
  selector: 'app-ai-assistant-panel',
  standalone: true,
  imports: [AiSettingsComponent],
  templateUrl: './ai-assistant-panel.component.html',
  styleUrl: './ai-assistant-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AiAssistantPanelComponent {
  readonly open = model<boolean>(false);

  readonly characterService = inject(CharacterService);
  readonly aiService = inject(OpenRouterService);

  readonly tabs: { id: AiTab; label: string }[] = [
    { id: 'build', label: 'Build Advisor' },
    { id: 'lore', label: 'Generatore Lore' },
    { id: 'rules', label: 'Regole 3.5 & Chat' },
  ];

  readonly activeTab = signal<AiTab>('build');
  readonly conceptQuery = signal('');
  readonly buildResult = signal('');
  readonly loreResult = signal('');
  readonly question = signal('');
  readonly chatHistory = signal<ChatEntry[]>([]);

  readonly characterSummary = computed(() => this.buildCharacterSummary());

  selectTab(tab: AiTab): void {
    this.activeTab.set(tab);
  }

  close(): void {
    this.open.set(false);
  }

  setConceptQuery(event: Event): void {
    this.conceptQuery.set((event.target as HTMLTextAreaElement).value);
  }

  setQuestion(event: Event): void {
    this.question.set((event.target as HTMLInputElement).value);
  }

  async runBuildAdvice(): Promise<void> {
    try {
      this.buildResult.set('');
      this.buildResult.set(
        await this.aiService.getBuildAdvice(this.characterSummary(), this.conceptQuery()),
      );
    } catch {
      // L'errore è già esposto tramite aiService.error().
    }
  }

  async runGenerateLore(): Promise<void> {
    try {
      this.loreResult.set('');
      this.loreResult.set(await this.aiService.generateLore(this.characterSummary()));
    } catch {
      // L'errore è già esposto tramite aiService.error().
    }
  }

  async askQuestion(): Promise<void> {
    const question = this.question().trim();
    if (!question) {
      return;
    }

    this.chatHistory.update((history) => [...history, { role: 'user', content: question }]);
    this.question.set('');

    try {
      const answer = await this.aiService.askRulesQuestion(this.characterSummary(), question);
      this.chatHistory.update((history) => [...history, { role: 'assistant', content: answer }]);
    } catch {
      // L'errore è già esposto tramite aiService.error().
    }
  }

  private buildCharacterSummary(): string {
    const name = this.characterService.characterName() || 'Senza nome';
    const race = this.characterService.selectedRace()?.name ?? 'Nessuna';
    const abilities = ABILITY_ORDER.map(
      (ability) => `${ability} ${this.characterService.finalAbilities()[ability].total}`,
    ).join(', ');
    const classes =
      this.characterService
        .classLevels()
        .map((classLevel) => `${this.className(classLevel.classId)} ${classLevel.level}`)
        .join(', ') || 'Nessuna';

    return `Nome: ${name}; Razza: ${race}; Caratteristiche: ${abilities}; Classi: ${classes}.`;
  }

  private className(classId: string): string {
    return CLASSES.find((characterClass) => characterClass.id === classId)?.name ?? classId;
  }
}
