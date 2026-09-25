import type { Move, Position } from '../../src/engine';
import { PIECE_VALUE, inCheck, legalMoves, moveToUci, standardRules, toFen } from '../../src/engine';
import { chooseMove } from '../../src/ai/choose';
import type { CreatureId } from '../../src/ai/creatures';
import { makeRng, pick, type Rng } from '../../src/ai/rng';
import { Match, type Result } from '../../src/game/match';

/** AC-14 scripted bot: mate in one, else the highest value capture, else a random legal move. */
export function botMove(pos: Position, rng: Rng): Move {
  const moves = legalMoves(pos);
  const mate = moves.find((m) => {
    const next = standardRules.applyMove(pos, m);
    return inCheck(next) && legalMoves(next).length === 0;
  });
  if (mate) return mate;
  const captures = moves.filter((m) => m.captured);
  if (captures.length) {
    const best = Math.max(...captures.map((m) => PIECE_VALUE[m.captured!]));
    return pick(captures.filter((m) => PIECE_VALUE[m.captured!] === best), rng);
  }
  return pick(moves, rng);
}

/** Plays one full game of the bot (White) against a creature. Returns null when capped. */
export function playBotGame(creature: CreatureId, seed: number, maxPlies = 600): Result | null {
  const match = new Match(creature);
  const rng = makeRng(seed);
  for (let ply = 0; ply < maxPlies; ply++) {
    if (match.result) return match.result;
    if (match.held) return match.acceptLoss();
    if (match.game.turn === 'w') {
      match.playChild(moveToUci(botMove(match.game.position, rng)));
    } else {
      if (match.shouldResign()) return match.resign();
      const m = chooseMove({ fen: toFen(match.game.position), history: [...match.game.history], creature, seed: seed * 1000 + ply });
      match.playCreature(moveToUci(m));
    }
  }
  return match.result;
}
