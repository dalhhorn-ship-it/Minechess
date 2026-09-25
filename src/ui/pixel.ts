/** Pixel art helpers: every graphic is drawn in code from small character grids. */

export type Palette = Record<string, string>;

const INK = '#1d2b4f';

export function shade(hex: string, f: number): string {
  const n = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return '#' + n.map((v) => Math.max(0, Math.min(255, Math.round(f > 0 ? v + (255 - v) * f : v * (1 + f)))).toString(16).padStart(2, '0')).join('');
}

/** A 3D box: front rectangle, top and right side as slanted faces, with a thick outline and a few texture specks. */
export function box(x: number, y: number, w: number, h: number, d: number, color: string, specks = 0): string {
  const top = `${x},${y} ${x + d},${y - d} ${x + w + d},${y - d} ${x + w},${y}`;
  const side = `${x + w},${y} ${x + w + d},${y - d} ${x + w + d},${y + h - d} ${x + w},${y + h}`;
  const line = `stroke="${INK}" stroke-width="0.7" stroke-linejoin="round"`;
  let tex = '';
  let seed = Math.round(x * 31 + y * 17 + w);
  for (let i = 0; i < specks; i++) {
    seed = (seed * 16807) % 2147483647;
    const sx = x + 1 + (seed % Math.max(1, w - 3));
    seed = (seed * 16807) % 2147483647;
    const sy = y + 1 + (seed % Math.max(1, h - 3));
    tex += `<rect x="${sx}" y="${sy}" width="1.2" height="1.2" fill="${shade(color, -0.12)}"/>`;
  }
  return `<polygon points="${side}" fill="${shade(color, -0.28)}" ${line}/>` +
    `<polygon points="${top}" fill="${shade(color, 0.35)}" ${line}/>` +
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${color}" ${line}/>` + tex;
}


/** Turns a character grid into a crisp SVG. '.' is transparent. */
export function pixelSvg(rows: string[], palette: Palette, cls = ''): string {
  const h = rows.length;
  const w = Math.max(...rows.map((r) => r.length));
  let rects = '';
  rows.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const ch = row[x];
      let run = 1;
      while (x + run < row.length && row[x + run] === ch) run++;
      const fill = palette[ch];
      if (ch !== '.' && fill) rects += `<rect x="${x}" y="${y}" width="${run}" height="1" fill="${fill}"/>`;
      x += run;
    }
  });
  return `<svg class="${cls}" viewBox="0 0 ${w} ${h}" shape-rendering="crispEdges" aria-hidden="true">${rects}</svg>`;
}

/** Seeded noise texture as a data URL, so blocks look hand placed rather than flat. */
export function texture(base: string, spread: number, seed: number, specks: { color: string; chance: number }[] = []): string {
  const size = 16;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  let s = seed;
  const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(base.slice(i, i + 2), 16));
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const speck = specks.find((sp) => rnd() < sp.chance);
      if (speck) {
        ctx.fillStyle = speck.color;
      } else {
        const d = Math.round((rnd() - 0.5) * 2 * spread);
        ctx.fillStyle = `rgb(${r + d},${g + d},${b + d})`;
      }
      ctx.fillRect(x, y, 1, 1);
    }
  }
  return canvas.toDataURL();
}

/** Registers the block textures as CSS variables. */
export function installTextures(): void {
  const root = document.documentElement.style;
  const set = (name: string, url: string) => root.setProperty(name, `url(${url})`);
  set('--tex-sand', texture('#f3e9d2', 7, 11));
  set('--tex-stone', texture('#8c9db5', 8, 23));
  set('--tex-dirt', texture('#8a5a3b', 14, 5, [{ color: '#6d4429', chance: 0.08 }, { color: '#a87250', chance: 0.05 }]));
  set('--tex-grass', texture('#5fae4a', 12, 7, [{ color: '#4a9139', chance: 0.12 }]));
  set('--tex-plank', planks());
  set('--tex-cobble', texture('#7b7f86', 18, 31, [{ color: '#5d6168', chance: 0.12 }, { color: '#9ca0a6', chance: 0.08 }]));
  set('--tex-framestone', texture('#46607f', 10, 41, [{ color: '#3a506b', chance: 0.1 }]));
}

function planks(): string {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 16;
  const ctx = canvas.getContext('2d')!;
  let s = 99;
  const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  for (let y = 0; y < 16; y++) {
    for (let x = 0; x < 16; x++) {
      const d = Math.round((rnd() - 0.5) * 16);
      ctx.fillStyle = `rgb(${196 + d},${150 + d},${96 + d})`;
      ctx.fillRect(x, y, 1, 1);
    }
  }
  ctx.fillStyle = '#8f6a3e';
  for (const y of [3, 7, 11, 15]) ctx.fillRect(0, y, 16, 1);
  for (const [x, y] of [[5, 0], [12, 4], [3, 8], [9, 12]]) ctx.fillRect(x, y, 1, 3);
  return canvas.toDataURL();
}

/** Extrudes a character grid into a 3D block shape: solid stacked layers for depth, light top edges, crisp front. */
export function extrudedSvg(rows: string[], colors: Record<string, string>, top: string, side: string, depth: number, cls = ''): string {
  const filled = (x: number, y: number) => y >= 0 && y < rows.length && x >= 0 && x < rows[y].length && rows[y][x] !== '.';
  let silhouette = '';
  let tops = '';
  let front = '';
  rows.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      if (row[x] === '.') { x++; continue; }
      let run = 1;
      while (x + run < row.length && row[x + run] !== '.') run++;
      silhouette += `<rect x="${x}" y="${y}" width="${run}" height="1.05"/>`;
      x += run;
    }
    for (let cx = 0; cx < row.length; cx++) {
      const ch = row[cx];
      if (ch === '.') continue;
      if (!filled(cx, y - 1)) tops += `<polygon points="${cx},${y} ${cx + depth},${y - depth} ${cx + 1 + depth},${y - depth} ${cx + 1.02},${y}"/>`;
      front += `<rect x="${cx}" y="${y}" width="1.03" height="1.03" fill="${colors[ch]}"/>`;
    }
  });
  const steps = Math.ceil(depth / 0.15);
  let layers = '';
  for (let i = steps; i >= 1; i--) {
    const o = (depth * i) / steps;
    layers += `<g transform="translate(${o} ${-o})">${silhouette}</g>`;
  }
  const w = Math.max(...rows.map((r) => r.length));
  return `<svg class="${cls}" viewBox="0 ${-depth} ${w + depth} ${rows.length + depth}" aria-hidden="true">` +
    `<g fill="${side}">${layers}</g><g fill="${top}">${tops}</g><g shape-rendering="crispEdges">${front}</g></svg>`;
}
