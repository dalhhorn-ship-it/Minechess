/**
 * A few cartoon sound effects, made in code with Web Audio (no files, no downloads).
 * Owner request after v0.1: sounds when the creature loses a piece or cries.
 * iPad Safari only allows audio after a touch, so the context starts on the first tap.
 */
export type SoundName = 'lostPiece' | 'bigLoss' | 'cry';

const KEY = 'minechess.sound.v1';
let ctx: AudioContext | null = null;

export function soundOn(): boolean {
  try {
    return window.localStorage.getItem(KEY) !== 'off';
  } catch {
    return true;
  }
}

export function setSoundOn(on: boolean): void {
  try {
    window.localStorage.setItem(KEY, on ? 'on' : 'off');
  } catch {
    // Not remembered in private browsing; still applies for this visit.
  }
  if (!on) void ctx?.suspend();
}

/** Call once at startup: the first touch unlocks audio on iPad. */
export function installSoundUnlock(): void {
  const unlock = () => {
    try {
      ctx ??= new AudioContext();
      void ctx.resume();
    } catch {
      ctx = null;
    }
  };
  document.addEventListener('pointerdown', unlock, { capture: true });
}

/** One sliding tone with a soft start and end. */
function tone(start: number, from: number, to: number, dur: number, type: OscillatorType, volume = 0.18, wobble = 0) {
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(from, start);
  osc.frequency.exponentialRampToValueAtTime(to, start + dur);
  if (wobble) {
    const lfo = ctx.createOscillator();
    const depth = ctx.createGain();
    lfo.frequency.value = wobble;
    depth.gain.value = from * 0.06;
    lfo.connect(depth).connect(osc.frequency);
    lfo.start(start);
    lfo.stop(start + dur);
  }
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(volume, start + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);
  osc.connect(gain).connect(ctx.destination);
  osc.start(start);
  osc.stop(start + dur + 0.05);
}

export function play(name: SoundName): void {
  if (!ctx || !soundOn() || ctx.state !== 'running') return;
  const t = ctx.currentTime + 0.01;
  if (name === 'lostPiece') {
    // "Boing... oh no": a bounce down.
    tone(t, 520, 180, 0.28, 'triangle', 0.22);
    tone(t + 0.22, 300, 150, 0.3, 'square', 0.06);
  } else if (name === 'bigLoss') {
    // Sad trombone: wah wah wah waaah.
    [392, 370, 349].forEach((f, i) => tone(t + i * 0.3, f, f * 0.97, 0.28, 'sawtooth', 0.07));
    tone(t + 0.9, 330, 250, 0.8, 'sawtooth', 0.07, 6);
  } else if (name === 'cry') {
    // Three little sobs.
    [0, 0.32, 0.64].forEach((d, i) => tone(t + d, 700 - i * 60, 420 - i * 40, 0.26, 'sine', 0.16, 9));
  }
}
