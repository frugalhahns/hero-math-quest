/* Everything you can walk up to and interact with, placed by hand on the tile
   maps in content/maps.js. Entities occupy their tile and block movement, so
   you interact by standing next to one and facing it.
     doc     -- a document with comprehension questions
     sign    -- flavour text, sometimes carrying a detail a document relies on
     dig     -- a spot that may or may not contain something
     item    -- a thing you can pick up, possibly more than once
     wild    -- a resident who may agree to join you
     project -- a build site
   `when` hides an entity until it is true; `gone` removes it for good. */

export const ENTITIES = [
  /* ------------------------------------------------ Landing Beach */
  { map: 'beach', x: 6,  y: 6,  art: 'post',    kind: 'doc',  doc: 'notice',
    label: 'A notice, nailed at eye height to the cabin door.' },
  { map: 'beach', x: 10, y: 8,  art: 'post',    kind: 'doc',  doc: 'fieldguide',
    label: 'A page pinned to a post, weighted with a stone.' },
  { map: 'beach', x: 15, y: 11, art: 'sign',    kind: 'sign', sign: 'beachSign' },
  { map: 'beach', x: 24, y: 17, art: 'sign',    kind: 'sign', sign: 'dockSign' },
  { map: 'beach', x: 26, y: 22, art: 'lockbox', kind: 'doc',  doc: 'tidechart',
    label: 'An iron lockbox bolted to the last plank.' },
  { map: 'beach', x: 3,  y: 16, art: 'sign',    kind: 'sign', sign: 'rockFinger' },
  { map: 'beach', x: 5,  y: 7,  art: null,      kind: 'sign', sign: 'cabinDoor' },
  /* two dug spots. The chart says which one, and it is not the obvious one. */
  { map: 'beach', x: 5,  y: 18, art: 'mound',   kind: 'dig', id: 'moundBase',
    empty: 'Loose gravel, already turned over once and refilled. Whoever dug here found nothing, and said so in writing.' },
  { map: 'beach', x: 1,  y: 18, art: 'mound',   kind: 'dig', id: 'moundTip',
    gives: 'crank', giveLabel: 'the iron windlass crank',
    found: 'Half a metre down, wrapped in oiled canvas: a crank handle, iron, heavier than it looks.' },
  { map: 'beach', x: 11, y: 15, art: 'pidgey',  kind: 'wild', species: 'pidgey' },
  { map: 'beach', x: 8,  y: 19, art: 'psyduck', kind: 'wild', species: 'psyduck' },
  { map: 'beach', x: 17, y: 1,  art: null,      kind: 'project', project: 'gate' },

  /* ------------------------------------------------ Meadow Hollow */
  { map: 'meadow', x: 27, y: 15, art: 'sign', kind: 'doc', doc: 'cairns',
    label: 'A tablet set flat into the ground at the edge of the circle.' },
  { map: 'meadow', x: 16, y: 10, art: 'sign', kind: 'sign', sign: 'pondSign' },
  { map: 'meadow', x: 26, y: 14, art: 'machop',    kind: 'wild', species: 'machop' },
  { map: 'meadow', x: 19, y: 19, art: 'chikorita', kind: 'wild', species: 'chikorita' },
  { map: 'meadow', x: 17, y: 5,  art: 'pikachu',   kind: 'wild', species: 'pikachu' },
  { map: 'meadow', x: 4,  y: 12, art: null, kind: 'project', project: 'bridge' },
  { map: 'meadow', x: 32, y: 9,  art: null, kind: 'project', project: 'boardwalk' },
  { map: 'meadow', x: 12, y: 20, art: 'marker', kind: 'project', project: 'garden' },

  /* ------------------------------------------------ Whispering Grove */
  { map: 'grove', x: 16, y: 11, art: 'sign', kind: 'doc', doc: 'shrine',
    label: 'A bronze plaque bolted to the largest of the shrine stones.' },
  { map: 'grove', x: 19, y: 11, art: 'berry', kind: 'item', id: 'rowan',
    gives: 'berries', giveLabel: 'a Rowan berry', repeat: true,
    found: 'You pick a berry. The smell gets on your hands immediately and stays there.' },
  { map: 'grove', x: 20, y: 11, art: null, kind: 'sign', sign: 'rowanTree' },
  { map: 'grove', x: 10, y: 13, art: 'sign', kind: 'sign', sign: 'brookSign' },
  { map: 'grove', x: 12, y: 10, art: 'diglett',   kind: 'wild', species: 'diglett' },
  { map: 'grove', x: 17, y: 13, art: 'bulbasaur', kind: 'wild', species: 'bulbasaur' },
  { map: 'grove', x: 17, y: 2,  art: null, kind: 'project', project: 'rockslide' },

  /* ------------------------------------------------ Brackish Marsh */
  { map: 'marsh', x: 2,  y: 7,  art: 'post', kind: 'doc', doc: 'ledger',
    label: 'A ledger in a tin sleeve, chained to the landing post.' },
  { map: 'marsh', x: 4,  y: 5,  art: 'sign', kind: 'sign', sign: 'marshPost' },
  { map: 'marsh', x: 14, y: 13, art: 'wooper',   kind: 'wild', species: 'wooper' },
  { map: 'marsh', x: 18, y: 20, art: 'chinchou', kind: 'wild', species: 'chinchou' },
  { map: 'marsh', x: 17, y: 22, art: null, kind: 'project', project: 'lantern' },

  /* ------------------------------------------------ Tidepool Caverns */
  { map: 'caverns', x: 19, y: 3,  art: 'sign', kind: 'sign', sign: 'cavernWall' },
  { map: 'caverns', x: 8,  y: 11, art: 'sign', kind: 'doc', doc: 'vault',
    label: 'Letters cut deep into the wall, beside a gap you cannot get through.' },
  { map: 'caverns', x: 7,  y: 12, art: 'snorlax', kind: 'wild', species: 'snorlax',
    needsItem: { key: 'berries', count: 2 },
    without: 'It fills the gap completely and does not stir. Shouting does nothing at all. You are going to need something else.' },
  { map: 'caverns', x: 4,  y: 12, art: 'lockbox', kind: 'sign', sign: 'vaultCache' },

  /* ------------------------------------------------ Ashen Ridge */
  { map: 'ridge', x: 8,  y: 12, art: 'sign', kind: 'sign', sign: 'ridgeMarker' },
  { map: 'ridge', x: 7,  y: 14, art: 'sign', kind: 'sign', sign: 'terrace' },
  { map: 'ridge', x: 14, y: 3,  art: null, kind: 'doc', doc: 'summit',
    label: 'The summit cairn. A slate is wedged into the top course of stones.' },
  { map: 'ridge', x: 16, y: 4,  art: 'ditto', kind: 'wild', species: 'ditto',
    when: s => !!s.flags.summit }
];

/* Region display names and the tile you arrive on. */
export const REGIONS = {
  beach:   { name: 'Landing Beach',    dark: false },
  meadow:  { name: 'Meadow Hollow',    dark: false },
  grove:   { name: 'Whispering Grove', dark: false },
  marsh:   { name: 'Brackish Marsh',   dark: false },
  caverns: { name: 'Tidepool Caverns', dark: true },
  ridge:   { name: 'Ashen Ridge',      dark: false }
};

/* Edge crossings. Each is a single tile you walk onto. */
export const EXITS = [
  { map: 'beach',   x: 17, y: 0,  to: 'meadow',  tx: 17, ty: 22, dir: 'up' },
  { map: 'meadow',  x: 17, y: 23, to: 'beach',   tx: 17, ty: 2,  dir: 'down' },
  { map: 'meadow',  x: 0,  y: 12, to: 'grove',   tx: 32, ty: 12, dir: 'left' },
  { map: 'grove',   x: 33, y: 12, to: 'meadow',  tx: 1,  ty: 12, dir: 'right' },
  { map: 'meadow',  x: 33, y: 9,  to: 'marsh',   tx: 1,  ty: 6,  dir: 'right' },
  { map: 'marsh',   x: 0,  y: 6,  to: 'meadow',  tx: 32, ty: 9,  dir: 'left' },
  { map: 'marsh',   x: 17, y: 23, to: 'caverns', tx: 17, ty: 1,  dir: 'down' },
  { map: 'caverns', x: 17, y: 0,  to: 'marsh',   tx: 17, ty: 21, dir: 'up' },
  { map: 'grove',   x: 17, y: 0,  to: 'ridge',   tx: 17, ty: 22, dir: 'up' },
  { map: 'ridge',   x: 17, y: 23, to: 'grove',   tx: 17, ty: 3,  dir: 'down' }
];
