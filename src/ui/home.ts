import type { CreatureId } from '../ai/creatures';
import { CREATURES } from '../ai/creatures';
import { creatureSvg } from './creatureArt';
import { icon } from './icons';
import { pixelSvg } from './pixel';

const LETTERS: Record<string, string[]> = {
  M: ['x...x', 'xx.xx', 'x.x.x', 'x...x', 'x...x', 'x...x', 'x...x'],
  I: ['xxx', '.x.', '.x.', '.x.', '.x.', '.x.', 'xxx'],
  N: ['x...x', 'xx..x', 'x.x.x', 'x..xx', 'x...x', 'x...x', 'x...x'],
  E: ['xxxx', 'x...', 'x...', 'xxx.', 'x...', 'x...', 'xxxx'],
  C: ['.xxx', 'x...', 'x...', 'x...', 'x...', 'x...', '.xxx'],
  H: ['x..x', 'x..x', 'x..x', 'xxxx', 'x..x', 'x..x', 'x..x'],
  S: ['.xxx', 'x...', 'x...', '.xx.', '...x', '...x', 'xxx.'],
};

/** Blocky title: each letter pixel is a small block with a light top and dark shadow. */
function title(text: string): string {
  const rows = Array.from({ length: 9 }, () => '');
  for (const ch of text) {
    const l = LETTERS[ch];
    const w = l[0].length;
    for (let y = 0; y < 9; y++) {
      let row = '';
      for (let x = 0; x < w + 2; x++) {
        const on = (yy: number, xx: number) => yy >= 0 && yy < 7 && xx >= 0 && xx < w && l[yy][xx] === 'x';
        row += on(y, x) ? (y < 3 ? 'g' : 'd') : on(y - 1, x - 1) ? 's' : '.';
      }
      rows[y] += row;
    }
  }
  return pixelSvg(rows, { g: '#7ed957', d: '#4caf3a', s: 'rgba(29,43,79,0.35)' }, 'title-svg');
}

export function homeScreen(play: (id: CreatureId) => void): HTMLElement {
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
    </div>
    <div class="ground"></div>`;
  el.querySelectorAll<HTMLElement>('.card').forEach((card) =>
    card.addEventListener('click', () => play(card.dataset.id as CreatureId)),
  );
  return el;
}
