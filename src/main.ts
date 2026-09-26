import './style.css';
import { creatureById, type CreatureId } from './ai/creatures';
import { GameView } from './ui/gameView';
import { homeScreen } from './ui/home';
import { LessonView } from './ui/lessonView';
import { HallView, type NewScore } from './ui/hallView';
import { icon } from './ui/icons';
import { installTextures } from './ui/pixel';
import { installSoundUnlock, whenUnlocked } from './ui/sound';
import { playSong, resumeWantedSong } from './ui/music';

installTextures();
installSoundUnlock();
whenUnlocked(resumeWantedSong);

const app = document.getElementById('app')!;
let game: GameView | null = null;

let blockTapsUntil = 0;

function show(el: HTMLElement) {
  app.replaceChildren(el);
  // The second tap of a double tap must not land on the new screen.
  blockTapsUntil = performance.now() + 400;
}

for (const type of ['click', 'pointerdown']) {
  document.addEventListener(type, (e) => {
    if (performance.now() < blockTapsUntil) {
      e.stopPropagation();
      e.preventDefault();
    }
  }, true);
}

function home() {
  game?.destroy();
  game = null;
  show(homeScreen(play, learn, () => hall()));
  playSong('home');
}

function hall(score?: NewScore) {
  game?.destroy();
  game = null;
  show(new HallView(home, score).el);
  playSong('arcade');
}

function learn() {
  game?.destroy();
  game = null;
  show(new LessonView(home).el);
  playSong('home');
}

function play(id: CreatureId) {
  game?.destroy();
  game = new GameView(id, { home, play, hall });
  show(game.el);
  playSong(creatureById(id).stars >= 2 ? 'workshop' : 'adventure');
}

// Landscape only in v0.1: a picture asks to turn the iPad.
const rotate = document.createElement('div');
rotate.className = 'rotate-hint';
rotate.innerHTML = `<div class="rotate-pic">${icon('rotate')}</div>`;
document.body.appendChild(rotate);

// No zoom, callouts or text selection from any touch (AC-50).
for (const type of ['gesturestart', 'gesturechange', 'dblclick', 'contextmenu']) {
  document.addEventListener(type, (e) => e.preventDefault(), { passive: false });
}
document.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });

home();
