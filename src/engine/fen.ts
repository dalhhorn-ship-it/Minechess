import type { Color, Piece, PieceType, Position } from './types';
import { parseSquare, squareName } from './types';

export const START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

export function parseFen(fen: string): Position {
  const [placement, turn, castling, ep, half, full] = fen.trim().split(/\s+/);
  const board: (Piece | null)[] = new Array(64).fill(null);
  const rows = placement.split('/');
  if (rows.length !== 8) throw new Error(`Bad FEN: ${fen}`);
  rows.forEach((row, i) => {
    const rank = 7 - i;
    let file = 0;
    for (const ch of row) {
      if (/\d/.test(ch)) {
        file += Number(ch);
      } else {
        const color: Color = ch === ch.toUpperCase() ? 'w' : 'b';
        board[rank * 8 + file] = { type: ch.toLowerCase() as PieceType, color };
        file++;
      }
    }
  });
  const c = castling ?? '-';
  return {
    board,
    turn: turn === 'b' ? 'b' : 'w',
    castling: { K: c.includes('K'), Q: c.includes('Q'), k: c.includes('k'), q: c.includes('q') },
    ep: ep && ep !== '-' ? parseSquare(ep) : null,
    halfmove: half ? Number(half) : 0,
    fullmove: full ? Number(full) : 1,
  };
}

export function placementFen(pos: Position): string {
  const rows: string[] = [];
  for (let rank = 7; rank >= 0; rank--) {
    let row = '';
    let empty = 0;
    for (let file = 0; file < 8; file++) {
      const p = pos.board[rank * 8 + file];
      if (!p) {
        empty++;
        continue;
      }
      if (empty) row += empty;
      empty = 0;
      row += p.color === 'w' ? p.type.toUpperCase() : p.type;
    }
    if (empty) row += empty;
    rows.push(row);
  }
  return rows.join('/');
}

export function castlingFen(pos: Position): string {
  const { K, Q, k, q } = pos.castling;
  return (K ? 'K' : '') + (Q ? 'Q' : '') + (k ? 'k' : '') + (q ? 'q' : '') || '-';
}

export function toFen(pos: Position): string {
  return [
    placementFen(pos),
    pos.turn,
    castlingFen(pos),
    pos.ep === null ? '-' : squareName(pos.ep),
    pos.halfmove,
    pos.fullmove,
  ].join(' ');
}
