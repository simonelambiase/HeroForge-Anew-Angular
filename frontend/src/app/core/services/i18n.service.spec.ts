import { TestBed } from '@angular/core/testing';

import { I18nService, DEFAULT_LANGUAGE } from './i18n.service';

describe('I18nService', () => {
  let service: I18nService;

  beforeEach(() => {
    window.localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(I18nService);
  });

  it('should default to italian', () => {
    expect(service.currentLang()).toBe('it');
    expect(service.currentLang()).toBe(DEFAULT_LANGUAGE);
  });

  it('should resolve a nested italian key', () => {
    expect(service.t('shell.title')).toBe('HeroForge Anew Angular');
    expect(service.t('stepper.abilities')).toBe('Caratteristiche');
    expect(service.t('badges.ac')).toBe('CA');
  });

  it('should switch to english and resolve keys', () => {
    service.setLanguage('en');

    expect(service.currentLang()).toBe('en');
    expect(service.t('stepper.abilities')).toBe('Abilities');
    expect(service.t('badges.ac')).toBe('AC');
    expect(service.t('abilities.full.STR')).toBe('Strength');
  });

  it('should persist the selected language to localStorage', () => {
    service.setLanguage('en');
    expect(window.localStorage.getItem('heroforge-anew-angular.language')).toBe('en');

    service.setLanguage('it');
    expect(window.localStorage.getItem('heroforge-anew-angular.language')).toBe('it');
  });

  it('should restore the language from localStorage on creation', () => {
    window.localStorage.setItem('heroforge-anew-angular.language', 'en');

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    const restored = TestBed.inject(I18nService);

    expect(restored.currentLang()).toBe('en');
  });

  it('should interpolate parameters', () => {
    expect(service.t('feats.count', { selected: 2, available: 4 })).toBe('2 / 4 talenti');

    service.setLanguage('en');
    expect(service.t('feats.count', { selected: 2, available: 4 })).toBe('2 / 4 feats');
  });

  it('should return the key itself for an unknown key', () => {
    expect(service.t('unknown.key')).toBe('unknown.key');
  });
});
