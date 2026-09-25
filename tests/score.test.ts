import { describe, expect, it } from 'vitest';
import { Match } from '../src/game/match';
import { scoreGame } from '../src/game/score';
import { addToHall, loadHall, qualifies, saveHall, type HallEntry, type KeyValue } from '../src/game/hallOfFame';

describe('score', () => {
  it('a quick checkmate against Wobble with no oops used', () => {
    const m = new Match('wobble', '6k1/5ppp/8/8/8/8/5PPP/R5K1 w - - 0 1');
    m.playChild('a1a8');
    const s = scoreGame(m);
    // 100 win + 100 checkmate + 39 * 10 speed + 2 * 50 oops
    expect(s.total).toBe(100 + 100 + 390 + 100);
  });

  it('Copper Bot is worth more than Wobble', () => {
    const w = new Match('wobble', '6k1/5ppp/8/8/8/8/5PPP/R5K1 w - - 0 1');
    w.playChild('a1a8');
    const c = new Match('copper', '6k1/5ppp/8/8/8/8/5PPP/R5K1 w - - 0 1');
    c.playChild('a1a8');
    expect(scoreGame(c).total - scoreGame(w).total).toBe(400);
  });

  it('a resignation win has no checkmate bonus, captures count', () => {
    const m = new Match('wobble', '4k3/8/8/8/8/8/PPPPPPPP/RNBQKBNR w KQ - 0 1');
    m.resign();
    const s = scoreGame(m);
    expect(s.parts.find((p) => p.label === 'Schaakmat')).toBeUndefined();
    expect(s.total).toBe(100 + 400 + 100);
  });

  it('a loss still scores the captured pieces', () => {
    const m = new Match('copper', 'r5k1/5ppp/8/8/8/N7/5PPP/6K1 w - - 0 1');
    m.credits = 0;
    m.playChild('a3b5');
    m.playCreature('a8a1');
    expect(m.result?.kind).toBe('loss');
    expect(scoreGame(m).total).toBe(0);
  });
});

describe('hall of fame', () => {
  const entry = (score: number, name = 'AAA'): HallEntry => ({ name, score, creature: 'wobble', date: '2026-09-25' });

  it('keeps the top 10 in score order, ties keep the older score first', () => {
    let hall: HallEntry[] = [];
    for (const s of [50, 300, 100, 300, 20, 90, 80, 70, 60, 40]) hall = addToHall(entry(s), hall).hall;
    expect(hall.map((e) => e.score)).toEqual([300, 300, 100, 90, 80, 70, 60, 50, 40, 20]);
    expect(qualifies(10, hall)).toBe(false);
    const { hall: next, place } = addToHall(entry(95, 'NEW'), hall);
    expect(place).toBe(3);
    expect(next).toHaveLength(10);
    expect(next.at(-1)!.score).toBe(40);
  });

  it('survives broken or missing storage', () => {
    const mem = new Map<string, string>();
    const store: KeyValue = { getItem: (k) => mem.get(k) ?? null, setItem: (k, v) => void mem.set(k, v) };
    saveHall([entry(10)], store);
    expect(loadHall(store)).toHaveLength(1);
    mem.set('minechess.hallOfFame.v1', '{not json');
    expect(loadHall(store)).toEqual([]);
    expect(loadHall(null)).toEqual([]);
  });
});
