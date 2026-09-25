import type { CreatureId } from '../ai/creatures';
import type { Emotion } from '../game/emotions';

const INK = '#1d2b4f';

type R = [number, number, number, number, string];

const svgOf = (rects: R[]) =>
  `<svg viewBox="0 0 32 32" shape-rendering="crispEdges" aria-hidden="true">${rects
    .map(([x, y, w, h, f]) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${f}"/>`)
    .join('')}</svg>`;

/** A blocky box with an outline, lighter top face and darker side face. */
function block(x: number, y: number, w: number, h: number, body: string, top: string, side: string): R[] {
  return [
    [x + 1, y, w - 2, h, INK], [x, y + 1, w, h - 2, INK],
    [x + 1, y + 1, w - 2, h - 2, body],
    [x + 1, y + 1, w - 2, 2, top],
    [x + w - 3, y + 3, 2, h - 4, side],
  ];
}

type Face = 'idle' | 'thinking' | 'happy' | 'sad' | 'goodSport';

function faceKind(e: Emotion): Face {
  if (e === 'happy' || e === 'celebrating') return 'happy';
  if (e === 'sad' || e === 'sadShort' || e === 'sadResign' || e === 'worried' || e === 'surprised') return 'sad';
  if (e === 'thinking') return 'thinking';
  if (e === 'goodSport') return 'goodSport';
  return 'idle';
}

/** Shared face rig: eyes at (lx, ey) and (rx, ey), mouth centred at (mx, my). */
function face(kind: Face, lx: number, rx: number, ey: number, mx: number, my: number, mouth: string, bigLeft = false): R[] {
  const out: R[] = [];
  const eye = (x: number, big: boolean) => {
    const s = big ? 3 : 2;
    if (kind === 'happy') {
      out.push([x, ey + 1, 1, 1, INK], [x + 1, ey, s - 1, 1, INK], [x + s, ey + 1, 1, 1, INK]);
    } else if (kind === 'sad') {
      out.push([x, ey + 1, s + 1, 1, INK], [x + (s > 2 ? 1 : 0), ey + 2, s - 1, 1, INK]);
    } else if (kind === 'thinking') {
      out.push([x, ey - 1, s, s, INK], [x + s - 1, ey - 1, 1, 1, '#ffffff']);
    } else {
      out.push([x, ey, s, s + 1, INK], [x, ey, 1, 1, '#ffffff']);
    }
  };
  eye(lx, bigLeft);
  eye(rx, false);
  if (kind === 'happy') {
    out.push([mx - 2, my, 5, 1, INK], [mx - 2, my + 1, 5, 1, mouth], [mx - 1, my + 2, 3, 1, INK]);
  } else if (kind === 'sad') {
    out.push([mx - 1, my, 3, 1, INK], [mx - 2, my + 1, 1, 1, INK], [mx + 2, my + 1, 1, 1, INK]);
  } else if (kind === 'thinking') {
    out.push([mx, my, 3, 1, INK]);
  } else if (kind === 'goodSport') {
    out.push([mx - 3, my, 1, 1, INK], [mx - 2, my + 1, 5, 1, INK], [mx + 3, my, 1, 1, INK]);
  } else {
    out.push([mx - 2, my, 1, 1, INK], [mx - 1, my + 1, 3, 1, INK], [mx + 2, my, 1, 1, INK]);
  }
  return out;
}

function wobble(e: Emotion): string {
  const k = faceKind(e);
  return svgOf([
    // leaf sprout
    [15, 3, 2, 6, INK], [16, 4, 1, 5, '#5faf5a'], [17, 3, 4, 2, INK], [17, 4, 3, 1, '#5faf5a'],
    ...block(5, 9, 22, 19, '#f48fb1', '#fad1df', '#c2185b'),
    [7, 12, 3, 2, '#ffffff'],
    // drip feet
    [8, 27, 3, 2, INK], [9, 27, 1, 1, '#c2185b'], [21, 27, 3, 2, INK], [22, 27, 1, 1, '#c2185b'],
    ...face(k, 10, 19, 15, 15, 21, '#e0457b'),
  ]);
}

function clucky(e: Emotion): string {
  const k = faceKind(e);
  return svgOf([
    // legs
    [11, 27, 2, 3, '#a1662f'], [19, 27, 2, 3, '#a1662f'], [10, 29, 4, 1, INK], [18, 29, 4, 1, INK],
    ...block(6, 15, 20, 13, '#ffd54f', '#fff3c4', '#e0b53a'),
    // speckles and wings
    [9, 22, 1, 1, '#a1662f'], [14, 25, 1, 1, '#a1662f'], [20, 21, 1, 1, '#a1662f'],
    [4, 18, 3, 6, INK], [5, 19, 2, 4, '#f2c230'], [25, 18, 3, 6, INK], [25, 19, 2, 4, '#f2c230'],
    // head
    ...block(9, 5, 14, 12, '#ffd54f', '#fff3c4', '#e0b53a'),
    // eggshell helmet with a zigzag edge
    [9, 2, 14, 4, '#c9c2b0'], [10, 2, 12, 3, '#fafaf5'], [10, 5, 2, 1, '#fafaf5'], [14, 5, 2, 1, '#fafaf5'], [18, 5, 2, 1, '#fafaf5'],
    // beak
    [14, 12, 5, 3, INK], [15, 13, 3, 1, '#fb8c00'],
    ...face(k, 11, 18, 8, 16, 16, '#fb8c00').filter(([, y]) => y < 12),
  ]);
}

function copper(e: Emotion): string {
  const k = faceKind(e);
  const screen: Record<Face, string> = { idle: '#9ee6c9', thinking: '#f5c84c', happy: '#9ee6c9', sad: '#8e9aaf', goodSport: '#9ee6c9' };
  return svgOf([
    // antenna
    [15, 0, 3, 3, INK], [16, 1, 1, 1, k === 'happy' ? '#fff27a' : '#f5c84c'], [16, 3, 1, 3, '#8e9aaf'],
    ...block(8, 5, 16, 11, '#d9824b', '#f2b48a', '#9c5530'),
    ...block(7, 16, 18, 12, '#d9824b', '#f2b48a', '#9c5530'),
    // chest screen and rivets
    [12, 19, 8, 6, '#1d2b4f'], [13, 20, 6, 4, screen[k]], [9, 18, 1, 1, '#9c5530'], [22, 18, 1, 1, '#9c5530'],
    // magnifier and clamp
    [2, 17, 5, 5, INK], [3, 18, 3, 3, '#dbe9f6'], [5, 22, 2, 4, '#8e9aaf'], [25, 20, 3, 3, INK], [26, 21, 1, 1, '#8e9aaf'],
    // feet
    [10, 28, 4, 2, INK], [18, 28, 4, 2, INK],
    ...face(k, 11, 18, 8, 16, 12, '#e07a3f', true),
  ]);
}

export function creatureSvg(id: CreatureId, e: Emotion): string {
  return id === 'wobble' ? wobble(e) : id === 'clucky' ? clucky(e) : copper(e);
}
