import { computed, Injectable, signal } from '@angular/core';

import {
  DEFAULT_OPENROUTER_MODEL,
  findOpenRouterModel,
  OPENROUTER_MODELS,
  type OpenRouterModel,
} from '../models/openrouter.model';

const API_KEY_STORAGE_KEY = 'hakrom_openrouter_api_key';
const MODEL_STORAGE_KEY = 'hakrom_openrouter_model';
const API_URL = 'https://openrouter.ai/api/v1/chat/completions';

interface OpenRouterMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OpenRouterChatResponse {
  choices?: { message?: { content?: string } }[];
}

interface OpenRouterErrorResponse {
  error?: { message?: string } | string;
  message?: string;
}

@Injectable({ providedIn: 'root' })
export class OpenRouterService {
  private readonly _apiKey = signal('');
  private readonly _selectedModel = signal<OpenRouterModel>(DEFAULT_OPENROUTER_MODEL);
  private readonly _isLoading = signal(false);
  private readonly _error = signal<string | null>(null);

  readonly apiKey = this._apiKey.asReadonly();
  readonly selectedModel = this._selectedModel.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly models = OPENROUTER_MODELS;
  readonly isConfigured = computed(() => this._apiKey().trim().length > 0);

  constructor() {
    this.restoreFromStorage();
  }

  setApiKey(apiKey: string): void {
    this._apiKey.set(apiKey.trim());
    this.persist(API_KEY_STORAGE_KEY, this._apiKey());
    this._error.set(null);
  }

  clearApiKey(): void {
    this._apiKey.set('');
    this.remove(API_KEY_STORAGE_KEY);
    this._error.set(null);
  }

  setSelectedModel(modelId: string): void {
    this._selectedModel.set(findOpenRouterModel(modelId));
    this.persist(MODEL_STORAGE_KEY, this._selectedModel().id);
  }

  ping(): Promise<string> {
    return this.chat('Rispondi esattamente con la parola "OK".');
  }

  getBuildAdvice(characterSummary: string, conceptQuery: string): Promise<string> {
    const systemPrompt = [
      'Sei un consulente di build per Dungeons & Dragons 3.5.',
      'Rispondi in italiano con consigli concreti su talenti, progressione dei livelli e classi di prestigio.',
      '',
      `Personaggio attuale:\n${characterSummary}`,
    ].join('\n');

    const userPrompt = conceptQuery.trim() || 'Suggerisci la migliore progressione per questo personaggio.';
    return this.chat(userPrompt, systemPrompt);
  }

  generateLore(characterSummary: string): Promise<string> {
    const systemPrompt = [
      'Sei un narratore esperto di Dungeons & Dragons 3.5.',
      'Genera in italiano un background narrativo, agganci di trama e tratti di personalità coerenti con le regole del gioco.',
    ].join('\n');

    return this.chat(`Genera la lore per questo personaggio:\n${characterSummary}`, systemPrompt);
  }

  askRulesQuestion(characterSummary: string, question: string): Promise<string> {
    const systemPrompt = [
      "Sei l'arbitro delle regole di Dungeons & Dragons 3.5.",
      'Rispondi in italiano citando le regole quando possibile.',
      '',
      `Personaggio attuale:\n${characterSummary}`,
    ].join('\n');

    return this.chat(question, systemPrompt);
  }

  async chat(prompt: string, systemPrompt?: string): Promise<string> {
    const apiKey = this._apiKey().trim();
    if (!apiKey) {
      const message = 'API key OpenRouter non configurata.';
      this._error.set(message);
      throw new Error(message);
    }

    this._isLoading.set(true);
    this._error.set(null);

    try {
      const messages: OpenRouterMessage[] = [];
      if (systemPrompt) {
        messages.push({ role: 'system', content: systemPrompt });
      }
      messages.push({ role: 'user', content: prompt });

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
          'HTTP-Referer': 'https://hakrom.simonelambiase.it',
          'X-Title': 'Hakrom D&D 3.5 Builder',
        },
        body: JSON.stringify({
          model: this._selectedModel().id,
          messages,
        }),
      });

      if (!response.ok) {
        const message = await this.extractErrorMessage(response);
        const fullMessage = `Errore OpenRouter (${response.status}): ${message}`;
        this._error.set(fullMessage);
        throw new Error(fullMessage);
      }

      const data = (await response.json()) as OpenRouterChatResponse;
      const content = data.choices?.[0]?.message?.content?.trim() ?? '';

      if (!content) {
        const message = 'OpenRouter ha restituito una risposta vuota.';
        this._error.set(message);
        throw new Error(message);
      }

      return content;
    } catch (error) {
      if (error instanceof Error && !this._error()) {
        this._error.set(error.message);
      }
      throw error;
    } finally {
      this._isLoading.set(false);
    }
  }

  private restoreFromStorage(): void {
    this._apiKey.set(this.read(API_KEY_STORAGE_KEY));
    this._selectedModel.set(findOpenRouterModel(this.read(MODEL_STORAGE_KEY)));
  }

  private async extractErrorMessage(response: Response): Promise<string> {
    try {
      const data = (await response.json()) as OpenRouterErrorResponse;
      if (typeof data?.error === 'string') {
        return data.error;
      }
      if (data?.error?.message) {
        return data.error.message;
      }
      if (data?.message) {
        return data.message;
      }
      return 'Risposta non valida';
    } catch {
      return response.statusText || 'Errore sconosciuto';
    }
  }

  private read(key: string): string {
    try {
      return this.storage()?.getItem(key) ?? '';
    } catch {
      return '';
    }
  }

  private persist(key: string, value: string): void {
    try {
      this.storage()?.setItem(key, value);
    } catch {
      // La persistenza è un miglioramento, non un requisito bloccante.
    }
  }

  private remove(key: string): void {
    try {
      this.storage()?.removeItem(key);
    } catch {
      // Ignora errori di storage non disponibile.
    }
  }

  private storage(): Storage | null {
    try {
      return typeof window !== 'undefined' ? window.localStorage : null;
    } catch {
      return null;
    }
  }
}
