import type { GameStatus, Move, Position } from './types';
import { moveToUci } from './types';
import { parseFen, START_FEN } from './fen';
import { inCheck, insufficientMaterial, legalMoves, positionKey, standardRules, type RuleSet } from './rules';

/**
 * A game: the current position plus the history needed for repetition and undo.
 * Immutable style: every move stores the full previous position, so undo is exact.
 */
export class Game {
  readonly rules: RuleSet;
  private positions: Position[];
  private keys: string[];
  readonly moves: Move[] = [];

  constructor(fen: string = START_FEN, rules: RuleSet = standardRules) {
    this.rules = rules;
    const pos = parseFen(fen);
    this.positions = [pos];
    this.keys = [positionKey(pos, rules)];
  }

  get position(): Position {
    return this.positions[this.positions.length - 1];
  }

  get turn() {
    return this.position.turn;
  }

  get history(): readonly string[] {
    return this.keys;
  }

  legalMoves(): Move[] {
    return legalMoves(this.position, this.rules);
  }

  findMove(uci: string): Move | undefined {
    return this.legalMoves().find((m) => moveToUci(m) === uci);
  }

  play(move: Move | string): Move {
    const m = typeof move === 'string' ? this.findMove(move) : this.legalMoves().find((x) => moveToUci(x) === moveToUci(move));
    if (!m) throw new Error(`Illegal move ${typeof move === 'string' ? move : moveToUci(move)}`);
    const next = this.rules.applyMove(this.position, m);
    this.positions.push(next);
    this.keys.push(positionKey(next, this.rules));
    this.moves.push(m);
    return m;
  }

  undo(): Move | undefined {
    if (!this.moves.length) return undefined;
    this.positions.pop();
    this.keys.pop();
    return this.moves.pop();
  }

  inCheck(): boolean {
    return inCheck(this.position);
  }

  repetitionCount(): number {
    const last = this.keys[this.keys.length - 1];
    return this.keys.filter((k) => k === last).length;
  }

  status(): GameStatus {
    const noMoves = this.legalMoves().length === 0;
    if (noMoves) return this.inCheck() ? 'checkmate' : 'stalemate';
    if (insufficientMaterial(this.position)) return 'material';
    if (this.repetitionCount() >= 3) return 'repetition';
    if (this.position.halfmove >= 100) return 'fifty';
    return 'playing';
  }
}
