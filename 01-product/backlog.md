# Minechess Backlog

Ordered by priority. Sources: product director review after v0.1, owner feedback, `docs/tech-debt.md`. Owner decisions pending are marked **(sanction)**. Feature ids refer to `features.md`.

## Now: finish v0.1

| # | Item | Why |
|---|---|---|
| 1 | Owner iPad check, Part A of `docs/test/playtest-v0.1.md` | Nothing has run on a real iPad yet |
| 2 | Kid playtest, two short sessions per child (Part B) | v0.1 definition of done item 6; decides the v0.2 order |
| 3 | Fix what the check, the playtest and the code review find | Keep v0.1 solid before adding more |
| 4 | **Done:** strategy lessons in Dutch for ages 8 and up, reachable from the start screen (owner request, pulls part of F14 forward) | Owner asked for it; the owner wants to learn too |
| 4c | **Done:** more emotions (crying), longer bubbles, sound effects and original background music with win and loss jingles (owner requests) | Makes the creatures and the game feel alive |
| 4b | **Done:** old school hall of fame with points per game (owner request): top 10 on the iPad, three letter names | Gives both kids a reason to replay and beat their own score |

## Next: v0.2 part 1 **(sanction)**

| # | Item | Why |
|---|---|---|
| 5 | Home screen install with icon (F17) and resume a paused game (F12), with storage (TD-02) and the Safari edge swipe fix (TD-12) | Daily play without losing games or progress |
| 6 | Deep Watcher, 5 stars (F05) | The 9 year old needs a hard opponent; needs faster search first (TD-05) |
| 7 | Worried and Surprised faces (F06) | Creatures feel more alive at low risk |
| 8 | AI worker safety net (TD-04) and CI with tests on every push (TD-09) | Prevent a frozen game; catch regressions |
| 9 | Split the game screen code (TD-01, TD-07) | Makes resume and portrait safe to build |

## Later: v0.2 part 2 **(sanction)**

| # | Item | Why |
|---|---|---|
| 10 | Fizz and Muddle (F05) | More variety for the 5 year old |
| 11 | Portrait layout (F02) | Nice to have; landscape works |
| 12 | English (F08, TD-03) and the parent PIN with language setting (F11) | The family plays in Dutch |

## v1.0

Profiles and ladder (F09, F10), full parent settings (F11), coach tips (F13), full lessons and puzzles (F14, F15), offline play (F18), profile export (F22), Iron Guardian and Triple Shade.

## Not doing (for now)

1. The full 3 hour manual test sheet; the 20 minute check plus kid sessions cover what matters.
2. A test position menu in the family build (child safety, little benefit).
3. Sound (owner decision) and mine chess (v2.0).

## Decisions waiting for the owner

1. Hold v0.2 until both kids have played v0.1? Recommended: yes.
2. Replace the 3 hour manual test with the 20 minute check plus kid sessions? Recommended: yes.
3. Split v0.2 into part 1 and part 2 as above? Recommended: yes.
4. Draws by repetition and the 50 move rule end automatically? Recommended: yes (already built).
5. Hide "next creature" after Copper Bot? Recommended: yes (already built).
