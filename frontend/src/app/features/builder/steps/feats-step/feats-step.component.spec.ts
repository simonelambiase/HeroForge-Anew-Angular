import { TestBed } from '@angular/core/testing';

import { FeatsStepComponent } from './feats-step.component';
import { CharacterService } from '../../../../core/services/character.service';
import { FEATS } from '../../../../core/models/feat.model';

describe('FeatsStepComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeatsStepComponent],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(FeatsStepComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render all feats by default', () => {
    const fixture = TestBed.createComponent(FeatsStepComponent);
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelectorAll('app-selector-card').length).toBe(FEATS.length);
  });

  it('should filter feats by type', () => {
    const fixture = TestBed.createComponent(FeatsStepComponent);
    const component = fixture.componentInstance;
    component.filter.set('combat');
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    const expected = FEATS.filter((feat) => feat.type === 'combat').length;
    expect(element.querySelectorAll('app-selector-card').length).toBe(expected);
  });

  it('should toggle a feat', () => {
    const service = TestBed.inject(CharacterService);
    service.addClass('fighter');

    const fixture = TestBed.createComponent(FeatsStepComponent);
    const component = fixture.componentInstance;
    const feat = FEATS[0];

    component.toggle(feat);
    expect(service.selectedFeats()).toContain(feat.id);

    component.toggle(feat);
    expect(service.selectedFeats()).not.toContain(feat.id);
  });
});
