/* The world: mutable tile grids, collision, region crossings and the map
   renderer. Grids start as copies of content/maps.js and are then rewritten by
   whichever projects the save file says are finished, so a reloaded game shows
   a bridged ravine without storing a single tile. */

import { GRIDS, MAP_W, MAP_H } from './content/maps.js';
import { ENTITIES, EXITS, REGIONS } from './content/entities.js';
import { PROJECT_BY_ID, PROJECTS } from './content/projects.js';
import { tiles, variantAt, isSolidTile, TS } from './tileset.js';

export { MAP_W, MAP_H, REGIONS, TS };

export const VIEW_W = 22;   // viewport, in tiles
export const VIEW_H = 15;

/* live grids: map -> array of arrays of single characters */
let grid = {};

export function buildWorld(S) {
  grid = {};
  for (const key of Object.keys(GRIDS)) {
    grid[key] = GRIDS[key].map(row => row.split(''));
  }
  for (const p of PROJECTS) {
    if (S.projects[p.id]) applyProject(p);
  }
}

export function applyProject(p) {
  if (p.clear) {
    const g = grid[p.clear.map];
    if (g) {
      for (let y = 0; y < MAP_H; y++) {
        for (let x = 0; x < MAP_W; x++) {
          if (g[y][x] === p.clear.from) g[y][x] = p.clear.to;
        }
      }
    }
  }
  if (p.paint) {
    const g = grid[p.paint.map];
    if (g) {
      const [x0, y0, x1, y1] = p.paint.rect;
      let seed = 20240823;
      const next = () => {
        seed = (seed * 1664525 + 1013904223) >>> 0;
        return seed / 4294967296;
      };
      for (let y = y0; y <= y1 && y < MAP_H; y++) {
        for (let x = x0; x <= x1 && x < MAP_W; x++) {
          if (g[y][x] === p.paint.from && next() < p.paint.chance) g[y][x] = p.paint.to;
        }
      }
    }
  }
}

/* ---------------- queries ---------------- */

export function tileAt(map, x, y) {
  if (x < 0 || y < 0 || x >= MAP_W || y >= MAP_H) return null;
  const g = grid[map];
  return g ? g[y][x] : null;
}

export function visibleEntities(map, S) {
  return ENTITIES.filter(e => e.map === map && !hidden(e, S));
}

function hidden(e, S) {
  if (e.when && !e.when(S)) return true;
  if (e.kind === 'wild' && S.team.includes(e.species)) return true;
  // a finished project must stop occupying its own tile, or clearing the
  // barrier would open the path and the marker would still block it
  if (e.kind === 'project' && S.projects[e.project]) return true;
  // grunts leave once you have read the page that catches them out
  if (e.kind === 'rocket' && S.flags[e.doc]) return true;
  return false;
}

export function entityAt(map, x, y, S) {
  return ENTITIES.find(e => e.map === map && e.x === x && e.y === y && !hidden(e, S)) || null;
}

/* A crossing you have not earned yet is a wall. There is one: the submarine
   moored under the last board of the dock, which is a boat before it is yours
   and a door afterwards. The rule lives on the EXITS entry rather than here, so
   there is only ever one copy of it. */
function shutExit(map, x, y, S) {
  const e = EXITS.find(o => o.needs && o.map === map && o.x === x && o.y === y);
  return !!e && !e.needs(S);
}

export function blocked(map, x, y, S) {
  const t = tileAt(map, x, y);
  if (t === null) return true;
  if (isSolidTile(t)) return true;
  if (shutExit(map, x, y, S)) return true;
  return !!entityAt(map, x, y, S);
}

/* What you are standing on, for the footstep. Everything walkable on the island
   is one of six things, and anything unmapped falls back to dirt rather than
   going silent -- a missing sound is harder to notice than a wrong one. */
export const TILE_SURFACE = {
  '.': 'grass', ',': 'grass', f: 'grass', m: 'grass',
  S: 'sand', '=': 'dirt', _: 'wood', ':': 'stone', o: 'water',
  // under the water there are no feet, so both of these are the motor
  W: 'deep', F: 'deep', d: 'deep'
};

export function surfaceAt(map, x, y) {
  return TILE_SURFACE[tileAt(map, x, y)] || 'dirt';
}

export function exitAt(map, x, y) {
  return EXITS.find(e => e.map === map && e.x === x && e.y === y) || null;
}

/* Everything reachable on foot from a tile. Used by the self test to prove no
   document or resident is ever walled off. */
export function reachable(map, sx, sy, S) {
  const seen = new Set([sx + ',' + sy]);
  const stack = [[sx, sy]];
  while (stack.length) {
    const [x, y] = stack.pop();
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = x + dx, ny = y + dy, k = nx + ',' + ny;
      if (seen.has(k)) continue;
      const t = tileAt(map, nx, ny);
      if (t === null || isSolidTile(t)) continue;
      seen.add(k);
      stack.push([nx, ny]);
    }
  }
  return seen;
}

/* ---------------- camera ---------------- */

/* Kept fractional on purpose: drawMap draws one extra row and column and
   offsets by the remainder, so walking scrolls smoothly instead of snapping. */
export function camera(px, py) {
  const cx = Math.max(0, Math.min(MAP_W - VIEW_W, px - VIEW_W / 2 + 0.5));
  const cy = Math.max(0, Math.min(MAP_H - VIEW_H, py - VIEW_H / 2 + 0.5));
  return { cx, cy };
}

/* ---------------- drawing ---------------- */

import { bake } from './pixels.js';
import { BASE_DEX, isBroken } from './creatures.js';

export function drawMap(ctx, map, cam, frame, S) {
  const set = tiles();
  const f = frame ? 1 : 0;
  const x0 = Math.floor(cam.cx), y0 = Math.floor(cam.cy);
  const ox = Math.round((cam.cx - x0) * TS), oy = Math.round((cam.cy - y0) * TS);

  for (let vy = 0; vy <= VIEW_H; vy++) {
    for (let vx = 0; vx <= VIEW_W; vx++) {
      const mx = x0 + vx, my = y0 + vy;
      const t = tileAt(map, mx, my);
      const ch = t === null ? edgeTile(map) : t;
      const bank = set[ch] || set['.'];
      const img = bank[Math.min(f, bank.length - 1)][variantAt(mx, my)];
      ctx.drawImage(img, vx * TS - ox, vy * TS - oy);
    }
  }

  for (const e of visibleEntities(map, S)) {
    // residents are <img> elements in #actors so they stay crisp and animated;
    // the canvas only draws one if that image failed to load
    if (e.kind === 'wild' && BASE_DEX[e.species] && !isBroken(e.species)) continue;
    // not every resident has bespoke pixel art, but every resident has to stay
    // findable, so fall back to a generic shape rather than drawing nothing
    const art = e.art || (e.kind === 'wild' ? 'mon_unknown' : null);
    if (!art) continue;
    const sx = (e.x - x0) * TS - ox, sy = (e.y - y0) * TS - oy;
    if (sx < -TS || sy < -TS || sx > VIEW_W * TS || sy > VIEW_H * TS) continue;
    ctx.drawImage(bake(art, 1, false), sx, sy);
  }
}

/* What to show past the edge of a map, so the border never flashes black. */
function edgeTile(map) {
  if (map === 'shallows') return 'B';
  if (map === 'caverns') return '#';
  if (map === 'marsh') return 'e';
  if (map === 'ridge') return 'C';
  if (map === 'beach') return '~';
  return 'T';
}

/* Under the water. Not the cave's vignette with a different colour: this is a
   flat wash over the whole frame, heavier toward the bottom of the screen, plus
   two bands of light coming down from the surface. Without something laid over
   the top the kelp bed reads as a green field seen at night. */
export function drawDeep(ctx, w, h, t) {
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, 'rgba(30, 120, 170, 0.18)');
  g.addColorStop(1, 'rgba(8, 44, 84, 0.52)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  ctx.save();
  ctx.globalAlpha = 0.10;
  ctx.fillStyle = '#dff2ff';
  for (let i = 0; i < 3; i++) {
    const x = ((i * 137 + t * 0.006) % (w + 120)) - 60;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + 26, 0);
    ctx.lineTo(x + 64, h);
    ctx.lineTo(x + 20, h);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
}

/* A soft vignette for the cave, drawn over everything but the UI. */
export function drawGloom(ctx, w, h) {
  const g = ctx.createRadialGradient(w / 2, h / 2, h * 0.22, w / 2, h / 2, h * 0.78);
  g.addColorStop(0, 'rgba(0,0,0,0)');
  g.addColorStop(1, 'rgba(2,6,10,0.72)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
}
