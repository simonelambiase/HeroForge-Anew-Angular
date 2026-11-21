import { TestBed } from '@angular/core/testing';

import { CharacterService } from './character.service';
import { RACES } from '../models/race.model';

describe('CharacterService', () => {
  let service: CharacterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CharacterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start with all abilities at 10', () => {
    expect(service.abilities()).toEqual({
      STR: 10,
      DEX: 10,
      CON: 10,
      INT: 10,
      WIS: 10,
      CHA: 10,
    });
  });

  it('should calculate ability modifiers with Math.floor((score - 10) / 2)', () => {
    service.setAbility('STR', 14);
    service.setAbility('DEX', 9);

    expect(service.abilityModifiers().STR.modifier).toBe(2);
    expect(service.abilityModifiers().DEX.modifier).toBe(-1);
  });

  it('should apply racial modifiers to final abilities', () => {
    const elf = RACES.find((race) => race.id === 'elf');
    expect(elf).toBeTruthy();

    service.setAbility('DEX', 12);
    service.setAbility('CON', 12);
    service.selectRace(elf!);

    expect(service.finalAbilities().DEX.total).toBe(14);
    expect(service.finalAbilities().CON.total).toBe(10);
    expect(service.abilityModifiers().DEX.modifier).toBe(2);
  });

  it('should compute base attack bonus per class progression', () => {
    service.addClass('fighter');
    expect(service.baseAttackBonus()).toBe(1);

    service.addClass('wizard');
    expect(service.baseAttackBonus()).toBe(1);

    service.setClassLevel('fighter', 2);
    expect(service.baseAttackBonus()).toBe(2);

    service.removeClass('fighter');
    service.removeClass('wizard');
    service.addClass('rogue');
    service.setClassLevel('rogue', 3);
    expect(service.baseAttackBonus()).toBe(2);
  });

  it('should compute base saving throws', () => {
    service.addClass('fighter');
    expect(service.baseSavingThrows()).toEqual({ fortitude: 2, reflex: 0, will: 0 });

    service.addClass('wizard');
    expect(service.baseSavingThrows()).toEqual({ fortitude: 2, reflex: 0, will: 2 });
  });

  it('should compute total saving throws with ability modifiers', () => {
    service.setAbility('CON', 14);
    service.setAbility('DEX', 12);
    service.setAbility('WIS', 8);

    service.addClass('fighter');

    expect(service.savingThrows().fortitude).toBe(4);
    expect(service.savingThrows().reflex).toBe(1);
    expect(service.savingThrows().will).toBe(-1);
  });

  it('should compute armor class as 10 + DEX mod + size modifier', () => {
    service.setAbility('DEX', 14);
    expect(service.armorClass()).toBe(12);

    const gnome = RACES.find((race) => race.id === 'gnome');
    service.selectRace(gnome!);
    expect(service.armorClass()).toBe(13);
  });

  it('should compute hit points from hit dice and CON modifier', () => {
    service.setAbility('CON', 12);

    service.addClass('fighter');
    expect(service.totalHitPoints()).toBe(11);

    service.setClassLevel('fighter', 2);
    expect(service.totalHitPoints()).toBe(17);
  });
});
