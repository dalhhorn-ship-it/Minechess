import type { CreatureId } from '../ai/creatures';
import type { IconName } from './icons';

/** Dutch speech lines from docs/design/creatures.md (v0.1 is Dutch only). */
export type LineKey = 'idle' | 'thinking' | 'happy' | 'sad' | 'sadResign' | 'celebrating' | 'win' | 'loss' | 'draw' | 'oops';

export const LINE_ICON: Record<LineKey, IconName> = {
  idle: 'hand', thinking: 'think', happy: 'star', sad: 'rain', sadResign: 'flag', celebrating: 'trophy',
  win: 'handshake', loss: 'handshake', draw: 'handshake', oops: 'rewind',
};

export const LINES: Record<CreatureId, Record<LineKey, string[]>> = {
  wobble: {
    idle: ['Jij bent! Boing!', 'Wiebel wiebel, jouw zet!'],
    thinking: ['Hmm... iene, miene...', 'Welke? Deze dan?'],
    happy: ['Ooh, ik heb er een!', 'Boing! Geluksstuiter!'],
    sad: ['Plets. Jij hebt gewonnen!', 'Ik smelt een beetje.'],
    sadResign: ['Ik geef op! Jij wint!'],
    celebrating: ['Ik won? Hihi!', 'Stuiter stuiter, gewonnen!'],
    win: ['Jij speelt super! Nog eens?'],
    loss: ['Leuk potje! Nog eentje?'],
    draw: ['Gelijk! Boing boing!'],
    oops: ['Boing! Terug maar!'],
  },
  clucky: {
    idle: ['Jij bent. Voorzichtig hoor!', 'Tok tok... ik wacht!'],
    thinking: ['Waar is het veilig?', 'Verstoppen! Nee, wacht... hmm.'],
    happy: ['Pik! Hebbes!', 'Tok! Deed ik dat?'],
    sad: ['Oh jee. Je hebt me!', 'Overal veren. Jij wint!'],
    sadResign: ['Ik geef op! Tok!'],
    celebrating: ['Ik won? Ik WON! Tok!', 'Blije kippendans!'],
    win: ['Jij was zo dapper!'],
    loss: ['Goed gespeeld! Nog eens?'],
    draw: ['Niemand won. Pfoe!'],
    oops: ['Pfoe! Weer terug!'],
  },
  copper: {
    idle: ['Jij bent. Ik kijk goed!', 'Biep. Jouw zet, vriend.'],
    thinking: ['Biep boep... even rekenen...', 'Even goed kijken.'],
    happy: ['Biep! Experiment gelukt!', 'Hebbes! Interessant!'],
    sad: ['Biep... Jij wint. Goed gespeeld.', 'Notitie: meer oefenen.'],
    sadResign: ['Biep... ik geef op.'],
    celebrating: ['Biep biep! Ik won!', 'Mijn lampjes dansen!'],
    win: ['Jij leerde mij iets!'],
    loss: ['Goed potje! Nog een test?'],
    draw: ['Uitslag: gelijk! Interessant!'],
    oops: ['Terugspoelen... biep!'],
  },
};
