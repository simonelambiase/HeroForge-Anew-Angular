import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';

import { CharacterService } from '../../../../core/services/character.service';
import { ABILITY_ORDER, formatModifier, type AbilityName } from '../../../../core/models/ability-scores.model';
import {
  RACES,
  SIZE_AC_MODIFIERS,
  isCustomRace,
  type CustomRace,
  type FlyManeuverability,
  type Race,
  type Senses,
  type SizeCategory,
  type Speeds,
} from '../../../../core/models/race.model';
import { CardPanelComponent } from '../../../../shared/components/card-panel/card-panel.component';
import { SelectorCardComponent } from '../../../../shared/components/selector-card/selector-card.component';

interface CustomRaceForm {
  name: string;
  size: SizeCategory;
  type: string;
  subtype: string;
  racialHitDice: number;
  favoredClass: string;
  naturalArmor: number;
  landSpeed: number;
  burrowSpeed: number;
  climbSpeed: number;
  flySpeed: number;
  flyManeuverability: FlyManeuverability;
  swimSpeed: number;
  darkvision: number;
  lowLightVision: boolean;
  blindsense: number;
  blindsight: number;
  scent: boolean;
  otherSenses: string;
  naturalAttacks: string;
  racialTraits: string;
  strMod: number;
  dexMod: number;
  conMod: number;
  intMod: number;
  wisMod: number;
  chaMod: number;
}

type TextField = 'name' | 'type' | 'subtype' | 'favoredClass' | 'otherSenses' | 'naturalAttacks' | 'racialTraits';
type NumberField =
  | 'racialHitDice'
  | 'naturalArmor'
  | 'landSpeed'
  | 'burrowSpeed'
  | 'climbSpeed'
  | 'flySpeed'
  | 'swimSpeed'
  | 'darkvision'
  | 'blindsense'
  | 'blindsight'
  | 'strMod'
  | 'dexMod'
  | 'conMod'
  | 'intMod'
  | 'wisMod'
  | 'chaMod';
type BooleanField = 'lowLightVision' | 'scent';

const DEFAULT_CUSTOM_RACE_FORM: CustomRaceForm = {
  name: '',
  size: 'Medium',
  type: 'Umanoide',
  subtype: '',
  racialHitDice: 0,
  favoredClass: 'Qualsiasi',
  naturalArmor: 0,
  landSpeed: 30,
  burrowSpeed: 0,
  climbSpeed: 0,
  flySpeed: 0,
  flyManeuverability: 'average',
  swimSpeed: 0,
  darkvision: 0,
  lowLightVision: false,
  blindsense: 0,
  blindsight: 0,
  scent: false,
  otherSenses: '',
  naturalAttacks: '',
  racialTraits: '',
  strMod: 0,
  dexMod: 0,
  conMod: 0,
  intMod: 0,
  wisMod: 0,
  chaMod: 0,
};

@Component({
  selector: 'app-race-step',
  standalone: true,
  imports: [CardPanelComponent, SelectorCardComponent],
  templateUrl: './race-step.component.html',
  styleUrl: './race-step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RaceStepComponent {
  readonly service = inject(CharacterService);
  readonly races = RACES;
  readonly abilityOrder = ABILITY_ORDER;
  readonly sizeOptions = Object.keys(SIZE_AC_MODIFIERS) as SizeCategory[];
  readonly flyManeuverabilityOptions: FlyManeuverability[] = ['clumsy', 'poor', 'average', 'good', 'perfect'];

  readonly abilityLabels: Record<AbilityName, string> = {
    STR: 'Forza',
    DEX: 'Destrezza',
    CON: 'Costituzione',
    INT: 'Intelligenza',
    WIS: 'Saggezza',
    CHA: 'Carisma',
  };

  readonly searchTerm = signal('');
  readonly form = signal<CustomRaceForm>({ ...DEFAULT_CUSTOM_RACE_FORM });

  readonly filteredRaces = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    if (!term) {
      return this.races;
    }
    return this.races.filter((race) => race.name.toLowerCase().includes(term));
  });

  constructor() {
    const selected = this.service.selectedRace();
    if (selected && isCustomRace(selected)) {
      this.form.set(this.toForm(selected));
    }
  }

  isSelected(raceId: string): boolean {
    const selected = this.service.selectedRace();
    return selected !== null && !isCustomRace(selected) && selected.id === raceId;
  }

  selectRace(race: Race): void {
    this.service.selectRace(race);
  }

  raceDescription(race: Race): string {
    return `${race.size} · Velocità ${race.baseSpeed}m · Classe preferita: ${race.favoredClass}`;
  }

  abilityModifierBadges(race: Race): string[] {
    return ABILITY_ORDER.filter((name) => (race.abilityModifiers[name] ?? 0) !== 0).map(
      (name) => `${formatModifier(race.abilityModifiers[name] ?? 0)} ${name}`,
    );
  }

  setSearchTerm(event: Event): void {
    this.searchTerm.set(this.stringValue(event));
  }

  modifierField(ability: AbilityName): NumberField {
    switch (ability) {
      case 'STR':
        return 'strMod';
      case 'DEX':
        return 'dexMod';
      case 'CON':
        return 'conMod';
      case 'INT':
        return 'intMod';
      case 'WIS':
        return 'wisMod';
      case 'CHA':
        return 'chaMod';
    }
  }

  setText(field: TextField, event: Event): void {
    this.patch({ [field]: this.stringValue(event) } as Partial<CustomRaceForm>);
  }

  setNumber(field: NumberField, event: Event): void {
    this.patch({ [field]: this.numberValue(event) } as Partial<CustomRaceForm>);
  }

  setBoolean(field: BooleanField, event: Event): void {
    this.patch({ [field]: this.booleanValue(event) } as Partial<CustomRaceForm>);
  }

  setSize(event: Event): void {
    this.patch({ size: this.stringValue(event) as SizeCategory });
  }

  setFlyManeuverability(event: Event): void {
    this.patch({ flyManeuverability: this.stringValue(event) as FlyManeuverability });
  }

  private patch(patch: Partial<CustomRaceForm>): void {
    this.form.update((current) => ({ ...current, ...patch }));
    this.apply();
  }

  private apply(): void {
    this.service.setCustomRace(this.buildCustomRace(this.form()));
  }

  private buildCustomRace(form: CustomRaceForm): CustomRace {
    const speeds: Speeds = { land: form.landSpeed || 30 };
    if (form.burrowSpeed > 0) {
      speeds.burrow = form.burrowSpeed;
    }
    if (form.climbSpeed > 0) {
      speeds.climb = form.climbSpeed;
    }
    if (form.flySpeed > 0) {
      speeds.fly = form.flySpeed;
      speeds.flyManeuverability = form.flyManeuverability;
    }
    if (form.swimSpeed > 0) {
      speeds.swim = form.swimSpeed;
    }

    const senses: Senses = {};
    if (form.darkvision > 0) {
      senses.darkvision = form.darkvision;
    }
    if (form.lowLightVision) {
      senses.lowLightVision = true;
    }
    if (form.blindsense > 0) {
      senses.blindsense = form.blindsense;
    }
    if (form.blindsight > 0) {
      senses.blindsight = form.blindsight;
    }
    if (form.scent) {
      senses.scent = true;
    }
    if (form.otherSenses.trim()) {
      senses.other = form.otherSenses.trim();
    }

    const naturalAttacks = form.naturalAttacks
      .split(',')
      .map((attack) => attack.trim())
      .filter((attack) => attack.length > 0);

    const racialTraits = form.racialTraits
      .split('\n')
      .map((trait) => trait.trim())
      .filter((trait) => trait.length > 0);

    const abilityModifiers: Partial<Record<AbilityName, number>> = {};
    const modifiers: Record<AbilityName, number> = {
      STR: form.strMod,
      DEX: form.dexMod,
      CON: form.conMod,
      INT: form.intMod,
      WIS: form.wisMod,
      CHA: form.chaMod,
    };
    for (const name of ABILITY_ORDER) {
      if (modifiers[name] !== 0) {
        abilityModifiers[name] = modifiers[name];
      }
    }

    return {
      isCustom: true,
      name: form.name.trim() || 'Razza personalizzata',
      size: form.size,
      type: form.type.trim() || undefined,
      subtype: form.subtype.trim() || undefined,
      racialHitDice: form.racialHitDice > 0 ? form.racialHitDice : undefined,
      abilityModifiers,
      racialTraits,
      favoredClass: form.favoredClass.trim() || 'Qualsiasi',
      speeds,
      naturalArmor: form.naturalArmor,
      naturalAttacks: naturalAttacks.length > 0 ? naturalAttacks : undefined,
      senses: Object.keys(senses).length > 0 ? senses : undefined,
    };
  }

  private toForm(race: CustomRace): CustomRaceForm {
    return {
      name: race.name,
      size: race.size,
      type: race.type ?? 'Umanoide',
      subtype: race.subtype ?? '',
      racialHitDice: race.racialHitDice ?? 0,
      favoredClass: race.favoredClass,
      naturalArmor: race.naturalArmor,
      landSpeed: race.speeds.land,
      burrowSpeed: race.speeds.burrow ?? 0,
      climbSpeed: race.speeds.climb ?? 0,
      flySpeed: race.speeds.fly ?? 0,
      flyManeuverability: race.speeds.flyManeuverability ?? 'average',
      swimSpeed: race.speeds.swim ?? 0,
      darkvision: race.senses?.darkvision ?? 0,
      lowLightVision: race.senses?.lowLightVision ?? false,
      blindsense: race.senses?.blindsense ?? 0,
      blindsight: race.senses?.blindsight ?? 0,
      scent: race.senses?.scent ?? false,
      otherSenses: race.senses?.other ?? '',
      naturalAttacks: (race.naturalAttacks ?? []).join(', '),
      racialTraits: race.racialTraits.join('\n'),
      strMod: race.abilityModifiers.STR ?? 0,
      dexMod: race.abilityModifiers.DEX ?? 0,
      conMod: race.abilityModifiers.CON ?? 0,
      intMod: race.abilityModifiers.INT ?? 0,
      wisMod: race.abilityModifiers.WIS ?? 0,
      chaMod: race.abilityModifiers.CHA ?? 0,
    };
  }

  private stringValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

  private numberValue(event: Event): number {
    const value = Number((event.target as HTMLInputElement).value);
    return Number.isFinite(value) ? value : 0;
  }

  private booleanValue(event: Event): boolean {
    return (event.target as HTMLInputElement).checked;
  }
}
