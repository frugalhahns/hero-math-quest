/* Tiles are drawn in code rather than stored, which keeps the whole game to a
   handful of text files. Each tile character gets four baked variants; the
   world picks a variant from the tile's coordinates so grass and rock look
   speckled rather than tiled, without any per-frame cost. Water gets two
   animation frames. */

export const TS = 16;                 // tile size in native pixels
const VARIANTS = 4;

/* mulberry32: tiny, fast, and identical on every machine, so the island looks
   the same for everybody. */
function rng(seed) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function px(g, x, y, w, h, col) { g.fillStyle = col; g.fillRect(x, y, w, h); }

function speckle(g, r, col, n, x0 = 0, y0 = 0, w = TS, h = TS) {
  g.fillStyle = col;
  for (let i = 0; i < n; i++) {
    g.fillRect(x0 + Math.floor(r() * w), y0 + Math.floor(r() * h), 1, 1);
  }
}

/* ---------------- palettes ---------------- */

const C = {
  grass: '#4b9153', grassD: '#3c7844', grassL: '#5ea562', grassX: '#33683a',
  sand: '#dcc78d', sandD: '#c4ac72', sandL: '#ecdca8',
  dirt: '#a5844f', dirtD: '#8a6c3d', dirtL: '#bd9c66',
  water: '#2f6fa8', waterD: '#255b8c', waterL: '#4b8dc4',
  shallow: '#4f9dc6', shallowL: '#77bcdd',
  rock: '#8c95a0', rockD: '#6b737d', rockL: '#a8b0b9',
  cliff: '#6f6a63', cliffD: '#514d48', cliffL: '#8e8880',
  wood: '#8a6134', woodD: '#5f4222', woodL: '#a87c48',
  leaf: '#2f6b39', leafD: '#204d28', leafL: '#3f8a47',
  cave: '#2a3138', caveD: '#1b2126', caveL: '#3d474f',
  floor: '#4a545d', floorD: '#39424a', floorL: '#5c6871',
  pool: '#1f5f66', poolL: '#2f8189',
  reed: '#5f7a3a', reedD: '#445a27',
  scree: '#8d8a7d', screeD: '#6b6960', screeL: '#a8a496',
  glow: '#9fe0ff'
};

/* ---------------- per-tile painters ---------------- */

function grassBase(g, r) {
  px(g, 0, 0, TS, TS, C.grass);
  speckle(g, r, C.grassD, 16);
  speckle(g, r, C.grassL, 12);
}

function sandBase(g, r) {
  px(g, 0, 0, TS, TS, C.sand);
  speckle(g, r, C.sandD, 14);
  speckle(g, r, C.sandL, 10);
}

const PAINT = {
  '.': (g, r) => grassBase(g, r),

  ',': (g, r) => {
    grassBase(g, r);
    g.fillStyle = C.grassX;
    for (let i = 0; i < 7; i++) {
      const x = Math.floor(r() * TS), y = 4 + Math.floor(r() * 10);
      g.fillRect(x, y, 1, 4);
      g.fillRect(x + 1, y + 2, 1, 3);
    }
  },

  f: (g, r) => {
    grassBase(g, r);
    const cols = ['#f0e05a', '#f07fa8', '#eaeaf0', '#f0a24a'];
    for (let i = 0; i < 4; i++) {
      const x = 2 + Math.floor(r() * 12), y = 2 + Math.floor(r() * 11);
      px(g, x - 1, y + 2, 3, 1, C.grassX);   // a little foliage under each head
      px(g, x, y + 2, 1, 3, C.grassX);
      px(g, x, y, 2, 2, cols[Math.floor(r() * cols.length)]);
    }
  },

  /* Canopies are drawn wide enough to touch the next tile's canopy, so a run
     of tree tiles reads as one mass of forest instead of a row of lollipops. */
  T: (g, r) => {
    grassBase(g, r);
    px(g, 7, 12, 3, 4, C.woodD);
    g.fillStyle = C.leafD;
    g.beginPath(); g.arc(8, 8, 8.6, 0, 7); g.fill();
    g.beginPath(); g.arc(3, 5, 5, 0, 7); g.fill();
    g.beginPath(); g.arc(13, 6, 5, 0, 7); g.fill();
    g.fillStyle = C.leaf;
    g.beginPath(); g.arc(8, 7, 6.4, 0, 7); g.fill();
    g.beginPath(); g.arc(4, 8, 3.6, 0, 7); g.fill();
    g.beginPath(); g.arc(12, 9, 3.6, 0, 7); g.fill();
    speckle(g, r, C.leafL, 14, 2, 1, 13, 12);
    speckle(g, r, C.leafD, 8, 1, 2, 14, 12);
  },

  b: (g, r) => {
    grassBase(g, r);
    g.fillStyle = C.leafD;
    g.beginPath(); g.arc(8, 10, 6, 0, 7); g.fill();
    g.fillStyle = C.leaf;
    g.beginPath(); g.arc(7, 9, 4.4, 0, 7); g.fill();
    speckle(g, r, C.leafL, 7, 3, 5, 10, 8);
    px(g, 7, 14, 2, 2, C.woodD);
  },

  m: (g, r) => {
    grassBase(g, r);
    for (let i = 0; i < 3; i++) {
      const x = 2 + Math.floor(r() * 11), y = 5 + Math.floor(r() * 8);
      px(g, x, y + 2, 1, 2, '#e8dcc0');
      px(g, x - 1, y, 3, 2, '#c05a4a');
      px(g, x, y, 1, 1, '#e88878');
    }
  },

  R: (g, r) => {
    grassBase(g, r);
    g.fillStyle = C.rockD;
    g.beginPath(); g.arc(8, 9, 6, 0, 7); g.fill();
    g.fillStyle = C.rock;
    g.beginPath(); g.arc(8, 8, 5, 0, 7); g.fill();
    g.fillStyle = C.rockL;
    g.beginPath(); g.arc(6, 6, 2.4, 0, 7); g.fill();
  },

  C: (g, r) => {
    px(g, 0, 0, TS, TS, C.cliff);
    px(g, 0, 0, TS, 3, C.cliffL);
    px(g, 0, 13, TS, 3, C.cliffD);
    speckle(g, r, C.cliffD, 18);
    speckle(g, r, C.cliffL, 10);
    px(g, 5, 4, 1, 8, C.cliffD);
    px(g, 11, 6, 1, 7, C.cliffD);
  },

  A: (g, r) => {
    px(g, 0, 0, TS, TS, C.scree);
    speckle(g, r, C.screeD, 22);
    speckle(g, r, C.screeL, 14);
    for (let i = 0; i < 3; i++) {
      const x = Math.floor(r() * 13), y = Math.floor(r() * 13), sz = 2 + Math.floor(r() * 2);
      px(g, x, y, sz, sz, C.screeD);
      px(g, x, y, sz - 1, sz - 1, C.screeL);
    }
  },

  S: (g, r) => sandBase(g, r),

  '=': (g, r) => {
    px(g, 0, 0, TS, TS, C.dirt);
    speckle(g, r, C.dirtD, 18);
    speckle(g, r, C.dirtL, 12);
  },

  '~': (g, r, f) => {
    px(g, 0, 0, TS, TS, C.water);
    speckle(g, r, C.waterD, 10);
    g.fillStyle = C.waterL;
    const o = f ? 5 : 0;
    g.fillRect((2 + o) % TS, 4, 5, 1);
    g.fillRect((9 + o) % TS, 9, 4, 1);
    g.fillRect((5 + o) % TS, 13, 4, 1);
  },

  s: (g, r, f) => {
    px(g, 0, 0, TS, TS, C.shallow);
    speckle(g, r, C.sandD, 8);
    g.fillStyle = C.shallowL;
    const o = f ? 6 : 0;
    g.fillRect((1 + o) % TS, 5, 6, 1);
    g.fillRect((8 + o) % TS, 11, 5, 1);
  },

  p: (g, r, f) => {
    px(g, 0, 0, TS, TS, C.pool);
    speckle(g, r, C.poolL, 8);
    g.fillStyle = C.glow;
    g.globalAlpha = 0.35;
    g.fillRect(f ? 4 : 8, f ? 6 : 10, 4, 1);
    g.globalAlpha = 1;
  },

  o: (g, r, f) => {
    PAINT.s(g, rng(7), f);
    g.fillStyle = C.rockD;
    g.beginPath(); g.arc(8, 8, 5.6, 0, 7); g.fill();
    g.fillStyle = C.rock;
    g.beginPath(); g.arc(8, 7, 4.4, 0, 7); g.fill();
  },

  e: (g, r, f) => {
    PAINT.s(g, rng(3), f);
    g.fillStyle = C.reedD;
    for (let i = 0; i < 6; i++) {
      const x = Math.floor(r() * TS), h = 8 + Math.floor(r() * 7);
      g.fillRect(x, TS - h, 1, h);
    }
    g.fillStyle = C.reed;
    for (let i = 0; i < 5; i++) {
      const x = Math.floor(r() * TS), h = 6 + Math.floor(r() * 8);
      g.fillRect(x, TS - h, 1, h);
    }
  },

  _: (g, r) => {
    px(g, 0, 0, TS, TS, C.wood);
    px(g, 0, 0, TS, 1, C.woodL);
    for (const y of [4, 9, 14]) px(g, 0, y, TS, 1, C.woodD);
    speckle(g, r, C.woodD, 8);
    px(g, 3, 0, 1, TS, C.woodD);
    px(g, 12, 0, 1, TS, C.woodD);
  },

  w: (g, r) => {
    px(g, 0, 0, TS, TS, C.wood);
    for (const y of [0, 5, 10, 15]) px(g, 0, y, TS, 1, C.woodD);
    px(g, 0, 1, TS, 1, C.woodL);
    px(g, 0, 6, TS, 1, C.woodL);
    px(g, 0, 11, TS, 1, C.woodL);
    speckle(g, r, C.woodD, 6);
  },

  r: (g, r) => {
    px(g, 0, 0, TS, TS, '#7a4a3a');
    for (let y = 0; y < TS; y += 4) {
      px(g, 0, y, TS, 1, '#5c3327');
      for (let x = (y % 8 === 0 ? 0 : 4); x < TS; x += 8) px(g, x, y + 1, 1, 3, '#5c3327');
    }
    speckle(g, r, '#95604a', 10);
  },

  D: (g) => {
    px(g, 0, 0, TS, TS, C.woodD);
    px(g, 2, 1, 12, 14, C.wood);
    px(g, 7, 1, 1, 14, C.woodD);
    px(g, 11, 8, 2, 2, '#e8c85a');
  },

  '|': (g, r) => {
    grassBase(g, r);
    px(g, 0, 6, TS, 2, C.woodL);
    px(g, 0, 11, TS, 2, C.wood);
    px(g, 6, 4, 3, 11, C.woodD);
  },

  G: (g, r) => {
    grassBase(g, r);
    px(g, 4, 11, 9, 4, C.rockD);
    px(g, 5, 7, 7, 4, C.rock);
    px(g, 6, 4, 5, 3, C.rockL);
    px(g, 7, 2, 3, 2, C.rock);
  },

  '#': (g, r) => {
    px(g, 0, 0, TS, TS, C.cave);
    speckle(g, r, C.caveD, 26);
    speckle(g, r, C.caveL, 10);
    for (let i = 0; i < 2; i++) {
      const x = Math.floor(r() * 12), y = Math.floor(r() * 12);
      px(g, x, y, 3, 2, C.caveD);
    }
  },

  ':': (g, r) => {
    px(g, 0, 0, TS, TS, C.floor);
    speckle(g, r, C.floorD, 16);
    speckle(g, r, C.floorL, 10);
  },

  x: (g, r) => {
    PAINT['#'](g, rng(9));
    g.fillStyle = C.glow;
    g.beginPath();
    g.moveTo(8, 3); g.lineTo(11, 9); g.lineTo(8, 13); g.lineTo(5, 9);
    g.closePath(); g.fill();
    px(g, 7, 6, 1, 4, '#ffffff');
  },

  /* ---- barriers, cleared by projects ---- */

  1: (g, r) => {                                   // the channel gate
    PAINT.C(g, rng(5));
    px(g, 1, 2, 14, 12, C.woodD);
    px(g, 2, 3, 12, 10, C.wood);
    for (let x = 3; x < 14; x += 3) px(g, x, 3, 1, 10, C.woodD);
    px(g, 2, 7, 12, 2, '#b8b0a0');
  },

  2: (g, r) => {                                   // the unbridged ravine
    px(g, 0, 0, TS, TS, C.cliffD);
    px(g, 0, 0, TS, 3, C.cliff);
    speckle(g, r, '#22201d', 22);
    px(g, 3, 6, 10, 10, '#141312');
  },

  3: (g, r) => {                                   // the reed wall
    PAINT.e(g, r, false);
    g.fillStyle = C.reedD;
    for (let i = 0; i < 12; i++) g.fillRect(Math.floor(r() * TS), Math.floor(r() * 4), 1, TS);
  },

  4: (g, r) => {                                   // the flooded tunnel mouth
    PAINT['#'](g, rng(2));
    px(g, 3, 4, 10, 12, '#0a1418');
    px(g, 4, 12, 8, 4, C.pool);
  },

  5: (g, r) => {                                   // the rockslide
    PAINT.C(g, rng(4));
    for (let i = 0; i < 7; i++) {
      const x = Math.floor(r() * 12), y = Math.floor(r() * 12), s = 3 + Math.floor(r() * 3);
      px(g, x, y, s, s, C.rockD);
      px(g, x, y, s - 1, s - 1, C.rock);
    }
  }
};

/* ---------------- baking ---------------- */

const SOLID = new Set(['T', 'b', 'R', 'C', 'A', '~', 's', 'e', 'w', 'r', 'D', '|', '#', 'p', 'x', 'G', '1', '2', '3', '4', '5']);
const ANIMATED = new Set(['~', 's', 'p', 'o', 'e', '3', '4']);

export function isSolidTile(ch) { return SOLID.has(ch); }
export function isKnownTile(ch) { return !!PAINT[ch]; }

let baked = null;

export function tiles() {
  if (baked) return baked;
  baked = {};
  for (const ch of Object.keys(PAINT)) {
    const frames = ANIMATED.has(ch) ? 2 : 1;
    baked[ch] = [];
    for (let f = 0; f < frames; f++) {
      const set = [];
      for (let v = 0; v < VARIANTS; v++) {
        const c = document.createElement('canvas');
        c.width = TS; c.height = TS;
        const g = c.getContext('2d');
        // seed from the character code and variant so the look is stable
        PAINT[ch](g, rng(ch.charCodeAt(0) * 7919 + v * 104729 + 13), f === 1);
        set.push(c);
      }
      baked[ch].push(set);
    }
  }
  return baked;
}

/* Which of the four variants a given map square uses. Cheap, stable hash. */
export function variantAt(x, y) {
  return ((x * 31 + y * 17) >>> 0) % VARIANTS;
}
