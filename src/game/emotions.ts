import type { GameStatus, Move } from '../engine';
import { PIECE_VALUE } from '../engine';

export type Emotion =
  | 'idle' | 'thinking' | 'happy' | 'sad' | 'sadShort' | 'sadResign'
  | 'celebrating' | 'goodSport' | 'worried' | 'surprised';

/** Emotions that are not drawn yet in v0.1 and their stand in (PRD 6.1). */
const V01_FALLBACK: Partial<Record<Emotion, Emotion>> = { worried: 'sadShort', surprised: 'sadShort' };

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

export function displayEmotion(e: Emotion): Emotion {
  return V01_FALLBACK[e] ?? e;
}
