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
     time. Every other region does the same thing now, for the same reason; see
     the note over Meadow Hollow. */
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

  /* Elm's bicycle, against the cabin wall. Nothing on the chain needs it and no
     step ever points at it: it is a page you did not have to read, paying out.
     It waits for the gate for the reason the card gives -- until the gate is
     open the island is one beach, and a bicycle on one beach is a toy. */
  { map: 'beach', x: 10, y: 5,  art: 'bike_parked', kind: 'doc', doc: 'bicycle',
    when: s => !!s.projects.gate,
    label: 'A bicycle leaning on the cabin wall, with a card tied to the bars.' },

  /* The card in the submarine's hatch. Like the bicycle: nothing needs it, no
     step points at it, and it waits for the water notebook in the marsh -- by
     then a kid knows what a tide is and what the channel is, which is most of
     what the card assumes. */
  { map: 'beach', x: 24, y: 22, art: 'lockbox', kind: 'doc', doc: 'submarine',
    when: s => !!s.flags.ledger,
    label: 'A hatch in the top of something yellow, tied under the last board.' },

  /* ------------------------------------------------ Meadow Hollow

     Every region after the beach used to hand over everything it had the
     moment you walked in: nine things in the hollow, nine in the grove, four
     animals standing in the grass at once. The beach was fixed and the rest of
     the island was not, which is the version that got reported -- the first
     level teaches you that things arrive as you earn them, and then the second
     one drops a field of markers on you.

     So the same three waves everywhere now. You land in front of the region's
     page and the sign nearest the way in. Reading that page brings out
     everything it actually describes: the animals it names, the crossing it
     tells you to build, the tree it tells you to remember. What nobody wrote
     about turns up last, once the crossing is standing, so coming back to a
     region you have finished is worth something.

     The tablet is the hollow's page: the grey ones at the circle, the leaf one
     in the tall grass, and the west gap that needs rope. */
  { map: 'meadow', x: 27, y: 15, art: 'sign', kind: 'doc', doc: 'cairns',
    label: 'A tablet set flat in the ground at the edge of the circle.' },
  { map: 'meadow', x: 16, y: 10, art: 'sign', kind: 'sign', sign: 'pondSign' },

  /* The tablet's wave. Mareep is in it and the tablet never mentions it, which
     is deliberate: "the small one with the leaf on its head" is only a
     description worth reading if there is more than one thing standing in that
     grass. Two named, one not. */
  { map: 'meadow', x: 26, y: 14, art: 'machop',    kind: 'wild', species: 'machop',
    when: s => !!s.flags.cairns },
  { map: 'meadow', x: 19, y: 19, art: 'chikorita', kind: 'wild', species: 'chikorita',
    when: s => !!s.flags.cairns },
  { map: 'meadow', x: 22, y: 20, art: null, kind: 'wild', species: 'mareep',
    when: s => !!s.flags.cairns },
  { map: 'meadow', x: 4,  y: 12, art: null, kind: 'project', project: 'bridge',
    when: s => !!s.flags.cairns },

  /* The yellow one lives on the little island, and the intake sign is the only
     thing on the island that says so. Read the sign and it is there, which is
     what an optional layer should pay for. Skip it and it turns up once the
     crossing is built, because the notebook in the marsh sends you back here
     for it either way and a step must never point at nobody. */
  { map: 'meadow', x: 17, y: 5,  art: 'pikachu',   kind: 'wild', species: 'pikachu',
    when: s => !!s.signs.pondSign || !!s.projects.bridge },

  /* the reed walkway is the grove plaque's idea, not the tablet's */
  { map: 'meadow', x: 32, y: 9,  art: null, kind: 'project', project: 'boardwalk',
    when: s => !!s.flags.shrine },
  /* nobody wrote about the south slope. It is the last thing on Elm's list, so
     it waits until the hollow's real job is done. */
  { map: 'meadow', x: 12, y: 20, art: 'marker', kind: 'project', project: 'garden',
    when: s => !!s.projects.bridge },

  /* ------------------------------------------------ Whispering Grove
     The plaque, and the brook it spends half its words on. */
  { map: 'grove', x: 16, y: 11, art: 'sign', kind: 'doc', doc: 'shrine',
    label: 'A metal plaque bolted to the biggest stone in the clearing.' },
  { map: 'grove', x: 10, y: 13, art: 'sign', kind: 'sign', sign: 'brookSign' },

  /* The plaque's wave: the diggers that come up on the bank where the mushrooms
     are thickest, the path finding bird it pairs them with, and the Rowan it
     tells you outright to remember for later. The berries are not needed for
     hours, but the plaque is where you were told about them, so that is when
     the tree is there to be found again. */
  { map: 'grove', x: 12, y: 10, art: 'diglett',   kind: 'wild', species: 'diglett',
    when: s => !!s.flags.shrine },
  { map: 'grove', x: 14, y: 8,  art: null, kind: 'wild', species: 'hoothoot',
    when: s => !!s.flags.shrine },
  { map: 'grove', x: 19, y: 11, art: 'berry', kind: 'item', id: 'rowan',
    when: s => !!s.flags.shrine,
    gives: 'berries', giveLabel: 'a Rowan berry', repeat: true,
    found: 'You pick a berry. The smell gets on your hands right away and stays there.' },
  { map: 'grove', x: 20, y: 11, art: null, kind: 'sign', sign: 'rowanTree',
    when: s => !!s.flags.shrine },

  /* two the plaque never mentions, once the walkway it was about is standing */
  { map: 'grove', x: 17, y: 13, art: 'bulbasaur', kind: 'wild', species: 'bulbasaur',
    when: s => !!s.projects.boardwalk },
  { map: 'grove', x: 20, y: 13, art: null, kind: 'wild', species: 'oddish',
    when: s => !!s.projects.boardwalk },

  /* The slide itself is rock on the map from the first time you walk up here.
     The build site is the cave wall's idea, and it is the wall that tells you
     what it takes to shift it. */
  { map: 'grove', x: 17, y: 2,  art: null, kind: 'project', project: 'rockslide',
    when: s => !!s.flags.vault },

  /* ------------------------------------------------ Reed Marsh
     The landing, and the post standing on it. */
  { map: 'marsh', x: 2,  y: 7,  art: 'post', kind: 'doc', doc: 'ledger',
    label: 'A notebook in a tin cover, chained to the landing post.' },
  { map: 'marsh', x: 4,  y: 5,  art: 'sign', kind: 'sign', sign: 'marshPost' },

  /* The notebook's wave: the light carrier in the deep channel at the south
     end, the tunnel it is for, and the two who did not read it. */
  { map: 'marsh', x: 18, y: 20, art: 'chinchou', kind: 'wild', species: 'chinchou',
    when: s => !!s.flags.ledger },
  { map: 'marsh', x: 17, y: 22, art: null, kind: 'project', project: 'lantern',
    when: s => !!s.flags.ledger },
  { map: 'marsh', x: 9,  y: 5,  art: 'rocket_b', kind: 'rocket', doc: 'rocketMarsh',
    when: s => !!s.flags.ledger, label: 'Two black uniforms at the edge of the reeds.' },
  { map: 'marsh', x: 10, y: 5,  art: 'rocket_a', kind: 'rocket', doc: 'rocketMarsh',
    when: s => !!s.flags.ledger, label: 'Two black uniforms at the edge of the reeds.' },

  /* the two in the shallows, once the light line is in */
  { map: 'marsh', x: 14, y: 13, art: 'wooper', kind: 'wild', species: 'wooper',
    when: s => !!s.projects.lantern },
  { map: 'marsh', x: 10, y: 16, art: null, kind: 'wild', species: 'marill',
    when: s => !!s.projects.lantern },

  /* ------------------------------------------------ Tidepool Caves
     Three at the mouth: the water line by the way in, the writing on the far
     wall, and the thing the writing is about. The sleeper is the gap, so it has
     to be standing there before you have read a word. */
  { map: 'caverns', x: 19, y: 3,  art: 'sign', kind: 'sign', sign: 'cavernWall' },
  { map: 'caverns', x: 9,  y: 11, art: 'sign', kind: 'doc', doc: 'vault',
    label: 'Words cut deep into the wall, next to a gap you cannot get through.' },
  { map: 'caverns', x: 7,  y: 12, art: 'snorlax', kind: 'wild', species: 'snorlax',
    needsItem: { key: 'berries', count: 2 },
    without: 'It fills the whole gap and does not move at all. Shouting does nothing. You are going to need something else.' },

  /* the wall's wave: the grunts on the drum, and the other thing down here that
     moves rock, which is what the wall is really about */
  { map: 'caverns', x: 11, y: 10, art: 'rocket_a', kind: 'rocket', doc: 'rocketCaves',
    when: s => !!s.flags.vault, label: 'Two black uniforms, taking turns on a drum.' },
  { map: 'caverns', x: 12, y: 10, art: 'rocket_b', kind: 'rocket', doc: 'rocketCaves',
    when: s => !!s.flags.vault, label: 'Two black uniforms, taking turns on a drum.' },
  { map: 'caverns', x: 8,  y: 16, art: null, kind: 'wild', species: 'geodude',
    when: s => !!s.flags.vault },

  /* The box is on the far side of the gap the sleeper was filling, and its own
     note says so: "if you are reading this, you got it awake". */
  { map: 'caverns', x: 4,  y: 12, art: 'lockbox', kind: 'sign', sign: 'vaultCache',
    when: s => s.team.includes('snorlax') },

  /* ------------------------------------------------ Ash Ridge
     The trail up, and then the page at the top. Three things and a climb: this
     one never needed handing over in waves. */
  { map: 'ridge', x: 8,  y: 12, art: 'sign', kind: 'sign', sign: 'ridgeMarker' },
  { map: 'ridge', x: 7,  y: 14, art: 'sign', kind: 'sign', sign: 'terrace' },
  { map: 'ridge', x: 14, y: 3,  art: null, kind: 'doc', doc: 'summit',
    label: 'The stone pile at the top. A flat slate is wedged in near the top.' },
  { map: 'ridge', x: 16, y: 4,  art: 'ditto', kind: 'wild', species: 'ditto',
    when: s => !!s.flags.summit },

  /* ------------------------------------------------ The Kelp Shallows

     The one region that is not on the island, and the only one that is entirely
     optional: no step in the chain comes down here and nothing up there needs
     anything found down here. Same three waves as everywhere else.

     Magikarp is at the door on purpose. There are hundreds of them, the slate
     says so, and a kid who writes them off on sight is exactly the kid the
     Magikarp page is written for. */
  { map: 'shallows', x: 17, y: 4,  art: 'lockbox', kind: 'doc', doc: 'kelp',
    label: 'A slate in a glass case, wired to a post in the sand.' },
  { map: 'shallows', x: 14, y: 7,  art: 'sign', kind: 'sign', sign: 'kelpPost' },
  { map: 'shallows', x: 20, y: 9,  art: null, kind: 'wild', species: 'magikarp' },

  /* the slate's wave: the three that live in the bed, and the boat it does not
     mention because Elm never wrote about her */
  { map: 'shallows', x: 13, y: 18, art: null, kind: 'wild', species: 'corsola',
    when: s => !!s.flags.kelp },
  { map: 'shallows', x: 8,  y: 13, art: null, kind: 'wild', species: 'staryu',
    when: s => !!s.flags.kelp },
  { map: 'shallows', x: 10, y: 6,  art: null, kind: 'wild', species: 'horsea',
    when: s => !!s.flags.kelp },
  { map: 'shallows', x: 23, y: 14, art: 'sign', kind: 'sign', sign: 'wreckSign',
    when: s => !!s.flags.kelp },

  /* The big one comes through when it feels like it, which in a game has to
     mean something. It means the three who live here have all said yes. */
  { map: 'shallows', x: 24, y: 3,  art: null, kind: 'wild', species: 'lapras',
    when: s => ['corsola', 'staryu', 'horsea'].every(id => s.team.includes(id)) }
];

/* Region display names and the tile you arrive on. */
export const REGIONS = {
  beach:   { name: 'Landing Beach',    dark: false },
  meadow:  { name: 'Meadow Hollow',    dark: false },
  grove:   { name: 'Whispering Grove', dark: false },
  marsh:   { name: 'Reed Marsh',       dark: false },
  caverns: { name: 'Tidepool Caves',   dark: true },
  ridge:   { name: 'Ash Ridge',        dark: false },
  /* `deep` gets the blue laid over everything, the way `dark` gets the black in
     the caves. It is not gloom: it is the colour of being under. */
  shallows: { name: 'The Kelp Shallows', dark: false, deep: true }
};

/* Edge crossings. Each is a single tile you walk onto.

   `needs` is a crossing you cannot use yet, and there is exactly one: every
   other border on the island is closed by a barrier tile that a project clears.
   The dive is closed by not owning a submarine, so the tile itself stays solid
   until you do -- see blocked() in world.js, which reads this list rather than
   keeping a second copy of the rule. */
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
  { map: 'ridge',   x: 17, y: 23, to: 'grove',   tx: 17, ty: 3,  dir: 'down' },
  { map: 'beach',    x: 25, y: 23, to: 'shallows', tx: 17, ty: 2,  dir: 'down',
    needs: s => !!s.flags.submarine },
  { map: 'shallows', x: 17, y: 1,  to: 'beach',    tx: 25, ty: 22, dir: 'up' }
];
