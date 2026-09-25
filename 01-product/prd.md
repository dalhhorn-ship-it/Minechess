# Minechess PRD

Status: Draft v0.4. v0.1 is built and live; waiting for the owner's iPad check and the kid playtest. Includes owner answers through round 3 (after the first build).
Owner: product owner (parent)
Date: 2026-09-25

## 1. Problem statement

Kids aged 5 to 12 who want to learn chess run into two problems:

1. **Adult chess apps are dry and intimidating.** Kids see plain boards, ratings and harsh losses, with nothing that feels like a game made for them.
2. **Playing a real person isn't always possible**, and a parent opponent is often too strong, too weak, or busy.

The two kids in this family (ages 5 and 9) already love blocky, Minecraft style worlds. Chess becomes something they choose to play when the opponent is a character they know and care about, one who laughs, panics and sulks as the game goes on.

**Evidence:** owner observation within the family. This is a private family project, so there is no market validation and none is needed.

## 2. Product summary

Minechess is a chess game for the iPad browser, launched from an icon on the iPad home screen. A child picks their profile, then picks one of 8 original, blocky creature opponents arranged on a ladder from clumsy to very strong. Each creature has its own play style and shows emotions on screen throughout the game. The child always plays the light pieces at the bottom. Legal move highlights, light coach tips given by the creature itself, lessons and puzzles help kids learn as they play. The easiest creatures quietly help the youngest child win, and even resign when they are clearly beaten. The game is free, has no accounts and no purchases, and supports Dutch and English.

## 3. Goals and success metrics

This is a family project, so the metrics are observed by the owner over the first 8 weeks after v1.0. Game counts come from the local games played and won count per profile in parent settings (section 7, item 15); the count never leaves the device.

| Goal | Metric | Baseline | Target |
|---|---|---|---|
| Kids choose to play | Games started per child per week, without being asked (from the local count) | 0 | 3 or more |
| Kids learn the rules | Child finishes all piece lessons (F14, Must) | 0 | Every child who plays |
| Kids progress | Highest creature beaten per child | none | The 5 year old beats Level 2. The 9 year old beats Level 5 within 4 weeks and has not yet beaten Level 8 by week 8 |
| Losing feels OK | Games that end in a tantrum or quitting mid game (owner observed) | unknown | Rare, and falling over time |
| The creatures matter | Child can name their favourite creature and why | n/a | Every child |

## 4. Personas

**Noor, 5, first chess steps (the family's youngest).** She can't read yet. She knows the board has "a horse and a castle" but not how they move. She needs big targets, legal moves shown, meaning carried by pictures and animation rather than words, and an opponent that makes funny mistakes so she wins often.

**Sam, 9, knows the moves (the family's oldest).** He can play a full game but blunders pieces. He wants to beat the strong creatures and show off. He needs coach tips that show what went wrong and a clear ladder to climb.

**Mila, 12, getting good (growth persona: who the kids become).** She beats her parents sometimes. She wants a real challenge from the top creatures and puzzles that make her think. She'll get bored if everything feels babyish.

**The parent.** Wants a safe, ad free game that teaches something real, with language and unlocks behind a parent PIN the kids can't get past, and no accounts to manage.

## 5. The creature ladder

Eight original creatures inspired by blocky mob style. They use no Minecraft names, textures or likenesses (owner decision). Level 1 is the easiest. Strength is shown to kids as stars (1 to 5), never as numbers or ratings. The "Inspiration" column is internal only and never appears on screen.

| Lvl | Creature (working name) | Inspiration | Strength | Style | Personality in one line | First version |
|---|---|---|---|---|---|---|
| 1 | **Wobble** the Jelly Cube | bouncy slime | 1 star | Random | Bounces pieces around almost at random and giggles about it | v0.1 |
| 2 | **Clucky** the Block Hen | chicken | 1 star | Defensive (panicky) | Runs away from every threat, even when it shouldn't | v0.1 |
| 3 | **Fizz** the Fizzy Block | green block critter | 2 stars | Aggressive (reckless) | Charges forward and grabs anything, even when it's a trap | v0.2 |
| 4 | **Muddle** the Mole | burrowing critter | 2 stars | Silly | Forgets plans halfway through and gets distracted | v0.2 |
| 5 | **Copper Bot** | copper golem | 3 stars | Curious | Pokes at the child's pieces to see what happens, makes clear mistakes | v0.1 |
| 6 | **Iron Guardian** | iron golem | 4 stars | Defensive (protective) | Guards the king, keeps pieces protected, hard to crack | v1.0 |
| 7 | **Triple Shade** | three headed boss | 4 stars | Aggressive | Three heads, three attacks, loves to hunt the king | v1.0 |
| 8 | **Deep Watcher** | deep dark guardian | 5 stars | Patient | Calm, rarely blunders, final boss | v0.2 |

**Decided:** the four clumsy creatures sit below Copper Bot, so the youngest kid gets wins early. Working names are approved. Wobble's on screen descriptor is "the Jelly Cube" (Dutch "de Drilblok"); creature names are the same in both languages.

**Style definitions** (testable behaviour, not technology):

1. **Random:** picks from legal moves with a light preference for captures. It will miss mate in one most of the time.
2. **Defensive:** prefers moves that protect pieces and the king, avoids trades, rarely attacks first.
3. **Aggressive:** prefers captures, checks and pushing pieces toward the enemy king, and accepts risk.
4. **Silly:** plays reasonable moves, but on average 1 in 5 of its moves is an odd move chosen at random from its legal moves (a dropped plan).
5. **Curious:** when it has no capture or check it likes, it prefers a move that attacks one of the child's pieces that was not attacked before ("poking" to see what happens), even when that leaves its own piece loose.
6. **Patient:** prefers quiet, improving moves (developing pieces, protecting weak squares) over early captures and checks, only trades when it gains material, and never makes a capture that loses material by its own look ahead.
7. **Strength** controls how often a creature misses good moves and how far ahead it looks. The higher the level, the fewer the mistakes. It never changes during a game and never adapts to the child; no creature "learns".

**Easy creatures help the youngest win (owner decision).** Levels 1 and 2 (Wobble and Clucky) change behaviour when they are clearly losing, defined as being down 5 or more points of material (piece values in section 6.2):

1. They avoid any move after which the child could stalemate them, and any move that repeats an earlier position, whenever another legal move exists.
2. Once **hopeless** (nothing left but the king and pawns, and 9 or more points behind), they prefer moves that walk their king toward the child's pieces, so checkmate is easier to find.
3. They **resign** once they have been hopeless after each of 3 of their own moves in a row. They never give up just because they lost a few pieces (owner decision, round 3). Resigning is a legal chess result: the child wins, and the creature plays a big sad animation.

Levels 3 to 8 never resign and play on to the end.

## 6. Emotions

Each creature is always visible beside the board. It reacts with face and body animation plus a short speech bubble in the active language (no voice).

| Emotion | Triggered when (see event table 6.1) | First version |
|---|---|---|
| Neutral / idle | Waiting for the child's move (personality idle animation) | v0.1 |
| Thinking | Creature is choosing a move | v0.1 |
| Happy | Creature captures a piece or gives check | v0.1 |
| Sad | Creature loses the game or resigns | v0.1 |
| Celebrating | Creature wins the game | v0.1 |
| Worried | Creature is in check, or loses a piece worth less than 5 points | v0.2 |
| Surprised | Child captures a piece worth 5 or more points | v0.2 |
| Good sport (result pose) | After the result: a friendly line and a handshake icon, win, lose or draw. Part of the result screen (F07), so it ships in v0.1 | v0.1 |

**Teaching pose (not an emotion).** When the creature gives a coach tip (F13, v1.0) it switches to a separate teaching pose, with a lightbulb bubble icon used for nothing else, so a child never mixes up "how the game is going for the creature" with "the creature is showing me something". The pose design is in `docs/design/creatures.md`.

### 6.1 Emotion event table

Every half move (one move by either side) produces **exactly one** emotion. When several events happen on one half move, the one with the highest priority wins. Thinking plays while the creature chooses; idle plays while waiting for the child.

| Priority | Event on this half move | Child moved | Creature moved |
|---|---|---|---|
| 1 | Result: checkmate, draw, or resignation | Child wins: Sad (resignation: big Sad, about 3 s). Draw: Good sport | Creature wins: Celebrating. Draw: Good sport |
| 2 | Check | Worried | Happy |
| 3 | Capture of a piece worth 5 or more points | Surprised | Happy |
| 4 | Any other capture | Worried | Happy |
| 5 | None of the above | Idle (then Thinking starts) | Idle |

In v0.1, before Worried and Surprised exist, their events play a short Sad (about 1 s, no raincloud bubble), so the child still sees that the move hurt the creature. Fork detection is not an emotion event; it moves to coach tips (F13, v1.0).

### 6.2 Piece values

Used for the event table, the easy creatures' "clearly losing" and resign rules, and the coach tips: pawn 1, knight 3, bishop 3, rook 5, queen 9. The king has no value.

### 6.3 Emotion rules

1. Reactions during play are short (about 2 seconds or less) and never block the child from moving. Only the result emotion at game end may run longer.
2. Speech bubbles are 6 words or fewer and can be read by a beginning reader. Every bubble pairs its words with a picture icon.
3. The creature is never mean to the child. Teasing is playful and always aimed at itself ("Oops, my tower fell!").
4. When the child wins, it's the biggest moment in the game: sad creature, celebration for the child, praise.
5. When the child loses, the creature celebrates briefly, then turns encouraging (Good sport) and offers a rematch.
6. On a draw, the creature plays Good sport with a handshake, and the result screen explains the draw with a picture that a non reader understands without any text.

## 7. Scope

### In scope (v1.0)

1. Full standard chess rules: castling, en passant, promotion, check, checkmate, stalemate, draw by repetition, 50 move rule, insufficient material, and resignation by the easy creatures.
2. Eight creature opponents with the strengths, styles and emotions above.
3. A ladder: beating a creature unlocks the next one. A parent setting can unlock all creatures, per profile.
4. Local child profiles (picked avatar first, then an optional name, no personal data) with progress per child. Each avatar can be used by only one profile.
5. Legal move highlights when a piece is tapped.
6. **Coach tips, given by the opponent creature itself** in its teaching pose. Tips appear automatically but lightly: ghost arrows on the board, one tap to dismiss, at most once every 3 child moves. A parent setting switches them off.
7. Lessons (one per piece plus check, checkmate and castling) and puzzles (mate in one, win a piece).
8. Dutch and English, chosen at first launch and changeable in parent settings.
9. **Parent PIN:** a 4 digit PIN set by the parent at first launch guards settings, language, unlock all, and resetting or deleting profiles. A math question is only the "forgot PIN" route.
10. Resume an unfinished game after closing the browser. One paused game per profile; starting a new game quietly replaces it.
11. Works in iPad Safari in landscape and portrait. **Installing to the home screen is the documented way to launch the game**, and the game asks the browser for persistent storage.
12. **Oops credits:** 2 per game. Each tap undoes one full move pair (the child's last move and the creature's reply), also while the creature is still thinking, and can even undo a checkmate against the child (details in F23 and AC-40 to AC-43, AC-64 to AC-66).
13. The child always plays the light pieces at the bottom of the board and moves first.
14. The game is readable while silent: the creature's move slides visibly, its from and to squares stay highlighted until the child moves, captured child pieces disappear with a visible poof, whose turn it is always shows, and check on either king is highlighted.
15. Parent settings show a games played and games won count per profile, stored only on the device.
16. Profile export and import to a file (Should).

### Out of scope (non goals)

1. **Mine chess (minesweeper variant).** Planned for v2.0. The rules engine must be built so a variant can be added later without a rewrite (see section 9 and AC-45).
2. Online play or play against other people online.
3. Two players on the same iPad. Considered for v2.0.
4. Accounts, cloud sync, login, email.
5. Ads, purchases, analytics or tracking of any kind. The local games count never leaves the device.
6. Chat or any free text written by children.
7. "Suggest a move" hints. Coach tips and oops credits cover learning. Unlimited undo is also out; see oops credits.
8. Chess clocks and time pressure.
9. Ratings or Elo shown to kids.
10. Android, desktop optimisation and native App Store apps.
11. **All audio for now (owner decision):** no voice, no read aloud, no sound effects. The game is fully silent in v1.0. Sound effects may return later.
12. Any Minecraft name, texture, logo, sound or likeness.
13. Choosing a colour or playing the dark pieces.
14. Creatures that learn from or adapt to a child over time.

## 8. Key user flows

1. **First launch:** choose language (flag icons), then the parent sets a 4 digit PIN, then create the first profile (pick an avatar, then type a name or skip), then a short "meet Wobble" intro, then the first game.
2. **Returning:** tap your avatar, see the creature ladder, tap an unlocked creature, play. An unfinished game is offered first.
3. **Game:** board with the creature beside it, tap or drag to move, the creature reacts, the game ends, result screen with emotions, then Rematch, Next creature (if unlocked) or Home. If the creature checkmates the child while an oops credit is left, the loss is held until the child accepts it or uses oops.
4. **Learn:** Home, Lessons or Puzzles, pick a card, play, stars earned.
5. **Parent:** gear icon (only on the profile picker and Home), parent PIN, settings.

Every screen has a visible one tap way back or home, as the `ux-ipad-kids` rules require.

## 9. Assumptions and dependencies

1. Played on a recent iPad (2019 or later) in Safari. The smallest supported device is the iPad mini (5th generation). Other browsers are nice to have.
2. Private family use with a private link. No App Store review.
3. All data stays on the device in browser storage. Safari deletes the storage of websites that have not been used for 7 days, unless the site was added to the home screen. So launching from the home screen icon (F17) is the documented and supported way to play, and the game asks for persistent storage. Clearing Safari website data by hand still wipes all profiles; the owner accepts this, and profile export (F22, Should for v1.0) is the backup.
4. The chess AI runs entirely on the device and needs no internet after first load. Offline play after first load is a should have.
5. The rules engine and AI are separate from the UI, and the engine can support rule variants (needed for mine chess in v2.0, tested by AC-45). The solution-architect decides how.
6. Creature art must be produced: 8 creatures with 7 emotions, the Good sport result pose and a teaching pose each, delivered across versions (v0.1 needs only 3 creatures with 5 emotions and Good sport). The design team defines the style; making the art may be the biggest effort in the project.
7. The owner provides Dutch and English copy review.
8. **Entry condition for v0.1:** Q7 (art approach) and Q8 (engine approach) are answered before v0.1 build starts.

## 10. Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Creature art volume is large | Delays v1.0 | Ship v0.1 with 3 creatures and 5 emotions; design emotions as reusable face parts |
| Weak creatures still too strong for the 5 year old | Kid quits | Tune Level 1 to 2 so a child who knows the moves wins most games (AC-14); easy creatures avoid stalemate and repetition, walk their king out and resign when clearly lost; test with the 5 year old |
| 5 year old can't read speech bubbles, tips or lessons, and there's no audio | Misses the fun and the teaching | Every bubble pairs its words with a picture icon; tips and lessons teach with pointing hands, ghost arrows and animated demo moves; emotions carry the story; draw reasons are pictures. A parent or sibling can read along |
| Silent game hides what the creature did | Child misses the creature's move or a capture | Visible slide, lasting from and to highlight, capture poof, turn indicator, check highlight on both kings (AC-12, AC-46 to AC-49) |
| Strongest creature too weak as the kids grow | Boredom | Deep Watcher tuned to beat a club beginner; recheck with the 9 year old over time |
| Safari deletes storage after 7 days unused, or the parent clears Safari data | Progress lost | Home screen install is the documented launch (F17, Must) and the game requests persistent storage (AC-63); profile export (F22, Should in v1.0); warning in parent settings |
| Sibling taps the other child's avatar and plays on their profile | Wrong progress or unlocks on a profile | Accepted. Profiles are not private, hold no personal data, and each avatar is unique so a child rarely picks the wrong one by accident |
| 9 year old uses the "forgot PIN" math route | Gate bypassed as he grows | Forgot PIN uses a hard multiplication and only lets the parent set a new PIN; the owner rechecks as Sam grows |
| Lookalikes drift too close to Minecraft | IP concern if ever shared | Designer checks every creature against the originality rule; no Minecraft derived descriptor (such as "Slime Cube") in on screen text |

## 11. Open questions

Round 4 (after the first build): more emotions (Worried, Surprised, Laughing, Crying) now, not in v0.2; the creature sometimes cries when it loses a big piece or the game; speech bubbles may be longer (up to about 12 words); a few sound effects when the creature loses a piece or cries, with a sound button on the start screen (this replaces "no sound of any kind"); Dutch strategy lessons for ages 8 and up; an old school hall of fame with points. Round 3: easy creatures resign only when hopeless, not after losing a few pieces; Copper Bot was too strong and is tuned down so a careful beginner wins about 4 in 10 games. Answered by the owner: clumsy creatures sit below Copper Bot; names approved; 2 oops credits per game; players are 5 and 9; no sound of any kind for now. Round 2: Levels 1 and 2 help the 5 year old win (avoid stalemate and repetition, walk the king out, resign after being down 9 or more points for 3 of their moves); oops can undo a checkmate against the child, works while the creature thinks, undoes one move pair per tap and restores the full game state; v0.1 is small (F01 to F05 with Wobble, Clucky and Copper Bot, F06 with 5 emotions, F07, F23, landscape only, Dutch only) and a v0.2 adds the rest of the emotions, English, portrait, resume and more creatures; Q7 and Q8 must be answered before v0.1; the parent gate is a 4 digit PIN set at first launch, with a math question only as the forgot PIN route; there is no separate coach character, so coach tips come from the opponent creature itself, automatically but lightly (Q5 and Q6 resolved). Accepted from the red team and design review: child always plays light at the bottom; home screen install is Must; silent game visibility rules; draw shows Good sport; one emotion per half move with fixed priority; larger touch targets; defined play styles; avatars unique; local games count; design items D1, D3, D8, D9, D12, D14 and D17.

| # | Question | Who answers |
|---|---|---|
| Q7 | Art approach. **Answered:** 3D block art drawn in code (extruded block pieces and icons, creatures built from 3D boxes, inventory style panels), chosen by the owner after the first build looked too flat. | Done |
| Q8 | Chess engine approach. **Answered:** own TypeScript engine (perft verified) with a rule set hook for mine chess; creature AI runs in a Web Worker. | Done |
| Q9 | Which creature teaches in lessons and puzzles now that there is no separate coach (design recommends Wobble in its teaching pose, open question D10)? | Designer, then owner |
