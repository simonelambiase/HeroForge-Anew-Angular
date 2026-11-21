import { TestBed } from '@angular/core/testing';

import { EquipmentStepComponent } from './equipment-step.component';
import { CharacterService } from '../../../../core/services/character.service';
import { WEAPONS, ARMOR } from '../../../../core/models/equipment.model';

describe('EquipmentStepComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EquipmentStepComponent],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(EquipmentStepComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render all weapons and armor', () => {
    const fixture = TestBed.createComponent(EquipmentStepComponent);
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelectorAll('app-selector-card').length).toBe(WEAPONS.length + ARMOR.length);
  });

  it('should toggle a weapon', () => {
    const service = TestBed.inject(CharacterService);
    const fixture = TestBed.createComponent(EquipmentStepComponent);
    const component = fixture.componentInstance;
    const weapon = WEAPONS[0];

    component.toggleWeapon(weapon);
    expect(service.equippedWeapons()).toContain(weapon);

    component.toggleWeapon(weapon);
    expect(service.equippedWeapons()).not.toContain(weapon);
  });

  it('should toggle armor and update armor class', () => {
    const service = TestBed.inject(CharacterService);
    const fixture = TestBed.createComponent(EquipmentStepComponent);
    const component = fixture.componentInstance;
    const armor = ARMOR.find((candidate) => candidate.id === 'full-plate')!;

    component.toggleArmor(armor);
    expect(service.equippedArmor()?.id).toBe('full-plate');
    expect(service.armorClass()).toBe(18);

    component.toggleArmor(armor);
    expect(service.equippedArmor()).toBeNull();
  });
});
