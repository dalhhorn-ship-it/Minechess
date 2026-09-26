import type { Color, Move, Position, Square } from '../engine';
import {
  PIECE_VALUE, fileOf, inCheck, insufficientMaterial, isAttacked, legalMoves, materialBalance, moveToUci, other,
  parseFen, positionKey, rankOf, standardRules,
} from '../engine';
import type { CreatureId } from './creatures';
import { creatureById } from './creatures';
import { makeRng, pick, weightedPick, type Rng } from './rng';
import { scoreMoves } from './search';

export interface ChooseRequest {
  fen: string;
  /** Position keys of the game so far, including the current one. */
  history: string[];
  creature: CreatureId;
  seed: number;
  /** Square the creature's own last move went to (Snurk keeps shuffling that piece). */
  lastTo?: number | null;
}

/** "Clearly losing" for the easy creatures: down 5 or more points (PRD 5). */
export const HELP_THRESHOLD = 5;

export function isClearlyLosing(pos: Position): boolean {
  return materialBalance(pos, pos.turn) <= -HELP_THRESHOLD;
}

/** Deficit that, together with having only king and pawns left, counts as hopeless. */
export const HOPELESS_DEFICIT = 9;

/**
 * Hopeless: `color` has nothing left but its king and pawns, and is 9 or more points
 * behind. Only then do the easy creatures walk their king out or resign, so they never
 * give up just because they lost a few pieces (owner decision).
 */
export function isHopeless(pos: Position, color: Color = pos.turn): boolean {
  const onlyKingAndPawns = pos.board.every((p) => !p || p.color !== color || p.type === 'k' || p.type === 'p');
  return onlyKingAndPawns && materialBalance(pos, color) <= -HOPELESS_DEFICIT;
}

/** True when the opponent has a reply after `move` that leaves us stalemated. */
export function allowsStalemate(pos: Position, move: Move): boolean {
  const after = standardRules.applyMove(pos, move);
  for (const reply of legalMoves(after)) {
    const next = standardRules.applyMove(after, reply);
    if (!inCheck(next) && legalMoves(next).length === 0) return true;
  }
  return false;
}

function distance(a: Square, b: Square): number {
  return Math.max(Math.abs(fileOf(a) - fileOf(b)), Math.abs(rankOf(a) - rankOf(b)));
}

function nearestEnemyDistance(pos: Position, from: Square, enemy: 'w' | 'b'): number {
  let best = Infinity;
  pos.board.forEach((p, sq) => {
    if (p && p.color === enemy && p.type !== 'k') best = Math.min(best, distance(from, sq));
  });
  return best;
}

/** Moves the king toward the child's pieces (AC-53). */
export function isKingApproach(pos: Position, move: Move): boolean {
  if (move.piece !== 'k' || move.flag !== 'normal') return false;
  const enemy = other(pos.turn);
  return nearestEnemyDistance(pos, move.to, enemy) < nearestEnemyDistance(pos, move.from, enemy);
}

/**
 * Easy creature help (AC-51, AC-52): when clearly losing, drop moves that allow a
 * stalemating reply or repeat an earlier position, as long as something else remains.
 */
export function helpfulCandidates(pos: Position, moves: Move[], history: string[]): Move[] {
  let out = moves.filter((m) => !allowsStalemate(pos, m));
  if (!out.length) out = moves;
  const seen = new Set(history);
  const fresh = out.filter((m) => !seen.has(positionKey(standardRules.applyMove(pos, m))));
  return fresh.length ? fresh : out;
}

function wobble(pos: Position, moves: Move[], rng: Rng): Move {
  // Random, with a light preference for captures (PRD 5 style "Random").
  return weightedPick(moves, moves.map((m) => (m.captured ? 3 : 1)), rng);
}

function clucky(pos: Position, moves: Move[], rng: Rng): Move {
  // Panicky defender: runs threatened pieces away even when that is bad, and almost never attacks.
  const them = other(pos.turn);
  const scored = moves.map((m) => {
    let s = rng() * 3;
    if (isAttacked(pos, m.from, them)) s += 2.5;
    if (m.captured) s -= 1.5;
    return { m, s };
  });
  scored.sort((a, b) => b.s - a.s);
  return scored[0].m;
}

/** True when `move` leaves the opponent without legal moves while not in check. */
export function stalematesOpponent(pos: Position, move: Move): boolean {
  const after = standardRules.applyMove(pos, move);
  return !inCheck(after) && legalMoves(after).length === 0;
}

function copperBot(pos: Position, moves: Move[], rng: Rng): Move {
  // Curious: a shallow search (one move plus the obvious recapture), likes poking at child
  // pieces, is often too distracted to notice a free piece, and makes clear mistakes.
  // Tuned down after the owner found it too strong for the kids.
  const them = other(pos.turn);
  const distracted = rng() < 0.3;
  const careful = rng() < 0.8;
  const scored = scoreMoves(pos, 1, careful ? 1 : 0).map(({ move, score }) => {
    const after = standardRules.applyMove(pos, move);
    const target = after.board[move.to];
    let poke = 0;
    if (!move.captured && target) {
      for (let sq = 0; sq < 64; sq++) {
        const p = after.board[sq];
        if (p?.color !== them || p.type === 'k') continue;
        if (!isAttacked(pos, sq, pos.turn) && isAttacked(after, sq, pos.turn)) poke = 150;
      }
    }
    const missed = distracted && move.captured ? -PIECE_VALUE[move.captured] * 100 : 0;
    return { move, score: score + poke + missed + rng() * 120 };
  });
  scored.sort((a, b) => b.score - a.score);
  if (rng() < 0.25 && scored.length > 2) {
    // A clear mistake: any of the top six that does not drop a lot of material outright.
    const ok = scored.slice(0, 6).filter((s) => s.score > scored[0].score - 400);
    return pick(ok, rng).move;
  }
  return scored[0].move;
}

/** Sleepy: dozes off and keeps shuffling the same piece, hardly ever takes anything. */
function snurk(pos: Position, moves: Move[], rng: Rng, lastTo: Square | null): Move {
  if (lastTo !== null && rng() < 0.6) {
    const same = moves.filter((m) => m.from === lastTo && !m.captured);
    if (same.length) return pick(same, rng);
  }
  return weightedPick(moves, moves.map((m) => (m.captured ? 0.3 : 1)), rng);
}

/** Jumpy: loves knight jumps and long hops, the rest is luck. */
function plons(pos: Position, moves: Move[], rng: Rng): Move {
  const hop = (m: Move) => Math.max(Math.abs(fileOf(m.from) - fileOf(m.to)), Math.abs(rankOf(m.from) - rankOf(m.to)));
  return weightedPick(moves, moves.map((m) => (m.piece === 'n' ? 5 : 1) + hop(m) * 0.5), rng);
}

/** Reckless: always grabs the biggest piece it can, even into a trap, otherwise charges forward. */
function fizz(pos: Position, moves: Move[], rng: Rng): Move {
  const captures = moves.filter((m) => m.captured);
  if (captures.length && rng() < 0.5) {
    const best = Math.max(...captures.map((m) => PIECE_VALUE[m.captured!]));
    return pick(captures.filter((m) => PIECE_VALUE[m.captured!] === best), rng);
  }
  // Charges forward without looking, happily onto squares where it can be taken.
  if (rng() < 0.4) return pick(moves, rng);
  const them = other(pos.turn);
  const forward = (m: Move) => (pos.turn === 'b' ? rankOf(m.from) - rankOf(m.to) : rankOf(m.to) - rankOf(m.from));
  const danger = (m: Move) => (isAttacked(standardRules.applyMove(pos, m), m.to, them) ? 2 : 1);
  return weightedPick(moves, moves.map((m) => (1 + Math.max(0, forward(m)) * 2) * danger(m)), rng);
}

/** Silly: mostly random, now and then it notices a free piece. */
function muddle(pos: Position, moves: Move[], rng: Rng): Move {
  const them = other(pos.turn);
  if (rng() < 0.3) {
    const free = moves.filter((m) => m.captured && !isAttacked(standardRules.applyMove(pos, m), m.to, them));
    if (free.length) return pick(free, rng);
  }
  return pick(moves, rng);
}

/** Greedy piggy bank: takes the most valuable piece whatever the cost, otherwise a move that keeps the piece safe. */
function knor(pos: Position, moves: Move[], rng: Rng): Move {
  const them = other(pos.turn);
  const captures = moves.filter((m) => m.captured);
  if (captures.length && rng() < 0.9) {
    const best = Math.max(...captures.map((m) => PIECE_VALUE[m.captured!]));
    return pick(captures.filter((m) => PIECE_VALUE[m.captured!] === best), rng);
  }
  const safe = moves.filter((m) => !isAttacked(standardRules.applyMove(pos, m), m.to, them));
  return pick(safe.length && rng() < 0.7 ? safe : moves, rng);
}

/** Aggressive: a one move look with a taste for checks and attacks, and plenty of mistakes. */
function stip(pos: Position, moves: Move[], rng: Rng): Move {
  const them = other(pos.turn);
  const scored = scoreMoves(pos, 1, rng() < 0.5 ? 1 : 0).map(({ move, score }) => {
    const after = standardRules.applyMove(pos, move);
    let bonus = inCheck(after) ? 60 : 0;
    for (let sq = 0; sq < 64; sq++) {
      const p = after.board[sq];
      if (p?.color === them && p.type !== 'k' && isAttacked(after, sq, pos.turn)) bonus += 12;
    }
    return { move, score: score + bonus + rng() * 120 };
  });
  scored.sort((a, b) => b.score - a.score);
  if (rng() < 0.35) return pick(scored.slice(0, 6), rng).move;
  return scored[0].move;
}

/** Defensive guardian: keeps its pieces protected and avoids even trades; makes mistakes now and then. */
function ijzer(pos: Position, moves: Move[], rng: Rng): Move {
  const us = pos.turn;
  const them = other(us);
  const careful = rng() < 0.7;
  const scored = scoreMoves(pos, 1, careful ? 1 : 0).map(({ move, score }) => {
    const after = standardRules.applyMove(pos, move);
    let guard = 0;
    for (let sq = 0; sq < 64; sq++) {
      const p = after.board[sq];
      if (p?.color !== us || p.type === 'k') continue;
      if (isAttacked(after, sq, us)) guard += 8;
      if (isAttacked(after, sq, them) && !isAttacked(after, sq, us)) guard -= 25;
    }
    return { move, score: score + guard + rng() * 100 };
  });
  scored.sort((a, b) => b.score - a.score);
  if (rng() < 0.25) return pick(scored.slice(0, 6).filter((s) => s.score > scored[0].score - 400), rng).move;
  return scored[0].move;
}

/** Patient owl: looks two moves ahead, but still gets distracted sometimes. */
function kristal(pos: Position, moves: Move[], rng: Rng): Move {
  const deep = rng() < 0.3;
  const scored = scoreMoves(pos, deep ? 2 : 1, deep ? 1 : rng() < 0.6 ? 1 : 0).map(({ move, score }) => ({ move, score: score + rng() * 110 }));
  scored.sort((a, b) => b.score - a.score);
  if (rng() < 0.3) return pick(scored.slice(0, 6).filter((s) => s.score > scored[0].score - 400), rng).move;
  return scored[0].move;
}

export function chooseMove(req: ChooseRequest): Move {
  const pos = parseFen(req.fen);
  const rng = makeRng(req.seed);
  let moves = legalMoves(pos);
  if (!moves.length) throw new Error('No legal moves');
  const info = creatureById(req.creature);
  if (info.helpsChildWin) {
    // Friendly creatures never stalemate the child when they have another move,
    // and never take the child's last winning material (no dead drawn endings).
    const noStalemate = moves.filter((m) => !stalematesOpponent(pos, m));
    if (noStalemate.length) moves = noStalemate;
    const keepsWinChances = moves.filter((m) => !insufficientMaterial(standardRules.applyMove(pos, m)));
    if (keepsWinChances.length) moves = keepsWinChances;
  }
  if (info.helpsChildWin && isClearlyLosing(pos)) {
    moves = helpfulCandidates(pos, moves, req.history);
  }
  if (info.helpsChildWin && isHopeless(pos)) {
    const approach = moves.filter((m) => isKingApproach(pos, m));
    if (approach.length && rng() < 0.7) return pick(approach, rng);
  }
  switch (req.creature) {
    case 'wobble':
      return wobble(pos, moves, rng);
    case 'snurk':
      return snurk(pos, moves, rng, req.lastTo ?? null);
    case 'plons':
      return plons(pos, moves, rng);
    case 'clucky':
      return clucky(pos, moves, rng);
    case 'fizz':
      return fizz(pos, moves, rng);
    case 'muddle':
      return muddle(pos, moves, rng);
    case 'knor':
      return knor(pos, moves, rng);
    case 'stip':
      return stip(pos, moves, rng);
    case 'copper':
      return copperBot(pos, moves, rng);
    case 'ijzer':
      return ijzer(pos, moves, rng);
    case 'kristal':
      return kristal(pos, moves, rng);
  }
}

export { moveToUci, PIECE_VALUE };
