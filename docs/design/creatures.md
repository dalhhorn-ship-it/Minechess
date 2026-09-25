# Minechess Creature Sheets

Status: design draft v0.2, updated for PRD Draft v0.3 sections 5 and 6
Author: ux-ipad-kids (design stage), updated by product-manager for owner answers round 2
Related: [visual-language.md](visual-language.md), [screens.md](screens.md), [open-questions.md](open-questions.md)

## Why the creatures matter so much here

The game is silent and Noor cannot read. The creature's face and body are the main way she knows what is happening: "I did something good" (Surprised, Worried), "it is my turn" (idle, looking at me), "it is thinking" (Thinking). Every emotion therefore needs a pose you can read from across the room, plus a bubble icon that means the same thing for every creature. The words in the bubble are a bonus for Sam.

The creature is also the coach (PRD section 7.6, open question Q6). Coaching always uses the separate teaching pose below, never an emotion face, so "how the game is going" and "let me show you something" never look alike.

## Shared rules for all creatures

### Originality rule (PRD section 5, risk table)

Every creature must pass all of these before art is approved:

1. No Minecraft name, texture, logo, sound or silhouette. No on screen descriptor may point at a Minecraft mob (for example, Wobble is "the Jelly Cube", never "Slime Cube").
2. **No noisy pixel textures.** Surfaces are flat colour blocks with at most one lighter top face tone and one darker side tone. No 16 × 16 style speckled textures.
3. **Rounded blocks.** Every cube has softly rounded corners (about 12 percent of its edge length). This alone moves the look away from Minecraft's hard voxels.
4. **Big round eyes with a highlight**, never square pixel eyes.
5. The inspiration named in the PRD is only a starting idea and is never shown on screen. Each sheet lists "moved away from" points that break the link to the original mob.
6. The designer checks each final creature side by side with the Minecraft mob it was inspired by; if a child could name the Minecraft mob from the silhouette alone, it fails.

### Shared face and body rig (reusable parts, PRD risk "art volume")

All creatures are built from the same set of swappable face parts and body poses, drawn per creature in its own style. This turns about 80 illustrations into 8 bodies plus one parts kit each.

| Emotion or pose | First version | Eyes | Brows | Mouth | Body motion (2 seconds or less during play) |
|---|---|---|---|---|---|
| Neutral / idle | v0.1 | Open, blinking every 3 to 5 s, looking at the child's side | Relaxed | Small smile | Personality idle loop (see each sheet) |
| Thinking | v0.1 | Looking up and to the side, slow drift | One raised | Pursed, to one side | Slow sway, thought dots rise |
| Happy | v0.1 | Closed upward arcs | Raised | Wide open smile | One hop with squash on landing |
| Sad | v0.1 | Half closed, looking down | Tilted down at the outer ends | Small frown | Sags down slowly, a small raincloud drifts over. Short variant (about 1 s, no raincloud, no bubble) stands in for Worried and Surprised in v0.1 |
| Sad, resign (big) | v0.1 (Levels 1 and 2 only) | Closed, squeezed | Tilted down | Wobbly frown | About 3 s: lays its king down, waves a small white flag, then its own signature Sad touch, bigger |
| Celebrating | v0.1 | Closed arcs or sparkle eyes | Raised | Huge grin | Jump with a spin, blocky confetti from above |
| Good sport (result pose) | v0.1 | Soft, open, looking at the child | Relaxed | Warm smile | Steps toward the child, bows or waves, holds out a hand (handshake) or a medal |
| Worried | v0.2 | Wide, pupils small, darting | Tilted up in the middle | Wavy line | Shrinks 10 percent, small shiver, sweat drop slides down |
| Surprised | v0.2 | Very wide, round | High | Round "O" | Jumps back and up, freezes for 0.3 s, settles |
| Teaching pose (not an emotion) | v1.0 | Calm, open, looking at the board | Relaxed | Small closed smile | Turns side on toward the board, small round teaching glasses on, holds a pointer stick with a star tip that follows the ghost arrow |

The teaching pose must be visually distinct from every emotion: side on body, glasses and pointer appear in no other pose, and the face stays neutral. It is drawn once per creature in its own style (for example, Triple Shade's middle head wears the glasses and holds the pointer in its mouth; Deep Watcher's floating hand holds the pointer).

### Shared bubble icons

The icon sits on the left inside every bubble, 48 pt, and is the same for every creature so Noor can learn it once. The icon is tinted with the creature's accent colour; its shape never changes.

| Emotion or pose | Bubble icon | Meaning a child learns |
|---|---|---|
| Neutral / idle | Pointing hand toward the child's pieces | "Your turn" |
| Thinking | Cloud with three dots | "Wait, it is thinking" |
| Happy | Five point star | "It got something" |
| Worried | Falling sweat drop | "It is in trouble" (good news for the child) |
| Surprised | Spiky burst with "!" | "You did something great" |
| Sad | Small raincloud | "It lost" |
| Sad, resign | Small white flag | "It gave up, you won" |
| Celebrating | Trophy with confetti | "It won" |
| Good sport | Handshake | "Friends again, play again?" (also the draw icon) |
| Teaching pose | Lightbulb, used for nothing else | "Look, I'll show you something" |
| Oops reaction (extra, see below) | Rewind swirl (curved double arrow) | "We went back in time" |

Bubble layout: rounded rectangle, white fill, 3 pt navy outline, 24 pt text in the active language to the right of the icon, max two lines, tail pointing at the creature's mouth. Shows for the length of the emotion (2 seconds or less), fades out over 200 ms. Teaching tips do not use this bubble; they use the tip card (screens.md, S7).

### When each emotion plays (PRD section 6.1)

Every half move produces exactly one emotion. When several events happen on one half move, the highest priority wins. Piece values: pawn 1, knight 3, bishop 3, rook 5, queen 9.

| Priority | Event on this half move | Child moved | Creature moved |
|---|---|---|---|
| 1 | Result | Child wins: Sad (resignation: Sad, resign). Draw: Good sport | Creature wins: Celebrating. Draw: Good sport |
| 2 | Check | Worried | Happy |
| 3 | Capture worth 5 or more points | Surprised | Happy |
| 4 | Any other capture | Worried | Happy |
| 5 | Nothing above | Idle, then Thinking while the creature chooses | Idle |

Further rules:

1. **v0.1 fallback:** until Worried and Surprised exist (v0.2), their events play the short Sad variant.
2. **Thinking** shows for at least 0.8 s so the child sees it, even when the engine is faster, and the move starts within 3 s (AC-13).
3. **Idle bubble** appears only at the start of the child's turn in the first 3 moves of a game, and again after 15 seconds without input, so the screen stays calm.
4. **Rate limit:** no more than one bubble every 4 seconds outside game end; emotion animations may still play without a bubble.
5. **Coach tips** (v1.0) start only after the half move's emotion has finished; while a tip is open the creature holds the teaching pose and plays no emotion (AC-62).
6. **Held checkmate** (AC-64): the creature plays Celebrating once, then holds idle while the child chooses between oops and "see result".

### Oops reaction

When the child uses an oops credit, the creature plays a light Surprised variant (spins once like a rewinding tape) with the rewind swirl icon, then returns to idle (AC-66). In v0.1, before Surprised exists, the idle pose does the same rewind spin. Lines per creature are in each sheet. This is not an extra emotion; it reuses existing face parts.

### Line rules (PRD section 6.3)

Every line is 6 words or fewer in both languages, uses simple words a beginning reader can sound out, and any teasing is aimed at the creature itself. Good sport lines are split into "child won" (W), "child lost" (L) and "draw" (D). Only Levels 1 and 2 have a "Sad (resign)" line, because only they resign. v0.1 ships the Dutch lines only; English lines are needed from v0.2. Word counts were checked for every line in this file.

---

## 1. Wobble the Jelly Cube (Level 1, 1 star, random, v0.1)

**Look:** a soft, rounded jelly like cube, about as wide as it is tall, with a glossy highlight on its top left corner and two tiny drip "feet" at the bottom. Big round eyes with white highlights sit high on the front face; a small open mouth giggles. A little leaf sprout grows from the top and flops as it bounces. Slightly see through at the edges only (a lighter rim), solid in the middle.
**Moved away from:** the green slime cube. Wobble is pink, has rounded corners, a leaf sprout, drip feet, no inner cube and no square eyes.
**Palette:** bubblegum pink `#F48FB1` (body), light pink `#FAD1DF` (top face and rim), berry `#C2185B` (side shade and mouth), leaf green `#5FAF5A` (sprout), accent for bubble icons `#E0457B`.
**Personality:** happy, giggly, has no idea what it is doing and loves it.
**Idle loop:** squash and stretch bounce every 2 seconds, sprout flops, every third bounce it wobbles like jelly for a moment.
**Signature touches per emotion:** Thinking, the sprout spins like a propeller. Worried, Wobble wobbles fast in place. Sad, it melts into a flat puddle, then pops back up. Celebrating, a triple bounce with a jelly splat on landing.

| Emotion | Icon | English | Dutch |
|---|---|---|---|
| Neutral / idle | Pointing hand | Your turn! Boing! | Jij bent! Boing! |
| Neutral / idle | Pointing hand | Wiggle wiggle, your move! | Wiebel wiebel, jouw zet! |
| Thinking | Cloud, three dots | Hmm... eeny, meeny... | Hmm... iene, miene... |
| Thinking | Cloud, three dots | Which one? This one? | Welke? Deze dan? |
| Happy | Star | Ooh, I got one! | Ooh, ik heb er een! |
| Happy | Star | Boing! Lucky bounce! | Boing! Geluksstuiter! |
| Worried | Sweat drop | Uh oh, wobbly wobbly! | Oei, wiebel wiebel! |
| Worried | Sweat drop | Eek! My piece! | Iek! Mijn stuk! |
| Surprised | Burst | Whoa! How did you do that? | Wauw! Hoe deed je dat? |
| Surprised | Burst | Boing?! That was clever! | Boing?! Dat was slim! |
| Sad | Raincloud | Splat. You beat me! | Plets. Jij hebt gewonnen! |
| Sad | Raincloud | I melted a little. | Ik smelt een beetje. |
| Sad (resign) | White flag | I give up! You win! | Ik geef op! Jij wint! |
| Celebrating | Trophy | I won? Hee hee! | Ik won? Hihi! |
| Celebrating | Trophy | Bouncy bouncy win! | Stuiter stuiter, gewonnen! |
| Good sport (W) | Handshake | You play great! Again? | Jij speelt super! Nog eens? |
| Good sport (L) | Handshake | Nice game! One more? | Leuk potje! Nog eentje? |
| Good sport (D) | Handshake | A tie! Boing boing! | Gelijk! Boing boing! |
| Oops | Rewind swirl | Boing! Back we go! | Boing! Terug maar! |

## 2. Clucky the Block Hen (Level 2, 1 star, defensive and panicky, v0.1)

**Look:** a round cornered yellow block body with a smaller block head, a big orange beak, and a half eggshell worn as a helmet (her "defence"). Short chunky legs, two stubby wings that flap when nervous. Brown speckles in three fixed spots on the body (drawn shapes, not a texture).
**Moved away from:** the white chicken with red wattle. Clucky is buttercup yellow with an eggshell helmet, no wattle, no red, rounder proportions.
**Palette:** buttercup `#FFD54F` (body), cream `#FFF3C4` (top faces), toffee `#A1662F` (speckles, legs), beak orange `#FB8C00`, eggshell `#FAFAF5` with outline `#C9C2B0`, accent `#F2A900`.
**Personality:** sweet, nervous, sure every piece is in danger.
**Idle loop:** looks left, looks right, pulls the eggshell helmet down a little, repeats every 3 seconds.
**Signature touches:** Worried, she runs in a tiny circle and a feather floats down. Surprised, the helmet pops up off her head. Sad, she hides fully inside the eggshell. Celebrating, a flappy hen dance.

| Emotion | Icon | English | Dutch |
|---|---|---|---|
| Neutral / idle | Pointing hand | Your turn. Careful now! | Jij bent. Voorzichtig hoor! |
| Neutral / idle | Pointing hand | Cluck cluck... waiting! | Tok tok... ik wacht! |
| Thinking | Cloud, three dots | Where is it safe? | Waar is het veilig? |
| Thinking | Cloud, three dots | Hide! No, wait... hmm. | Verstoppen! Nee, wacht... hmm. |
| Happy | Star | Peck! Got one! | Pik! Hebbes! |
| Happy | Star | Cluck! Did I do that? | Tok! Deed ik dat? |
| Worried | Sweat drop | Aaah! Run, run, run! | Aaah! Rennen, rennen, rennen! |
| Worried | Sweat drop | My feathers! My piece! | Mijn veren! Mijn stuk! |
| Surprised | Burst | CLUCK?! Wow, clever you! | TOK?! Wauw, wat slim! |
| Surprised | Burst | Eek! I did not see that! | Iek! Dat zag ik niet! |
| Sad | Raincloud | Oh dear. You got me! | Oh jee. Je hebt me! |
| Sad | Raincloud | Feathers everywhere. You win! | Overal veren. Jij wint! |
| Sad (resign) | White flag | I give up! Cluck! | Ik geef op! Tok! |
| Celebrating | Trophy | I won? I WON! Cluck! | Ik won? Ik WON! Tok! |
| Celebrating | Trophy | Happy hen dance! | Blije kippendans! |
| Good sport (W) | Handshake | You were so brave! | Jij was zo dapper! |
| Good sport (L) | Handshake | Good game! Play again? | Goed gespeeld! Nog eens? |
| Good sport (D) | Handshake | Nobody won. Phew! | Niemand won. Pfoe! |
| Oops | Rewind swirl | Phew! Back again! | Pfoe! Weer terug! |

## 3. Fizz the Fizzy Block (Level 3, 2 stars, aggressive and reckless, v0.2)

**Look:** a tall, round cornered block shaped a bit like a soda can on two short legs, bright orange with a white wavy stripe around its middle. A steady stream of round bubbles rises from its top like a fizzing tablet. Wide happy grin, eyebrows always ready to charge.
**Moved away from:** the green, four legged, sad faced block critter that explodes. Fizz is orange, has two legs and a grin, and its theme is fizz and bubbles, never explosions or hissing.
**Palette:** soda orange `#FF7A1A` (body), peach `#FFC39A` (top face), rust `#C24E00` (side shade), white stripe `#FFFFFF`, bubble aqua `#7FD8E8` with outline `#2A8FA3`, accent `#FF6D00`.
**Personality:** full of energy, charges first, thinks later, never mean.
**Idle loop:** bounces on its toes like a runner before a race; bubbles rise faster every few seconds.
**Signature touches:** Happy, a big bubble pops above its head. Worried, the bubbles stop and it goes a shade paler. Sad, "goes flat": it slumps and the last bubble floats away. Celebrating, a bubble fountain.

| Emotion | Icon | English | Dutch |
|---|---|---|---|
| Neutral / idle | Pointing hand | Go go go! Your turn! | Hup hup! Jij bent! |
| Neutral / idle | Pointing hand | Fizz fizz... I'm ready! | Bruis bruis... ik ben klaar! |
| Thinking | Cloud, three dots | Charge? Yes! Charge! | Aanvallen? Ja! Aanvallen! |
| Thinking | Cloud, three dots | Bubbles say... that one! | De bubbels zeggen... die! |
| Happy | Star | Pop! Got it! | Plop! Hebbes! |
| Happy | Star | Fizzy grab! | Bruisende graai! |
| Worried | Sweat drop | Uh oh, too fizzy! | Oeps, te bruisend! |
| Worried | Sweat drop | That was a trap?! | Was dat een val?! |
| Surprised | Burst | Whoa! My bubbles popped! | Wauw! Mijn bubbels knapten! |
| Surprised | Burst | Wow! Big move! | Wauw! Grote zet! |
| Sad | Raincloud | Pfff. All my fizz is gone. | Pfff. Mijn bruis is op. |
| Sad | Raincloud | You win! I went flat. | Jij wint! Mijn prik is eruit. |
| Celebrating | Trophy | Fizz pop! I won! | Bruis plop! Ik won! |
| Celebrating | Trophy | Bubble party! | Bubbelfeest! |
| Good sport (W) | Handshake | You stopped me! Cool! | Jij hield me tegen! Cool! |
| Good sport (L) | Handshake | Fun game! Charge again? | Leuk potje! Nog een keer? |
| Good sport (D) | Handshake | Even! Bubble high five! | Gelijk! Bubbel high five! |
| Oops | Rewind swirl | Whoosh! Bubbles go back! | Woesj! Bubbels terug! |

## 4. Muddle the Mole (Level 4, 2 stars, silly, v0.2)

**Look:** a chubby, round cornered brown block with a pink star shaped nose, big round glasses, and a small yellow digger's helmet with a lamp that is usually pointing the wrong way. Two broad pink digging paws. A small dirt mound sits at its feet.
**Moved away from:** no Minecraft mob is a mole; still no pickaxe, no block textures, no ores.
**Palette:** cocoa `#8D5A3B` (body), latte `#C79A74` (top face and belly), dark chocolate `#5A3521` (side shade), nose and paws pink `#F59BB0`, helmet yellow `#FFC928`, glasses navy `#1D2B4F`, accent `#B7743F`.
**Personality:** friendly and dreamy, starts a plan, then spots a worm or a butterfly and forgets it.
**Idle loop:** sniffs the air with the star nose, then turns to follow a small butterfly that flutters past, then turns back, blinking.
**Signature touches:** Thinking, a thought bubble shows a worm, then a question mark. Happy, it pops out of the dirt mound. Worried, the helmet lamp flickers slowly (two blinks, never a fast flash). Sad, it digs down until only the helmet shows.

| Emotion | Icon | English | Dutch |
|---|---|---|---|
| Neutral / idle | Pointing hand | Your turn! Ooh, a worm! | Jij bent! Ooh, een worm! |
| Neutral / idle | Pointing hand | Dig dig... oh, your move! | Graaf graaf... oh, jouw zet! |
| Thinking | Cloud, three dots | Plan! Wait, what was it? | Plan! Wacht, wat was het? |
| Thinking | Cloud, three dots | Hmm... I forgot. Again. | Hmm... vergeten. Alweer. |
| Happy | Star | Oh! I found one! | Oh! Ik vond er een! |
| Happy | Star | Dug it up! | Opgegraven! |
| Worried | Sweat drop | Uh oh, my tunnel! | Oei, mijn tunnel! |
| Worried | Sweat drop | Where did my piece go? | Waar is mijn stuk? |
| Surprised | Burst | Huh? Where did that come from? | Hè? Waar kwam dat vandaan? |
| Surprised | Burst | Wow! You made a plan! | Wauw! Jij had een plan! |
| Sad | Raincloud | Oh. I lost? Oops. | Oh. Verloren? Oeps. |
| Sad | Raincloud | Back in my hole. | Terug mijn hol in. |
| Celebrating | Trophy | I won? I forgot to lose! | Ik won? Vergeten te verliezen! |
| Celebrating | Trophy | Happy digging dance! | Blij graafdansje! |
| Good sport (W) | Handshake | You beat me! Well done! | Jij versloeg me! Knap gedaan! |
| Good sport (L) | Handshake | Fun! Let's dig again! | Leuk! Nog eens graven! |
| Good sport (D) | Handshake | Nobody won? Dig again! | Niemand won? Nog eens graven! |
| Oops | Rewind swirl | Huh? This looks familiar! | Hè? Dit ken ik! |

## 5. Copper Bot (Level 5, 3 stars, curious, v0.1)

**Look:** a small, round cornered robot made of two stacked blocks (head and body) in warm copper with a paler top face. One big round lens eye and one small round eye, so it always looks curious. A springy antenna with a round bulb on top. One hand holds a magnifying glass; the other is a simple clamp. Four round rivets on the body front, a small screen on its chest that shows simple pictures (heart, question mark, star) matching the emotion.
**Moved away from:** the copper golem. No lightning rod, no green oxidation stages, no button pressing. Copper Bot is defined by the magnifier, the uneven eyes and the chest screen.
**Palette:** copper `#D9824B` (body), light copper `#F2B48A` (top faces), dark copper `#9C5530` (side shade), steel `#8E9AAF` (antenna, clamp), chest screen mint `#9EE6C9` on navy `#1D2B4F`, accent `#E07A3F`.
**Personality:** a friendly scientist; every move is an experiment. It pokes at the child's pieces to see what happens (Curious style, PRD section 5), which is why it leaves pieces loose.
**Idle loop:** holds the magnifier up to one of the child's pieces, antenna bobs, chest screen shows a question mark.
**Signature touches:** Thinking, the chest screen shows turning gears. Happy, antenna bulb lights up (steady glow, no flashing). Worried, the antenna droops. Surprised, the big lens eye zooms (grows). Sad, it sits down and writes a note on its chest screen.

| Emotion | Icon | English | Dutch |
|---|---|---|---|
| Neutral / idle | Pointing hand | Your turn. I'm watching closely! | Jij bent. Ik kijk goed! |
| Neutral / idle | Pointing hand | Beep. Your move, friend. | Biep. Jouw zet, vriend. |
| Thinking | Cloud, three dots | Beep boop... calculating... | Biep boep... even rekenen... |
| Thinking | Cloud, three dots | Let me look closer. | Even goed kijken. |
| Happy | Star | Beep! Experiment worked! | Biep! Experiment gelukt! |
| Happy | Star | Got one! Interesting! | Hebbes! Interessant! |
| Worried | Sweat drop | Error! Error! My piece! | Fout! Fout! Mijn stuk! |
| Worried | Sweat drop | Beep? That is not good. | Biep? Dat is niet goed. |
| Surprised | Burst | Wow! I must learn that! | Wauw! Dat moet ik leren! |
| Surprised | Burst | New move spotted! Clever! | Nieuwe zet gezien! Slim! |
| Sad | Raincloud | Beep... You win. Well played. | Biep... Jij wint. Goed gespeeld. |
| Sad | Raincloud | Note to self: practise more. | Notitie: meer oefenen. |
| Celebrating | Trophy | Beep beep! I won! | Biep biep! Ik won! |
| Celebrating | Trophy | My lights are dancing! | Mijn lampjes dansen! |
| Good sport (W) | Handshake | You taught me something! | Jij leerde mij iets! |
| Good sport (L) | Handshake | Good game! Test again? | Goed potje! Nog een test? |
| Good sport (D) | Handshake | Result: a tie! Interesting! | Uitslag: gelijk! Interessant! |
| Oops | Rewind swirl | Rewinding tape... beep! | Terugspoelen... biep! |

## 6. Iron Guardian (Level 6, 4 stars, defensive and protective, v1.0)

**Look:** short, broad and stocky, built from wide rounded blocks in cool steel blue. A flat visor with two round friendly eyes glowing warm yellow behind it. It carries a big round shield with a simple star emblem in front of its body. A small red plume on top of the helmet. Short, strong arms and legs.
**Moved away from:** the tall grey iron golem with long arms, a big nose and vines. The Guardian is short and wide, blue steel, visored, carries a shield, has a plume and no nose or plants.
**Palette:** steel blue `#6F8FB3` (body), sky steel `#A9C1DB` (top faces), deep steel `#46607F` (side shade), shield gold `#E8B923` with star `#FFFFFF`, plume red `#D64545`, eye glow `#FFE08A`, accent `#4A78A8`.
**Personality:** calm, kind, protective, a bit proud of its wall of pieces.
**Idle loop:** stands guard, shield raised, turns its head slowly from one side of its army to the other; plume sways.
**Signature touches:** Thinking, taps the shield twice. Happy, lifts the shield high. Worried, hides behind the shield with only the eyes peeking. Surprised, the visor pops open. Sad, the shield lowers and the plume droops. Celebrating, marches in place with the shield held up.

| Emotion | Icon | English | Dutch |
|---|---|---|---|
| Neutral / idle | Pointing hand | I guard. You move. | Ik bewaak. Jij zet. |
| Neutral / idle | Pointing hand | Your turn, brave one. | Jij bent, dappere. |
| Thinking | Cloud, three dots | Is my king safe? | Is mijn koning veilig? |
| Thinking | Cloud, three dots | Shields up. Hmm. | Schilden omhoog. Hmm. |
| Happy | Star | Clang! Got it! | Klang! Hebbes! |
| Happy | Star | Safe and strong! | Veilig en sterk! |
| Worried | Sweat drop | My wall has a hole! | Mijn muur heeft een gat! |
| Worried | Sweat drop | Protect the king! | Bescherm de koning! |
| Surprised | Burst | You got past my shield! | Jij kwam langs mijn schild! |
| Surprised | Burst | Clang?! Strong move! | Klang?! Sterke zet! |
| Sad | Raincloud | My wall fell. You win. | Mijn muur viel. Jij wint. |
| Sad | Raincloud | A true hero. Well done. | Een echte held. Goed zo. |
| Celebrating | Trophy | The wall holds! I win! | De muur houdt! Ik win! |
| Celebrating | Trophy | Clang clang! Party time! | Klang klang! Feest! |
| Good sport (W) | Handshake | You broke my wall. Wow! | Jij brak mijn muur. Wauw! |
| Good sport (L) | Handshake | Well fought! Try again? | Goed gevochten! Nog eens? |
| Good sport (D) | Handshake | Two walls held. Well done! | Twee muren hielden. Goed zo! |
| Oops | Rewind swirl | Clang! Walls back up! | Klang! Muur staat weer! |

## 7. Triple Shade (Level 7, 4 stars, aggressive, v1.0)

**Look:** a friendly blocky three headed serpent. A round cornered body block in deep violet with a lighter lavender belly, three necks rising from it, each ending in a rounded block head with big teal eyes. The left head always grins, the middle head concentrates (tongue out), the right head is sleepy and yawns. Small soft spikes along the necks, drawn as rounded bumps.
**Moved away from:** the black, skull headed, flying three headed boss. Triple Shade is violet and lavender, has necks and a body on the ground, no skulls, no black, no floating, no projectiles.
**Palette:** violet `#6B4FA0` (body), lavender `#B9A6E0` (top faces, belly), plum `#45306E` (side shade), eye teal `#3FD1C1` with navy pupils `#1D2B4F`, bump pink `#E08BC4`, accent `#7E57C2`.
**Personality:** a playful hunter; three opinions, one goal: find the king. Loud but never mean.
**Idle loop:** the three heads take turns looking at the board: grin head bobs, middle head squints, sleepy head yawns and gets nudged awake by the others.
**Signature touches:** Thinking, the three heads argue (they point in three directions, then agree). Happy, all three heads chomp in sequence. Worried, the heads hide behind each other. Surprised, all three jaws drop at once. Sad, the heads tangle into a knot. Celebrating, a three head wave (like a stadium wave).

| Emotion | Icon | English | Dutch |
|---|---|---|---|
| Neutral / idle | Pointing hand | Your turn! Times three! | Jij bent! Keer drie! |
| Neutral / idle | Pointing hand | We are waiting. All three. | Wij wachten. Alle drie. |
| Thinking | Cloud, three dots | Left? Right? Middle? Hmm! | Links? Rechts? Midden? Hmm! |
| Thinking | Cloud, three dots | Three heads think best. | Drie hoofden denken beter. |
| Happy | Star | Chomp! Chomp! Chomp! | Hap! Hap! Hap! |
| Happy | Star | Hunting the king! | Op jacht naar de koning! |
| Worried | Sweat drop | All three heads say uh oh! | Alle drie zeggen: oei! |
| Worried | Sweat drop | Hey! Not our king! | Hé! Niet onze koning! |
| Surprised | Burst | Wow! We did not see that! | Wauw! Dat zagen we niet! |
| Surprised | Burst | Three jaws dropped! | Drie monden vallen open! |
| Sad | Raincloud | Three heads, zero wins. Wow. | Drie hoofden, nul winst. Wauw. |
| Sad | Raincloud | You beat all three of us! | Je versloeg ons alle drie! |
| Celebrating | Trophy | Triple cheer! Hip hip hip! | Driedubbel hoera! Hiep hiep! |
| Celebrating | Trophy | Three heads, one win! | Drie hoofden, een winst! |
| Good sport (W) | Handshake | You were the hunter! Amazing! | Jij was de jager! Geweldig! |
| Good sport (L) | Handshake | Great fight! Once more? | Mooi gevecht! Nog een keer? |
| Good sport (D) | Handshake | Tie! Four heads, one handshake! | Gelijk! Vier hoofden, één hand! |
| Oops | Rewind swirl | Wait! Rewind times three! | Wacht! Drie keer terug! |

## 8. Deep Watcher (Level 8, 5 stars, patient, v0.2)

**Look:** a tall, calm stone block that floats a little above the ground, deep midnight blue with tiny soft gold specks inside like a night sky. One large round eye in the middle of its front face, gold with a navy pupil, that opens and closes slowly. Two small floating stone "hands" hover beside it. A thin gold ring slowly orbits its top.
**Moved away from:** the dark teal, eyeless guardian with a glowing chest and ear tendrils. Deep Watcher has one big eye (the opposite of eyeless), is navy and gold, floats, has no chest glow, no tendrils, no teal and no scary sounds or darkness effects.
**Palette:** midnight `#1F2A5C` (body), dusk blue `#3B4A8C` (top face), deep navy `#141B3D` (side shade), star gold `#F5C84C` (specks, eye, ring), eye pupil `#1D2B4F`, accent `#F5C84C`.
**Personality:** wise, gentle, very calm; the final boss who respects a good fight and never gloats.
**Idle loop:** floats up and down very slowly (4 second cycle), gold ring orbits, the eye follows the child's last touched piece.
**Signature touches:** Thinking, the gold specks swirl slowly inside it. Happy, the eye curves into a smile shape and the ring glows steady. Worried, the float wobbles and the hands come up. Surprised, the eye opens extra wide and the ring stops. Sad, it sinks gently to the ground and the specks dim. Celebrating, the specks rise out of it like slow fireflies.

| Emotion | Icon | English | Dutch |
|---|---|---|---|
| Neutral / idle | Pointing hand | I am listening. Your move. | Ik luister. Jouw zet. |
| Neutral / idle | Pointing hand | Take your time, little one. | Neem je tijd, kleintje. |
| Thinking | Cloud, three dots | Mmm... I see far. | Mmm... ik kijk ver vooruit. |
| Thinking | Cloud, three dots | Quiet... I am thinking. | Stil... ik denk na. |
| Happy | Star | Patience wins a piece. | Geduld wint een stuk. |
| Happy | Star | Just as I felt. | Precies zoals ik voelde. |
| Worried | Sweat drop | Hmm. I did not feel that. | Hm. Dat voelde ik niet. |
| Worried | Sweat drop | My king feels a draft. | Mijn koning voelt tocht. |
| Surprised | Burst | My eye opens wide. Brilliant! | Mijn oog gaat open. Knap! |
| Surprised | Burst | Even I did not see that! | Zelfs ik zag dat niet! |
| Sad | Raincloud | You beat the deep. Wow! | Jij versloeg de diepte. Wauw! |
| Sad | Raincloud | The deep bows to you. | De diepte buigt voor jou. |
| Celebrating | Trophy | The deep glows. I win. | De diepte gloeit. Ik win. |
| Celebrating | Trophy | Patience wins again. | Geduld wint weer. |
| Good sport (W) | Handshake | You are a true champion. | Jij bent een echte kampioen. |
| Good sport (L) | Handshake | You grow stronger. Come back. | Jij wordt sterker. Kom terug. |
| Good sport (D) | Handshake | Balanced, like the deep. Well played. | In balans, net als de diepte. |
| Oops | Rewind swirl | Time flows back. Try again. | De tijd stroomt terug. |

---

## Art production notes

1. Build every creature from the shared rig: one body, per creature eye, brow and mouth sets, and the shared body motions from the rig table. Signature touches are extra layers on top.
2. v0.1 needs only Wobble, Clucky and Copper Bot (versions.md), each with idle, thinking, happy, sad (including the short variant), celebrating and the Good sport pose, plus the big resign Sad for Wobble and Clucky. Make those first to validate the rig.
3. v0.2 adds Worried and Surprised for all creatures so far, plus Fizz, Muddle and Deep Watcher. v1.0 adds Iron Guardian, Triple Shade and the teaching pose for all 8.
4. Each creature also needs: a ladder card pose (idle), a locked silhouette (single dark shape), a Result pose for win and lose, and a small head for the paused badge and the portrait tip state.
5. All line keys go into the copy file as `creature.<id>.<emotion>.<n>` in both languages; the owner reviews both (PRD section 9.7).
