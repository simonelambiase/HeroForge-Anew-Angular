import type { AbilityName } from './ability-scores.model';
import type { SizeCategory } from './race.model';

export interface SkillDefinition {
  id: string;
  name: string;
  keyAbility: AbilityName;
  untrained: boolean;
  armorCheckPenalty: boolean;
  description: string;
}

export interface SkillTotal {
  skill: SkillDefinition;
  ranks: number;
  isClassSkill: boolean;
  keyAbilityModifier: number;
  sizeModifier: number;
  armorPenalty: number;
  synergyBonus: number;
  total: number;
}

export interface SynergyRule {
  source: string;
  target: string;
}

/** Sinergie D&D 3.5: 5+ gradi nella sorgente conferiscono +2 alla destinazione. */
export const SYNERGY_RULES: readonly SynergyRule[] = [
  { source: 'tumble', target: 'balance' },
  { source: 'tumble', target: 'jump' },
  { source: 'bluff', target: 'diplomacy' },
  { source: 'bluff', target: 'disguise' },
  { source: 'bluff', target: 'intimidate' },
  { source: 'bluff', target: 'sleight-of-hand' },
  { source: 'sense-motive', target: 'diplomacy' },
  { source: 'knowledge-nobility', target: 'diplomacy' },
  { source: 'knowledge-local', target: 'gather-information' },
  { source: 'jump', target: 'tumble' },
  { source: 'handle-animal', target: 'ride' },
  { source: 'survival', target: 'knowledge-nature' },
  { source: 'concentration', target: 'autohypnosis' },
];

export function skillSynergyBonus(
  skillId: string,
  ranks: Readonly<Record<string, number>>,
): number {
  let bonus = 0;

  for (const rule of SYNERGY_RULES) {
    if (rule.target === skillId && (ranks[rule.source] ?? 0) >= 5) {
      bonus += 2;
    }
  }

  return bonus;
}

const HIDE_SIZE_MODIFIERS: Readonly<Record<SizeCategory, number>> = {
  Fine: 16,
  Diminutive: 12,
  Tiny: 8,
  Small: 4,
  Medium: 0,
  Large: -4,
  Huge: -8,
  Gargantuan: -12,
  Colossal: -16,
};

const MOVE_SILENTLY_SIZE_MODIFIERS: Readonly<Record<SizeCategory, number>> = {
  Fine: 8,
  Diminutive: 6,
  Tiny: 4,
  Small: 2,
  Medium: 0,
  Large: -2,
  Huge: -4,
  Gargantuan: -6,
  Colossal: -8,
};

/** Modificatore di taglia 3.5 applicabile a Nascondersi e Muoversi Silenziosamente. */
export function skillSizeModifier(skillId: string, size: SizeCategory): number {
  switch (skillId) {
    case 'hide':
      return HIDE_SIZE_MODIFIERS[size];
    case 'move-silently':
      return MOVE_SILENTLY_SIZE_MODIFIERS[size];
    default:
      return 0;
  }
}

export const SKILLS: readonly SkillDefinition[] = [
  { id: 'appraise', name: 'Valutare', keyAbility: 'INT', untrained: true, armorCheckPenalty: false, description: 'Determinare il valore di un oggetto.' },
  { id: 'balance', name: 'Equilibrio', keyAbility: 'DEX', untrained: true, armorCheckPenalty: true, description: 'Mantenere l\'equilibrio su superfici strette o scivolose.' },
  { id: 'bluff', name: 'Raggirare', keyAbility: 'CHA', untrained: true, armorCheckPenalty: false, description: 'Ingannare, mentire o creare diversivi.' },
  { id: 'climb', name: 'Scalare', keyAbility: 'STR', untrained: true, armorCheckPenalty: true, description: 'Arrampicarsi su pareti e superfici ripide.' },
  { id: 'concentration', name: 'Concentrazione', keyAbility: 'CON', untrained: true, armorCheckPenalty: false, description: 'Mantenere la concentrazione mentre si è disturbati.' },
  { id: 'craft', name: 'Artigianato', keyAbility: 'INT', untrained: true, armorCheckPenalty: false, description: 'Creare o riparare oggetti.' },
  { id: 'decipher-script', name: 'Decifrare Scritture', keyAbility: 'INT', untrained: false, armorCheckPenalty: false, description: 'Interpretare testi antichi o cifrati.' },
  { id: 'diplomacy', name: 'Diplomazia', keyAbility: 'CHA', untrained: true, armorCheckPenalty: false, description: 'Influenzare con le buone maniere e la negoziazione.' },
  { id: 'disable-device', name: 'Disattivare Congegni', keyAbility: 'INT', untrained: false, armorCheckPenalty: false, description: 'Disinnescare trappole o sabotare meccanismi.' },
  { id: 'disguise', name: 'Camuffare', keyAbility: 'CHA', untrained: true, armorCheckPenalty: false, description: 'Cambiare il proprio aspetto.' },
  { id: 'escape-artist', name: 'Artista della Fuga', keyAbility: 'DEX', untrained: true, armorCheckPenalty: true, description: 'Liberarsi da legami o spazi angusti.' },
  { id: 'forgery', name: 'Falsificare', keyAbility: 'INT', untrained: true, armorCheckPenalty: false, description: 'Creare documenti falsi e imitare scritture.' },
  { id: 'gather-information', name: 'Raccogliere Informazioni', keyAbility: 'CHA', untrained: true, armorCheckPenalty: false, description: 'Scoprire voci e notizie tra la gente.' },
  { id: 'handle-animal', name: 'Addestrare Animali', keyAbility: 'CHA', untrained: false, armorCheckPenalty: false, description: 'Addestrare e governare gli animali.' },
  { id: 'heal', name: 'Guarire', keyAbility: 'WIS', untrained: true, armorCheckPenalty: false, description: 'Curare ferite e stabilizzare i morenti.' },
  { id: 'hide', name: 'Nascondersi', keyAbility: 'DEX', untrained: true, armorCheckPenalty: true, description: 'Nascondersi senza essere visti.' },
  { id: 'intimidate', name: 'Intimidire', keyAbility: 'CHA', untrained: true, armorCheckPenalty: false, description: 'Influenzare gli altri con la minaccia.' },
  { id: 'jump', name: 'Saltare', keyAbility: 'STR', untrained: true, armorCheckPenalty: true, description: 'Saltare in lungo o in alto.' },
  { id: 'knowledge-arcana', name: 'Conoscenze (arcano)', keyAbility: 'INT', untrained: false, armorCheckPenalty: false, description: 'Sapere di magia arcana, incantesimi e costrutti.' },
  { id: 'knowledge-architecture', name: 'Conoscenze (architettura)', keyAbility: 'INT', untrained: false, armorCheckPenalty: false, description: 'Sapere di edifici, ponti e strutture.' },
  { id: 'knowledge-dungeoneering', name: 'Conoscenze (sotterranei)', keyAbility: 'INT', untrained: false, armorCheckPenalty: false, description: 'Sapere di caverne, aberrazioni e melme.' },
  { id: 'knowledge-geography', name: 'Conoscenze (geografia)', keyAbility: 'INT', untrained: false, armorCheckPenalty: false, description: 'Sapere di terre, climi e popoli.' },
  { id: 'knowledge-history', name: 'Conoscenze (storia)', keyAbility: 'INT', untrained: false, armorCheckPenalty: false, description: 'Sapere di guerre, regni e rovine.' },
  { id: 'knowledge-local', name: 'Conoscenze (locali)', keyAbility: 'INT', untrained: false, armorCheckPenalty: false, description: 'Sapere di leggende, personalità e leggi locali.' },
  { id: 'knowledge-nature', name: 'Conoscenze (natura)', keyAbility: 'INT', untrained: false, armorCheckPenalty: false, description: 'Sapere di animali, piante e stagioni.' },
  { id: 'knowledge-nobility', name: 'Conoscenze (nobiltà)', keyAbility: 'INT', untrained: false, armorCheckPenalty: false, description: 'Sapere di araldica, casate e protocollo.' },
  { id: 'knowledge-religion', name: 'Conoscenze (religioni)', keyAbility: 'INT', untrained: false, armorCheckPenalty: false, description: 'Sapere di divinità, riti e non morti.' },
  { id: 'knowledge-planes', name: 'Conoscenze (piani)', keyAbility: 'INT', untrained: false, armorCheckPenalty: false, description: 'Sapere dei piani e delle creature extraplanari.' },
  { id: 'listen', name: 'Ascoltare', keyAbility: 'WIS', untrained: true, armorCheckPenalty: false, description: 'Udire suoni e individuare nemici furtivi.' },
  { id: 'move-silently', name: 'Muoversi Silenziosamente', keyAbility: 'DEX', untrained: true, armorCheckPenalty: true, description: 'Muoversi senza fare rumore.' },
  { id: 'open-lock', name: 'Scassinare', keyAbility: 'DEX', untrained: false, armorCheckPenalty: false, description: 'Aprire serrature senza chiave.' },
  { id: 'perform', name: 'Intrattenere', keyAbility: 'CHA', untrained: true, armorCheckPenalty: false, description: 'Intrattenere con musica, danza o recitazione.' },
  { id: 'profession', name: 'Professione', keyAbility: 'WIS', untrained: false, armorCheckPenalty: false, description: 'Esercitare un mestiere remunerativo.' },
  { id: 'ride', name: 'Cavalcare', keyAbility: 'DEX', untrained: true, armorCheckPenalty: false, description: 'Cavalcare e controllare una cavalcatura.' },
  { id: 'search', name: 'Cercare', keyAbility: 'INT', untrained: true, armorCheckPenalty: false, description: 'Trovare dettagli, trappole e passaggi segreti.' },
  { id: 'sense-motive', name: 'Percepire Intenzioni', keyAbility: 'WIS', untrained: true, armorCheckPenalty: false, description: 'Capire se qualcuno mente o nasconde qualcosa.' },
  { id: 'sleight-of-hand', name: 'Rapidità di Mano', keyAbility: 'DEX', untrained: false, armorCheckPenalty: true, description: 'Borseggiare o nascondere piccoli oggetti.' },
  { id: 'spellcraft', name: 'Sapienza Magica', keyAbility: 'INT', untrained: false, armorCheckPenalty: false, description: 'Identificare incantesimi e fenomeni magici.' },
  { id: 'spot', name: 'Osservare', keyAbility: 'WIS', untrained: true, armorCheckPenalty: false, description: 'Notare dettagli a distanza o nemici nascosti.' },
  { id: 'survival', name: 'Sopravvivenza', keyAbility: 'WIS', untrained: true, armorCheckPenalty: false, description: 'Orientarsi, cacciare e seguire tracce.' },
  { id: 'swim', name: 'Nuotare', keyAbility: 'STR', untrained: true, armorCheckPenalty: true, description: 'Nuotare e muoversi in acqua.' },
  { id: 'tumble', name: 'Acrobazia', keyAbility: 'DEX', untrained: false, armorCheckPenalty: true, description: 'Eseguire capriole e movimenti acrobatici.' },
  { id: 'use-magic-device', name: 'Utilizzare Oggetti Magici', keyAbility: 'CHA', untrained: false, armorCheckPenalty: false, description: 'Attivare oggetti magici senza i requisiti.' },
  { id: 'use-rope', name: 'Usare Corde', keyAbility: 'DEX', untrained: true, armorCheckPenalty: false, description: 'Fare nodi e usare funi.' },
];
