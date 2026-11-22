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

  it('should resolve game content helpers in italian', () => {
    expect(service.getClassName('fighter')).toBe('Guerriero');
    expect(service.getClassCategoryName('core')).toBe('Base PHB');
    expect(service.getSkillName('appraise')).toBe('Valutare');
    expect(service.getSkillDescription('appraise')).toBe('Determinare il valore di un oggetto.');
    expect(service.getRaceName('elf')).toBe('Elfo');
    expect(service.getRaceTypeName('Umanoide')).toBe('Umanoide');
    expect(service.getSizeName('Medium')).toBe('Media');
    expect(service.getFeatName('power-attack')).toBe('Attacco Poderoso');
    expect(service.getFeatBenefit('toughness')).toBe('+3 punti ferita.');
    expect(service.getFeatTypeName('combat')).toBe('Combattimento');
    expect(service.getWeaponName('longsword')).toBe('Spada lunga');
    expect(service.getWeaponCategoryName('martial')).toBe('Marziali');
    expect(service.getArmorName('full-plate')).toBe('Armatura a piastre completa');
    expect(service.getArmorTypeName('heavy')).toBe('Pesante');
    expect(service.getLoadCategoryName('Leggero')).toBe('Leggero');
  });

  it('should resolve game content helpers in english', () => {
    service.setLanguage('en');

    expect(service.getClassName('fighter')).toBe('Fighter');
    expect(service.getClassCategoryName('core')).toBe('Core PHB');
    expect(service.getSkillName('appraise')).toBe('Appraise');
    expect(service.getSkillDescription('appraise')).toBe('Determine the value of an object.');
    expect(service.getRaceName('elf')).toBe('Elf');
    expect(service.getRaceTypeName('Umanoide')).toBe('Humanoid');
    expect(service.getSizeName('Medium')).toBe('Medium');
    expect(service.getFeatName('power-attack')).toBe('Power Attack');
    expect(service.getFeatBenefit('toughness')).toBe('+3 hit points.');
    expect(service.getFeatTypeName('combat')).toBe('Combat');
    expect(service.getWeaponName('longsword')).toBe('Longsword');
    expect(service.getWeaponCategoryName('martial')).toBe('Martial');
    expect(service.getArmorName('full-plate')).toBe('Full Plate');
    expect(service.getArmorTypeName('heavy')).toBe('Heavy');
    expect(service.getLoadCategoryName('Leggero')).toBe('Light');
  });
});
