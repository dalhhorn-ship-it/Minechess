/**
 * Background music, composed for Minechess and synthesised in code with Web Audio (no files).
 * Style: retro adventure chiptunes and calm block world piano. All melodies are original;
 * nothing is copied from existing games.
 */
import { audioContext } from './sound';

export type SongId = 'home' | 'adventure' | 'workshop' | 'arcade';
export type JingleId = 'win' | 'loss';

type Wave = 'piano' | 'pad' | 'lead' | 'pulse' | 'bass' | 'hat' | 'kick' | 'snare';

interface NoteEvent {
  beat: number;
  midi: number[];
  len: number;
}

interface Voice {
  wave: Wave;
  gain: number;
  events: NoteEvent[];
}

interface Song {
  bpm: number;
  beats: number;
  echo: number;
  voices: Voice[];
}

const KEY = 'minechess.music.v1';

// ---------- notation helpers ----------

const NOTE: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };

function midi(name: string): number {
  const m = /^([A-G])([#b]?)(-?\d)$/.exec(name);
  if (!m) throw new Error(`Bad note ${name}`);
  return (Number(m[3]) + 1) * 12 + NOTE[m[1]] + (m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0);
}

/** Parses "C4:1 E4+G4:2 -:1" (note or chord : length in beats, "-" is a rest) from a start beat. */
function seq(text: string, start = 0): NoteEvent[] {
  const out: NoteEvent[] = [];
  let beat = start;
  for (const token of text.trim().split(/\s+/)) {
    const [notes, len] = token.split(':');
    const l = Number(len);
    if (notes !== '-') out.push({ beat, midi: notes.split('+').map(midi), len: l });
    beat += l;
  }
  return out;
}

/** Repeats a pattern of events every `every` beats, `times` times. */
function repeat(events: NoteEvent[], every: number, times: number): NoteEvent[] {
  const out: NoteEvent[] = [];
  for (let i = 0; i < times; i++) for (const e of events) out.push({ ...e, beat: e.beat + i * every });
  return out;
}

/** Broken chord in even steps over one bar per chord. */
function arpeggio(chords: string[][], step: number, beatsPerChord = 4, start = 0): NoteEvent[] {
  const out: NoteEvent[] = [];
  chords.forEach((chord, i) => {
    const pattern = [...chord, ...chord.slice(1, -1).reverse()];
    for (let b = 0, k = 0; b < beatsPerChord; b += step, k++) {
      out.push({ beat: start + i * beatsPerChord + b, midi: [midi(pattern[k % pattern.length])], len: step });
    }
  });
  return out;
}

function drums(bars: number, kick: number[], snare: number[], hats: number[]): { k: NoteEvent[]; s: NoteEvent[]; h: NoteEvent[] } {
  const mk = (beats: number[]) => repeat(beats.map((b) => ({ beat: b, midi: [0], len: 0.25 })), 4, bars);
  return { k: mk(kick), s: mk(snare), h: mk(hats) };
}

// ---------- the songs ----------

/** "Blokkenland": slow, dreamy piano with echo (start screen and lessons). */
function home(): Song {
  const chords = [['F3', 'A3', 'C4', 'E4'], ['A3', 'C4', 'E4', 'G4'], ['C3', 'E3', 'G3', 'B3'], ['G3', 'B3', 'D4', 'E4']];
  const arp = arpeggio([...chords, ...chords, ...chords, ...chords], 1);
  const melody = [
    ...seq('-:16 C5:2 E5:1 G5:1 A5:3 -:1 G5:2 E5:2 D5:3 -:1 E5:2 G5:2 E5:4', 0),
    ...seq('C5:1 D5:1 E5:2 -:2 A4:2 C5:3 -:1 E5:2 D5:2 B4:4 -:4', 40),
  ];
  const low = seq('F2:4 A2:4 C2:4 G2:4 F2:4 A2:4 C2:4 G2:4 F2:4 A2:4 C2:4 G2:4 F2:4 A2:4 C2:4 G2:4');
  return {
    bpm: 66, beats: 64, echo: 0.35,
    voices: [
      { wave: 'piano', gain: 0.5, events: arp },
      { wave: 'piano', gain: 0.75, events: melody },
      { wave: 'pad', gain: 0.35, events: low },
    ],
  };
}

/** "Avontuur": a bright retro adventure theme in D (games against Wobble and Clucky). */
function adventure(): Song {
  const a = 'D5:1.5 A4:0.5 A4:1 D5:0.5 E5:0.5 F#5:2 E5:1 D5:1 E5:1.5 C5:0.5 G4:2 D5:1 B4:1 G4:2';
  const b1 = 'A4:1 D5:1 F#5:1 A5:1 G5:1.5 F#5:0.5 E5:2 D5:1 E5:1 F#5:1 G5:1 A5:3 -:1';
  const b2 = 'F#5:1 E5:1 D5:1 A4:1 B4:1 D5:1 G5:2 E5:1 F#5:1 G5:1 E5:1 D5:3 -:1';
  const lead = seq(`${a} ${b1} ${a} ${b2}`);
  const roots = ['D', 'D', 'C', 'G', 'D', 'A', 'G', 'A', 'D', 'D', 'C', 'G', 'D', 'G', 'A', 'D'];
  const bass = roots.flatMap((r, i) => seq(`${r}2:1 ${r}3:1 ${r}2:1 ${r}3:1`, i * 4));
  const chordOf: Record<string, string[]> = {
    D: ['D4', 'F#4', 'A4'], C: ['C4', 'E4', 'G4'], G: ['G3', 'B3', 'D4'], A: ['A3', 'C#4', 'E4'],
  };
  const arp = arpeggio(roots.map((r) => chordOf[r]), 0.5);
  const d = drums(16, [0, 2], [1, 3], [0.5, 1.5, 2.5, 3.5]);
  return {
    bpm: 118, beats: 64, echo: 0.12,
    voices: [
      { wave: 'lead', gain: 0.55, events: lead },
      { wave: 'bass', gain: 0.7, events: bass },
      { wave: 'pulse', gain: 0.22, events: arp },
      { wave: 'kick', gain: 0.5, events: d.k },
      { wave: 'snare', gain: 0.18, events: d.s },
      { wave: 'hat', gain: 0.1, events: d.h },
    ],
  };
}

/** "Koperwerkplaats": a bouncy, slightly tense tune in A minor (games against Copper Bot). */
function workshop(): Song {
  const lead = seq(
    'A4:0.5 C5:0.5 E5:0.5 D5:0.5 C5:1 A4:1 ' +
    'F4:0.5 A4:0.5 C5:0.5 B4:0.5 A4:2 ' +
    'G4:0.5 B4:0.5 D5:0.5 C5:0.5 B4:1 G4:1 ' +
    'E4:0.5 G#4:0.5 B4:0.5 D5:0.5 E5:2 ' +
    'A5:1 G5:0.5 E5:0.5 F5:1 E5:0.5 C5:0.5 ' +
    'D5:1 C5:0.5 A4:0.5 B4:2 ' +
    'C5:0.5 D5:0.5 E5:0.5 G5:0.5 F5:1 D5:1 ' +
    'E5:1 B4:1 A4:2',
  );
  const roots = ['A', 'F', 'G', 'E', 'A', 'F', 'G', 'E'];
  const bass = roots.flatMap((r, i) => seq(`${r}2:0.5 ${r}3:0.5 ${r}2:0.5 ${r}3:0.5 ${r}2:0.5 ${r}3:0.5 ${r}2:0.5 ${r}3:0.5`, i * 4));
  const chordOf: Record<string, string[]> = {
    A: ['A3', 'C4', 'E4'], F: ['F3', 'A3', 'C4'], G: ['G3', 'B3', 'D4'], E: ['E3', 'G#3', 'B3'],
  };
  const arp = arpeggio(roots.map((r) => chordOf[r]), 0.25);
  const d = drums(8, [0, 1.5, 2], [1, 3], [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5]);
  return {
    bpm: 128, beats: 32, echo: 0.1,
    voices: [
      { wave: 'lead', gain: 0.5, events: lead },
      { wave: 'bass', gain: 0.65, events: bass },
      { wave: 'pulse', gain: 0.14, events: arp },
      { wave: 'kick', gain: 0.5, events: d.k },
      { wave: 'snare', gain: 0.18, events: d.s },
      { wave: 'hat', gain: 0.07, events: d.h },
    ],
  };
}

/** "Arcade": a short, upbeat loop for the hall of fame. */
function arcade(): Song {
  const lead = seq('C5:0.5 E5:0.5 G5:0.5 C6:0.5 B5:0.5 G5:0.5 E5:1 F5:0.5 A5:0.5 C6:0.5 A5:0.5 G5:2 ' +
    'E5:0.5 G5:0.5 C6:0.5 E6:0.5 D6:0.5 B5:0.5 G5:1 A5:0.5 G5:0.5 F5:0.5 D5:0.5 C5:2');
  const bass = seq('C3:1 C3:1 G2:1 G2:1 F2:1 F2:1 G2:1 G2:1 C3:1 C3:1 G2:1 G2:1 F2:1 G2:1 C3:2');
  const d = drums(4, [0, 2], [1, 3], [0.5, 1.5, 2.5, 3.5]);
  return {
    bpm: 140, beats: 16, echo: 0.1,
    voices: [
      { wave: 'pulse', gain: 0.5, events: lead },
      { wave: 'bass', gain: 0.6, events: bass },
      { wave: 'kick', gain: 0.45, events: d.k },
      { wave: 'snare', gain: 0.15, events: d.s },
      { wave: 'hat', gain: 0.08, events: d.h },
    ],
  };
}

const BUILD: Record<SongId, () => Song> = { home, adventure, workshop, arcade };

const JINGLES: Record<JingleId, { bpm: number; voices: Voice[] }> = {
  win: {
    bpm: 150,
    voices: [
      { wave: 'lead', gain: 0.6, events: seq('C5:0.5 E5:0.5 G5:0.5 C6:1.5 A5:0.5 B5:0.5 C6:3') },
      { wave: 'bass', gain: 0.7, events: seq('C3:1.5 G2:1.5 F2:1 G2:1 C3:3') },
      { wave: 'pulse', gain: 0.3, events: seq('E4+G4:1.5 G4+B4:1.5 F4+A4:1 G4+B4:1 E4+G4+C5:3') },
    ],
  },
  loss: {
    bpm: 96,
    voices: [
      { wave: 'piano', gain: 0.7, events: seq('G4:1 F4:1 E4:1 D4:1 C4:3') },
      { wave: 'pad', gain: 0.4, events: seq('C3+E3:4 C3+G3:3') },
    ],
  },
};

// ---------- synthesis ----------

let bus: GainNode | null = null;
let echoSend: GainNode | null = null;
let pulseWave: PeriodicWave | null = null;
let noise: AudioBuffer | null = null;

function setup(ctx: AudioContext) {
  if (bus) return;
  bus = ctx.createGain();
  bus.gain.value = 0.11;
  bus.connect(ctx.destination);
  // A simple echo for a bit of space.
  echoSend = ctx.createGain();
  const delay = ctx.createDelay(1);
  delay.delayTime.value = 0.33;
  const feedback = ctx.createGain();
  feedback.gain.value = 0.3;
  echoSend.connect(delay);
  delay.connect(feedback).connect(delay);
  delay.connect(bus);
  // 25 percent pulse wave, the classic handheld console sound.
  const n = 32;
  const real = new Float32Array(n);
  const imag = new Float32Array(n);
  for (let i = 1; i < n; i++) imag[i] = (2 / (i * Math.PI)) * Math.sin(i * Math.PI * 0.25);
  pulseWave = ctx.createPeriodicWave(real, imag);
  noise = ctx.createBuffer(1, ctx.sampleRate * 0.5, ctx.sampleRate);
  const data = noise.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
}

const hz = (m: number) => 440 * Math.pow(2, (m - 69) / 12);

function voiceNote(ctx: AudioContext, wave: Wave, t: number, m: number, dur: number, vol: number, echo: number) {
  if (!bus || !echoSend) return;
  const out = ctx.createGain();
  out.connect(bus);
  if (echo > 0) {
    const send = ctx.createGain();
    send.gain.value = echo;
    out.connect(send).connect(echoSend);
  }
  const env = out.gain;
  if (wave === 'hat' || wave === 'snare') {
    const src = ctx.createBufferSource();
    src.buffer = noise;
    const filter = ctx.createBiquadFilter();
    filter.type = wave === 'hat' ? 'highpass' : 'bandpass';
    filter.frequency.value = wave === 'hat' ? 7000 : 1800;
    src.connect(filter).connect(out);
    const len = wave === 'hat' ? 0.05 : 0.14;
    env.setValueAtTime(vol, t);
    env.exponentialRampToValueAtTime(0.0001, t + len);
    src.start(t);
    src.stop(t + len + 0.02);
    return;
  }
  const osc = ctx.createOscillator();
  if (wave === 'kick') {
    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.exponentialRampToValueAtTime(40, t + 0.12);
    env.setValueAtTime(vol, t);
    env.exponentialRampToValueAtTime(0.0001, t + 0.18);
    osc.connect(out);
    osc.start(t);
    osc.stop(t + 0.2);
    return;
  }
  osc.frequency.value = hz(m);
  if (wave === 'pulse' && pulseWave) osc.setPeriodicWave(pulseWave);
  else osc.type = wave === 'lead' ? 'square' : wave === 'pad' || wave === 'piano' ? (wave === 'pad' ? 'sine' : 'triangle') : 'triangle';
  osc.connect(out);
  const end = t + dur;
  env.setValueAtTime(0.0001, t);
  if (wave === 'piano') {
    // Soft attack, long natural decay, like a felt piano.
    env.exponentialRampToValueAtTime(vol, t + 0.01);
    env.exponentialRampToValueAtTime(0.0001, t + Math.min(2.4, dur * 2.2));
    osc.start(t);
    osc.stop(t + Math.min(2.5, dur * 2.3));
    return;
  }
  const attack = wave === 'pad' ? 0.25 : 0.01;
  env.exponentialRampToValueAtTime(vol, t + attack);
  env.setValueAtTime(vol * (wave === 'lead' ? 0.7 : 1), Math.max(t + attack, end - 0.06));
  env.exponentialRampToValueAtTime(0.0001, end + (wave === 'pad' ? 0.4 : 0.02));
  if (wave === 'lead' && dur > 0.4) {
    // A little vibrato on long lead notes.
    const lfo = ctx.createOscillator();
    const depth = ctx.createGain();
    lfo.frequency.value = 5.5;
    depth.gain.setValueAtTime(0, t);
    depth.gain.linearRampToValueAtTime(hz(m) * 0.01, t + 0.3);
    lfo.connect(depth).connect(osc.frequency);
    lfo.start(t);
    lfo.stop(end + 0.1);
  }
  osc.start(t);
  osc.stop(end + 0.5);
}

// ---------- player ----------

let current: { id: SongId; song: Song; start: number; scheduledTo: number; timer: number } | null = null;
let wanted: SongId | null = null;

export function musicOn(): boolean {
  try {
    return window.localStorage.getItem(KEY) !== 'off';
  } catch {
    return true;
  }
}

export function setMusicOn(on: boolean): void {
  try {
    window.localStorage.setItem(KEY, on ? 'on' : 'off');
  } catch {
    // Not remembered in private browsing.
  }
  if (on && wanted) playSong(wanted);
  else stopSong();
}

function schedule() {
  const ctx = audioContext();
  if (!ctx || !current) return;
  const { song } = current;
  const spb = 60 / song.bpm;
  const ahead = ctx.currentTime + 0.25;
  while (current.start + current.scheduledTo * spb < ahead) {
    const from = current.scheduledTo;
    const to = from + 0.25;
    const loop = Math.floor(from / song.beats);
    const inLoopFrom = from - loop * song.beats;
    for (const v of song.voices) {
      for (const e of v.events) {
        if (e.beat >= inLoopFrom && e.beat < inLoopFrom + 0.25) {
          const t = current.start + (loop * song.beats + e.beat) * spb;
          for (const m of e.midi) voiceNote(ctx, v.wave, t, m, e.len * spb * 0.95, v.gain, song.echo);
        }
      }
    }
    current.scheduledTo = to;
  }
}

/** Starts a song (or keeps it playing if it already is). Waits for the first tap on iPad. */
export function playSong(id: SongId): void {
  wanted = id;
  if (!musicOn()) return;
  const ctx = audioContext();
  if (!ctx || ctx.state !== 'running') return;
  if (current?.id === id) return;
  stopSong();
  setup(ctx);
  if (bus) bus.gain.setTargetAtTime(0.11, ctx.currentTime, 0.3);
  current = { id, song: BUILD[id](), start: ctx.currentTime + 0.1, scheduledTo: 0, timer: 0 };
  current.timer = window.setInterval(schedule, 50);
  schedule();
}

export function stopSong(): void {
  if (!current) return;
  clearInterval(current.timer);
  current = null;
  const ctx = audioContext();
  // Fade out whatever is still sounding.
  if (ctx && bus) {
    bus.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.15);
    const old = bus;
    bus = null;
    echoSend = null;
    setTimeout(() => old.disconnect(), 800);
  }
}

/** Plays a short jingle over a quiet pause in the music, then the song goes on. */
export function playJingle(id: JingleId): void {
  const ctx = audioContext();
  if (!ctx || ctx.state !== 'running' || !musicOn()) return;
  const song = wanted;
  stopSong();
  setup(ctx);
  const j = JINGLES[id];
  const spb = 60 / j.bpm;
  const t0 = ctx.currentTime + 0.05;
  let length = 0;
  for (const v of j.voices) {
    for (const e of v.events) {
      for (const m of e.midi) voiceNote(ctx, v.wave, t0 + e.beat * spb, m, e.len * spb * 0.95, v.gain * 1.4, 0.2);
      length = Math.max(length, (e.beat + e.len) * spb);
    }
  }
  window.setTimeout(() => {
    if (song && wanted === song) {
      current = null;
      playSong(song);
    }
  }, (length + 1.2) * 1000);
}

/** Called when the first tap unlocks audio, so the wanted song can begin. */
export function resumeWantedSong(): void {
  if (wanted) playSong(wanted);
}

/** Renders a song (or jingle) offline, for previews and checks outside the game. */
export async function renderPreview(id: SongId | JingleId, seconds: number, sampleRate = 44100): Promise<AudioBuffer> {
  const off = new OfflineAudioContext(2, Math.ceil(seconds * sampleRate), sampleRate);
  const saved = { bus, echoSend, pulseWave, noise };
  bus = null;
  setup(off as unknown as AudioContext);
  const isJingle = id === 'win' || id === 'loss';
  const song: Song = isJingle ? { bpm: JINGLES[id].bpm, beats: 1e9, echo: 0.2, voices: JINGLES[id].voices } : BUILD[id as SongId]();
  const spb = 60 / song.bpm;
  for (let loop = 0; loop * (isJingle ? 1e9 : song.beats) * spb < seconds; loop++) {
    for (const v of song.voices) {
      for (const e of v.events) {
        const t = (loop * song.beats + e.beat) * spb + 0.05;
        if (t > seconds) continue;
        for (const m of e.midi) voiceNote(off as unknown as AudioContext, v.wave, t, m, e.len * spb * 0.95, v.gain * (isJingle ? 1.4 : 1), song.echo);
      }
    }
    if (isJingle) break;
  }
  const buffer = await off.startRendering();
  ({ bus, echoSend, pulseWave, noise } = saved);
  return buffer;
}

/** For tests: the parsed songs. */
export const _songs = BUILD;
export const _midi = midi;
