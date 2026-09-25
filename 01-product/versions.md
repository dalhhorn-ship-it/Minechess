# Minechess Versions

## v0.1 MVP: "Can a kid play a fun game against a creature?"

**Goal:** prove the core loop, small and fast. A child picks a creature, plays a full game, and the creature feels alive.

**Entry condition:** open questions Q7 (art approach) and Q8 (engine approach) are answered before build starts.

**Features:** F01, F02 (landscape only), F03, F04, F05 with 3 of 8 creatures: Wobble (L1), Clucky (L2), Copper Bot (L5), F06 with 5 emotions (idle, thinking, happy, sad, celebrating), F07 (including the Good sport pose), F23 oops credits, F24 easy creatures help to win. Dutch only. Landscape only: in portrait a picture asks to turn the iPad. No profiles, ladder, parent settings or resume: one simple creature picker with all 3 creatures open.

**Definition of done:**
1. A full legal game can be played to checkmate, stalemate, a draw or a resignation in iPad Safari in landscape, on an iPad mini and larger.
2. The three creatures play at clearly different strengths, and Wobble and Clucky help a losing creature lose (avoid stalemate and repetition, walk the king out, resign).
3. The 5 emotions and the Good sport result pose play per the event table (PRD 6.1).
4. All text is in Dutch.
5. All acceptance criteria tagged v0.1 pass.
6. Both kids (5 and 9) have played it, and the owner has noted their reactions.

## v0.2: "Ready for daily family play"

**Goal:** fill in what v0.1 left out so the game can live on the iPad day to day.

**Features:** F06 remaining emotions (worried, surprised), F08 English with language chosen at first launch, F11 parent PIN with the language setting only, F02 portrait layout, F12 resume, F17 home screen install with persistent storage, F05 adds Fizz (L3), Muddle (L4) and Deep Watcher (L8), for 6 creatures in total, all open (no ladder yet).

**Definition of done:**
1. All acceptance criteria tagged v0.1 and v0.2 pass.
2. The 9 year old has played Deep Watcher and finds it hard.
3. The game is launched from the home screen icon on the family iPad.

## v1.0: Full first release for the family

**Goal:** every child has their own profile and a ladder to climb, and the game teaches.

**Features:** all Must and Should features: F01 to F15, F17, F18, F22, F23 and F24 (F16 sound stays out), all 8 creatures (adds Iron Guardian and Triple Shade), profiles, ladder, full parent settings, coach tips given by the creature, lessons, puzzles, offline play, profile export.

**Definition of done:**
1. All acceptance criteria for v0.1, v0.2 and v1.0 pass.
2. Creature tuning checked: the 5 year old wins most games against Level 1 and 2; the 9 year old finds Level 8 hard.
3. Parent PIN tested: no child in the family can get into settings unaided.
4. Every screen passes the `ux-ipad-kids` review checklist.

## v2.0: Mine chess and more

**Goal:** new ways to play once classic chess is familiar.

**Features:** F19 mine chess, F20 two players on one iPad, F21 parent progress view, more puzzles.

**Definition of done:** set when v2.0 is planned. Mine chess rules need their own mini PRD first.
