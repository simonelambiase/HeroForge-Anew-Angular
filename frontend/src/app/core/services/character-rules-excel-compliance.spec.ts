import { TestBed } from '@angular/core/testing';

import { CharacterService } from './character.service';
import { calculatePointBuyCost } from '../models/ability-scores.model';
import {
  calculateBabForLevel,
  calculateBaseSave,
  calculateExperienceForLevel,
} from '../models/class.model';
import { ARMOR, carryingCapacityForStrength } from '../models/equipment.model';

describe('D&D 3.5 / HeroForge Anew formal compliance', () => {
  let service: CharacterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CharacterService);
  });

  describe('Point Buy', () => {
    const costs: Readonly<Record<number, number>> = {
      8: 0,
      9: 1,
      10: 2,
      11: 3,
      12: 4,
      13: 5,
      14: 6,
      15: 8,
      16: 10,
      17: 13,
      18: 16,
    };

    it('should apply the exact D&D 3.5 point buy costs', () => {
      for (const [score, cost] of Object.entries(costs)) {
        expect(calculatePointBuyCost(Number(score))).toBe(cost);
      }
    });
  });

  describe('Experience Table', () => {
    it('should follow L * (L - 1) / 2 * 1000 for levels 1-20', () => {
      for (let level = 1; level <= 20; level++) {
        expect(calculateExperienceForLevel(level)).toBe((level * (level - 1) / 2) * 1000);
      }
    });
  });

  describe('Base Attack Bonus', () => {
    it('should match the Good progression for levels 1-20', () => {
      for (let level = 1; level <= 20; level++) {
        expect(calculateBabForLevel(level, 'good')).toBe(level);
      }
    });

    it('should match the Average progression for levels 1-20', () => {
      for (let level = 1; level <= 20; level++) {
        expect(calculateBabForLevel(level, 'average')).toBe(Math.floor((level * 3) / 4));
      }
    });

    it('should match the Poor progression for levels 1-20', () => {
      for (let level = 1; level <= 20; level++) {
        expect(calculateBabForLevel(level, 'poor')).toBe(Math.floor(level / 2));
      }
    });
  });

  describe('Iterative Attacks', () => {
    it('should produce the documented attack strings', () => {
      service.addClass('fighter');
      service.setClassLevel('fighter', 5);
      expect(service.iterativeAttacks()).toBe('+5');

      service.setClassLevel('fighter', 6);
      expect(service.iterativeAttacks()).toBe('+6/+1');

      service.setClassLevel('fighter', 11);
      expect(service.iterativeAttacks()).toBe('+11/+6/+1');

      service.setClassLevel('fighter', 16);
      expect(service.iterativeAttacks()).toBe('+16/+11/+6/+1');
    });

    it('should produce four attacks at BAB 20', () => {
      service.addClass('fighter');
      service.setClassLevel('fighter', 20);
      expect(service.iterativeAttacks()).toBe('+20/+15/+10/+5');
    });

    it('should produce three attacks at BAB 15', () => {
      service.addClass('rogue');
      service.setClassLevel('rogue', 20);
      expect(service.iterativeAttacks()).toBe('+15/+10/+5');
    });

    it('should produce two attacks at BAB 10', () => {
      service.addClass('wizard');
      service.setClassLevel('wizard', 20);
      expect(service.iterativeAttacks()).toBe('+10/+5');
    });
  });

  describe('Base Saving Throws', () => {
    it('should match the Good save progression for levels 1-20', () => {
      for (let level = 1; level <= 20; level++) {
        expect(calculateBaseSave(level, 'good')).toBe(2 + Math.floor(level / 2));
      }
    });

    it('should match the Poor save progression for levels 1-20', () => {
      for (let level = 1; level <= 20; level++) {
        expect(calculateBaseSave(level, 'poor')).toBe(Math.floor(level / 3));
      }
    });

    it('should sum base saves for a Fighter 2 / Wizard 3 / Rogue 3 multiclass', () => {
      service.addClass('fighter');
      service.setClassLevel('fighter', 2);
      service.addClass('wizard');
      service.setClassLevel('wizard', 3);
      service.addClass('rogue');
      service.setClassLevel('rogue', 3);

      expect(service.baseSavingThrows()).toEqual({ fortitude: 5, reflex: 4, will: 4 });
    });
  });

  describe('Skill Synergies', () => {
    it('should stack +2 diplomacy from Bluff, Sense Motive and Knowledge (nobility)', () => {
      service.setSkillRank('bluff', 5);
      service.setSkillRank('sense-motive', 5);
      service.setSkillRank('knowledge-nobility', 5);

      const diplomacy = service.totalSkills().find((total) => total.skill.id === 'diplomacy');
      expect(diplomacy?.synergyBonus).toBe(6);
      expect(diplomacy?.total).toBe(6);
    });

    it('should grant +2 Balance and +2 Jump from 5 ranks in Tumble', () => {
      service.setSkillRank('tumble', 5);

      const balance = service.totalSkills().find((total) => total.skill.id === 'balance');
      const jump = service.totalSkills().find((total) => total.skill.id === 'jump');

      expect(balance?.synergyBonus).toBe(2);
      expect(jump?.synergyBonus).toBe(2);
    });
  });

  describe('Armor Class', () => {
    it('should compute normal, touch and flat-footed AC with armor', () => {
      service.setAbility('DEX', 14);
      service.toggleArmor(ARMOR.find((armor) => armor.id === 'full-plate')!);

      expect(service.armorClass()).toBe(19);
      expect(service.touchArmorClass()).toBe(11);
      expect(service.flatFootedArmorClass()).toBe(18);
    });

    it('should annul positive DEX on flat-footed AC', () => {
      service.setAbility('DEX', 14);

      expect(service.armorClass()).toBe(12);
      expect(service.touchArmorClass()).toBe(12);
      expect(service.flatFootedArmorClass()).toBe(10);
    });

    it('should keep negative DEX on flat-footed AC', () => {
      service.setAbility('DEX', 8);
      service.toggleArmor(ARMOR.find((armor) => armor.id === 'full-plate')!);

      expect(service.armorClass()).toBe(17);
      expect(service.touchArmorClass()).toBe(9);
      expect(service.flatFootedArmorClass()).toBe(17);
    });
  });

  describe('Carrying Capacity', () => {
    it('should match the Tables.csv values for Strength 8, 10 and 18', () => {
      expect(carryingCapacityForStrength(8)).toEqual({ light: 26, medium: 53, heavy: 80 });
      expect(carryingCapacityForStrength(10)).toEqual({ light: 33, medium: 66, heavy: 100 });
      expect(carryingCapacityForStrength(18)).toEqual({ light: 100, medium: 200, heavy: 300 });
    });

    it('should quadruple carrying capacity for every +10 above strength 20', () => {
      expect(carryingCapacityForStrength(30)).toEqual({ light: 532, medium: 1064, heavy: 1600 });
      expect(carryingCapacityForStrength(40)).toEqual({ light: 2128, medium: 4256, heavy: 6400 });
    });
  });

  describe('Hit Points', () => {
    it('should grant max HD + CON at level 1', () => {
      service.setAbility('CON', 12);
      service.addClass('fighter');

      expect(service.totalHitPoints()).toBe(11);
    });

    it('should grant average HD + CON at later levels', () => {
      service.setAbility('CON', 12);
      service.addClass('fighter');
      service.setClassLevel('fighter', 2);

      expect(service.totalHitPoints()).toBe(17);
    });
  });
});
