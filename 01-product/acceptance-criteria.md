# Minechess Acceptance Criteria

Format: Given / When / Then. Version shows the first release that must pass it (v0.1, v0.2, v1.0). Once passed, an AC must keep passing in every later version. Piece values and the emotion event table are in PRD sections 6.1 and 6.2.

## Chess rules (F01)

| ID | Criterion | Version |
|---|---|---|
| AC-01 | Given any position, when the child taps a piece, then only moves legal under standard chess rules can be made | v0.1 |
| AC-02 | Given castling conditions are met (king and rook unmoved, no pieces between, king not in, through or into check), when the child moves the king two squares, then castling happens; otherwise it is not offered | v0.1 |
| AC-03 | Given an enemy pawn just moved two squares beside the child's pawn, when the child taps their pawn, then the en passant capture is offered for that move only | v0.1 |
| AC-04 | Given a pawn reaches the last rank, when the move is made, then the child picks queen, rook, bishop or knight using large picture buttons | v0.1 |
| AC-05 | Given a move leaves the opponent with no legal moves, when in check it ends as checkmate, and when not in check it ends as stalemate (draw) | v0.1 |
| AC-06 | Given threefold repetition, the 50 move rule, or insufficient material, then the game ends as a draw, and the result screen explains which draw it was with a picture that a non reader understands without any text | v0.1 |
| AC-44 | Given any new game, then the child plays the light pieces, the light pieces are at the bottom of the board, and the child moves first | v0.1 |
| AC-45 | Given a test variant (for example, pawns may also move one square sideways) is added to the engine as a separate rule set, then games in that variant play correctly and all standard rule tests still pass, with no change to the board UI code or to the standard rules code | v1.0 |

## Board and interaction (F02, F03)

| ID | Criterion | Version |
|---|---|---|
| AC-07 | Given it is the child's turn, when they tap a piece, then its legal destinations are highlighted and captures are marked differently from empty squares | v0.1 |
| AC-08 | Given a piece is selected, when the child taps a highlighted square or drags the piece there, then the move is made | v0.1 |
| AC-09 | Given a piece is selected, when the child taps a non legal square, then nothing breaks and the piece is deselected gently (no error sound or message) | v0.1 |
| AC-10 | Given the iPad is rotated, then the board, creature and controls stay fully visible and usable in both landscape and portrait, with no loss of game state, selection or open overlay | v0.2 |
| AC-11 | Given the smallest supported iPad (iPad mini) in Safari, then every child control has a touch target of at least 75 by 75 points, every board square is at least 60 points, and every parent control is at least 44 by 44 points | v0.1 |
| AC-12 | Given either king is in check (the child's or the creature's), then that king is clearly highlighted until the check is resolved | v0.1 |
| AC-46 | Given the creature makes a move, then its piece visibly slides from its from square to its to square over at least 400 ms (a knight in an arc) | v0.1 |
| AC-47 | Given the creature has moved, then its from and to squares stay highlighted until the child completes their next move | v0.1 |
| AC-48 | Given the creature captures one of the child's pieces, then the captured piece disappears with a visible poof animation and appears in the creature's captured tray | v0.1 |
| AC-49 | Given any moment of a game in progress, then whose turn it is (child or creature) is shown on screen without text, and the indicator switches within 200 ms of each move | v0.1 |
| AC-50 | Given the game screen, when the child taps, double taps, long presses, drags, pinches or swipes from a screen edge anywhere on it, then the page does not scroll, zoom, select text, show a callout or copy menu, or navigate back | v0.1 |

## Creatures and AI (F04, F05, F24)

| ID | Criterion | Version |
|---|---|---|
| AC-13 | Given it is the creature's turn, when the creature thinks, then a thinking animation plays and the creature's move starts between 0.8 and 3 seconds after the child's move, on a 2019 iPad, at every level | v0.1 |
| AC-14 | Given the scripted test bot (plays mate in one when it has one, otherwise captures the highest value piece it can capture, otherwise plays a random legal move, with fixed seeds), when it plays 100 games as light against Level 1 and 100 against Level 2, then the bot wins at least 80 against Level 1 and at least 70 against Level 2; draws and unfinished games do not count as wins | v0.1 |
| AC-15 | Given 100 engine vs engine games between each pair of adjacent levels, with colours alternating, then the higher level scores at least 65 percent (win 1 point, draw half a point, loss 0) | v1.0 |
| AC-16 | Given an aggressive creature and a defensive creature at similar strength, then over 20 games the aggressive one makes clearly more captures and checks per game | v1.0 |
| AC-17 | Given a creature card in the ladder, then it shows the creature's name, picture, a strength indicator (1 to 5 stars, not numbers) and a one line personality | v1.0 |
| AC-51 | Given Level 1 or Level 2 is down 5 or more points of material, when it chooses a move, then it never plays a move after which the child has a reply that stalemates it, as long as it has another legal move | v0.1 |
| AC-52 | Given Level 1 or Level 2 is down 5 or more points of material, when it chooses a move, then it never plays a move that recreates a position that has already occurred in the game, as long as it has another legal move that does not | v0.1 |
| AC-53 | Given a scripted set of 20 positions where Level 1 or Level 2 is down 5 or more points and has a legal king move, then in at least half of its moves it moves its king to a square closer to the nearest child piece | v0.1 |
| AC-54 | Given Level 1 or Level 2 has been down 9 or more points of material after each of its last 3 moves, then it resigns before its next move: the game ends as a win for the child, the creature plays a big Sad animation (about 3 seconds), and the result counts as a win everywhere a win counts. Levels 3 to 8 never resign | v0.1 |
| AC-55 | Given the Silly creature (Muddle) plays 500 moves in test games, then between 15 and 25 percent of its moves are odd moves picked at random from its legal moves, and the rest follow its normal choice | v0.2 |

## Emotions and results (F06, F07)

| ID | Criterion | Version |
|---|---|---|
| AC-18 | Given a scripted test game that contains every event in the event table (PRD 6.1), including half moves that trigger more than one event, when each half move is played, then exactly one emotion plays for that half move and it is the one the table gives by priority, using the v0.1 fallback (short Sad) for Worried and Surprised until v0.2 | v0.1 |
| AC-19 | Given an emotion is playing, when the child taps a piece, then the input works immediately (reactions never block play) | v0.1 |
| AC-20 | Given any speech bubble, then it is 6 words or fewer, pairs its words with a picture icon that shows the meaning, exists in every supported language (Dutch in v0.1, Dutch and English from v0.2), and never insults the child | v0.1 |
| AC-21 | Given the child wins (by checkmate or resignation), then the creature shows Sad, the child gets a celebration, and Rematch, Next creature and Home are offered | v0.1 |
| AC-22 | Given the child loses, then the creature celebrates briefly (2 seconds or less), then shows the Good sport pose with an encouraging line, and Rematch and Home are offered | v0.1 |
| AC-56 | Given the game ends in a draw, then the creature shows the Good sport pose with the handshake icon, the result screen shows the picture for that draw type, and Rematch is the primary action | v0.1 |

## Language (F08)

| ID | Criterion | Version |
|---|---|---|
| AC-23 | Given a language is selected, then all text in the game, including lessons, coach tips and speech bubbles, appears in that language with no leftover text in the other | v0.2 |

## Profiles and ladder (F09, F10)

| ID | Criterion | Version |
|---|---|---|
| AC-24 | Given the profile screen, when a child creates a profile, then they first pick an avatar and then can optionally type a first name; the play arrow works with an empty name; no other personal data is requested | v1.0 |
| AC-25 | Given a new profile, then only Level 1 is unlocked; when the child beats Level N, then Level N+1 unlocks with a short celebration | v1.0 |
| AC-26 | Given two profiles, then each one's progress, puzzles and unfinished game are kept separately | v1.0 |
| AC-57 | Given an avatar is used by an existing profile, when another profile is created, then that avatar is shown as taken and cannot be picked | v1.0 |

## Parent gate and settings (F11)

| ID | Criterion | Version |
|---|---|---|
| AC-27 | Given first launch, then the parent sets a 4 digit PIN (entered twice to confirm) before any child play starts. Given the parent gear is tapped, then a PIN pad appears and settings open only after the correct PIN. Given a tester who does not know the PIN makes 10 attempts, then none of them opens settings, and after every 3 wrong attempts in a row the gear is locked for 60 seconds | v0.2 |
| AC-28 | Given parent settings, then the parent can change language, unlock all creatures for one chosen profile, switch coach tips on or off, reset a profile's progress and delete a profile (both with confirmation) | v1.0 |
| AC-58 | Given any screen, then the parent gear appears only on the profile picker and Home, never on the game, result, lesson or puzzle screens | v0.2 |
| AC-59 | Given the PIN pad, when the parent taps "forgot PIN", then a two digit times two digit multiplication appears; a correct answer lets the parent set a new PIN, and a wrong answer gives a new question with the same 60 second lock after 3 wrong answers | v0.2 |
| AC-60 | Given parent settings, then each profile shows the number of games played and games won, the counts update after every finished game (a resignation counts as a win), and they are stored only on the device and never sent anywhere | v1.0 |

## Resume (F12)

| ID | Criterion | Version |
|---|---|---|
| AC-29 | Given a game in progress, when Safari is closed and reopened, then the child is offered to continue the same game with the same position and creature | v0.2 |
| AC-61 | Given a paused game exists, when the child starts a game against any other creature, then the new game starts at once with no dialog and the paused game is discarded | v0.2 |

## Learning (F13, F14, F15)

| ID | Criterion | Version |
|---|---|---|
| AC-30 | Given coach tips are on, when the child loses a piece to a simple tactic, walks into a fork, makes a fork, gives check, or captures a free piece, then the opponent creature gives a tip: ghost arrows on the board show the idea, a short sentence is there for readers, one tap dismisses it (it also closes on the child's next move), it never blocks input, and at most one tip appears in any 3 child moves | v1.0 |
| AC-31 | Given the lessons menu, then there is one lesson per piece plus check, checkmate and castling; each lesson teaches by doing and finishes with the child making the move | v1.0 |
| AC-32 | Given the puzzles menu, then at least 20 mate in one and 10 win a piece puzzles are available; solving one earns stars saved to the profile | v1.0 |
| AC-33 | Given a wrong puzzle move, then the child sees a gentle "try again" and can retry without penalty | v1.0 |
| AC-62 | Given a coach tip is showing, then the creature is in its teaching pose with the lightbulb bubble icon, which is used for nothing else, and no emotion animation plays until the tip closes; the teaching pose never appears on the result screen | v1.0 |

## Platform and safety (F17, F18, no audio)

| ID | Criterion | Version |
|---|---|---|
| AC-34 | Given any screen or game event, then the game plays no audio at all | v0.1 |
| AC-35 | Given the game is added to the iPad home screen, then it launches full screen with its own icon | v0.2 |
| AC-36 | Given the game has been loaded once, when the iPad is offline, then a game against any unlocked creature can be started and finished | v1.0 |
| AC-37 | Given the game is running, then no network requests go to third parties, no ads appear, and no personal data leaves the device | v0.1 |
| AC-38 | Given any screen, then there is a visible one tap route back or home | v0.1 |
| AC-63 | Given the game is installed to the home screen and has requested persistent storage, when it is launched from the home screen after 14 days without use, then all profiles, progress, stars and any paused game are intact | v1.0 |

## Oops credits (F23)

| ID | Criterion | Version |
|---|---|---|
| AC-39 | Given a new game, then the child has 2 oops credits, shown as 2 picture icons (no numbers needed) | v0.1 |
| AC-40 | Given at least 1 credit is left and the child has made at least one move, when the child taps oops on their turn, then exactly one move pair (the creature's last reply and the child's move before it) is taken back, one credit is used, and the creature shows a playful rewind reaction | v0.1 |
| AC-41 | Given 0 credits are left or no move has been made yet, then the oops button is visibly disabled and does nothing | v0.1 |
| AC-42 | Given a game ended by the child's win, a resignation, stalemate or any draw, or by a checkmate against the child that the child has accepted, then oops can't undo the result. A checkmate against the child while at least 1 credit is left is held (see AC-64) and can be undone | v0.1 |
| AC-43 | Given a game is resumed after closing Safari, then the remaining oops credits are restored too, including a held checkmate | v0.2 |
| AC-64 | Given the creature checkmates the child and at least 1 credit is left, then the loss is held: the final position stays on the board, the oops button glows, and a "see result" button appears; tapping oops undoes the move pair and play continues; tapping "see result" shows the loss. With 0 credits left, the loss result follows at once | v0.1 |
| AC-65 | Given the creature is thinking and at least 1 credit is left, when the child taps oops, then the creature's search is cancelled, no creature move is played, the child's last move is taken back, one credit is used, and it is the child's turn | v0.1 |
| AC-66 | Given oops is used, then the game state is exactly the state before the undone move pair: position, repetition history, 50 move counter and the easy creatures' resign count; the creature returns to idle, and any open coach tip closes | v0.1 |
