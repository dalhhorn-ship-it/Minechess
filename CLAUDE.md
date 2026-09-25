# Minechess

An iPad chess game for kids aged 5 to 12, built first for the owner's two kids, aged 5 and 9. The child picks an opponent from a cast of original, blocky, Minecraft inspired creatures. Each creature has a play style (for example smart, not smart, aggressive, defensive) and shows emotions on screen that react to the game, including winning and losing.

Status: product definition (PRD Draft v0.3). Runs in the iPad browser (Safari), launched from its home screen icon (Safari deletes storage of sites unused for 7 days unless installed), private family use, free, Dutch and English (v0.1 is Dutch only). Plain chess first; mine chess is a planned v2.0 variant, so the rules engine must support variants. The PRD lives in `01-product/`.

## Project context every agent must respect

1. Audience is 5 to 12. The youngest player is 5 and can't read yet, so apply the `ux-ipad-kids` 4 to 6 guidance as the floor: meaning must never depend on reading. The game is fully silent for now (no voice, read aloud or sound effects), so pictures and animation must do all the work. Allow more depth (strategy, progression) for the 9 year old.
2. Creatures are original. Never use Minecraft names, logos, textures, sounds, or recognizable characters.
3. Child safety first: no third party ads or tracking, no open chat, parental gate (a 4 digit parent PIN) for purchases, settings, and external links (COPPA, GDPR K, Apple Kids Category).
4. Keep chess rules and opponent AI decoupled from the rendering and platform shell.

## Agent team for this project

| Stage | Agent | Use for |
|---|---|---|
| Product | product-manager | PRD, features, versions, acceptance criteria (in `01-product/`) |
| Product | red-team | Stress test the PRD before build |
| Design | ux-ipad-kids | Kids iPad flows, screen audits, parent gate |
| Design | ux-designer | Flows, states, copy deck |
| Architecture | solution-architect, architect, delivery-architect | Stack choice, engine and AI design |
| Build | dev, game-logic, ui | Implementation |
| Quality | test-lead, qa-specialist, tester, reviewer | Test strategy, test cases, review |

Typical flow: product-manager, red-team, ux-ipad-kids and ux-designer, solution-architect, dev, test-lead, reviewer.

## Build (v0.1)

Stack: Vite + TypeScript, no UI framework, Vitest. Answers PRD Q7 and Q8:
1. **Art (Q7):** pixel art drawn in code (`src/ui/pixel.ts`, `pieces.ts`, `icons.ts`, `creatureArt.ts`), with a blocky world look (plank panels, stone buttons, grass and dirt) as the owner asked. All textures are generated at runtime; no external assets, fonts or requests.
2. **Engine (Q8):** own engine in `src/engine` (perft verified). Rules sit behind a `RuleSet` so mine chess can be added as a variant. Creature AI in `src/ai` runs in a Web Worker.

Layout: `src/engine` pure rules, `src/ai` creature move choice, `src/game` match state (oops, resign, emotions), `src/ui` screens.

Commands: `npm run dev` (add `?fen=<FEN>` to start from a test position, dev only), `npm test`, `npm run build`, `npm run preview`.

## Deploy (Cloudflare Pages)

Build command `npm run build`, output directory `dist`, Node 22 (`.nvmrc`). `public/_headers` sets a strict Content Security Policy (only the site's own files, AC-37) and long caching for hashed assets. `wrangler.toml` allows `npx wrangler pages deploy` as an alternative to the Git integration.
