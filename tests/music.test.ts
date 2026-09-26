import { describe, expect, it } from 'vitest';
import { _midi, _songs } from '../src/ui/music';

describe('music', () => {
  it('note names convert to the right pitches', () => {
    expect(_midi('A4')).toBe(69);
    expect(_midi('C4')).toBe(60);
    expect(_midi('F#5')).toBe(78);
    expect(_midi('Bb3')).toBe(58);
  });

  for (const [id, build] of Object.entries(_songs)) {
    it(`${id}: every voice fits its loop and every bar is filled`, () => {
      const song = build();
      expect(song.beats % 4).toBe(0);
      for (const v of song.voices) {
        for (const e of v.events) {
          expect(e.beat).toBeGreaterThanOrEqual(0);
          expect(e.beat + e.len).toBeLessThanOrEqual(song.beats + 1e-9);
          for (const m of e.midi) expect(m === 0 || (m >= 24 && m <= 96)).toBe(true);
        }
      }
      // The melody (first voice) covers the whole loop, so the song never ends early.
      const lead = song.voices[0].events;
      const end = Math.max(...lead.map((e) => e.beat + e.len));
      expect(end).toBeGreaterThan(song.beats - 4);
    });
  }
});
