import { TestBed } from '@angular/core/testing';

import { ClassStepComponent } from './class-step.component';
import { CharacterService } from '../../../../core/services/character.service';
import { CLASSES } from '../../../../core/models/class.model';

describe('ClassStepComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassStepComponent],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ClassStepComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render all classes by default', () => {
    const fixture = TestBed.createComponent(ClassStepComponent);
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelectorAll('app-selector-card').length).toBe(CLASSES.length);
  });

  it('should switch between class categories', () => {
    const fixture = TestBed.createComponent(ClassStepComponent);
    fixture.detectChanges();

    fixture.componentInstance.selectCategory('prestige');
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    const prestigeCount = CLASSES.filter(
      (characterClass) => characterClass.category === 'prestige',
    ).length;
    expect(element.querySelectorAll('app-selector-card').length).toBe(prestigeCount);
  });

  it('should show all classes when the All filter is selected', () => {
    const fixture = TestBed.createComponent(ClassStepComponent);
    fixture.detectChanges();

    fixture.componentInstance.selectCategory('prestige');
    fixture.detectChanges();
    fixture.componentInstance.selectCategory('all');
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelectorAll('app-selector-card').length).toBe(CLASSES.length);
  });

  it('should render assigned class levels', () => {
    const service = TestBed.inject(CharacterService);
    service.addClass('fighter');
    service.setClassLevel('fighter', 2);

    const fixture = TestBed.createComponent(ClassStepComponent);
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.textContent).toContain('Guerriero');
    expect(element.textContent).toContain('Livello 2');
  });

  it('should show options for classes with customization', () => {
    const service = TestBed.inject(CharacterService);
    service.addClass('cleric');

    const fixture = TestBed.createComponent(ClassStepComponent);
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.textContent).toContain('Opzioni e Specializzazioni di Classe');
    expect(element.textContent).toContain('Divinità');
  });

  it('should not show options section without customizable classes', () => {
    const service = TestBed.inject(CharacterService);
    service.addClass('fighter');

    const fixture = TestBed.createComponent(ClassStepComponent);
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.textContent).not.toContain('Opzioni e Specializzazioni di Classe');
  });

  it('should cap selected domains at two', () => {
    const service = TestBed.inject(CharacterService);
    service.addClass('cleric');

    const fixture = TestBed.createComponent(ClassStepComponent);
    fixture.componentInstance.toggleDomain('sun');
    fixture.componentInstance.toggleDomain('healing');
    fixture.componentInstance.toggleDomain('knowledge');

    expect(service.classOptions().cleric.domains).toEqual(['sun', 'healing']);
  });

  it('should prune prohibited schools when switching to generalist', () => {
    const service = TestBed.inject(CharacterService);
    service.addClass('wizard');
    service.setWizardOptions({
      specialization: 'evocation',
      prohibitedSchools: ['necromancy', 'conjuration'],
    });

    const fixture = TestBed.createComponent(ClassStepComponent);
    fixture.componentInstance.setWizardSpecialization({
      target: { value: 'generalist' },
    } as unknown as Event);

    expect(service.classOptions().wizard.specialization).toBe('generalist');
    expect(service.classOptions().wizard.prohibitedSchools).toEqual([]);
  });
});
