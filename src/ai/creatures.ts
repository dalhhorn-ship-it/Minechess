export type CreatureId =
  | 'wobble' | 'snurk' | 'plons' | 'clucky' | 'fizz' | 'muddle'
  | 'knor' | 'stip' | 'copper' | 'ijzer' | 'kristal';

export interface CreatureInfo {
  id: CreatureId;
  name: string;
  /** On screen descriptor in Dutch. */
  title: string;
  level: number;
  stars: number;
  /** The very easy creatures help a losing game end in a win for the child. */
  helpsChildWin: boolean;
}

/** Ordered from easiest to hardest; the start screen shows them in this order. */
export const CREATURES: CreatureInfo[] = [
  { id: 'wobble', name: 'Wobble', title: 'de Drilblok', level: 1, stars: 1, helpsChildWin: true },
  { id: 'snurk', name: 'Snurk', title: 'het Slaapschaap', level: 1, stars: 1, helpsChildWin: true },
  { id: 'plons', name: 'Plons', title: 'de Springkikker', level: 1, stars: 1, helpsChildWin: true },
  { id: 'clucky', name: 'Clucky', title: 'de Blokkip', level: 2, stars: 1, helpsChildWin: true },
  { id: 'fizz', name: 'Fizz', title: 'de Bruisblok', level: 2, stars: 1, helpsChildWin: true },
  { id: 'muddle', name: 'Muddle', title: 'de Mol', level: 2, stars: 1, helpsChildWin: true },
  { id: 'knor', name: 'Knor', title: 'het Spaarvarken', level: 3, stars: 2, helpsChildWin: false },
  { id: 'stip', name: 'Stip', title: 'het Lieveheersbeestje', level: 4, stars: 2, helpsChildWin: false },
  { id: 'copper', name: 'Copper Bot', title: 'de Koperbot', level: 5, stars: 3, helpsChildWin: false },
  { id: 'ijzer', name: 'IJzerwachter', title: 'de Beschermer', level: 5, stars: 3, helpsChildWin: false },
  { id: 'kristal', name: 'Kristal', title: 'de Uil', level: 6, stars: 3, helpsChildWin: false },
];

export const creatureById = (id: CreatureId) => CREATURES.find((c) => c.id === id)!;
