import type { Move, Square } from '../engine';
import { legalMoves, moveToUci, toFen } from '../engine';
import type { CreatureId } from '../ai/creatures';
import { CREATURES, creatureById } from '../ai/creatures';
import { Match, type Result } from '../game/match';
import { displayEmotion, type Emotion } from '../game/emotions';
import { AiClient } from './aiClient';
import { creatureSvg } from './creatureArt';
import { icon } from './icons';
import { LINE_ICON, LINES, type LineKey } from './lines';
import { pieceSvg } from './pieces';

const MIN_THINK_MS = 800;
const SLIDE_MS = 450;
const EMOTION_MS = 1600;
const BUBBLE_GAP_MS = 4000;
const IDLE_BUBBLE_MS = 15000;
const HOP_HINT_MS = 10000;

export interface GameCallbacks {
  home(): void;
  play(creature: CreatureId): void;
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
const pickLine = (lines: string[]) => lines[Math.floor(Math.random() * lines.length)];

export class GameView {
  readonly el: HTMLElement;
  private match: Match;
  private ai = new AiClient();
  private squares: HTMLElement[] = [];
  private selected: Square | null = null;
  private previewOnly = false;
  private lastMove: Move | null = null;
  private animating = false;
  private thinking = false;
  private ended = false;
  private token = 0;
  private lastBubbleAt = -Infinity;
  private childTurns = 0;
  private emotionTimer = 0;
  private idleTimer = 0;
  private hopTimer = 0;
  private drag: { from: Square; id: number; x: number; y: number; active: boolean; ghost?: HTMLElement } | null = null;

  private $ = <T extends HTMLElement = HTMLElement>(sel: string) => this.el.querySelector(sel) as T;

  constructor(private creature: CreatureId, private cb: GameCallbacks) {
    // Developer only: ?fen=... starts from a test position (never in the built app).
    const devFen = import.meta.env.DEV ? new URLSearchParams(location.search).get('fen') ?? undefined : undefined;
    this.match = new Match(creature, devFen);
    this.el = document.createElement('div');
    this.el.className = 'screen game';
    this.el.innerHTML = `
      <aside class="side child-side panel">
        <button class="btn round home" aria-label="Naar huis">${icon('house')}</button>
        <div class="avatar-block"><div class="avatar">${pieceSvg('p', 'w')}</div></div>
        <div class="tray child-tray"></div>
        <div class="oops-wrap">
          <button class="btn oops" aria-label="Oeps, terug">${icon('back')}</button>
          <div class="tokens"><span class="token"></span><span class="token"></span></div>
        </div>
        <button class="btn go see-result hidden" aria-label="Uitslag">${icon('king_down')}</button>
      </aside>
      <main class="board-wrap"><div class="board-frame"><div class="board"></div></div></main>
      <aside class="side creature-side panel">
        <div class="bubble hidden"><span class="bubble-icon"></span><span class="bubble-text"></span></div>
        <div class="creature-stage">
          <div class="creature creature-${creature}"></div>
          <div class="extras"></div>
        </div>
        <div class="creature-ring"></div>
        <div class="creature-name">${creatureById(creature).name}</div>
        <div class="tray creature-tray"></div>
      </aside>
      <div class="fx"></div>
      <div class="overlay promo hidden"></div>
      <div class="overlay result hidden"></div>`;
    this.buildBoard();
    this.$('.home').addEventListener('click', () => this.leave(() => this.cb.home()));
    this.$('.oops').addEventListener('click', () => this.onOops());
    this.$('.see-result').addEventListener('click', () => this.onSeeResult());
    this.$('.creature').addEventListener('click', () => this.$('.creature').animate(
      [{ transform: 'translateY(0)' }, { transform: 'translateY(-8px) rotate(-4deg)' }, { transform: 'translateY(0)' }],
      { duration: 300 },
    ));
    this.setEmotion('idle', { bubble: false });
    this.render();
    if (this.match.game.turn === 'b') void this.creatureTurn();
    else this.startChildTurn();
  }

  destroy(): void {
    this.token++;
    this.ai.dispose();
    clearTimeout(this.emotionTimer);
    clearTimeout(this.idleTimer);
    clearTimeout(this.hopTimer);
    this.el.remove();
  }

  private leave(go: () => void) {
    this.destroy();
    go();
  }

  // ---------- board ----------

  private buildBoard() {
    const board = this.$('.board');
    this.squares = new Array(64);
    for (let rank = 7; rank >= 0; rank--) {
      for (let file = 0; file < 8; file++) {
        const sq = rank * 8 + file;
        const d = document.createElement('div');
        d.className = `sq ${(file + rank) % 2 ? 'light' : 'dark'}`;
        d.dataset.sq = String(sq);
        board.appendChild(d);
        this.squares[sq] = d;
      }
    }
    board.addEventListener('pointerdown', (e) => this.onPointerDown(e));
    board.addEventListener('pointermove', (e) => this.onPointerMove(e));
    board.addEventListener('pointerup', (e) => this.onPointerUp(e));
    board.addEventListener('pointercancel', (e) => {
      if (this.drag?.id === e.pointerId) this.endDrag();
    });
  }

  private squareAt(x: number, y: number): Square | null {
    const r = this.$('.board').getBoundingClientRect();
    if (x < r.left || y < r.top || x >= r.right || y >= r.bottom) return null;
    const file = Math.floor(((x - r.left) / r.width) * 8);
    const rank = 7 - Math.floor(((y - r.top) / r.height) * 8);
    return rank * 8 + file;
  }

  private targetsFrom(sq: Square): Move[] {
    return this.match.game.legalMoves().filter((m) => m.from === sq);
  }

  private render() {
    const pos = this.match.game.position;
    const targets = this.selected !== null ? this.previewTargets(this.selected) : [];
    const checkSq = this.match.game.inCheck() ? pos.board.findIndex((p) => p?.type === 'k' && p.color === pos.turn) : -1;
    for (let sq = 0; sq < 64; sq++) {
      const d = this.squares[sq];
      const p = pos.board[sq];
      const t = targets.find((m) => m.to === sq);
      d.classList.toggle('selected', sq === this.selected);
      d.classList.toggle('dot', !!t && !t.captured);
      d.classList.toggle('capture', !!t && !!t.captured);
      d.classList.toggle('preview', this.previewOnly);
      d.classList.toggle('last', !!this.lastMove && (this.lastMove.from === sq || this.lastMove.to === sq));
      d.classList.toggle('check', sq === checkSq);
      const html = p ? pieceSvg(p.type, p.color) : '';
      if (d.dataset.piece !== (p ? p.type + p.color : '')) {
        d.innerHTML = html;
        d.dataset.piece = p ? p.type + p.color : '';
      }
      d.classList.remove('dragging-src');
    }
    this.$('.board-frame').classList.toggle('over', this.ended);
    this.renderTrays();
    this.renderControls();
  }

  /** Legal targets; on the creature's turn the child may still look (grey dots). */
  private previewTargets(sq: Square): Move[] {
    if (!this.previewOnly) return this.targetsFrom(sq);
    const pos = this.match.game.position;
    return legalMoves({ ...pos, turn: 'w', ep: null }).filter((m) => m.from === sq);
  }

  private renderTrays() {
    const child: string[] = [];
    const creature: string[] = [];
    for (const m of this.match.game.moves) {
      if (!m.captured) continue;
      if (m.color === 'w') child.push(pieceSvg(m.captured, 'b'));
      else creature.push(pieceSvg(m.captured, 'w'));
    }
    this.$('.child-tray').innerHTML = child.join('');
    this.$('.creature-tray').innerHTML = creature.join('');
  }

  private renderControls() {
    const m = this.match;
    const oops = this.$('.oops');
    const usable = m.canOops() && !this.animating && !this.ended;
    oops.classList.toggle('disabled', !usable);
    oops.classList.toggle('glow', m.held);
    this.el.querySelectorAll('.token').forEach((t, i) => t.classList.toggle('used', i >= m.credits));
    this.$('.see-result').classList.toggle('hidden', !m.held);
    const childTurn = m.childToMove && !this.ended;
    this.$('.avatar-block').classList.toggle('active', childTurn);
    this.$('.creature-ring').classList.toggle('active', !childTurn && !m.held && !this.ended);
  }

  // ---------- input ----------

  private onPointerDown(e: PointerEvent) {
    e.preventDefault();
    // Ignore a second finger while one piece is being dragged.
    if (this.drag && e.pointerId !== this.drag.id) return;
    if (this.ended || this.animating || this.match.held) return;
    this.resetIdleTimers();
    const sq = this.squareAt(e.clientX, e.clientY);
    if (sq === null) return;
    const piece = this.match.game.position.board[sq];
    const childTurn = this.match.childToMove && !this.thinking;
    if (childTurn && this.selected !== null && !this.previewOnly) {
      const move = this.targetsFrom(this.selected).find((m) => m.to === sq);
      if (move) {
        void this.childMove(this.selected, sq);
        return;
      }
    }
    if (piece?.color === 'w') {
      this.selected = sq;
      this.previewOnly = !childTurn;
      if (!this.previewOnly && this.targetsFrom(sq).length === 0) {
        this.squares[sq].animate(
          [{ transform: 'translateX(0)' }, { transform: 'translateX(-6px)' }, { transform: 'translateX(6px)' }, { transform: 'translateX(0)' }],
          { duration: 300 },
        );
      }
      if (!this.previewOnly) {
        this.drag = { from: sq, id: e.pointerId, x: e.clientX, y: e.clientY, active: false };
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      }
    } else {
      this.selected = null;
    }
    this.render();
  }

  private onPointerMove(e: PointerEvent) {
    const d = this.drag;
    if (!d || d.id !== e.pointerId) return;
    // A drag only starts after a clear movement (40 percent of a square), so a finger wobble never moves a piece.
    const threshold = this.squares[d.from].getBoundingClientRect().width * 0.4;
    if (!d.active && Math.hypot(e.clientX - d.x, e.clientY - d.y) > threshold) {
      d.active = true;
      const size = this.squares[d.from].getBoundingClientRect().width;
      const ghost = document.createElement('div');
      ghost.className = 'ghost-piece';
      ghost.style.width = ghost.style.height = `${size * 1.15}px`;
      ghost.innerHTML = this.squares[d.from].innerHTML;
      this.$('.fx').appendChild(ghost);
      d.ghost = ghost;
      this.squares[d.from].classList.add('dragging-src');
    }
    if (d.active && d.ghost) {
      const size = d.ghost.getBoundingClientRect().width;
      d.ghost.style.transform = `translate(${e.clientX - size / 2}px, ${e.clientY - size / 2 - 40}px)`;
      const over = this.squareAt(e.clientX, e.clientY - 40);
      this.squares.forEach((s, i) => s.classList.toggle('drop', i === over && s.classList.contains('dot') || i === over && s.classList.contains('capture')));
    }
  }

  private onPointerUp(e: PointerEvent) {
    const d = this.drag;
    if (!d || d.id !== e.pointerId) return;
    const wasActive = d.active;
    this.endDrag();
    if (!wasActive) return;
    const to = this.squareAt(e.clientX, e.clientY - 40);
    if (to !== null && to !== d.from && this.targetsFrom(d.from).some((m) => m.to === to)) void this.childMove(d.from, to);
    else this.render();
  }

  private endDrag() {
    this.drag?.ghost?.remove();
    this.drag = null;
    this.squares.forEach((s) => s.classList.remove('drop', 'dragging-src'));
  }

  private async childMove(from: Square, to: Square) {
    const options = this.targetsFrom(from).filter((m) => m.to === to);
    let move = options[0];
    if (options.length > 1) {
      const choice = await this.askPromotion();
      if (!choice) {
        this.selected = null;
        this.render();
        return;
      }
      move = options.find((m) => m.promotion === choice)!;
    }
    this.selected = null;
    const outcome = this.match.playChild(moveToUci(move));
    this.lastMove = outcome.move;
    this.childTurns++;
    this.render();
    if (outcome.result) return this.endGame(outcome.result, outcome.emotion);
    this.setEmotion(outcome.emotion);
    void this.creatureTurn();
  }

  /** Resolves with the chosen piece, or null when the child taps back (AC-38). */
  private askPromotion(): Promise<'q' | 'r' | 'b' | 'n' | null> {
    const box = this.$('.promo');
    box.innerHTML = `<div class="promo-row">${(['q', 'r', 'b', 'n'] as const)
      .map((t) => `<button class="btn promo-btn" data-t="${t}">${pieceSvg(t, 'w')}</button>`).join('')}
      <button class="btn promo-back" aria-label="Terug">${icon('back')}</button></div>`;
    box.classList.remove('hidden');
    // The tap that opened the picker must not also choose or cancel.
    box.classList.add('waking');
    setTimeout(() => box.classList.remove('waking'), 400);
    return new Promise((resolve) => {
      const done = (v: 'q' | 'r' | 'b' | 'n' | null) => {
        box.classList.add('hidden');
        resolve(v);
      };
      box.querySelectorAll<HTMLElement>('.promo-btn').forEach((b) =>
        b.addEventListener('click', () => done(b.dataset.t as 'q' | 'r' | 'b' | 'n')),
      );
      box.querySelector('.promo-back')!.addEventListener('click', () => done(null));
    });
  }

  // ---------- creature ----------

  private async creatureTurn() {
    const token = this.token;
    this.renderControls();
    if (this.match.shouldResign()) {
      await wait(700);
      if (token !== this.token) return;
      return this.endGame(this.match.resign(), 'sadResign');
    }
    this.thinking = true;
    // Let the reaction to the child's move play before thinking starts.
    await wait(900);
    if (token !== this.token || !this.thinking) return;
    const started = performance.now();
    this.setEmotion('thinking');
    const uci = await this.ai.choose(toFen(this.match.game.position), [...this.match.game.history], this.creature);
    if (uci === null || token !== this.token) return;
    const left = MIN_THINK_MS - (performance.now() - started);
    if (left > 0) await wait(left);
    if (token !== this.token || !this.thinking) return;
    this.thinking = false;
    await this.animateCreatureMove(uci);
    if (token !== this.token) return;
    const outcome = this.match.playCreature(uci);
    this.lastMove = outcome.move;
    this.selected = null;
    this.previewOnly = false;
    this.render();
    if (outcome.held) {
      this.setEmotion('celebrating', { persist: true });
      this.renderControls();
      return;
    }
    if (outcome.result) return this.endGame(outcome.result, outcome.emotion);
    this.setEmotion(outcome.emotion);
    this.startChildTurn();
  }

  private async animateCreatureMove(uci: string) {
    const move = this.match.game.findMove(uci);
    if (!move) return;
    this.animating = true;
    this.renderControls();
    const fromEl = this.squares[move.from];
    const toEl = this.squares[move.to];
    const a = fromEl.getBoundingClientRect();
    const b = toEl.getBoundingClientRect();
    const flyer = document.createElement('div');
    flyer.className = 'ghost-piece flyer';
    flyer.style.width = flyer.style.height = `${a.width}px`;
    flyer.innerHTML = fromEl.innerHTML;
    this.$('.fx').appendChild(flyer);
    fromEl.classList.add('dragging-src');
    const start = `translate(${a.left}px, ${a.top}px)`;
    const end = `translate(${b.left}px, ${b.top}px)`;
    const frames: Keyframe[] = move.piece === 'n'
      ? [{ transform: start }, { transform: `translate(${(a.left + b.left) / 2}px, ${Math.min(a.top, b.top) - a.height * 0.8}px) scale(1.15)` }, { transform: end }]
      : [{ transform: start }, { transform: `translate(${(a.left + b.left) / 2}px, ${(a.top + b.top) / 2}px) scale(1.1)` }, { transform: end }];
    await flyer.animate(frames, { duration: SLIDE_MS, easing: 'ease-in-out', fill: 'forwards' }).finished;
    if (move.captured) this.poof(move.flag === 'ep' ? move.to + 8 : move.to);
    flyer.remove();
    this.animating = false;
  }

  /** Captured child piece bursts into small blocks (AC-48). */
  private poof(sq: Square) {
    const r = this.squares[sq].getBoundingClientRect();
    for (let i = 0; i < 10; i++) {
      const bit = document.createElement('div');
      bit.className = 'poof-bit';
      const size = r.width / 7;
      bit.style.width = bit.style.height = `${size}px`;
      const x = r.left + r.width / 2;
      const y = r.top + r.height / 2;
      const angle = (i / 10) * Math.PI * 2;
      const dist = r.width * (0.5 + Math.random() * 0.4);
      this.$('.fx').appendChild(bit);
      bit.animate(
        [
          { transform: `translate(${x}px, ${y}px) scale(1)`, opacity: 1 },
          { transform: `translate(${x + Math.cos(angle) * dist}px, ${y + Math.sin(angle) * dist}px) scale(0.3) rotate(90deg)`, opacity: 0 },
        ],
        { duration: 450, easing: 'ease-out' },
      ).finished.then(() => bit.remove());
    }
  }

  // ---------- turns, oops, end ----------

  private startChildTurn() {
    this.renderControls();
    if (this.childTurns < 3) {
      setTimeout(() => {
        if (this.match.childToMove && !this.ended) this.showBubble('idle');
      }, EMOTION_MS + 200);
    }
    this.resetIdleTimers();
  }

  private resetIdleTimers() {
    clearTimeout(this.idleTimer);
    clearTimeout(this.hopTimer);
    if (!this.match.childToMove || this.ended) return;
    this.hopTimer = window.setTimeout(() => {
      const movable = new Set(this.match.game.legalMoves().map((m) => m.from));
      movable.forEach((sq) => this.squares[sq].firstElementChild?.animate(
        [{ transform: 'translateY(0)' }, { transform: 'translateY(-18%)' }, { transform: 'translateY(0)' }],
        { duration: 400, delay: (sq % 8) * 40 },
      ));
    }, HOP_HINT_MS);
    this.idleTimer = window.setTimeout(() => {
      if (this.match.childToMove && !this.ended) this.showBubble('idle', true);
    }, IDLE_BUBBLE_MS);
  }

  private oopsLockedUntil = 0;

  private onOops() {
    // One double tap must not spend both credits.
    if (performance.now() < this.oopsLockedUntil) return;
    const oops = this.$('.oops');
    if (oops.classList.contains('disabled')) {
      this.$('.tokens').animate(
        [{ transform: 'rotate(0)' }, { transform: 'rotate(-8deg)' }, { transform: 'rotate(8deg)' }, { transform: 'rotate(0)' }],
        { duration: 350 },
      );
      return;
    }
    this.oopsLockedUntil = performance.now() + 600;
    this.token++;
    this.thinking = false;
    this.ai.cancel();
    const used = this.el.querySelectorAll('.token')[this.match.credits - 1] as HTMLElement | undefined;
    used?.animate([{ transform: 'translateY(0) scale(1)', opacity: 1 }, { transform: 'translateY(-60px) scale(1.6)', opacity: 0 }], { duration: 450 });
    this.match.oops();
    this.selected = null;
    const last = this.match.lastMove();
    this.lastMove = last && last.color === 'b' ? last : null;
    this.render();
    this.setEmotion('idle', { bubble: false });
    this.$('.creature').animate([{ transform: 'rotateY(0)' }, { transform: 'rotateY(-360deg)' }], { duration: 600 });
    this.showBubble('oops', true);
    this.startChildTurn();
  }

  private onSeeResult() {
    if (!this.match.held) return;
    this.endGame(this.match.acceptLoss(), 'celebrating');
  }

  private async endGame(result: Result, emotion: Emotion) {
    this.ended = true;
    this.thinking = false;
    this.token++;
    clearTimeout(this.idleTimer);
    clearTimeout(this.hopTimer);
    this.render();
    const token = this.token;
    const first: Emotion = result.reason === 'resign' ? 'sadResign' : result.kind === 'draw' ? 'goodSport' : emotion;
    this.setEmotion(first, { persist: true, force: true, lineKey: result.kind === 'draw' ? 'draw' : undefined });
    await wait(result.reason === 'resign' ? 3000 : 2000);
    if (token !== this.token) return;
    this.showResult(result);
  }

  private showResult(result: Result) {
    const box = this.$('.result');
    const idx = CREATURES.findIndex((c) => c.id === this.creature);
    const next = CREATURES[idx + 1];
    const line = pickLine(LINES[this.creature][result.kind]);
    const picture =
      result.kind === 'win' ? `<div class="big-pic win">${icon('trophy')}</div>`
      : result.kind === 'loss' ? `<div class="big-pic loss">${icon('handshake')}</div>`
      : `<div class="big-pic draw">${drawPicture(result.reason)}${icon('handshake')}</div>`;
    box.innerHTML = `
      <div class="result-card panel">
        ${picture}
        <div class="result-creature">
          <div class="creature creature-${this.creature} emo-goodSport">${creatureSvg(this.creature, 'goodSport')}</div>
          <div class="bubble"><span class="bubble-icon">${icon('handshake')}</span><span class="bubble-text">${line}</span></div>
        </div>
        <div class="result-buttons">
          <button class="btn go big rematch" aria-label="Nog een keer">${icon('play')}<span>Nog eens</span></button>
          ${result.kind === 'win' && next ? `<button class="btn big next" aria-label="Volgende">${icon('next')}<span>${next.name}</span></button>` : ''}
          <button class="btn big home2" aria-label="Naar huis">${icon('house')}<span>Huis</span></button>
        </div>
      </div>`;
    box.classList.remove('hidden');
    // Taps that were meant for the board must not hit the buttons that just appeared.
    box.classList.add('waking');
    setTimeout(() => box.classList.remove('waking'), 700);
    if (result.kind === 'win') this.confetti();
    box.querySelector('.rematch')!.addEventListener('click', () => this.leave(() => this.cb.play(this.creature)));
    box.querySelector('.next')?.addEventListener('click', () => this.leave(() => this.cb.play(next!.id)));
    box.querySelector('.home2')!.addEventListener('click', () => this.leave(() => this.cb.home()));
  }

  private confetti() {
    const colors = ['#f5c84c', '#e0457b', '#3b82f6', '#5fae4a', '#fb8c00'];
    for (let i = 0; i < 40; i++) {
      const bit = document.createElement('div');
      bit.className = 'poof-bit';
      bit.style.background = colors[i % colors.length];
      bit.style.width = bit.style.height = '14px';
      const x = Math.random() * window.innerWidth;
      this.$('.fx').appendChild(bit);
      bit.animate(
        [{ transform: `translate(${x}px, -20px) rotate(0)` }, { transform: `translate(${x + (Math.random() - 0.5) * 120}px, ${window.innerHeight + 20}px) rotate(540deg)` }],
        { duration: 1800 + Math.random() * 1200, delay: Math.random() * 600, easing: 'ease-in' },
      ).finished.then(() => bit.remove());
    }
  }

  // ---------- emotions ----------

  private setEmotion(raw: Emotion, opts: { bubble?: boolean; persist?: boolean; force?: boolean; lineKey?: LineKey } = {}) {
    const e = displayEmotion(raw);
    clearTimeout(this.emotionTimer);
    const c = this.$('.creature');
    c.className = `creature creature-${this.creature} emo-${e}`;
    c.innerHTML = creatureSvg(this.creature, e);
    const extras = this.$('.extras');
    extras.innerHTML =
      e === 'thinking' ? `<div class="thought"><i></i><i></i><i></i></div>`
      : e === 'sad' ? `<div class="raincloud">${icon('rain')}</div>`
      : e === 'sadResign' ? `<div class="white-flag">${icon('flag')}</div>`
      : e === 'celebrating' ? `<div class="sparkles">${icon('star')}${icon('star')}</div>`
      : '';
    const key: LineKey | null =
      opts.lineKey ?? (e === 'sadShort' || e === 'goodSport' ? null : e === 'idle' ? null : (e as LineKey));
    if (key && opts.bubble !== false) this.showBubble(key, opts.force);
    if (!opts.persist && e !== 'idle' && e !== 'thinking') {
      this.emotionTimer = window.setTimeout(() => this.setEmotion('idle', { bubble: false }), e === 'sadShort' ? 1000 : EMOTION_MS);
    }
  }

  private showBubble(key: LineKey, force = false) {
    const now = performance.now();
    if (!force && now - this.lastBubbleAt < BUBBLE_GAP_MS) return;
    this.lastBubbleAt = now;
    const b = this.$('.creature-side .bubble');
    b.querySelector('.bubble-icon')!.innerHTML = icon(LINE_ICON[key]);
    b.querySelector('.bubble-text')!.textContent = pickLine(LINES[this.creature][key]);
    b.classList.remove('hidden');
    b.animate([{ transform: 'scale(0.6)', opacity: 0 }, { transform: 'scale(1)', opacity: 1 }], { duration: 180 });
    clearTimeout(Number(b.dataset.timer));
    if (!this.ended) b.dataset.timer = String(window.setTimeout(() => b.classList.add('hidden'), 2200));
  }
}

function drawPicture(reason: string): string {
  if (reason === 'stalemate') return `<span class="pair">${pieceSvg('k', 'b')}${icon('lock')}</span>`;
  if (reason === 'fifty') return icon('hourglass');
  if (reason === 'material') return `<span class="pair">${pieceSvg('k', 'w')}${pieceSvg('k', 'b')}</span>`;
  return icon('loop');
}

