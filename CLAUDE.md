# Minechess

A game that blends chess with minesweeper mechanics. The tech stack is not chosen yet; update this file once it is.

## Agent team

Project subagents live in `.claude/agents/`:

| Agent | Role |
|-------|------|
| architect | Plans features and structure (read only) |
| game-logic | Rules engine: moves, captures, mines, win and loss |
| ui | Board rendering, input, and game status display |
| tester | Edge case tests and bug reproduction |
| reviewer | Reviews diffs before commit (read only) |

Typical flow: architect plans, game-logic and ui build, tester verifies, reviewer checks the diff.

## Conventions

Keep rules code pure and separate from UI. Use seeded randomness for mine placement so tests are reproducible.
