export type Color = 'w' | 'b';
export type PieceType = 'p' | 'n' | 'b' | 'r' | 'q' | 'k';

export interface Piece {
  type: PieceType;
  color: Color;
}

/** Square index: rank * 8 + file, so a1 = 0, h1 = 7, a8 = 56. */
export type Square = number;

export interface Castling {
  K: boolean;
  Q: boolean;
  k: boolean;
  q: boolean;
}

export interface Position {
  board: (Piece | null)[];
  turn: Color;
  castling: Castling;
  /** Square a pawn may capture onto en passant, or null. */
  ep: Square | null;
  halfmove: number;
  fullmove: number;
}

export type MoveFlag = 'normal' | 'double' | 'ep' | 'castleK' | 'castleQ';

export interface Move {
  from: Square;
  to: Square;
  piece: PieceType;
  color: Color;
  captured?: PieceType;
  promotion?: PieceType;
  flag: MoveFlag;
}

export type GameStatus =
  | 'playing'
  | 'checkmate'
  | 'stalemate'
  | 'repetition'
  | 'fifty'
  | 'material';

export const PIECE_VALUE: Record<PieceType, number> = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };

export const other = (c: Color): Color => (c === 'w' ? 'b' : 'w');
export const fileOf = (sq: Square) => sq & 7;
export const rankOf = (sq: Square) => sq >> 3;

export function squareName(sq: Square): string {
  return 'abcdefgh'[fileOf(sq)] + (rankOf(sq) + 1);
}

export function parseSquare(name: string): Square {
  return (name.charCodeAt(1) - 49) * 8 + (name.charCodeAt(0) - 97);
}

export function moveToUci(m: Move): string {
  return squareName(m.from) + squareName(m.to) + (m.promotion ?? '');
}
