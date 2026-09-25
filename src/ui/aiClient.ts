import type { CreatureId } from '../ai/creatures';

/** Runs the creature's search in a Web Worker so the screen never freezes. Cancel restarts the worker (AC-65). */
export class AiClient {
  private worker: Worker | null = null;
  private seq = 0;
  private pending: ((uci: string | null) => void) | null = null;

  private ensure(): Worker {
    if (!this.worker) {
      this.worker = new Worker(new URL('../ai/worker.ts', import.meta.url), { type: 'module' });
      this.worker.onmessage = (e: MessageEvent<{ id: number; uci: string }>) => {
        if (e.data.id !== this.seq || !this.pending) return;
        const done = this.pending;
        this.pending = null;
        done(e.data.uci);
      };
    }
    return this.worker;
  }

  /** Resolves with the move, or null when cancelled. */
  choose(fen: string, history: string[], creature: CreatureId): Promise<string | null> {
    this.cancel();
    const id = ++this.seq;
    return new Promise((resolve) => {
      this.pending = resolve;
      this.ensure().postMessage({ id, fen, history, creature, seed: Math.floor(Math.random() * 2 ** 31) });
    });
  }

  cancel(): void {
    if (this.pending) {
      this.worker?.terminate();
      this.worker = null;
      const done = this.pending;
      this.pending = null;
      done(null);
    }
  }
}
