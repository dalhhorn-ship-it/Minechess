import type { CreatureId } from '../ai/creatures';
import type { IconName } from './icons';

/** Dutch speech lines from docs/design/creatures.md (v0.1 is Dutch only). */
export type LineKey =
  | 'idle' | 'thinking' | 'happy' | 'sad' | 'sadResign' | 'celebrating' | 'win' | 'loss' | 'draw' | 'oops'
  | 'worried' | 'surprised' | 'crying' | 'laughing';

export const LINE_ICON: Record<LineKey, IconName> = {
  idle: 'hand', thinking: 'think', happy: 'star', sad: 'rain', sadResign: 'flag', celebrating: 'trophy',
  win: 'handshake', loss: 'handshake', draw: 'handshake', oops: 'rewind',
  worried: 'sweat', surprised: 'burst', crying: 'rain', laughing: 'star',
};

export const LINES: Record<CreatureId, Record<LineKey, string[]>> = {
  wobble: {
    worried: ['Oei, wiebel wiebel! Mijn stukje staat in gevaar!', 'Iek! Waar moet ik nu naartoe stuiteren?'],
    surprised: ['Wauw! Hoe deed je dat nou? Dat zag ik echt niet aankomen!', 'Boing?! Dat was slim, zeg!'],
    crying: ['Boehoe! Mijn mooiste stuk is weg... snif snif.', 'Snif... ik smelt helemaal van verdriet. Boehoehoe!'],
    laughing: ['Hihihi! Die pak ik, boing boing!', 'Hahaha! Wat een geluksstuiter was dat!'],
    idle: ['Jij bent! Boing!', 'Wiebel wiebel, jouw zet! Ik ben benieuwd wat je doet.'],
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
    worried: ['Aaah! Rennen, rennen! Mijn veren staan recht overeind!', 'Tok tok... mijn stuk wordt aangevallen, help!'],
    surprised: ['TOK?! Wauw, wat slim van jou! Dat zag ik niet!', 'Iek! Mijn eierschaal vloog er bijna af van schrik!'],
    crying: ['Boehoe! Mijn mooie stuk is weg... tok... snif.', 'Snif snif, ik verstop me even in mijn ei.'],
    laughing: ['Tok tok tok! Hebbes, en wat voor een!', 'Hahaha! Pik! Die had ik zelf niet verwacht!'],
    idle: ['Jij bent. Voorzichtig hoor!', 'Tok tok... ik wacht. Maar niet te eng doen, hè?'],
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
    worried: ['Fout! Fout! Mijn stuk staat in gevaar, biep!', 'Biep? Mijn sensoren zeggen: dit is niet goed.'],
    surprised: ['Wauw! Die zet moet ik opslaan in mijn geheugen!', 'Nieuwe zet gezien! Heel slim, dat ga ik onthouden.'],
    crying: ['Biep... boe... mijn lampjes worden er verdrietig van.', 'Olielekje... nee, dat is een traan. Snif, biep.'],
    laughing: ['Biep biep haha! Experiment geslaagd!', 'Hahaha! Mijn antenne gloeit helemaal van plezier!'],
    idle: ['Jij bent. Ik kijk goed!', 'Biep. Jouw zet, vriend. Mijn sensoren staan klaar.'],
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
