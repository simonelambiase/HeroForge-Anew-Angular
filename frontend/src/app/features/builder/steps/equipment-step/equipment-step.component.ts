import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';

import { CharacterService } from '../../../../core/services/character.service';
import {
  ARMOR,
  ARMOR_TYPE_LABELS,
  WEAPON_CATEGORY_LABELS,
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
  readonly weapons = WEAPONS;
  readonly armors = ARMOR;
  readonly weaponCategoryLabels = WEAPON_CATEGORY_LABELS;
  readonly armorTypeLabels = ARMOR_TYPE_LABELS;

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
    const range = weapon.rangeIncrement > 0 ? `Gittata ${weapon.rangeIncrement} m` : 'Mischia';
    return `Danno ${weapon.damageMedium} · Critico ${weapon.critical} · ${range}`;
  }

  weaponBadges(weapon: Weapon): string[] {
    const badges = [this.weaponCategoryLabels[weapon.category]];
    if (weapon.rangeIncrement > 0) {
      badges.push('A distanza');
    }
    return badges;
  }

  armorDescription(armor: Armor): string {
    const maxDex = armor.maxDexBonus === null ? '—' : `${armor.maxDexBonus}`;
    return `CA +${armor.armorBonus} · DES max ${maxDex} · Penalità ${armor.armorCheckPenalty} · Peso ${armor.weight}`;
  }

  armorBadges(armor: Armor): string[] {
    return [this.armorTypeLabels[armor.type], `CA +${armor.armorBonus}`];
  }
}
