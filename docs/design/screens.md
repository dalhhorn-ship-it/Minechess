# Minechess Screen Specs

Status: design draft v0.2, updated for PRD Draft v0.3
Author: ux-ipad-kids (design stage), updated by product-manager for owner answers round 2
Related: [flows.md](flows.md), [creatures.md](creatures.md), [visual-language.md](visual-language.md), [open-questions.md](open-questions.md)

## How to read this file

Each screen lists its purpose, its one primary action, the layout regions in landscape and portrait (portrait from v0.2; v0.1 is landscape only and shows a "turn the iPad" picture in portrait), what Noor (5, cannot read) and Sam (9, reads) get out of it, and its states. Sizes are in iOS points (pt). Reference viewports are the smallest supported iPads in Safari with toolbars showing:

| Device (2019 or later) | Landscape usable area | Portrait usable area |
|---|---|---|
| iPad mini 5 (smallest supported, used for AC-11) | about 1024 × 690 | about 768 × 950 |
| iPad 10.2 inch | about 1080 × 740 | about 810 × 1010 |
| iPad Air / 11 inch | about 1180 × 760 | about 820 × 1110 |

Global rules for every screen:

1. **Top left** holds the back or home control, 80 × 80 pt, inset 24 pt from the top and left safe area edges. Always visible, never animated away.
2. **Top right** holds the parent gear only on the profile picker and Home. 56 × 56 pt, muted grey, inset 24 pt.
3. **Child controls** are at least 75 × 75 pt with at least 16 pt between targets. Nothing interactive sits within 24 pt of any screen edge or within the home indicator area.
4. **One primary action per screen**, drawn as the brightest element (green with a white play arrow, or the glowing next creature).
5. **No text is needed to understand any child screen.** Text appears only as a label under a picture, for Sam and for parents.
6. Layout adapts live on rotation; nothing is lost when the iPad turns (v0.2).
7. **No browser gestures in the game** (AC-50): no page scroll, zoom, text selection, callout or copy menu, and no edge swipe back navigation from touches.
8. The game is meant to be launched from its home screen icon (PRD 9.3), so it runs full screen with no Safari toolbars.

## Screen index

| # | Screen | Primary action | Top left |
|---|---|---|---|
| S1 | Language choice (first launch, v0.2) | Tap a flag | none (root) |
| S1a | Parent PIN set (first launch, v0.2) | Parent enters a PIN twice | Back arrow |
| S2 | Profile create | Pick an avatar, then play arrow | Back arrow |
| S3 | Meet Wobble intro | Tap the pawn the hand points at | House |
| S4 | Profile picker | Tap your avatar | none (root) |
| S5 | Resume card | Continue the paused game | House |
| S6 | Home (creature ladder) | Tap the glowing next creature | Own avatar (to picker) |
| S7 | Game | Make a move | House |
| S7a | Promotion picker (overlay) | Pick a piece | Back arrow (cancel) |
| S8 | Result | Next creature (win) or Rematch (lose, draw) | House |
| S8a | Unlock celebration (overlay) | Tap the new creature | House stays visible |
| S9 | Lessons list | Tap the next lesson card | House |
| S10 | Lesson | Make the shown move | House |
| S11 | Puzzles list | Tap the next unsolved puzzle | House |
| S12 | Puzzle | Make the winning move | House |
| S13 | Parent gate (PIN pad) | Enter the PIN | Close cross |
| S14 | Parent settings | Change a setting | Close cross |
| S14a | Delete or reset confirm (panel) | Hold to delete | Cancel button and close cross |

---

## S1 Language choice

**Purpose:** set the game language on first launch.
**Primary action:** tap a flag.

| Region | Landscape | Portrait |
|---|---|---|
| Centre | Two flag buttons side by side, each 220 × 160 pt, 80 pt apart | Two flag buttons stacked, each 260 × 180 pt, 64 pt apart |
| Background | Calm sky blue with a few floating blocks; Wobble peeks from the lower edge | Same |

- **Noor:** sees two bright pictures to tap. Either works; nothing breaks.
- **Sam:** reads "Nederlands" and "English" under the flags.
- **States:** default (flags gently bob one after the other every 8 seconds when idle); pressed (flag squashes 5 percent and a waving hand appears on it); after tap (screen slides left to S1a).

## S1a Parent PIN set (first launch)

**Purpose:** the parent chooses the 4 digit PIN that guards settings (PRD 7.9, AC-27).
**Primary action:** enter a PIN, then enter it again to confirm.

Same grown up grey and white style as S13: short text for the parent ("Parent: choose a 4 digit PIN"), four dot sockets, numeric keypad with 80 × 80 pt keys. If the second entry differs, the dots shake and the parent starts again. After confirming, the screen slides on to S2. There is no skip: the PIN is required, and the parent is expected to be present on first launch. A small note explains that "forgot PIN" on the gate asks a multiplication question.

- **Noor and Sam:** not for them; the grey look says "grown up screen".

## S2 Profile create

**Purpose:** give the child a picture that means "me".
**Primary action:** Step A tap an avatar, Step B tap the green play arrow.

| Region | Landscape | Portrait |
|---|---|---|
| Top left | Back arrow | Back arrow |
| Step A centre | Grid 6 × 2 of avatar tiles, 120 × 120 pt | Grid 3 × 4 of avatar tiles, 130 × 130 pt |
| Step B centre | Chosen avatar large (200 pt) on the left, name field (pencil icon, 360 pt wide, 80 pt tall) on the right | Chosen avatar large on top, name field below |
| Step B bottom right of content | Green play arrow button 120 × 120 pt (inside safe area, not in the corner) | Green play arrow centred under the field |

Avatars: 12 original blocky animal heads (fox, cat, bear, frog, rabbit, penguin, panda, owl chick, turtle, pig, lion, whale), each on its own background colour and background shape (circle, square, star, hexagon and so on), so two avatars never share both colour and shape. Avatars already used by another profile show a small lock and cannot be picked.

- **Noor:** taps a favourite animal, then the big green arrow. The iPad keyboard may appear; she can ignore it because the arrow works with an empty name.
- **Sam:** types his name.
- **States:** avatar tile default, pressed (lift and bounce), selected (thick white ring plus a check badge), taken (dimmed, lock badge, no response except a small wiggle). Name field empty (pencil icon pulses once), typing, full at 12 characters (field wiggles on extra taps).

## S3 Meet Wobble intro

**Purpose:** show how to move without a single word, then start the first game.
**Primary action:** tap the pawn the hand points at, then the dot.

Uses the S7 Game layout with the board already set. Wobble enters from off screen, waves with a bubble (waving hand icon, "Hi! Let's play!"), then the pointing hand demonstrates one tap on a pawn and one tap on a dot. The hand then loops over the child's pawns until the first tap. After that the screen simply is the first game.

- **Noor:** copies the hand.
- **Sam:** skips ahead by moving any piece; the hand disappears on the first tap.

## S4 Profile picker

**Purpose:** "which one is me?"
**Primary action:** tap your avatar.

| Region | Landscape | Portrait |
|---|---|---|
| Top right | Parent gear (56 pt) | Parent gear |
| Centre | Row of up to 6 avatar tiles, 150 × 150 pt, name under each; a plus tile at the end (dashed outline, plus icon) | Grid 2 × 3 of avatar tiles, 170 × 170 pt, plus tile last |
| Background | Blocky meadow; small creatures you have beaten wander along the bottom edge (decorative, not tappable) | Same |

- **Noor:** recognises her animal and its background shape.
- **Sam:** reads names.
- **States:** tile default (gentle idle blink of the animal), pressed (bounce), plus tile hidden when 6 profiles exist. A tile shows a small paused board badge when that child has a paused game.

## S5 Resume card

**Purpose:** get the child straight back into the game they left.
**Primary action:** green play arrow (continue).

| Region | Landscape | Portrait |
|---|---|---|
| Top left | House (to Home) | House |
| Centre | Card 560 × 420 pt: mini board (300 pt) of the saved position on the left, the creature in its idle animation on the right, beckoning | Card 520 × 560 pt: creature on top, mini board below |
| Under card | Green play arrow 140 × 140 pt | Same |

- **Noor:** sees "my creature is waiting for me" and the big green arrow.
- **Sam:** also sees the oops tokens left shown on the card.
- **States:** default; pressed (card zooms into the full Game screen, which makes the link between card and game visible).

## S6 Home (creature ladder)

**Purpose:** choose what to do: fight the next creature (main), or learn.
**Primary action:** tap the glowing next creature.

| Region | Landscape | Portrait |
|---|---|---|
| Top left | Own avatar (80 pt, round), goes to S4 | Same |
| Top right | Parent gear | Parent gear |
| Main area | Ladder: 8 creature cards (170 × 200 pt) in two rows of 4 on stepping stone blocks, a blocky path climbing from Level 1 bottom left to Level 8 top right | Ladder: 4 rows of 2 cards (180 × 190 pt), path zigzags upward, Level 1 at the bottom |
| Side or bottom | Right column: two learning doors 150 × 150 pt stacked: Lessons (book with pawn), Puzzles (jigsaw piece) | Bottom row: the two learning doors side by side, 150 × 120 pt |

Creature card content (AC-17): creature picture in its idle loop, name, strength stars (see visual-language.md), one line personality in the active language.

| Card state | Look | Tap |
|---|---|---|
| Next to beat | Full colour, glowing gold outline, bounces every 3 seconds; a pointing hand hovers over it the first 3 visits | Starts a game |
| Beaten | Full colour, gold medal badge in the corner | Starts a game |
| Unlocked, not the next (after unlock all) | Full colour, no glow | Starts a game |
| Paused game | Any unlocked state plus a small pause board badge | Continues the paused game |
| Locked | Dark silhouette, padlock, no name, stars shown | Padlock wiggles, hand slides along the path to the next to beat |

- **Noor:** follows the glow and the bouncing hand. She never needs to read.
- **Sam:** reads stars and the personality line, picks a creature to replay, sees medals as trophies.
- **Portrait scroll:** the 4 rows fit on all reference devices without scrolling; if they would not fit, the whole ladder scales down, it never scrolls.

## S7 Game

**Purpose:** play chess against the creature and feel it react.
**Primary action:** make a move on the board.

### Landscape layout (reference 1024 × 690)

```
+--------+-------------------------------+-----------------+
| [HOUSE]|                               |  [speech bubble]|
|        |                               |    \/           |
| avatar |                               |   CREATURE      |
| + your |           BOARD               |   (180 x 200)   |
| taken  |        640 x 640 pt           |                 |
| pieces |      (80 pt squares)          | creature's taken|
|        |                               | pieces          |
|        |                               | [lightbulb]     |
|        |                               |                 |
| [OOPS] |                               |                 |
| (o)(o) |                               |                 |
+--------+-------------------------------+-----------------+
  CHILD SIDE (160 pt)                      CREATURE SIDE (200 pt)
```

| Region | Content |
|---|---|
| Child side (left, 160 pt) | House (top), the child's avatar with the pieces the child has captured below it, oops button (90 pt) with two token sockets next to it (bottom, raised at least 40 pt above the bottom safe edge so the resting left thumb does not hit it). A gold turn ring glows around the avatar while it is the child's turn |
| Board (centre) | Square, as large as fits: height minus 2 × 24 pt. The child always plays the light pieces at the bottom (AC-44). No coordinates by default (see open question D6). |
| Creature side (right, 200 pt) | Speech bubble on top (max 190 pt wide, tail points down at the creature), creature (180 × 200 pt) with its emotion animations and a gold turn ring under it while it is the creature's turn, the lightbulb replay badge after a coach tip (v1.0), the pieces the creature has captured below |

The layout puts "your things" on your side and "the creature's things" on its side. Speech bubbles never overlap the board.

### Portrait layout (reference 768 × 950, from v0.2)

```
+----------------------------------------------+
| [HOUSE]  CREATURE (130)  [speech bubble <]   |  top band 150 pt
|          creature's taken pieces (small)     |
+----------------------------------------------+
|                                              |
|                 BOARD                        |
|           up to 704 x 704 pt                 |
|           (80 to 88 pt squares)              |
|                                              |
+----------------------------------------------+
| avatar + your taken        | [OOPS] (o)(o)   |  bottom band 110 pt
+----------------------------------------------+
```

| Region | Content |
|---|---|
| Top band | House (top left), creature (130 pt tall) left of centre, speech bubble to the right of the creature with its tail pointing left, the creature's captured pieces in a small row under the bubble |
| Board | Width minus 2 × 32 pt, capped by available height |
| Bottom band | Child's avatar with captured pieces and its turn ring (left), oops button and tokens (right, inset 40 pt from the right edge) |

If the height is tight, the board shrinks first down to 72 pt squares, then the bands shrink. Squares never go below 60 pt on any supported device (AC-11).

### Coach tip placement (v1.0)

Coach tips come from the opponent creature itself (PRD 7.6, open question Q6), in its teaching pose.

- **On the board (the real teaching):** ghost arrows and a ghost piece replay the threat or the good move on the board squares, semi transparent, looping twice. This works without reading.
- **Landscape:** the creature switches to its teaching pose (side on, glasses, star pointer aimed at the board) and a tip card grows out of the creature side column (190 × 300 pt, below the creature, never over the board). The card holds the lightbulb icon, a small animated diagram, and one short sentence for readers.
- **Portrait:** the tip card slides down from the top band (380 × 140 pt) beside the creature in its teaching pose. The board ghost arrows work the same.
- The tip closes on one tap anywhere on the card, or automatically when the child makes the next move. It never blocks the board. After it closes, a small lightbulb badge stays beside the creature until the child's next move; tapping it replays the tip.
- At most one tip in any 3 child moves (AC-30). A tip starts only after the half move's emotion has finished; while it is open, no emotion plays (AC-62). Oops closes an open tip (AC-66).
- If the tip is about a blunder and an oops token is left, the card shows an arrow that points at the oops button, and the button glows once.

### Board states

| Element | State | Behaviour |
|---|---|---|
| Child's piece | Default | Still, light piece with dark outline |
| | Selectable hint | After 10 seconds of no input on the child's turn, all pieces that can move do one small hop, once |
| | Selected | Lifts 6 pt with a soft shadow, square gets a thick blue frame |
| | Dragging | Follows the finger 40 pt above the touch point so the finger does not hide it; nearest legal square shows a larger dot |
| | No legal moves | Tapping it makes it shake its head (small left right wiggle), no dots |
| Legal move square | Empty target | Blue dot with white halo |
| | Capture target | Orange corner brackets with navy outline around the enemy piece |
| Last move | From and to squares | Soft yellow tint plus small corner ticks, for both players. The creature's from and to squares stay marked until the child completes their next move (AC-47) |
| Creature's move | Piece travelling | Glows on pickup, slides over at least 400 ms (knight in an arc) so the child can follow it (AC-46) |
| Captured child piece | Taken | Bursts into a small puff of blocks ("poof", about 400 ms), then its small copy drops into the creature's tray (AC-48) |
| King (either side) | In check | Red starburst behind it, king shakes twice; applies to the creature's king too (AC-12) |
| Board | Creature's turn | Child's pieces can still be tapped to look at moves (dots show in grey), but no move is made. See open question D5. |
| | Held checkmate (AC-64) | Board stays bright, final position shown, no piece input; oops button glows slowly, a green "see result" button with a tipped over king icon appears on the child side (open question D19) |
| | Game over | Board dims 20 percent, no input |

### Controls states

| Element | Default | Pressed | Disabled | Other |
|---|---|---|---|---|
| House | White round button, navy house | Squash | never | Tap saves and goes Home instantly |
| Oops button | Bright blue round button with a curved back arrow | Squash, token flies and pops | Grey, no glow. With zero tokens: dashed outline and empty sockets | Disabled only before the first move or with zero tokens. Active while the creature thinks (cancels its move, AC-65) and during a held checkmate (AC-64) |
| Oops tokens | Two filled gold coins with the back arrow | n/a | Empty socket outline once used | Shrug wiggle when the disabled button is tapped |
| Turn ring | Gold ring glowing around the avatar (child's turn) or under the creature (creature's turn) | n/a | n/a | Switches within 200 ms of each move; always visible during a game (AC-49) |
| Lightbulb badge (v1.0) | Small lightbulb beside the creature after a tip | Replays the last tip | Hidden when no tip was shown since the child's last move | 75 pt hit area |
| Creature | Idle loop | Tapping the creature makes it do a short personality giggle (decorative, never blocks) | n/a | Emotions per creatures.md; teaching pose during a tip |

- **Noor:** sees her pieces, taps one, sees dots, taps a dot. Follows the turn ring and watches the creature's face to know how she is doing. Uses oops when the tip card points to it.
- **Sam:** also reads coach tip sentences, watches captured piece trays, decides when to spend oops.

## S7a Promotion picker (overlay)

**Purpose:** choose what the pawn becomes (AC-04).
**Primary action:** tap a piece.

A dimmed board with a card anchored above the promoting pawn: four piece buttons 100 × 100 pt in a row (queen, rook, knight, bishop). The queen is first, larger and glowing; a pointing hand hovers over it for Noor. Top left of the card: back arrow that cancels the move. In portrait the card is centred horizontally above the board.

## S8 Result

**Purpose:** make the ending feel great or OK, then offer the next step.

| Result | Creature | Child side | Primary action | Secondary |
|---|---|---|---|---|
| Child wins (checkmate or the creature resigns) | Sad (big resign Sad after a resignation), then Good sport (bows, holds out a medal) | Big celebration: child's avatar jumps on a block podium, falling blocky confetti, gold medal lands on the avatar | **Next creature** (green play arrow with the next creature's face on it), only if unlocked | Rematch (circular arrow with the same creature's face), smaller |
| Child loses | Celebrating (short, 2 seconds), then Good sport (thumbs up, "Play again?") | Avatar gets a friendly pat, no sad effects on the child | **Rematch** | none |
| Draw | Good sport, handshake with the child's avatar | Handshake animation, a small silver medal for both | **Rematch** | Next creature if already unlocked |

Layout, landscape: creature on the right, child's avatar on the left, the podium or handshake in the middle, action buttons under them (primary 160 × 120 pt, secondary 110 × 90 pt, 40 pt apart). Portrait: creature and avatar side by side on top, buttons below. House top left always.

Draw pictograms (AC-06, AC-56), shown in the middle with one sentence for readers. The picture alone must explain the draw to a non reader:

| Draw type | Picture |
|---|---|
| Stalemate | King with all arrows around it crossed out, sleeping |
| Threefold repetition | Same mini board three times with a circular arrow |
| 50 move rule | A long line of footprints that fades out |
| Insufficient material | Two lone kings shaking hands |

Resignation (child wins) shows the creature's king lying down next to a small white flag.

- **Noor:** reads the result from faces and the medal: podium means "I won".
- **Sam:** reads the sentence and the next creature's name.

## S8a Unlock celebration (overlay)

On the first win against a creature. The next creature's locked silhouette appears, the padlock shakes and pops open, and the creature steps out in full colour and waves (about 2.5 seconds). The Next creature button then becomes primary. Tapping the new creature starts that game.

## S9 Lessons list

**Purpose:** pick a lesson.
**Primary action:** tap the next unfinished lesson (it glows).
Nine cards, 150 × 170 pt, in a 5 + 4 grid (landscape) or 3 × 3 grid (portrait): pawn, rook, knight, bishop, queen, king, check, checkmate, castling. Each card: picture, 3 star sockets, check badge when done. House top left.

## S10 Lesson

**Purpose:** learn one piece or idea by doing.
**Primary action:** make the move the hand points at.
Board with only the needed pieces, the teaching creature (Wobble in its teaching pose, open question D10) in the creature panel with a 3 step progress row of star sockets under it. The teacher demonstrates with a ghost move twice, then the pointing hand waits on the child's piece. Short sentence under the teacher for readers.

## S11 Puzzles list

**Purpose:** pick a puzzle.
**Primary action:** tap the next unsolved puzzle (glows).
Two shelves with a picture header each: mate in one (king with a tipped crown), win a piece (hand grabbing a piece). Tiles 110 × 110 pt with a mini board thumbnail and a star socket. Shelves scroll sideways if needed, with a large arrow button at each end (no swipe required).

## S12 Puzzle

**Purpose:** find the one winning move.
**Primary action:** make the move.
S7 layout with the creature side showing the goal icon (large) and the teaching creature (open question D10). After a wrong move the piece slides back and the teacher shows a circular try again arrow; after three wrong moves the correct piece glows (flows.md, Flow 4). After solving: star flies to the socket and a green play arrow goes to the next puzzle.

## S13 Parent gate (PIN pad)

**Purpose:** keep children out of settings (AC-27).
**Primary action:** enter the 4 digit parent PIN.

| Region | Both orientations |
|---|---|
| Top left | Grey close cross |
| Centre | Short text for the parent ("Parent PIN") and four dot sockets |
| Below | Numeric keypad, keys 80 × 80 pt, plus a clear key; the PIN is checked on the fourth digit |
| Bottom | Small text link "Forgot PIN?" (44 pt target) |

- A wrong PIN shakes the dots and clears them. Three wrong PINs in a row close the gate with a 60 second cooldown on the gear (flows.md, Flow 5).
- **Forgot PIN** (AC-59): shows a two digit times two digit multiplication ("Parent: what is 17 × 13?"). A correct answer opens S1a to set a new PIN; wrong answers follow the same three strikes and 60 second cooldown.
- Visual style is deliberately grown up: grey and white, no creatures, no bright colours, so it does not look like a game to a child.

## S14 Parent settings

**Purpose:** parent controls. Text is allowed here; the audience is an adult.
**Primary action:** change a setting (each row acts on its own; there is no save button).

Rows: Language (two flags as a segmented control), Coach tips during games (on/off switch, v1.0), Unlock all creatures (per profile switch, v1.0), Profiles (list with, per profile, games played and games won, reset and delete; v1.0), Change PIN, Export and import profiles (v1.0), Storage note (see copy deck). v0.2 shows only Language, Change PIN and the storage note. Close cross top left. Closes itself after 2 minutes idle.

## S14a Delete or reset confirm

Panel over settings: avatar and name, a list of what is lost, a red delete button that must be held 2 seconds (a ring fills), and a cancel button of the same size to its left. Reset uses the same pattern with an orange button.

---

## Copy deck

Child facing labels are optional support for readers. Picture first, text second.

| Key | Where | English | Dutch |
|---|---|---|---|
| lang.nl | S1 flag label | Nederlands | Nederlands |
| lang.en | S1 flag label | English | English |
| profile.name.placeholder | S2 name field | Your name | Jouw naam |
| profile.add | S4 plus tile label | New player | Nieuwe speler |
| resume.label | S5 under the card | Keep playing! | Verder spelen! |
| ladder.lessons | S6 door label | Lessons | Lessen |
| ladder.puzzles | S6 door label | Puzzles | Puzzels |
| ladder.locked.a11y | S6 locked card, screen reader | Locked. Beat {previous} first. | Op slot. Versla eerst {previous}. |
| result.win | S8 headline | You won! | Jij hebt gewonnen! |
| result.lose | S8 headline | Good try! | Goed geprobeerd! |
| result.draw | S8 headline | It's a draw! | Gelijkspel! |
| result.next | S8 button label | Next creature | Volgend wezen |
| result.rematch | S8 button label | Play again | Nog een keer |
| draw.stalemate | S8 sentence | No moves left, but no check. | Geen zet meer, maar geen schaak. |
| draw.repetition | S8 sentence | Same position three times. | Drie keer dezelfde stand. |
| draw.fifty | S8 sentence | 50 moves with no capture. | 50 zetten zonder slaan. |
| draw.material | S8 sentence | Nobody can checkmate anymore. | Niemand kan nog mat zetten. |
| unlock.new | S8a caption | New creature! | Nieuw wezen! |
| puzzle.mate1 | S11 shelf label | Checkmate in one | Mat in één |
| puzzle.winpiece | S11 shelf label | Win a piece | Win een stuk |
| puzzle.retry | S12 under the teacher | Try again! | Probeer nog eens! |
| pin.set | S1a | Parent: choose a 4 digit PIN | Ouder: kies een pincode van 4 cijfers |
| pin.confirm | S1a | Enter it again | Nog een keer invoeren |
| gate.pin | S13 | Parent PIN | Pincode ouder |
| gate.forgot | S13 | Forgot PIN? | Pincode vergeten? |
| gate.prompt | S13 forgot PIN | Parent: what is {a} × {b}? | Ouder: hoeveel is {a} × {b}? |
| result.resign | S8 sentence | The creature gave up. You win! | Het wezen geeft op. Jij wint! |
| result.seeresult | S7 held checkmate, button label | See result | Uitslag bekijken |
| settings.title | S14 | Parent settings | Instellingen voor ouders |
| settings.language | S14 | Language | Taal |
| settings.coach | S14 | Coach tips during games | Tips van de coach tijdens het spel |
| settings.unlockall | S14 | Unlock all creatures | Alle wezens vrijspelen |
| settings.profiles | S14 | Players | Spelers |
| settings.reset | S14 | Reset progress | Voortgang wissen |
| settings.delete | S14 | Delete player | Speler verwijderen |
| settings.hold | S14a | Hold to delete | Ingedrukt houden om te verwijderen |
| settings.cancel | S14a | Cancel | Annuleren |
| settings.played | S14 | Games played | Gespeeld |
| settings.won | S14 | Games won | Gewonnen |
| settings.pin | S14 | Change PIN | Pincode wijzigen |
| settings.export | S14 | Export players | Spelers exporteren |
| settings.import | S14 | Import players | Spelers importeren |
| settings.storage | S14 | Always open Minechess from its home screen icon. Progress is saved only on this iPad. Clearing Safari website data removes all players. | Open Minechess altijd via het icoon op het beginscherm. Voortgang staat alleen op deze iPad. Als je de websitegegevens van Safari wist, zijn alle spelers weg. |

Example coach tips, shown by the opponent creature in its teaching pose (picture carries the meaning, sentence is for readers):

| Trigger | Board picture | English | Dutch |
|---|---|---|---|
| Child left a piece unprotected and lost it | Ghost arrow from the attacker to the lost piece, lost piece flashes its outline twice slowly | That piece had no friend guarding it. | Dat stuk had geen vriend die oplette. |
| Child walked into a fork | Two ghost arrows from the knight to both targets | The horse attacked two at once! | Het paard viel er twee tegelijk aan! |
| Child made a fork | Two gold arrows, sparkle on the child's piece | Two attacks at once. Great move! | Twee aanvallen tegelijk. Super zet! |
| Child gave check | Gold arrow to the king | Check! The king must escape. | Schaak! De koning moet vluchten. |
| Child captured a free piece | Gold arrow, sparkle | A free piece. Well spotted! | Een gratis stuk. Goed gezien! |

## Accessibility notes

1. **No meaning depends on reading or sound.** Every state change has a shape or motion signal (see visual-language.md).
2. **No meaning depends on colour.** Dots, brackets, starbursts and ticks differ in shape, not only colour.
3. **Targets (AC-11):** child controls 75 pt or larger, board squares 60 pt or larger on the iPad mini (72 pt or larger where space allows), parent controls 44 pt or larger.
4. **Screen reader labels** exist for every control (for a parent or a helper), in the active language. Pieces are announced as "white knight on g1" style labels.
5. **Reduce motion:** when iPad Reduce Motion is on, bounces become fades, confetti becomes a static burst, and idle loops slow to one small movement every 5 seconds.
6. **No flashing:** nothing flashes more than twice per second, and no full screen flashes.
7. **One finger only.** Tap and drag; no pinch, long press or multi touch for children. The hold to delete gesture exists only behind the gate.
8. **Focus order** for keyboard or switch users: top left control, board (rank by rank from the child's side), child side controls, creature side.
