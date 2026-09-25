import { PIECE_VALUE } from '../engine';
import type { CreatureId } from '../ai/creatures';
import { creatureById } from '../ai/creatures';
import type { Match } from './match';

export interface ScorePart {
  /** Dutch label for the result screen. */
  label: string;
  points: number;
}

export interface Score {
  total: number;
  parts: ScorePart[];
}

/** Points for beating each creature (level × 100). */
export function winPoints(creature: CreatureId): number {
  return creatureById(creature).level * 100;
}

/**
 * Old school points for one finished game (owner request: hall of fame).
 * Win: creature points, +100 for checkmate, speed bonus, 50 per unused oops, 10 per captured point.
 * Draw: half the creature points plus captures. Loss: captures only, so every game counts.
 */
export function scoreGame(match: Match): Score {
  const result = match.result;
  if (!result) return { total: 0, parts: [] };
  const childMoves = match.game.moves.filter((m) => m.color === 'w');
  const captured = childMoves.reduce((sum, m) => sum + (m.captured ? PIECE_VALUE[m.captured] : 0), 0);
  const parts: ScorePart[] = [];
  const base = winPoints(match.creature);
  if (result.kind === 'win') {
    parts.push({ label: `${creatureById(match.creature).name} verslagen`, points: base });
    if (result.reason === 'checkmate') parts.push({ label: 'Schaakmat', points: 100 });
    const speed = Math.max(0, 40 - childMoves.length) * 10;
    if (speed) parts.push({ label: 'Snel gewonnen', points: speed });
    if (match.credits) parts.push({ label: 'Oeps bewaard', points: match.credits * 50 });
  } else if (result.kind === 'draw') {
    parts.push({ label: 'Gelijkspel', points: Math.round(base / 2) });
  }
  if (captured) parts.push({ label: 'Stukken geslagen', points: captured * 10 });
  return { total: parts.reduce((s, p) => s + p.points, 0), parts };
}
