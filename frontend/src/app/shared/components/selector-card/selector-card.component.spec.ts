import { TestBed } from '@angular/core/testing';

import { SelectorCardComponent } from './selector-card.component';

describe('SelectorCardComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectorCardComponent],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(SelectorCardComponent);
    fixture.componentRef.setInput('title', 'Umano');
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render title, description and badges', () => {
    const fixture = TestBed.createComponent(SelectorCardComponent);
    fixture.componentRef.setInput('title', 'Umano');
    fixture.componentRef.setInput('description', 'Razza versatile');
    fixture.componentRef.setInput('badges', ['+2 FOR']);
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.textContent).toContain('Umano');
    expect(element.textContent).toContain('Razza versatile');
    expect(element.textContent).toContain('+2 FOR');
  });

  it('should select on click', () => {
    const fixture = TestBed.createComponent(SelectorCardComponent);
    const component = fixture.componentInstance;
    fixture.componentRef.setInput('title', 'Umano');

    expect(component.selected()).toBe(false);
    component.select();
    expect(component.selected()).toBe(true);
  });

  it('should not select when disabled', () => {
    const fixture = TestBed.createComponent(SelectorCardComponent);
    const component = fixture.componentInstance;
    fixture.componentRef.setInput('title', 'Umano');
    fixture.componentRef.setInput('disabled', true);

    component.select();
    expect(component.selected()).toBe(false);
  });
});
