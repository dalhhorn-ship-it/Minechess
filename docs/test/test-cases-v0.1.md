# Minechess Test Cases, v0.1

Status: draft 1 for v0.1 MVP
Author: test-lead
Related: [test-plan-v0.1.md](test-plan-v0.1.md), [`tests/fixtures/positions.json`](../../tests/fixtures/positions.json)

79 test cases: 36 automated (unit or statistical), 3 with both an automated and a manual iPad part (TC-034, TC-069, TC-070), 37 manual iPad and 3 playtest. The traceability table from every v0.1 AC to these cases is in the test plan, section 10.

## How to read a case

| Field | Meaning |
|---|---|
| AC | The acceptance criterion (or definition of done item) the case proves |
| Type | automated unit, automated stats, manual iPad, playtest |
| Priority | P1 blocks release, P2 must pass before release but has a workaround while testing, P3 nice to confirm |
| Fixture | The id in `tests/fixtures/positions.json` |
| Result | Filled in during a run: Pass, Fail, Blocked or Skip, plus the run id |

## Before you run a manual iPad case (for the parent)

You do not need to know anything about programming. You need the iPad mini, this sheet, a ruler with millimetres and a phone with a stopwatch.

1. **Hold the iPad sideways** (landscape) for every case unless the case says otherwise.
2. **Open a test position.** Open Safari, go to the test address the engineer gave you and add `?testmenu` at the end (for example `https://minechess.example/?testmenu`). You see a list of big buttons named MAN-01, MAN-02 and so on. Tap the one the case names, then tap the creature the case names. The game opens with that position and it is your move (you always play the light pieces at the bottom).
3. **Square names.** Some steps say "move the piece on h2 to h3". Squares are named by a letter for the column and a number for the row, seen from your side of the board:

```
   8  . . . . . . . .      row 8 is the top row (the creature's side)
   7  . . . . . . . .
   ...
   2  . . . . . . . .
   1  . . . . . . . .      row 1 is the bottom row (your side)
      a b c d e f g h      column a is on the left, h on the right
```

   So h2 is the second square up in the rightmost column, and a8 is the top left corner. If the board shows no letters and numbers (they are hidden by default), count from the bottom left corner.
4. **Moving a piece.** Tap the piece, then tap the square it should go to.
5. **Evidence.** When a case says "take a screenshot", press the top button and the volume up button together. When it says "record the screen", swipe down from the top right corner, tap the round record button, wait for the 3 second countdown, do the steps, then tap the red bar at the top to stop. Write Pass or Fail and anything odd you saw in the Result line.
6. **If something goes wrong** (the page zooms, freezes or shows an error), take a screenshot, write down what you did just before, reload the page and continue with the next case.

---

## A. Chess rules engine (automated unit)

All engine cases load positions from `tests/fixtures/positions.json` (`perft` and `rules`). "Play" means applying UCI moves through the engine API. Each fixture is one test, named after its id, so a failure names the exact position.

### TC-001 Perft node counts match the reference
AC: AC-01. Type: automated unit. Priority: P1. Fixture: PERFT-01 to PERFT-06.
Preconditions: engine can load a FEN and count legal move paths to a given depth.
Steps:
1. For each entry in `perft`, load `fen`.
2. For each depth in `nodes`, count all legal move sequences of that length.
Expected: every count equals the reference exactly (24 counts, for example start position depth 4 = 197,281, Kiwipete depth 3 = 97,862, position 5 depth 4 = 2,103,487). On a mismatch the test prints a per move breakdown ("divide") at depth 1 to help find the bug.
Result:

### TC-002 Legal move lists in special positions
AC: AC-01, AC-12. Type: automated unit. Priority: P1. Fixture: LEGAL-01, LEGAL-02, LEGAL-03, and every `legalMovesFrom` entry in `rules`.
Steps:
1. Load the fixture, play `setupMoves` if present.
2. Ask the engine for the legal moves of the square in `legalMovesFrom`, and for all legal moves when `allLegalMoves` is present.
Expected: the lists are exactly equal to the fixture (order ignored). LEGAL-01 has 20 moves in total and g1 has only f3 and h3. LEGAL-02: the pinned knight on e2 has none. LEGAL-03: in check, only e1d2, e1f2 and f1e2.
Result:

### TC-003 Illegal moves are rejected and the state is unchanged
AC: AC-01. Type: automated unit. Priority: P1. Fixture: every `rules` case with `"legal": false`, plus these from the start position: e2e5 (too far), e7e5 (not your piece), e1e2 (square occupied), g1g3 (not a knight move).
Steps:
1. Record the position (FEN) before the move.
2. Try the illegal move.
Expected: the engine refuses the move (returns an error or false; it never throws an uncaught exception), and the FEN after the attempt equals the FEN before it, including the side to move and both clocks.
Result:

### TC-004 FEN import and export round trip
AC: AC-01. Type: automated unit. Priority: P2. Fixture: every `fen` in the file.
Steps:
1. Import each FEN, export it again.
2. For every `resultFen`, compare the engine's FEN after the move.
Expected: piece placement, side to move, castling rights and halfmove and fullmove numbers are equal. For the en passant field, see `conventions.resultFen` (compare after normalising if the engine only writes a capturable en passant square).
Result:

### TC-005 Castling is allowed when all conditions hold
AC: AC-02. Type: automated unit. Priority: P1. Fixture: CAS-01, CAS-02, CAS-03, CAS-04, CAS-09.
Steps: play `move` (the king moving two squares).
Expected: the move is legal; the rook lands next to the king on the other side (for CAS-01 the result is `r3k2r/8/8/8/8/8/8/R4RK1 b kq - 1 1`); the castling rights of the side that castled are gone. CAS-09 checks the edge case that queenside castling is legal while b1 is attacked.
Result:

### TC-006 Castling is refused through, into or out of check, when blocked, or without rights
AC: AC-02. Type: automated unit. Priority: P1. Fixture: CAS-05, CAS-06, CAS-07, CAS-08, CAS-13.
Steps: try `move`; read the king's legal moves.
Expected: the castling move is illegal and is not in the king's legal move list (the list equals `legalMovesFrom`).
Result:

### TC-007 Castling rights are lost by history
AC: AC-02. Type: automated unit. Priority: P1. Fixture: CAS-10 (rook moved and came back), CAS-11 (king moved and came back), CAS-12 (rook captured on its home square, another rook arrives there later).
Steps: play `setupMoves`, then try `move`.
Expected: castling on that side is illegal although the pieces stand on their home squares again.
Result:

### TC-008 En passant is allowed on the very next move and removes the right pawn
AC: AC-03. Type: automated unit. Priority: P1. Fixture: EP-01, EP-02, EP-06.
Steps: play `setupMoves` if present, then `move`.
Expected: the move is legal; the captured pawn disappears from its square (d5 in EP-01, d4 in EP-06), the capturing pawn stands on the target square, and the halfmove clock is 0. EP-06 also shows that en passant may answer a check given by the pawn it captures.
Result:

### TC-009 En passant is refused when expired, pinned or not after a two square move
AC: AC-03. Type: automated unit. Priority: P1. Fixture: EP-03 (one move pair later), EP-04 (rank pin), EP-05 (diagonal pin), EP-07 (the pawn arrived by two single steps).
Expected: the capture is illegal and not in the pawn's legal move list.
Result:

### TC-010 Promotion to each of the four pieces
AC: AC-04. Type: automated unit. Priority: P1. Fixture: PROMO-01 (queen), PROMO-02 (rook), PROMO-03 (bishop), PROMO-04 (knight), PROMO-07 (knight with check), PROMO-08 (creature promotes).
Expected: the chosen piece stands on the last rank (`pieceOnTarget`), the pawn is gone, check is reported when `inCheck` is true.
Result:

### TC-011 Promotion edge cases
AC: AC-04, AC-06. Type: automated unit. Priority: P2. Fixture: PROMO-05, PROMO-06, PROMO-09.
Expected: PROMO-05 promotion by capturing a rook gives check. PROMO-06 a pawn move to the last rank without a chosen piece is not legal (the UI must always ask). PROMO-09 promoting to a bishop leaves K+B vs K and the game ends at once as a draw by insufficient material.
Result:

### TC-012 Checkmate ends the game with the right winner
AC: AC-05. Type: automated unit. Priority: P1. Fixture: MATE-01 to MATE-05.
Expected: MATE-01 and MATE-03 status checkmate, winner white (the child). MATE-02 and MATE-04 status checkmate, winner black (the creature). MATE-05 is check but not mate: status ongoing.
Result:

### TC-013 Stalemate ends the game as a draw
AC: AC-05. Type: automated unit. Priority: P1. Fixture: STALE-01 to STALE-04.
Expected: status stalemate, no winner, side to move not in check.
Result:

### TC-014 Insufficient material
AC: AC-06. Type: automated unit. Priority: P1. Fixture: INSUF-01 to INSUF-08.
Expected: INSUF-01 to INSUF-05 status draw_insufficient (K vs K; K+B vs K; K+N vs K; K+B vs K+B with both bishops on dark squares; the child's king takes the last pawn). INSUF-06 (opposite colour bishops), INSUF-07 (K+R vs K), INSUF-08 (K+P vs K) are ongoing.
Result:

### TC-015 Fifty move rule
AC: AC-06, AC-05. Type: automated unit. Priority: P1. Fixture: FIFTY-01 to FIFTY-06.
Expected: FIFTY-01 and FIFTY-02 (clock 99, quiet move) status draw_fifty. FIFTY-03 (pawn move) and FIFTY-04 (capture) reset the clock to 0, ongoing. FIFTY-05 checkmate on the 100th half move is checkmate, not a draw. FIFTY-06 (clock 98) is ongoing with clock 99.
Result:

### TC-016 Threefold repetition
AC: AC-06. Type: automated unit. Priority: P1. Fixture: REP-01 to REP-05.
Expected: REP-01 draw on the creature's 8th half move; REP-02 ongoing after only two occurrences; REP-03 draw completed by the child's move; REP-04 ongoing because castling rights make the earlier "same looking" position different; REP-05 draw on half move 10.
Result:

### TC-017 No move is accepted after the game has ended
AC: AC-05, AC-06. Type: automated unit. Priority: P1. Fixture: every `rules` case whose status is not ongoing.
Steps: after the final move, ask for legal moves and try any move that would have been legal in the position.
Expected: the game reports the result, offers no legal moves for play, and refuses any further move without changing the state.
Result:

### TC-018 A new game starts with the child as White to move
AC: AC-44. Type: automated unit. Priority: P1.
Steps: create a new game against each of Wobble, Clucky and Copper Bot through the game controller.
Expected: FEN is `rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1`, the child is assigned White, the creature Black, and the controller waits for the child (the creature does not move first).
Result:

## B. Creature AI (automated stats and unit)

Stats cases call the creature's move choice directly in Node with an injected seeded generator (hook H3). Each case lists its seeds so a failure can be replayed.

### TC-019 Test bot beats Level 1 (Wobble) at least 80 times in 100
AC: AC-14. Type: automated stats. Priority: P1.
Preconditions: the scripted test bot (TC-021) exists; seeds 1 to 100 for the bot and 1001 to 1100 for Wobble.
Steps:
1. Play 100 games, bot as White, Wobble as Black, from the start position, using the engine for rules (including Wobble's AC-51 to AC-54 behaviour).
2. Stop a game at a result, a resignation, or after 300 half moves (unfinished, see plan G8).
3. Count bot wins (checkmate or Wobble resigns).
Expected: at least 80 wins. Draws and unfinished games are not wins. The test prints wins, losses, draws, unfinished, resignations and the seeds of every non win.
Result:

### TC-020 Test bot beats Level 2 (Clucky) at least 70 times in 100
AC: AC-14. Type: automated stats. Priority: P1.
Steps: as TC-019 against Clucky (seeds 2001 to 2100 for Clucky).
Expected: at least 70 wins.
Result:

### TC-021 The scripted test bot itself behaves as specified
AC: AC-14. Type: automated unit. Priority: P1. Fixture: MATE-01 (mate in one available), EMO-04 (queen capture available), PERFT-02 Kiwipete (eight captures, no mate in one), LEGAL-01 (no capture).
Steps: ask the bot for a move in each position with seeds 1 to 20.
Expected: MATE-01: always a1a8 (mate in one first). EMO-04: always d1d4 (takes the queen). PERFT-02: always e2a6 or f3f6, the two captures of a 3 point piece, never one of the six pawn captures; both appear across the 20 seeds (ties broken by the seed). LEGAL-01: a legal move, the same move for the same seed on every run, and more than one different move across the 20 seeds. This proves AC-14 is measured with the bot the AC describes.
Result:

### TC-022 Copper Bot is clearly stronger than the two easy creatures
AC: definition of done item 2 (no v0.1 AC; see plan G11). Type: automated stats. Priority: P2.
Steps: as TC-019 against Copper Bot (seeds 3001 to 3100).
Expected [ASSUMPTION, owner to confirm]: the bot wins at most half as many games against Copper Bot as it won against Clucky in TC-020 (for example, if the bot won 78 against Clucky, it wins at most 39 against Copper Bot). Copper Bot never resigns in any of the 100 games.
Result:

### TC-023 Easy creatures never step into a stalemate trap
AC: AC-51. Type: automated stats. Priority: P1. Fixture: `easyCreature.stalemateTraps` EASY-STALE-01 to EASY-STALE-08.
Steps: for each position and for Level 1 and Level 2, ask for a move 200 times with seeds 1 to 200.
Expected: no chosen move is in `forbiddenMoves` (3,200 choices in total). Every chosen move is legal. `stalematingReplies` shows the reply that would stalemate, for the failure message.
Result:

### TC-024 Stalemate rule gives way when every move is a trap
AC: AC-51. Type: automated unit. Priority: P2. Fixture: EASY-STALE-EDGE-01.
Expected: Level 1 and Level 2 still return a legal move (from `allowedMoves`) for seeds 1 to 50, never null, never an exception.
Result:

### TC-025 Easy creatures never repeat an earlier position
AC: AC-52. Type: automated stats. Priority: P1. Fixture: `easyCreature.repetition` EASY-REP-01 to EASY-REP-03.
Steps: play `setupMoves` from `fen` through the game controller (so the repetition history is real), then ask Level 1 and Level 2 for a move 200 times each (seeds 1 to 200).
Expected: no chosen move is in `forbiddenMoves`. EASY-REP-02 has two forbidden moves (e6e7 and e6d6) to catch an implementation that only checks the last position.
Result:

### TC-026 Easy creatures walk the king toward the child's pieces
AC: AC-53. Type: automated stats. Priority: P1. Fixture: `easyCreature.kingWalk`, the first 20 entries (EASY-KING-01 to EASY-KING-20); the other 6 are spares.
Steps:
1. For each seed 1 to 50 and for Level 1 and Level 2 separately: ask for one move in each of the 20 positions.
2. Count moves that are in `nearestChildPiece.<variant>.closerKingMoves`, where the variant is the engine's documented definition (plan G1).
Expected [ASSUMPTION, plan G2]: over the 1,000 moves per level, at least 50 percent are closer king moves, and no seed has fewer than 8 of 20. The test also asserts that no chosen move is in `stalemateTrapMoves` (AC-51 still wins).
Result:

### TC-027 Resign streak logic
AC: AC-54. Type: automated unit. Priority: P1. Fixture: `resign` RESIGN-01 to RESIGN-06.
Steps: start the game controller from `fen` with the given `level`, feed `moves` (creature moves come from the fixture, not the AI), and after the last move ask the creature to move.
Expected: after each creature move the controller's down 9 streak equals `trace[].downNineStreak`. RESIGN-01 and RESIGN-02 (exactly 9 points down, Level 1 and 2): the creature resigns instead of moving, the result is a child win by resignation, the emotion is `sad_resign`. RESIGN-03 (Copper Bot): no resignation. RESIGN-04 (only 8 down): no resignation. RESIGN-05 (streak 2): no resignation. RESIGN-06 (the king takes the queen, deficit falls to 7): streak resets, no resignation.
Result:

### TC-028 Resignation in full games
AC: AC-54. Type: automated stats. Priority: P2.
Steps: reuse the 300 games of TC-019, TC-020 and TC-022 and log every resignation.
Expected: every Wobble and Clucky resignation happens only after 3 creature moves in a row that each left it 9 or more points down (checked from the move log). Copper Bot never resigns. A resignation counts as a bot win.
Result:

### TC-029 Think time is clamped to 0.8 to 3 seconds
AC: AC-13. Type: automated unit. Priority: P1.
Steps:
1. With fake timers, make the engine answer after 10 ms: the controller starts the creature's move animation no earlier than 800 ms after the child's move.
2. Make the engine answer after 5 s: the controller does not wait; the creature's move starts by 3,000 ms (the search is stopped at its time budget and the best move so far is played).
3. For each level, run the real search for Black on the position after e2e4 (EMO-19), EASY-KING-01, EMO-21 and PERFT-05 on a desktop with CPU throttled 4 times (to approximate a 2019 iPad); record the time.
Expected: steps 1 and 2 hold exactly. Step 3: every search finishes within the level's budget, which must leave at least 500 ms margin under 3 s. Real device timing is TC-061.
Result:

### TC-030 The creature always returns a legal move of its own colour
AC: AC-01. Type: automated stats. Priority: P1. Fixture: every position in the file with Black to move and status ongoing.
Steps: for Wobble, Clucky and Copper Bot, 20 seeds each, ask for a move.
Expected: always a legal Black move for that position; never a White piece, never null, never an exception.
Result:

## C. Emotions and results

### TC-031 Emotion chosen for each half move follows the priority table
AC: AC-18. Type: automated unit. Priority: P1. Fixture: `emotionEvents` EMO-01 to EMO-31.
Steps: play `setupMoves`, then `move`; pass the half move's events to the emotion selector with version v0.1.
Expected: the selector returns exactly one emotion equal to `expectedEmotionV01`. With version set to v0.2 it returns `expectedEmotionPrd` (to keep the table ready for Worried and Surprised). Multi event cases: EMO-07, EMO-08, EMO-17, EMO-24 (check wins over capture), EMO-10, EMO-31 (result wins over capture and check), EMO-11, EMO-13, EMO-27 (a draw wins over a capture), EMO-16 (castling that gives check).
Result:

### TC-032 Exactly one emotion per half move in a played game
AC: AC-18. Type: automated unit. Priority: P1. Fixture: all `emotionEvents` (the scripted mini games, see plan G4).
Steps: run each case through the full game controller with a spy on the emotion output.
Expected: for each half move the spy sees exactly one emotion start (Thinking while the creature chooses is not a half move emotion), and it matches TC-031.
Result:

### TC-033 Emotions look right on the iPad
AC: AC-18. Type: manual iPad. Priority: P2.
Preconditions: test menu available.
Steps and expected (one row per check; watch the creature on the right):

| # | Open | Creature | Do this | You should see |
|---|---|---|---|---|
| 1 | Normal game (no test position) | Wobble | Move any pawn one square forward | The creature stays calm (idle), then shows its thinking animation (thought cloud), then moves |
| 2 | MAN-01 | Wobble | Move the pawn from h2 to h3 | The creature takes your bishop and looks happy (a hop, star in the bubble) |
| 3 | MAN-02 | Clucky | Move the pawn from h2 to h3 | The creature's pawn gives check and it looks happy |
| 4 | MAN-18 | Copper Bot | Move the rook from a1 to a8 | Your rook gives check; the creature shows a short sad face (about 1 second, no raincloud, no bubble) |
| 5 | MAN-19 | Wobble | Move the queen from d1 to d5 | You take the rook; the creature shows the short sad face |
| 6 | MAN-08 | Wobble | Move the rook from a1 to a8 | Checkmate: the creature is sad (raincloud) |
| 7 | MAN-04 | Wobble | Move the pawn from h2 to h3 | The creature checkmates you and celebrates once (then the loss is held, see TC-071) |
| 8 | MAN-09 | Clucky | Move the queen from e7 to f7 | Stalemate: the creature shows the Good sport pose with a handshake |

Each row shows only one emotion; the creature never shows two reactions for one move. Take a screenshot of each.
Result:

### TC-034 Reactions never block play
AC: AC-19. Type: automated unit and manual iPad. Priority: P1.
Automated steps: while the emotion state is playing (any emotion), send a tap on a child piece to the board controller. Expected: the piece is selected and a move can be completed; no input is queued behind an animation.
Manual steps:
1. Open MAN-19 with Wobble. Move the queen from d1 to d5 (the creature reacts).
2. While the creature is still reacting, tap your king at once.
Expected: the king lifts and shows its dots immediately, while the reaction is still playing.
3. Repeat in a normal game: right after the creature captures one of your pieces (Happy), tap one of your pieces during the hop. Expected: same, input works at once.
Result:

### TC-035 Speech bubble text rules (automated check)
AC: AC-20. Type: automated unit. Priority: P2.
Steps: read the bubble text table the game uses (all Dutch lines for Wobble, Clucky and Copper Bot, including Oops and Sad resign lines).
Expected: every line has 6 words or fewer (words split on spaces; "..." and punctuation are not words), every line has a picture icon id from the shared set (pointing hand, cloud, star, raincloud, white flag, trophy, handshake, rewind swirl), every emotion used in v0.1 has at least one Dutch line per creature, and no line is empty.
Result:

### TC-036 Speech bubbles on screen are short, pictured, Dutch and kind
AC: AC-20, definition of done item 4. Type: manual iPad. Priority: P2.
Steps: during TC-033 and one normal game against each creature, look at every speech bubble that appears. A parent who reads Dutch reads each one.
Expected: every bubble has a picture on its left; the words are Dutch; at most 6 words; nothing in any bubble makes fun of the child (any teasing is about the creature itself, for example "Oops, my tower fell!"). Write down any bubble that fails.
Result:

### TC-037 Child wins by checkmate
AC: AC-21, AC-05. Type: manual iPad. Priority: P1. Fixture: MAN-08.
Steps:
1. Open MAN-08 with Wobble. Move the rook from a1 to a8.
2. Watch until the result screen has fully appeared. Take a screenshot.
3. Repeat with Clucky and with Copper Bot.
Expected: the creature is sad; your side gets a big celebration (your side jumps on a podium, confetti, a medal); buttons for Rematch (circular arrow with the same creature's face), Next creature (green play arrow with the next creature's face) and a house button (top left) are there. Record which creature "Next creature" leads to for each of the three (plan G6).
Result:

### TC-038 Child wins because the creature gives up
AC: AC-21, AC-54. Type: manual iPad. Priority: P1. Fixture: MAN-07.
Steps:
1. Open MAN-07 with Wobble. Record the screen.
2. Move the pawn on the right edge one square up each turn: h2 to h3, then h3 to h4, then h4 to h5, then h5 to h6. Whatever the creature does in between is fine.
3. After your fourth pawn move, watch the creature.
4. Repeat with Clucky.
5. Repeat with Copper Bot and make 6 pawn and queen moves of your choice without giving away the queen.
Expected: for Wobble and Clucky: after your fourth move the creature does not move; it lays its king down, waves a small white flag and plays a big sad animation of about 3 seconds (count "one thousand one, one thousand two, one thousand three"); the result screen shows a win for you with the same buttons as TC-037 and the king lying next to a white flag. For Copper Bot: it keeps moving and never gives up.
Result:

### TC-039 Child loses
AC: AC-22, AC-64. Type: manual iPad. Priority: P1. Fixture: MAN-04.
Steps:
1. Open MAN-04 with Clucky. Move the pawn from h2 to h3. The creature checkmates you (the loss is held, see TC-071).
2. Tap the green "see result" button with the tipped over king.
3. Time the creature's celebration with the phone stopwatch, from when the result screen appears until the creature changes to its friendly pose.
Expected: the creature celebrates for 2 seconds or less, then shows the Good sport pose with a friendly line (for Clucky "Goed gespeeld! Nog eens?") and a handshake picture; your side gets a friendly pat, no sad effects on you; Rematch is the big main button and the house button is top left.
Result:

### TC-040 Draw by stalemate
AC: AC-56, AC-05, AC-06. Type: manual iPad. Priority: P1. Fixture: MAN-09 (you cause it), MAN-05 (the creature causes it).
Steps:
1. Open MAN-09 with Wobble. Move the queen from e7 to f7.
2. Open MAN-05 with Clucky. Move the pawn from g6 to g7 (it is your only move). The creature's only reply leaves you with no move.
Expected in both: the game ends as a draw; the creature shows the Good sport pose with the handshake icon; the result screen shows the stalemate picture (a sleeping king with crossed out arrows around it); Rematch is the big main button.
Result:

### TC-041 Draw by too few pieces
AC: AC-56, AC-06. Type: manual iPad. Priority: P1. Fixture: MAN-10.
Steps: open MAN-10 with Wobble. Move your king from e2 to d2 (it takes the last pawn).
Expected: the game ends at once as a draw; Good sport with handshake; the picture shows two lone kings shaking hands; Rematch is the main button.
Result:

### TC-042 Draw by the 50 move rule
AC: AC-56, AC-06. Type: manual iPad. Priority: P1. Fixture: MAN-11.
Steps: open MAN-11 with Clucky. Move the rook from a1 to a2.
Expected: the game ends at once as a draw; Good sport with handshake; the picture shows a long line of footprints that fades out; Rematch is the main button.
Result:

### TC-043 Draw by threefold repetition
AC: AC-56, AC-06. Type: manual iPad. Priority: P1. Fixture: MAN-06.
Steps: open MAN-06 with Wobble. Move your king g1 to h1, then back h1 to g1, then g1 to h1, then h1 to g1. The creature can only step its king back and forth.
Expected: right after the creature's fourth move the game ends as a draw; Good sport with handshake; the picture shows the same mini board three times with a circular arrow; Rematch is the main button.
Result:

### TC-044 A non reader understands each draw picture
AC: AC-06. Type: playtest. Priority: P2.
Preconditions: screenshots of the four draw result screens from TC-040 to TC-043, with the one line of text covered by a finger or a sticky note.
Steps: show each picture to Noor (5, cannot read) one at a time and ask, in your own words, "why did the game stop?" and "did anyone win?". Do not explain the picture first.
Expected: for each picture she says that nobody won. For at least 3 of the 4 pictures her explanation matches the reason (stuck king, same thing again and again, too long, too few pieces). Write down her exact words; a picture she cannot explain is an S3 defect for the designer.
Result:

## D. Board and interaction (manual iPad)

### TC-045 Only legal moves can be made
AC: AC-01. Type: manual iPad. Priority: P1. Fixture: MAN-17, MAN-16.
Steps:
1. Open MAN-17 with Wobble. Tap the knight just above your king (on e2).
2. Tap your king (e1).
3. Open MAN-16 with Wobble. Your king is in check at the start. Tap the rook (d1), then tap the king (e1), then the bishop (f1).
Expected: step 1: the knight shakes its head and shows no dots (it is pinned). Step 2: the king shows dots only on squares it may go to. Step 3: the rook shows no dots; the king shows dots only on d2 and f2; the bishop shows one dot only, on e2. Nothing else can be moved.
Result:

### TC-046 Castling is offered only when allowed
AC: AC-02. Type: manual iPad. Priority: P1. Fixture: MAN-12, MAN-13.
Steps:
1. Open MAN-12 with Wobble. Tap your king (the piece with the cross, e1).
2. Tap the dot two squares to the right (g1).
3. Open MAN-13 with Wobble. Tap your king.
Expected: step 1: dots appear two squares to the left and two to the right of the king. Step 2: the king moves two squares right and the rook visibly hops over it to the square next to it. Step 3: no dot two squares to the right (the black rook guards the square in between), but normal one square dots appear.
Result:

### TC-047 En passant is offered once
AC: AC-03. Type: manual iPad. Priority: P1. Fixture: MAN-14.
Steps:
1. Open MAN-14 with Wobble. Tap your pawn on e5 (fifth row, column e).
2. Look at the square diagonally up and left (d6) and at the black pawn beside yours (d5).
3. Tap the dot on d6.
4. Open MAN-14 again. This time move the pawn on h2 to h3 instead. After the creature moves, tap your e5 pawn again.
Expected: step 2: a normal dot on d6 and orange corner brackets on the black pawn on d5. Step 3: your pawn moves to d6 and the black pawn on d5 disappears. Step 4: there is no dot on d6 any more (the chance has passed), unless the creature has just moved another pawn two squares beside yours.
Result:

### TC-048 Promotion picker with four large picture buttons
AC: AC-04, AC-11. Type: manual iPad. Priority: P1. Fixture: MAN-15.
Steps:
1. Open MAN-15 with Wobble. Move the pawn from a7 to a8.
2. Look at the picker. Measure one piece button with the ruler. Take a screenshot.
3. Tap the queen.
4. Open MAN-15 again and pick the rook; again and pick the bishop; again and pick the knight.
5. Open MAN-15 again, move the pawn to a8 and tap the back arrow on the picker.
Expected: step 2: four piece pictures (queen, rook, knight, bishop) in a row, the queen larger with a pointing hand, each button at least 12 mm wide and high, no reading needed. Steps 3 and 4: the pawn turns into the chosen piece. Step 5: the pawn goes back to a7 and it is still your turn.
Result:

### TC-049 Checkmate and stalemate end the game
AC: AC-05. Type: manual iPad. Priority: P1. Fixture: MAN-08, MAN-09.
Steps: during TC-037 and TC-040, after the final move and before the result screen appears, try to tap and move any of your pieces.
Expected: nothing moves; the board dims slightly; the result screen follows by itself within about 2 seconds.
Result:

### TC-050 You play the light pieces at the bottom and move first
AC: AC-44. Type: manual iPad. Priority: P1.
Steps: from the creature picker, start a game against Wobble, then Clucky, then Copper Bot. In each, wait 10 seconds without touching. Then tap Rematch after one finished game.
Expected: the light pieces are always at the bottom; the creature never moves before you do; after 10 seconds without a tap, your movable pieces make one small hop (a hint). The same after Rematch.
Result:

### TC-051 Tapping a piece shows where it can go, captures look different
AC: AC-07. Type: manual iPad. Priority: P1. Fixture: MAN-19.
Steps:
1. Open MAN-19 with Wobble. Tap your queen (d1).
2. Take a screenshot.
3. Turn on grey colours: Settings, Accessibility, Display and Text Size, Color Filters, switch on, choose Grayscale. Go back to the game and tap the queen again. Take a screenshot. Turn Color Filters off again.
Expected: blue dots on the empty squares the queen can reach; orange corner brackets around the black rook on d5 (a different shape from the dots). In grey, dots and brackets are still easy to tell apart by shape.
Result:

### TC-052 Move by tapping and by dragging
AC: AC-08. Type: manual iPad. Priority: P1.
Steps:
1. Normal game against Wobble. Tap a pawn, then tap one of its dots.
2. Next turn: press on a knight and drag it with your finger onto one of its dots, then let go.
3. Next turn: drag a piece and let go on a square with no dot, far from any dot.
4. Next turn: drag a piece and let go just next to a dot (less than half a square away).
Expected: 1 and 2: the piece moves to that square. 3: the piece glides back home, no move is made, it is still your turn. 4: the piece snaps onto the nearest dot and the move is made.
Result:

### TC-053 Tapping a wrong square is gentle
AC: AC-09. Type: manual iPad. Priority: P1.
Steps:
1. Normal game against Clucky. Tap a pawn, then tap an empty square with no dot.
2. Tap a pawn, then tap a creature piece that cannot be taken.
3. Tap a pawn, then tap another of your own pieces.
4. Tap anywhere on the board very fast about 20 times with two fingers.
5. While the creature is thinking, tap your pieces.
Expected: 1 and 2: the piece is gently put down (deselected); no sound, no text, no red, no shaking screen. 3: the other piece becomes selected. 4: nothing breaks; the game continues normally. 5: grey rings may show where the piece could go, but no move is made.
Result:

### TC-054 Touch targets are big enough on the iPad mini
AC: AC-11. Type: manual iPad. Priority: P1.
Preconditions: iPad mini, Safari with its toolbars showing, landscape. On an iPad mini, 75 points is 11.7 mm, 60 points is 9.4 mm. Round up: use 12 mm and 9.5 mm on the ruler.
Steps: lay the ruler flat on the screen and measure:

| # | What | Screen | Must be at least |
|---|---|---|---|
| 1 | One board square | Game | 9.5 mm wide and high |
| 2 | House button | Game and result | 12 mm |
| 3 | Oops button | Game | 12 mm |
| 4 | Promotion piece buttons | Promotion picker (MAN-15) | 12 mm |
| 5 | Rematch and Next creature buttons | Result | 12 mm |
| 6 | "See result" button | Held checkmate (MAN-04) | 12 mm |
| 7 | Each creature on the creature picker | Picker | 12 mm |

Expected: every item meets its minimum. If a drawn button looks smaller but is surrounded by empty space, write the measurement down and let the engineer check the touch area. Parent controls (44 points) do not exist in v0.1 (plan G5).
Result:

### TC-055 A king in check is clearly marked, for both sides
AC: AC-12. Type: manual iPad. Priority: P1. Fixture: MAN-16, MAN-18, MAN-02.
Steps:
1. Open MAN-16 with Wobble. Look at your king. Then move the king from e1 to d2.
2. Open MAN-18 with Wobble. Move the rook from a1 to a8. Look at the creature's king. Wait for the creature to move out of check.
3. Open MAN-02 with Clucky. Move the pawn from h2 to h3. The creature checks your king. Look at your king, then move it out of check.
Expected: a red starburst behind the king in check, the king shakes twice, and the starburst stays until the check is gone; it disappears right after the escaping move. This works for your king (steps 1 and 3) and for the creature's king (step 2).
Result:

### TC-056 The creature's move slides so you can follow it
AC: AC-46. Type: manual iPad. Priority: P1. Fixture: MAN-03, MAN-01.
Steps:
1. Open MAN-03 with Wobble. Record the screen. Move the pawn from h2 to h3. The creature must move its knight (top right corner).
2. Open MAN-01 with Clucky and move the pawn from h2 to h3. The creature's pawn takes your bishop.
3. Play a normal game against Copper Bot for 5 creature moves and watch each one.
4. Stop the recording. Play it back in Photos and pause while the creature's piece is on the way.
Expected: every creature piece glows when picked up and visibly travels over the board; it never jumps. The knight travels in a curved hop, not a straight line. In the recording you can pause with the piece between squares. Engineer check (plan G7): in the recording at 60 frames per second, count at least 24 frames between the piece leaving its square and landing.
Result:

### TC-057 The creature's last move stays marked until you move
AC: AC-47. Type: manual iPad. Priority: P1.
Steps:
1. Normal game against Wobble. After the creature moves, look at the square it came from and the square it went to.
2. Wait 20 seconds.
3. Tap one of your pieces and then tap it again to put it down.
4. Make your move.
Expected: 1: both squares have a soft yellow tint with small corner marks. 2 and 3: they stay marked. 4: they clear when your move is done (and your own move's squares may be marked instead).
Result:

### TC-058 A captured piece goes poof and lands in the creature's tray
AC: AC-48. Type: manual iPad. Priority: P1. Fixture: MAN-01.
Steps: open MAN-01 with Wobble. Record the screen. Move the pawn from h2 to h3. The creature's pawn takes your bishop.
Expected: your bishop bursts into a small puff of blocks, then a small copy of it drops into the creature's captured pieces tray on the creature's side of the screen, and it stays there.
Result:

### TC-059 You can always see whose turn it is, without text
AC: AC-49. Type: manual iPad. Priority: P1.
Steps:
1. Normal game against Copper Bot. Watch the gold ring during 5 of your moves and 5 of the creature's moves.
2. Record one move of yours and the creature's reply.
Expected: a gold ring glows around your picture on your turn and under the creature on its turn; there is always exactly one ring; no words are needed. It switches the moment your piece lands and the moment the creature's piece lands (no noticeable delay). Engineer check (plan G7): in the recording at 60 frames per second the ring moves within 12 frames of the piece landing.
Result:

### TC-060 Touches never scroll, zoom, select or go back
AC: AC-50. Type: manual iPad. Priority: P1.
Steps: in a normal game against Wobble, do each of these on the board, on the creature, on the empty side areas and on the buttons:

| # | Gesture |
|---|---|
| 1 | Single tap |
| 2 | Double tap quickly |
| 3 | Press and hold for 3 seconds |
| 4 | Drag a finger up, down, left and right across the screen |
| 5 | Pinch two fingers together, then apart |
| 6 | Swipe in from the left edge of the screen toward the middle |
| 7 | Swipe in from the right edge |
| 8 | Press and hold on any text (a speech bubble or a label) |

Expected: the page never moves or scrolls, never zooms in or out, no text or picture gets a blue selection, no "Copy" or "Look Up" menu appears, no picture preview pops up, and the page never goes back to a previous page. The game is exactly as before (apart from normal piece selection). Repeat step 6 and 2 on the creature picker and the result screen.
Result:

### TC-061 The creature thinks for 0.8 to 3 seconds on a 2019 iPad
AC: AC-13. Type: manual iPad. Priority: P1.
Preconditions: iPad mini 5 (2019) or another 2019 iPad; a phone with a stopwatch; another person helps if possible.
Steps:
1. Normal game against Wobble. Start the stopwatch at the moment your piece lands. Stop it at the moment the creature's piece starts to move. Write the time down.
2. Do this for 10 creature moves: 5 at the start of the game, 5 later in the game with many pieces still on the board.
3. Repeat for Clucky and Copper Bot (30 times in total).
Expected: during every wait, the creature shows its thinking animation. Every time is between 0.8 and 3.0 seconds. Because a stopwatch by hand is about 0.2 seconds off, a time between 0.6 and 1.0 or between 2.8 and 3.2 is "borderline": mark it, and the engineer measures that move again from a screen recording (plan G7). A time under 0.6 or over 3.2 is a failure.
Result:

### TC-062 The game makes no sound at all
AC: AC-34. Type: manual iPad. Priority: P1.
Steps:
1. Turn the iPad volume all the way up with the volume button. Make sure the iPad is not muted (in Control Centre the bell icon is not crossed out).
2. Play one full game against Wobble to the end, including a capture by you, a capture by the creature, a check, oops, the promotion picker (MAN-15) and the result screen. Also run TC-038 (resignation) and TC-039 (loss).
3. During the game, swipe down from the top right corner and look at the media player box in Control Centre.
Expected: no sound at any moment. The media player box shows nothing playing from Safari.
Result:

### TC-063 The game talks to no other website
AC: AC-37. Type: manual iPad. Priority: P1.
Preconditions: App Privacy Report is on (Settings, Privacy and Security, App Privacy Report, Turn On App Privacy Report), switched on before the test.
Steps:
1. Close all Safari tabs. Open the game address and play one full game against each of the three creatures, including a result screen.
2. Go to Settings, Privacy and Security, App Privacy Report. Under "Website Network Activity" tap the game's website.
3. Also look at every screen of the game for ads, banners, "sign in" boxes or questions about the child.
Expected: the only domain listed for the game's website is the game's own domain. No ads, no banners, no links to other sites, and the game never asks for a name, email, age or any other personal data. Take a screenshot of the report.
Result:

### TC-064 The build contains no third party addresses
AC: AC-37. Type: automated unit. Priority: P1.
Steps:
1. Build the production bundle.
2. Scan every built file (HTML, JS, CSS, fonts manifest) for `http://`, `https://` and `//` addresses and for `<link>` or `@import` of fonts.
3. Check the page's Content Security Policy.
Expected: no address other than the game's own origin (relative paths only); fonts and images are self hosted; no analytics or ad library in the dependency list (`package.json` and the lock file); the Content Security Policy, if present, allows only `'self'`. Optional engineer check: Safari Web Inspector (Mac, cable) Network tab during a full game shows only requests to the game's origin.
Result:

### TC-065 Every screen has a one tap way back or home
AC: AC-38. Type: manual iPad. Priority: P1.
Steps: on each screen below, find the button in the top left corner and tap it once.

| # | Screen | How to get there | Expected after one tap |
|---|---|---|---|
| 1 | Game | Start any game | Back to the creature picker (the game's home) |
| 2 | Promotion picker | MAN-15, move the pawn to a8 | Back arrow closes the picker, pawn goes back, game continues |
| 3 | Result after a win | TC-037 | Back to the creature picker |
| 4 | Result after a loss | TC-039 | Back to the creature picker |
| 5 | Result after a draw | TC-041 | Back to the creature picker |
| 6 | Held checkmate | MAN-04 with Wobble, h2 to h3 | Back to the creature picker |
| 7 | Creature picker | Open the game | This is the root: it needs no back button; every creature is a way forward |

Expected: the button is always in the top left, always visible, and one tap is enough; no "are you sure?" question appears.
Result:

## E. Oops credits

### TC-066 A new game shows two oops tokens
AC: AC-39. Type: manual iPad. Priority: P1.
Steps: start a game against each creature; look at the oops button at the bottom left. Finish one game and tap Rematch.
Expected: two gold coin tokens with a back arrow next to the oops button, no number needed; after Rematch two tokens again.
Result:

### TC-067 Oops takes back exactly one move pair
AC: AC-40. Type: manual iPad. Priority: P1.
Steps:
1. Normal game against Wobble. Make 2 moves and let the creature answer each. After the creature's second answer, take a screenshot of the board (picture A).
2. Make your third move and wait for the creature's third answer.
3. Tap oops once.
Expected: the creature's third reply slides backwards, then your third move slides backwards; the board looks exactly like picture A; one token flies away and one is left; the creature does a playful rewind spin with the rewind swirl bubble and returns to idle; it is your turn.
Result:

### TC-068 Oops restores the complete game state
AC: AC-40, AC-66, AC-54. Type: automated unit. Priority: P1. Fixture: REP-01, RESIGN-01, and the FEN given in step 2.
Steps and expected:
1. From the start position play the first 4 half moves of REP-01 (start position has occurred twice). Take a snapshot of the whole state (FEN, repetition history, halfmove clock, resign streak, credits). Play 2 more half moves, undo with oops. Expected: the state equals the snapshot except credits minus 1; then playing the remaining REP-01 moves gives a draw at exactly the same half move as without the undo (the undone positions are removed from the history).
2. From `4k3/8/8/8/8/8/8/R3K3 w - - 97 80` play a1a2 and a creature reply (clock 99), then oops. Expected: clock back to 97; replaying two quiet half moves then reaches 99, not 100 (no early draw).
3. From RESIGN-01 play the first 5 half moves (the creature moves first here; its streak is 1, 2, 3 after half moves 1, 3, 5). It is the child's turn: oops. Expected: the position is the one after half move 3 and the streak is back to 2. Then the child plays e2e3, the creature plays any move (streak 3), the child plays e3e4, and only now does the creature resign.
4. The undo takes exactly two half moves, never one or three, when it is the child's turn.
Result:

### TC-069 Oops is disabled before the first move and with no tokens left
AC: AC-41. Type: manual iPad and automated unit. Priority: P1.
Manual steps:
1. Start a new game against Clucky. Before moving, tap oops 3 times.
2. Make a move, wait for the reply, tap oops (1 token left). Make a move, wait, tap oops again (0 left).
3. Make a move, wait for the reply, tap oops 3 times.
Expected: step 1: the button looks grey, flat and faded, the tokens are full, and tapping does nothing to the board (the tokens may give a small shrug wiggle). Step 2: both uses work. Step 3: the button is grey with a dashed outline and empty token sockets, and tapping does nothing to the board.
Automated: the controller's undo returns "not allowed" and changes nothing when credits are 0 or no child move exists.
Result:

### TC-070 A finished result cannot be undone
AC: AC-42. Type: manual iPad and automated unit. Priority: P1.
Manual steps: on each result screen reached in TC-037 (win), TC-038 (resignation), TC-040 (stalemate), TC-041 to TC-043 (draws) and TC-039 after tapping "see result" (accepted loss), look for the oops button and try to go back to the game with any button.
Expected: no oops button on any result screen; no way to return to the finished game except Rematch (a new game with 2 tokens).
Automated: after each final status the controller refuses undo, even with 2 credits left, except for a held checkmate against the child (TC-071).
Result:

### TC-071 A checkmate against you is held while you have a token
AC: AC-64. Type: manual iPad. Priority: P1. Fixture: MAN-04.
Steps:
1. Open MAN-04 with Wobble (2 tokens). Move the pawn from h2 to h3. The creature's rook takes your rook and checkmates you.
2. Look at the board for 20 seconds without touching anything.
3. Tap oops.
4. Move the pawn from h2 to h3 again (1 token left). The creature checkmates you again. Tap oops again (0 left).
5. Move the pawn from h2 to h3 a third time.
Expected: step 1 and 2: the final position stays on the board, bright (not dimmed), your king has the red starburst, the creature celebrates once then waits, the oops button glows slowly, a green "see result" button with a tipped over king appears on your side, and nothing moves on by itself. Step 3: the two moves go back, one token is used, it is your turn again. Step 5: with no tokens left, the loss result screen follows at once (as in TC-039), with no held state.
Result:

### TC-072 Oops while the creature is still thinking
AC: AC-65. Type: manual iPad. Priority: P1.
Steps:
1. Normal game against Copper Bot. Make two moves normally.
2. Make a third move and, while the creature shows its thinking animation (right away, within half a second), tap oops.
Expected: the creature stops thinking and does not move; your third move slides back; one token is used; the creature returns to idle; it is your turn and you can move any piece. Wait 5 seconds: the creature does not suddenly make a move.
Result:

### TC-073 Search cancel leaves no creature move behind
AC: AC-65, AC-13. Type: automated unit. Priority: P1.
Steps: start a creature search (Copper Bot, the position after the child's e2e4 from EMO-01), cancel it after 50 ms through the controller's oops.
Expected: the Worker reports cancelled within 100 ms; no creature move is applied even if a result message arrives late (stale results are ignored by a move id); the child's last move is undone; credits minus 1; the controller state is "child to move".
Result:

### TC-074 After oops the board and the creature are back to normal
AC: AC-66. Type: manual iPad. Priority: P2.
Steps:
1. Normal game against Wobble. After a few moves, take a screenshot of the board on your turn (picture B).
2. Make a move, wait for the creature's reply, tap oops.
3. Compare the board with picture B, square by square.
4. Make a move from the restored position.
Expected: the board is identical to picture B (same pieces on the same squares, same captured trays, same highlighted last creature move or none); the creature is in its idle animation; the new move works normally.
Result:

## F. Scope checks and playtest

### TC-075 Playtest with Noor (5)
AC: definition of done item 6, supports AC-14, AC-18, AC-21, AC-49. Type: playtest. Priority: P1.
Preconditions: all P1 manual cases passed. A normal game address (no test menu). The owner sits next to Noor, does not touch the iPad and does not read anything aloud unless she asks.
Steps:
1. Give her the iPad on the creature picker and say only "you can play chess against a creature".
2. Let her play two games against Wobble and, if she wants, one against Clucky.
3. Write down: which creature she picks and why; whether she finds her pieces and the dots without help; whether she knows when it is her turn; her face and words when the creature reacts, when she wins, and when she loses; whether she uses oops; anything that made her stop or ask for help; how many games she wins.
Expected: she can start and finish a game without being told how; she wins at least one game against Wobble; she wants to play again. Any moment where she is stuck for more than about 10 seconds is logged as a finding for the designer.
Result:

### TC-076 Playtest with Sam (9)
AC: definition of done item 6, supports AC-14 and definition of done item 2. Type: playtest. Priority: P1.
Steps: as TC-075, with one game against each of Wobble, Clucky and Copper Bot. Also ask him afterwards: "which creature was the smartest?" and "did any creature do something weird?".
Expected: he rates Copper Bot as clearly harder than Wobble and Clucky; the owner writes down his reactions and any rule he thinks is wrong (check each against the engine fixtures; a real rule bug is S1).
Result:

### TC-077 All text is Dutch
AC: definition of done item 4, AC-20. Type: manual iPad. Priority: P2.
Steps: on the creature picker, a game, the promotion picker, the held checkmate, and every result type (win, resign, lose, each draw), read every word on screen, including button labels and the text under pictures.
Expected: every word is Dutch (creature names Wobble, Clucky and Copper Bot are the same in every language and are allowed). No English, no placeholder text like "result.win" or "TODO".
Result:

### TC-078 Portrait shows a "turn the iPad" picture
AC: v0.1 scope (versions.md: landscape only). Type: manual iPad. Priority: P2.
Steps:
1. Make sure rotation lock is off (Control Centre). In a game after 3 moves, turn the iPad upright (portrait).
2. Turn it back to landscape.
Expected: in portrait a picture asks you to turn the iPad (no reading needed) and the board cannot be played; back in landscape the same game is there, with the same position, tokens and whose turn.
Result:

### TC-079 Simple creature picker with all three creatures open
AC: v0.1 scope (versions.md). Type: manual iPad. Priority: P1.
Steps: open the game address. Tap Wobble; play one move; tap the house. Repeat for Clucky and Copper Bot.
Expected: the picker shows exactly three creatures (Wobble, Clucky, Copper Bot), all open, no locks, no profiles, no parent gear; tapping a creature starts a game against that creature (its picture and colours are beside the board).
Result:
