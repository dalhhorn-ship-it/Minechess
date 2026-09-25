import type { GameStatus, Move } from '../engine';
import { Game, moveToUci } from '../engine';
import { isHopeless } from '../ai/choose';
import type { CreatureId } from '../ai/creatures';
import { creatureById } from '../ai/creatures';
import { emotionFor, type Emotion } from './emotions';

export const OOPS_CREDITS = 2;
/** Easy creatures resign after being hopeless after 3 of their own moves in a row (AC-54). */
export const RESIGN_STREAK = 3;

export type ResultKind = 'win' | 'loss' | 'draw';
export type ResultReason = GameStatus | 'resign';

export interface Result {
  kind: ResultKind;
  reason: ResultReason;
}

export interface MoveOutcome {
  move: Move;
  emotion: Emotion;
  result: Result | null;
  /** The creature checkmated the child but the loss is held for an oops (AC-64). */
  held: boolean;
}

/** One game between the child (always White, AC-44) and a creature (Black). */
export class Match {
  readonly game: Game;
  readonly creature: CreatureId;
  credits = OOPS_CREDITS;
  result: Result | null = null;
  held = false;
  private streak = 0;
  private streakHistory: number[] = [];

  constructor(creature: CreatureId, fen?: string) {
    this.creature = creature;
    this.game = new Game(fen);
  }

  get childToMove() {
    return !this.result && !this.held && this.game.turn === 'w';
  }

  get resignStreak() {
    return this.streak;
  }

  private finish(status: GameStatus, mover: 'child' | 'creature'): Result | null {
    if (status === 'playing') return null;
    if (status === 'checkmate') return { kind: mover === 'child' ? 'win' : 'loss', reason: status };
    return { kind: 'draw', reason: status };
  }

  playChild(uci: string): MoveOutcome {
    if (!this.childToMove) throw new Error('Not the child\'s turn');
    const move = this.game.play(uci);
    const status = this.game.status();
    this.result = this.finish(status, 'child');
    return { move, emotion: emotionFor(move, 'child', status, this.game.inCheck()), result: this.result, held: false };
  }

  /** Easy creatures resign at the start of their turn once the streak is reached. */
  shouldResign(): boolean {
    return !this.result && this.game.turn === 'b' && creatureById(this.creature).helpsChildWin && this.streak >= RESIGN_STREAK;
  }

  resign(): Result {
    this.result = { kind: 'win', reason: 'resign' };
    return this.result;
  }

  playCreature(uci: string): MoveOutcome {
    if (this.result || this.game.turn !== 'b') throw new Error('Not the creature\'s turn');
    const move = this.game.play(uci);
    this.streakHistory.push(this.streak);
    this.streak = isHopeless(this.game.position, 'b') ? this.streak + 1 : 0;
    const status = this.game.status();
    const result = this.finish(status, 'creature');
    if (result?.kind === 'loss' && this.credits > 0) this.held = true;
    else this.result = result;
    return { move, emotion: emotionFor(move, 'creature', status, this.game.inCheck()), result, held: this.held };
  }

  /** The child accepts a held checkmate (taps "see result"). */
  acceptLoss(): Result {
    this.held = false;
    this.result = { kind: 'loss', reason: 'checkmate' };
    return this.result;
  }

  canOops(): boolean {
    if (this.credits <= 0 || this.result) return false;
    return this.game.moves.length > 0;
  }

  /**
   * Takes back one move pair (AC-40), or only the child's move when the creature
   * has not replied yet (AC-65). Restores the exact previous state (AC-66).
   */
  oops(): void {
    if (!this.canOops()) throw new Error('No oops available');
    if (this.game.turn === 'w') {
      this.game.undo();
      this.streak = this.streakHistory.pop() ?? 0;
    }
    this.game.undo();
    this.credits--;
    this.held = false;
  }

  lastMove(): Move | undefined {
    return this.game.moves[this.game.moves.length - 1];
  }

  uciHistory(): string[] {
    return this.game.moves.map(moveToUci);
  }
}
