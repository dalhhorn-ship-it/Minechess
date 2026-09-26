# Minechess

An iPad chess game for kids aged 5 to 12, built first for the owner's two kids, aged 5 and 9. The child picks an opponent from a cast of original, blocky, Minecraft inspired creatures. Each creature has a play style (for example smart, not smart, aggressive, defensive) and shows emotions on screen that react to the game, including winning and losing.

Status: v0.1 built and live on Cloudflare (PRD Draft v0.4); next is the owner's iPad check and kid playtest (`docs/test/playtest-v0.1.md`). Backlog: `01-product/backlog.md`. Tech debt: `docs/tech-debt.md`. Runs in the iPad browser (Safari), launched from its home screen icon (Safari deletes storage of sites unused for 7 days unless installed), private family use, free, Dutch and English (v0.1 is Dutch only). Plain chess first; mine chess is a planned v2.0 variant, so the rules engine must support variants. The PRD lives in `01-product/`.

## Project context every agent must respect

1. Audience is 5 to 12. The youngest player is 5 and can't read yet, so apply the `ux-ipad-kids` 4 to 6 guidance as the floor: meaning must never depend on reading. Audio is made in code with Web Audio: a few cartoon effects (the creature losing a piece, crying) and original background songs in a retro adventure and calm block world style (`src/ui/music.ts`; never copy melodies from existing games), each with its own on and off button; no voice or read aloud, and everything must still be understandable with sound off, so pictures and animation do the main work. Allow more depth (strategy, progression) for the 9 year old.
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
1. **Art (Q7):** pixel art drawn in code (`src/ui/pixel.ts`, `pieces.ts`, `icons.ts`, `creatureArt.ts`), with a 3D block world look as the owner asked: pieces, icons and title are extruded block figures, creatures are built from 3D boxes, panels use an inventory style grey with item slots, and the board sits on a grass block. All textures are generated at runtime; no external assets, fonts or requests.
2. **Engine (Q8):** own engine in `src/engine` (perft verified). Rules sit behind a `RuleSet` so mine chess can be added as a variant. Creature AI in `src/ai` runs in a Web Worker.

Creatures (11, `src/ai/creatures.ts`): six 1 star ones that help the child win (Wobble, Snurk, Plons, Clucky, Fizz, Muddle), two 2 star (Knor, Stip) and three 3 star (Copper Bot, IJzerwachter, Kristal). Their balance is locked by `tests/ai-strength.test.ts`.

Layout: `src/engine` pure rules, `src/ai` creature move choice, `src/game` match state (oops, resign, emotions), `src/ui` screens.

Commands: `npm run dev` (add `?fen=<FEN>` to start from a test position, dev only), `npm test`, `npm run build`, `npm run preview`.

## Deploy (Cloudflare Workers static assets)

Cloudflare builds from Git: build command `npm run build`, deploy command `npx wrangler deploy`, Node 22 (`.nvmrc`). `wrangler.toml` serves `dist` as static assets (no Worker script). `public/_headers` sets a strict Content Security Policy (only the site's own files, AC-37) and long caching for hashed assets. Check a config change locally with `npx wrangler deploy --dry-run`.
