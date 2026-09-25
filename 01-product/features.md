# Minechess Features

Priority: **Must** (v1.0 cannot ship without it), **Should** (planned for v1.0, can slip), **Nice** (later).

| ID | Feature | Description | Priority | Depends on |
|---|---|---|---|---|
| F01 | Chess rules engine | All standard rules including castling, en passant, promotion, all draw types | Must | none |
| F02 | Board and pieces | Clear, kid friendly board; tap to select and tap to move, plus drag to move | Must | F01 |
| F03 | Legal move highlights | Tapping a piece shows its legal destinations; captures shown differently | Must | F01, F02 |
| F04 | Creature AI | Opponent move selection with strength and style settings | Must | F01 |
| F05 | Creature roster | 8 creatures with name, look, strength, style, personality | Must | F04, F06 |
| F06 | Emotions | Face and body animation plus speech bubble per game event | Must | F05 |
| F07 | Result screen | Win, lose or draw moment with emotions, rematch, next, home | Must | F06 |
| F08 | Language | Dutch and English for all text, including speech bubbles and lessons | Must | none |
| F09 | Local profiles | Create, pick and delete child profiles (name plus avatar) | Must | none |
| F10 | Creature ladder | Beating a creature unlocks the next; progress saved per profile | Must | F05, F09 |
| F11 | Parent gate and settings | Gate that kids can't pass; language, unlock all, reset, coach on/off, sound | Must | F08, F09, F10 |
| F12 | Resume game | Unfinished game restored after closing Safari | Must | F01, F09 |
| F13 | Coach tips | Kid language explanation after a blunder or good move | Should | F01, F04 |
| F14 | Lessons | Guided mini lessons: each piece, check, checkmate, castling | Should | F01, F02 |
| F15 | Puzzles | Mate in one and win a piece puzzles, stars per puzzle | Should | F01, F02, F09 |
| F16 | Sound effects | Move, capture, check and result sounds; mute option | Should | F02 |
| F17 | Home screen install | Full screen launch from the iPad home screen with an app icon | Should | none |
| F18 | Offline play | Playable without internet after first load | Should | F17 |
| F23 | Oops credits | 2 per game; each takes back the child's last move and the creature's reply | Must | F01, F02 |
| F19 | Mine chess variant | Hidden mines on the board (rules to be defined) | Nice (v2.0) | F01 designed for variants |
| F20 | Two players, one iPad | Pass and play between two kids | Nice (v2.0) | F01, F02 |
| F21 | Parent progress view | Simple stats per child: games, wins per creature, lessons done | Nice (v2.0) | F09 |
| F22 | Profile export/import | Back up progress to a file | Nice | F09 |

## Dependency outline

F01 rules engine is the base for everything. F04 AI and F02 board both build on it. Creatures (F05, F06) need the AI and art. Profiles (F09) unlock the ladder (F10), resume (F12) and puzzle stars (F15). F19 mine chess needs F01 to support variants from day one.
