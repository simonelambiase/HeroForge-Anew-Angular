export type Channeling = 'turn' | 'rebuke';

export interface Domain {
  id: string;
  name: string;
  description: string;
  grantedPower: string;
}

export interface ClericOptions {
  deity: string;
  domains: string[];
  channeling: Channeling;
}

export type WizardSchoolId =
  | 'abjuration'
  | 'conjuration'
  | 'divination'
  | 'enchantment'
  | 'evocation'
  | 'illusion'
  | 'necromancy'
  | 'transmutation';

export type WizardSpecialization = WizardSchoolId | 'generalist';

export interface Familiar {
  id: string;
  name: string;
  bonus: string;
  hitPointsBonus?: number;
  fortitudeBonus?: number;
  reflexBonus?: number;
}

export interface WizardOptions {
  specialization: WizardSpecialization;
  prohibitedSchools: WizardSchoolId[];
  familiar: string;
}

export type CombatStyle = 'archery' | 'two-weapon';

export interface RangerOptions {
  combatStyle: CombatStyle;
  favoredEnemy: string;
  animalCompanion: string;
}

export type RageVariant = 'standard' | 'whirling-frenzy' | 'spiritual-lion' | 'spiritual-wolf';

export interface BarbarianOptions {
  rageVariant: RageVariant;
}

export interface DruidOptions {
  animalCompanion: string;
}

export type MonkStyle = 'standard' | 'grapple' | 'stunning';

export interface MonkOptions {
  monkStyle: MonkStyle;
}

export interface CharacterClassOptions {
  cleric: ClericOptions;
  wizard: WizardOptions;
  ranger: RangerOptions;
  barbarian: BarbarianOptions;
  druid: DruidOptions;
  monk: MonkOptions;
}

export const CLASS_IDS_WITH_OPTIONS: readonly string[] = [
  'cleric',
  'wizard',
  'ranger',
  'barbarian',
  'druid',
  'monk',
];

export const DEITIES: readonly string[] = [
  'Pelor',
  'Kord',
  'Moradin',
  'Wee Jas',
  'Heironeous',
  'Boccob',
  'St. Cuthbert',
  'Olidammara',
  'Nerull',
  'Hextor',
  'Corellon Larethian',
  'Yondalla',
  'Gruumsh',
  'Nessuna / Ideale',
];

export const DOMAINS: readonly Domain[] = [
  { id: 'air', name: 'Aria', description: 'Dominio dei cieli, del vento e delle tempeste.', grantedPower: 'Scacciare o comandare creature della terra.' },
  { id: 'animal', name: 'Animali', description: 'Dominio delle bestie e della natura selvaggia.', grantedPower: 'Parlare con gli animali una volta al giorno.' },
  { id: 'chaos', name: 'Caos', description: 'Dominio del mutamento e della libertà.', grantedPower: 'Incantesimi del Caos lanciati a +1 al livello dell\u2019incantatore.' },
  { id: 'death', name: 'Morte', description: 'Dominio del trapasso e del non morto.', grantedPower: 'Tocco della morte una volta al giorno.' },
  { id: 'destruction', name: 'Distruzione', description: 'Dominio della rovina e della forza distruttiva.', grantedPower: 'Colpo rovinante una volta al giorno.' },
  { id: 'earth', name: 'Terra', description: 'Dominio della pietra e della solidità.', grantedPower: 'Scacciare o comandare creature dell\u2019aria.' },
  { id: 'evil', name: 'Male', description: 'Dominio dell\u2019oscurità e della malvagità.', grantedPower: 'Incantesimi del Male lanciati a +1 al livello dell\u2019incantatore.' },
  { id: 'fire', name: 'Fuoco', description: 'Dominio della fiamma e del calore.', grantedPower: 'Scacciare o comandare creature dell\u2019acqua.' },
  { id: 'good', name: 'Bene', description: 'Dominio della luce e della bontà.', grantedPower: 'Incantesimi del Bene lanciati a +1 al livello dell\u2019incantatore.' },
  { id: 'healing', name: 'Guarigione', description: 'Dominio della cura e del ristoro.', grantedPower: 'Incantesimi di guarigione lanciati a +1 al livello dell\u2019incantatore.' },
  { id: 'knowledge', name: 'Conoscenza', description: 'Dominio del sapere e dei segreti.', grantedPower: 'Tutte le abilità di Conoscenza sono abilità di classe.' },
  { id: 'law', name: 'Legge', description: 'Dominio dell\u2019ordine e della disciplina.', grantedPower: 'Incantesimi della Legge lanciati a +1 al livello dell\u2019incantatore.' },
  { id: 'luck', name: 'Fortuna', description: 'Dominio del caso e del destino favorevole.', grantedPower: 'Ritirare un tiro una volta al giorno.' },
  { id: 'magic', name: 'Magia', description: 'Dominio della magia e degli oggetti incantati.', grantedPower: 'Usare pergamene e bacchette come un mago di metà livello.' },
  { id: 'plant', name: 'Piante', description: 'Dominio della vegetazione e della crescita.', grantedPower: 'Scacciare o comandare creature vegetali.' },
  { id: 'protection', name: 'Protezione', description: 'Dominio della difesa e degli scudi.', grantedPower: 'Aura protettiva una volta al giorno.' },
  { id: 'strength', name: 'Forza', description: 'Dominio del vigore fisico.', grantedPower: 'Aumento temporaneo di Forza una volta al giorno.' },
  { id: 'sun', name: 'Sole', description: 'Dominio della luce solare e del giorno.', grantedPower: 'Scacciare i non morti con maggiore efficacia.' },
  { id: 'travel', name: 'Viaggio', description: 'Dominio del movimento e dei sentieri.', grantedPower: 'Libertà di movimento limitata per alcuni round al giorno.' },
  { id: 'trickery', name: 'Inganno', description: 'Dominio dell\u2019astuzia e dell\u2019illusione.', grantedPower: 'Raggirare, Camuffare e Nascondersi come abilità di classe.' },
  { id: 'war', name: 'Guerra', description: 'Dominio della battaglia e delle armi.', grantedPower: 'Competenza e Focus in un\u2019arma a scelta.' },
  { id: 'water', name: 'Acqua', description: 'Dominio dei mari e dei fiumi.', grantedPower: 'Scacciare o comandare creature del fuoco.' },
];

export const MAGIC_SCHOOLS: readonly { id: WizardSchoolId; name: string }[] = [
  { id: 'abjuration', name: 'Abiurazione' },
  { id: 'conjuration', name: 'Invocazione' },
  { id: 'divination', name: 'Divinazione' },
  { id: 'enchantment', name: 'Ammaliamento' },
  { id: 'evocation', name: 'Evocazione' },
  { id: 'illusion', name: 'Illusione' },
  { id: 'necromancy', name: 'Necromanzia' },
  { id: 'transmutation', name: 'Trasmutazione' },
];

export const FAMILIARS: readonly Familiar[] = [
  { id: 'bat', name: 'Pipistrello', bonus: '+3 Ascoltare' },
  { id: 'cat', name: 'Gatto', bonus: '+3 Muoversi Silenziosamente' },
  { id: 'hawk', name: 'Falco', bonus: '+3 Osservare' },
  { id: 'lizard', name: 'Lucertola', bonus: '+3 Scalare' },
  { id: 'owl', name: 'Gufo', bonus: '+3 Osservare' },
  { id: 'rat', name: 'Ratto', bonus: '+2 Tempra', fortitudeBonus: 2 },
  { id: 'raven', name: 'Corvo', bonus: '+3 Ascoltare / parla' },
  { id: 'snake', name: 'Serpente', bonus: '+3 Raggirare' },
  { id: 'toad', name: 'Rospo', bonus: '+3 PF', hitPointsBonus: 3 },
  { id: 'weasel', name: 'Donnola', bonus: '+2 Riflessi', reflexBonus: 2 },
];

export const FAVORED_ENEMIES: readonly string[] = [
  'Aberrazioni',
  'Animali',
  'Costrutti',
  'Draghi',
  'Elementali',
  'Folletti',
  'Giganti',
  'Melme',
  'Non Morti',
  'Parassiti',
  'Umanoidi (Rettili)',
  'Umanoidi (Orchi)',
  'Umanoidi (Goblinoidi)',
  'Umanoidi (Umani)',
  'Umanoidi (Elfi)',
  'Esterni (Malvagi)',
  'Esterni (Buoni)',
];

export const COMBAT_STYLES: readonly { id: CombatStyle; name: string }[] = [
  { id: 'archery', name: 'Tiro con l\u2019Arco' },
  { id: 'two-weapon', name: 'Combattere con Due Armi' },
];

export const RANGER_ANIMAL_COMPANIONS: readonly string[] = [
  'Lupo',
  'Tasso',
  'Falco',
  'Aquila',
  'Vipera',
  'Cane',
];

export const DRUID_ANIMAL_COMPANIONS: readonly string[] = [
  'Lupo',
  'Cane da galoppo',
  'Tasso',
  'Falco',
  'Aquila',
  'Vipera',
  'Cammello',
  'Cavallo pesante',
];

export const RAGE_VARIANTS: readonly { id: RageVariant; name: string; description: string }[] = [
  { id: 'standard', name: 'Ira Barbarica', description: 'Ira classica: bonus a Forza e Costituzione, penalità alla CA.' },
  { id: 'whirling-frenzy', name: 'Frenesia Turbinante', description: 'Variante UA: attacco extra e bonus ai tiri per colpire.' },
  { id: 'spiritual-lion', name: 'Totem Leone', description: 'Totem Leone PHB II: Balzo e attacco in carica.' },
  { id: 'spiritual-wolf', name: 'Totem Lupo', description: 'Totem Lupo: Sbilanciare l\u2019avversario.' },
];

export const MONK_STYLES: readonly { id: MonkStyle; name: string; description: string }[] = [
  { id: 'standard', name: 'Colpo Senz\u2019Armi', description: 'Stile classico del colpo senz\u2019armi.' },
  { id: 'grapple', name: 'Lottatore', description: 'Specializzato in lotta e prese.' },
  { id: 'stunning', name: 'Pugno Stordente', description: 'Specializzato nel colpo stordente.' },
];

export const DEFAULT_CLASS_OPTIONS: CharacterClassOptions = {
  cleric: { deity: 'Nessuna / Ideale', domains: [], channeling: 'turn' },
  wizard: { specialization: 'generalist', prohibitedSchools: [], familiar: '' },
  ranger: { combatStyle: 'archery', favoredEnemy: '', animalCompanion: '' },
  barbarian: { rageVariant: 'standard' },
  druid: { animalCompanion: '' },
  monk: { monkStyle: 'standard' },
};

export const KNOWLEDGE_DOMAIN_ID = 'knowledge';
export const TOAD_FAMILIAR_ID = 'toad';
export const RAT_FAMILIAR_ID = 'rat';
export const WEASEL_FAMILIAR_ID = 'weasel';

export function domainName(domainId: string): string {
  return DOMAINS.find((domain) => domain.id === domainId)?.name ?? domainId;
}

export function schoolName(schoolId: WizardSchoolId | 'generalist'): string {
  if (schoolId === 'generalist') {
    return 'Generalista';
  }
  return MAGIC_SCHOOLS.find((school) => school.id === schoolId)?.name ?? schoolId;
}

export function familiarName(familiarId: string): string {
  return FAMILIARS.find((familiar) => familiar.id === familiarId)?.name ?? familiarId;
}
