import type { CreatureId } from '../ai/creatures';
import { addToHall, loadHall, saveHall, type HallEntry } from '../game/hallOfFame';
import { creatureSvg } from './creatureArt';
import { icon } from './icons';

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const NAME_LENGTH = 8;
const RANK_COLORS = ['#ffd700', '#e0e0e0', '#ff9f43', '#4ef0ff', '#4ef0ff', '#7dff6b', '#7dff6b', '#ff6bd5', '#ff6bd5', '#ff6bd5'];

export interface NewScore {
  score: number;
  creature: CreatureId;
}

/** Old school arcade hall of fame: top 10, names of up to 8 letters typed on a big letter board. */
export class HallView {
  readonly el: HTMLElement;

  constructor(private home: () => void, private pending?: NewScore) {
    this.el = document.createElement('div');
    this.el.className = 'screen hall';
    this.el.innerHTML = `
      <button class="btn round home" aria-label="Naar huis">${icon('house')}</button>
      <div class="scanlines"></div>
      <h1 class="hall-title">HALL OF FAME</h1>
      <div class="hall-body"></div>`;
    this.el.querySelector('.home')!.addEventListener('click', () => this.home());
    if (pending) this.renderEntry(pending);
    else this.renderTable(loadHall(), -1);
  }

  private name = '';

  /** Name entry: up to 8 letters on a big on screen letter board (owner request). */
  private renderEntry(s: NewScore) {
    const body = this.el.querySelector('.hall-body')!;
    body.innerHTML = `
      <div class="new-record blink">NIEUW RECORD!</div>
      <div class="entry-score"><span class="count">0</span> PUNTEN</div>
      <div class="name-slots">${Array.from({ length: NAME_LENGTH }, (_, i) => `<span class="slot-letter" data-i="${i}"></span>`).join('')}</div>
      <div class="keyboard">
        ${LETTERS.split('').map((l) => `<button class="btn key" data-l="${l}">${l}</button>`).join('')}
        <button class="btn key wide back" aria-label="Wissen">⌫</button>
        <button class="btn go key wide ok" aria-label="Klaar">OK</button>
      </div>`;
    const slots = body.querySelectorAll<HTMLElement>('.slot-letter');
    const draw = () => slots.forEach((el, i) => {
      el.textContent = this.name[i] ?? '';
      el.classList.toggle('cursor', i === this.name.length);
    });
    body.querySelectorAll<HTMLElement>('.key[data-l]').forEach((k) =>
      k.addEventListener('click', () => {
        if (this.name.length < NAME_LENGTH) this.name += k.dataset.l;
        draw();
      }),
    );
    body.querySelector('.back')!.addEventListener('click', () => {
      this.name = this.name.slice(0, -1);
      draw();
    });
    body.querySelector('.ok')!.addEventListener('click', () => {
      const entry: HallEntry = {
        name: this.name || '???',
        score: s.score,
        creature: s.creature,
        date: new Date().toISOString(),
      };
      const { hall, place } = addToHall(entry, loadHall());
      saveHall(hall);
      this.pending = undefined;
      this.renderTable(hall, place);
    });
    draw();
    // Count the score up like an arcade machine.
    const count = body.querySelector('.count')!;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 1200);
      count.textContent = String(Math.round(s.score * t));
      if (t < 1 && this.el.isConnected) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  private renderTable(hall: HallEntry[], highlight: number) {
    const body = this.el.querySelector('.hall-body')!;
    const rows = Array.from({ length: 10 }, (_, i) => {
      const e = hall[i];
      const color = RANK_COLORS[i];
      return `<div class="hall-row ${i === highlight ? 'blink' : ''}" style="--c:${color}">
        <span class="rank">${i + 1}.</span>
        <span class="name">${e ? e.name : '...'}</span>
        <span class="pts">${e ? String(e.score).padStart(5, '0') : '-----'}</span>
        <span class="beat">${e ? creatureSvg(e.creature, 'idle') : ''}</span>
      </div>`;
    }).join('');
    body.innerHTML = `<div class="hall-table">${rows}</div>
      <div class="insert blink">${hall.length ? 'SPEEL EN VERSLA HET RECORD' : 'NOG GEEN SCORES: SPEEL EEN POTJE!'}</div>`;
  }
}
