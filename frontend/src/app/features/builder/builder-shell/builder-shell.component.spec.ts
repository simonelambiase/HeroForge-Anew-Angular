import { TestBed } from '@angular/core/testing';

import { BuilderShellComponent } from './builder-shell.component';

describe('BuilderShellComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuilderShellComponent],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(BuilderShellComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render header and all steps', () => {
    const fixture = TestBed.createComponent(BuilderShellComponent);
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.textContent).toContain('Hakrom');
    expect(element.querySelectorAll('.stepper-step').length).toBe(7);
  });

  it('should navigate between steps', () => {
    const fixture = TestBed.createComponent(BuilderShellComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('app-abilities-step')).toBeTruthy();

    fixture.componentInstance.next();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('app-race-step')).toBeTruthy();
  });

  it('should toggle the AI assistant panel', () => {
    const fixture = TestBed.createComponent(BuilderShellComponent);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('.ai-assistant-btn') as HTMLButtonElement;
    expect(button).toBeTruthy();

    button.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.aiPanelOpen()).toBe(true);
  });
});
