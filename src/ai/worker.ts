import { moveToUci } from '../engine';
import { chooseMove, type ChooseRequest } from './choose';

self.onmessage = (e: MessageEvent<ChooseRequest & { id: number }>) => {
  const move = chooseMove(e.data);
  self.postMessage({ id: e.data.id, uci: moveToUci(move) });
};
