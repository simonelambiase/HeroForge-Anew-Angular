import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { OpenRouterService } from '../../../../core/services/openrouter.service';

@Component({
  selector: 'app-ai-settings',
  standalone: true,
  imports: [],
  templateUrl: './ai-settings.component.html',
  styleUrl: './ai-settings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AiSettingsComponent {
  readonly service = inject(OpenRouterService);

  readonly draftApiKey = signal(this.service.apiKey());
  readonly testStatus = signal<string | null>(null);
  readonly testing = signal(false);

  saveApiKey(): void {
    this.service.setApiKey(this.draftApiKey());
    this.testStatus.set(null);
  }

  clearApiKey(): void {
    this.service.clearApiKey();
    this.draftApiKey.set('');
    this.testStatus.set(null);
  }

  onApiKeyInput(event: Event): void {
    this.draftApiKey.set((event.target as HTMLInputElement).value);
  }

  onModelChange(event: Event): void {
    this.service.setSelectedModel((event.target as HTMLSelectElement).value);
  }

  async testConnection(): Promise<void> {
    this.testing.set(true);
    this.testStatus.set(null);

    try {
      const response = await this.service.ping();
      this.testStatus.set(`Connessione riuscita: ${response}`);
    } catch {
      this.testStatus.set('Test fallito. Controlla la API key.');
    } finally {
      this.testing.set(false);
    }
  }
}
