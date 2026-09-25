# Minechess PRD

Status: Draft v0.2, owner answers from round 1 included
Owner: product owner (parent)
Date: 2026-09-25

## 1. Problem statement

Kids aged 5 to 12 who want to learn chess run into two problems:

1. **Adult chess apps are dry and intimidating.** Kids see plain boards, ratings and harsh losses, with nothing that feels like a game made for them.
2. **Playing a real person isn't always possible**, and a parent opponent is often too strong, too weak, or busy.

The two kids in this family (ages 5 and 9) already love blocky, Minecraft style worlds. Chess becomes something they choose to play when the opponent is a character they know and care about, one who laughs, panics and sulks as the game goes on.

**Evidence:** owner observation within the family. This is a private family project, so there is no market validation and none is needed.

## 2. Product summary

Minechess is a chess game for the iPad browser. A child picks their profile, then picks one of 8 original, blocky creature opponents arranged on a ladder from clumsy to very strong. Each creature has its own play style and shows emotions on screen throughout the game. Legal move highlights, coach tips, lessons and puzzles help kids learn as they play. The game is free, has no accounts and no purchases, and supports Dutch and English.

## 3. Goals and success metrics

This is a family project, so the metrics are observed by the owner over the first 8 weeks after v1.0.

| Goal | Metric | Baseline | Target |
|---|---|---|---|
| Kids choose to play | Games started per child per week, without being asked | 0 | 3 or more |
| Kids learn the rules | Child finishes all piece lessons | 0 | Every child who plays |
| Kids progress | Highest creature beaten per child | none | The 5 year old beats Level 2; the 9 year old beats Level 5 |
| Losing feels OK | Games that end in a tantrum or quitting mid game (owner observed) | unknown | Rare, and falling over time |
| The creatures matter | Child can name their favourite creature and why | n/a | Every child |

## 4. Personas

**Noor, 5, first chess steps (the family's youngest).** She can't read yet. She knows the board has "a horse and a castle" but not how they move. She needs big targets, legal moves shown, meaning carried by pictures and animation rather than words, and an opponent that makes funny mistakes so she wins often.

**Sam, 9, knows the moves (the family's oldest).** He can play a full game but blunders pieces. He wants to beat the strong creatures and show off. He needs coach tips that explain what went wrong and a clear ladder to climb.

**Mila, 12, getting good (growth persona: who the kids become).** She beats her parents sometimes. She wants a real challenge from the top creatures and puzzles that make her think. She'll get bored if everything feels babyish.

**The parent.** Wants a safe, ad free game that teaches something real, with language and unlocks behind a gate the kids can't get past, and no accounts to manage.

## 5. The creature ladder

Eight original creatures inspired by blocky mob style. They use no Minecraft names, textures or likenesses (owner decision). Level 1 is the easiest.

| Lvl | Creature (working name) | Inspiration | Strength | Style | Personality in one line |
|---|---|---|---|---|---|
| 1 | **Wobble** the Slime Cube | bouncy slime | Very weak | Random | Bounces pieces around almost at random and giggles about it |
| 2 | **Clucky** the Block Hen | chicken | Very weak | Defensive (panicky) | Runs away from every threat, even when it shouldn't |
| 3 | **Fizz** the Fizzy Block | green block critter | Weak | Aggressive (reckless) | Charges forward and grabs anything, even when it's a trap |
| 4 | **Muddle** the Mole | burrowing critter | Weak | Silly | Forgets plans halfway through and gets distracted |
| 5 | **Copper Bot** | copper golem | Easy | Curious | Pokes around the board and learns, makes clear mistakes |
| 6 | **Iron Guardian** | iron golem | Medium | Defensive (protective) | Guards the king, keeps pieces protected, hard to crack |
| 7 | **Triple Shade** | three headed boss | Hard | Aggressive | Three heads, three attacks, loves to hunt the king |
| 8 | **Deep Watcher** | deep dark guardian | Very hard | Patient, smart | Senses every move; calm, rarely blunders, final boss |

**Decided:** the four clumsy creatures sit below Copper Bot, so the youngest kid gets wins early. Working names are approved.

**Style definitions** (testable behaviour, not technology):

1. **Random:** picks from legal moves with a light preference for captures. It will miss mate in one most of the time.
2. **Defensive:** prefers moves that protect pieces and the king, avoids trades, rarely attacks first.
3. **Aggressive:** prefers captures, checks and pushing pieces toward the enemy king, and accepts risk.
4. **Silly:** plays reasonable moves, then drops a plan and makes an odd move at a set rate.
5. **Strength** controls how often a creature misses good moves and how far ahead it looks. The higher the level, the fewer the mistakes.

## 6. Emotions

Each creature is always visible beside the board. It reacts with face and body animation plus a short speech bubble in the active language (no voice).

| Emotion | Triggered when |
|---|---|
| Neutral / idle | Waiting for the child's move (personality idle animation) |
| Thinking | Creature is choosing a move |
| Happy | Creature captures a piece or gives check |
| Worried | Creature is in check, or loses a valuable piece |
| Surprised | Child makes a strong move (big capture, fork, check) |
| Sad | Creature loses the game |
| Celebrating | Creature wins the game |
| Good sport | After the result: a friendly line to the child, win or lose |

Rules:

1. Reactions are short (about 2 seconds or less) and never block the child from moving.
2. Speech bubbles are 6 words or fewer and can be read by a beginning reader.
3. The creature is never mean to the child. Teasing is playful and always aimed at itself ("Oops, my tower fell!").
4. When the child wins, it's the biggest moment in the game: sad creature, celebration for the child, praise.
5. When the child loses, the creature celebrates briefly, then turns encouraging and offers a rematch.

## 7. Scope

### In scope (v1.0)

1. Full standard chess rules: castling, en passant, promotion, check, checkmate, stalemate, draw by repetition, 50 move rule and insufficient material.
2. Eight creature opponents with the strengths, styles and emotions above.
3. A ladder: beating a creature unlocks the next one. A parent setting can unlock all.
4. Local child profiles (name plus picked avatar, no personal data) with progress per child.
5. Legal move highlights when a piece is tapped.
6. Coach tips: kid friendly explanation after a blunder or a good move, which can be switched off.
7. Lessons (one per piece plus check, checkmate and castling) and puzzles (mate in one, win a piece).
8. Dutch and English, chosen at first launch and changeable in parent settings.
9. Parent gate for settings, language, unlock all, and resetting profiles.
10. Resume an unfinished game after closing the browser.
11. Works in iPad Safari in landscape and portrait, and can be added to the home screen.
12. Sound effects for moves, captures and results, with mute.
13. **Oops credits:** 2 per game. Using one takes back the child's last move and the creature's reply, so the child can try again.

### Out of scope (non goals)

1. **Mine chess (minesweeper variant).** Planned for v2.0. The rules engine must be built so a variant can be added later without a rewrite (see section 9).
2. Online play or play against other people online.
3. Two players on the same iPad. Considered for v2.0.
4. Accounts, cloud sync, login, email.
5. Ads, purchases, analytics or tracking of any kind.
6. Chat or any free text written by children.
7. "Suggest a move" hints. Coach tips and oops credits cover learning. Unlimited undo is also out; see oops credits.
8. Chess clocks and time pressure.
9. Ratings or Elo shown to kids.
10. Android, desktop optimisation and native App Store apps.
11. Voice acting.
12. Any Minecraft name, texture, logo, sound or likeness.

## 8. Key user flows

1. **First launch:** choose language (flag icons), then create first profile (type name or skip, pick avatar), then a short "meet Wobble" intro, then first game.
2. **Returning:** tap your avatar, see the creature ladder, tap an unlocked creature, play. An unfinished game is offered first.
3. **Game:** board with creature beside it, tap or drag to move, creature reacts, game ends, result screen with emotions, then Rematch, Next creature (if unlocked) or Home.
4. **Learn:** Home, Lessons or Puzzles, pick a card, play, stars earned.
5. **Parent:** gear icon, parent gate, settings.

Every screen has a visible one tap way back or home, as the `ux-ipad-kids` rules require.

## 9. Assumptions and dependencies

1. Played on a recent iPad (2019 or later) in Safari. Other browsers are nice to have.
2. Private family use with a private link. No App Store review.
3. All data stays on the device in browser storage. Clearing Safari data wipes profiles, and the owner accepts this.
4. The chess AI runs entirely on the device and needs no internet after first load. Offline play after first load is a should have.
5. The rules engine and AI are separate from the UI, and the engine can support rule variants (needed for mine chess in v2.0). The solution-architect decides how.
6. Creature art (8 creatures × 8 emotions) must be produced. The design team defines the style; making the art may be the biggest effort in the project.
7. The owner provides Dutch and English copy review.

## 10. Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Creature art volume is large | Delays v1.0 | Ship v0.1 with 3 creatures; design emotions as reusable face parts |
| Weak creatures still too strong for the 5 year old | Kid quits | Tune Level 1 to 2 so a child who knows the moves wins most games; test with the 5 year old |
| 5 year old can't read speech bubbles, tips or lessons | Misses the fun and the teaching | Pictures and animation carry the meaning; see Q9 on read aloud |
| Strongest creature too weak as the kids grow | Boredom | Deep Watcher tuned to beat a club beginner; recheck with the 9 year old over time |
| Browser storage cleared | Progress lost | Warn in parent settings; export/import profile is a P2 idea |
| Look-alikes drift too close to Minecraft | IP concern if ever shared | Designer checks every creature against the originality rule |

## 11. Open questions

Answered in round 1: clumsy creatures sit below Copper Bot; names approved; 2 oops credits per game; players are 5 and 9.

| # | Question | Who answers |
|---|---|---|
| Q5 | Should coach tips appear during the game automatically, or only when the child taps the coach? | Designer, then owner |
| Q6 | Who gives coach tips: the opponent creature itself, or a separate friendly coach character? | Designer |
| Q7 | Art approach: pixel/voxel style drawn in code, or illustrated assets? | Designer, then solution-architect |
| Q8 | Which chess engine approach (own simple engine vs an existing open engine with strength limits)? | Solution-architect |
| Q9 | The 5 year old can't read yet. Should speech bubbles, coach tips and lessons be read aloud (device text to speech or recorded lines), even though voice was left out? | Owner |
