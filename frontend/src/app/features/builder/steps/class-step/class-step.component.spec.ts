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

  it('should render all classes', () => {
    const fixture = TestBed.createComponent(ClassStepComponent);
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
});
