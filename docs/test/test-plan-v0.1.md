# Minechess Test Plan, v0.1

Status: draft 1 for v0.1 MVP
Author: test-lead
Date: 2026-09-25
Inputs: `01-product/prd.md` (Draft v0.3), `01-product/versions.md`, `01-product/acceptance-criteria.md`, `01-product/features.md`, `docs/design/*.md`
Related: [test-cases-v0.1.md](test-cases-v0.1.md), [`tests/fixtures/positions.json`](../../tests/fixtures/positions.json)

## 1. Purpose

This plan answers one question for the owner: **can v0.1 ship to the family iPad?** v0.1 is done when all 40 acceptance criteria tagged v0.1 pass, the six items of the v0.1 definition of done hold, and both kids have played it (versions.md).

## 2. Scope

### In scope (v0.1)

| Area | Features | Acceptance criteria |
|---|---|---|
| Chess rules | F01 | AC-01, AC-02, AC-03, AC-04, AC-05, AC-06, AC-44 |
| Board and interaction, landscape only | F02, F03 | AC-07, AC-08, AC-09, AC-11, AC-12, AC-46, AC-47, AC-48, AC-49, AC-50 |
| Creature AI for Wobble (L1), Clucky (L2), Copper Bot (L5) | F04, F05, F24 | AC-13, AC-14, AC-51, AC-52, AC-53, AC-54 |
| Emotions (idle, thinking, happy, sad, celebrating) and result screen with Good sport | F06, F07 | AC-18, AC-19, AC-20, AC-21, AC-22, AC-56 |
| Platform and safety | no audio, F18 | AC-34, AC-37, AC-38 |
| Oops credits | F23 | AC-39, AC-40, AC-41, AC-42, AC-64, AC-65, AC-66 |
| v0.1 scope items without an AC | versions.md | Dutch only, portrait shows a "turn the iPad" picture, simple creature picker with all 3 creatures open, three clearly different strengths |

### Out of scope (v0.1)

Portrait layout and rotation (AC-10), English and language choice (AC-23), parent PIN and settings (AC-27, AC-28, AC-58, AC-59, AC-60), profiles and ladder (AC-17, AC-24 to AC-26, AC-57), resume (AC-29, AC-43, AC-61), home screen install and persistent storage (AC-35, AC-63), offline play (AC-36), coach tips, lessons and puzzles (AC-30 to AC-33, AC-62), the Worried and Surprised art (v0.2), creature style and pairwise strength tests (AC-15, AC-16, AC-55), the variant engine test (AC-45). Rules that pass in v0.1 must keep passing later, so the v0.1 automated suite becomes the regression base for v0.2.

## 3. Risk assessment

| Risk | Level | Why it matters | Where we test hardest |
|---|---|---|---|
| Illegal or missing moves in the engine | High | A child who is told a legal move is not allowed, or a draw that is not a draw, loses trust in the game at once | Perft on six reference positions plus 60 targeted rule positions (TC-001 to TC-018) |
| Easy creatures too strong for Noor | High | The product goal for v0.1 is "a kid can win against a creature" | AC-14 statistics (TC-019, TC-020), AC-51 to AC-54 (TC-023 to TC-028), playtest (TC-075) |
| Silent game hides what the creature did | High | No sound and a pre reader: if the slide, poof, highlight or turn ring is missed, the child is lost | Manual iPad cases TC-055 to TC-059 with forced creature moves |
| Oops corrupts the game state | High | Undo touches position, repetition history, 50 move counter and resign streak; bugs here cause wrong draws or wrong resignations | Automated state comparison TC-068, manual TC-066 to TC-074 |
| Browser gestures break the game on iPad | Medium | Zoom, scroll or back swipe mid game is confusing and can lose the game | TC-060 on real iPad Safari |
| Creature thinks too long or too short | Medium | Over 3 s feels broken; under 0.8 s the child misses the thinking | TC-029 automated, TC-061 on a 2019 iPad |
| Third party requests | Medium | Child safety promise (no tracking) | TC-063, TC-064 |
| Touch targets too small on iPad mini | Medium | Small fingers mis tap | TC-054 with a ruler |
| Emotion shown does not match the event | Medium | The creature's face is the main feedback channel | TC-031, TC-033 |

## 4. Test levels and what is automated

| Level | Tool and place | What it covers | Automated or manual | When it runs |
|---|---|---|---|---|
| Engine unit tests | Vitest, `tests/engine/*.test.ts`, fixtures from `tests/fixtures/positions.json` (`perft`, `rules`) | Move generation, castling, en passant, promotion, check, checkmate, stalemate, all draw rules, FEN import and export, game over lock | Automated | Every commit (the depth 4 perft of position 5, about 2.1 million nodes, may be tagged slow) |
| Game logic unit tests | Vitest, `tests/game/*.test.ts` | Emotion selection per half move (`emotionEvents`), resign streak (`resign`), oops undo and state restore, think time clamp with fake timers, search cancel | Automated | Every commit |
| AI statistical tests | Vitest in Node (not the Worker), `tests/ai/*.stats.test.ts`, fixed seeds | AC-14 test bot matches, AC-51 to AC-53 easy creature rules (`easyCreature`), AC-54 in full games, Copper Bot strength check | Automated | Before every release candidate and nightly; they take minutes, so they run as a separate script, not on every commit |
| UI manual tests on iPad Safari | Real iPad mini (5th generation or later) in landscape, plus one larger iPad; the positions in `manualIpad` loaded through the test hook | Everything a child sees and touches, timing on a 2019 iPad, no audio, no network, gestures | Manual, written so a parent with no technical knowledge can run them | Each release candidate |
| Kid playtest | Family iPad, Noor (5) and Sam (9), owner observing | Fun, understanding without reading, win rate against the easy creatures, reactions | Manual, observational | Once per release candidate that passes all other levels |

Why UI is manual in v0.1: the owner chose iPad Safari as the only target, and the things most at risk (touch feel, animation you can follow, gestures, silence, target size in millimetres) can only be judged on the real device. A WebKit browser automation suite (for example Playwright with WebKit) is a good v0.2 addition for regression of AC-07, AC-08, AC-41 and AC-49; it is listed as a follow up, not a v0.1 exit criterion.

## 5. Test data

All positions live in `tests/fixtures/positions.json`. The child always plays White and the creature always plays Black (AC-44). Moves are in UCI (`e2e4`, castling `e1g1`, promotion `a7a8q`).

| Section | Count | Used by |
|---|---|---|
| `perft` | 6 positions, 23 node counts (start position depth 1 to 4, Kiwipete depth 1 to 3, positions 3, 4, 4 mirrored and 5 from the Chess Programming Wiki) | TC-001 |
| `rules` | 60 cases: 13 castling, 7 en passant, 9 promotion, 5 checkmate, 4 stalemate, 8 insufficient material, 6 fifty move, 5 repetition, 3 legal move lists | TC-002 to TC-018 |
| `easyCreature.kingWalk` | 26 positions, Black down 5 or more points with legal king moves | TC-026 |
| `easyCreature.stalemateTraps` | 8 trap positions plus 1 edge case where every move is a trap | TC-023, TC-024 |
| `easyCreature.repetition` | 3 move sequences with the moves that would repeat a position | TC-025 |
| `emotionEvents` | 31 single half moves with expected emotion (18 child, 13 creature, 11 with more than one event) | TC-031, TC-032 |
| `resign` | 6 scenarios with a per move trace of the deficit and the down 9 streak | TC-027, TC-068 |
| `manualIpad` | 19 positions for the iPad cases; 7 of them force the creature's reply so the case does not depend on the AI | Manual cases |

Every FEN was checked for legality and every expected value (legal move lists, statuses, perft counts, trap and repetition sets, emotion events, deficit traces) was computed and cross checked with an independent chess library (python-chess 1.10) and by reasoning. The generator is not part of the repository; the JSON is the source of truth.

## 6. Test hooks the build must provide

The manual cases need a way to start a game from a set position. The engineer building the app is asked to add these to the test build (they must be absent or ignored in the family build, so a child can never reach them):

| Hook | Behaviour | Needed by |
|---|---|---|
| H1 Test position loader | A test page at `?testmenu` shows one large button per `manualIpad` id (MAN-01 to MAN-19) and one per creature; tapping MAN-04 and then Wobble starts that game. Behind it, opening the game address with `?testfen=<URL encoded FEN>&creature=wobble` (or `clucky`, `copperbot`) starts a game against that creature from that position, child to move, 2 oops credits, halfmove clock taken from the FEN. Ready made `testfen` values are in `manualIpad[].testfenParam` | Most manual cases |
| H2 Pure functions callable from Node | The engine, the creature move choice (with a seed and a level), the emotion selector, the resign streak and the oops undo can be called directly in Vitest, without the Web Worker and without the DOM | All automated game logic and AI tests |
| H3 Seedable randomness | Every random choice in the AI takes its randomness from an injected seeded generator | AC-14, AC-51 to AC-53 |
| H4 Search cancel | The Worker search can be cancelled and reports that no move was produced | TC-030, TC-073 |

If H1 is missing, the manual cases that need a set position are marked Blocked, not Passed. The parameter names above are a proposal; if the engineer picks other names, update this table and the test cases, nothing else.

## 7. Environments

| Environment | Details |
|---|---|
| Automated | Node 20 or later, Vitest, run from the repository root. Stats tests use fixed seeds so a failure can be reproduced |
| Primary iPad | iPad mini (5th generation, 2019, or later), current iPadOS, Safari, landscape, Safari toolbars visible (v0.1 is not installed to the home screen yet). This device is both the "smallest supported iPad" for AC-11 and a "2019 iPad" for AC-13 |
| Second iPad | Any larger iPad (for example 10.2 inch or 11 inch) for definition of done item 1 |
| Network | Home wifi. For AC-37 the iPad's App Privacy Report is switched on (Settings, Privacy and Security, App Privacy Report) |
| Tools for the parent | A ruler with millimetres, a phone with a stopwatch, the test case sheet |

## 8. Entry criteria

Testing of a v0.1 release candidate starts when:

1. Open questions Q7 (art approach) and Q8 (engine approach) are answered (versions.md entry condition).
2. The build is reachable from the iPad at a private address.
3. Hooks H1 to H4 exist, or the owner accepts that the dependent cases are Blocked.
4. The engineer's own unit tests pass.
5. The three creatures (Wobble, Clucky, Copper Bot) with the five v0.1 emotions and the Good sport pose are in the build.

## 9. Exit criteria (go for v0.1)

v0.1 is ready for the family iPad when all of these hold:

1. Every test case whose type includes "automated" passes, including the statistical cases.
2. Every manual iPad case passes on the iPad mini, and the smoke subset (TC-050, TC-052, TC-059, TC-060, TC-065, TC-067) also passes on the larger iPad.
3. Every v0.1 acceptance criterion in the traceability table below has all its test cases passed. No AC may be marked passed on the strength of one case when more are listed.
4. No open defect of severity S1 or S2 (see section 11). S3 and S4 defects are written down with the owner's decision.
5. Both kids have played (TC-075, TC-076) and the owner has written down their reactions (definition of done item 6).
6. The test summary report (section 12) says Go.

Suspension: stop manual testing and send the build back when an S1 defect is found (for example, the game freezes, an illegal move is allowed, or the page zooms and cannot be recovered).

## 10. Traceability: every v0.1 acceptance criterion to its test cases

| AC | Short name | Test cases | Types |
|---|---|---|---|
| AC-01 | Only legal moves | TC-001, TC-002, TC-003, TC-004, TC-030, TC-045 | automated unit, automated stats, manual iPad |
| AC-02 | Castling | TC-005, TC-006, TC-007, TC-046 | automated unit, manual iPad |
| AC-03 | En passant | TC-008, TC-009, TC-047 | automated unit, manual iPad |
| AC-04 | Promotion picker | TC-010, TC-011, TC-048 | automated unit, manual iPad |
| AC-05 | Checkmate and stalemate | TC-012, TC-013, TC-017, TC-049 | automated unit, manual iPad |
| AC-06 | Draws and draw pictures | TC-014, TC-015, TC-016, TC-017, TC-041, TC-042, TC-043, TC-044 | automated unit, manual iPad, playtest |
| AC-44 | Child plays light, bottom, first | TC-018, TC-050 | automated unit, manual iPad |
| AC-07 | Legal move highlights | TC-051 | manual iPad |
| AC-08 | Tap or drag to move | TC-052 | manual iPad |
| AC-09 | Gentle deselect on illegal tap | TC-053 | manual iPad |
| AC-11 | Touch target sizes | TC-054 | manual iPad |
| AC-12 | Check highlight on both kings | TC-055 | manual iPad |
| AC-46 | Creature move slides 400 ms or more | TC-056 | manual iPad |
| AC-47 | Creature from and to squares stay marked | TC-057 | manual iPad |
| AC-48 | Capture poof and tray | TC-058 | manual iPad |
| AC-49 | Turn indicator without text | TC-059 | manual iPad |
| AC-50 | No browser gestures | TC-060 | manual iPad |
| AC-13 | Think time 0.8 to 3 s | TC-029, TC-061 | automated unit, manual iPad |
| AC-14 | Test bot beats Level 1 and 2 | TC-019, TC-020, TC-021 | automated stats |
| AC-51 | Easy creatures avoid stalemate traps | TC-023, TC-024 | automated stats |
| AC-52 | Easy creatures avoid repeated positions | TC-025 | automated stats |
| AC-53 | Easy creatures walk the king out | TC-026 | automated stats |
| AC-54 | Easy creatures resign | TC-027, TC-028, TC-038 | automated unit, automated stats, manual iPad |
| AC-18 | One emotion per half move by priority | TC-031, TC-032, TC-033 | automated unit, manual iPad |
| AC-19 | Reactions never block play | TC-034 | automated unit, manual iPad |
| AC-20 | Speech bubbles | TC-035, TC-036 | automated unit, manual iPad |
| AC-21 | Child wins | TC-037, TC-038 | manual iPad |
| AC-22 | Child loses | TC-039 | manual iPad |
| AC-56 | Draw result | TC-040, TC-041, TC-042, TC-043 | manual iPad |
| AC-34 | No audio | TC-062 | manual iPad |
| AC-37 | No third party requests, no ads, no data out | TC-063, TC-064 | manual iPad, automated unit |
| AC-38 | One tap route back or home | TC-065 | manual iPad |
| AC-39 | Two oops credits as pictures | TC-066 | manual iPad |
| AC-40 | Oops undoes one move pair | TC-067, TC-068 | manual iPad, automated unit |
| AC-41 | Oops disabled at 0 credits or before a move | TC-069 | manual iPad, automated unit |
| AC-42 | Results cannot be undone | TC-070 | manual iPad, automated unit |
| AC-64 | Held checkmate | TC-071 | manual iPad |
| AC-65 | Oops while the creature thinks | TC-072, TC-073 | manual iPad, automated unit |
| AC-66 | Oops restores the exact state | TC-068, TC-074 | automated unit, manual iPad |

All 40 v0.1 acceptance criteria have at least one test case. Definition of done items without an AC are covered by TC-022 (three clearly different strengths), TC-075 and TC-076 (kids have played), TC-077 (all text Dutch), TC-078 (portrait picture) and TC-079 (creature picker).

## 11. Gaps, ambiguities and assumptions to confirm

These are flagged instead of being quietly decided. Each one names the case that depends on it.

| # | Item | What the test assumes | Case | Who confirms |
|---|---|---|---|---|
| G1 | AC-53 "nearest child piece": does the White king count? | [ASSUMPTION] Distance is counted in king steps (Chebyshev). The fixture gives both variants (with and without the White king); the test uses whichever the engine documents | TC-026 | Product owner |
| G2 | AC-53 "in at least half of its moves": per run or over many seeds? | [ASSUMPTION] One move per position, 20 positions, 50 seeds per level; pass when the share of closer king moves over all 1,000 moves is at least 50 percent, and no single seed is below 40 percent | TC-026 | Product owner |
| G3 | AC-51 and AC-53 can conflict (the closer king move may be a stalemate trap) | The AC-53 positions were chosen so that each has at least one closer king move that is not a trap | TC-026 | Engineer, noted |
| G4 | AC-18 asks for "a scripted test game that contains every event". A single legal game with every event (including several draw types) cannot exist, because a game ends at its first result | The script is a set of mini games from set positions (`emotionEvents`), one per event and per event combination | TC-031, TC-032 | Product owner |
| G5 | AC-11 parent controls (44 pt): v0.1 has no parent controls | Marked not applicable in v0.1; retest in v0.2 | TC-054 | Noted |
| G6 | AC-21 "Next creature" in v0.1: there is no ladder. Which creature is next after Copper Bot? | [ASSUMPTION] Order Wobble, Clucky, Copper Bot; after Copper Bot the button is hidden or goes to the picker. The test records what happens and asks the owner | TC-037 | Product owner |
| G7 | AC-13, AC-46 and AC-49 give times (0.8 s, 3 s, 400 ms, 200 ms) that a parent cannot measure exactly by eye | The parent does a stopwatch or visual check with a margin; borderline results go to the engineer, who measures with a screen recording at 60 frames per second or with Safari Web Inspector | TC-056, TC-059, TC-061 | Noted |
| G8 | AC-14 bot details: ties between equal captures, en passant as a capture, a limit for unfinished games | [ASSUMPTION] Ties are broken by the seeded generator; en passant counts as a pawn capture; a game with no result after 300 half moves is unfinished and is not a win | TC-019, TC-020 | Engineer |
| G9 | Automatic draw rules: the AC says the game "ends as a draw" on threefold repetition and at 50 moves, while official rules make those claimable | The game ends automatically at the third occurrence and when the halfmove clock reaches 100. Checkmate on that same move wins over the draw | TC-015, TC-016 | Product owner |
| G10 | Insufficient material: only clear dead positions end the game | K vs K, K+B vs K, K+N vs K, and K+B vs K+B with bishops on the same colour end the game. Opposite colour bishops, K+R vs K and K+P vs K do not | TC-014 | Engineer, noted |
| G11 | Definition of done item 2 asks for three clearly different strengths, but no v0.1 AC measures Copper Bot | [ASSUMPTION] The test bot must win clearly fewer games against Copper Bot than against Clucky (see TC-022 for the threshold) | TC-022 | Product owner |
| G12 | Held checkmate (AC-64) shows Celebrating on the mating half move, then idle | The half move emotion stays Celebrating (creatures.md rule 6); the Good sport pose follows only after "see result" | TC-071 | Noted |

## 12. Evidence, defects and reporting

Conventions follow the qa-specialist role.

1. **Run record.** Each test session gets an id `RUN-YYYYMMDD-NN` with device, iPadOS version, build version, date, tester, and counts of passed, failed, blocked and skipped cases. Evidence goes in `docs/test/evidence/RUN-YYYYMMDD-NN/` (screenshots, screen recordings, the Vitest output). No run is reported without evidence.
2. **Manual evidence.** For every manual case, the tester takes one screenshot (top button and volume up together) or a screen recording where the case says so, and writes Pass, Fail or Blocked in the result column of the case sheet.
3. **Defects** use `BUG-###` with title (observed versus expected), severity, linked TC and AC, steps, expected, actual, evidence, status. Severity: S1 crash, freeze, illegal move allowed, legal move refused, lost game state, any network request to a third party, any sound. S2 wrong result or draw, wrong emotion at game end, oops restores the wrong state, a gesture zooms or scrolls the page. S3 wrong emotion during play, a target a little under size, timing just outside the range. S4 cosmetic.
4. A defect is closed only after a retest passes on the same device where it was found.
5. **Test summary report** at the end of each release candidate: go or no go, AC coverage achieved, defects by severity, cases blocked and why, assumptions from section 11 that are still open. No go while any S1 defect is open.

## 13. Schedule for one release candidate

| Step | Who | Time |
|---|---|---|
| Automated suite including stats | Engineer | 15 minutes of machine time |
| Manual iPad cases on the iPad mini | Parent or tester | About 3 hours, can be split over two evenings |
| Smoke subset on the larger iPad | Parent | 20 minutes |
| Kid playtest | Owner with Noor and Sam | Two sessions of about 20 minutes each, on different days |
| Summary report | Test lead | 30 minutes |
