# Minechess Design Open Questions

Status: design draft v0.1, based on PRD v0.2
Author: ux-ipad-kids (design stage)
For: the owner (and the solution-architect where noted)

Each question has a recommendation. The design files already follow the recommendation, so a "yes" needs no rework; a "no" is noted where it changes other files. Nothing here edits the PRD; items marked **PRD change** need the product-manager to update `01-product/`.

## Questions the PRD assigned to design

### Q5. Should coach tips appear automatically, or only when the child taps the coach?

**Recommendation: automatic, but light and on the board.**

- Noor will never tap a coach on purpose; if tips are tap only, she gets no teaching at all during games. Sam benefits from the "why" at the moment it happens.
- To keep it light: the tip teaches on the board with ghost arrows (pictures, not words), the card sits on the child's side and never covers the board, it closes on one tap or on the child's next move, and it never blocks input.
- Frequency cap: at most one tip every 3 child moves, and only for clear moments (lost a piece to a simple tactic, walked into a fork, made a fork, gave check, captured a free piece), as in AC-30.
- Tapping Pip replays the last tip, so Sam can look again.
- The parent switch (PRD 7.6) turns automatic tips off; Pip then sleeps. Lessons and puzzles still use Pip (see D10).
- If tips feel too frequent in testing with the kids, the fallback is "Pip glows and waves when a tip is ready, tap to see it", which is a setting change, not a redesign.

### Q6. Who gives coach tips: the opponent creature or a separate coach?

**Recommendation: a separate coach, Pip the Block Owl.**

1. **Clear roles for a pre reader.** The opponent's face must mean "how is the game going for me". If the opponent also teaches, a Worried face and a helpful tip can arrive together and send mixed signals.
2. **Honest teaching.** An opponent explaining how to beat itself is odd, and would feel different for every personality (Fizz would teach recklessly, Deep Watcher calmly).
3. **One teacher everywhere.** The same coach runs lessons, puzzles and in game tips, so the child meets one friendly guide in all learning.
4. **Less art.** Pip needs 5 poses; putting tips on each creature would add a "teaching" pose set to all 8.
5. **Placement.** Pip lives on the child's side, the creature on its own side, so the screen reads "my helper and me versus the creature".

Pip is a proposal name and look (creatures.md). Owner can rename.

### Q7. Art approach: pixel or voxel drawn in code, or illustrated assets?

**Recommendation: flat "soft block" vector art (SVG), built from reusable parts and animated in code.** Final choice of rendering tech stays with the solution-architect.

| Option | For | Against |
|---|---|---|
| Pixel or voxel drawn in code (canvas or WebGL 3D) | Tiny download, fully procedural | 3D voxel invites the Minecraft look we must avoid; WebGL adds risk in Safari and battery use; faces and emotions are hard to make expressive |
| Illustrated raster assets (PNG per emotion) | Richest look | 64 or more big images, heavy download, hard to keep 8 artists' worth of style consistent, every change means redrawing |
| **Vector parts (SVG) with code animation** | Crisp at every iPad size, small files, the shared face rig (creatures.md) makes 64 emotions from about 8 bodies plus parts kits, easy to tweak colours for accessibility, works offline | Needs a tidy parts structure agreed with the architect; very detailed shading is out, which suits the flat blocky style anyway |

The flat, rounded corner, no texture style is also our main protection against looking like Minecraft (originality rule in creatures.md).

## Design decisions the owner should confirm

### D1. Parent gate task (**PRD change** if a PIN is adopted)

AC-27 asks for a task the 9 year old can't reliably do. Sam at 9 can probably solve simple sums, read number words and hold two buttons. A two digit times two digit multiplication (the current design default) is hard for him but not impossible with time and paper.

**Recommendation:** a 4 digit **parent PIN**, set by the parent during first launch (one extra step after the language choice, while the parent is present), with the multiplication task as the "forgot PIN" route. This is the only option that stays safe as Sam grows. It changes PRD flow 8.1, so it needs the product-manager.

### D2. Which side does the child play?

**Recommendation:** the child always plays the light pieces, at the bottom, and moves first. Choosing colours is a decision Noor cannot make meaningfully, and a fixed side keeps the board orientation stable. A "play dark" option for Sam could come later as a parent or ladder feature.

### D3. What happens to a paused game when the child starts a new one?

The PRD allows one resume but does not say what happens if the child picks another creature. A "throw away your game?" dialog is not possible for a pre reader.

**Recommendation:** one paused game per profile; it is offered first (Resume card) and marked on its creature's card; starting any other game quietly replaces it. The cost is that a child may lose a half game now and then, which is small.

### D4. Surprised and Worried overlap (**PRD clarification**)

PRD section 6 triggers Surprised on "child gives check or big capture" and Worried on "creature is in check or loses a valuable piece". These are usually the same move.

**Recommendation:** play Surprised (0.8 s) then Worried (1.2 s) within the 2 second budget, showing the Surprised bubble, so the child's good move is praised first. Priority rules are in creatures.md. The product-manager may want to write this into section 6.

### D5. Can the child look at moves during the creature's turn?

**Recommendation:** yes, as a look only: tapping a piece shows hollow grey rings, and no move is made. It keeps the board responsive (a tap that does nothing feels broken) and lets Sam plan. Alternative is to ignore taps while the creature thinks, which is simpler but feels broken to Noor if the thinking is slow.

### D6. Board coordinates (a to h, 1 to 8)

**Recommendation:** hidden by default. They are text that Noor cannot use and that clutters the board. Sam could benefit later; a parent setting could show them. No coordinate is needed anywhere in the v1 design.

### D7. Creature colour on its pieces

**Recommendation:** creature pieces stay charcoal with a thin accent colour ring at the base (decoration only). Fully coloured armies would look fun but hurt contrast and break transfer to a real chess set.

### D8. Profile creation order (**minor PRD change**)

PRD flow 8.1 says "type name or skip, pick avatar". The design asks for the avatar first, then the optional name, because Noor can finish the avatar step alone and the play arrow then works with an empty name. The product-manager may want to align the wording.

### D9. Draw has no emotion in the PRD table (**PRD clarification**)

**Recommendation:** on a draw the creature plays Good sport with a handshake, and the result screen shows a picture of why it was a draw. No ninth emotion is needed.

### D10. Does "coach tips off" also silence Pip in lessons and puzzles?

**Recommendation:** no. The switch covers tips during games only (PRD 7.6 describes game tips). Lessons and puzzles are built around Pip's demonstrations and would not work without him.

### D11. Touch target size versus AC-11 (**PRD change suggested**)

AC-11 sets 44 pt, Apple's adult minimum. The `ux-ipad-kids` guidance for young children is about 75 pt. The design uses 75 pt for all child controls and 72 to 88 pt board squares (60 pt hard floor). **Recommendation:** raise AC-11 to 75 pt for child controls and 60 pt for board squares, and keep 44 pt for parent controls.

### D12. The "Slime Cube" descriptor and name localisation

The name Wobble is approved. The descriptor "Slime Cube" points straight at a Minecraft mob, and the design already moves Wobble away from it (pink, rounded, jelly like).
**Recommendation:** call Wobble "the Jelly Cube" (Dutch "de Drilblok") in any on screen text, keep creature names identical in both languages (Wobble, Clucky, Fizz, Muddle, Copper Bot, Iron Guardian, Triple Shade, Deep Watcher) so kids switching languages recognise them, and use a Dutch descriptor where one appears.

### D13. Oops reaction

AC-40 wants "a playful reaction" when oops is used, but the emotion table has no matching entry.
**Recommendation:** reuse Surprised face parts with a rewind spin and a rewind swirl icon (lines per creature in creatures.md). No new art set.

### D14. Where the parent gear lives

**Recommendation:** only on the profile picker and Home, not in games, lessons or puzzles. This removes the most tempting accidental tap from the play screens. The parent can always leave a game with the house first; games are saved.

### D15. First launch language without a gate

**Recommendation:** accept that a child could pick the wrong language on first launch; the parent can change it later behind the gate. Adding a gate before any game exists would slow the first 30 seconds for little benefit.

### D16. Maximum number of profiles

**Recommendation:** 6. It fits one row in landscape and a 2 × 3 grid in portrait without scrolling. A family of two needs far fewer.

### D17. "Unlock all" scope

PRD 7.3 says "a parent setting can unlock all". **Recommendation:** per profile, so Sam can have all creatures while Noor still climbs and gets her unlock celebrations.

### D18. Idle bubble frequency

Showing "Your turn!" every turn becomes noise. **Recommendation:** the idle bubble shows only in the first 3 turns of a game and after 15 seconds without input; the idle animation (creature looking at the child's pieces) carries the meaning the rest of the time.

## For the solution-architect

1. The emotion system needs an event priority queue with a 2 second budget per move and a 4 second bubble rate limit (creatures.md), separate from the chess engine.
2. Thinking must show for at least 0.6 s even if the engine answers faster, and the engine must not block the main thread while Thinking animates (Level 8 search).
3. Layout must recompute on rotation without losing selection, overlays or an in flight animation.
4. Fonts and all art are served from the game's own origin (no third party requests, AC-37).
