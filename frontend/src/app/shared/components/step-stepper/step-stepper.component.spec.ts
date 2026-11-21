import { TestBed } from '@angular/core/testing';

import { StepStepperComponent } from './step-stepper.component';

describe('StepStepperComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepStepperComponent],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(StepStepperComponent);
    fixture.componentRef.setInput('steps', ['Abilità', 'Razza', 'Classe']);
    fixture.componentRef.setInput('currentStep', 0);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render all steps', () => {
    const fixture = TestBed.createComponent(StepStepperComponent);
    fixture.componentRef.setInput('steps', ['Abilità', 'Razza', 'Classe']);
    fixture.componentRef.setInput('currentStep', 0);
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelectorAll('.stepper-step').length).toBe(3);
  });

  it('should navigate via goTo', () => {
    const fixture = TestBed.createComponent(StepStepperComponent);
    const component = fixture.componentInstance;
    fixture.componentRef.setInput('steps', ['Abilità', 'Razza', 'Classe']);
    fixture.componentRef.setInput('currentStep', 0);

    component.goTo(2);
    expect(component.currentStep()).toBe(2);
  });
});
