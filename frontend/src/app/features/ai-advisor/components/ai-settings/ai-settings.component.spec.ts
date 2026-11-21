import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { AiSettingsComponent } from './ai-settings.component';
import { OpenRouterService } from '../../../../core/services/openrouter.service';

describe('AiSettingsComponent', () => {
  beforeEach(async () => {
    window.localStorage.clear();
    vi.unstubAllGlobals();

    await TestBed.configureTestingModule({
      imports: [AiSettingsComponent],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(AiSettingsComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the api key input and model select', () => {
    const fixture = TestBed.createComponent(AiSettingsComponent);
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('#openrouter-api-key')).toBeTruthy();
    expect(element.querySelector('#openrouter-model')).toBeTruthy();
    expect(element.querySelectorAll('#openrouter-model option').length).toBe(4);
  });

  it('should save the api key through the service', () => {
    const fixture = TestBed.createComponent(AiSettingsComponent);
    const component = fixture.componentInstance;
    const service = TestBed.inject(OpenRouterService);

    component.draftApiKey.set('nuova-key');
    component.saveApiKey();

    expect(service.apiKey()).toBe('nuova-key');
    expect(service.isConfigured()).toBe(true);
  });

  it('should clear the api key through the service', () => {
    const service = TestBed.inject(OpenRouterService);
    service.setApiKey('esistente');

    const fixture = TestBed.createComponent(AiSettingsComponent);
    fixture.componentInstance.clearApiKey();

    expect(service.apiKey()).toBe('');
    expect(service.isConfigured()).toBe(false);
  });

  it('should report a failed connection when no api key is configured', async () => {
    const fixture = TestBed.createComponent(AiSettingsComponent);
    const component = fixture.componentInstance;

    await component.testConnection();

    expect(component.testStatus()).toBe('Test fallito. Controlla la API key.');
    expect(component.testing()).toBe(false);
  });

  it('should report a successful connection when ping returns', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ choices: [{ message: { content: 'OK' } }] }),
    });
    vi.stubGlobal('fetch', fetchMock);

    const service = TestBed.inject(OpenRouterService);
    service.setApiKey('test-key');

    const fixture = TestBed.createComponent(AiSettingsComponent);
    const component = fixture.componentInstance;

    await component.testConnection();

    expect(component.testStatus()).toBe('Connessione riuscita: OK');
  });
});
