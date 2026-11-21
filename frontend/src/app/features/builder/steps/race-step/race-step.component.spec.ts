import { TestBed } from '@angular/core/testing';

import { RaceStepComponent } from './race-step.component';
import { CharacterService } from '../../../../core/services/character.service';
import { RACES } from '../../../../core/models/race.model';

describe('RaceStepComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RaceStepComponent],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(RaceStepComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render all races', () => {
    const fixture = TestBed.createComponent(RaceStepComponent);
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelectorAll('app-selector-card').length).toBe(RACES.length);
  });

  it('should mark the selected race', () => {
    const service = TestBed.inject(CharacterService);
    service.selectRace(RACES.find((race) => race.id === 'elf')!);

    const fixture = TestBed.createComponent(RaceStepComponent);
    fixture.detectChanges();

    const selected = (fixture.nativeElement as HTMLElement).querySelector('.selector-card.selected');
    expect(selected?.textContent).toContain('Elfo');
  });
});
