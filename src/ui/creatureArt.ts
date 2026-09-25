import type { CreatureId } from '../ai/creatures';
import type { Emotion } from '../game/emotions';
import { box } from './pixel';

const INK = '#1d2b4f';

type R = [number, number, number, number, string];

const rect = ([x, y, w, h, f]: R) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${f}" shape-rendering="crispEdges"/>`;

/** Creatures are built from 3D boxes, like block world mobs: front face, top face and right side. */
const svgOf = (parts: (string | R)[]) =>
  `<svg viewBox="0 -4 42 42" aria-hidden="true">${parts.map((p) => (typeof p === 'string' ? p : rect(p))).join('')}</svg>`;

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
    // drip feet and body
    box(9, 32, 3, 3, 2, '#c2185b'), box(22, 32, 3, 3, 2, '#c2185b'),
    box(5, 12, 24, 21, 7, '#f48fb1', 6),
    [7, 14, 3, 2, '#ffffff'],
    // leaf sprout on the top face
    `<path d="M20 9 L20 3" stroke="${INK}" stroke-width="1.6"/>`, box(20, 2, 5, 2, 2, '#5faf5a'),
    ...face(k, 10, 21, 18, 17, 25, '#e0457b'),
  ]);
}

function clucky(e: Emotion): string {
  const k = faceKind(e);
  return svgOf([
    box(11, 32, 2, 3, 2, '#a1662f'), box(20, 32, 2, 3, 2, '#a1662f'),
    box(5, 20, 22, 13, 7, '#ffd54f', 5),
    box(2, 22, 3, 7, 3, '#f2c230'), box(27, 22, 3, 7, 3, '#f2c230'),
    [9, 26, 1.4, 1.4, '#a1662f'], [15, 29, 1.4, 1.4, '#a1662f'], [22, 25, 1.4, 1.4, '#a1662f'],
    box(9, 7, 15, 13, 6, '#ffd54f'),
    // eggshell helmet
    box(8, 3, 17, 4, 6, '#fafaf5'),
    [9, 7, 2, 1, '#fafaf5'], [14, 7, 2, 1, '#fafaf5'], [19, 7, 2, 1, '#fafaf5'],
    ...face(k, 11, 19, 10, 16, 18, '#fb8c00').filter(([, y]) => y < 14),
    // beak sticks out of the front
    box(14, 14, 5, 3, 2, '#fb8c00'),
  ]);
}

function copper(e: Emotion): string {
  const k = faceKind(e);
  const screen: Record<Face, string> = { idle: '#9ee6c9', thinking: '#f5c84c', happy: '#9ee6c9', sad: '#8e9aaf', goodSport: '#9ee6c9' };
  return svgOf([
    box(10, 32, 5, 3, 3, '#6b7280'), box(19, 32, 5, 3, 3, '#6b7280'),
    box(6, 19, 22, 14, 7, '#d9824b', 5),
    [11, 22, 12, 8, INK], [12, 23, 10, 6, screen[k]],
    box(1, 20, 5, 5, 2, '#dbe9f6'), [3, 25, 1.5, 5, '#8e9aaf'],
    box(28, 23, 3, 3, 2, '#8e9aaf'),
    `<path d="M20 5 L20 0" stroke="#8e9aaf" stroke-width="1.2"/>`,
    box(18.5, -3, 3, 3, 2, k === 'happy' ? '#fff27a' : '#f5c84c'),
    box(8, 5, 17, 13, 6, '#d9824b', 4),
    ...face(k, 11, 19, 9, 16, 14, '#e07a3f', true),
  ]);
}

export function creatureSvg(id: CreatureId, e: Emotion): string {
  return id === 'wobble' ? wobble(e) : id === 'clucky' ? clucky(e) : copper(e);
}
