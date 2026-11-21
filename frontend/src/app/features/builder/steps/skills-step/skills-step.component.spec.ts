import { TestBed } from '@angular/core/testing';

import { SkillsStepComponent } from './skills-step.component';
import { CharacterService } from '../../../../core/services/character.service';
import { SKILLS } from '../../../../core/models/skill.model';

describe('SkillsStepComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkillsStepComponent],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(SkillsStepComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render all skills by default', () => {
    const fixture = TestBed.createComponent(SkillsStepComponent);
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelectorAll('tbody tr').length).toBe(SKILLS.length);
  });

  it('should filter skills by search query', () => {
    const fixture = TestBed.createComponent(SkillsStepComponent);
    const component = fixture.componentInstance;
    component.searchQuery.set('Equilibrio');
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelectorAll('tbody tr').length).toBe(1);
    expect(element.textContent).toContain('Equilibrio');
  });

  it('should increment and decrement a class skill rank', () => {
    const service = TestBed.inject(CharacterService);
    service.addClass('fighter');

    const fixture = TestBed.createComponent(SkillsStepComponent);
    const component = fixture.componentInstance;

    expect(component.rankFor('climb')).toBe(0);

    component.increment('climb');
    expect(service.skillRanks()['climb']).toBe(1);

    component.decrement('climb');
    expect(component.rankFor('climb')).toBe(0);
  });
});
