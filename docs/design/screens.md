# Minechess Screen Specs

Status: design draft v0.1, based on PRD v0.2
Author: ux-ipad-kids (design stage)
Related: [flows.md](flows.md), [creatures.md](creatures.md), [visual-language.md](visual-language.md), [open-questions.md](open-questions.md)

## How to read this file

Each screen lists its purpose, its one primary action, the layout regions in landscape and portrait, what Noor (5, cannot read) and Sam (9, reads) get out of it, and its states. Sizes are in iOS points (pt). Reference viewports are the smallest supported iPads in Safari with toolbars showing:

| Device (2019 or later) | Landscape usable area | Portrait usable area |
|---|---|---|
| iPad mini 5 | about 1024 × 690 | about 768 × 950 |
| iPad 10.2 inch | about 1080 × 740 | about 810 × 1010 |
| iPad Air / 11 inch | about 1180 × 760 | about 820 × 1110 |

Global rules for every screen:

1. **Top left** holds the back or home control, 80 × 80 pt, inset 24 pt from the top and left safe area edges. Always visible, never animated away.
2. **Top right** holds the parent gear only on the profile picker and Home. 56 × 56 pt, muted grey, inset 24 pt.
3. **Child controls** are at least 75 × 75 pt with at least 16 pt between targets. Nothing interactive sits within 24 pt of any screen edge or within the home indicator area.
4. **One primary action per screen**, drawn as the brightest element (green with a white play arrow, or the glowing next creature).
5. **No text is needed to understand any child screen.** Text appears only as a label under a picture, for Sam and for parents.
6. Layout adapts live on rotation; nothing is lost when the iPad turns.

## Screen index

| # | Screen | Primary action | Top left |
|---|---|---|---|
| S1 | Language choice (first launch) | Tap a flag | none (root) |
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
| S13 | Parent gate | Answer the task | Close cross |
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
- **States:** default (flags gently bob one after the other every 8 seconds when idle); pressed (flag squashes 5 percent and a waving hand appears on it); after tap (screen slides left to S2).

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
| [PIP]  |                               |                 |
| coach  |                               |                 |
| [OOPS] |                               |                 |
| (o)(o) |                               |                 |
+--------+-------------------------------+-----------------+
  CHILD SIDE (160 pt)                      CREATURE SIDE (200 pt)
```

| Region | Content |
|---|---|
| Child side (left, 160 pt) | House (top), the child's avatar with the pieces the child has captured below it, Pip the coach (75 pt), oops button (90 pt) with two token sockets next to it (bottom, raised at least 40 pt above the bottom safe edge so the resting left thumb does not hit it) |
| Board (centre) | Square, as large as fits: height minus 2 × 24 pt. Child's pieces at the bottom. No coordinates by default (see open question D6). |
| Creature side (right, 200 pt) | Speech bubble on top (max 190 pt wide, tail points down at the creature), creature (180 × 200 pt) with its emotion animations, the pieces the creature has captured below |

The layout puts "your things" on your side and "the creature's things" on its side. Speech bubbles never overlap the board.

### Portrait layout (reference 768 × 950)

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
| avatar + your taken | [PIP] | [OOPS] (o)(o)  |  bottom band 110 pt
+----------------------------------------------+
```

| Region | Content |
|---|---|
| Top band | House (top left), creature (130 pt tall) left of centre, speech bubble to the right of the creature with its tail pointing left, the creature's captured pieces in a small row under the bubble |
| Board | Width minus 2 × 32 pt, capped by available height |
| Bottom band | Child's avatar with captured pieces (left), Pip (centre), oops button and tokens (right, inset 40 pt from the right edge) |

If the height is tight, the board shrinks first down to 72 pt squares, then the bands shrink. Squares never go below 60 pt on any supported device (well above AC-11's 44 pt).

### Coach tip placement

- **Landscape:** the tip card grows out of Pip upward into the child side column (tall card, 150 × 330 pt). It holds a picture icon, a small animated diagram, and one short sentence for readers. The real teaching happens on the board itself: ghost arrows and a ghost piece replay the threat or the good move on the board squares, semi transparent, looping twice.
- **Portrait:** the tip card slides over the top band (380 × 140 pt), Pip flies up into it, and the creature scoots to the left edge and shrinks to a head while the tip is open. The board ghost arrows work the same.
- The tip closes on one tap anywhere on the card, or automatically when the child makes the next move. It never blocks the board.
- If the tip is about a blunder and an oops token is left, the card shows an arrow that points at the oops button, and the button glows once.
- See open questions Q5 and Q6 for when tips appear and who gives them.

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
| Last move | From and to squares | Soft yellow tint plus small corner ticks, for both players |
| King | In check | Red starburst behind it, king shakes twice |
| Board | Creature's turn | Child's pieces can still be tapped to look at moves (dots show in grey), but no move is made. See open question D5. |
| | Game over | Board dims 20 percent, no input |

### Controls states

| Element | Default | Pressed | Disabled | Other |
|---|---|---|---|---|
| House | White round button, navy house | Squash | never | Tap saves and goes Home instantly |
| Oops button | Bright blue round button with a curved back arrow | Squash, token flies and pops | Grey, no glow. With zero tokens: dashed outline and empty sockets | Disabled while the creature thinks or before the first move |
| Oops tokens | Two filled gold coins with the back arrow | n/a | Empty socket outline once used | Shrug wiggle when the disabled button is tapped |
| Pip coach | Small owl sitting | Hops, replays last tip | Asleep (closed eyes, "zzz" bubble) when coach tips are off | Glows and waves when a new tip is ready (see Q5) |
| Creature | Idle loop | Tapping the creature makes it do a short personality giggle (decorative, never blocks) | n/a | Emotions per creatures.md |

- **Noor:** sees her pieces, taps one, sees dots, taps a dot. Watches the creature's face to know how she is doing. Uses oops when Pip points to it.
- **Sam:** also reads coach tip sentences, watches captured piece trays, decides when to spend oops.

## S7a Promotion picker (overlay)

**Purpose:** choose what the pawn becomes (AC-04).
**Primary action:** tap a piece.

A dimmed board with a card anchored above the promoting pawn: four piece buttons 100 × 100 pt in a row (queen, rook, knight, bishop). The queen is first, larger and glowing; a pointing hand hovers over it for Noor. Top left of the card: back arrow that cancels the move. In portrait the card is centred horizontally above the board.

## S8 Result

**Purpose:** make the ending feel great or OK, then offer the next step.

| Result | Creature | Child side | Primary action | Secondary |
|---|---|---|---|---|
| Child wins | Sad, then Good sport (bows, holds out a medal) | Big celebration: child's avatar jumps on a block podium, falling blocky confetti, gold medal lands on the avatar | **Next creature** (green play arrow with the next creature's face on it), only if unlocked | Rematch (circular arrow with the same creature's face), smaller |
| Child loses | Celebrating (short, 2 seconds), then Good sport (thumbs up, "Play again?") | Avatar gets a friendly pat, no sad effects on the child | **Rematch** | none |
| Draw | Good sport, handshake with the child's avatar | Handshake animation, a small silver medal for both | **Rematch** | Next creature if already unlocked |

Layout, landscape: creature on the right, child's avatar on the left, the podium or handshake in the middle, action buttons under them (primary 160 × 120 pt, secondary 110 × 90 pt, 40 pt apart). Portrait: creature and avatar side by side on top, buttons below. House top left always.

Draw pictograms (AC-06), shown in the middle with one sentence for readers:

| Draw type | Picture |
|---|---|
| Stalemate | King with all arrows around it crossed out, sleeping |
| Threefold repetition | Same mini board three times with a circular arrow |
| 50 move rule | A long line of footprints that fades out |
| Insufficient material | Two lone kings shaking hands |

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
Board with only the needed pieces, Pip in the child side region (same position as S7), a 3 step progress row of star sockets in place of the creature panel. Pip demonstrates with a ghost move twice, then the pointing hand waits on the child's piece. Short sentence under Pip for readers.

## S11 Puzzles list

**Purpose:** pick a puzzle.
**Primary action:** tap the next unsolved puzzle (glows).
Two shelves with a picture header each: mate in one (king with a tipped crown), win a piece (hand grabbing a piece). Tiles 110 × 110 pt with a mini board thumbnail and a star socket. Shelves scroll sideways if needed, with a large arrow button at each end (no swipe required).

## S12 Puzzle

**Purpose:** find the one winning move.
**Primary action:** make the move.
S7 layout with the creature side replaced by the goal icon (large) and Pip. After a wrong move the piece slides back and Pip shows a circular try again arrow; after three wrong moves the correct piece glows (flows.md, Flow 4). After solving: star flies to the socket and a green play arrow goes to the next puzzle.

## S13 Parent gate

**Purpose:** keep children out of settings (AC-27).
**Primary action:** answer the task.

| Region | Both orientations |
|---|---|
| Top left | Grey close cross |
| Centre | Task text in the active language, for example "Parent: what is 17 × 13?" |
| Below | Numeric keypad, keys 80 × 80 pt, plus a clear key and an enter key |

- Task is regenerated on every opening and after each wrong answer. Two digit times two digit multiplication is the v1 default. A parent PIN is recommended instead (see open questions, D1).
- Three wrong answers close the gate with a 60 second cooldown on the gear (flows.md, Flow 5).
- Visual style is deliberately grown up: grey and white, no creatures, no bright colours, so it does not look like a game to a child.

## S14 Parent settings

**Purpose:** parent controls. Text is allowed here; the audience is an adult.
**Primary action:** change a setting (each row acts on its own; there is no save button).

Rows: Language (two flags as a segmented control), Coach tips during games (on/off switch), Unlock all creatures (per profile switch), Profiles (list with reset and delete per profile), Storage note ("Progress is saved only in this browser on this iPad. Clearing Safari website data removes all profiles."). Close cross top left. Closes itself after 2 minutes idle.

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
| puzzle.retry | S12 under Pip | Try again! | Probeer nog eens! |
| gate.prompt | S13 | Parent: what is {a} × {b}? | Ouder: hoeveel is {a} × {b}? |
| settings.title | S14 | Parent settings | Instellingen voor ouders |
| settings.language | S14 | Language | Taal |
| settings.coach | S14 | Coach tips during games | Tips van de coach tijdens het spel |
| settings.unlockall | S14 | Unlock all creatures | Alle wezens vrijspelen |
| settings.profiles | S14 | Players | Spelers |
| settings.reset | S14 | Reset progress | Voortgang wissen |
| settings.delete | S14 | Delete player | Speler verwijderen |
| settings.hold | S14a | Hold to delete | Ingedrukt houden om te verwijderen |
| settings.cancel | S14a | Cancel | Annuleren |
| settings.storage | S14 | Progress is saved only in this browser on this iPad. Clearing Safari website data removes all players. | Voortgang staat alleen in deze browser op deze iPad. Als je de websitegegevens van Safari wist, zijn alle spelers weg. |

Example coach tips (picture carries the meaning, sentence is for readers):

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
3. **Targets:** child controls 75 pt or larger, board squares 72 pt or larger on reference devices, parent controls 44 pt or larger.
4. **Screen reader labels** exist for every control (for a parent or a helper), in the active language. Pieces are announced as "white knight on g1" style labels.
5. **Reduce motion:** when iPad Reduce Motion is on, bounces become fades, confetti becomes a static burst, and idle loops slow to one small movement every 5 seconds.
6. **No flashing:** nothing flashes more than twice per second, and no full screen flashes.
7. **One finger only.** Tap and drag; no pinch, long press or multi touch for children. The hold to delete gesture exists only behind the gate.
8. **Focus order** for keyboard or switch users: top left control, board (rank by rank from the child's side), child side controls, creature side.
