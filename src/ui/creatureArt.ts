import type { CreatureId } from '../ai/creatures';
import type { Emotion } from '../game/emotions';
import { box } from './pixel';

const INK = '#1d2b4f';

type R = [number, number, number, number, string];

const rect = ([x, y, w, h, f]: R) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${f}" shape-rendering="crispEdges"/>`;

/** Creatures are built from 3D boxes, like block world mobs: front face, top face and right side. */
const svgOf = (parts: (string | R)[]) =>
  `<svg viewBox="0 -4 42 42" aria-hidden="true">${parts.map((p) => (typeof p === 'string' ? p : rect(p))).join('')}</svg>`;

type Face = 'idle' | 'thinking' | 'happy' | 'sad' | 'goodSport' | 'worried' | 'surprised' | 'crying' | 'laughing';

function faceKind(e: Emotion): Face {
  if (e === 'happy' || e === 'celebrating') return 'happy';
  if (e === 'worried' || e === 'surprised' || e === 'crying' || e === 'laughing') return e;
  if (e === 'sad' || e === 'sadShort' || e === 'sadResign') return 'sad';
  if (e === 'thinking') return 'thinking';
  if (e === 'goodSport') return 'goodSport';
  return 'idle';
}

/** Shared face rig: eyes at (lx, ey) and (rx, ey), mouth centred at (mx, my). */
function face(kind: Face, lx: number, rx: number, ey: number, mx: number, my: number, mouth: string, bigLeft = false): R[] {
  const out: R[] = [];
  const eye = (x: number, big: boolean) => {
    const s = big ? 3 : 2;
    if (kind === 'happy' || kind === 'laughing') {
      out.push([x, ey + 1, 1, 1, INK], [x + 1, ey, s - 1, 1, INK], [x + s, ey + 1, 1, 1, INK]);
    } else if (kind === 'surprised') {
      out.push([x - 1, ey - 1, s + 2, s + 2, INK], [x, ey, s, s, '#ffffff'], [x + 1, ey + 1, 1, 1, INK]);
    } else if (kind === 'worried') {
      out.push([x - 1, ey - 2, s + 1, 1, INK], [x, ey, s, s + 1, '#ffffff'], [x + 1, ey + 1, 1, 1, INK]);
    } else if (kind === 'crying') {
      out.push([x, ey + 1, s + 1, 1, INK], [x, ey + 2, 1, 3, '#4aa8ff'], [x + s, ey + 2, 1, 5, '#4aa8ff']);
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
  } else if (kind === 'laughing') {
    out.push([mx - 3, my - 1, 7, 1, INK], [mx - 3, my, 7, 2, mouth], [mx - 2, my + 2, 5, 1, INK], [mx - 3, my, 7, 1, '#ffffff']);
  } else if (kind === 'surprised') {
    out.push([mx - 1, my - 1, 3, 1, INK], [mx - 2, my, 1, 2, INK], [mx + 2, my, 1, 2, INK], [mx - 1, my, 3, 2, mouth], [mx - 1, my + 2, 3, 1, INK]);
  } else if (kind === 'worried') {
    out.push([mx - 2, my + 1, 1, 1, INK], [mx - 1, my, 1, 1, INK], [mx, my + 1, 1, 1, INK], [mx + 1, my, 1, 1, INK], [mx + 2, my + 1, 1, 1, INK]);
  } else if (kind === 'crying') {
    out.push([mx - 2, my, 5, 1, INK], [mx - 3, my + 1, 1, 1, INK], [mx + 3, my + 1, 1, 1, INK], [mx - 1, my + 1, 3, 1, mouth]);
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

/** Draws a face scaled around its centre, so expressions read well at iPad size. */
function bigFace(parts: R[], cx: number, cy: number, scale: number): string {
  return `<g transform="translate(${cx} ${cy}) scale(${scale}) translate(${-cx} ${-cy})">${parts.map(rect).join('')}</g>`;
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
    bigFace(face(k, 11, 20, 18, 16, 24, '#e0457b'), 16.5, 21, 1.6),
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
    bigFace(face(k, 12, 19, 10, 16, 18, '#fb8c00').filter(([, y, , , f]) => y < 14 || f === '#4aa8ff'), 16.5, 11, 1.3),
    // beak sticks out of the front
    box(14, 14, 5, 3, 2, '#fb8c00'),
  ]);
}

function copper(e: Emotion): string {
  const k = faceKind(e);
  const screen: Record<Face, string> = {
    idle: '#9ee6c9', thinking: '#f5c84c', happy: '#9ee6c9', sad: '#8e9aaf', goodSport: '#9ee6c9',
    worried: '#ff9f43', surprised: '#ffffff', crying: '#4aa8ff', laughing: '#fff27a',
  };
  return svgOf([
    box(10, 32, 5, 3, 3, '#6b7280'), box(19, 32, 5, 3, 3, '#6b7280'),
    box(6, 19, 22, 14, 7, '#d9824b', 5),
    [11, 22, 12, 8, INK], [12, 23, 10, 6, screen[k]],
    box(1, 20, 5, 5, 2, '#dbe9f6'), [3, 25, 1.5, 5, '#8e9aaf'],
    box(28, 23, 3, 3, 2, '#8e9aaf'),
    `<path d="M20 5 L20 0" stroke="#8e9aaf" stroke-width="1.2"/>`,
    box(18.5, -3, 3, 3, 2, k === 'happy' ? '#fff27a' : '#f5c84c'),
    box(8, 5, 17, 13, 6, '#d9824b', 4),
    bigFace(face(k, 12, 19, 9, 16, 13, '#e07a3f', true), 16.5, 11, 1.35),
  ]);
}

function snurk(e: Emotion): string {
  const k = faceKind(e);
  const z = k === 'idle' || k === 'thinking'
    ? `<text x="30" y="6" font-size="5" font-weight="900" fill="#5b6b8c">z</text><text x="34" y="1" font-size="4" font-weight="900" fill="#5b6b8c">z</text>`
    : '';
  return svgOf([
    box(8, 31, 3, 4, 2, '#555b66'), box(24, 31, 3, 4, 2, '#555b66'),
    box(4, 15, 28, 17, 7, '#f4f1e8', 12),
    box(4, 10, 4, 4, 2, '#7d838d'), box(24, 10, 4, 4, 2, '#7d838d'),
    box(8, 8, 16, 13, 5, '#8a8f98'),
    [14, 17, 4, 2, '#e88fa0'],
    bigFace(face(k, 11, 19, 11, 16, 19, '#e88fa0'), 16, 14, 1.25),
    z,
  ]);
}

function plons(e: Emotion): string {
  const k = faceKind(e);
  return svgOf([
    box(3, 29, 7, 4, 3, '#3f9a33'), box(24, 29, 7, 4, 3, '#3f9a33'),
    box(4, 17, 26, 14, 8, '#5cbf4a', 6),
    [9, 25, 16, 5, '#b8e89a'],
    box(6, 9, 8, 9, 4, '#5cbf4a'), box(20, 9, 8, 9, 4, '#5cbf4a'),
    [7, 10, 6, 6, '#ffffff'], [21, 10, 6, 6, '#ffffff'],
    bigFace(face(k, 9, 23, 11, 17, 21, '#e0457b'), 17, 16, 1.15),
  ]);
}

function fizz(e: Emotion): string {
  const k = faceKind(e);
  const bubbles = [[14, 2, 1.6], [19, -1, 1.2], [22, 3, 1]].map(([x, y, r]) =>
    `<circle cx="${x}" cy="${y}" r="${r}" fill="#7fd8e8" stroke="#2a8fa3" stroke-width="0.5"/>`).join('');
  return svgOf([
    bubbles,
    box(11, 31, 3, 4, 2, '#c24e00'), box(21, 31, 3, 4, 2, '#c24e00'),
    box(8, 6, 18, 26, 6, '#ff7a1a', 5),
    [8, 20, 18, 3, '#ffffff'],
    bigFace(face(k, 12, 20, 10, 17, 15, '#c24e00'), 17, 12, 1.35),
  ]);
}

function muddle(e: Emotion): string {
  const k = faceKind(e);
  return svgOf([
    box(2, 22, 5, 5, 3, '#f59bb0'), box(27, 22, 5, 5, 3, '#f59bb0'),
    box(8, 31, 4, 3, 2, '#5a3521'), box(22, 31, 4, 3, 2, '#5a3521'),
    box(6, 12, 22, 20, 7, '#8d5a3b', 7),
    [10, 24, 14, 8, '#c79a74'],
    box(9, 6, 16, 6, 5, '#ffc928'), box(10, 7, 3, 3, 1, '#fff4b0'),
    [10, 15, 6, 6, '#1d2b4f'], [18, 15, 6, 6, '#1d2b4f'], [11, 16, 4, 4, '#dfe8f5'], [19, 16, 4, 4, '#dfe8f5'],
    bigFace(face(k, 12, 20, 17, 17, 25, '#f59bb0'), 17, 20, 1.0),
    [16, 21, 3, 2, '#f59bb0'], [17, 20, 1, 4, '#f59bb0'],
  ]);
}

function knor(e: Emotion): string {
  const k = faceKind(e);
  return svgOf([
    box(7, 30, 4, 4, 2, '#c9962a'), box(22, 30, 4, 4, 2, '#c9962a'),
    `<path d="M35 19 q3 -2 1 -4 q-2 -2 -3 1" fill="none" stroke="#c9962a" stroke-width="1.2"/>`,
    box(4, 13, 28, 18, 8, '#f2c14e', 7),
    `<polygon points="15,10.5 22,10.5 23,9.5 16,9.5" fill="#6b4a12"/>`,
    box(7, 9, 5, 4, 2, '#e0a82e'), box(23, 9, 5, 4, 2, '#e0a82e'),
    bigFace(face(k, 11, 22, 16, 17, 28, '#b5651d'), 17, 20, 1.1),
    box(13, 21, 8, 5, 3, '#e0a82e'), [15, 23, 1.2, 1.5, '#6b4a12'], [18, 23, 1.2, 1.5, '#6b4a12'],
  ]);
}

function stip(e: Emotion): string {
  const k = faceKind(e);
  const dots = [[7, 20], [26, 20], [8, 28], [25, 28], [16, 30]].map(([x, y]) => [x, y, 3, 3, '#1b1b1b'] as R);
  return svgOf([
    `<path d="M13 8 L10 2" stroke="#1b1b1b" stroke-width="1"/><path d="M21 8 L24 2" stroke="#1b1b1b" stroke-width="1"/>`,
    box(8, 0, 3, 3, 1, '#1b1b1b'), box(23, 0, 3, 3, 1, '#1b1b1b'),
    box(9, 32, 3, 2, 2, '#1b1b1b'), box(22, 32, 3, 2, 2, '#1b1b1b'),
    box(5, 8, 24, 25, 7, '#e53935'),
    [6, 9, 22, 5, '#2b2b2b'],
    ...dots,
    [10, 15, 5, 5, '#ffffff'], [19, 15, 5, 5, '#ffffff'],
    bigFace(face(k, 11, 20, 16, 17, 24, '#8b0000'), 17, 19, 1.1),
  ]);
}

function ijzer(e: Emotion): string {
  const k = faceKind(e);
  return svgOf([
    box(9, 31, 5, 4, 2, '#46607f'), box(21, 31, 5, 4, 2, '#46607f'),
    box(6, 16, 24, 16, 7, '#6f8fb3', 5),
    box(9, 4, 18, 12, 6, '#6f8fb3'),
    box(16, -1, 4, 5, 2, '#d64545'),
    [10, 7, 16, 6, '#dfeaf6'],
    bigFace(face(k, 12, 21, 8, 18, 14, '#46607f').filter(([, y]) => y < 13 || y >= 14), 18, 10, 1.1),
    box(0, 18, 11, 13, 2, '#e8b923'),
    `<polygon points="5.5,20.5 6.6,23.5 9.6,23.6 7.2,25.4 8.1,28.3 5.5,26.6 2.9,28.3 3.8,25.4 1.4,23.6 4.4,23.5" fill="#ffffff"/>`,
  ]);
}

function kristal(e: Emotion): string {
  const k = faceKind(e);
  return svgOf([
    box(10, 31, 4, 3, 2, '#f5a623'), box(20, 31, 4, 3, 2, '#f5a623'),
    box(5, 9, 24, 23, 7, '#7e6bd6', 6),
    box(5, 4, 5, 5, 3, '#6352b8'), box(24, 4, 5, 5, 3, '#6352b8'),
    box(14, 3, 3, 4, 2, '#aef4ff'), box(18, 1, 2, 5, 2, '#d8fbff'),
    [10, 23, 14, 9, '#b7aaf0'],
    [8, 12, 8, 8, '#ffffff'], [18, 12, 8, 8, '#ffffff'],
    bigFace(face(k, 11, 21, 15, 17, 26, '#f5a623', true), 17, 18, 1.05),
    box(15, 19, 4, 3, 2, '#f5a623'),
  ]);
}

export function creatureSvg(id: CreatureId, e: Emotion): string {
  const draw: Record<CreatureId, (e: Emotion) => string> = { wobble, snurk, plons, clucky, fizz, muddle, knor, stip, copper, ijzer, kristal };
  return draw[id](e);
}
