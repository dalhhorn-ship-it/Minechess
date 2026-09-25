import { legalMoves, parseFen, parseSquare } from '../engine';
import { CHAPTERS, type LessonPage } from '../game/lessons';
import { icon } from './icons';
import { pieceSvg } from './pieces';

const ARROW_COLOR = { move: '#1b4fa8', good: '#2e9e44', bad: '#c8102e', threat: '#e8741c' } as const;

function chapterIcon(kind: string): string {
  if (kind === 'pieces') return pieceSvg('n', 'w');
  if (kind === 'start') return pieceSvg('p', 'w');
  if (kind === 'smart') return icon('think');
  return icon('trophy');
}

/** Lessons screen: chapters on the left, an example board in the middle, the explanation on the right. */
export class LessonView {
  readonly el: HTMLElement;
  private chapter = 0;
  private page = 0;

  constructor(private home: () => void) {
    this.el = document.createElement('div');
    this.el.className = 'screen lessons';
    this.el.innerHTML = `
      <aside class="side panel lesson-chapters">
        <button class="btn round home" aria-label="Naar huis">${icon('house')}</button>
        ${CHAPTERS.map((c, i) => `
          <button class="chapter-btn slot" data-i="${i}">
            <span class="chapter-icon">${chapterIcon(c.icon)}</span><span>${c.title}</span>
          </button>`).join('')}
      </aside>
      <main class="board-wrap"><div class="board-frame"><div class="board lesson-board"></div></div></main>
      <aside class="side panel lesson-text">
        <h2 class="lesson-title"></h2>
        <div class="lesson-body"></div>
        <div class="page-dots"></div>
        <div class="lesson-nav">
          <button class="btn prev" aria-label="Vorige">${icon('back')}</button>
          <button class="btn go next" aria-label="Volgende">${icon('next')}</button>
        </div>
      </aside>`;
    this.el.querySelector('.home')!.addEventListener('click', () => this.home());
    this.el.querySelectorAll<HTMLElement>('.chapter-btn').forEach((b) =>
      b.addEventListener('click', () => this.show(Number(b.dataset.i), 0)),
    );
    this.el.querySelector('.prev')!.addEventListener('click', () => this.step(-1));
    this.el.querySelector('.next')!.addEventListener('click', () => this.step(1));
    this.show(0, 0);
  }

  private step(dir: number) {
    const pages = CHAPTERS[this.chapter].pages.length;
    let c = this.chapter;
    let p = this.page + dir;
    if (p >= pages && c < CHAPTERS.length - 1) {
      c++;
      p = 0;
    } else if (p < 0 && c > 0) {
      c--;
      p = CHAPTERS[c].pages.length - 1;
    }
    if (p >= 0 && p < CHAPTERS[c].pages.length) this.show(c, p);
  }

  private show(c: number, p: number) {
    this.chapter = c;
    this.page = p;
    const chapter = CHAPTERS[c];
    const page = chapter.pages[p];
    this.el.querySelectorAll('.chapter-btn').forEach((b, i) => b.classList.toggle('active', i === c));
    this.el.querySelector('.lesson-title')!.textContent = page.title;
    this.el.querySelector('.lesson-body')!.innerHTML = page.text.map((t) => `<p>${t}</p>`).join('');
    this.el.querySelector('.page-dots')!.innerHTML = chapter.pages.map((_, i) => `<i class="${i === p ? 'on' : ''}"></i>`).join('');
    const last = c === CHAPTERS.length - 1 && p === chapter.pages.length - 1;
    this.el.querySelector('.prev')!.classList.toggle('disabled', c === 0 && p === 0);
    this.el.querySelector('.next')!.classList.toggle('disabled', last);
    this.renderBoard(page);
  }

  private renderBoard(page: LessonPage) {
    const board = this.el.querySelector('.lesson-board')!;
    const pos = parseFen(page.fen);
    const dots = new Set<number>();
    const caps = new Set<number>();
    if (page.dotsFrom) {
      const from = parseSquare(page.dotsFrom);
      const color = pos.board[from]?.color ?? 'w';
      for (const m of legalMoves({ ...pos, turn: color })) {
        if (m.from !== from) continue;
        (m.captured ? caps : dots).add(m.to);
      }
    }
    const mark = (list: string[] | undefined) => new Set((list ?? []).map(parseSquare));
    const good = mark(page.good);
    const bad = mark(page.bad);
    const gold = mark(page.gold);
    let html = '';
    for (let rank = 7; rank >= 0; rank--) {
      for (let file = 0; file < 8; file++) {
        const sq = rank * 8 + file;
        const p = pos.board[sq];
        const cls = [
          'sq', (file + rank) % 2 ? 'light' : 'dark',
          dots.has(sq) ? 'dot' : '', caps.has(sq) ? 'capture' : '',
          good.has(sq) ? 'hl-good' : '', bad.has(sq) ? 'hl-bad' : '', gold.has(sq) ? 'hl-gold' : '',
          page.dotsFrom && parseSquare(page.dotsFrom) === sq ? 'selected' : '',
        ].filter(Boolean).join(' ');
        html += `<div class="${cls}">${p ? pieceSvg(p.type, p.color) : ''}</div>`;
      }
    }
    const center = (name: string) => {
      const s = parseSquare(name);
      return [(s & 7) + 0.5, 7 - (s >> 3) + 0.5];
    };
    const arrows = (page.arrows ?? []).map((ar) => {
      const [x1, y1] = center(ar.from);
      const [x2, y2] = center(ar.to);
      const len = Math.hypot(x2 - x1, y2 - y1);
      const ux = (x2 - x1) / len;
      const uy = (y2 - y1) / len;
      const ex = x2 - ux * 0.35;
      const ey = y2 - uy * 0.35;
      const color = ARROW_COLOR[ar.kind];
      const head = `${x2 - ux * 0.05},${y2 - uy * 0.05} ${ex - uy * 0.25},${ey + ux * 0.25} ${ex + uy * 0.25},${ey - ux * 0.25}`;
      const dash = ar.kind === 'threat' || ar.kind === 'bad' ? ' stroke-dasharray="0.25 0.15"' : '';
      return `<line x1="${x1}" y1="${y1}" x2="${ex}" y2="${ey}" stroke="${color}" stroke-width="0.18" stroke-linecap="round"${dash} opacity="0.9"/>` +
        `<polygon points="${head}" fill="${color}" opacity="0.9"/>`;
    }).join('');
    board.innerHTML = html + `<svg class="arrows" viewBox="0 0 8 8" aria-hidden="true">${arrows}</svg>`;
  }
}
