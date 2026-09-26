import { describe, expect, it } from 'vitest';
import { CREATURES } from '../src/ai/creatures';
import { playBotGame } from './helpers/bot';
import type { CreatureId } from '../src/ai/creatures';

function botWins(creature: CreatureId, games: number) {
  let wins = 0;
  const reasons: Record<string, number> = {};
  for (let i = 1; i <= games; i++) {
    const r = playBotGame(creature, i);
    const key = r ? `${r.kind}:${r.reason}` : 'capped';
    reasons[key] = (reasons[key] ?? 0) + 1;
    if (r?.kind === 'win') wins++;
  }
  return { wins, reasons };
}

describe('AC-14 easy creatures lose to the scripted bot', () => {
  it('Level 1 Wobble loses at least 80 of 100', () => {
    const { wins, reasons } = botWins('wobble', 100);
    console.log('wobble', wins, reasons);
    expect(wins).toBeGreaterThanOrEqual(80);
  }, 600_000);

  it('Level 2 Clucky loses at least 70 of 100', () => {
    const { wins, reasons } = botWins('clucky', 100);
    console.log('clucky', wins, reasons);
    expect(wins).toBeGreaterThanOrEqual(70);
  }, 600_000);
});

describe('Copper Bot is a fair 3 star challenge (owner: it was too strong)', () => {
  it('a careful kid wins at least 30 percent, and the random bot rarely beats Copper Bot', async () => {
    const { playKidGame, playBotGame: bot } = await import('./helpers/bot');
    let kidWins = 0;
    for (let i = 1; i <= 40; i++) if (playKidGame('copper', i)?.kind === 'win') kidWins++;
    // Still clearly stronger than Wobble and Clucky, who lose almost every game to the random bot.
    let botWins = 0;
    for (let i = 1; i <= 20; i++) if (bot('copper', i)?.kind === 'win') botWins++;
    console.log('careful kid wins', kidWins, '/40; random bot beats copper', botWins, '/20');
    expect(kidWins).toBeGreaterThanOrEqual(12);
    expect(botWins).toBeLessThanOrEqual(5);
  }, 900_000);
});

describe('the new creatures (owner: 4 very easy, 4 a bit smarter)', () => {
  const easy = CREATURES.filter((c) => c.stars === 1 && !['wobble', 'clucky'].includes(c.id));
  for (const c of easy) {
    it(`${c.name} (1 star) loses at least 80 percent to the scripted bot`, () => {
      let wins = 0;
      for (let i = 1; i <= 30; i++) if (playBotGame(c.id, i)?.kind === 'win') wins++;
      expect(wins).toBeGreaterThanOrEqual(24);
    }, 600_000);
  }

  it('careful kid win rates follow the stars: 2 star creatures are easier than 3 star ones', async () => {
    const { playKidGame } = await import('./helpers/bot');
    const rate = (id: CreatureId) => {
      let w = 0;
      for (let i = 1; i <= 16; i++) if (playKidGame(id, i)?.kind === 'win') w++;
      return w / 16;
    };
    const two = ['knor', 'stip'].map((id) => rate(id as CreatureId));
    const three = ['ijzer', 'kristal'].map((id) => rate(id as CreatureId));
    console.log('careful kid win rate 2 stars', two, '3 stars', three);
    for (const r of [...two, ...three]) expect(r).toBeGreaterThanOrEqual(0.2);
    expect(Math.min(...two)).toBeGreaterThan(Math.max(...three));
  }, 900_000);
});
