import type { CreatureId } from '../ai/creatures';
import { CREATURES } from '../ai/creatures';
import { creatureSvg } from './creatureArt';
import { icon } from './icons';
import { box, extrudedSvg } from './pixel';

const LETTERS: Record<string, string[]> = {
  M: ['x...x', 'xx.xx', 'x.x.x', 'x...x', 'x...x', 'x...x', 'x...x'],
  I: ['xxx', '.x.', '.x.', '.x.', '.x.', '.x.', 'xxx'],
  N: ['x...x', 'xx..x', 'x.x.x', 'x..xx', 'x...x', 'x...x', 'x...x'],
  E: ['xxxx', 'x...', 'x...', 'xxx.', 'x...', 'x...', 'xxxx'],
  C: ['.xxx', 'x...', 'x...', 'x...', 'x...', 'x...', '.xxx'],
  H: ['x..x', 'x..x', 'x..x', 'xxxx', 'x..x', 'x..x', 'x..x'],
  S: ['.xxx', 'x...', 'x...', '.xx.', '...x', '...x', 'xxx.'],
};

/** Title in 3D stone letters, like carved blocks. */
function title(text: string): string {
  const rows = Array.from({ length: 7 }, () => '');
  for (const ch of text) {
    const l = LETTERS[ch];
    for (let y = 0; y < 7; y++) rows[y] += l[y].replace(/x/g, y < 2 ? 'g' : 's') + '..';
  }
  return extrudedSvg(rows.map((r) => r.slice(0, -2)), { g: '#7ed957', s: '#9a9a9a' }, '#d2d2d2', '#4d4d4d', 0.9, 'title-svg');
}

/** A blocky tree: trunk box with a leaf cube on top. */
function tree(): string {
  return `<svg viewBox="-2 -4 30 44" aria-hidden="true">${box(10, 22, 6, 16, 3, '#7a5530', 3)}${box(2, 4, 22, 18, 6, '#4f9a3a', 14)}</svg>`;
}

export function homeScreen(play: (id: CreatureId) => void, learn: () => void): HTMLElement {
  const el = document.createElement('div');
  el.className = 'screen home';
  el.innerHTML = `
    <div class="sky"><i class="cloud c1"></i><i class="cloud c2"></i><i class="cloud c3"></i></div>
    <h1 class="title" aria-label="Minechess">${title('MINECHESS')}</h1>
    <div class="cards">
      ${CREATURES.map((c, i) => `
        <button class="card panel" data-id="${c.id}" style="--delay:${i * 0.4}s" aria-label="${c.name}">
          <div class="creature creature-${c.id} emo-idle">${creatureSvg(c.id, 'idle')}</div>
          <div class="card-name">${c.name}</div>
          <div class="stars">${Array.from({ length: 5 }, (_, s) => `<span class="${s < c.stars ? 'on' : 'off'}">${icon('star')}</span>`).join('')}</div>
          <div class="card-play">${icon('play')}</div>
        </button>`).join('')}
      <button class="card panel learn-card" aria-label="Leren">
        <div class="creature learn-pic">${icon('book')}</div>
        <div class="card-name">Leren</div>
        <div class="stars learn-sub">Zo speel je schaak</div>
        <div class="card-play">${icon('play')}</div>
      </button>
    </div>
    <div class="trees"><i class="tree t1">${tree()}</i><i class="tree t2">${tree()}</i></div>
    <div class="ground"></div>`;
  el.querySelectorAll<HTMLElement>('.card[data-id]').forEach((card) =>
    card.addEventListener('click', () => play(card.dataset.id as CreatureId)),
  );
  el.querySelector('.learn-card')!.addEventListener('click', learn);
  return el;
}
