[🇬🇧 English Version](README.md)

# HeroForge-Anew-Angular

> **Creatore di Personaggi & Motore di Regole per D&D 3.5**

Rifacimento web moderno e reattivo del leggendario foglio **HeroForge Anew** per D&D 3.5 di
[Heliomance](https://github.com/Heliomance/HeroForge-Anew). Il fascicolo Excel originale
(`HeroForge Anew 3.5 v7.4.0.1.xlsm`) è conservato in questo repository come implementazione di
riferimento, mentre l'applicazione re-implementa le sue regole e formule come builder eseguibile nel
browser.

L'obiettivo è un creatore di personaggi che mantenga il *rigore matematico* del foglio originale,
offrendo allo stesso tempo un'interfaccia veloce, accessibile e multilingua basata su Angular
moderno.

---

## Dichiarazione di Trasparenza AI — AI Coding Supervisionato, NON Vibe Coding

Questo progetto è stato realizzato mediante **AI Coding Supervisionato**. È importante essere
espliciti su cosa significhi, perché **non** è la stessa cosa del "vibe coding".

- **Non è codice generato alla cieca.** Il vibe coding produce output che "sembra corretto" e viene
  pubblicato senza verifica. HeroForge-Anew-Angular è l'opposto: è codice assistito dall'AI, ma
  rivisto, formalizzato e testato in ogni fase.
- **Ogni regola è verificata contro la fonte di verità.** Ogni regola matematica qui implementata —
  Bonus di Attacco Base (BAB), tiri salvezza, capacità di carico, costi dei punti abilità, costo del
  point buy, attacchi iterativi e altro — è stata verificata formalmente e coperta da test automatici
  contro le formule originali del **foglio Excel HeroForge Anew** e dell'**SRD D&D 3.5**.
- **Supervisionato da umani.** Le decisioni architetturali, i criteri di accettazione e la qualità
  finale appartengono agli umani. L'AI accelera l'esecuzione; non sostituisce il giudizio né la
  responsabilità.

La suite di test di conformità si trova in
[`frontend/src/app/core/services/character-rules-excel-compliance.spec.ts`](frontend/src/app/core/services/character-rules-excel-compliance.spec.ts)
e codifica i valori attesi (ad es. la tabella dei costi del point buy, la tabella dell'esperienza
`L * (L - 1) / 2 * 1000`, le progressioni del BAB, le formule dei tiri salvezza base) direttamente
dall'SRD e da HeroForge Anew.

---

## Il Workflow Agentico

Questo repository è realizzato con una **pipeline multi-agente supervisionata da umani**, non da un
singolo modello in una finestra di chat:

| Ruolo | Agente | Responsabilità |
| --- | --- | --- |
| **Orchestratore & Supervisore** | **Google Antigravity** | Pianificazione di alto livello, scomposizione architetturale in moduli, definizione dei criteri di accettazione e supervisione della qualità. |
| **Motore di Esecuzione Distribuita** | **Jean (Collabsio)** | Esecuzione agentica: agenti CommandCode basati su modelli **DeepSeek**, operanti su **worktree Git isolati** così che i task paralleli non interferiscano tra loro. |
| **Supervisore Umano** | **Simone Lambiase** | Direzione strategica, validazione funzionale e approvazione finale. |

Leggi la metodologia completa in **[`AGENT.it.md`](AGENT.it.md)** (English: [`AGENT.md`](AGENT.md)).

---

## Funzionalità Principali

- **Frontend moderno Angular 21** basato su **Signals** con change detection **zoneless** (senza
  Zone.js).
- **Conformità al 100%** con le regole e le formule del foglio Excel HeroForge Anew, garantita da una
  suite di test formali di conformità.
- **i18n nativo**: selettore dinamico di lingua **Italiano / Inglese** commutabile a runtime, con
  scelta persistita nel browser.
- **Catalogo completo**: razze, classi, opzioni e specializzazioni di classe, talenti, abilità,
  equipaggiamento, più un **costruttore di razze personalizzate** e un catalogo di creature
  (`data/CreatureInfo.csv`).
- **Assistente AI OpenRouter integrato** nel builder: consigli sulle build, generazione di lore
  narrativa e chat sulle regole di D&D 3.5 (modello configurabile, da `DeepSeek V3` a
  `Claude 3.5 Sonnet`).
- **Esportazione JSON** dei dati del personaggio e **anteprima della scheda** pronta per la stampa.

---

## Copyright, Riferimenti e Licenza

- **Opera originale.** HeroForge Anew è stato creato da **Heliomance**:
  <https://github.com/Heliomance/HeroForge-Anew>. Ogni merito per il motore di regole, il modello dati
  e le formule originali appartiene al suo autore e ai suoi contributori. Questo progetto è una
  re-implementazione web derivata e non rivendica la proprietà del foglio di calcolo originale.
- **Dungeons & Dragons 3.5.** Dungeons & Dragons e D&D 3.5 sono marchi di **Wizards of the Coast**.
  Le regole qui referenziate sono utilizzate secondo la **Open Game License (OGL)**. Questo progetto
  non è affiliato, approvato o sponsorizzato da Wizards of the Coast.
- **Manuali.** Il riferimento a qualsiasi manuale (ad es. la serie *Complete*, *Player's Guide to
  Faerûn*) è fatto solo per finalità di compatibilità e resta di proprietà dei rispettivi titolari
  dei diritti.

---

## Quickstart e Sviluppo

### Prerequisiti

- **Node.js 20+** (consigliato Node.js 22 LTS, in linea con l'immagine di build Docker)
- **npm**

### Installazione ed esecuzione

L'applicazione Angular si trova nella cartella [`frontend/`](frontend).

```bash
cd frontend
npm install        # installa le dipendenze
npm start          # avvia il dev server su http://localhost:4200/
```

Il dev server si ricarica automaticamente quando modifichi un file sorgente.

### Test

```bash
npm test -- --watch=false
```

I test unitari usano **Vitest** e includono la suite di conformità formale HeroForge Anew / SRD.

### Build di produzione

```bash
npm run build
```

Gli artefatti di build vengono scritti in `frontend/dist/`.

### Docker

Un [`Dockerfile`](Dockerfile) multi-stage costruisce il bundle di produzione e lo serve con **nginx**
(vedi [`nginx.conf`](nginx.conf) per la compressione gzip e il fallback per la SPA).

```bash
docker build -t heroforge-anew-angular .
docker run --rm -p 8080:80 heroforge-anew-angular
```

Poi apri <http://localhost:8080/>.
