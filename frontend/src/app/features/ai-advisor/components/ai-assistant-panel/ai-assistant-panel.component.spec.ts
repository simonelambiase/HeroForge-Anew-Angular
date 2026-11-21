import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { AiAssistantPanelComponent } from './ai-assistant-panel.component';
import { CharacterService } from '../../../../core/services/character.service';
import { OpenRouterService } from '../../../../core/services/openrouter.service';

describe('AiAssistantPanelComponent', () => {
  beforeEach(async () => {
    window.localStorage.clear();
    vi.unstubAllGlobals();

    await TestBed.configureTestingModule({
      imports: [AiAssistantPanelComponent],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(AiAssistantPanelComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should not render when closed', () => {
    const fixture = TestBed.createComponent(AiAssistantPanelComponent);
    fixture.detectChanges();

    expect((fixture.nativeElement as HTMLElement).querySelector('.ai-drawer')).toBeNull();
  });

  it('should render the drawer when open', () => {
    const fixture = TestBed.createComponent(AiAssistantPanelComponent);
    fixture.componentInstance.open.set(true);
    fixture.detectChanges();

    expect((fixture.nativeElement as HTMLElement).querySelector('.ai-drawer')).toBeTruthy();
  });

  it('should show settings when not configured', () => {
    const fixture = TestBed.createComponent(AiAssistantPanelComponent);
    fixture.componentInstance.open.set(true);
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('app-ai-settings')).toBeTruthy();
    expect(element.querySelectorAll('.tab').length).toBe(0);
  });

  it('should show tabs when configured', () => {
    const aiService = TestBed.inject(OpenRouterService);
    aiService.setApiKey('test-key');

    const fixture = TestBed.createComponent(AiAssistantPanelComponent);
    fixture.componentInstance.open.set(true);
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelectorAll('.tab').length).toBe(3);
    expect(element.querySelector('app-ai-settings')).toBeNull();
  });

  it('should change active tab', () => {
    const aiService = TestBed.inject(OpenRouterService);
    aiService.setApiKey('test-key');

    const fixture = TestBed.createComponent(AiAssistantPanelComponent);
    fixture.componentInstance.open.set(true);
    fixture.componentInstance.selectTab('lore');
    fixture.detectChanges();

    expect(fixture.componentInstance.activeTab()).toBe('lore');
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Genera lore');
  });

  it('should close', () => {
    const fixture = TestBed.createComponent(AiAssistantPanelComponent);
    fixture.componentInstance.open.set(true);
    fixture.componentInstance.close();

    expect(fixture.componentInstance.open()).toBe(false);
  });

  it('should build a character summary from the current sheet', () => {
    const characterService = TestBed.inject(CharacterService);
    characterService.setCharacterName('Erevan');
    characterService.setAbility('STR', 16);
    characterService.addClass('fighter');

    const fixture = TestBed.createComponent(AiAssistantPanelComponent);
    const summary = fixture.componentInstance.characterSummary();

    expect(summary).toContain('Nome: Erevan');
    expect(summary).toContain('STR 16');
    expect(summary).toContain('Guerriero 1');
  });

  it('should append user and assistant entries when asking a question', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ choices: [{ message: { content: 'Risposta arbitro' } }] }),
    });
    vi.stubGlobal('fetch', fetchMock);

    const aiService = TestBed.inject(OpenRouterService);
    aiService.setApiKey('test-key');

    const fixture = TestBed.createComponent(AiAssistantPanelComponent);
    const component = fixture.componentInstance;
    component.question.set('Come funziona il BAB?');

    await component.askQuestion();

    expect(component.chatHistory()).toEqual([
      { role: 'user', content: 'Come funziona il BAB?' },
      { role: 'assistant', content: 'Risposta arbitro' },
    ]);
  });
});
