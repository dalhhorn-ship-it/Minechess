# Minechess Tech Debt Register

Known shortcuts and weak spots in the v0.1 code. **When** says the latest point at which an item should be paid off. Impact: H (will block or break something), M (slows us down or risks bugs), L (tidy up).

| ID | Item | Impact | When | Suggested fix |
|---|---|---|---|---|
| TD-01 | `src/ui/gameView.ts` (about 550 lines) mixes input, animation, AI orchestration, emotions and the result screen in one class | M | Before v0.2 resume and portrait | Split into a game controller (turn flow, oops, resign, timers) and small views (board, creature panel, result). The controller becomes unit testable |
| TD-02 | No persistence layer at all | H | v0.2 (resume, F12) | Add a small storage module with a versioned schema, `navigator.storage.persist()`, and safe fallbacks when storage is unavailable |
| TD-03 | Dutch text is hard coded in `lines.ts` and in `gameView.ts` (button labels, aria labels) | H | v0.2 (English, F08) | Move all strings into one language table keyed by id; lines per creature per language |
| TD-04 | If the AI worker throws or never answers, the creature "thinks" forever and the child is stuck | M | v0.2 | Add `worker.onerror` and a timeout that falls back to a random legal move |
| TD-05 | Move generation copies the whole board for every move tried, and `positionKey` generates legal moves again for en passant | M | Before Deep Watcher (v0.2) | Make and unmake moves in place, or time limited iterative deepening; measure on the oldest target iPad first |
| TD-06 | AI speed on a real iPad is unmeasured (desktop: about 0.15 s per Copper Bot move) | M | v0.1 playtest | Owner check A12 in the playtest sheet; add a benchmark before Deep Watcher |
| TD-07 | Emotion timing and bubble rate limits live in the view and have no tests (only `emotionFor` is tested) | M | With TD-01 | Move to the controller and test with fake timers |
| TD-08 | AI strength tests are statistical and take about 2 minutes | L | v0.2 | Split into `npm run test:ai` so the quick suite stays fast |
| TD-09 | No CI on GitHub: only Cloudflare builds, and it does not run the tests | M | v0.2 | GitHub Action running `tsc` and `vitest` on every push |
| TD-10 | No lint or formatter configured | L | v0.2 | Add ESLint and Prettier with a minimal config |
| TD-11 | `main.ts` blocks `touchmove` on the whole page; any future scrolling screen (settings, lessons) won't scroll | M | v0.2 parent settings | Scope the block to the game screen only |
| TD-12 | The Safari edge swipe "back" can't be blocked in a normal browser tab (AC-50 is only fully met from the home screen) | M | v0.2 (F17) | Home screen install with a web app manifest and icon |
| TD-13 | Test position loader (`?fen=`) exists in dev only; the test lead's manual iPad cases need it | L | Only if manual cases are run | Keep dev only (product director: not in the family build) |
| TD-14 | Dead code after the 3D restyle: `pixelSvg`, the plank and frame stone textures, Copper Bot's unused resign line | L | Next code change | Delete |
| TD-15 | Emotion animation names are duplicated between TypeScript and CSS class names | L | With TD-01 | One emotion list that drives both |
| TD-16 | Very new toolchain (Vite 8, TypeScript 7, Vitest 5) | L | Ongoing | Keep the lockfile; upgrade deliberately, not automatically |
