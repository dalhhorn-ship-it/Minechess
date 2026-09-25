import { extrudedSvg } from './pixel';
import type { Color, PieceType } from '../engine';

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

/** Light pieces look like pale stone blocks, dark pieces like dark stone; top faces catch the light. */
const PALETTES = {
  w: { o: '#1d2b4f', f: '#f4efe4', e: '#1d2b4f', top: '#ffffff', side: '#b3aa98' },
  b: { o: '#0f1218', f: '#3b4252', e: '#f4efe4', top: '#6b7589', side: '#1b1e25' },
};

const cache = new Map<string, string>();

export function pieceSvg(type: PieceType, color: Color): string {
  const key = type + color;
  if (!cache.has(key)) {
    const pal = PALETTES[color];
    cache.set(key, extrudedSvg(MAPS[type], { o: pal.o, f: pal.f, e: pal.e }, pal.top, pal.side, 1.6, `piece piece-${color}`));
  }
  return cache.get(key)!;
}
