/** Pixel art helpers: every graphic is drawn in code from small character grids. */

export type Palette = Record<string, string>;

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
