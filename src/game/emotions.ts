import type { GameStatus, Move } from '../engine';
import { PIECE_VALUE } from '../engine';

export type Emotion =
  | 'idle' | 'thinking' | 'happy' | 'sad' | 'sadShort' | 'sadResign'
  | 'celebrating' | 'goodSport' | 'worried' | 'surprised' | 'crying' | 'laughing';

/** Chance that a creature cries instead of looking surprised or sad (owner: "make him cry sometimes"). */
export const CRY_CHANCE = 0.4;

/**
 * Exactly one emotion per half move, by the priority in PRD 6.1:
 * result > check > capture worth 5 or more > other capture > nothing.
 */
export function emotionFor(move: Move, mover: 'child' | 'creature', status: GameStatus, givesCheck: boolean): Emotion {
  const big = move.captured ? PIECE_VALUE[move.captured] >= 5 : false;
  if (status !== 'playing') {
    if (status === 'checkmate') return mover === 'child' ? 'sad' : 'celebrating';
    return 'goodSport';
  }
  if (mover === 'child') {
    if (givesCheck) return 'worried';
    if (big) return 'surprised';
    if (move.captured) return 'worried';
    return 'idle';
  }
  return givesCheck || move.captured ? 'happy' : 'idle';
}

/** Kept for callers from v0.1; all emotions are drawn now, so nothing is replaced. */
export function displayEmotion(e: Emotion): Emotion {
  return e;
}

/**
 * Adds variety on top of the PRD 6.1 table, still one emotion per half move:
 * the creature laughs (at its own luck) when it takes a big piece, and sometimes
 * cries when the child takes a big piece or when it loses the game.
 */
export function enrich(e: Emotion, move: Move, mover: 'child' | 'creature', rand: number): Emotion {
  const big = move.captured ? PIECE_VALUE[move.captured] >= 5 : false;
  if (mover === 'creature' && e === 'happy' && big) return 'laughing';
  if (mover === 'child' && (e === 'surprised' || e === 'sad') && rand < CRY_CHANCE) return 'crying';
  return e;
}
