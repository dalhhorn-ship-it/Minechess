import type { Color, Move, Position } from '../engine';
import { PIECE_VALUE, fileOf, inCheck, legalMoves, other, rankOf, standardRules } from '../engine';

const MATE = 100000;

/** Static evaluation in centipawns from `color`'s point of view. */
export function evaluate(pos: Position, color: Color): number {
  let score = 0;
  for (let sq = 0; sq < 64; sq++) {
    const p = pos.board[sq];
    if (!p) continue;
    let v = PIECE_VALUE[p.type] * 100;
    const f = fileOf(sq);
    const r = rankOf(sq);
    const centre = 3.5 - Math.max(Math.abs(f - 3.5), Math.abs(r - 3.5));
    if (p.type === 'n' || p.type === 'b') v += centre * 8;
    if (p.type === 'p') v += (p.color === 'w' ? r - 1 : 6 - r) * 6 + (f >= 2 && f <= 5 ? 4 : 0);
    if (p.type === 'q') v += centre * 2;
    score += p.color === color ? v : -v;
  }
  return score;
}

function orderMoves(moves: Move[]): Move[] {
  const val = (m: Move) => (m.captured ? PIECE_VALUE[m.captured] * 10 - PIECE_VALUE[m.piece] : 0) + (m.promotion ? 80 : 0);
  return moves.slice().sort((a, b) => val(b) - val(a));
}

function quiesce(pos: Position, alpha: number, beta: number, depth: number): number {
  const stand = evaluate(pos, pos.turn);
  if (depth === 0 || stand >= beta) return stand;
  if (stand > alpha) alpha = stand;
  for (const m of orderMoves(legalMoves(pos).filter((x) => x.captured || x.promotion))) {
    const score = -quiesce(standardRules.applyMove(pos, m), -beta, -alpha, depth - 1);
    if (score >= beta) return score;
    if (score > alpha) alpha = score;
  }
  return alpha;
}

export function negamax(pos: Position, depth: number, alpha: number, beta: number, ply = 0, qdepth = 4): number {
  const moves = legalMoves(pos);
  if (!moves.length) return inCheck(pos) ? -MATE + ply : 0;
  if (pos.halfmove >= 100) return 0;
  if (depth === 0) return quiesce(pos, alpha, beta, qdepth);
  let best = -Infinity;
  for (const m of orderMoves(moves)) {
    const score = -negamax(standardRules.applyMove(pos, m), depth - 1, -beta, -alpha, ply + 1, qdepth);
    if (score > best) best = score;
    if (score > alpha) alpha = score;
    if (alpha >= beta) break;
  }
  return best;
}

/** Scores every legal move for the side to move (higher is better for the mover). */
export function scoreMoves(pos: Position, depth: number, qdepth = 4): { move: Move; score: number }[] {
  return orderMoves(legalMoves(pos)).map((move) => ({
    move,
    score: -negamax(standardRules.applyMove(pos, move), depth - 1, -Infinity, Infinity, 1, qdepth),
  }));
}

export { MATE, other };
