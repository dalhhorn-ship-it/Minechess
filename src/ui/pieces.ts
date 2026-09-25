import type { Color, PieceType } from '../engine';
import { pixelSvg } from './pixel';

const MAPS: Record<PieceType, string[]> = {
  p: [
    '..............', '.....oooo.....', '....offffo....', '....offffo....', '.....offo.....',
    '....offffo....', '.....offo.....', '.....offo.....', '....offffo....', '...offffffo...',
    '..offffffffo..', '..oooooooooo..', '.offffffffffo.', '.oooooooooooo.',
  ],
  r: [
    '..............', '.ooo.oooo.ooo.', '.ofo.offo.ofo.', '.offoffffoffo.', '.offffffffffo.',
    '..oooooooooo..', '...offffffo...', '...offffffo...', '...offffffo...', '...offffffo...',
    '..offffffffo..', '..oooooooooo..', '.offffffffffo.', '.oooooooooooo.',
  ],
  n: [
    '..............', '......oo......', '.....offoo....', '....offffoo...', '...offeffffo..',
    '..offffffffo..', '.offffooffffo.', '.offoo.offffo.', '..oo..offfffo.', '.....offffffo.',
    '....offffffo..', '...oooooooooo.', '..offffffffffo', '..oooooooooooo',
  ],
  b: [
    '......oo......', '.....offo.....', '....offffo....', '...offofffo...', '...offfoffo...',
    '...offffffo...', '....offffo....', '.....offo.....', '....offffo....', '...offffffo...',
    '..oooooooooo..', '..offffffffo..', '.offffffffffo.', '.oooooooooooo.',
  ],
  q: [
    '..o...oo...o..', '.ofo.offo.ofo.', '.offoffffoffo.', '..offffffffo..', '..offffffffo..',
    '...offffffo...', '....offffo....', '....offffo....', '...offffffo...', '..offffffffo..',
    '..oooooooooo..', '..offffffffo..', '.offffffffffo.', '.oooooooooooo.',
  ],
  k: [
    '......oo......', '.....offo.....', '....offffo....', '.....offo.....', '..oooooooooo..',
    '..offffffffo..', '...offffffo...', '....offffo....', '....offffo....', '...offffffo...',
    '..oooooooooo..', '..offffffffo..', '.offffffffffo.', '.oooooooooooo.',
  ],
};

/** Light pieces: warm white with ink outline. Dark pieces: charcoal with a light rim (visual-language.md). */
const PALETTES = {
  w: { o: '#1d2b4f', f: '#fffbf2', e: '#1d2b4f' },
  b: { o: '#fffbf2', f: '#2e3440', e: '#fffbf2' },
};

const cache = new Map<string, string>();

export function pieceSvg(type: PieceType, color: Color): string {
  const key = type + color;
  if (!cache.has(key)) cache.set(key, pixelSvg(MAPS[type], PALETTES[color], `piece piece-${color}`));
  return cache.get(key)!;
}
