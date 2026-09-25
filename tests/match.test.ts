import { describe, expect, it } from 'vitest';
import { Game, positionKey, parseFen, toFen } from '../src/engine';
import { Match } from '../src/game/match';
import { displayEmotion } from '../src/game/emotions';
import { allowsStalemate, chooseMove, isKingApproach } from '../src/ai/choose';

describe('rules and draws', () => {
  it('AC-44 child plays light and moves first', () => {
    const m = new Match('wobble');
    expect(m.game.turn).toBe('w');
    expect(m.childToMove).toBe(true);
  });

  it('AC-05 checkmate and stalemate', () => {
    const mate = new Game('6k1/5ppp/8/8/8/8/5PPP/R5K1 w - - 0 1');
    mate.play('a1a8');
    expect(mate.status()).toBe('checkmate');
    const stale = new Game('7k/8/5K2/8/8/8/8/6Q1 w - - 0 1');
    stale.play('g1g6');
    expect(stale.status()).toBe('stalemate');
  });

  it('AC-06 insufficient material, fifty moves, threefold repetition', () => {
    expect(new Game('8/8/4k3/8/8/3BK3/8/8 w - - 0 1').status()).toBe('material');
    expect(new Game('8/8/4k3/8/8/3NK3/8/8 w - - 0 1').status()).toBe('material');
    expect(new Game('8/8/4k3/8/8/3NK3/3N4/8 w - - 0 1').status()).toBe('playing');
    const fifty = new Game('8/8/4k3/8/8/4K3/8/R7 w - - 99 80');
    fifty.play('a1a2');
    expect(fifty.status()).toBe('fifty');
    const rep = new Game();
    for (const mv of ['g1f3', 'g8f6', 'f3g1', 'f6g8', 'g1f3', 'g8f6', 'f3g1']) rep.play(mv);
    expect(rep.status()).toBe('playing');
    rep.play('f6g8');
    expect(rep.status()).toBe('repetition');
  });

  it('AC-02 castling through check is not offered', () => {
    const g = new Game('4k3/8/8/8/8/8/5r2/4K2R w K - 0 1');
    expect(g.findMove('e1g1')).toBeUndefined();
    const ok = new Game('4k3/8/8/8/8/8/8/4K2R w K - 0 1');
    ok.play('e1g1');
    expect(ok.position.board[5]?.type).toBe('r');
  });

  it('AC-03 en passant only right after the double step', () => {
    const g = new Game('4k3/3p4/8/4P3/8/8/8/4K3 b - - 0 1');
    g.play('d7d5');
    expect(g.findMove('e5d6')?.flag).toBe('ep');
    g.play('e1e2');
    g.play('e8e7');
    expect(g.findMove('e5d6')).toBeUndefined();
  });
});

describe('oops credits', () => {
  it('AC-40/41/66 undo one move pair and restore the exact state', () => {
    const m = new Match('wobble');
    expect(m.canOops()).toBe(false);
    const before = toFen(m.game.position);
    const keys = [...m.game.history];
    m.playChild('e2e4');
    m.playCreature('e7e5');
    m.oops();
    expect(toFen(m.game.position)).toBe(before);
    expect([...m.game.history]).toEqual(keys);
    expect(m.credits).toBe(1);
  });

  it('AC-65 oops while the creature is thinking takes back only the child move', () => {
    const m = new Match('copper');
    m.playChild('e2e4');
    m.oops();
    expect(m.game.moves.length).toBe(0);
    expect(m.childToMove).toBe(true);
  });

  it('AC-64 a checkmate against the child is held while credits remain', () => {
    const m = new Match('copper', 'r5k1/5ppp/8/8/8/N7/5PPP/6K1 w - - 0 1');
    m.playChild('a3b5');
    const out = m.playCreature('a8a1');
    expect(out.held).toBe(true);
    expect(m.result).toBeNull();
    m.oops();
    expect(m.childToMove).toBe(true);
    m.playChild('a3b5');
    m.playCreature('a8a1');
    m.oops();
    m.playChild('a3b5');
    const last = m.playCreature('a8a1');
    expect(last.held).toBe(false);
    expect(m.result).toEqual({ kind: 'loss', reason: 'checkmate' });
    expect(m.canOops()).toBe(false);
  });

  it('AC-42 the child\'s win cannot be undone', () => {
    const m = new Match('wobble', '6k1/5ppp/8/8/8/8/5PPP/R5K1 w - - 0 1');
    m.playChild('a1a8');
    expect(m.result?.kind).toBe('win');
    expect(m.canOops()).toBe(false);
  });
});

describe('easy creatures', () => {
  it('AC-54 resign after 3 own moves down 9 or more, restored by oops', () => {
    const m = new Match('wobble', '4k3/8/8/8/8/8/PPPPPPPP/RNBQKBNR w KQ - 0 1');
    const reply = () => chooseMove({ fen: toFen(m.game.position), history: [...m.game.history], creature: 'wobble', seed: 1 });
    for (const mv of ['a2a3', 'b2b3', 'c2c3']) {
      m.playChild(mv);
      expect(m.shouldResign()).toBe(false);
      m.playCreature(toUci(reply()));
    }
    expect(m.resignStreak).toBe(3);
    // Undoing a full move pair restores the streak from before the creature's reply.
    m.oops();
    expect(m.resignStreak).toBe(2);
    m.playChild('c2c3');
    m.playCreature(toUci(reply()));
    m.playChild('d2d3');
    expect(m.shouldResign()).toBe(true);
  });

  it('Copper Bot never resigns', () => {
    const m = new Match('copper', '4k3/8/8/8/8/8/PPPPPPPP/RNBQKBNR w KQ - 0 1');
    for (const mv of ['a2a3', 'b2b3', 'c2c3']) {
      m.playChild(mv);
      m.playCreature(toUci(chooseMove({ fen: toFen(m.game.position), history: [...m.game.history], creature: 'copper', seed: 2 })));
    }
    m.playChild('d2d3');
    expect(m.shouldResign()).toBe(false);
  });

  it('AC-51 a losing easy creature avoids moves that allow stalemate', () => {
    // Black king h8, pawn h7 blocked. Kg8 lets White stalemate with Qe7? Check every seed never picks a stalemating line.
    const fen = '7k/7p/7P/8/8/8/1Q6/6K1 b - - 0 1';
    const pos = parseFen(fen);
    for (let seed = 0; seed < 30; seed++) {
      const mv = chooseMove({ fen, history: [positionKey(pos)], creature: 'wobble', seed });
      const alternatives = new Game(fen).legalMoves().filter((m) => !allowsStalemate(pos, m));
      if (alternatives.length) expect(allowsStalemate(pos, mv)).toBe(false);
    }
  });

  it('AC-53 a losing easy creature walks its king toward the child in at least half its moves', () => {
    const fen = '8/8/8/8/3k4/8/8/R3K3 b - - 0 1';
    const pos = parseFen(fen);
    let approach = 0;
    for (let seed = 0; seed < 40; seed++) {
      const mv = chooseMove({ fen, history: [positionKey(pos)], creature: 'clucky', seed });
      if (isKingApproach(pos, mv)) approach++;
    }
    expect(approach).toBeGreaterThanOrEqual(20);
  });
});

describe('AC-18 one emotion per half move, by priority', () => {
  const emo = (fen: string, uci: string, mover: 'child' | 'creature') => {
    const m = new Match('wobble', fen);
    if (mover === 'creature') {
      return displayEmotion(m.playCreature(uci).emotion);
    }
    return displayEmotion(m.playChild(uci).emotion);
  };
  it('child moves', () => {
    expect(emo('4k3/8/8/8/8/8/8/R3K3 w - - 0 1', 'a1a8', 'child')).toBe('sadShort'); // check: worried
    expect(emo('4k3/8/8/8/r7/8/8/R3K3 w - - 0 1', 'a1a4', 'child')).toBe('sadShort'); // takes rook: surprised
    expect(emo('4k3/8/8/8/n7/8/8/R3K3 w - - 0 1', 'a1a4', 'child')).toBe('sadShort'); // other capture: worried
    expect(emo('4k3/8/8/8/8/8/8/R3K3 w - - 0 1', 'a1a2', 'child')).toBe('idle');
    expect(emo('6k1/5ppp/8/8/8/8/5PPP/R5K1 w - - 0 1', 'a1a8', 'child')).toBe('sad');
  });
  it('creature moves', () => {
    expect(emo('r3k3/8/8/8/8/8/8/4K3 b - - 0 1', 'a8a1', 'creature')).toBe('happy');
    expect(emo('r3k3/8/8/8/8/8/8/N3K3 b - - 0 1', 'a8a1', 'creature')).toBe('happy');
    expect(emo('r3k3/8/8/8/8/8/8/4K3 b - - 0 1', 'a8a2', 'creature')).toBe('idle');
    expect(emo('7k/8/8/3q4/8/8/8/K7 b - - 0 1', 'h8g8', 'creature')).toBe('idle');
  });
});

function toUci(m: { from: number; to: number; promotion?: string }) {
  const n = (s: number) => 'abcdefgh'[s & 7] + ((s >> 3) + 1);
  return n(m.from) + n(m.to) + (m.promotion ?? '');
}
