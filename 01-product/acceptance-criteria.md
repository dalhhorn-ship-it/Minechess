# Minechess Acceptance Criteria

Format: Given / When / Then. Version shows the first release that must pass it.

## Chess rules (F01)

| ID | Criterion | Version |
|---|---|---|
| AC-01 | Given any position, when the child taps a piece, then only moves legal under standard chess rules can be made | v0.1 |
| AC-02 | Given castling conditions are met (king and rook unmoved, no pieces between, king not in, through or into check), when the child moves the king two squares, then castling happens; otherwise it is not offered | v0.1 |
| AC-03 | Given an enemy pawn just moved two squares beside the child's pawn, when the child taps their pawn, then the en passant capture is offered for that move only | v0.1 |
| AC-04 | Given a pawn reaches the last rank, when the move is made, then the child picks queen, rook, bishop or knight using large picture buttons | v0.1 |
| AC-05 | Given a move leaves the opponent with no legal moves, when in check it ends as checkmate, and when not in check it ends as stalemate (draw) | v0.1 |
| AC-06 | Given threefold repetition, the 50 move rule, or insufficient material, then the game ends as a draw with a kid friendly explanation | v0.1 |

## Board and interaction (F02, F03)

| ID | Criterion | Version |
|---|---|---|
| AC-07 | Given it is the child's turn, when they tap a piece, then its legal destinations are highlighted and captures are marked differently from empty squares | v0.1 |
| AC-08 | Given a piece is selected, when the child taps a highlighted square or drags the piece there, then the move is made | v0.1 |
| AC-09 | Given a piece is selected, when the child taps a non legal square, then nothing breaks and the piece is deselected gently (no error sound or message) | v0.1 |
| AC-10 | Given the iPad is rotated, then the board, creature and controls stay fully visible and usable in both landscape and portrait | v0.1 |
| AC-11 | Given any tappable control, then its touch target is at least 44 by 44 points; board squares are at least 44 points on the smallest supported iPad | v0.1 |
| AC-12 | Given the child's king is in check, then the king is clearly highlighted | v0.1 |

## Creatures and AI (F04, F05)

| ID | Criterion | Version |
|---|---|---|
| AC-13 | Given it is the creature's turn, when the creature thinks, then a thinking animation plays and a move is made within 3 seconds on a 2019 iPad | v0.1 |
| AC-14 | Given 20 test games by a player who knows how the pieces move but has no strategy, then Level 1 loses at least 80 percent of them | v0.1 |
| AC-15 | Given 20 engine vs engine games between adjacent levels, then the higher level wins more games than it loses | v1.0 |
| AC-16 | Given an aggressive creature and a defensive creature at similar strength, then over 20 games the aggressive one makes clearly more captures and checks per game | v1.0 |
| AC-17 | Given a creature card in the ladder, then it shows the creature's name, picture, a strength indicator (stars, not numbers) and a one line personality | v1.0 |

## Emotions and results (F06, F07)

| ID | Criterion | Version |
|---|---|---|
| AC-18 | Given each event in PRD section 6, when it happens, then the matching emotion animation and speech bubble play | v0.1 |
| AC-19 | Given an emotion is playing, when the child taps a piece, then the input works immediately (reactions never block play) | v0.1 |
| AC-20 | Given any speech bubble, then it is 6 words or fewer, exists in Dutch and English, and never insults the child | v0.1 |
| AC-21 | Given the child wins, then the creature shows sad, the child gets a celebration, and Rematch, Next creature and Home are offered | v0.1 |
| AC-22 | Given the child loses, then the creature celebrates briefly, then shows an encouraging good sport line and Rematch and Home are offered | v0.1 |

## Language (F08)

| ID | Criterion | Version |
|---|---|---|
| AC-23 | Given a language is selected, then all text in the game, including lessons, coach tips and speech bubbles, appears in that language with no leftover text in the other | v0.1 |

## Profiles and ladder (F09, F10)

| ID | Criterion | Version |
|---|---|---|
| AC-24 | Given the profile screen, when a child creates a profile, then they can pick an avatar and optionally type a first name; no other personal data is requested | v1.0 |
| AC-25 | Given a new profile, then only Level 1 is unlocked; when the child beats Level N, then Level N+1 unlocks with a short celebration | v1.0 |
| AC-26 | Given two profiles, then each one's progress, puzzles and unfinished game are kept separately | v1.0 |

## Parent gate and settings (F11)

| ID | Criterion | Version |
|---|---|---|
| AC-27 | Given the settings button, when tapped, then a parent gate appears that needs a task a 6 to 9 year old can't reliably do, and settings open only after passing it | v1.0 |
| AC-28 | Given parent settings, then the parent can change language, unlock all creatures, switch coach tips and sound on or off, and delete a profile (with confirmation) | v1.0 |

## Resume (F12)

| ID | Criterion | Version |
|---|---|---|
| AC-29 | Given a game in progress, when Safari is closed and reopened, then the child is offered to continue the same game with the same position and creature | v0.1 |

## Learning (F13, F14, F15)

| ID | Criterion | Version |
|---|---|---|
| AC-30 | Given coach tips are on, when the child loses a piece to a simple tactic or plays a strong move, then a short tip in kid language explains why, and can be dismissed with one tap | v1.0 |
| AC-31 | Given the lessons menu, then there is one lesson per piece plus check, checkmate and castling; each lesson teaches by doing and finishes with the child making the move | v1.0 |
| AC-32 | Given the puzzles menu, then at least 20 mate in one and 10 win a piece puzzles are available; solving one earns stars saved to the profile | v1.0 |
| AC-33 | Given a wrong puzzle move, then the child sees a gentle "try again" and can retry without penalty | v1.0 |

## Platform and safety (F16, F17, F18)

| ID | Criterion | Version |
|---|---|---|
| AC-34 | Given sound is on, then moves, captures, check and results each have a distinct sound; muting silences all of them | v1.0 |
| AC-35 | Given the game is added to the iPad home screen, then it launches full screen with its own icon | v1.0 |
| AC-36 | Given the game has been loaded once, when the iPad is offline, then a game against any unlocked creature can be started and finished | v1.0 |
| AC-37 | Given the game is running, then no network requests go to third parties, no ads appear, and no personal data leaves the device | v0.1 |
| AC-38 | Given any screen, then there is a visible one tap route back or home | v0.1 |
