/* Everything you can walk up to and interact with, placed by hand on the tile
   maps in content/maps.js. Entities occupy their tile and block movement, so
   you interact by standing next to one and facing it.
     doc     -- a document with comprehension questions
     sign    -- flavour text, sometimes carrying a detail a document relies on
     dig     -- a spot that may or may not contain something
     item    -- a thing you can pick up, possibly more than once
     wild    -- a resident who may agree to join you
     project -- a build site
   `when` hides an entity until it is true; `gone` removes it for good.

   `art` is the 16x16 fallback the canvas draws. Residents normally do not need
   one because they are drawn as animated <img> in the #actors layer, so `art:
   null` is fine for them -- world.js falls back to a generic shape if the image
   file ever fails, which is better than an invisible, unfindable animal. */

export const ENTITIES = [
  /* ------------------------------------------------ Landing Beach

     The beach is the tutorial, and it used to hand over all fifteen of these at
     once: about three thousand words and twenty-nine questions standing in a
     field, each with a marker bouncing over it. An 8 year old does not read that
     as a place to explore, he reads it as a checklist, and mine said so.

     So the beach arrives in waves along the chain that already existed --
     notice, chart, dig, guide, helpers, gate -- and every wave is unlocked by
     the thing you just read. You land with two things in front of you. The
     chart tells you about the rock finger, and then the rock finger is there.
     Nothing was cut to do this; it is the same beach, handed over a bit at a
     time. Later regions are small enough not to need it. */
  { map: 'beach', x: 6,  y: 6,  art: 'post',    kind: 'doc',  doc: 'notice',
    label: 'A notice, nailed to the cabin door at eye height.' },
  { map: 'beach', x: 5,  y: 7,  art: null,      kind: 'sign', sign: 'cabinDoor' },

  /* read the notice and the dock is worth walking down */
  { map: 'beach', x: 26, y: 22, art: 'lockbox', kind: 'doc',  doc: 'tidechart',
    when: s => !!s.flags.notice,
    label: 'A metal box bolted to the last board.' },
  { map: 'beach', x: 24, y: 17, art: 'sign',    kind: 'sign', sign: 'dockSign',
    when: s => !!s.flags.notice },
  { map: 'beach', x: 15, y: 11, art: 'sign',    kind: 'sign', sign: 'beachSign',
    when: s => !!s.flags.notice },

  /* the chart is what tells you the rock finger throws a shadow, so that is
     when the rock finger and the digging are worth anything */
  { map: 'beach', x: 3,  y: 16, art: 'sign',    kind: 'sign', sign: 'rockFinger',
    when: s => !!s.flags.tidechart },
  /* two dug spots. The chart says which one, and it is not the obvious one. */
  { map: 'beach', x: 5,  y: 18, art: 'mound',   kind: 'dig', id: 'moundBase',
    when: s => !!s.flags.tidechart,
    empty: 'Loose gravel. Somebody already dug here and filled it back in. They found nothing, and they wrote that down.' },
  { map: 'beach', x: 1,  y: 18, art: 'mound',   kind: 'dig', id: 'moundTip',
    when: s => !!s.flags.tidechart,
    gives: 'crank', giveLabel: 'the iron handle',
    found: 'Down under the gravel, wrapped in oiled cloth: an iron handle. It is heavier than it looks.' },
  { map: 'beach', x: 2,  y: 17, art: 'rocket_a', kind: 'rocket', doc: 'rocketBeach',
    when: s => !!s.flags.tidechart,
    label: 'Somebody in a black uniform, digging.' },

  /* the field guide is the page that explains how to make a friend, so the
     animals turn up once you have read it, and not before */
  { map: 'beach', x: 10, y: 8,  art: 'post',    kind: 'doc',  doc: 'fieldguide',
    when: s => (s.items.crank || 0) >= 1,
    label: 'A page pinned to a post, held down with a stone.' },
  { map: 'beach', x: 11, y: 15, art: 'pidgey',  kind: 'wild', species: 'pidgey',
    when: s => !!s.flags.fieldguide, need: 2 },
  { map: 'beach', x: 8,  y: 19, art: 'psyduck', kind: 'wild', species: 'psyduck',
    when: s => !!s.flags.fieldguide, need: 2 },
  { map: 'beach', x: 17, y: 1,  art: null,      kind: 'project', project: 'gate',
    when: s => !!s.flags.fieldguide },

  /* the crab is not part of the opening. It turns up once the gate is open, so
     coming back to the beach is worth something. */
  { map: 'beach', x: 20, y: 18, art: null,      kind: 'wild', species: 'krabby',
    when: s => !!s.projects.gate, need: 2 },

  /* ------------------------------------------------ Meadow Hollow */
  { map: 'meadow', x: 27, y: 15, art: 'sign', kind: 'doc', doc: 'cairns',
    label: 'A tablet set flat in the ground at the edge of the circle.' },
  { map: 'meadow', x: 16, y: 10, art: 'sign', kind: 'sign', sign: 'pondSign' },
  { map: 'meadow', x: 26, y: 14, art: 'machop',    kind: 'wild', species: 'machop' },
  { map: 'meadow', x: 19, y: 19, art: 'chikorita', kind: 'wild', species: 'chikorita' },
  { map: 'meadow', x: 17, y: 5,  art: 'pikachu',   kind: 'wild', species: 'pikachu' },
  { map: 'meadow', x: 22, y: 20, art: null, kind: 'wild', species: 'mareep' },
  { map: 'meadow', x: 4,  y: 12, art: null, kind: 'project', project: 'bridge' },
  { map: 'meadow', x: 32, y: 9,  art: null, kind: 'project', project: 'boardwalk' },
  { map: 'meadow', x: 12, y: 20, art: 'marker', kind: 'project', project: 'garden' },

  /* ------------------------------------------------ Whispering Grove */
  { map: 'grove', x: 16, y: 11, art: 'sign', kind: 'doc', doc: 'shrine',
    label: 'A metal plaque bolted to the biggest stone in the clearing.' },
  { map: 'grove', x: 19, y: 11, art: 'berry', kind: 'item', id: 'rowan',
    gives: 'berries', giveLabel: 'a Rowan berry', repeat: true,
    found: 'You pick a berry. The smell gets on your hands right away and stays there.' },
  { map: 'grove', x: 20, y: 11, art: null, kind: 'sign', sign: 'rowanTree' },
  { map: 'grove', x: 10, y: 13, art: 'sign', kind: 'sign', sign: 'brookSign' },
  { map: 'grove', x: 12, y: 10, art: 'diglett',   kind: 'wild', species: 'diglett' },
  { map: 'grove', x: 17, y: 13, art: 'bulbasaur', kind: 'wild', species: 'bulbasaur' },
  { map: 'grove', x: 14, y: 8,  art: null, kind: 'wild', species: 'hoothoot' },
  { map: 'grove', x: 20, y: 13, art: null, kind: 'wild', species: 'oddish' },
  { map: 'grove', x: 17, y: 2,  art: null, kind: 'project', project: 'rockslide' },

  /* ------------------------------------------------ Reed Marsh */
  { map: 'marsh', x: 2,  y: 7,  art: 'post', kind: 'doc', doc: 'ledger',
    label: 'A notebook in a tin cover, chained to the landing post.' },
  { map: 'marsh', x: 4,  y: 5,  art: 'sign', kind: 'sign', sign: 'marshPost' },
  { map: 'marsh', x: 14, y: 13, art: 'wooper',   kind: 'wild', species: 'wooper' },
  { map: 'marsh', x: 18, y: 20, art: 'chinchou', kind: 'wild', species: 'chinchou' },
  { map: 'marsh', x: 9,  y: 5,  art: 'rocket_b', kind: 'rocket', doc: 'rocketMarsh',
    when: s => !!s.flags.ledger, label: 'Two black uniforms at the edge of the reeds.' },
  { map: 'marsh', x: 10, y: 5,  art: 'rocket_a', kind: 'rocket', doc: 'rocketMarsh',
    when: s => !!s.flags.ledger, label: 'Two black uniforms at the edge of the reeds.' },
  { map: 'marsh', x: 10, y: 16, art: null, kind: 'wild', species: 'marill' },
  { map: 'marsh', x: 17, y: 22, art: null, kind: 'project', project: 'lantern' },

  /* ------------------------------------------------ Tidepool Caves */
  { map: 'caverns', x: 19, y: 3,  art: 'sign', kind: 'sign', sign: 'cavernWall' },
  { map: 'caverns', x: 9,  y: 11, art: 'sign', kind: 'doc', doc: 'vault',
    label: 'Words cut deep into the wall, next to a gap you cannot get through.' },
  { map: 'caverns', x: 7,  y: 12, art: 'snorlax', kind: 'wild', species: 'snorlax',
    needsItem: { key: 'berries', count: 2 },
    without: 'It fills the whole gap and does not move at all. Shouting does nothing. You are going to need something else.' },
  { map: 'caverns', x: 11, y: 10, art: 'rocket_a', kind: 'rocket', doc: 'rocketCaves',
    when: s => !!s.flags.vault, label: 'Two black uniforms, taking turns on a drum.' },
  { map: 'caverns', x: 12, y: 10, art: 'rocket_b', kind: 'rocket', doc: 'rocketCaves',
    when: s => !!s.flags.vault, label: 'Two black uniforms, taking turns on a drum.' },
  { map: 'caverns', x: 8,  y: 16, art: null, kind: 'wild', species: 'geodude' },
  { map: 'caverns', x: 4,  y: 12, art: 'lockbox', kind: 'sign', sign: 'vaultCache' },

  /* ------------------------------------------------ Ash Ridge */
  { map: 'ridge', x: 8,  y: 12, art: 'sign', kind: 'sign', sign: 'ridgeMarker' },
  { map: 'ridge', x: 7,  y: 14, art: 'sign', kind: 'sign', sign: 'terrace' },
  { map: 'ridge', x: 14, y: 3,  art: null, kind: 'doc', doc: 'summit',
    label: 'The stone pile at the top. A flat slate is wedged in near the top.' },
  { map: 'ridge', x: 16, y: 4,  art: 'ditto', kind: 'wild', species: 'ditto',
    when: s => !!s.flags.summit }
];

/* Region display names and the tile you arrive on. */
export const REGIONS = {
  beach:   { name: 'Landing Beach',    dark: false },
  meadow:  { name: 'Meadow Hollow',    dark: false },
  grove:   { name: 'Whispering Grove', dark: false },
  marsh:   { name: 'Reed Marsh',       dark: false },
  caverns: { name: 'Tidepool Caves',   dark: true },
  ridge:   { name: 'Ash Ridge',        dark: false }
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
