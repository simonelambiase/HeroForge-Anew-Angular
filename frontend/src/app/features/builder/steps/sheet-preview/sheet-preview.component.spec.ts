import { TestBed } from '@angular/core/testing';

import { SheetPreviewComponent } from './sheet-preview.component';
import { CharacterService } from '../../../../core/services/character.service';
import { RACES, type Race } from '../../../../core/models/race.model';

describe('SheetPreviewComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SheetPreviewComponent],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(SheetPreviewComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should export character data as JSON', () => {
    const service = TestBed.inject(CharacterService);
    service.setCharacterName('Erevan');
    service.setAbility('STR', 16);
    service.selectRace(RACES.find((race) => race.id === 'elf')!);
    service.addClass('fighter');

    const fixture = TestBed.createComponent(SheetPreviewComponent);
    const json = fixture.componentInstance.toJson();

    expect(json.name).toBe('Erevan');
    expect(json.baseAbilities.STR).toBe(16);
    expect((json.race as Race).id).toBe('elf');
    expect(json.classLevels).toEqual([{ classId: 'fighter', level: 1 }]);
  });

  it('should render derived stats', () => {
    const service = TestBed.inject(CharacterService);
    service.addClass('fighter');

    const fixture = TestBed.createComponent(SheetPreviewComponent);
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.textContent).toContain('Guerriero');
  });
});
