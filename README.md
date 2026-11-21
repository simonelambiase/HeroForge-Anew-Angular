[🇮🇹 Versione Italiana](README.it.md)

# HeroForge-Anew-Angular

> **D&D 3.5 Character Builder & Rules Engine**

A modern, reactive web rewrite of the legendary **HeroForge Anew** spreadsheet for D&D 3.5 by
[Heliomance](https://github.com/Heliomance/HeroForge-Anew). The original Excel workbook
(`HeroForge Anew 3.5 v7.4.0.1.xlsm`) is preserved in this repository as the reference
implementation, while the application re-implements its rules and formulas as a browser-based
builder.

The goal is a character builder that keeps the *mathematical rigour* of the original sheet while
delivering a fast, accessible, multilingual UI built on contemporary Angular.

---

## AI Transparency Statement — Supervised AI Coding, NOT Vibe Coding

This project was built through **Supervised AI Coding**. It is important to be explicit about what
that means, because it is **not** the same as "vibe coding".

- **This is not blindly generated code.** Vibe coding produces output that "looks about right" and
  is shipped without verification. HeroForge-Anew-Angular is the opposite: it is AI-assisted code
  that is reviewed, formalised and tested at every step.
- **Every rule is verified against the source of truth.** Each mathematical rule implemented here —
  Base Attack Bonus (BAB), saving throws, carrying capacity, skill point costs, point-buy costs,
  iterative attacks, and more — has been formally checked and covered by automated tests against the
  original formulas of the **HeroForge Anew Excel sheet** and the **D&D 3.5 SRD**.
- **Human-supervised.** Architectural decisions, acceptance criteria and final quality are owned by
  humans. The AI accelerates execution; it does not replace judgement or accountability.

The compliance test suite lives in
[`frontend/src/app/core/services/character-rules-excel-compliance.spec.ts`](frontend/src/app/core/services/character-rules-excel-compliance.spec.ts)
and encodes the expected values (e.g. point-buy cost table, the `L * (L - 1) / 2 * 1000` experience
table, BAB progressions, base save formulas) directly from the SRD and HeroForge Anew.

---

## The Agentic Workflow

This repository is delivered by a **multi-agent, human-supervised pipeline**, not by a single model
in a chat window:

| Role | Agent | Responsibility |
| --- | --- | --- |
| **Orchestrator & Supervisor** | **Google Antigravity** | High-level planning, architectural decomposition into modules, definition of acceptance criteria, and quality supervision. |
| **Distributed Execution Engine** | **Jean (Collabsio)** | Runs agentic execution: CommandCode agents powered by **DeepSeek** models, working on **isolated Git worktrees** so parallel tasks never interfere with each other. |
| **Human Supervisor** | **Simone Lambiase** | Strategic direction, functional validation and final approval. |

Read the full methodology in **[`AGENT.md`](AGENT.md)** (Italian: [`AGENT.it.md`](AGENT.it.md)).

---

## Key Features

- **Modern Angular 21 frontend** using **Signals** with a **zoneless** change-detection model (no
  Zone.js).
- **100% compliance** with the rules and formulas of the HeroForge Anew Excel sheet, enforced by a
  dedicated formal compliance test suite.
- **Native i18n**: a dynamic **Italian / English** language selector switchable at runtime, with the
  choice persisted in the browser.
- **Complete catalog**: races, classes, class options and specializations, feats, skills, equipment,
  plus a **custom race builder** and a creature catalog (`data/CreatureInfo.csv`).
- **Integrated OpenRouter AI assistant** inside the builder: build advice, narrative lore generation,
  and D&D 3.5 rules chat (configurable model, from `DeepSeek V3` to `Claude 3.5 Sonnet`).
- **JSON export** of character data and a **print-friendly character sheet** preview.

---

## Copyright, References and License

- **Original work.** HeroForge Anew was created by **Heliomance**:
  <https://github.com/Heliomance/HeroForge-Anew>. All credit for the original rules engine, data
  model and formulas belongs to its author and contributors. This project is a derivative web
  re-implementation and does not claim ownership of the original spreadsheet.
- **Dungeons & Dragons 3.5.** Dungeons & Dragons and D&D 3.5 are trademarks of **Wizards of the
  Coast**. The rules referenced here are used under the **Open Game License (OGL)**. This project is
  not affiliated with, endorsed by, or sponsored by Wizards of the Coast.
- **Sourcebooks.** Reference to any sourcebook (e.g. *Complete* series, *Player's Guide to Faerûn*)
  is made for compatibility purposes only and remains the property of its respective rights holders.

---

## Quickstart and Development

### Prerequisites

- **Node.js 20+** (Node.js 22 LTS recommended, matching the Docker build image)
- **npm**

### Install and run

The Angular application lives in the [`frontend/`](frontend) directory.

```bash
cd frontend
npm install        # install dependencies
npm start          # start the dev server at http://localhost:4200/
```

The dev server reloads automatically when you change a source file.

### Tests

```bash
npm test -- --watch=false
```

The unit tests use **Vitest** and include the formal HeroForge Anew / SRD compliance suite.

### Production build

```bash
npm run build
```

Build artifacts are written to `frontend/dist/`.

### Docker

A multi-stage [`Dockerfile`](Dockerfile) builds the production bundle and serves it with **nginx**
(see [`nginx.conf`](nginx.conf) for gzip and SPA fallback configuration).

```bash
docker build -t heroforge-anew-angular .
docker run --rm -p 8080:80 heroforge-anew-angular
```

Then open <http://localhost:8080/>.
