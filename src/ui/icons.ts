import { pixelSvg } from './pixel';

const INK = '#1d2b4f';

const ICONS: Record<string, { rows: string[]; pal: Record<string, string> }> = {
  hand: {
    rows: [
      '...oo.....', '..ofo.....', '..ofo.....', '..ofoooo..', '..offfffo.',
      'ooofffffo.', 'offffffffo', '.offffffo.', '..offffo..', '...oooo...',
    ],
    pal: { o: INK, f: '#ffd9b3' },
  },
  think: {
    rows: [
      '..........', '...oooo...', '.oowwwwoo.', 'owwwwwwwwo', 'owdwwdwwdo',
      'owwwwwwwwo', '.oowwwwoo.', '...oooo...', '.oo.......', 'oo........',
    ],
    pal: { o: INK, w: '#ffffff', d: INK },
  },
  star: {
    rows: [
      '....oo....', '...oyyo...', '...oyyo...', 'ooooyyoooo', 'oyyyyyyyyo',
      '.oyyyyyyo.', '..oyyyyo..', '.oyyooyyo.', '.oyo..oyo.', '.oo....oo.',
    ],
    pal: { o: INK, y: '#f5c84c' },
  },
  rain: {
    rows: [
      '...oooo...', '.oogggoo..', 'oggggggoo.', 'oggggggggo', '.oooooooo.',
      '..........', '.b..b..b..', '..........', 'b..b..b...', '..........',
    ],
    pal: { o: INK, g: '#b8c2d1', b: '#3b82f6' },
  },
  flag: {
    rows: [
      'oooooo....', 'owwwwwo...', 'owwwwwwo..', 'owwwwwwwo.', 'owwwwwwo..',
      'oooooooo..', 'oo........', 'oo........', 'oo........', 'oo........',
    ],
    pal: { o: INK, w: '#ffffff' },
  },
  trophy: {
    rows: [
      'oooooooooo', 'oyyyyyyyyo', 'oyoyyyyoyo', 'oyoyyyyoyo', '.oyyyyyyo.',
      '..oyyyyo..', '...oyyo...', '...oyyo...', '..oyyyyo..', '.oooooooo.',
    ],
    pal: { o: INK, y: '#f5c84c' },
  },
  handshake: {
    rows: [
      '..........', 'oo......oo', 'obo....opo', 'obboooopp0', 'obbssssppo',
      'obsssssspo', '.osssssso.', '..osssso..', '...oooo...', '..........',
    ],
    pal: { o: INK, b: '#3b82f6', p: '#e0457b', s: '#ffd9b3', '0': INK },
  },
  rewind: {
    rows: [
      '...oooo...', '.oowwwwoo.', 'ow..oo..wo', 'ow.owo...o', 'owowwo....',
      'owwwwo...o', '.o.......o', '.ow....wo.', '..oowwoo..', '....oo....',
    ],
    pal: { o: INK, w: '#3b82f6' },
  },
  house: {
    rows: [
      '....oo....', '...orro...', '..orrrro..', '.orrrrrro.', 'oooooooooo',
      '.owwwwwwo.', '.owwoowwo.', '.owwobowo.', '.owwobowo.', '.oooooooo.',
    ],
    pal: { o: INK, r: '#c8553d', w: '#fffbf2', b: '#8a5a3b' },
  },
  back: {
    rows: [
      '...o......', '..oo......', '.owoooooo.', 'owwwwwwwwo', '.owoooowwo',
      '..oo...owo', '...o...owo', '......owwo', '....oowwo.', '....ooo...',
    ],
    pal: { o: INK, w: '#ffffff' },
  },
  play: {
    rows: [
      'oo........', 'owoo......', 'owwwoo....', 'owwwwwoo..', 'owwwwwwwoo',
      'owwwwwwwoo', 'owwwwwoo..', 'owwwoo....', 'owoo......', 'oo........',
    ],
    pal: { o: INK, w: '#ffffff' },
  },
  next: {
    rows: [
      '......o...', '......oo..', 'ooooooowo.', 'owwwwwwwwo', 'owwwwwwwwwo',
      'owwwwwwwwo', 'ooooooowo.', '......oo..', '......o...', '..........',
    ],
    pal: { o: INK, w: '#ffffff' },
  },
  king_down: {
    rows: [
      '..........', '..........', '..........', '.o......oo', 'ooooooooofo',
      'offffffffffo', 'offffffffffo', 'ooooooooofo', '.o......oo', '..........',
    ],
    pal: { o: INK, f: '#2e3440' },
  },
  hourglass: {
    rows: [
      'oooooooooo', '.oyyyyyyo.', '..oyyyyo..', '...oyyo...', '....oo....',
      '....oo....', '...o..o...', '..o.yy.o..', '.oyyyyyyo.', 'oooooooooo',
    ],
    pal: { o: INK, y: '#f5c84c' },
  },
  loop: {
    rows: [
      '..oooooo..', '.o......o.', 'o..3.....o', 'o........o', 'o........o',
      'o........o', 'o.......ooo', '.o......oo.', '..oooooo.o.', '..........',
    ],
    pal: { o: INK, '3': INK },
  },
  lock: {
    rows: [
      '...oooo...', '..o....o..', '..o....o..', '.oooooooo.', '.oyyyyyyo.',
      '.oyyooyyo.', '.oyyooyyo.', '.oyyyyyyo.', '.oooooooo.', '..........',
    ],
    pal: { o: INK, y: '#f5c84c' },
  },
  rotate: {
    rows: [
      '..oooooooooooo..', '..owwwwwwwwwwo..', '..owwwwwwwwwwo..', '..owwwwwwwwwwo..',
      '..owwwwwwwwwwo..', '..owwwwwwwwwwo..', '..owwwwwwwwwwo..', '..oooooooooooo..',
      '................', '..........o.....', '...........o....', 'oooooooooooooo..',
      'owwwwwwwwwwwwo..', 'owwwwwwwwwwwwo..', 'owwwwwwwwwwwwo..', 'oooooooooooooo..',
    ],
    pal: { o: INK, w: '#dbe9f6' },
  },
};

export type IconName = keyof typeof ICONS;

export function icon(name: IconName, cls = 'icon'): string {
  const i = ICONS[name];
  return pixelSvg(i.rows, i.pal, cls);
}
