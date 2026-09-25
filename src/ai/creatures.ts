export type CreatureId = 'wobble' | 'clucky' | 'copper';

export interface CreatureInfo {
  id: CreatureId;
  name: string;
  /** On screen descriptor in Dutch. */
  title: string;
  level: number;
  stars: number;
  /** Levels 1 and 2 help a losing game end in a win for the child. */
  helpsChildWin: boolean;
}

export const CREATURES: CreatureInfo[] = [
  { id: 'wobble', name: 'Wobble', title: 'de Drilblok', level: 1, stars: 1, helpsChildWin: true },
  { id: 'clucky', name: 'Clucky', title: 'de Blokkip', level: 2, stars: 1, helpsChildWin: true },
  { id: 'copper', name: 'Copper Bot', title: 'de Koperbot', level: 5, stars: 3, helpsChildWin: false },
];

export const creatureById = (id: CreatureId) => CREATURES.find((c) => c.id === id)!;
