# Minechess Design Open Questions

Status: design draft v0.2, updated for PRD Draft v0.3 (owner answers round 2)
Author: ux-ipad-kids (design stage), resolutions recorded by product-manager
For: the owner (and the solution-architect where noted)

Each question has a recommendation. The design files already follow the recommendation, so a "yes" needs no rework; a "no" is noted where it changes other files. Items marked **Resolved** are settled in PRD v0.3 and need no further answer.

## Questions the PRD assigned to design

### Q5. Should coach tips appear automatically, or only when the child taps the coach?

**Resolved (owner, PRD v0.3): automatic, but light and on the board.**

- Noor will never ask for a tip on purpose; if tips are tap only, she gets no teaching at all during games. Sam benefits from the "why" at the moment it happens.
- To keep it light: the tip teaches on the board with ghost arrows (pictures, not words), the tip card never covers the board, it closes on one tap or on the child's next move, and it never blocks input.
- Frequency cap: at most one tip every 3 child moves, and only for clear moments (lost a piece to a simple tactic, walked into a fork, made a fork, gave check, captured a free piece), as in AC-30.
- After a tip closes, a small lightbulb badge (75 pt hit area) stays beside the creature until the child's next move; tapping it replays the tip, so Sam can look again.
- The parent switch (PRD 7.6) turns automatic tips off.
- If tips feel too frequent in testing with the kids, the fallback is "the creature holds up its lightbulb when a tip is ready, tap it to see", which is a setting change, not a redesign.

### Q6. Who gives coach tips: the opponent creature or a separate coach?

**Resolved (owner, PRD v0.3): the opponent creature itself. There is no separate coach character.**

The design proposal of a separate owl coach is dropped. To keep the design's concern (a pre reader must not mix up "how the game is going for the creature" with "the creature is teaching me"), coaching gets its own look that no emotion uses:

1. **Teaching pose.** The creature turns side on toward the board, holds a pointer stick with a star tip, and wears small round teaching glasses. Its face stays calm (neutral eyes and mouth), so the pose never looks like Worried, Happy or any other emotion.
2. **Lightbulb bubble icon**, used only for tips (creatures.md).
3. **One thing at a time.** While a tip is open no emotion plays; the emotion for that half move plays first, then the tip starts (AC-62).
4. **Personality stays in the voice, not the lesson.** The tip content (ghost arrows and the reader sentence) is the same for every creature, so no creature teaches badly; only its pose styling differs.

The cost is one extra teaching pose per creature (8 in total), added in v1.0 with coach tips.

### Q7. Art approach: pixel or voxel drawn in code, or illustrated assets?

**Open. Entry condition for v0.1:** must be answered before v0.1 build starts (PRD 9.8).

**Recommendation: flat "soft block" vector art (SVG), built from reusable parts and animated in code.** Final choice of rendering tech stays with the solution-architect.

| Option | For | Against |
|---|---|---|
| Pixel or voxel drawn in code (canvas or WebGL 3D) | Tiny download, fully procedural | 3D voxel invites the Minecraft look we must avoid; WebGL adds risk in Safari and battery use; faces and emotions are hard to make expressive |
| Illustrated raster assets (PNG per emotion) | Richest look | 64 or more big images, heavy download, hard to keep 8 artists' worth of style consistent, every change means redrawing |
| **Vector parts (SVG) with code animation** | Crisp at every iPad size, small files, the shared face rig (creatures.md) makes all emotions from about 8 bodies plus parts kits, easy to tweak colours for accessibility, works offline | Needs a tidy parts structure agreed with the architect; very detailed shading is out, which suits the flat blocky style anyway |

The flat, rounded corner, no texture style is also our main protection against looking like Minecraft (originality rule in creatures.md).

## Design decisions the owner should confirm

### D1. Parent gate task

**Resolved (owner, PRD v0.3):** a 4 digit **parent PIN**, set by the parent during first launch (one extra step after the language choice, while the parent is present), with a two digit times two digit multiplication as the "forgot PIN" route only (AC-27, AC-59).

### D2. Which side does the child play?

**Resolved (PRD v0.3, AC-44):** the child always plays the light pieces, at the bottom, and moves first. A "play dark" option is out of scope.

### D3. What happens to a paused game when the child starts a new one?

**Resolved (PRD v0.3, AC-61):** one paused game per profile; it is offered first (Resume card) and marked on its creature's card; starting any other game quietly replaces it. The cost is that a child may lose a half game now and then, which is small.

### D4. Surprised and Worried overlap

**Resolved (PRD v0.3, section 6.1), superseding the earlier "Surprised then Worried" sequence:** each half move plays exactly one emotion, chosen by fixed priority: result, then check, then capture of 5 or more points, then any capture, then idle. A child's check plays Worried; a child's capture of a rook or queen plays Surprised. Fork detection moves to coach tips (v1.0).

### D5. Can the child look at moves during the creature's turn?

**Recommendation:** yes, as a look only: tapping a piece shows hollow grey rings, and no move is made. It keeps the board responsive (a tap that does nothing feels broken) and lets Sam plan. Alternative is to ignore taps while the creature thinks, which is simpler but feels broken to Noor if the thinking is slow. Note that the oops button is now active while the creature thinks (AC-65).

### D6. Board coordinates (a to h, 1 to 8)

**Recommendation:** hidden by default. They are text that Noor cannot use and that clutters the board. Sam could benefit later; a parent setting could show them. No coordinate is needed anywhere in the v1 design.

### D7. Creature colour on its pieces

**Recommendation:** creature pieces stay charcoal with a thin accent colour ring at the base (decoration only). Fully coloured armies would look fun but hurt contrast and break transfer to a real chess set.

### D8. Profile creation order

**Resolved (PRD v0.3, flow 8.1 and AC-24):** avatar first, then the optional name, because Noor can finish the avatar step alone and the play arrow then works with an empty name.

### D9. Draw has no emotion in the PRD table

**Resolved (PRD v0.3, section 6 and AC-56):** on a draw the creature plays the Good sport pose with a handshake, and the result screen shows a picture of why it was a draw. Good sport is a result pose that ships with the result screen in v0.1; no ninth emotion is needed.

### D10. Who teaches in lessons and puzzles, and does "coach tips off" affect them?

With the separate coach dropped (Q6), lessons and puzzles need a teacher. **Recommendation:** Wobble in its teaching pose teaches all lessons and puzzles. Wobble is the first creature every child meets and is always unlocked, so it never spoils the ladder; its teaching pose and lightbulb keep it clearly in "teacher mode". The parent switch covers tips during games only; lessons and puzzles always teach. Owner to confirm (PRD open question Q9).

### D11. Touch target size versus AC-11

**Resolved (PRD v0.3, AC-11):** 75 pt for child controls, 60 pt minimum for board squares, 44 pt for parent controls, measured on the iPad mini.

### D12. The "Slime Cube" descriptor and name localisation

**Resolved (PRD v0.3, section 5):** Wobble is "the Jelly Cube" (Dutch "de Drilblok") in any on screen text; "Slime Cube" is dropped. Creature names stay identical in both languages (Wobble, Clucky, Fizz, Muddle, Copper Bot, Iron Guardian, Triple Shade, Deep Watcher), with a Dutch descriptor where one appears.

### D13. Oops reaction

AC-40 wants "a playful reaction" when oops is used, but the emotion table has no matching entry.
**Recommendation:** from v0.2, reuse Surprised face parts with a rewind spin and a rewind swirl icon (lines per creature in creatures.md). In v0.1, where Surprised does not exist yet, the idle pose does the rewind spin with the same rewind swirl bubble. No new art set.

### D14. Where the parent gear lives

**Resolved (PRD v0.3, AC-58):** only on the profile picker and Home, not in games, lessons or puzzles. The parent can always leave a game with the house first; games are saved.

### D15. First launch language without a gate

**Recommendation:** accept that a child could pick the wrong language on first launch; the parent can change it later behind the PIN. The PIN is set right after the language choice, while the parent is present.

### D16. Maximum number of profiles

**Recommendation:** 6. It fits one row in landscape and a 2 × 3 grid in portrait without scrolling. A family of two needs far fewer.

### D17. "Unlock all" scope

**Resolved (PRD v0.3, section 7.3 and AC-28):** per profile, so Sam can have all creatures while Noor still climbs and gets her unlock celebrations.

### D18. Idle bubble frequency

Showing "Your turn!" every turn becomes noise. **Recommendation:** the idle bubble shows only in the first 3 turns of a game and after 15 seconds without input; the idle animation (creature looking at the child's pieces) and the turn indicator (AC-49) carry the meaning the rest of the time.

### D19. How the held checkmate looks

New with PRD v0.3 (AC-64). **Recommendation:** when the creature checkmates the child and an oops token is left, the board stays bright (not dimmed), the creature plays Celebrating once, the oops button glows slowly, and a green "see result" button with a tipped over king icon appears on the child's side. Nothing moves on by itself. Owner to confirm the look in the first playtest.

## For the solution-architect

1. The emotion system needs the event table from PRD 6.1 (one emotion per half move, fixed priority) with a 2 second budget per move and a 4 second bubble rate limit (creatures.md), separate from the chess engine.
2. Thinking must show for at least 0.8 s even if the engine answers faster, and the move must start within 3 s (AC-13). The engine must not block the main thread while Thinking animates (Level 8 search), and a search must be cancellable at any time because oops can cancel it (AC-65).
3. Undo must restore the full game state, including repetition history, the 50 move counter and the easy creatures' resign count (AC-66).
4. Layout must recompute on rotation without losing selection, overlays or an in flight animation (v0.2).
5. Fonts and all art are served from the game's own origin (no third party requests, AC-37).
6. The game must request persistent storage and be installable to the home screen (F17, AC-63).
