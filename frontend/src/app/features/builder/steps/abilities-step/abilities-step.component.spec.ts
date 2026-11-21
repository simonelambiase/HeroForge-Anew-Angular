import { TestBed } from '@angular/core/testing';

import { AbilitiesStepComponent } from './abilities-step.component';
import { CharacterService } from '../../../../core/services/character.service';

describe('AbilitiesStepComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AbilitiesStepComponent],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(AbilitiesStepComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render six stat boxes', () => {
    const fixture = TestBed.createComponent(AbilitiesStepComponent);
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelectorAll('app-stat-box').length).toBe(6);
  });

  it('should reflect remaining point-buy points', () => {
    const service = TestBed.inject(CharacterService);
    service.setAbility('STR', 8);
    service.setAbility('DEX', 8);
    service.setAbility('CON', 8);
    service.setAbility('INT', 8);
    service.setAbility('WIS', 8);
    service.setAbility('CHA', 8);

    const fixture = TestBed.createComponent(AbilitiesStepComponent);
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.textContent).toContain('Punti rimanenti: 25');
  });
});
