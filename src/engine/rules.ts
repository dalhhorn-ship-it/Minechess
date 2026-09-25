import type { Color, Move, PieceType, Position, Square } from './types';
import { PIECE_VALUE, fileOf, other, rankOf } from './types';
import { placementFen, castlingFen } from './fen';

const KNIGHT = [
  [1, 2], [2, 1], [2, -1], [1, -2], [-1, -2], [-2, -1], [-2, 1], [-1, 2],
];
const KING = [
  [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1],
];
const ROOK_DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1]];
const BISHOP_DIRS = [[1, 1], [1, -1], [-1, 1], [-1, -1]];

function offset(sq: Square, df: number, dr: number): Square | -1 {
  const f = fileOf(sq) + df;
  const r = rankOf(sq) + dr;
  return f < 0 || f > 7 || r < 0 || r > 7 ? -1 : r * 8 + f;
}

export function isAttacked(pos: Position, sq: Square, by: Color): boolean {
  const b = pos.board;
  const pawnDir = by === 'w' ? -1 : 1;
  for (const df of [-1, 1]) {
    const s = offset(sq, df, pawnDir);
    if (s >= 0 && b[s]?.color === by && b[s]?.type === 'p') return true;
  }
  for (const [df, dr] of KNIGHT) {
    const s = offset(sq, df, dr);
    if (s >= 0 && b[s]?.color === by && b[s]?.type === 'n') return true;
  }
  for (const [df, dr] of KING) {
    const s = offset(sq, df, dr);
    if (s >= 0 && b[s]?.color === by && b[s]?.type === 'k') return true;
  }
  const slide = (dirs: number[][], types: PieceType[]) => {
    for (const [df, dr] of dirs) {
      let s = offset(sq, df, dr);
      while (s >= 0) {
        const p = b[s];
        if (p) {
          if (p.color === by && types.includes(p.type)) return true;
          break;
        }
        s = offset(s, df, dr);
      }
    }
    return false;
  };
  return slide(ROOK_DIRS, ['r', 'q']) || slide(BISHOP_DIRS, ['b', 'q']);
}

export function kingSquare(pos: Position, color: Color): Square {
  return pos.board.findIndex((p) => p?.type === 'k' && p.color === color);
}

export function inCheck(pos: Position, color: Color = pos.turn): boolean {
  const k = kingSquare(pos, color);
  return k >= 0 && isAttacked(pos, k, other(color));
}

/**
 * A rule set generates pseudo legal moves and applies them. Variants (such as
 * the planned mine chess) provide their own rule set without touching the UI.
 */
export interface RuleSet {
  name: string;
  pseudoMoves(pos: Position): Move[];
  applyMove(pos: Position, move: Move): Position;
}

function pseudoMoves(pos: Position): Move[] {
  const moves: Move[] = [];
  const b = pos.board;
  const us = pos.turn;
  const add = (from: Square, to: Square, piece: PieceType, flag: Move['flag'] = 'normal', promotion?: PieceType) => {
    const target = flag === 'ep' ? 'p' : b[to]?.type;
    moves.push({ from, to, piece, color: us, flag, promotion, ...(target ? { captured: target } : {}) });
  };
  for (let sq = 0; sq < 64; sq++) {
    const p = b[sq];
    if (!p || p.color !== us) continue;
    if (p.type === 'p') {
      const dir = us === 'w' ? 1 : -1;
      const startRank = us === 'w' ? 1 : 6;
      const lastRank = us === 'w' ? 7 : 0;
      const pushPawn = (to: Square, flag: Move['flag'] = 'normal') => {
        if (rankOf(to) === lastRank) for (const pr of ['q', 'r', 'b', 'n'] as PieceType[]) add(sq, to, 'p', flag, pr);
        else add(sq, to, 'p', flag);
      };
      const one = offset(sq, 0, dir);
      if (one >= 0 && !b[one]) {
        pushPawn(one);
        const two = offset(sq, 0, 2 * dir);
        if (rankOf(sq) === startRank && two >= 0 && !b[two]) add(sq, two, 'p', 'double');
      }
      for (const df of [-1, 1]) {
        const t = offset(sq, df, dir);
        if (t < 0) continue;
        if (b[t] && b[t]!.color !== us) pushPawn(t);
        else if (t === pos.ep) add(sq, t, 'p', 'ep');
      }
    } else if (p.type === 'n' || p.type === 'k') {
      for (const [df, dr] of p.type === 'n' ? KNIGHT : KING) {
        const t = offset(sq, df, dr);
        if (t >= 0 && b[t]?.color !== us) add(sq, t, p.type);
      }
      if (p.type === 'k') addCastles(pos, sq, add);
    } else {
      const dirs = p.type === 'r' ? ROOK_DIRS : p.type === 'b' ? BISHOP_DIRS : [...ROOK_DIRS, ...BISHOP_DIRS];
      for (const [df, dr] of dirs) {
        let t = offset(sq, df, dr);
        while (t >= 0) {
          if (b[t]?.color === us) break;
          add(sq, t, p.type);
          if (b[t]) break;
          t = offset(t, df, dr);
        }
      }
    }
  }
  return moves;
}

function addCastles(
  pos: Position,
  sq: Square,
  add: (from: Square, to: Square, piece: PieceType, flag: Move['flag']) => void,
) {
  const us = pos.turn;
  const home = us === 'w' ? 4 : 60;
  if (sq !== home) return;
  const them = other(us);
  const b = pos.board;
  const rookAt = (s: Square) => b[s]?.type === 'r' && b[s]?.color === us;
  const canK = us === 'w' ? pos.castling.K : pos.castling.k;
  const canQ = us === 'w' ? pos.castling.Q : pos.castling.q;
  if (!canK && !canQ) return;
  if (isAttacked(pos, home, them)) return;
  if (canK && rookAt(home + 3) && !b[home + 1] && !b[home + 2] &&
      !isAttacked(pos, home + 1, them) && !isAttacked(pos, home + 2, them)) {
    add(home, home + 2, 'k', 'castleK');
  }
  if (canQ && rookAt(home - 4) && !b[home - 1] && !b[home - 2] && !b[home - 3] &&
      !isAttacked(pos, home - 1, them) && !isAttacked(pos, home - 2, them)) {
    add(home, home - 2, 'k', 'castleQ');
  }
}

function applyMove(pos: Position, m: Move): Position {
  const board = pos.board.slice();
  const castling = { ...pos.castling };
  const us = pos.turn;
  board[m.to] = { type: m.promotion ?? m.piece, color: us };
  board[m.from] = null;
  if (m.flag === 'ep') board[m.to + (us === 'w' ? -8 : 8)] = null;
  if (m.flag === 'castleK') {
    board[m.to - 1] = board[m.to + 1];
    board[m.to + 1] = null;
  } else if (m.flag === 'castleQ') {
    board[m.to + 1] = board[m.to - 2];
    board[m.to - 2] = null;
  }
  if (m.piece === 'k') {
    if (us === 'w') castling.K = castling.Q = false;
    else castling.k = castling.q = false;
  }
  for (const s of [m.from, m.to]) {
    if (s === 0) castling.Q = false;
    if (s === 7) castling.K = false;
    if (s === 56) castling.q = false;
    if (s === 63) castling.k = false;
  }
  return {
    board,
    turn: other(us),
    castling,
    ep: m.flag === 'double' ? (m.from + m.to) / 2 : null,
    halfmove: m.piece === 'p' || m.captured ? 0 : pos.halfmove + 1,
    fullmove: pos.fullmove + (us === 'b' ? 1 : 0),
  };
}

export const standardRules: RuleSet = { name: 'standard', pseudoMoves, applyMove };

export function legalMoves(pos: Position, rules: RuleSet = standardRules): Move[] {
  return rules.pseudoMoves(pos).filter((m) => !inCheck(rules.applyMove(pos, m), pos.turn));
}

/** Key for threefold repetition: placement, side to move, castling, and en passant only when a capture is really possible. */
export function positionKey(pos: Position, rules: RuleSet = standardRules): string {
  let ep = '-';
  if (pos.ep !== null && legalMoves(pos, rules).some((m) => m.flag === 'ep')) ep = String(pos.ep);
  return `${placementFen(pos)} ${pos.turn} ${castlingFen(pos)} ${ep}`;
}

export function insufficientMaterial(pos: Position): boolean {
  const minors: { type: PieceType; sq: Square }[] = [];
  for (let sq = 0; sq < 64; sq++) {
    const p = pos.board[sq];
    if (!p || p.type === 'k') continue;
    if (p.type === 'b' || p.type === 'n') minors.push({ type: p.type, sq });
    else return false;
  }
  if (minors.length <= 1) return true;
  // Only bishops, all on the same square colour.
  if (minors.every((m) => m.type === 'b')) {
    const shade = (sq: Square) => (fileOf(sq) + rankOf(sq)) % 2;
    return minors.every((m) => shade(m.sq) === shade(minors[0].sq));
  }
  return false;
}

/** Material of `color` minus material of the opponent. */
export function materialBalance(pos: Position, color: Color): number {
  let sum = 0;
  for (const p of pos.board) if (p) sum += p.color === color ? PIECE_VALUE[p.type] : -PIECE_VALUE[p.type];
  return sum;
}
