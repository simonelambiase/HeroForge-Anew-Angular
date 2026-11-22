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

type DictionaryValue = string | string[] | Dictionary;

interface Dictionary {
  [key: string]: DictionaryValue;
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
    speed: 'Velocità',
    favoredClass: 'Classe preferita',
    name: 'Nome',
    size: 'Taglia',
    type: 'Tipo',
    subtype: 'Sottotipo',
    racialHitDice: 'Dadi vita razziali',
    naturalArmor: 'CA naturale',
    abilityModifiers: 'Modificatori di caratteristica',
    landSpeed: 'Terreno',
    burrowSpeed: 'Scavare',
    climbSpeed: 'Scalare',
    flySpeed: 'Volare',
    swimSpeed: 'Nuotare',
    flyManeuverability: 'Manovrabilità volo',
    senses: 'Sensi',
    darkvision: 'Scurovisione (m)',
    blindsense: 'Vista cieca (m)',
    blindsight: 'Percezione cieca (m)',
    lowLightVision: 'Visione crepuscolare',
    scent: 'Fiuto',
    otherSenses: 'Altri sensi',
    naturalAttacks: 'Attacchi naturali (separati da virgola)',
    racialTraits: 'Tratti razziali (uno per riga)',
    traitsTitle: 'Tratti razziali',
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
    all: 'Tutte',
    level: 'Livello',
    hitDie: 'DV',
    skillPoints: 'abilità',
    babGood: 'Buono',
    babAverage: 'Medio',
    babPoor: 'Scarso',
    saveGood: 'Buono',
    savePoor: 'Scarso',
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
    names: {
      appraise: 'Valutare',
      balance: 'Equilibrio',
      bluff: 'Raggirare',
      climb: 'Scalare',
      concentration: 'Concentrazione',
      craft: 'Artigianato',
      'decipher-script': 'Decifrare Scritture',
      diplomacy: 'Diplomazia',
      'disable-device': 'Disattivare Congegni',
      disguise: 'Camuffare',
      'escape-artist': 'Artista della Fuga',
      forgery: 'Falsificare',
      'gather-information': 'Raccogliere Informazioni',
      'handle-animal': 'Addestrare Animali',
      heal: 'Guarire',
      hide: 'Nascondersi',
      intimidate: 'Intimidire',
      jump: 'Saltare',
      'knowledge-arcana': 'Conoscenze (arcano)',
      'knowledge-architecture': 'Conoscenze (architettura)',
      'knowledge-dungeoneering': 'Conoscenze (sotterranei)',
      'knowledge-geography': 'Conoscenze (geografia)',
      'knowledge-history': 'Conoscenze (storia)',
      'knowledge-local': 'Conoscenze (locali)',
      'knowledge-nature': 'Conoscenze (natura)',
      'knowledge-nobility': 'Conoscenze (nobiltà)',
      'knowledge-religion': 'Conoscenze (religioni)',
      'knowledge-planes': 'Conoscenze (piani)',
      listen: 'Ascoltare',
      'move-silently': 'Muoversi Silenziosamente',
      'open-lock': 'Scassinare',
      perform: 'Intrattenere',
      profession: 'Professione',
      ride: 'Cavalcare',
      search: 'Cercare',
      'sense-motive': 'Percepire Intenzioni',
      'sleight-of-hand': 'Rapidità di Mano',
      spellcraft: 'Sapienza Magica',
      spot: 'Osservare',
      survival: 'Sopravvivenza',
      swim: 'Nuotare',
      tumble: 'Acrobazia',
      'use-magic-device': 'Utilizzare Oggetti Magici',
      'use-rope': 'Usare Corde',
    },
    descriptions: {
      appraise: 'Determinare il valore di un oggetto.',
      balance: 'Mantenere l\'equilibrio su superfici strette o scivolose.',
      bluff: 'Ingannare, mentire o creare diversivi.',
      climb: 'Arrampicarsi su pareti e superfici ripide.',
      concentration: 'Mantenere la concentrazione mentre si è disturbati.',
      craft: 'Creare o riparare oggetti.',
      'decipher-script': 'Interpretare testi antichi o cifrati.',
      diplomacy: 'Influenzare con le buone maniere e la negoziazione.',
      'disable-device': 'Disinnescare trappole o sabotare meccanismi.',
      disguise: 'Cambiare il proprio aspetto.',
      'escape-artist': 'Liberarsi da legami o spazi angusti.',
      forgery: 'Creare documenti falsi e imitare scritture.',
      'gather-information': 'Scoprire voci e notizie tra la gente.',
      'handle-animal': 'Addestrare e governare gli animali.',
      heal: 'Curare ferite e stabilizzare i morenti.',
      hide: 'Nascondersi senza essere visti.',
      intimidate: 'Influenzare gli altri con la minaccia.',
      jump: 'Saltare in lungo o in alto.',
      'knowledge-arcana': 'Sapere di magia arcana, incantesimi e costrutti.',
      'knowledge-architecture': 'Sapere di edifici, ponti e strutture.',
      'knowledge-dungeoneering': 'Sapere di caverne, aberrazioni e melme.',
      'knowledge-geography': 'Sapere di terre, climi e popoli.',
      'knowledge-history': 'Sapere di guerre, regni e rovine.',
      'knowledge-local': 'Sapere di leggende, personalità e leggi locali.',
      'knowledge-nature': 'Sapere di animali, piante e stagioni.',
      'knowledge-nobility': 'Sapere di araldica, casate e protocollo.',
      'knowledge-religion': 'Sapere di divinità, riti e non morti.',
      'knowledge-planes': 'Sapere dei piani e delle creature extraplanari.',
      listen: 'Udire suoni e individuare nemici furtivi.',
      'move-silently': 'Muoversi senza fare rumore.',
      'open-lock': 'Aprire serrature senza chiave.',
      perform: 'Intrattenere con musica, danza o recitazione.',
      profession: 'Esercitare un mestiere remunerativo.',
      ride: 'Cavalcare e controllare una cavalcatura.',
      search: 'Trovare dettagli, trappole e passaggi segreti.',
      'sense-motive': 'Capire se qualcuno mente o nasconde qualcosa.',
      'sleight-of-hand': 'Borseggiare o nascondere piccoli oggetti.',
      spellcraft: 'Identificare incantesimi e fenomeni magici.',
      spot: 'Notare dettagli a distanza o nemici nascosti.',
      survival: 'Orientarsi, cacciare e seguire tracce.',
      swim: 'Nuotare e muoversi in acqua.',
      tumble: 'Eseguire capriole e movimenti acrobatici.',
      'use-magic-device': 'Attivare oggetti magici senza i requisiti.',
      'use-rope': 'Fare nodi e usare funi.',
    },
  },
  feats: {
    title: 'Talenti',
    filter: 'Filtra per tipo',
    all: 'Tutti',
    count: '{{selected}} / {{available}} talenti',
    prerequisitesLabel: 'Requisiti',
    noPrerequisite: 'Nessun requisito',
    names: {
      'power-attack': 'Attacco Poderoso',
      cleave: 'Fendente',
      'great-cleave': 'Grande Fendente',
      'weapon-focus': 'Arma Focalizzata',
      dodge: 'Schivare',
      mobility: 'Mobilità',
      'spring-attack': 'Attacco in Movimento',
      'combat-expertise': 'Competenza in Combattimento',
      'improved-initiative': 'Iniziativa Migliorata',
      toughness: 'Robustezza',
      'iron-will': 'Volontà di Ferro',
      'lightning-reflexes': 'Riflessi Fulminei',
      'great-fortitude': 'Tempra Eccezionale',
      'point-blank-shot': 'Tiro Ravvicinato',
      'precise-shot': 'Tiro Preciso',
      'rapid-shot': 'Tiro Rapido',
      'spell-focus': 'Focalizzare Incantesimo',
      'combat-casting': 'Combattimento con Incantesimi',
      'empower-spell': 'Incantesimo Potenziato',
      'maximize-spell': 'Incantesimo Massimizzato',
      'extend-spell': 'Incantesimo Esteso',
      'quicken-spell': 'Incantesimo Rapido',
      'silent-spell': 'Incantesimo Silenzioso',
      'still-spell': 'Incantesimo Immobile',
      'scribe-scroll': 'Scrivere Pergamene',
      'brew-potion': 'Preparare Pozioni',
      'craft-wondrous-item': 'Creare Oggetti Meravigliosi',
      'craft-magic-arms': 'Creare Armi e Armature Magiche',
    },
    types: {
      general: 'Generale',
      combat: 'Combattimento',
      metamagic: 'Metamagia',
      item_creation: 'Creazione Oggetti',
      racial: 'Razziale',
    },
    prerequisites: {
      'power-attack': 'FOR 13',
      cleave: 'FOR 13, Attacco Poderoso',
      'great-cleave': 'FOR 13, Attacco Poderoso, Fendente',
      'weapon-focus': 'Competenza nell\'arma, BAB +1',
      dodge: 'DES 13',
      mobility: 'DES 13, Schivare',
      'spring-attack': 'DES 13, Schivare, Mobilità, BAB +4',
      'combat-expertise': 'INT 13',
      'improved-initiative': '',
      toughness: '',
      'iron-will': '',
      'lightning-reflexes': '',
      'great-fortitude': '',
      'point-blank-shot': '',
      'precise-shot': 'Tiro Ravvicinato',
      'rapid-shot': 'DES 13, Tiro Ravvicinato',
      'spell-focus': '',
      'combat-casting': '',
      'empower-spell': '',
      'maximize-spell': '',
      'extend-spell': '',
      'quicken-spell': '',
      'silent-spell': '',
      'still-spell': '',
      'scribe-scroll': 'Livello da incantatore 1',
      'brew-potion': 'Livello da incantatore 3',
      'craft-wondrous-item': 'Livello da incantatore 3',
      'craft-magic-arms': 'Livello da incantatore 5',
    },
    benefits: {
      'power-attack': 'Sottrai un valore ai tiri per colpire in mischia per aggiungerlo ai danni.',
      cleave: 'Se abbatti un nemico, puoi attaccare un altro avversario adiacente.',
      'great-cleave': 'Puoi continuare a usare Fendente più volte nello stesso round.',
      'weapon-focus': '+1 ai tiri per colpire con l\'arma scelta.',
      dodge: '+1 alla CA contro un avversario designato.',
      mobility: '+4 alla CA contro gli attacchi di opportunità causati dal movimento.',
      'spring-attack': 'Muoviti, attacca e muoviti di nuovo senza subire attacchi di opportunità.',
      'combat-expertise': 'Scambia bonus di attacco per un pari bonus alla CA.',
      'improved-initiative': '+4 ai tiri di iniziativa.',
      toughness: '+3 punti ferita.',
      'iron-will': '+2 ai tiri salvezza sulla Volontà.',
      'lightning-reflexes': '+2 ai tiri salvezza sui Riflessi.',
      'great-fortitude': '+2 ai tiri salvezza sulla Tempra.',
      'point-blank-shot': '+1 a colpire e ai danni con armi a distanza entro 9 metri.',
      'precise-shot': 'Nessuna penalità per sparare in mischia contro un nemico.',
      'rapid-shot': 'Un attacco extra a distanza con -2 a tutti gli attacchi.',
      'spell-focus': '+1 alla CD dei tiri salvezza di una scuola di magia scelta.',
      'combat-casting': '+4 alle prove di Concentrazione per lanciare in mischia.',
      'empower-spell': 'Aumenta del 50% gli effetti variabili di un incantesimo (slot +2).',
      'maximize-spell': 'Massimizza gli effetti variabili di un incantesimo (slot +3).',
      'extend-spell': 'Raddoppia la durata di un incantesimo (slot +1).',
      'quicken-spell': 'Lancia un incantesimo come azione gratuita (slot +4).',
      'silent-spell': 'Lancia un incantesimo senza componenti verbali (slot +1).',
      'still-spell': 'Lancia un incantesimo senza componenti somatiche (slot +1).',
      'scribe-scroll': 'Crea pergamene magiche.',
      'brew-potion': 'Crea pozioni magiche.',
      'craft-wondrous-item': 'Crea oggetti meravigliosi magici.',
      'craft-magic-arms': 'Crea armi, armature e scudi magici.',
    },
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
    damage: 'Danno',
    critical: 'Critico',
    range: 'Gittata',
    maxDex: 'DES max',
    penalty: 'Penalità',
    weaponNames: {
      dagger: 'Pugnale',
      club: 'Randello',
      'light-mace': 'Mazza leggera',
      'heavy-mace': 'Mazza pesante',
      quarterstaff: 'Bastone ferrato',
      shortspear: 'Lancia corta',
      spear: 'Lancia',
      javelin: 'Giavellotto',
      sling: 'Fionda',
      'light-crossbow': 'Balestra leggera',
      shortsword: 'Spada corta',
      longsword: 'Spada lunga',
      greatsword: 'Spadone',
      rapier: 'Stocco',
      scimitar: 'Scimitarra',
      battleaxe: 'Ascia da battaglia',
      greataxe: 'Ascia bipenne',
      warhammer: 'Martello da guerra',
      shortbow: 'Arco corto',
      longbow: 'Arco lungo',
      'bastard-sword': 'Spada bastarda',
      'dwarven-waraxe': 'Ascia da guerra nanica',
    },
    weaponCategories: {
      simple: 'Semplici',
      martial: 'Marziali',
      exotic: 'Esotiche',
    },
    armorNames: {
      padded: 'Imbottita',
      leather: 'Cuoio',
      'studded-leather': 'Cuoio borchiato',
      'chain-shirt': 'Camicia di maglia',
      hide: 'Pelli',
      'scale-mail': 'Scaglie',
      chainmail: 'Cotta di maglia',
      breastplate: 'Corazza',
      'splint-mail': 'Armatura a stecche',
      'banded-mail': 'Armatura a fasce',
      'half-plate': 'Mezza armatura a piastre',
      'full-plate': 'Armatura a piastre completa',
      buckler: 'Brocco',
      'light-shield': 'Scudo leggero (acciaio)',
      'heavy-shield': 'Scudo pesante (acciaio)',
      'tower-shield': 'Scudo torre',
    },
    armorTypes: {
      light: 'Leggera',
      medium: 'Media',
      heavy: 'Pesante',
      shield: 'Scudo',
    },
    loadCategories: {
      'Leggero': 'Leggero',
      'Medio': 'Medio',
      'Pesante': 'Pesante',
      'Oltre il massimo': 'Oltre il massimo',
    },
  },
  classes: {
    names: {
      barbarian: 'Barbaro',
      bard: 'Bardo',
      cleric: 'Chierico',
      druid: 'Druido',
      fighter: 'Guerriero',
      monk: 'Monaco',
      paladin: 'Paladino',
      ranger: 'Ranger',
      rogue: 'Ladro',
      sorcerer: 'Stregone',
      wizard: 'Mago',
      beguiler: 'Ingannatore',
      duskblade: 'Lama del Crepuscolo',
      knight: 'Cavaliere',
      hexblade: 'Lama Iettatrice',
      swashbuckler: 'Spadaccino',
      'favored-soul': 'Anima Prescelta',
      warlock: 'Warlock',
      warmage: 'Mago da Guerra',
      scout: 'Esploratore',
      spellthief: 'Ladro Magico',
      assassin: 'Assassino',
      'dragon-disciple': 'Discepolo dei Draghi',
      'eldritch-knight': 'Cavaliere Mistico',
      shadowdancer: 'Danzatore delle Ombre',
      'arcane-archer': 'Arciere Arcano',
      loremaster: 'Maestro del Sapere',
    },
    categories: {
      core: 'Base PHB',
      'base-expanded': 'Avanzate',
      prestige: 'Prestigio',
    },
    options: {
      deities: {
        'Pelor': 'Pelor',
        'Kord': 'Kord',
        'Moradin': 'Moradin',
        'Wee Jas': 'Wee Jas',
        'Heironeous': 'Heironeous',
        'Boccob': 'Boccob',
        'St. Cuthbert': 'St. Cuthbert',
        'Olidammara': 'Olidammara',
        'Nerull': 'Nerull',
        'Hextor': 'Hextor',
        'Corellon Larethian': 'Corellon Larethian',
        'Yondalla': 'Yondalla',
        'Gruumsh': 'Gruumsh',
        'Nessuna / Ideale': 'Nessuna / Ideale',
      },
      domains: {
        air: 'Aria',
        animal: 'Animali',
        chaos: 'Caos',
        death: 'Morte',
        destruction: 'Distruzione',
        earth: 'Terra',
        evil: 'Male',
        fire: 'Fuoco',
        good: 'Bene',
        healing: 'Guarigione',
        knowledge: 'Conoscenza',
        law: 'Legge',
        luck: 'Fortuna',
        magic: 'Magia',
        plant: 'Piante',
        protection: 'Protezione',
        strength: 'Forza',
        sun: 'Sole',
        travel: 'Viaggio',
        trickery: 'Inganno',
        war: 'Guerra',
        water: 'Acqua',
      },
      schools: {
        abjuration: 'Abiurazione',
        conjuration: 'Invocazione',
        divination: 'Divinazione',
        enchantment: 'Ammaliamento',
        evocation: 'Evocazione',
        illusion: 'Illusione',
        necromancy: 'Necromanzia',
        transmutation: 'Trasmutazione',
        generalist: 'Generalista',
      },
      familiars: {
        bat: 'Pipistrello',
        cat: 'Gatto',
        hawk: 'Falco',
        lizard: 'Lucertola',
        owl: 'Gufo',
        rat: 'Ratto',
        raven: 'Corvo',
        snake: 'Serpente',
        toad: 'Rospo',
        weasel: 'Donnola',
      },
      familiarBonuses: {
        bat: '+3 Ascoltare',
        cat: '+3 Muoversi Silenziosamente',
        hawk: '+3 Osservare',
        lizard: '+3 Scalare',
        owl: '+3 Osservare',
        rat: '+2 Tempra',
        raven: '+3 Ascoltare / parla',
        snake: '+3 Raggirare',
        toad: '+3 PF',
        weasel: '+2 Riflessi',
      },
      combatStyles: {
        archery: 'Tiro con l\'Arco',
        'two-weapon': 'Combattere con Due Armi',
      },
      favoredEnemies: {
        'Aberrazioni': 'Aberrazioni',
        'Animali': 'Animali',
        'Costrutti': 'Costrutti',
        'Draghi': 'Draghi',
        'Elementali': 'Elementali',
        'Folletti': 'Folletti',
        'Giganti': 'Giganti',
        'Melme': 'Melme',
        'Non Morti': 'Non Morti',
        'Parassiti': 'Parassiti',
        'Umanoidi (Rettili)': 'Umanoidi (Rettili)',
        'Umanoidi (Orchi)': 'Umanoidi (Orchi)',
        'Umanoidi (Goblinoidi)': 'Umanoidi (Goblinoidi)',
        'Umanoidi (Umani)': 'Umanoidi (Umani)',
        'Umanoidi (Elfi)': 'Umanoidi (Elfi)',
        'Esterni (Malvagi)': 'Esterni (Malvagi)',
        'Esterni (Buoni)': 'Esterni (Buoni)',
      },
      animalCompanions: {
        'Lupo': 'Lupo',
        'Tasso': 'Tasso',
        'Falco': 'Falco',
        'Aquila': 'Aquila',
        'Vipera': 'Vipera',
        'Cane': 'Cane',
        'Cane da galoppo': 'Cane da galoppo',
        'Cammello': 'Cammello',
        'Cavallo pesante': 'Cavallo pesante',
      },
      rageVariants: {
        standard: 'Ira Barbarica',
        'whirling-frenzy': 'Frenesia Turbinante',
        'spiritual-lion': 'Totem Leone',
        'spiritual-wolf': 'Totem Lupo',
      },
      rageVariantDescriptions: {
        standard: 'Ira classica: bonus a Forza e Costituzione, penalità alla CA.',
        'whirling-frenzy': 'Variante UA: attacco extra e bonus ai tiri per colpire.',
        'spiritual-lion': 'Totem Leone PHB II: Balzo e attacco in carica.',
        'spiritual-wolf': 'Totem Lupo: Sbilanciare l\'avversario.',
      },
      monkStyles: {
        standard: 'Colpo Senz\'Armi',
        grapple: 'Lottatore',
        stunning: 'Pugno Stordente',
      },
      monkStyleDescriptions: {
        standard: 'Stile classico del colpo senz\'armi.',
        grapple: 'Specializzato in lotta e prese.',
        stunning: 'Specializzato nel colpo stordente.',
      },
    },
  },
  races: {
    names: {
      human: 'Umano',
      elf: 'Elfo',
      dwarf: 'Nano',
      halfling: 'Halfling',
      gnome: 'Gnomo',
      'half-elf': 'Mezzelfo',
      'half-orc': 'Mezzorco',
      aarakocra: 'Aarakocra',
      aasimar: 'Aasimar',
      tiefling: 'Tiefling',
      dragonborn: 'Dragonborn',
      goliath: 'Goliath',
      catfolk: 'Catfolk',
      shifter: 'Shifter',
      changeling: 'Changeling',
      orc: 'Orco',
      goblin: 'Goblin',
      hobgoblin: 'Hobgoblin',
      kobold: 'Coboldo',
      lizardfolk: 'Lucertoloide',
      gnoll: 'Gnoll',
      bugbear: 'Bugbear',
      'half-giant': 'Mezzogigante',
      illumian: 'Illumian',
      raptoran: 'Raptoran',
      spellscale: 'Spellscale',
      warforged: 'Warforged',
      elan: 'Elan',
      maenad: 'Maenad',
      xeph: 'Xeph',
      dromite: 'Dromite',
      drow: 'Drow',
      duergar: 'Duergar',
      svirfneblin: 'Svirfneblin',
      'genasi-air': 'Genasi dell\'Aria',
      'genasi-earth': 'Genasi della Terra',
      'genasi-fire': 'Genasi del Fuoco',
      'genasi-water': 'Genasi dell\'Acqua',
      'thri-kreen': 'Thri-kreen',
      vanara: 'Vanara',
      nezumi: 'Nezumi',
      kender: 'Kender',
      aventi: 'Aventi',
      asherati: 'Asherati',
      azurin: 'Azurin',
      darfellan: 'Darfellan',
      buomman: 'Buomman',
      chaond: 'Chaond',
    },
    types: {
      'Umanoide': 'Umanoide',
      'Umanoide mostruoso': 'Umanoide mostruoso',
      'Esterno': 'Esterno',
      'Gigante': 'Gigante',
      'Costrutto': 'Costrutto',
      'Aberrazione': 'Aberrazione',
    },
    sizes: {
      'Fine': 'Piccolissima',
      'Diminutive': 'Minuscola',
      'Tiny': 'Minuta',
      'Small': 'Piccola',
      'Medium': 'Media',
      'Large': 'Grande',
      'Huge': 'Enorme',
      'Gargantuan': 'Mastodontica',
      'Colossal': 'Colossale',
    },
    traits: {
      human: [
        'Talento bonus al 1° livello',
        '4 punti abilità bonus al 1° livello',
        '+1 punto abilità per livello',
      ],
      elf: [
        'Immunità al sonno magico',
        '+2 a Percezione, Ascoltare e Cercare',
        'Visione crepuscolare',
        'Competenza in arco lungo e spada lunga',
      ],
      dwarf: [
        'Scurovisione 18 metri',
        'Movimento 6 metri anche in armatura',
        '+2 ai tiri salvezza contro veleni',
        'Bonus contro giganti e orchi',
      ],
      halfling: [
        'Taglia Piccola',
        '+2 a Nascondersi e Muoversi Silenziosamente',
        '+1 ai tiri salvezza',
        '+2 a Saltare, Scalare e Raccogliere Informazioni',
      ],
      gnome: [
        'Taglia Piccola',
        'Scurovisione 18 metri',
        '+2 a Nascondersi',
        'Trucchetti da illusione (1/giorno)',
      ],
      'half-elf': [
        'Immunità al sonno magico',
        'Visione crepuscolare',
        '+1 a Percezione, Ascoltare e Cercare',
        '+2 a Diplomazia e Raccogliere Informazioni',
      ],
      'half-orc': [
        'Scurovisione 18 metri',
        'Tempra fisica da mezzorco',
      ],
      aarakocra: [
        'Volo 90m (manovrabilità media)',
        '2 attacchi naturali con artigli',
        '+2 a Artigianato (alchimia) e Conoscenze (natura)',
        '+2 a Ascoltare e Osservare',
      ],
      aasimar: [
        'Resistenze ad acido, freddo ed elettricità 5',
        '+2 a Ascoltare e Osservare',
        'Luce diurna (1/giorno)',
      ],
      tiefling: [
        'Scurovisione 18 metri',
        'Resistenze a freddo, elettricità e fuoco 5',
        '+2 a Raggirare e Nascondersi',
        'Oscurità (1/giorno)',
      ],
      dragonborn: [
        'Sottotipo Draconico',
        '+2 a schivata contro i draghi',
        'Immunità a presenza spaventosa',
        'Arma a soffio, ali o sensi (a scelta)',
      ],
      goliath: [
        'Scurovisione 18 metri',
        'Costituzione Possente (considerato una taglia più grande)',
        '+2 a Percepire Intenzioni',
      ],
      catfolk: [
        'Visione crepuscolare',
        'Armatura naturale +1',
        '+2 a Ascoltare e Muoversi Silenziosamente',
      ],
      shifter: [
        'Visione crepuscolare',
        'Mutaforma (shifting) 1/giorno',
        'Bonus razziale alle abilità in base al tratto',
      ],
      changeling: [
        'Cambiare sembianze (minor change shape)',
        '+2 a Raggirare, Intimidire e Percepire Intenzioni',
        'Sottotipo Mutaforma',
      ],
      orc: [
        'Scurovisione 18 metri',
        'Sensibilità alla luce',
      ],
      goblin: [
        'Scurovisione 18 metri',
        'Taglia Piccola',
        '+4 a Muoversi Silenziosamente e Cavalcare',
      ],
      hobgoblin: [
        'Scurovisione 18 metri',
        '+4 a Muoversi Silenziosamente',
      ],
      kobold: [
        'Scurovisione 18 metri',
        'Armatura naturale +1',
        'Taglia Piccola',
        '+2 a Artigianato (trappole), Nascondersi, Cercare e Muoversi Silenziosamente',
      ],
      lizardfolk: [
        'Armatura naturale +5',
        '2 attacchi naturali (artigli e morso)',
        '+4 a Equilibrio, Saltare e Nuotare',
      ],
      gnoll: [
        'Scurovisione 18 metri',
        'Armatura naturale +1',
        '+2 a Ascoltare e Osservare',
      ],
      bugbear: [
        'Scurovisione 18 metri',
        'Armatura naturale +3',
        '+4 a Muoversi Silenziosamente',
      ],
      'half-giant': [
        'Visione crepuscolare',
        'Potenza (considerato una taglia più grande per lanci e carico)',
        'Tratti da gigante',
      ],
      illumian: [
        'Sigilli luminosi (bonus abilità o incantesimi)',
        '+2 a una abilità basata sui sigilli',
        'Talento bonus al 1° livello',
      ],
      raptoran: [
        'Visione crepuscolare',
        'Volo limitato (a livelli crescenti)',
        '+2 a Osservare e +10 a Saltare',
      ],
      spellscale: [
        'Visione crepuscolare',
        'Sottotipo Draconico',
        'Affinità arcana',
      ],
      warforged: [
        'Costrutto Vivente (immunità parziali)',
        'Armatura composita integrata',
        'Non necessita di mangiare, bere o dormire',
      ],
      elan: [
        'Resistenza psionica',
        'Riparazione (1/giorno)',
        'Tratti da aberrazione',
      ],
      maenad: [
        'Furia interiore (1/giorno)',
        'Talento psionico naturale',
      ],
      xeph: [
        'Scurovisione 18 metri',
        'Scatto psionico (3/giorno)',
      ],
      dromite: [
        'Armatura naturale +3',
        'Taglia Piccola',
        'Energia psionica (1/giorno)',
      ],
      drow: [
        'Scurovisione 36 metri',
        'Immunità al sonno magico',
        'Sensibilità alla luce',
        '+2 a Ascoltare, Cercare e Osservare',
      ],
      duergar: [
        'Scurovisione 36 metri',
        'Immunità a paralisi e veleni',
        '+4 a Muoversi Silenziosamente',
        'Sensibilità alla luce',
      ],
      svirfneblin: [
        'Scurovisione 36 metri',
        'Taglia Piccola',
        '+2 a Artigianato (alchimia), Nascondersi e Ascoltare',
        'Immunità a visioni illusorie',
      ],
      'genasi-air': [
        'Levitazione (1/giorno)',
        'Respiro senza aria',
      ],
      'genasi-earth': [
        'Passo senza tracce (1/giorno)',
        'Affinità con la terra',
      ],
      'genasi-fire': [
        'Resistenza al fuoco 5',
        'Controllo delle fiamme (1/giorno)',
      ],
      'genasi-water': [
        'Nuotare 30m',
        'Respirare sott\'acqua',
        'Creare acqua (1/giorno)',
      ],
      'thri-kreen': [
        'Scurovisione 18 metri',
        'Armatura naturale +3',
        'Quattro braccia (combattere con armi multiple)',
        '+30 a Saltare',
      ],
      vanara: [
        'Scalata 20m',
        '+8 a Scalare',
        '+4 a Equilibrio e Saltare',
      ],
      nezumi: [
        'Visione crepuscolare',
        'Immunità alla corruzione delle Shadowlands',
        '+2 a Nascondersi e Muoversi Silenziosamente',
      ],
      kender: [
        'Immunità alla paura',
        'Taglia Piccola',
        '+2 a Scassinare, Rapidità di Mano e Osservare',
      ],
      aventi: [
        'Nuotare 30m',
        '+8 a Nuotare',
        'Respirare sott\'acqua',
      ],
      asherati: [
        'Armatura naturale +1',
        '+2 a Nascondersi e Muoversi Silenziosamente',
        'Attraversare la sabbia',
      ],
      azurin: [
        'Talento bonus al 1° livello',
        '1 punto essenza bonus',
      ],
      darfellan: [
        'Nuotare 40m',
        '+8 a Nuotare',
        'Morso naturale',
      ],
      buomman: [
        'Visione crepuscolare',
        '+2 a Ascoltare',
        'Canto purificatore',
      ],
      chaond: [
        'Resistenze ad acido, freddo e sonico 5',
        '+2 a Fuggire e Acrobazia',
      ],
    },
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
    speed: 'Speed',
    favoredClass: 'Favored class',
    name: 'Name',
    size: 'Size',
    type: 'Type',
    subtype: 'Subtype',
    racialHitDice: 'Racial hit dice',
    naturalArmor: 'Natural armor',
    abilityModifiers: 'Ability modifiers',
    landSpeed: 'Land',
    burrowSpeed: 'Burrow',
    climbSpeed: 'Climb',
    flySpeed: 'Fly',
    swimSpeed: 'Swim',
    flyManeuverability: 'Flight maneuverability',
    senses: 'Senses',
    darkvision: 'Darkvision (m)',
    blindsense: 'Blindsense (m)',
    blindsight: 'Blindsight (m)',
    lowLightVision: 'Low-light vision',
    scent: 'Scent',
    otherSenses: 'Other senses',
    naturalAttacks: 'Natural attacks (comma-separated)',
    racialTraits: 'Racial traits (one per line)',
    traitsTitle: 'Racial traits',
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
    all: 'All',
    level: 'Level',
    hitDie: 'HD',
    skillPoints: 'skills',
    babGood: 'Good',
    babAverage: 'Average',
    babPoor: 'Poor',
    saveGood: 'Good',
    savePoor: 'Poor',
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
    names: {
      appraise: 'Appraise',
      balance: 'Balance',
      bluff: 'Bluff',
      climb: 'Climb',
      concentration: 'Concentration',
      craft: 'Craft',
      'decipher-script': 'Decipher Script',
      diplomacy: 'Diplomacy',
      'disable-device': 'Disable Device',
      disguise: 'Disguise',
      'escape-artist': 'Escape Artist',
      forgery: 'Forgery',
      'gather-information': 'Gather Information',
      'handle-animal': 'Handle Animal',
      heal: 'Heal',
      hide: 'Hide',
      intimidate: 'Intimidate',
      jump: 'Jump',
      'knowledge-arcana': 'Knowledge (Arcana)',
      'knowledge-architecture': 'Knowledge (Architecture and Engineering)',
      'knowledge-dungeoneering': 'Knowledge (Dungeoneering)',
      'knowledge-geography': 'Knowledge (Geography)',
      'knowledge-history': 'Knowledge (History)',
      'knowledge-local': 'Knowledge (Local)',
      'knowledge-nature': 'Knowledge (Nature)',
      'knowledge-nobility': 'Knowledge (Nobility and Royalty)',
      'knowledge-religion': 'Knowledge (Religion)',
      'knowledge-planes': 'Knowledge (The Planes)',
      listen: 'Listen',
      'move-silently': 'Move Silently',
      'open-lock': 'Open Lock',
      perform: 'Perform',
      profession: 'Profession',
      ride: 'Ride',
      search: 'Search',
      'sense-motive': 'Sense Motive',
      'sleight-of-hand': 'Sleight of Hand',
      spellcraft: 'Spellcraft',
      spot: 'Spot',
      survival: 'Survival',
      swim: 'Swim',
      tumble: 'Tumble',
      'use-magic-device': 'Use Magic Device',
      'use-rope': 'Use Rope',
    },
    descriptions: {
      appraise: 'Determine the value of an object.',
      balance: 'Keep your balance on narrow or slippery surfaces.',
      bluff: 'Deceive, lie, or create diversions.',
      climb: 'Climb walls and steep surfaces.',
      concentration: 'Maintain concentration while distracted.',
      craft: 'Create or repair objects.',
      'decipher-script': 'Interpret ancient or coded texts.',
      diplomacy: 'Influence others through negotiation and manners.',
      'disable-device': 'Disarm traps or sabotage mechanisms.',
      disguise: 'Change your appearance.',
      'escape-artist': 'Free yourself from bonds or tight spaces.',
      forgery: 'Create false documents and imitate handwriting.',
      'gather-information': 'Uncover rumors and news among people.',
      'handle-animal': 'Train and manage animals.',
      heal: 'Treat wounds and stabilize the dying.',
      hide: 'Hide without being seen.',
      intimidate: 'Influence others through threats.',
      jump: 'Jump long or high.',
      'knowledge-arcana': 'Know about arcane magic, spells and constructs.',
      'knowledge-architecture': 'Know about buildings, bridges and structures.',
      'knowledge-dungeoneering': 'Know about caves, aberrations and oozes.',
      'knowledge-geography': 'Know about lands, climates and peoples.',
      'knowledge-history': 'Know about wars, kingdoms and ruins.',
      'knowledge-local': 'Know about legends, personalities and local laws.',
      'knowledge-nature': 'Know about animals, plants and seasons.',
      'knowledge-nobility': 'Know about heraldry, houses and protocol.',
      'knowledge-religion': 'Know about deities, rites and undead.',
      'knowledge-planes': 'Know about the planes and extraplanar creatures.',
      listen: 'Hear sounds and detect stealthy enemies.',
      'move-silently': 'Move without making noise.',
      'open-lock': 'Open locks without a key.',
      perform: 'Entertain with music, dance or acting.',
      profession: 'Practice a paying trade.',
      ride: 'Ride and control a mount.',
      search: 'Find details, traps and secret doors.',
      'sense-motive': 'Tell if someone is lying or hiding something.',
      'sleight-of-hand': 'Pick pockets or conceal small objects.',
      spellcraft: 'Identify spells and magical phenomena.',
      spot: 'Notice details at a distance or hidden enemies.',
      survival: 'Navigate, hunt and follow tracks.',
      swim: 'Swim and move in water.',
      tumble: 'Perform tumbles and acrobatic movements.',
      'use-magic-device': 'Activate magic items without the requirements.',
      'use-rope': 'Tie knots and use ropes.',
    },
  },
  feats: {
    title: 'Feats',
    filter: 'Filter by type',
    all: 'All',
    count: '{{selected}} / {{available}} feats',
    prerequisitesLabel: 'Prerequisites',
    noPrerequisite: 'No prerequisite',
    names: {
      'power-attack': 'Power Attack',
      cleave: 'Cleave',
      'great-cleave': 'Great Cleave',
      'weapon-focus': 'Weapon Focus',
      dodge: 'Dodge',
      mobility: 'Mobility',
      'spring-attack': 'Spring Attack',
      'combat-expertise': 'Combat Expertise',
      'improved-initiative': 'Improved Initiative',
      toughness: 'Toughness',
      'iron-will': 'Iron Will',
      'lightning-reflexes': 'Lightning Reflexes',
      'great-fortitude': 'Great Fortitude',
      'point-blank-shot': 'Point Blank Shot',
      'precise-shot': 'Precise Shot',
      'rapid-shot': 'Rapid Shot',
      'spell-focus': 'Spell Focus',
      'combat-casting': 'Combat Casting',
      'empower-spell': 'Empower Spell',
      'maximize-spell': 'Maximize Spell',
      'extend-spell': 'Extend Spell',
      'quicken-spell': 'Quicken Spell',
      'silent-spell': 'Silent Spell',
      'still-spell': 'Still Spell',
      'scribe-scroll': 'Scribe Scroll',
      'brew-potion': 'Brew Potion',
      'craft-wondrous-item': 'Craft Wondrous Item',
      'craft-magic-arms': 'Craft Magic Arms and Armor',
    },
    types: {
      general: 'General',
      combat: 'Combat',
      metamagic: 'Metamagic',
      item_creation: 'Item Creation',
      racial: 'Racial',
    },
    prerequisites: {
      'power-attack': 'STR 13',
      cleave: 'STR 13, Power Attack',
      'great-cleave': 'STR 13, Power Attack, Cleave',
      'weapon-focus': 'Weapon proficiency, BAB +1',
      dodge: 'DEX 13',
      mobility: 'DEX 13, Dodge',
      'spring-attack': 'DEX 13, Dodge, Mobility, BAB +4',
      'combat-expertise': 'INT 13',
      'improved-initiative': '',
      toughness: '',
      'iron-will': '',
      'lightning-reflexes': '',
      'great-fortitude': '',
      'point-blank-shot': '',
      'precise-shot': 'Point Blank Shot',
      'rapid-shot': 'DEX 13, Point Blank Shot',
      'spell-focus': '',
      'combat-casting': '',
      'empower-spell': '',
      'maximize-spell': '',
      'extend-spell': '',
      'quicken-spell': '',
      'silent-spell': '',
      'still-spell': '',
      'scribe-scroll': 'Caster level 1',
      'brew-potion': 'Caster level 3',
      'craft-wondrous-item': 'Caster level 3',
      'craft-magic-arms': 'Caster level 5',
    },
    benefits: {
      'power-attack': 'Subtract a value from melee attack rolls to add it to damage.',
      cleave: 'If you drop an enemy, you can attack another adjacent opponent.',
      'great-cleave': 'You can keep using Cleave multiple times in the same round.',
      'weapon-focus': '+1 on attack rolls with the chosen weapon.',
      dodge: '+1 to AC against a designated opponent.',
      mobility: '+4 to AC against attacks of opportunity caused by movement.',
      'spring-attack': 'Move, attack, and move again without provoking attacks of opportunity.',
      'combat-expertise': 'Trade attack bonus for an equal bonus to AC.',
      'improved-initiative': '+4 on initiative rolls.',
      toughness: '+3 hit points.',
      'iron-will': '+2 on Will saving throws.',
      'lightning-reflexes': '+2 on Reflex saving throws.',
      'great-fortitude': '+2 on Fortitude saving throws.',
      'point-blank-shot': '+1 on attack and damage rolls with ranged weapons within 30 feet.',
      'precise-shot': 'No penalty for shooting into melee against an enemy.',
      'rapid-shot': 'One extra ranged attack with -2 to all attacks.',
      'spell-focus': '+1 to the save DC of a chosen school of magic.',
      'combat-casting': '+4 on Concentration checks to cast in melee.',
      'empower-spell': 'Increase the variable effects of a spell by 50% (slot +2).',
      'maximize-spell': 'Maximize the variable effects of a spell (slot +3).',
      'extend-spell': 'Double the duration of a spell (slot +1).',
      'quicken-spell': 'Cast a spell as a free action (slot +4).',
      'silent-spell': 'Cast a spell without verbal components (slot +1).',
      'still-spell': 'Cast a spell without somatic components (slot +1).',
      'scribe-scroll': 'Create magic scrolls.',
      'brew-potion': 'Create magic potions.',
      'craft-wondrous-item': 'Create magic wondrous items.',
      'craft-magic-arms': 'Create magic weapons, armor and shields.',
    },
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
    damage: 'Damage',
    critical: 'Critical',
    range: 'Range',
    maxDex: 'Max DEX',
    penalty: 'Penalty',
    weaponNames: {
      dagger: 'Dagger',
      club: 'Club',
      'light-mace': 'Light Mace',
      'heavy-mace': 'Heavy Mace',
      quarterstaff: 'Quarterstaff',
      shortspear: 'Shortspear',
      spear: 'Spear',
      javelin: 'Javelin',
      sling: 'Sling',
      'light-crossbow': 'Light Crossbow',
      shortsword: 'Shortsword',
      longsword: 'Longsword',
      greatsword: 'Greatsword',
      rapier: 'Rapier',
      scimitar: 'Scimitar',
      battleaxe: 'Battleaxe',
      greataxe: 'Greataxe',
      warhammer: 'Warhammer',
      shortbow: 'Shortbow',
      longbow: 'Longbow',
      'bastard-sword': 'Bastard Sword',
      'dwarven-waraxe': 'Dwarven Waraxe',
    },
    weaponCategories: {
      simple: 'Simple',
      martial: 'Martial',
      exotic: 'Exotic',
    },
    armorNames: {
      padded: 'Padded',
      leather: 'Leather',
      'studded-leather': 'Studded Leather',
      'chain-shirt': 'Chain Shirt',
      hide: 'Hide',
      'scale-mail': 'Scale Mail',
      chainmail: 'Chainmail',
      breastplate: 'Breastplate',
      'splint-mail': 'Splint Mail',
      'banded-mail': 'Banded Mail',
      'half-plate': 'Half-Plate',
      'full-plate': 'Full Plate',
      buckler: 'Buckler',
      'light-shield': 'Light Shield (steel)',
      'heavy-shield': 'Heavy Shield (steel)',
      'tower-shield': 'Tower Shield',
    },
    armorTypes: {
      light: 'Light',
      medium: 'Medium',
      heavy: 'Heavy',
      shield: 'Shield',
    },
    loadCategories: {
      'Leggero': 'Light',
      'Medio': 'Medium',
      'Pesante': 'Heavy',
      'Oltre il massimo': 'Over maximum',
    },
  },
  classes: {
    names: {
      barbarian: 'Barbarian',
      bard: 'Bard',
      cleric: 'Cleric',
      druid: 'Druid',
      fighter: 'Fighter',
      monk: 'Monk',
      paladin: 'Paladin',
      ranger: 'Ranger',
      rogue: 'Rogue',
      sorcerer: 'Sorcerer',
      wizard: 'Wizard',
      beguiler: 'Beguiler',
      duskblade: 'Duskblade',
      knight: 'Knight',
      hexblade: 'Hexblade',
      swashbuckler: 'Swashbuckler',
      'favored-soul': 'Favored Soul',
      warlock: 'Warlock',
      warmage: 'Warmage',
      scout: 'Scout',
      spellthief: 'Spellthief',
      assassin: 'Assassin',
      'dragon-disciple': 'Dragon Disciple',
      'eldritch-knight': 'Eldritch Knight',
      shadowdancer: 'Shadowdancer',
      'arcane-archer': 'Arcane Archer',
      loremaster: 'Loremaster',
    },
    categories: {
      core: 'Core PHB',
      'base-expanded': 'Base Expanded',
      prestige: 'Prestige',
    },
    options: {
      deities: {
        'Pelor': 'Pelor',
        'Kord': 'Kord',
        'Moradin': 'Moradin',
        'Wee Jas': 'Wee Jas',
        'Heironeous': 'Heironeous',
        'Boccob': 'Boccob',
        'St. Cuthbert': 'St. Cuthbert',
        'Olidammara': 'Olidammara',
        'Nerull': 'Nerull',
        'Hextor': 'Hextor',
        'Corellon Larethian': 'Corellon Larethian',
        'Yondalla': 'Yondalla',
        'Gruumsh': 'Gruumsh',
        'Nessuna / Ideale': 'None / Ideal',
      },
      domains: {
        air: 'Air',
        animal: 'Animal',
        chaos: 'Chaos',
        death: 'Death',
        destruction: 'Destruction',
        earth: 'Earth',
        evil: 'Evil',
        fire: 'Fire',
        good: 'Good',
        healing: 'Healing',
        knowledge: 'Knowledge',
        law: 'Law',
        luck: 'Luck',
        magic: 'Magic',
        plant: 'Plant',
        protection: 'Protection',
        strength: 'Strength',
        sun: 'Sun',
        travel: 'Travel',
        trickery: 'Trickery',
        war: 'War',
        water: 'Water',
      },
      schools: {
        abjuration: 'Abjuration',
        conjuration: 'Conjuration',
        divination: 'Divination',
        enchantment: 'Enchantment',
        evocation: 'Evocation',
        illusion: 'Illusion',
        necromancy: 'Necromancy',
        transmutation: 'Transmutation',
        generalist: 'Generalist',
      },
      familiars: {
        bat: 'Bat',
        cat: 'Cat',
        hawk: 'Hawk',
        lizard: 'Lizard',
        owl: 'Owl',
        rat: 'Rat',
        raven: 'Raven',
        snake: 'Snake',
        toad: 'Toad',
        weasel: 'Weasel',
      },
      familiarBonuses: {
        bat: '+3 Listen',
        cat: '+3 Move Silently',
        hawk: '+3 Spot',
        lizard: '+3 Climb',
        owl: '+3 Spot',
        rat: '+2 Fortitude',
        raven: '+3 Listen / speaks',
        snake: '+3 Bluff',
        toad: '+3 HP',
        weasel: '+2 Reflex',
      },
      combatStyles: {
        archery: 'Archery',
        'two-weapon': 'Two-Weapon Fighting',
      },
      favoredEnemies: {
        'Aberrazioni': 'Aberrations',
        'Animali': 'Animals',
        'Costrutti': 'Constructs',
        'Draghi': 'Dragons',
        'Elementali': 'Elementals',
        'Folletti': 'Fey',
        'Giganti': 'Giants',
        'Melme': 'Oozes',
        'Non Morti': 'Undead',
        'Parassiti': 'Vermin',
        'Umanoidi (Rettili)': 'Humanoids (Reptilian)',
        'Umanoidi (Orchi)': 'Humanoids (Orc)',
        'Umanoidi (Goblinoidi)': 'Humanoids (Goblinoid)',
        'Umanoidi (Umani)': 'Humanoids (Human)',
        'Umanoidi (Elfi)': 'Humanoids (Elf)',
        'Esterni (Malvagi)': 'Outsiders (Evil)',
        'Esterni (Buoni)': 'Outsiders (Good)',
      },
      animalCompanions: {
        'Lupo': 'Wolf',
        'Tasso': 'Badger',
        'Falco': 'Hawk',
        'Aquila': 'Eagle',
        'Vipera': 'Viper',
        'Cane': 'Dog',
        'Cane da galoppo': 'Riding Dog',
        'Cammello': 'Camel',
        'Cavallo pesante': 'Heavy Horse',
      },
      rageVariants: {
        standard: 'Barbarian Rage',
        'whirling-frenzy': 'Whirling Frenzy',
        'spiritual-lion': 'Lion Totem',
        'spiritual-wolf': 'Wolf Totem',
      },
      rageVariantDescriptions: {
        standard: 'Classic rage: bonus to Strength and Constitution, penalty to AC.',
        'whirling-frenzy': 'UA variant: extra attack and bonus to attack rolls.',
        'spiritual-lion': 'PHB II Lion Totem: Pounce and charging attack.',
        'spiritual-wolf': 'Wolf Totem: Trip an opponent.',
      },
      monkStyles: {
        standard: 'Unarmed Strike',
        grapple: 'Grappler',
        stunning: 'Stunning Fist',
      },
      monkStyleDescriptions: {
        standard: 'Classic unarmed strike style.',
        grapple: 'Specialized in grappling and holds.',
        stunning: 'Specialized in stunning fist.',
      },
    },
  },
  races: {
    names: {
      human: 'Human',
      elf: 'Elf',
      dwarf: 'Dwarf',
      halfling: 'Halfling',
      gnome: 'Gnome',
      'half-elf': 'Half-Elf',
      'half-orc': 'Half-Orc',
      aarakocra: 'Aarakocra',
      aasimar: 'Aasimar',
      tiefling: 'Tiefling',
      dragonborn: 'Dragonborn',
      goliath: 'Goliath',
      catfolk: 'Catfolk',
      shifter: 'Shifter',
      changeling: 'Changeling',
      orc: 'Orc',
      goblin: 'Goblin',
      hobgoblin: 'Hobgoblin',
      kobold: 'Kobold',
      lizardfolk: 'Lizardfolk',
      gnoll: 'Gnoll',
      bugbear: 'Bugbear',
      'half-giant': 'Half-Giant',
      illumian: 'Illumian',
      raptoran: 'Raptoran',
      spellscale: 'Spellscale',
      warforged: 'Warforged',
      elan: 'Elan',
      maenad: 'Maenad',
      xeph: 'Xeph',
      dromite: 'Dromite',
      drow: 'Drow',
      duergar: 'Duergar',
      svirfneblin: 'Svirfneblin',
      'genasi-air': 'Air Genasi',
      'genasi-earth': 'Earth Genasi',
      'genasi-fire': 'Fire Genasi',
      'genasi-water': 'Water Genasi',
      'thri-kreen': 'Thri-kreen',
      vanara: 'Vanara',
      nezumi: 'Nezumi',
      kender: 'Kender',
      aventi: 'Aventi',
      asherati: 'Asherati',
      azurin: 'Azurin',
      darfellan: 'Darfellan',
      buomman: 'Buomman',
      chaond: 'Chaond',
    },
    types: {
      'Umanoide': 'Humanoid',
      'Umanoide mostruoso': 'Monstrous Humanoid',
      'Esterno': 'Outsider',
      'Gigante': 'Giant',
      'Costrutto': 'Construct',
      'Aberrazione': 'Aberration',
    },
    sizes: {
      'Fine': 'Fine',
      'Diminutive': 'Diminutive',
      'Tiny': 'Tiny',
      'Small': 'Small',
      'Medium': 'Medium',
      'Large': 'Large',
      'Huge': 'Huge',
      'Gargantuan': 'Gargantuan',
      'Colossal': 'Colossal',
    },
    traits: {
      human: [
        'Bonus feat at 1st level',
        '4 bonus skill points at 1st level',
        '+1 skill point per level',
      ],
      elf: [
        'Immunity to magical sleep',
        '+2 to Spot, Listen and Search',
        'Low-light vision',
        'Proficiency with longbow and longsword',
      ],
      dwarf: [
        'Darkvision 60 ft.',
        'Speed 20 ft. even in armor',
        '+2 on saves against poison',
        'Bonus against giants and orcs',
      ],
      halfling: [
        'Small size',
        '+2 to Hide and Move Silently',
        '+1 on all saving throws',
        '+2 to Jump, Climb and Gather Information',
      ],
      gnome: [
        'Small size',
        'Darkvision 60 ft.',
        '+2 to Hide',
        'Illusion cantrips (1/day)',
      ],
      'half-elf': [
        'Immunity to magical sleep',
        'Low-light vision',
        '+1 to Spot, Listen and Search',
        '+2 to Diplomacy and Gather Information',
      ],
      'half-orc': [
        'Darkvision 60 ft.',
        'Half-orc toughness',
      ],
      aarakocra: [
        'Flight 90 ft. (average maneuverability)',
        '2 natural claw attacks',
        '+2 to Craft (alchemy) and Knowledge (nature)',
        '+2 to Listen and Spot',
      ],
      aasimar: [
        'Resistances to acid, cold and electricity 5',
        '+2 to Listen and Spot',
        'Daylight (1/day)',
      ],
      tiefling: [
        'Darkvision 60 ft.',
        'Resistances to cold, electricity and fire 5',
        '+2 to Bluff and Hide',
        'Darkness (1/day)',
      ],
      dragonborn: [
        'Draconic subtype',
        '+2 dodge against dragons',
        'Immunity to frightful presence',
        'Breath weapon, wings or senses (choice)',
      ],
      goliath: [
        'Darkvision 60 ft.',
        'Powerful Build (treated as one size larger)',
        '+2 to Sense Motive',
      ],
      catfolk: [
        'Low-light vision',
        'Natural armor +1',
        '+2 to Listen and Move Silently',
      ],
      shifter: [
        'Low-light vision',
        'Shifting (1/day)',
        'Racial bonus to skills based on trait',
      ],
      changeling: [
        'Change shape (minor change shape)',
        '+2 to Bluff, Intimidate and Sense Motive',
        'Shapechanger subtype',
      ],
      orc: [
        'Darkvision 60 ft.',
        'Light sensitivity',
      ],
      goblin: [
        'Darkvision 60 ft.',
        'Small size',
        '+4 to Move Silently and Ride',
      ],
      hobgoblin: [
        'Darkvision 60 ft.',
        '+4 to Move Silently',
      ],
      kobold: [
        'Darkvision 60 ft.',
        'Natural armor +1',
        'Small size',
        '+2 to Craft (trapmaking), Hide, Search and Move Silently',
      ],
      lizardfolk: [
        'Natural armor +5',
        '2 natural attacks (claws and bite)',
        '+4 to Balance, Jump and Swim',
      ],
      gnoll: [
        'Darkvision 60 ft.',
        'Natural armor +1',
        '+2 to Listen and Spot',
      ],
      bugbear: [
        'Darkvision 60 ft.',
        'Natural armor +3',
        '+4 to Move Silently',
      ],
      'half-giant': [
        'Low-light vision',
        'Powerful Build (treated as one size larger for throws and carrying)',
        'Giant traits',
      ],
      illumian: [
        'Luminous sigils (skill or spell bonus)',
        '+2 to a skill based on sigils',
        'Bonus feat at 1st level',
      ],
      raptoran: [
        'Low-light vision',
        'Limited flight (at higher levels)',
        '+2 to Spot and +10 to Jump',
      ],
      spellscale: [
        'Low-light vision',
        'Draconic subtype',
        'Arcane affinity',
      ],
      warforged: [
        'Living Construct (partial immunities)',
        'Integrated composite armor',
        'Does not need to eat, drink or sleep',
      ],
      elan: [
        'Psionic resistance',
        'Repair (1/day)',
        'Aberration traits',
      ],
      maenad: [
        'Inner fury (1/day)',
        'Natural psionic talent',
      ],
      xeph: [
        'Darkvision 60 ft.',
        'Psionic burst (3/day)',
      ],
      dromite: [
        'Natural armor +3',
        'Small size',
        'Psionic energy (1/day)',
      ],
      drow: [
        'Darkvision 120 ft.',
        'Immunity to magical sleep',
        'Light sensitivity',
        '+2 to Listen, Search and Spot',
      ],
      duergar: [
        'Darkvision 120 ft.',
        'Immunity to paralysis and poisons',
        '+4 to Move Silently',
        'Light sensitivity',
      ],
      svirfneblin: [
        'Darkvision 120 ft.',
        'Small size',
        '+2 to Craft (alchemy), Hide and Listen',
        'Immunity to illusions',
      ],
      'genasi-air': [
        'Levitate (1/day)',
        'Air breathing',
      ],
      'genasi-earth': [
        'Pass without trace (1/day)',
        'Earth affinity',
      ],
      'genasi-fire': [
        'Fire resistance 5',
        'Control flames (1/day)',
      ],
      'genasi-water': [
        'Swim 30 ft.',
        'Breathe underwater',
        'Create water (1/day)',
      ],
      'thri-kreen': [
        'Darkvision 60 ft.',
        'Natural armor +3',
        'Four arms (fight with multiple weapons)',
        '+30 to Jump',
      ],
      vanara: [
        'Climb 20 ft.',
        '+8 to Climb',
        '+4 to Balance and Jump',
      ],
      nezumi: [
        'Low-light vision',
        'Immunity to Shadowlands corruption',
        '+2 to Hide and Move Silently',
      ],
      kender: [
        'Immunity to fear',
        'Small size',
        '+2 to Open Lock, Sleight of Hand and Spot',
      ],
      aventi: [
        'Swim 30 ft.',
        '+8 to Swim',
        'Breathe underwater',
      ],
      asherati: [
        'Natural armor +1',
        '+2 to Hide and Move Silently',
        'Sand stride',
      ],
      azurin: [
        'Bonus feat at 1st level',
        '1 bonus point of essentia',
      ],
      darfellan: [
        'Swim 40 ft.',
        '+8 to Swim',
        'Natural bite',
      ],
      buomman: [
        'Low-light vision',
        '+2 to Listen',
        'Purifying chant',
      ],
      chaond: [
        'Resistances to acid, cold and sonic 5',
        '+2 to Escape Artist and Tumble',
      ],
    },
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
    let value: DictionaryValue | undefined = this.currentDictionary();
    for (const segment of key.split('.')) {
      if (typeof value !== 'object' || value === null || Array.isArray(value)) {
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

  getClassName(id: string): string {
    return this.lookup('classes.names', id) ?? id;
  }

  getClassCategoryName(category: string): string {
    return this.lookup('classes.categories', category) ?? category;
  }

  getDeityName(deity: string): string {
    return this.lookup('classes.options.deities', deity) ?? deity;
  }

  getDomainName(domainId: string): string {
    return this.lookup('classes.options.domains', domainId) ?? domainId;
  }

  getSchoolName(schoolId: string): string {
    return this.lookup('classes.options.schools', schoolId) ?? schoolId;
  }

  getFamiliarName(familiarId: string): string {
    return this.lookup('classes.options.familiars', familiarId) ?? familiarId;
  }

  getFamiliarBonus(familiarId: string): string {
    return this.lookup('classes.options.familiarBonuses', familiarId) ?? '';
  }

  getCombatStyleName(styleId: string): string {
    return this.lookup('classes.options.combatStyles', styleId) ?? styleId;
  }

  getFavoredEnemyName(enemy: string): string {
    return this.lookup('classes.options.favoredEnemies', enemy) ?? enemy;
  }

  getAnimalCompanionName(companion: string): string {
    return this.lookup('classes.options.animalCompanions', companion) ?? companion;
  }

  getRageVariantName(variantId: string): string {
    return this.lookup('classes.options.rageVariants', variantId) ?? variantId;
  }

  getRageVariantDescription(variantId: string): string {
    return this.lookup('classes.options.rageVariantDescriptions', variantId) ?? '';
  }

  getMonkStyleName(styleId: string): string {
    return this.lookup('classes.options.monkStyles', styleId) ?? styleId;
  }

  getMonkStyleDescription(styleId: string): string {
    return this.lookup('classes.options.monkStyleDescriptions', styleId) ?? '';
  }

  getSkillName(id: string): string {
    return this.lookup('skills.names', id) ?? id;
  }

  getSkillNameFor(language: SupportedLanguage, skillId: string): string {
    return this.lookupIn(language, 'skills.names', skillId) ?? skillId;
  }

  getSkillDescription(id: string): string {
    return this.lookup('skills.descriptions', id) ?? '';
  }

  getRaceName(id: string): string {
    return this.lookup('races.names', id) ?? id;
  }

  getRaceTypeName(type: string): string {
    return this.lookup('races.types', type) ?? type;
  }

  getRaceTraits(raceId: string): string[] {
    return this.lookupArray('races.traits', raceId) ?? [];
  }

  getSizeName(size: string): string {
    return this.lookup('races.sizes', size) ?? size;
  }

  getFeatName(id: string): string {
    return this.lookup('feats.names', id) ?? id;
  }

  getFeatPrerequisite(id: string): string {
    return this.lookup('feats.prerequisites', id) ?? '';
  }

  getFeatBenefit(id: string): string {
    return this.lookup('feats.benefits', id) ?? '';
  }

  getFeatTypeName(type: string): string {
    return this.lookup('feats.types', type) ?? type;
  }

  getWeaponName(id: string): string {
    return this.lookup('equipment.weaponNames', id) ?? id;
  }

  getWeaponCategoryName(category: string): string {
    return this.lookup('equipment.weaponCategories', category) ?? category;
  }

  getArmorName(id: string): string {
    return this.lookup('equipment.armorNames', id) ?? id;
  }

  getArmorTypeName(type: string): string {
    return this.lookup('equipment.armorTypes', type) ?? type;
  }

  getLoadCategoryName(load: string): string {
    return this.lookup('equipment.loadCategories', load) ?? load;
  }

  private lookup(path: string, key: string): string | undefined {
    const value = this.resolve(this.currentLang(), path, key);
    return typeof value === 'string' ? value : undefined;
  }

  private lookupArray(path: string, key: string): string[] | undefined {
    const value = this.resolve(this.currentLang(), path, key);
    return Array.isArray(value) ? value : undefined;
  }

  private lookupIn(language: SupportedLanguage, path: string, key: string): string | undefined {
    const value = this.resolve(language, path, key);
    return typeof value === 'string' ? value : undefined;
  }

  private resolve(
    language: SupportedLanguage,
    path: string,
    key: string,
  ): DictionaryValue | undefined {
    let value: DictionaryValue | undefined = DICTIONARIES[language];
    for (const segment of path.split('.')) {
      if (typeof value !== 'object' || value === null || Array.isArray(value)) {
        return undefined;
      }
      value = value[segment];
    }

    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
      return undefined;
    }

    return value[key];
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
