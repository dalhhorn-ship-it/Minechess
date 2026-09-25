import type { CreatureId } from '../ai/creatures';
import { legalMoves, moveToUci, parseFen } from '../engine';

/** If the worker fails or is too slow, the creature plays a random legal move so the game never freezes. */
const TIMEOUT_MS = 6000;

function fallbackMove(fen: string): string | null {
  const moves = legalMoves(parseFen(fen));
  return moves.length ? moveToUci(moves[Math.floor(Math.random() * moves.length)]) : null;
}

/** Runs the creature's search in a Web Worker so the screen never freezes. Cancel restarts the worker (AC-65). */
export class AiClient {
  private worker: Worker | null = null;
  private seq = 0;
  private pending: ((uci: string | null) => void) | null = null;
  private timer = 0;

  private ensure(): Worker {
    if (!this.worker) {
      this.worker = new Worker(new URL('../ai/worker.ts', import.meta.url), { type: 'module' });
      this.worker.onmessage = (e: MessageEvent<{ id: number; uci: string }>) => {
        if (e.data.id !== this.seq) return;
        this.finish(e.data.uci);
      };
      this.worker.onerror = () => this.fail();
      this.worker.onmessageerror = () => this.fail();
    }
    return this.worker;
  }

  /** Resolves with the move, or null when cancelled. */
  choose(fen: string, history: string[], creature: CreatureId): Promise<string | null> {
    this.cancel();
    const id = ++this.seq;
    this.fen = fen;
    return new Promise((resolve) => {
      this.pending = resolve;
      this.timer = window.setTimeout(() => this.fail(), TIMEOUT_MS);
      try {
        this.ensure().postMessage({ id, fen, history, creature, seed: Math.floor(Math.random() * 2 ** 31) });
      } catch {
        this.fail();
      }
    });
  }

  private fen = '';

  private finish(uci: string | null) {
    clearTimeout(this.timer);
    const done = this.pending;
    this.pending = null;
    done?.(uci);
  }

  /** The worker broke or took too long: restart it and play a random legal move instead. */
  private fail() {
    if (!this.pending) return;
    this.worker?.terminate();
    this.worker = null;
    this.finish(fallbackMove(this.fen));
  }

  /** Stops the worker for good when the game screen closes. */
  dispose(): void {
    this.cancel();
    this.worker?.terminate();
    this.worker = null;
  }

  cancel(): void {
    if (this.pending) {
      this.worker?.terminate();
      this.worker = null;
      this.finish(null);
    }
  }
}
