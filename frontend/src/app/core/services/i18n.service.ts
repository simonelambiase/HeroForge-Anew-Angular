import { computed, Injectable, signal } from '@angular/core';

export type SupportedLanguage = 'it' | 'en';

export const SUPPORTED_LANGUAGES: readonly SupportedLanguage[] = ['it', 'en'];
export const DEFAULT_LANGUAGE: SupportedLanguage = 'it';

const LANGUAGE_STORAGE_KEY = 'heroforge-anew-angular.language';

interface LanguageOption {
  code: SupportedLanguage;
  label: string;
  shortLabel: string;
}

interface Dictionary {
  [key: string]: string | Dictionary;
}

const IT_DICTIONARY: Dictionary = {
  shell: {
    title: 'HeroForge Anew Angular',
    subtitle: 'Creatore Personaggio D&D 3.5',
    aiAssistant: 'AI Assistant',
    configure: 'Configura',
    quickPreview: 'Anteprima rapida',
    previous: 'Indietro',
    next: 'Avanti',
  },
  stepper: {
    abilities: 'Caratteristiche',
    race: 'Razza',
    class: 'Classe',
    skills: 'Abilità',
    feats: 'Talenti',
    equipment: 'Equipaggiamento',
    sheet: 'Scheda Finale',
  },
  badges: {
    bab: 'BAB',
    ac: 'CA',
    fortitude: 'Tempra',
    reflex: 'Riflessi',
    will: 'Volontà',
    hp: 'PF',
  },
  abilities: {
    title: 'Punteggi di caratteristica',
    generationMethod: 'Metodo di generazione',
    pointBuy: 'Point Buy',
    manual: 'Manuale',
    pointBudget: 'Budget punti',
    remainingPoints: 'Punti rimanenti',
    full: {
      STR: 'Forza',
      DEX: 'Destrezza',
      CON: 'Costituzione',
      INT: 'Intelligenza',
      WIS: 'Saggezza',
      CHA: 'Carisma',
    },
    short: {
      STR: 'FOR',
      DEX: 'DES',
      CON: 'COS',
      INT: 'INT',
      WIS: 'SAG',
      CHA: 'CAR',
    },
    decrease: 'Diminuisci',
    increase: 'Aumenta',
    race: 'Razza',
  },
  sheet: {
    namePlaceholder: 'Nome del personaggio',
    print: 'Stampa',
    exportJson: 'Esporta JSON',
    abilities: 'Caratteristiche',
    characteristic: 'Caratteristica',
    score: 'Punteggio',
    modifier: 'Modificatore',
    race: 'Razza',
    noRace: 'Nessuna razza selezionata',
    classesAndLevels: 'Classi e livelli',
    noClass: 'Nessuna classe selezionata.',
    level: 'Livello',
    classOptions: 'Opzioni di Classe',
    savingThrows: 'Tiri salvezza',
    fortitude: 'Tempra',
    reflex: 'Riflessi',
    will: 'Volontà',
    base: 'base',
    fortitudeLine: 'Tempra: {{base}} (base) + {{modifier}} ({{code}}) =',
    reflexLine: 'Riflessi: {{base}} (base) + {{modifier}} ({{code}}) =',
    willLine: 'Volontà: {{base}} (base) + {{modifier}} ({{code}}) =',
    unnamed: 'Senza nome',
    deity: 'Divinità',
    domains: 'Domini',
    turn: 'Scacciare',
    rebuke: 'Intimorire',
    school: 'Scuola',
    prohibited: 'Proibite',
    familiar: 'Familiare',
    style: 'Stile',
    favoredEnemy: 'Nemico prescelto',
    companion: 'Compagno',
    animalCompanion: 'Compagno animale',
    rage: 'Ira',
    clericSummary: 'Divinità: {{deity}} | Domini: {{domains}} | {{channeling}}',
    wizardSummary: 'Scuola: {{specialization}}{{prohibited}} | Familiare: {{familiar}}',
    rangerSummary: 'Stile: {{style}} | Nemico prescelto: {{enemy}} | Compagno: {{companion}}',
    barbarianSummary: 'Ira: {{variant}}',
    druidSummary: 'Compagno animale: {{companion}}',
    monkSummary: 'Stile: {{style}}',
  },
  ai: {
    title: 'AI Assistant',
    close: 'Chiudi',
    setupMessage: 'Configura la tua API key OpenRouter per usare l\'assistente.',
    tabs: {
      build: 'Build Advisor',
      lore: 'Generatore Lore',
      rules: 'Regole 3.5 & Chat',
    },
    conceptLabel: 'Idea del personaggio',
    conceptPlaceholder: 'Es. un guerriero elfico che diventa arciere arcano…',
    askAdvice: 'Chiedi consiglio',
    generating: 'Generazione…',
    loreDescription: 'Genera background narrativo, agganci di trama e tratti di personalità per il personaggio attuale.',
    generateLore: 'Genera lore',
    you: 'Tu',
    arbiter: 'Arbitro',
    rulesEmpty: 'Fai una domanda sulle regole D&D 3.5.',
    questionPlaceholder: 'La tua domanda sulle regole…',
    send: 'Invia',
    apiKeyLabel: 'API Key OpenRouter',
    apiKeyPlaceholder: 'Inserisci la tua API key',
    model: 'Modello',
    save: 'Salva',
    testing: 'Test in corso…',
    testConnection: 'Testa connessione',
    removeKey: 'Rimuovi key',
    configured: 'API key configurata.',
    notConfigured: 'Nessuna API key configurata.',
    testSuccess: 'Connessione riuscita: {{response}}',
    testFailure: 'Test fallito. Controlla la API key.',
  },
  language: {
    label: 'Lingua',
    italian: 'Italiano',
    english: 'Inglese',
  },
  race: {
    choose: 'Scegli la razza',
    search: 'Cerca razza...',
    empty: 'Nessuna razza trovata.',
    custom: 'Razza personalizzata',
  },
  class: {
    choose: 'Scegli le classi',
    assigned: 'Livelli assegnati',
    noClass: 'Nessuna classe selezionata.',
    remove: 'Rimuovi',
    options: 'Opzioni e Specializzazioni di Classe',
    deity: 'Divinità',
    domains: 'Domini (max 2)',
    energy: 'Energia',
    turn: 'Scacciare',
    rebuke: 'Intimorire',
    specialization: 'Scuola specialistica',
    generalist: 'Generalista',
    prohibited: 'Scuole proibite (max {{max}})',
    familiar: 'Familiare',
    none: 'Nessuno',
    combatStyle: 'Stile di combattimento',
    favoredEnemy: 'Nemico prescelto',
    select: 'Seleziona...',
    animalCompanion: 'Compagno animale',
    rageStyle: 'Stile d\'ira / Totem',
    monkStyle: 'Stile marziale',
  },
  skills: {
    title: 'Abilità',
    search: 'Cerca un\'abilità...',
    remaining: 'Punti rimanenti',
    maxClass: 'Max classe',
    maxCross: 'Max cross',
    ability: 'Abilità',
    characteristic: 'Caratteristica',
    type: 'Tipo',
    ranks: 'Gradi',
    total: 'Totale',
    trainedOnly: 'Solo addestrata',
    classSkill: 'Classe',
    crossSkill: 'Cross',
  },
  feats: {
    title: 'Talenti',
    filter: 'Filtra per tipo',
    all: 'Tutti',
    count: '{{selected}} / {{available}} talenti',
  },
  equipment: {
    title: 'Equipaggiamento',
    armorClass: 'CA',
    weight: 'Peso',
    load: 'Carico',
    checkPenalty: 'Penalità prova',
    weapons: 'Armi',
    filterWeapons: 'Filtra armi',
    all: 'Tutte',
    armorAndShields: 'Armature e scudi',
    filterArmor: 'Filtra armature',
    melee: 'Mischia',
    ranged: 'A distanza',
  },
  common: {
    expand: 'Espandi',
    collapse: 'Riduci',
    empty: 'Nessun elemento.',
  },
};

const EN_DICTIONARY: Dictionary = {
  shell: {
    title: 'HeroForge Anew Angular',
    subtitle: 'D&D 3.5 Character Builder',
    aiAssistant: 'AI Assistant',
    configure: 'Configure',
    quickPreview: 'Quick preview',
    previous: 'Previous',
    next: 'Next',
  },
  stepper: {
    abilities: 'Abilities',
    race: 'Race',
    class: 'Class',
    skills: 'Skills',
    feats: 'Feats',
    equipment: 'Equipment',
    sheet: 'Character Sheet',
  },
  badges: {
    bab: 'BAB',
    ac: 'AC',
    fortitude: 'Fortitude',
    reflex: 'Reflex',
    will: 'Will',
    hp: 'HP',
  },
  abilities: {
    title: 'Ability scores',
    generationMethod: 'Generation method',
    pointBuy: 'Point Buy',
    manual: 'Manual',
    pointBudget: 'Point budget',
    remainingPoints: 'Remaining points',
    full: {
      STR: 'Strength',
      DEX: 'Dexterity',
      CON: 'Constitution',
      INT: 'Intelligence',
      WIS: 'Wisdom',
      CHA: 'Charisma',
    },
    short: {
      STR: 'STR',
      DEX: 'DEX',
      CON: 'CON',
      INT: 'INT',
      WIS: 'WIS',
      CHA: 'CHA',
    },
    decrease: 'Decrease',
    increase: 'Increase',
    race: 'Race',
  },
  sheet: {
    namePlaceholder: 'Character name',
    print: 'Print',
    exportJson: 'Export JSON',
    abilities: 'Abilities',
    characteristic: 'Ability',
    score: 'Score',
    modifier: 'Modifier',
    race: 'Race',
    noRace: 'No race selected',
    classesAndLevels: 'Classes and levels',
    noClass: 'No class selected.',
    level: 'Level',
    classOptions: 'Class Options',
    savingThrows: 'Saving throws',
    fortitude: 'Fortitude',
    reflex: 'Reflex',
    will: 'Will',
    base: 'base',
    fortitudeLine: 'Fortitude: {{base}} (base) + {{modifier}} ({{code}}) =',
    reflexLine: 'Reflex: {{base}} (base) + {{modifier}} ({{code}}) =',
    willLine: 'Will: {{base}} (base) + {{modifier}} ({{code}}) =',
    unnamed: 'Unnamed',
    deity: 'Deity',
    domains: 'Domains',
    turn: 'Turn',
    rebuke: 'Rebuke',
    school: 'School',
    prohibited: 'Prohibited',
    familiar: 'Familiar',
    style: 'Style',
    favoredEnemy: 'Favored enemy',
    companion: 'Companion',
    animalCompanion: 'Animal companion',
    rage: 'Rage',
    clericSummary: 'Deity: {{deity}} | Domains: {{domains}} | {{channeling}}',
    wizardSummary: 'School: {{specialization}}{{prohibited}} | Familiar: {{familiar}}',
    rangerSummary: 'Style: {{style}} | Favored enemy: {{enemy}} | Companion: {{companion}}',
    barbarianSummary: 'Rage: {{variant}}',
    druidSummary: 'Animal companion: {{companion}}',
    monkSummary: 'Style: {{style}}',
  },
  ai: {
    title: 'AI Assistant',
    close: 'Close',
    setupMessage: 'Configure your OpenRouter API key to use the assistant.',
    tabs: {
      build: 'Build Advisor',
      lore: 'Lore Generator',
      rules: '3.5 Rules & Chat',
    },
    conceptLabel: 'Character concept',
    conceptPlaceholder: 'e.g. an elven warrior who becomes an arcane archer…',
    askAdvice: 'Ask for advice',
    generating: 'Generating…',
    loreDescription: 'Generate narrative background, plot hooks and personality traits for the current character.',
    generateLore: 'Generate lore',
    you: 'You',
    arbiter: 'Referee',
    rulesEmpty: 'Ask a question about the D&D 3.5 rules.',
    questionPlaceholder: 'Your rules question…',
    send: 'Send',
    apiKeyLabel: 'OpenRouter API Key',
    apiKeyPlaceholder: 'Enter your API key',
    model: 'Model',
    save: 'Save',
    testing: 'Testing…',
    testConnection: 'Test connection',
    removeKey: 'Remove key',
    configured: 'API key configured.',
    notConfigured: 'No API key configured.',
    testSuccess: 'Connection successful: {{response}}',
    testFailure: 'Test failed. Check your API key.',
  },
  language: {
    label: 'Language',
    italian: 'Italian',
    english: 'English',
  },
  race: {
    choose: 'Choose your race',
    search: 'Search race...',
    empty: 'No race found.',
    custom: 'Custom race',
  },
  class: {
    choose: 'Choose your classes',
    assigned: 'Assigned levels',
    noClass: 'No class selected.',
    remove: 'Remove',
    options: 'Class Options and Specializations',
    deity: 'Deity',
    domains: 'Domains (max 2)',
    energy: 'Energy',
    turn: 'Turn',
    rebuke: 'Rebuke',
    specialization: 'Specialist school',
    generalist: 'Generalist',
    prohibited: 'Prohibited schools (max {{max}})',
    familiar: 'Familiar',
    none: 'None',
    combatStyle: 'Combat style',
    favoredEnemy: 'Favored enemy',
    select: 'Select...',
    animalCompanion: 'Animal companion',
    rageStyle: 'Rage style / Totem',
    monkStyle: 'Martial style',
  },
  skills: {
    title: 'Skills',
    search: 'Search a skill...',
    remaining: 'Remaining points',
    maxClass: 'Max class',
    maxCross: 'Max cross',
    ability: 'Skill',
    characteristic: 'Ability',
    type: 'Type',
    ranks: 'Ranks',
    total: 'Total',
    trainedOnly: 'Trained only',
    classSkill: 'Class',
    crossSkill: 'Cross',
  },
  feats: {
    title: 'Feats',
    filter: 'Filter by type',
    all: 'All',
    count: '{{selected}} / {{available}} feats',
  },
  equipment: {
    title: 'Equipment',
    armorClass: 'AC',
    weight: 'Weight',
    load: 'Load',
    checkPenalty: 'Check penalty',
    weapons: 'Weapons',
    filterWeapons: 'Filter weapons',
    all: 'All',
    armorAndShields: 'Armor and shields',
    filterArmor: 'Filter armor',
    melee: 'Melee',
    ranged: 'Ranged',
  },
  common: {
    expand: 'Expand',
    collapse: 'Collapse',
    empty: 'No items.',
  },
};

const DICTIONARIES: Readonly<Record<SupportedLanguage, Dictionary>> = {
  it: IT_DICTIONARY,
  en: EN_DICTIONARY,
};

const LANGUAGE_OPTIONS: readonly LanguageOption[] = [
  { code: 'it', label: 'Italiano', shortLabel: 'IT' },
  { code: 'en', label: 'English', shortLabel: 'EN' },
];

@Injectable({ providedIn: 'root' })
export class I18nService {
  readonly currentLang = signal<SupportedLanguage>(this.restoreLanguage());
  readonly languageOptions = LANGUAGE_OPTIONS;

  readonly currentDictionary = computed(() => DICTIONARIES[this.currentLang()]);

  setLanguage(language: SupportedLanguage): void {
    if (!SUPPORTED_LANGUAGES.includes(language)) {
      return;
    }
    this.currentLang.set(language);
    this.persistLanguage(language);
  }

  t(key: string, params?: Record<string, string | number>): string {
    let value: string | Dictionary | undefined = this.currentDictionary();
    for (const segment of key.split('.')) {
      if (typeof value !== 'object' || value === null) {
        return key;
      }
      value = value[segment];
    }

    if (typeof value !== 'string') {
      return key;
    }

    if (!params) {
      return value;
    }

    return value.replace(/\{\{(\w+)\}\}/g, (match, token: string) =>
      Object.prototype.hasOwnProperty.call(params, token) ? String(params[token]) : match,
    );
  }

  private restoreLanguage(): SupportedLanguage {
    const saved = this.read(LANGUAGE_STORAGE_KEY);
    return saved === 'en' ? 'en' : DEFAULT_LANGUAGE;
  }

  private persistLanguage(language: SupportedLanguage): void {
    try {
      this.storage()?.setItem(LANGUAGE_STORAGE_KEY, language);
    } catch {
      // La persistenza è un miglioramento, non un requisito bloccante.
    }
  }

  private read(key: string): string {
    try {
      return this.storage()?.getItem(key) ?? '';
    } catch {
      return '';
    }
  }

  private storage(): Storage | null {
    try {
      return typeof window !== 'undefined' ? window.localStorage : null;
    } catch {
      return null;
    }
  }
}
