# Minechess Features

Priority: **Must** (v1.0 cannot ship without it), **Should** (planned for v1.0, can slip), **Nice** (later). "First version" is the first release that contains the feature, fully or in part (see versions.md).

| ID | Feature | Description | Priority | Depends on | First version |
|---|---|---|---|---|---|
| F01 | Chess rules engine | All standard rules including castling, en passant, promotion, all draw types and resignation; built so a variant can be added as a separate rule set (AC-45) | Must | none | v0.1 |
| F02 | Board and pieces | Clear, kid friendly board; tap to select and tap to move, plus drag to move. The child always plays the light pieces at the bottom. Silent game visibility: the creature's move slides visibly, its from and to squares stay highlighted until the child moves, captured child pieces go with a visible poof, whose turn it is always shows, check on either king is highlighted | Must | F01 | v0.1 (landscape), v0.2 (portrait) |
| F03 | Legal move highlights | Tapping a piece shows its legal destinations; captures shown differently | Must | F01, F02 | v0.1 |
| F04 | Creature AI | Opponent move selection with strength and style settings (Random, Defensive, Aggressive, Silly, Curious, Patient; PRD section 5) | Must | F01 | v0.1 |
| F05 | Creature roster | 8 creatures with name, look, strength stars, style, personality. v0.1: Wobble, Clucky, Copper Bot. v0.2: adds Fizz, Muddle, Deep Watcher. v1.0: adds Iron Guardian, Triple Shade | Must | F04, F06 | v0.1 (3 of 8) |
| F06 | Emotions | Face and body animation plus speech bubble, one emotion per half move from the event table (PRD 6.1). v0.1: idle, thinking, happy, sad, celebrating. v0.2: worried, surprised | Must | F04 | v0.1 (5 emotions) |
| F07 | Result screen | Win, lose, draw or resignation moment with emotions and the Good sport pose (handshake for a draw), draw reason as a picture, rematch, next, home | Must | F06 | v0.1 |
| F08 | Language | Dutch and English for all text, including speech bubbles and lessons. v0.1 is Dutch only | Must | none | v0.2 |
| F09 | Local profiles | Create, pick and delete child profiles (avatar first, then optional name); each avatar used by at most one profile | Must | none | v1.0 |
| F10 | Creature ladder | Beating a creature unlocks the next; progress saved per profile | Must | F05, F09 | v1.0 |
| F11 | Parent PIN and settings | 4 digit parent PIN set at first launch, math question only as the forgot PIN route; gear only on profile picker and Home. Settings: language, unlock all (per profile), reset, delete, coach on/off, games played and won per profile (local only). v0.2 has the PIN and the language setting only | Must | F08, F09, F10 | v0.2 (PIN and language) |
| F12 | Resume game | Unfinished game restored after closing Safari, including oops credits; one paused game per profile, a new game quietly replaces it | Must | F01 | v0.2 |
| F13 | Coach tips | Given by the opponent creature in its teaching pose; automatic but light: ghost arrows on the board, one tap to dismiss, at most once every 3 child moves; includes fork detection | Should | F01, F04, F06 | v1.0 |
| F14 | Lessons | Guided mini lessons: each piece, check, checkmate, castling | Must | F01, F02 | v1.0 |
| F15 | Puzzles | Mate in one and win a piece puzzles, stars per puzzle | Should | F01, F02, F09 | v1.0 |
| F16 | Sound effects | Move, capture, check and result sounds; mute option (deferred: owner wants no sound for now) | Nice (later) | F02 | later |
| F17 | Home screen install | Full screen launch from the iPad home screen with an app icon; the documented way to launch (Safari deletes storage of sites unused for 7 days unless installed). The game requests persistent storage | Must | none | v0.2 |
| F18 | Offline play | Playable without internet after first load | Should | none | v1.0 |
| F23 | Oops credits | 2 per game; each tap undoes one full move pair, also while the creature thinks (cancels it); can undo a checkmate against the child while the loss is held; restores repetition history, 50 move counter, emotion, and closes open coach tips | Must | F01, F02 | v0.1 |
| F24 | Easy creatures help to win | Levels 1 and 2, when clearly losing (down 5 or more points), avoid moves that allow stalemate or repetition, walk their king toward the child's pieces, and resign after being down 9 or more points for 3 of their moves in a row, with a big sad animation | Must | F01, F04, F06 | v0.1 |
| F19 | Mine chess variant | Hidden mines on the board (rules to be defined) | Nice (v2.0) | F01 designed for variants | v2.0 |
| F20 | Two players, one iPad | Pass and play between two kids | Nice (v2.0) | F01, F02 | v2.0 |
| F21 | Parent progress view | Detailed stats per child: wins per creature, lessons done, over time (the simple games played and won count is part of F11) | Nice (v2.0) | F09, F11 | v2.0 |
| F22 | Profile export/import | Back up progress to a file and restore it | Should | F09 | v1.0 |

## Dependency outline

F01 rules engine is the base for everything. F04 AI and F02 board both build on it. Emotions (F06) build on the AI's events, the roster (F05) needs the AI, the emotions and the art, and the result screen (F07) needs the emotions. Easy creature behaviour (F24) builds on the AI and the Sad emotion. Resume (F12) needs only the engine's saved state; profiles (F09) later make it per profile. Profiles unlock the ladder (F10) and puzzle stars (F15). Home screen install (F17) protects stored progress. F19 mine chess needs F01 to support variants from day one.
