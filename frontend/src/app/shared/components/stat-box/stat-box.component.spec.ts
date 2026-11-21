import { TestBed } from '@angular/core/testing';

import { StatBoxComponent } from './stat-box.component';

describe('StatBoxComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatBoxComponent],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(StatBoxComponent);
    const component = fixture.componentInstance;
    fixture.componentRef.setInput('name', 'STR');
    fixture.componentRef.setInput('label', 'Forza');
    component.score.set(10);
    expect(component).toBeTruthy();
  });

  it('should compute total score and modifier', () => {
    const fixture = TestBed.createComponent(StatBoxComponent);
    const component = fixture.componentInstance;
    fixture.componentRef.setInput('name', 'STR');
    fixture.componentRef.setInput('label', 'Forza');
    fixture.componentRef.setInput('racialBonus', 2);
    component.score.set(14);
    fixture.detectChanges();

    expect(component.total()).toBe(16);
    expect(component.modifier()).toBe(3);
    expect(component.modifierLabel()).toBe('+3');
  });

  it('should clamp increments and decrements', () => {
    const fixture = TestBed.createComponent(StatBoxComponent);
    const component = fixture.componentInstance;
    fixture.componentRef.setInput('name', 'STR');
    fixture.componentRef.setInput('label', 'Forza');
    fixture.componentRef.setInput('min', 8);
    fixture.componentRef.setInput('max', 18);

    component.score.set(18);
    component.increment();
    expect(component.score()).toBe(18);

    component.score.set(8);
    component.decrement();
    expect(component.score()).toBe(8);
  });

  it('should respect canIncrement and canDecrement', () => {
    const fixture = TestBed.createComponent(StatBoxComponent);
    const component = fixture.componentInstance;
    fixture.componentRef.setInput('name', 'STR');
    fixture.componentRef.setInput('label', 'Forza');
    fixture.componentRef.setInput('canIncrement', false);
    fixture.componentRef.setInput('canDecrement', false);

    component.score.set(10);
    component.increment();
    component.decrement();
    expect(component.score()).toBe(10);
  });
});
