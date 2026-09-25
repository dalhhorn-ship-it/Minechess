/**
 * Strategy lessons in Dutch for ages 8 and up (owner request, first part of F14).
 * Every page is a small board plus a few sentences. Positions and arrows are checked
 * by tests/lessons.test.ts so the chess on every page is correct.
 */

export type ArrowKind = 'move' | 'good' | 'bad' | 'threat';

export interface LessonArrow {
  from: string;
  to: string;
  kind: ArrowKind;
}

export interface LessonPage {
  title: string;
  text: string[];
  fen: string;
  arrows?: LessonArrow[];
  /** Squares to colour: green (good), red (bad or danger), gold (important). */
  good?: string[];
  bad?: string[];
  gold?: string[];
  /** Show the legal moves of the piece on this square as dots. */
  dotsFrom?: string;
  /** What the engine must confirm after the first 'move' arrow (tests). */
  expect?: 'check' | 'checkmate' | 'stalemate';
}

export interface Chapter {
  id: string;
  title: string;
  icon: 'pieces' | 'start' | 'smart' | 'win';
  pages: LessonPage[];
}

const a = (from: string, to: string, kind: ArrowKind = 'move'): LessonArrow => ({ from, to, kind });

export const CHAPTERS: Chapter[] = [
  {
    id: 'pieces',
    title: 'Zo lopen de stukken',
    icon: 'pieces',
    pages: [
      {
        title: 'De koning',
        text: ['De koning zet één stap, in elke richting.', 'Hij is het belangrijkste stuk: als hij gevangen wordt, is het spel voorbij.'],
        fen: '8/8/8/8/3K4/8/8/8 w - - 0 1',
        dotsFrom: 'd4',
      },
      {
        title: 'De dame',
        text: ['De dame is het sterkste stuk.', 'Ze gaat zo ver als ze wil: rechtdoor, opzij en schuin.'],
        fen: '8/8/8/8/3Q4/8/8/8 w - - 0 1',
        dotsFrom: 'd4',
      },
      {
        title: 'De toren',
        text: ['De toren gaat rechtdoor en opzij, zo ver als hij wil.', 'Hij kan niet over andere stukken springen.'],
        fen: '8/8/8/8/3R4/8/8/8 w - - 0 1',
        dotsFrom: 'd4',
      },
      {
        title: 'De loper',
        text: ['De loper gaat alleen schuin, zo ver als hij wil.', 'Een loper blijft altijd op dezelfde kleur velden.'],
        fen: '8/8/8/8/3B4/8/8/8 w - - 0 1',
        dotsFrom: 'd4',
      },
      {
        title: 'Het paard',
        text: ['Het paard springt in een L: twee stappen rechtdoor en één opzij.', 'Het is het enige stuk dat over andere stukken heen mag springen.'],
        fen: '8/8/8/8/3N4/8/8/8 w - - 0 1',
        dotsFrom: 'd4',
      },
      {
        title: 'De pion',
        text: [
          'De pion gaat één stap vooruit. Bij zijn allereerste zet mag hij ook twee stappen.',
          'Slaan doet hij schuin vooruit, zoals hier het paard op d3.',
          'Haalt een pion de overkant, dan wordt hij een dame (of een ander stuk).',
        ],
        fen: '8/8/8/8/8/3n4/4P3/8 w - - 0 1',
        dotsFrom: 'e2',
      },
      {
        title: 'Rokeren',
        text: [
          'Rokeren is een speciale zet: de koning gaat twee stappen opzij en de toren springt over hem heen.',
          'Dat mag alleen als koning en toren nog niet bewogen hebben, er niets tussen staat en de koning niet schaak staat.',
        ],
        fen: 'r3k2r/pppppppp/8/8/8/8/PPPPPPPP/R3K2R w KQkq - 0 1',
        arrows: [a('e1', 'g1'), a('h1', 'f1', 'good')],
      },
    ],
  },
  {
    id: 'start',
    title: 'Hoe begin je?',
    icon: 'start',
    pages: [
      {
        title: 'Regel 1: pak het midden',
        text: ['Zet eerst een pion naar het midden.', 'De vier gouden velden in het midden zijn het belangrijkst: wie daar staat, heeft de meeste ruimte.'],
        fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        arrows: [a('e2', 'e4')],
        gold: ['d4', 'e4', 'd5', 'e5'],
      },
      {
        title: 'Regel 2: haal je stukken eruit',
        text: ['Breng daarna je paarden en lopers naar voren.', 'Een stuk dat nog thuis staat, doet niet mee.', 'Zet in het begin elk stuk liefst maar één keer.'],
        fen: 'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2',
        arrows: [a('g1', 'f3'), a('f1', 'c4', 'good')],
      },
      {
        title: 'Regel 3: breng je koning veilig',
        text: ['Rokeer vroeg. Dan staat je koning veilig in de hoek achter zijn pionnen.', 'En je toren komt meteen mee naar het midden.'],
        fen: 'r1bqk1nr/pppp1ppp/2n5/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4',
        arrows: [a('e1', 'g1')],
        good: ['g1'],
      },
      {
        title: 'Regel 4: pas op met je dame',
        text: [
          'Haal je dame niet te vroeg naar buiten.',
          'Maar let op! Hier dreigen de witte dame en loper samen mat op f7.',
          'Zwart verdedigt slim met g6: nu wordt de dame ook nog weggejaagd.',
        ],
        fen: 'r1bqkbnr/pppp1ppp/2n5/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR b KQkq - 3 3',
        arrows: [a('g7', 'g6'), a('h5', 'f7', 'threat'), a('c4', 'f7', 'threat')],
        bad: ['f7'],
      },
    ],
  },
  {
    id: 'smart',
    title: 'Slim spelen',
    icon: 'smart',
    pages: [
      {
        title: 'Wat is een stuk waard?',
        text: [
          'Pion 1, paard 3, loper 3, toren 5, dame 9.',
          'Ruil alleen als je er niet op achteruit gaat. Een toren geven voor een paard is dus een slechte ruil.',
        ],
        fen: '8/8/8/8/8/8/8/1PNBRQ2 w - - 0 1',
      },
      {
        title: 'Drie vragen bij elke zet',
        text: [
          '1. Wat wil de ander met zijn laatste zet?',
          '2. Staat er iets van mij onbeschermd?',
          '3. Kan ik schaak geven, iets slaan of iets aanvallen?',
        ],
        fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4',
        gold: ['f7'],
      },
      {
        title: 'Laat niets hangen',
        text: ['Het witte paard op e5 wordt aangevallen en niemand beschermt het.', 'Zet het weg, of bescherm het, anders ben je het kwijt.'],
        fen: '4k3/8/2n5/4N3/8/8/8/4K3 w - - 0 1',
        arrows: [a('c6', 'e5', 'threat')],
        bad: ['e5'],
      },
      {
        title: 'De vork',
        text: ['Het paard springt naar c7 en valt twee stukken tegelijk aan: de koning en de toren.', 'De koning moet weg, en dan pakt het paard de toren.'],
        fen: 'r3k3/8/8/1N6/8/8/8/4K3 w - - 0 1',
        arrows: [a('b5', 'c7')],
        expect: 'check',
      },
      {
        title: 'Na de vork',
        text: ['Twee aanvallen tegelijk: zwart kan maar één ding redden.', 'Zoek in je eigen partijen naar zetten die twee dingen tegelijk aanvallen.'],
        fen: 'r3k3/2N5/8/8/8/8/8/4K3 b - - 1 1',
        arrows: [a('c7', 'e8', 'threat'), a('c7', 'a8', 'threat')],
        bad: ['e8', 'a8'],
      },
    ],
  },
  {
    id: 'win',
    title: 'Hoe win je?',
    icon: 'win',
    pages: [
      {
        title: 'Schaak',
        text: ['Schaak betekent: de koning wordt aangevallen.', 'De ander moet dat meteen oplossen: de koning wegzetten, iets ertussen zetten of de aanvaller slaan.'],
        fen: '4k3/8/8/8/8/8/8/R3K3 w - - 0 1',
        arrows: [a('a1', 'a8')],
        expect: 'check',
      },
      {
        title: 'Schaakmat: je wint!',
        text: ['Staat de koning schaak en kan hij nergens meer heen? Dan is het schaakmat en heb jij gewonnen.', 'Hier kan de zwarte koning niet weg: zijn eigen pionnen staan in de weg.'],
        fen: '6k1/5ppp/8/8/8/8/8/R5K1 w - - 0 1',
        arrows: [a('a1', 'a8')],
        expect: 'checkmate',
      },
      {
        title: 'Pas op voor pat!',
        text: [
          'Pat is als de ander geen enkele zet meer kan doen, maar niet schaak staat. Dan is het gelijkspel.',
          'Dg6 zou pat zijn. Dg7 is wel mat, want de koning op f6 beschermt de dame.',
        ],
        fen: '7k/8/5K2/8/8/8/8/6Q1 w - - 0 1',
        arrows: [a('g1', 'g7'), a('g1', 'g6', 'bad')],
        good: ['g7'],
        bad: ['g6'],
        expect: 'checkmate',
      },
      {
        title: 'Mat met twee torens (1)',
        text: [
          'Twee torens werken samen als een ladder.',
          'De ene toren houdt een rij dicht, de andere geeft schaak op de rij erboven. Zo duw je de koning naar de rand.',
        ],
        fen: '8/8/8/4k3/R7/8/8/1R4K1 w - - 0 1',
        arrows: [a('b1', 'b5')],
        gold: ['a4', 'b4', 'c4', 'd4', 'e4', 'f4', 'g4', 'h4'],
        expect: 'check',
      },
      {
        title: 'Mat met twee torens (2)',
        text: ['Aan de rand is het afgelopen: de toren op a7 houdt de rij dicht, de andere geeft mat.'],
        fen: '4k3/R7/8/8/8/8/8/1R4K1 w - - 0 1',
        arrows: [a('b1', 'b8')],
        expect: 'checkmate',
      },
      {
        title: 'Mat met dame en koning',
        text: [
          'Duw met je dame de koning naar een hoek, maar laat hem altijd een veld over (anders pat!).',
          'Breng dan je eigen koning dichtbij en geef mat.',
        ],
        fen: 'k7/8/1K6/8/8/8/8/2Q5 w - - 0 1',
        arrows: [a('c1', 'c8')],
        expect: 'checkmate',
      },
      {
        title: 'Nu jij!',
        text: ['Oefen dit tegen Wobble en Clucky.', 'Kijk bij elke zet: wat wil de ander, staat er iets van mij onbeschermd, en kan ik schaak geven?'],
        fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      },
    ],
  },
];
