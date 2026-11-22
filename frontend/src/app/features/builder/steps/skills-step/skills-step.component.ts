import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';

import { CharacterService } from '../../../../core/services/character.service';
import { I18nService } from '../../../../core/services/i18n.service';
import { SKILLS, type SkillDefinition } from '../../../../core/models/skill.model';
import { formatModifier } from '../../../../core/models/ability-scores.model';
import { CardPanelComponent } from '../../../../shared/components/card-panel/card-panel.component';

@Component({
  selector: 'app-skills-step',
  standalone: true,
  imports: [CardPanelComponent],
  templateUrl: './skills-step.component.html',
  styleUrl: './skills-step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkillsStepComponent {
  readonly service = inject(CharacterService);
  readonly i18n = inject(I18nService);
  readonly skills = SKILLS;
  readonly searchQuery = signal('');

  readonly filteredSkills = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();
    if (!query) {
      return this.skills;
    }

    return this.skills.filter(
      (skill) =>
        this.i18n.getSkillName(skill.id).toLowerCase().includes(query) ||
        skill.id.toLowerCase().includes(query),
    );
  });

  updateSearchQuery(event: Event): void {
    this.searchQuery.set((event.target as HTMLInputElement).value);
  }

  rankFor(skillId: string): number {
    return this.service.skillRanks()[skillId] ?? 0;
  }

  isClassSkill(skillId: string): boolean {
    return this.service.isClassSkill(skillId);
  }

  rankCost(skillId: string): number {
    return this.isClassSkill(skillId) ? 1 : 2;
  }

  totalFor(skill: SkillDefinition): number {
    return this.service.totalSkills().find((total) => total.skill.id === skill.id)?.total ?? 0;
  }

  keyAbilityModifier(skill: SkillDefinition): string {
    return formatModifier(this.service.abilityModifiers()[skill.keyAbility].modifier);
  }

  canIncrement(skillId: string): boolean {
    const rank = this.rankFor(skillId);
    if (rank >= this.service.maxRanksFor(skillId)) {
      return false;
    }

    return this.service.remainingSkillPoints() >= this.rankCost(skillId);
  }

  canDecrement(skillId: string): boolean {
    return this.rankFor(skillId) > 0;
  }

  increment(skillId: string): void {
    if (!this.canIncrement(skillId)) {
      return;
    }

    this.service.setSkillRank(skillId, this.rankFor(skillId) + 1);
  }

  decrement(skillId: string): void {
    if (!this.canDecrement(skillId)) {
      return;
    }

    this.service.setSkillRank(skillId, this.rankFor(skillId) - 1);
  }
}
