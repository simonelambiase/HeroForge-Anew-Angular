export type FeatType = 'general' | 'combat' | 'metamagic' | 'item_creation' | 'racial';

export interface Feat {
  id: string;
  name: string;
  type: FeatType;
  prerequisites: string;
  benefit: string;
}

export const FEAT_TYPE_LABELS: Readonly<Record<FeatType, string>> = {
  general: 'Generale',
  combat: 'Combattimento',
  metamagic: 'Metamagia',
  item_creation: 'Creazione Oggetti',
  racial: 'Razziale',
};

export const FEATS: readonly Feat[] = [
  {
    id: 'power-attack',
    name: 'Attacco Poderoso',
    type: 'combat',
    prerequisites: 'FOR 13',
    benefit: 'Sottrai un valore ai tiri per colpire in mischia per aggiungerlo ai danni.',
  },
  {
    id: 'cleave',
    name: 'Fendente',
    type: 'combat',
    prerequisites: 'FOR 13, Attacco Poderoso',
    benefit: 'Se abbatti un nemico, puoi attaccare un altro avversario adiacente.',
  },
  {
    id: 'great-cleave',
    name: 'Grande Fendente',
    type: 'combat',
    prerequisites: 'FOR 13, Attacco Poderoso, Fendente',
    benefit: 'Puoi continuare a usare Fendente più volte nello stesso round.',
  },
  {
    id: 'weapon-focus',
    name: 'Arma Focalizzata',
    type: 'combat',
    prerequisites: 'Competenza nell\'arma, BAB +1',
    benefit: '+1 ai tiri per colpire con l\'arma scelta.',
  },
  {
    id: 'dodge',
    name: 'Schivare',
    type: 'combat',
    prerequisites: 'DES 13',
    benefit: '+1 alla CA contro un avversario designato.',
  },
  {
    id: 'mobility',
    name: 'Mobilità',
    type: 'combat',
    prerequisites: 'DES 13, Schivare',
    benefit: '+4 alla CA contro gli attacchi di opportunità causati dal movimento.',
  },
  {
    id: 'spring-attack',
    name: 'Attacco in Movimento',
    type: 'combat',
    prerequisites: 'DES 13, Schivare, Mobilità, BAB +4',
    benefit: 'Muoviti, attacca e muoviti di nuovo senza subire attacchi di opportunità.',
  },
  {
    id: 'combat-expertise',
    name: 'Competenza in Combattimento',
    type: 'combat',
    prerequisites: 'INT 13',
    benefit: 'Scambia bonus di attacco per un pari bonus alla CA.',
  },
  {
    id: 'improved-initiative',
    name: 'Iniziativa Migliorata',
    type: 'combat',
    prerequisites: '',
    benefit: '+4 ai tiri di iniziativa.',
  },
  {
    id: 'toughness',
    name: 'Robustezza',
    type: 'general',
    prerequisites: '',
    benefit: '+3 punti ferita.',
  },
  {
    id: 'iron-will',
    name: 'Volontà di Ferro',
    type: 'general',
    prerequisites: '',
    benefit: '+2 ai tiri salvezza sulla Volontà.',
  },
  {
    id: 'lightning-reflexes',
    name: 'Riflessi Fulminei',
    type: 'general',
    prerequisites: '',
    benefit: '+2 ai tiri salvezza sui Riflessi.',
  },
  {
    id: 'great-fortitude',
    name: 'Tempra Eccezionale',
    type: 'general',
    prerequisites: '',
    benefit: '+2 ai tiri salvezza sulla Tempra.',
  },
  {
    id: 'point-blank-shot',
    name: 'Tiro Ravvicinato',
    type: 'combat',
    prerequisites: '',
    benefit: '+1 a colpire e ai danni con armi a distanza entro 9 metri.',
  },
  {
    id: 'precise-shot',
    name: 'Tiro Preciso',
    type: 'combat',
    prerequisites: 'Tiro Ravvicinato',
    benefit: 'Nessuna penalità per sparare in mischia contro un nemico.',
  },
  {
    id: 'rapid-shot',
    name: 'Tiro Rapido',
    type: 'combat',
    prerequisites: 'DES 13, Tiro Ravvicinato',
    benefit: 'Un attacco extra a distanza con -2 a tutti gli attacchi.',
  },
  {
    id: 'spell-focus',
    name: 'Focalizzare Incantesimo',
    type: 'general',
    prerequisites: '',
    benefit: '+1 alla CD dei tiri salvezza di una scuola di magia scelta.',
  },
  {
    id: 'combat-casting',
    name: 'Combattimento con Incantesimi',
    type: 'combat',
    prerequisites: '',
    benefit: '+4 alle prove di Concentrazione per lanciare in mischia.',
  },
  {
    id: 'empower-spell',
    name: 'Incantesimo Potenziato',
    type: 'metamagic',
    prerequisites: '',
    benefit: 'Aumenta del 50% gli effetti variabili di un incantesimo (slot +2).',
  },
  {
    id: 'maximize-spell',
    name: 'Incantesimo Massimizzato',
    type: 'metamagic',
    prerequisites: '',
    benefit: 'Massimizza gli effetti variabili di un incantesimo (slot +3).',
  },
  {
    id: 'extend-spell',
    name: 'Incantesimo Esteso',
    type: 'metamagic',
    prerequisites: '',
    benefit: 'Raddoppia la durata di un incantesimo (slot +1).',
  },
  {
    id: 'quicken-spell',
    name: 'Incantesimo Rapido',
    type: 'metamagic',
    prerequisites: '',
    benefit: 'Lancia un incantesimo come azione gratuita (slot +4).',
  },
  {
    id: 'silent-spell',
    name: 'Incantesimo Silenzioso',
    type: 'metamagic',
    prerequisites: '',
    benefit: 'Lancia un incantesimo senza componenti verbali (slot +1).',
  },
  {
    id: 'still-spell',
    name: 'Incantesimo Immobile',
    type: 'metamagic',
    prerequisites: '',
    benefit: 'Lancia un incantesimo senza componenti somatiche (slot +1).',
  },
  {
    id: 'scribe-scroll',
    name: 'Scrivere Pergamene',
    type: 'item_creation',
    prerequisites: 'Livello da incantatore 1',
    benefit: 'Crea pergamene magiche.',
  },
  {
    id: 'brew-potion',
    name: 'Preparare Pozioni',
    type: 'item_creation',
    prerequisites: 'Livello da incantatore 3',
    benefit: 'Crea pozioni magiche.',
  },
  {
    id: 'craft-wondrous-item',
    name: 'Creare Oggetti Meravigliosi',
    type: 'item_creation',
    prerequisites: 'Livello da incantatore 3',
    benefit: 'Crea oggetti meravigliosi magici.',
  },
  {
    id: 'craft-magic-arms',
    name: 'Creare Armi e Armature Magiche',
    type: 'item_creation',
    prerequisites: 'Livello da incantatore 5',
    benefit: 'Crea armi, armature e scudi magici.',
  },
];
