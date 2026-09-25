# Minechess User Flows

Status: design draft v0.2, updated for PRD Draft v0.3 section 8
Author: ux-ipad-kids (design stage), updated by product-manager for owner answers round 2
Related: [screens.md](screens.md), [creatures.md](creatures.md), [visual-language.md](visual-language.md), [open-questions.md](open-questions.md)

## Who and what job

**Noor (5, cannot read):** "I want to pick my picture, pick a funny creature and move pieces until something exciting happens." Every step must work with pictures, pointing hands and animation only. No sound exists to help.

**Sam (9, reads, knows the moves):** "I want to get to my next creature fast, beat it, and understand why I lost a piece." He can use the text on cards and coach tips.

**The parent:** "I want to set the language, switch coach tips, unlock creatures or delete a profile, and I want my kids unable to do that."

Design floor: every flow below must work for Noor without reading and without sound.

Versions: these flows describe v1.0. v0.1 has no language choice, PIN, profiles, ladder, resume or learning: it opens on a simple picker with Wobble, Clucky and Copper Bot, then Flow 3. v0.2 adds language choice, the parent PIN (language setting only) and resume, and still has no profiles or ladder (all creatures open).

## Navigation model

There are only two levels a child ever moves between: the **profile picker** (the root) and the child's **Home** (the creature ladder). Everything else is one step below Home.

```
Profile picker (root)
 └─ Home = creature ladder (per profile)
     ├─ Resume card (only when an unfinished game exists)
     ├─ Game ─ Promotion picker (overlay)
     │    └─ Result ─ Unlock celebration (overlay, after a first win)
     ├─ Lessons list ─ Lesson
     ├─ Puzzles list ─ Puzzle
     └─ Parent gate ─ Parent settings ─ Delete profile confirm
```

**One tap back rule.** The back or home button always sits top left, inset 24 pt from both edges, and is always visible. It never asks "are you sure?". Leaving a game is safe because the game is saved and offered again (see Flow 2), so no confirmation is needed.

| Icon in top left | Where it goes | Used on |
|---|---|---|
| Child's own avatar (small, round) | Profile picker | Home |
| House | Home (ladder) | Game, Result, Resume card, Lessons list, Puzzles list, Lesson, Puzzle, Meet Wobble intro |
| Back arrow | The screen before | Parent PIN set (back to language), Profile create (back to picker, or back to PIN set on first launch) |
| Close cross (grey, parent style) | Where the gate was opened from | Parent gate, Parent settings |
| none (root screen) | n/a | Language choice on first launch, Profile picker |

The two root screens have no back button because there is nothing behind them. They are never a dead end: every item on them is a way forward.

## Flow 1: First launch

Happy path:

0. **Launch from the home screen icon.** The documented way to play is to add Minechess to the iPad home screen and always open it from there (PRD 9.3); Safari keeps the stored progress of installed sites. On launch the game asks for persistent storage.
1. **Language choice.** Two large flag buttons (Dutch flag, English flag). Tapping a flag makes a small waving hand appear on it, then the screen slides on. No gate here because there is nothing to protect yet and the parent is expected to be present on first launch.
1b. **Parent sets a PIN** (S1a). Grey grown up screen, 4 digits, entered twice. Required, no skip (AC-27).
2. **Create first profile.** Step A: pick an avatar from a grid of 12 blocky animal heads (a pointing hand bounces over the grid). Step B: a name field with a pencil icon and a big green play arrow. The name is optional; tapping the arrow with an empty field skips it. The avatar alone identifies the child.
3. **Meet Wobble.** Wobble bounces in from the side, waves, and shows a bubble with a waving hand icon ("Hi! Let's play!"). Wobble then hops beside the board. A pointing hand taps one of the child's pawns, the legal move dots appear, and the hand taps a dot. The pawn moves. This is the only instruction before play.
4. **First game** against Wobble starts with the child to move. The pointing hand stays over the child's pawns until the first tap, then disappears for good.

Unhappy paths and edges:

| Situation | What happens |
|---|---|
| Child taps nothing on the language screen for 8 seconds | Both flags gently pulse in turn to show they are tappable. Nothing auto advances. |
| Wrong language picked | Parent changes it later in settings. We accept this cost to keep first launch free of gates. |
| Child taps the back arrow on profile create | Returns to the PIN set screen, which returns to language choice. Nothing is lost; the PIN already set is kept. |
| Child takes the iPad before the PIN is set | The PIN screen looks grown up and has no skip; the child can only go back to the flags. The parent sets the PIN when they return. |
| Avatar already used by another profile | Shown dimmed with a lock and cannot be picked (AC-57). |
| Child types a long name | Field accepts up to 12 characters, extra key taps do nothing (the field gently wiggles). Emoji and symbols are allowed; no validation messages. |
| Child taps the house during Meet Wobble | Goes to Home (ladder). Wobble is unlocked and bouncing, so the child finds the same game one tap away. The intro is not shown again. |
| Browser data was cleared | Treated as a first launch. All profiles are gone (accepted in PRD section 9.3). |

## Flow 2: Returning player

Happy path:

1. **Profile picker.** Big avatar tiles (name under each when set). A "plus" tile adds a profile. A small gear sits top right for the parent.
2. Child taps their avatar.
3. **If an unfinished game exists:** the **Resume card** appears first. It shows the creature waiting beside a mini board of the saved position, and a large green play arrow. Tapping play restores the game exactly (position, creature, whose turn, oops credits left). The house button skips to Home.
4. **Home (ladder).** The next creature to beat glows and bounces. Beaten creatures wear a medal. Locked creatures are dark silhouettes with a padlock.
5. Child taps an unlocked creature. The game starts.

Unhappy paths and edges:

| Situation | What happens |
|---|---|
| Resume card skipped with the house | The unfinished game stays saved. On the ladder, that creature's card shows a small "paused" badge (pause bars on a mini board). Tapping that card continues the game. |
| Child taps a different creature while a game is paused | A new game starts and the paused game is quietly discarded. No dialog (a pre reader cannot read one). Resolved, AC-61. |
| Resumed game where it was the creature's turn | The creature shows Thinking, then moves as normal. |
| Saved game cannot be restored (corrupt data) | The Resume card is not shown; the child lands on Home as if no game existed. No error message is shown to the child. |
| Child taps a locked creature | The padlock wiggles and a pointing hand slides along the path to the creature that must be beaten first. Nothing else happens. |
| Child taps someone else's avatar | Allowed. Profiles are not private from siblings (no personal data); the owner accepts this risk (PRD section 10). |
| Game opened from a Safari tab instead of the home screen icon | Works the same, but storage may be deleted after 7 days without use. The parent settings storage note tells the parent to use the icon. |
| Six profiles exist | The plus tile is hidden. A parent can delete a profile in settings. |

## Flow 3: Game

Happy path:

1. Game screen opens. The creature does its idle animation. The child always plays the light pieces at the bottom and moves first (AC-44). The gold turn ring shows whose turn it is throughout the game (AC-49).
2. **Child moves.** Tap a piece: it lifts, legal move dots appear, captures show orange corner brackets. Tap a dot or drag the piece to it (drag snaps to the nearest legal square within half a square). Tapping an illegal square gently drops the piece back (AC-09).
3. **Creature reacts** with exactly one emotion from the event table (creatures.md, PRD 6.1), about 2 seconds or less, never blocking input: Worried after a check or small capture, Surprised after the child takes a rook or queen, otherwise nothing.
4. **Creature thinks** (Thinking animation, thought bubble, 0.8 to 3 s) and moves; its piece glows and slides along the board over at least 400 ms. If it captures, the child's piece bursts in a small poof and drops into the creature's tray. The creature's from and to squares stay marked until the child's next move.
5. **Creature reacts** to its own move: Happy after a capture or check, otherwise idle.
6. Repeat. From v1.0, the creature may give a coach tip in its teaching pose after a blunder or a strong move, at most once in any 3 child moves (see screens.md, coach tip placement).
7. **Game ends** (checkmate, stalemate, a draw, or the creature resigns). The final move plays, the board dims slightly, and the creature plays Sad (child won), big resign Sad (Levels 1 and 2 gave up), Celebrating (creature won) or Good sport (draw). After about 2 seconds (3 seconds after a resignation) the Result screen slides up. **Exception:** if the creature checkmated the child and an oops token is left, the loss is held (Flow 3a).
8. **Result screen.** Win: big celebration for the child, Next creature is the primary action, Rematch is secondary. Lose: the creature's short celebration turns into Good sport, Rematch is primary. Draw: both shake hands, Rematch is primary. House goes Home.
9. **First win against a creature** also plays the unlock celebration: the next creature's padlock pops open and the creature steps out of its silhouette.

Special moments inside the game:

| Moment | What the child sees |
|---|---|
| Child's king in check | King shakes, a red starburst pulses behind it twice, then stays as a still red starburst until check is resolved (AC-12). Only moves that escape check get dots. |
| Creature's king in check | Same red starburst on the creature's king, so the child sees their check landed (AC-12). |
| Easy creature clearly losing (Levels 1 and 2) | Nothing changes on screen; the creature quietly stops stalling (no stalemate traps, no repeated positions) and walks its king out. If it stays down 9 or more points for 3 of its moves, it resigns: it lays its king down, waves a small white flag, and plays a big Sad. The child wins (AC-54). |
| Promotion | Overlay with four large piece buttons (queen, rook, bishop, knight) above the promoting pawn. The queen is pre highlighted with a pointing hand. Back arrow cancels and returns the pawn (see Flow 3b). |
| Castling | When the king is tapped, the castling square gets a normal dot. After the move, the rook visibly hops over the king. |
| En passant | The capture square gets the normal dot plus a small orange bracket on the pawn that will be taken, so the child sees which piece goes. |
| Draw by repetition, 50 moves, too few pieces, stalemate | Result screen shows a picture that explains the draw (see screens.md, Result, draw pictograms) plus one short sentence for readers. |

### Flow 3a: Oops (take back)

1. Child has made at least one move and at least one oops token is left. The oops button is bright, on the child's turn and also while the creature is thinking.
2. Child taps oops. One token flies from the tray to the button and pops. **Each tap undoes one full move pair:**
   - On the child's turn: the creature's reply and then the child's move play backwards on the board, each about 300 ms.
   - While the creature is thinking: the creature's search is cancelled, no creature move is played, and the child's last move plays backwards (AC-65).
3. The game is exactly as it was before that move pair: position, repetition history, 50 move counter and the easy creatures' resign count (AC-66). Any open coach tip closes.
4. The creature returns to idle after a playful rewind spin with a rewind swirl bubble ("Whoosh! Back in time!"). In v0.1 the spin uses the idle pose; from v0.2 it uses the Surprised face parts.
5. It is the child's turn. The child moves again, or taps oops again to go back one more pair if a token is left.

**Held checkmate (AC-64).** If the creature checkmates the child and at least one token is left:

1. The final position stays on the board, bright, with the red starburst on the child's king. The creature plays Celebrating once, then waits in idle.
2. The oops button glows slowly, and a green "see result" button with a tipped over king icon appears on the child side.
3. Tapping oops undoes the mating move pair and play continues from the child's turn. Tapping "see result" accepts the loss and the Result screen slides up. There is no timer; nothing moves on by itself.
4. With zero tokens left, the Result screen follows the checkmate as normal.

Unhappy paths:

| Situation | What happens |
|---|---|
| **Zero tokens left** | The button turns grey with a dashed outline, its arrow is faded, and the two token sockets are empty outlines. Tapping it does nothing to the game (AC-41). The empty sockets give one small shrug wiggle so the tap is not met with silence. No text, no error. |
| No move made yet | Same disabled look as zero tokens, but the sockets are full. Tapping does nothing. |
| Creature is thinking | Button is active; a tap cancels the creature's move and takes back the child's last move (AC-65). |
| Game is over (child won, resignation, stalemate, any draw, or an accepted loss) | Oops is not on the Result screen; the result cannot be undone (AC-42). |
| Held checkmate, child leaves with the house | The held position is saved like any paused game; on resume it is still held, with the same tokens (AC-43, v0.2). |
| Game resumed | Remaining tokens are restored exactly (AC-43). |
| Coach tip shows a blunder | The tip card points at the oops button, which glows once, if a token is left. It never presses it for the child. |

### Flow 3b: Promotion cancel

Tapping the back arrow on the promotion overlay puts the pawn back on its previous square. The child's turn continues. This keeps the overlay from being a dead end.

### Flow 3c: Leaving mid game

Tapping the house saves the game instantly and goes Home. No dialog. The creature waves goodbye in a 0.5 second animation that does not delay navigation. On return, Flow 2 offers the game first.

Rotating the iPad at any time swaps the layout without losing state, selection or an open overlay.

## Flow 4: Learn

Happy path, lessons:

1. Home shows two learning doors beside the ladder: **Lessons** (open book with a pawn on it) and **Puzzles** (jigsaw piece).
2. Child taps Lessons. The **Lessons list** shows 9 cards: pawn, rook, knight, bishop, queen, king, check, checkmate, castling. Each card shows the piece or idea as a picture and 3 star sockets. Every lesson has 3 steps and each finished step fills one star.
3. Child taps a card. **Lesson** screen: a small board with only the pieces needed. The teaching creature (Wobble in its teaching pose, open question D10) demonstrates with a pointing hand and a ghost move animation, twice. Then the hand points at the child's piece and waits.
4. Child makes the move. Stars fly into the corner; the next step of the lesson begins. The last step always ends with the child making the move (AC-31).
5. Lesson complete: big star burst, then back to the Lessons list with the card now showing its stars and a check badge.

Happy path, puzzles:

1. Child taps Puzzles. The **Puzzles list** shows two shelves: "mate in one" (king with a tipped crown icon) and "win a piece" (hand grabbing a piece icon). Each puzzle tile shows a tiny board thumbnail and an empty or filled star (no numbers). A solved puzzle always earns its one star, however many tries it took. Solved tiles glow gold.
2. Child taps a tile. The **Puzzle** screen shows the board and the goal icon in the top bar.
3. Correct move: the target animates (king tips over, or the piece is grabbed), stars fly, a big green play arrow goes to the next puzzle.

Unhappy paths:

| Situation | What happens |
|---|---|
| Wrong move in a puzzle | The piece slides back gently, the goal icon wiggles, the teacher shows a "try again" gesture (circular arrow). No penalty, no lost stars (AC-33). |
| Three wrong moves in a row on the same step | The teacher shows a hint: the piece to move glows and a pointing hand hovers over it. Not the destination, only the piece. Still no penalty. |
| Wrong move in a lesson | Same as puzzles; after two wrong moves the ghost demo replays once. |
| Leaving a lesson or puzzle halfway | House goes Home, progress inside the lesson is not kept, earned stars are kept. |
| Coach tips switched off by the parent | Lessons and puzzles still use the teacher, because teaching is their purpose. The switch only affects tips during games. |

## Flow 5: Parent

Happy path:

1. Parent taps the small gear, top right on the profile picker or Home. The gear is not on the game, lesson or puzzle screens.
2. **Parent gate** opens as a full screen overlay with a grey close cross top left and a PIN pad.
3. Parent enters the 4 digit PIN set at first launch (AC-27). "Forgot PIN?" asks a multiplication question and then lets the parent set a new PIN (AC-59).
4. **Parent settings:** language, coach tips on or off, unlock all creatures (per profile), profiles (games played and won, delete, reset progress), change PIN, export and import, and a note to always launch from the home screen icon because clearing Safari data removes all progress. v0.2 shows only language, change PIN and the note.
5. Close cross returns to the screen the gear was tapped on. Language changes apply immediately.

Unhappy paths:

| Situation | What happens |
|---|---|
| **Gate failure, first or second wrong PIN** | The dots shake once and clear. No message a child could learn from. |
| **Gate failure, third wrong PIN in a row** | The gate closes by itself and returns to where it was opened. The gear shows a grey clock ring that empties over 60 seconds; tapping it during that time only wiggles it. After 60 seconds it works again. |
| Child opens the gate and taps around | Nothing reachable except the close cross, the keypad and "forgot PIN" (a multiplication the child can't reliably do). No settings are shown behind the gate. 10 guessed PINs never open settings (AC-27). |
| Gate left open and idle for 60 seconds | Gate closes by itself. |
| Parent settings left idle for 2 minutes | Settings close by themselves and return to the previous screen, so a child who inherits the iPad is not left inside. |

### Flow 5a: Delete a profile

1. In Parent settings, Profiles, each profile row shows avatar, name, progress summary and a trash button.
2. Tapping trash opens a confirmation panel that names the profile and what will be lost (games, unlocked creatures, lesson and puzzle stars, paused game).
3. The delete button must be **held for 2 seconds** (a ring fills around it). Releasing early cancels with no effect. A cancel button sits beside it.
4. After delete: the row slides away.

Edges:

| Situation | What happens |
|---|---|
| Deleted profile was the active one | On closing settings, the app returns to the profile picker, not to that profile's Home. |
| Last remaining profile deleted | On closing settings, the app goes to profile creation (Flow 1 step 2). Language is kept. Meet Wobble is shown again. |
| Reset progress (instead of delete) | Same confirm pattern. Profile keeps name and avatar; ladder goes back to only Level 1 unlocked; stars and paused game cleared. |

## Flow check against the ux-ipad-kids checklist

| Check | Result |
|---|---|
| One tap back or home on every screen | Pass: see navigation table. Two root screens have nothing behind them. |
| Same position for back or home | Pass: always top left. |
| Icon, not text | Pass: avatar, house, arrow, cross. |
| No dead ends | Pass: promotion overlay has cancel; gate closes itself; result screen always has house. |
| No confirmation dialogs for a child | Pass: only the parent sees a confirm (profile delete, reset). |
| Playing within seconds | Pass: first launch is a flag, the parent's PIN, and 2 taps to the board; returning is 2 taps (avatar, creature) or 2 taps via resume. |
| Errors never punished | Pass: illegal taps, wrong puzzle moves and gate mistakes are all soft. |
| Parent things behind a gate | Pass: settings, language change, unlock all, delete and reset, all behind the parent PIN. |
