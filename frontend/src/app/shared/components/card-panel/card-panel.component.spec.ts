import { TestBed } from '@angular/core/testing';

import { CardPanelComponent } from './card-panel.component';

describe('CardPanelComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardPanelComponent],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(CardPanelComponent);
    fixture.componentRef.setInput('title', 'Pannello');
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(CardPanelComponent);
    fixture.componentRef.setInput('title', 'Pannello');
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('.card-title')?.textContent).toContain('Pannello');
  });

  it('should toggle collapsed state', () => {
    const fixture = TestBed.createComponent(CardPanelComponent);
    const component = fixture.componentInstance;
    fixture.componentRef.setInput('title', 'Pannello');

    expect(component.collapsed()).toBe(false);
    component.toggle();
    expect(component.collapsed()).toBe(true);
    component.toggle();
    expect(component.collapsed()).toBe(false);
  });
});
