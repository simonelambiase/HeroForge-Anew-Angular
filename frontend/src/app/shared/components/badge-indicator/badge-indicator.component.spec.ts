import { TestBed } from '@angular/core/testing';

import { BadgeIndicatorComponent } from './badge-indicator.component';

describe('BadgeIndicatorComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BadgeIndicatorComponent],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(BadgeIndicatorComponent);
    fixture.componentRef.setInput('label', 'BAB');
    fixture.componentRef.setInput('value', '+3');
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render label and value', () => {
    const fixture = TestBed.createComponent(BadgeIndicatorComponent);
    fixture.componentRef.setInput('label', 'BAB');
    fixture.componentRef.setInput('value', '+3');
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.textContent).toContain('BAB');
    expect(element.textContent).toContain('+3');
  });
});
