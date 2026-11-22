import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';

import { CharacterService } from '../../../../core/services/character.service';
import { I18nService } from '../../../../core/services/i18n.service';
import {
  ARMOR,
  WEAPONS,
  type Armor,
  type ArmorType,
  type Weapon,
  type WeaponCategory,
} from '../../../../core/models/equipment.model';
import { CardPanelComponent } from '../../../../shared/components/card-panel/card-panel.component';
import { SelectorCardComponent } from '../../../../shared/components/selector-card/selector-card.component';

type WeaponFilter = 'all' | WeaponCategory;
type ArmorFilter = 'all' | ArmorType;

@Component({
  selector: 'app-equipment-step',
  standalone: true,
  imports: [CardPanelComponent, SelectorCardComponent],
  templateUrl: './equipment-step.component.html',
  styleUrl: './equipment-step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EquipmentStepComponent {
  readonly service = inject(CharacterService);
  readonly i18n = inject(I18nService);
  readonly weapons = WEAPONS;
  readonly armors = ARMOR;

  readonly weaponFilter = signal<WeaponFilter>('all');
  readonly armorFilter = signal<ArmorFilter>('all');

  readonly weaponFilters: WeaponFilter[] = ['all', 'simple', 'martial', 'exotic'];
  readonly armorFilters: ArmorFilter[] = ['all', 'light', 'medium', 'heavy', 'shield'];

  readonly filteredWeapons = computed(() => {
    const current = this.weaponFilter();
    if (current === 'all') {
      return this.weapons;
    }

    return this.weapons.filter((weapon) => weapon.category === current);
  });

  readonly filteredArmors = computed(() => {
    const current = this.armorFilter();
    if (current === 'all') {
      return this.armors;
    }

    return this.armors.filter((armor) => armor.type === current);
  });

  readonly armorCheckPenalty = computed(() => this.service.equippedArmor()?.armorCheckPenalty ?? 0);

  isWeaponEquipped(weaponId: string): boolean {
    return this.service.equippedWeapons().some((weapon) => weapon.id === weaponId);
  }

  isArmorEquipped(armorId: string): boolean {
    return this.service.equippedArmor()?.id === armorId;
  }

  toggleWeapon(weapon: Weapon): void {
    this.service.toggleWeapon(weapon);
  }

  toggleArmor(armor: Armor): void {
    this.service.toggleArmor(armor);
  }

  weaponDescription(weapon: Weapon): string {
    const range =
      weapon.rangeIncrement > 0
        ? `${this.i18n.t('equipment.range')} ${weapon.rangeIncrement} m`
        : this.i18n.t('equipment.melee');
    return `${this.i18n.t('equipment.damage')} ${weapon.damageMedium} · ${this.i18n.t('equipment.critical')} ${weapon.critical} · ${range}`;
  }

  weaponBadges(weapon: Weapon): string[] {
    const badges = [this.i18n.getWeaponCategoryName(weapon.category)];
    if (weapon.rangeIncrement > 0) {
      badges.push(this.i18n.t('equipment.ranged'));
    }
    return badges;
  }

  armorDescription(armor: Armor): string {
    const maxDex = armor.maxDexBonus === null ? '—' : `${armor.maxDexBonus}`;
    return `${this.i18n.t('equipment.armorClass')} +${armor.armorBonus} · ${this.i18n.t('equipment.maxDex')} ${maxDex} · ${this.i18n.t('equipment.penalty')} ${armor.armorCheckPenalty} · ${this.i18n.t('equipment.weight')} ${armor.weight}`;
  }

  armorBadges(armor: Armor): string[] {
    return [
      this.i18n.getArmorTypeName(armor.type),
      `${this.i18n.t('equipment.armorClass')} +${armor.armorBonus}`,
    ];
  }
}
