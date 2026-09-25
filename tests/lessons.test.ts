import { describe, expect, it } from 'vitest';
import { CHAPTERS } from '../src/game/lessons';
import { Game, parseFen, parseSquare, standardRules } from '../src/engine';

// Every lesson page must show correct chess: arrows that are moves must be legal,
// threat arrows must be real attacks, and promised results (check, mate, stalemate) must happen.
describe('lessons are correct chess', () => {
  for (const chapter of CHAPTERS) {
    for (const page of chapter.pages) {
      it(`${chapter.title}: ${page.title}`, () => {
        const pos = parseFen(page.fen);
        const moves = (page.arrows ?? []).filter((a) => a.kind === 'move');
        for (const a of moves) expect(new Game(page.fen).findMove(a.from + a.to), `${a.from}${a.to}`).toBeDefined();
        for (const a of (page.arrows ?? []).filter((x) => x.kind === 'threat')) {
          const from = parseSquare(a.from);
          const piece = pos.board[from];
          expect(piece, a.from).toBeTruthy();
          const hits = standardRules.pseudoMoves({ ...pos, turn: piece!.color, ep: null }).some((m) => m.from === from && m.to === parseSquare(a.to));
          expect(hits, `${a.from} attacks ${a.to}`).toBe(true);
        }
        if (page.dotsFrom) expect(pos.board[parseSquare(page.dotsFrom)]).toBeTruthy();
        if (page.expect) {
          const g = new Game(page.fen);
          g.play(moves[0].from + moves[0].to);
          if (page.expect === 'check') {
            expect(g.inCheck()).toBe(true);
            expect(g.status()).toBe('playing');
          } else {
            expect(g.status()).toBe(page.expect);
          }
        }
      });
    }
  }

  it('the stalemate warning really is stalemate', () => {
    const g = new Game('7k/8/5K2/8/8/8/8/6Q1 w - - 0 1');
    g.play('g1g6');
    expect(g.status()).toBe('stalemate');
  });

  it('the fork really wins the rook', () => {
    const g = new Game('r3k3/8/8/1N6/8/8/8/4K3 w - - 0 1');
    g.play('b5c7');
    for (const reply of g.legalMoves()) {
      const next = new Game('r3k3/8/8/1N6/8/8/8/4K3 w - - 0 1');
      next.play('b5c7');
      next.play(reply);
      if (next.position.board[parseSquare('c7')]?.type === 'n') expect(next.findMove('c7a8')).toBeDefined();
    }
  });
});
