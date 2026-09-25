# Minechess Visual Language

Status: design draft v0.2, updated for PRD Draft v0.3
Author: ux-ipad-kids (design stage), updated by product-manager for owner answers round 2
Related: [screens.md](screens.md), [creatures.md](creatures.md), [open-questions.md](open-questions.md)

## The core idea

Minechess has no sound and one of its two players cannot read. So the screen must speak with only three tools: **shape, colour and motion**. Every meaning in the game uses at least two of the three, and never colour alone.

**Update after the first build (owner decision):** the built game uses a 3D block world look instead of flat vector: extruded block pieces and icons, creatures made of 3D boxes, inventory style grey panels with dark item slots, stone buttons, bevelled block squares and a board on a grass block. Colours, highlight shapes, touch sizes and motion rules below still apply.

Original style in one line: **soft blocky world**. Flat colour blocks with rounded corners, one light top face and one darker side face, thick friendly navy outlines, calm backgrounds, bright interactive things. Blocky enough to feel like the world the kids love, soft enough to be clearly its own thing (see the originality rule in creatures.md).

## Colour

### Base tokens

| Token | Hex | Use |
|---|---|---|
| ink | `#1D2B4F` | Outlines, icons, text on light surfaces |
| paper | `#FFFFFF` | Buttons, bubbles, cards |
| sky | `#EAF4F4` | Calm screen background (ladder, lists) |
| meadow | `#DDEFD4` | Decorative ground strip at the bottom of child screens (never interactive) |
| go | `#1E8E3E` | Primary action buttons (always with a white play arrow icon) |
| gold | `#F5C84C` | Stars, medals, glow on the next creature |
| parent grey | `#6B7280` on `#F3F4F6` | Parent gate and settings only |

Contrast: ink on paper is 13.9 : 1, ink on sky 12.4 : 1. White on go is 4.2 : 1, which is why the primary button always carries a large white icon and never relies on small white text.

### Board

| Token | Hex | Notes |
|---|---|---|
| square light ("sand") | `#F3E9D2` | Warm, low glare |
| square dark ("stone blue") | `#8C9DB5` | Cool, clearly different in lightness from sand (2.3 : 1), so the checker pattern survives every type of colour blindness because it is a lightness difference, not a hue difference |
| board frame | `#46607F` with a 12 pt rounded blocky border | Frames the board like a raised stone table |

Why not green and brown or green and cream: red green colour blindness (about 1 in 12 boys, relevant for Sam) flattens green versus brown, and green would clash with the "go" button meaning.

### Pieces

| Side | Fill | Outline | Contrast |
|---|---|---|---|
| Child (light) | `#FFFBF2` warm white | 3 pt ink `#1D2B4F` | Outline gives 11.5 : 1 on sand and 5.0 : 1 on stone blue |
| Creature (dark) | `#2E3440` charcoal | 2 pt light rim `#FFFBF2` | Fill gives 10.4 : 1 on sand and 4.5 : 1 on stone blue |

The outline, not the fill, carries the contrast on same tone squares. This is why outlines are mandatory.

### Highlights (colour blind safe)

Blue and orange are the safest distinct pair across protanopia, deuteranopia and tritanopia. Each highlight also has its **own shape**, so a child who sees no colour at all still reads it.

| Meaning | Shape | Colour | Motion |
|---|---|---|---|
| Selected piece | Thick square frame (6 pt) on the square, piece lifted 6 pt with shadow | Blue `#1B4FA8` | Lift in 120 ms |
| Legal move, empty square | Round dot, 28 percent of square width, 3 pt white halo | Blue `#1B4FA8` | Dots pop in with a 60 ms stagger from nearest to farthest |
| Legal move, capture | Four corner brackets around the target piece, 2 pt ink outline | Orange `#E8741C` | Brackets pulse in once, then stay |
| Last move (both sides) | Soft tint on from and to squares plus small corner ticks | Butter `#F2C94C` at 45 percent | Fades in over 200 ms, no pulse. The creature's from and to squares stay until the child completes their next move (AC-47) |
| King in check (either king) | Eight point starburst behind the king | Red `#C8102E` with ink outline | King shakes twice, starburst pulses twice slowly, then stays still (AC-12) |
| Whose turn | Ring around the avatar (child) or under the creature | Gold `#F5C84C` with ink outline | Soft glow; moves to the other side within 200 ms of each move (AC-49) |
| Captured child piece | Puff of small blocks ("poof") | Piece colours | About 400 ms burst, then a small copy drops into the creature's tray (AC-48) |
| Looking at moves on the creature's turn | Round dot, hollow ring instead of filled | Grey `#9AA3AF` | Pops in, no stagger |
| Coach ghost arrows (v1.0) | Thick rounded arrow, semi transparent (60 percent) | Threat: orange. Good idea: gold | Arrow draws itself over 500 ms, loops twice; the creature's star pointer follows it |

Contrast of markers: blue dot is 6.4 : 1 on sand; on stone blue it relies on its white halo. The orange brackets rely on their ink outline on both squares. Rule: **every marker has a halo or outline**, so no marker ever depends on the square colour behind it.

Colour blind check: selected (frame), legal (dot), capture (brackets), last move (ticks), check (starburst), turn (ring) are six different shapes. The board passes a greyscale test: print it in grey and every state is still readable.

### Colour meaning is fixed across the game

| Colour | Always means | Never used for |
|---|---|---|
| Saturated green | Go, play, continue | Anything decorative on child screens (only very pale meadow tints are allowed as ground) |
| Blue | Your piece and your moves, oops button | The creature's things |
| Orange | Something can be captured, or a threat to you (coach arrows) | Buttons |
| Red | Your king is in check; delete (parent only) | Mistakes, wrong taps (these are never red) |
| Gold | Rewards: stars, medals, next creature glow, good idea arrows; the turn ring | Warnings |
| Grey | Disabled, parent area | Anything a child should tap |

## Piece style

1. **Standard chess silhouettes, simplified and chunky**, so skills transfer to a real board. The knight is a horse head (Noor already calls it "the horse"), the rook is a castle tower, the king has a cross shaped top block, the queen a crown of five blocks, the bishop a pointed hat with a slit, the pawn a round head on a base.
2. Built from rounded blocks with the same top light and side shade as the world, flat colours, no textures.
3. Pieces have **no faces**. Faces belong to creatures; faceless pieces keep the board calm and make it clear that the creature is the character, not its army.
4. Each piece type has a distinct outline shape at 60 pt, tested by showing only silhouettes to Noor: she must tell horse, castle, king and queen apart.
5. Captured pieces shrink into the capturer's tray at 50 percent size.
6. The creature's pieces keep the neutral charcoal; the creature's accent colour appears only on a thin base ring on each of its pieces, as decoration. See open question D7.

## Touch targets and spacing

| Element | Minimum | Target | Spacing |
|---|---|---|---|
| Child buttons (house, oops, coach, play arrow, cards) | 75 × 75 pt | 80 to 160 pt | 16 pt between targets |
| Board squares | 60 pt (hard floor, on the iPad mini) | 72 to 88 pt on reference devices | none (the grid is the target) |
| Promotion piece buttons | 90 × 90 pt | 100 × 100 pt | 20 pt |
| Parent gear | 44 × 44 pt | 56 × 56 pt | 24 pt from edges |
| Parent settings controls | 44 × 44 pt | 48 to 60 pt | 12 pt |
| Keypad keys (parent PIN pad) | 64 × 64 pt | 80 × 80 pt | 12 pt |

These match AC-11 (child controls 75 pt, board squares 60 pt, parent controls 44 pt, measured on the iPad mini), following the `ux-ipad-kids` rule for young children. Other rules:

1. No child control within 24 pt of any screen edge, and none in the bottom 40 pt near the home indicator.
2. Hit areas can be larger than the drawn shape (for example the oops tokens are part of the oops button's hit area).
3. Drag uses a snap radius of half a square: releasing within it lands on the nearest legal square. Releasing elsewhere returns the piece home in 200 ms.
4. A tap is accepted on touch up, and a touch that moves less than 10 pt still counts as a tap, so shaky fingers work.
5. Only one finger is read at a time. A second finger (a hand resting on the screen) is ignored.
6. No browser gestures during play (AC-50): touches never scroll or zoom the page, select text, open a callout or copy menu, or navigate back.

## Motion

Motion is our voice, so it has to be consistent, calm and fast.

| Rule | Value |
|---|---|
| Feedback on touch down | Within 100 ms: the touched thing squashes 5 percent or lifts |
| Piece move | 250 ms ease out along a straight line (knight hops in an arc) |
| Creature move | At least 400 ms along a straight line (knight in an arc), slower than the child's so the eye can follow it without sound; the piece glows briefly on pickup (AC-46) |
| Oops rewind | Each move of the undone pair plays backwards in 300 ms (only the child's move when oops cancels the creature's thinking) |
| Creature reaction | One emotion per half move, 2 seconds or less, never blocks input (AC-18, AC-19). The resign Sad at game end runs about 3 s |
| Screen transitions | 300 ms slide in the direction of travel: deeper screens slide in from the right, going back slides to the right |
| Idle loops | Small amplitude (under 5 percent of the creature's size), cycles of 2 to 4 seconds |
| Celebrations | Up to 2.5 seconds, blocky confetti falls slowly; never full screen flashes |
| Flashing | Nothing flashes more than twice per second; no strobing, no full screen colour changes |
| Reduce Motion (iPad setting) | Bounces become 200 ms fades, confetti becomes a static burst, idle loops pause between gentle moves |
| Attention hints | A hint (hop, pointing hand, pulse) repeats at most every 8 seconds, never constantly |

Hierarchy of motion: **only one thing moves strongly at a time.** When the creature reacts, the board is still. When the child's piece moves, the creature holds its pose until the piece lands.

## How meaning is shown without text or sound

| Meaning | Shape | Motion | Where |
|---|---|---|---|
| It is your turn | Gold turn ring around your avatar; creature looks at your pieces; pointing hand bubble | Creature leans toward the board | Child side and creature panel |
| The creature is thinking | Gold turn ring under the creature; thought cloud with three dots | Dots rise; creature sways | Creature panel |
| The creature moved here | Glowing piece, lasting tint and ticks on its from and to squares | Slow slide (400 ms or more) | Board |
| The creature took your piece | Puff of blocks | Poof, then the piece drops into the creature's tray | Board and creature side |
| The creature is teaching you (v1.0, not an emotion) | Teaching pose: side on, glasses, star pointer; lightbulb icon | Pointer follows the ghost arrow | Creature panel and board |
| The creature gave up | King lying down, small white flag, big Sad | About 3 s | Board and creature panel |
| This can be tapped | Bright fill, thick outline, raised 3D look | Gentle bounce or hop hint after inactivity | Everywhere |
| This cannot be tapped now | Grey, flat, no raised look | None; a small head shake wiggle on tap | Everywhere |
| Where a piece can go | Blue dots | Pop in | Board |
| You can capture here | Orange brackets | Pulse in | Board |
| Your king is in danger | Red starburst | King shakes | Board |
| You did something great | Creature Surprised pose, burst bubble | Creature jumps back | Creature panel |
| You are winning material | Your tray fills with the creature's pieces | Pieces fly into your tray | Child side |
| You made a mistake (coach) | Orange ghost arrow shows the threat | Arrow draws itself twice | Board and tip card |
| You can take it back | Oops button glows, tip card arrow points at it | One glow pulse (slow repeated glow during a held checkmate) | Child side |
| No take backs left | Empty dashed sockets, grey button | Shrug wiggle on tap | Child side |
| You won | Your avatar on a podium with a gold medal; creature sad | Confetti, medal drops | Result |
| You lost, and that is OK | Creature does a thumbs up, gives a handshake | Short creature dance, then a warm wave | Result |
| Draw | Good sport pose, handshake plus a picture of the reason that needs no reading | Handshake animation | Result |
| New creature unlocked | Padlock pops open, creature steps out | 2.5 second unlock scene | Result overlay, ladder |
| Locked | Dark silhouette with a padlock | Padlock wiggles on tap | Ladder |
| Where am I | Each screen type has its own background and hero (see below) | none | All |
| Leave / go home | House icon, always top left | none | All |

### Place recognition ("where am I")

| Screen | Background | Hero |
|---|---|---|
| Profile picker | Meadow with beaten creatures wandering | Avatars |
| Home (ladder) | Sky with stepping stone blocks climbing up | Glowing next creature |
| Game | Calm backdrop in a pale version of the creature's accent colour | The creature |
| Lessons | Warm wood room with a dark blue chalkboard | The teaching creature with the book (open question D10) |
| Puzzles | Warm yellow room with jigsaw pattern | The teaching creature with a jigsaw piece |
| Parent area | Plain grey and white, no creatures | none |

## Text on screen

Text is support, never the message.

1. Typeface: a rounded sans serif with a simple "a" and "g" that beginning readers recognise (for example Andika or Nunito, both open licensed and self hosted, no third party font requests).
2. Speech bubbles 24 pt, labels 20 pt, parent area 17 pt minimum.
3. Every child facing text sits next to a picture that means the same thing.
4. No numbers are shown to children where a picture can do the job (stars, tokens, medals). The parent area is the only place with digits (the PIN pad and the forgot PIN sum).
