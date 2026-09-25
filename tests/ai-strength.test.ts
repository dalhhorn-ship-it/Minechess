import { describe, expect, it } from 'vitest';
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
