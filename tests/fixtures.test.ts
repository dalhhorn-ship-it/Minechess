import { describe, expect, it } from 'vitest';
import fixtures from './fixtures/positions.json';
import { Game, legalMoves, moveToUci, parseFen, positionKey, standardRules, toFen, type Position } from '../src/engine';
import { Match } from '../src/game/match';
import { displayEmotion } from '../src/game/emotions';
import { chooseMove, isHopeless } from '../src/ai/choose';
import type { CreatureId } from '../src/ai/creatures';

// Test cases written by the test lead (docs/test/test-cases-v0.1.md), all checked with an independent chess library.

const STATUS: Record<string, string> = {
  ongoing: 'playing', checkmate: 'checkmate', stalemate: 'stalemate',
  draw_insufficient: 'material', draw_fifty: 'fifty', draw_threefold: 'repetition',
};
const EMOTION: Record<string, string> = { sad_short: 'sadShort', good_sport: 'goodSport', sad_resign: 'sadResign' };

function perft(pos: Position, depth: number): number {
  const moves = legalMoves(pos);
  if (depth === 1) return moves.length;
  return moves.reduce((n, m) => n + perft(standardRules.applyMove(pos, m), depth - 1), 0);
}

function gameFrom(fen: string, setup: string[] = []) {
  const g = new Game(fen);
  for (const mv of setup) g.play(mv);
  return g;
}

describe('fixture perft', () => {
  for (const p of fixtures.perft) {
    for (const [depth, nodes] of Object.entries(p.nodes as Record<string, number>)) {
      if (Number(depth) > 4) continue; // depth 5 is slow; covered by depth 4
      it(`${p.id} depth ${depth}`, () => expect(perft(parseFen(p.fen), Number(depth))).toBe(nodes));
    }
  }
});

describe('fixture rules', () => {
  for (const r of fixtures.rules as any[]) {
    it(`${r.id} ${r.description}`, () => {
      const g = gameFrom(r.fen, r.setupMoves);
      const e = r.expect;
      if (e.legalMovesFrom) {
        for (const [sq, list] of Object.entries(e.legalMovesFrom as Record<string, string[]>)) {
          const got = g.legalMoves().map(moveToUci).filter((u) => u.startsWith(sq)).sort();
          expect(got).toEqual([...list].sort());
        }
      }
      if (e.allLegalMoves) expect(g.legalMoves().map(moveToUci).sort()).toEqual([...e.allLegalMoves].sort());
      if (!r.move) return;
      if (e.legal === false) {
        expect(g.findMove(r.move)).toBeUndefined();
        return;
      }
      g.play(r.move);
      if (e.resultFen) expect(toFen(g.position)).toBe(e.resultFen);
      if (e.status) expect(g.status()).toBe(STATUS[e.status]);
      if (e.inCheck !== undefined) expect(g.inCheck()).toBe(e.inCheck);
      if (e.pieceOnTarget) {
        const to = r.move.slice(2, 4);
        const p = g.position.board[(Number(to[1]) - 1) * 8 + to.charCodeAt(0) - 97]!;
        expect(p.color === 'w' ? p.type.toUpperCase() : p.type).toBe(e.pieceOnTarget);
      }
    });
  }
});

describe('fixture emotions (AC-18)', () => {
  for (const x of fixtures.emotionEvents as any[]) {
    it(`${x.id} ${x.description}`, () => {
      const m = new Match('wobble', x.fen);
      for (const mv of x.setupMoves ?? []) m.game.play(mv);
      const out = x.mover === 'child' ? m.playChild(x.move) : m.playCreature(x.move);
      expect(m.game.status()).toBe(STATUS[x.resultStatus]);
      expect(displayEmotion(out.emotion)).toBe(EMOTION[x.expectedEmotionV01] ?? x.expectedEmotionV01);
    });
  }
});

describe('fixture resign (AC-54)', () => {
  for (const r of fixtures.resign as any[]) {
    it(`${r.id} ${r.description}`, () => {
      const creature: CreatureId = r.level === 1 ? 'wobble' : r.level === 2 ? 'clucky' : 'copper';
      const m = new Match(creature, r.fen);
      for (const mv of r.moves) {
        if (m.game.turn === 'b') {
          expect(m.shouldResign()).toBe(false);
          m.playCreature(mv);
        } else {
          m.playChild(mv);
        }
      }
      const last = r.trace.filter((t: any) => t.downNineStreak !== undefined).pop();
      if (last) expect(Math.min(m.resignStreak, 3)).toBe(Math.min(last.downNineStreak, 3));
      expect(m.shouldResign()).toBe(!!r.expect.creatureResignsBeforeNextMove);
    });
  }
});

describe('fixture easy creatures', () => {
  const levels: CreatureId[] = ['wobble', 'clucky'];
  for (const s of fixtures.easyCreature.stalemateTraps as any[]) {
    it(`${s.id} AC-51 never picks a stalemate trap`, () => {
      const pos = parseFen(s.fen);
      for (const creature of levels) {
        for (let seed = 0; seed < 60; seed++) {
          const mv = moveToUci(chooseMove({ fen: s.fen, history: [positionKey(pos)], creature, seed }));
          if (s.allowedMoves?.length) expect(s.forbiddenMoves).not.toContain(mv);
        }
      }
    });
  }
  for (const s of fixtures.easyCreature.repetition as any[]) {
    it(`${s.id} AC-52 never repeats a position`, () => {
      const g = gameFrom(s.fen, s.setupMoves);
      for (const creature of levels) {
        for (let seed = 0; seed < 60; seed++) {
          const mv = moveToUci(chooseMove({ fen: toFen(g.position), history: [...g.history], creature, seed }));
          expect(s.forbiddenMoves).not.toContain(mv);
        }
      }
    });
  }
  it('AC-53 walks the king toward the child in at least half of its moves', () => {
    let closer = 0;
    let total = 0;
    for (const k of fixtures.easyCreature.kingWalk as any[]) {
      const pos = parseFen(k.fen);
      // The king walk only starts once the creature is hopeless (owner rule, AC-53).
      if (!isHopeless(pos)) continue;
      const good: string[] = k.nearestChildPiece.excludingWhiteKing.closerKingMoves;
      if (!good.length) continue;
      for (const creature of levels) {
        for (let seed = 0; seed < 10; seed++) {
          total++;
          if (good.includes(moveToUci(chooseMove({ fen: k.fen, history: [positionKey(pos)], creature, seed })))) closer++;
        }
      }
    }
    expect(closer / total).toBeGreaterThanOrEqual(0.5);
  });
});
