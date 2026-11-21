import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { OpenRouterService } from './openrouter.service';
import { DEFAULT_OPENROUTER_MODEL } from '../models/openrouter.model';

function mockFetchResponse(content: string): {
  ok: boolean;
  status: number;
  json: () => Promise<{ choices: { message: { content: string } }[] }>;
} {
  return {
    ok: true,
    status: 200,
    json: async () => ({ choices: [{ message: { content } }] }),
  };
}

interface MockRequestInit {
  method: string;
  headers: Record<string, string>;
  body: string;
}

describe('OpenRouterService', () => {
  let service: OpenRouterService;

  beforeEach(() => {
    window.localStorage.clear();
    vi.unstubAllGlobals();
    TestBed.configureTestingModule({});
    service = TestBed.inject(OpenRouterService);
  });

  it('should be created and not configured by default', () => {
    expect(service).toBeTruthy();
    expect(service.isConfigured()).toBe(false);
    expect(service.apiKey()).toBe('');
    expect(service.selectedModel().id).toBe(DEFAULT_OPENROUTER_MODEL.id);
  });

  it('should set and persist the api key', () => {
    service.setApiKey('  test-key  ');
    expect(service.apiKey()).toBe('test-key');
    expect(service.isConfigured()).toBe(true);
    expect(window.localStorage.getItem('heroforge-anew-angular_openrouter_api_key')).toBe('test-key');
  });

  it('should clear the api key', () => {
    service.setApiKey('test-key');
    service.clearApiKey();
    expect(service.apiKey()).toBe('');
    expect(service.isConfigured()).toBe(false);
    expect(window.localStorage.getItem('heroforge-anew-angular_openrouter_api_key')).toBeNull();
  });

  it('should set and persist the selected model', () => {
    service.setSelectedModel('openai/gpt-4o-mini');
    expect(service.selectedModel().id).toBe('openai/gpt-4o-mini');
    expect(window.localStorage.getItem('heroforge-anew-angular_openrouter_model')).toBe('openai/gpt-4o-mini');
  });

  it('should fall back to the default model for an unknown id', () => {
    service.setSelectedModel('unknown/model');
    expect(service.selectedModel().id).toBe(DEFAULT_OPENROUTER_MODEL.id);
  });

  it('should restore persisted config on construction', () => {
    window.localStorage.setItem('heroforge-anew-angular_openrouter_api_key', 'persisted-key');
    window.localStorage.setItem('heroforge-anew-angular_openrouter_model', 'meta-llama/llama-3.3-70b-instruct');

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    const restored = TestBed.inject(OpenRouterService);
    expect(restored.apiKey()).toBe('persisted-key');
    expect(restored.selectedModel().id).toBe('meta-llama/llama-3.3-70b-instruct');
  });

  it('should throw when chat is called without an api key', async () => {
    await expect(service.chat('ciao')).rejects.toThrow('API key OpenRouter non configurata.');
    expect(service.error()).toContain('non configurata');
  });

  it('should call OpenRouter and return the assistant content', async () => {
    const fetchMock = vi.fn().mockResolvedValue(mockFetchResponse("  Risposta dell'assistente  "));
    vi.stubGlobal('fetch', fetchMock);

    service.setApiKey('test-key');
    service.setSelectedModel('openai/gpt-4o-mini');

    const result = await service.chat('Domanda');

    expect(result).toBe("Risposta dell'assistente");
    expect(fetchMock).toHaveBeenCalledTimes(1);

    const [url, init] = fetchMock.mock.calls[0] as [string, MockRequestInit];
    expect(url).toBe('https://openrouter.ai/api/v1/chat/completions');
    expect(init.method).toBe('POST');
    expect(init.headers['Authorization']).toBe('Bearer test-key');
    expect(init.headers['HTTP-Referer']).toBe('https://github.com/simonelambiase/HeroForge-Anew-Angular');
    expect(init.headers['X-Title']).toBe('HeroForge Anew Angular D&D 3.5 Builder');
    expect(JSON.parse(init.body).model).toBe('openai/gpt-4o-mini');
  });

  it('should set the error for a non-ok response', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      json: async () => ({ error: { message: 'Unauthorized' } }),
    });
    vi.stubGlobal('fetch', fetchMock);

    service.setApiKey('bad-key');
    await expect(service.chat('Domanda')).rejects.toThrow('Errore OpenRouter (401): Unauthorized');
    expect(service.error()).toContain('Unauthorized');
  });

  it('should expose specialized D&D 3.5 helpers', async () => {
    const fetchMock = vi.fn().mockResolvedValue(mockFetchResponse('Consiglio'));
    vi.stubGlobal('fetch', fetchMock);
    service.setApiKey('test-key');

    await expect(service.getBuildAdvice('Scheda', 'Come proseguo?')).resolves.toBe('Consiglio');
    await expect(service.generateLore('Scheda')).resolves.toBe('Consiglio');
    await expect(service.askRulesQuestion('Scheda', 'Come funziona X?')).resolves.toBe('Consiglio');
  });
});
