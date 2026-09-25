import type { CreatureId } from '../ai/creatures';

export interface HallEntry {
  name: string;
  score: number;
  creature: CreatureId;
  /** ISO date, for ties: the older score stays higher. */
  date: string;
}

export const HALL_SIZE = 10;
const KEY = 'minechess.hallOfFame.v1';

/** Minimal storage so tests can use an in memory version. */
export interface KeyValue {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

function defaultStore(): KeyValue | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function loadHall(store: KeyValue | null = defaultStore()): HallEntry[] {
  try {
    const raw = store?.getItem(KEY);
    const list = raw ? (JSON.parse(raw) as HallEntry[]) : [];
    return Array.isArray(list) ? list.filter((e) => typeof e?.score === 'number').slice(0, HALL_SIZE) : [];
  } catch {
    return [];
  }
}

export function qualifies(score: number, hall: HallEntry[]): boolean {
  return score > 0 && (hall.length < HALL_SIZE || score > hall[hall.length - 1].score);
}

/** Inserts the entry in score order and returns the new list and the entry's place (0 based), or -1. */
export function addToHall(entry: HallEntry, hall: HallEntry[]): { hall: HallEntry[]; place: number } {
  if (!qualifies(entry.score, hall)) return { hall, place: -1 };
  const next = [...hall];
  let place = next.findIndex((e) => entry.score > e.score);
  if (place === -1) place = next.length;
  next.splice(place, 0, entry);
  return { hall: next.slice(0, HALL_SIZE), place };
}

export function saveHall(hall: HallEntry[], store: KeyValue | null = defaultStore()): void {
  try {
    store?.setItem(KEY, JSON.stringify(hall));
  } catch {
    // Storage full or blocked (private browsing): the hall of fame just is not kept.
  }
}
