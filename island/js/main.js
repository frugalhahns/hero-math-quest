/* Boot, input, the frame loop, and deciding what happens when you press the
   action button. Everything else lives in its own module. */

import { S, save, give } from './state.js';
import { setSound, sfx } from './audio.js';
import * as music from './music.js';
import * as W from './world.js';
import { TS, VIEW_W, VIEW_H } from './world.js';
import { bake } from './pixels.js';
import * as U from './ui.js';
import { advance, refreshBar } from './quest.js';
import { openDoc, openSign } from './reading.js';
import { meet } from './encounter.js';
import { openBuildList, openProject } from './build.js';
import { openJournal, openTeam, openHelp, openEnding, applyTheme } from './panels.js';
import { pending, form } from './evolve.js';
import { REGIONS } from './content/entities.js';
import { BASE_DEX, TILES_TALL, animUrl, markBroken } from './creatures.js';

const STEP_MS = 145;

const canvas = document.getElementById('screen');
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

const heroCanvas = document.getElementById('hero');
const hctx = heroCanvas.getContext('2d');
hctx.imageSmoothingEnabled = false;

const P = { map: S.map, x: S.x, y: S.y, dir: S.dir || 'down', fromX: S.x, fromY: S.y, t: 1 };
const held = { up: false, down: false, left: false, right: false };
const DELTA = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };

let lastBump = 0;
let stepParity = 0;
const announced = new Set();   // growth nudges already given this session
let waterFrame = 0;
let waterAt = 0;

/* ---------------- boot ---------------- */

applyTheme();
setSound(S.soundOn);
music.setMusic(S.musicOn);
W.buildWorld(S);
U.wireGlossary(document);
advance();
refreshBar(P.map);
checkGrowth();
requestAnimationFrame(loop);

/* Browsers will not let audio start before the player has touched something, so
   the soundtrack waits for the first key press or tap rather than trying at boot
   and being silently blocked. */
let musicStarted = false;
function firstGesture() {
  if (musicStarted) return;
  musicStarted = true;
  music.unlock(P.map);
}
window.addEventListener('pointerdown', firstGesture, { once: true, capture: true });
window.addEventListener('keydown', firstGesture, { once: true, capture: true });

/* An animal becoming ready to grow is easy to miss, so say so once, and keep a
   dot on the Team button until it has been dealt with.
   `announced` is declared up with the other module state on purpose: boot calls
   checkGrowth() before this point in the file, and a `const` down here would
   still be in its temporal dead zone. */
function checkGrowth() {
  const list = pending();
  const teamBtn = document.querySelector('#tools [data-open="team"]');
  if (teamBtn) teamBtn.classList.toggle('has-news', list.length > 0);
  for (const id of list) {
    if (announced.has(id)) continue;
    announced.add(id);
    U.toast(form(id).name + ' is ready to grow. Open Team.', 5000);
  }
}

/* First visit gets a nudge toward the only thing on the beach that is written on. */
if (!S.flags.notice && !S.read.notice) {
  U.toast('Ranger Elm is gone. Something is nailed to the cabin door.', 5200);
}

/* ---------------- the loop ---------------- */

let last = performance.now();

function loop(now) {
  const dt = Math.min(64, now - last);
  last = now;

  if (!U.sheetOpen()) tick(dt);

  if (now - waterAt > 460) { waterFrame ^= 1; waterAt = now; }

  const rx = lerp(P.fromX, P.x, ease(P.t));
  const ry = lerp(P.fromY, P.y, ease(P.t));
  const cam = W.camera(rx, ry);

  W.drawMap(ctx, P.map, cam, waterFrame, S);
  if (REGIONS[P.map] && REGIONS[P.map].dark) W.drawGloom(ctx, canvas.width, canvas.height);
  syncActors(cam);
  drawPlayer(rx, ry, cam, now);

  updatePrompt();
  requestAnimationFrame(loop);
}

function tick(dt) {
  if (P.t < 1) {
    P.t = Math.min(1, P.t + dt / STEP_MS);
    if (P.t >= 1) arrive();
    return;
  }
  const dir = held.up ? 'up' : held.down ? 'down' : held.left ? 'left' : held.right ? 'right' : null;
  if (dir) tryMove(dir);
}

function tryMove(dir) {
  P.dir = dir;
  const [dx, dy] = DELTA[dir];
  const nx = P.x + dx, ny = P.y + dy;
  if (W.blocked(P.map, nx, ny, S)) {
    const now = performance.now();
    if (now - lastBump > 220) { sfx.bump(); lastBump = now; }
    persist();
    return;
  }
  P.fromX = P.x; P.fromY = P.y;
  P.x = nx; P.y = ny; P.t = 0;
  // every other tile: a tap on all eight steps of a walk across the screen is
  // relentless, and it buries the music
  stepParity ^= 1;
  if (stepParity) sfx.step();
}

function arrive() {
  const ex = W.exitAt(P.map, P.x, P.y);
  if (ex) {
    P.map = ex.to;
    P.x = ex.tx; P.y = ex.ty;
    P.fromX = P.x; P.fromY = P.y; P.t = 1;
    P.dir = ex.dir;
    sfx.open();
    refreshBar(P.map);
    music.setRegion(P.map);
    U.toast(REGIONS[P.map] ? REGIONS[P.map].name : P.map, 1800);
  }
  persist();
}

function persist() {
  S.map = P.map; S.x = P.x; S.y = P.y; S.dir = P.dir;
  save();
}

function lerp(a, b, t) { return a + (b - a) * t; }
function ease(t) { return t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2; }

/* ---------------- the player sprite ---------------- */

/* A chunky downward chevron, drawn row by row so it matches the pixel art. */
function chevron(cx, y, half, color) {
  hctx.fillStyle = color;
  for (let r = 0; r <= half; r++) {
    const w = (half - r) * 2 + 1;
    hctx.fillRect(cx - Math.floor(w / 2), y + r, w, 1);
  }
}

/* Markers over anything you can act on. This is the whole answer to "my kid
   cannot tell when there is something to press Space on": the thing you are
   facing gets a big bouncing arrow and a bright ring on its tile, and anything
   on screen you have never looked at gets a small faint one so it can be found
   at all. The faint ones disappear once examined, so the map does not stay
   covered in markers. */
function drawMarkers(cam, now) {
  const bounce = Math.sin(now / 260);
  const facingT = facing();

  for (const e of W.visibleEntities(P.map, S)) {
    const isFacing = e.x === facingT.x && e.y === facingT.y;
    if (!isFacing && !unexamined(e)) continue;

    const sx = Math.round((e.x - cam.cx) * TS);
    const sy = Math.round((e.y - cam.cy) * TS);
    if (sx < -TS || sy < -TS || sx > heroCanvas.width || sy > heroCanvas.height) continue;
    const cx = sx + 8;

    if (isFacing) {
      // a ring on the tile, so it is obvious which square is being talked about
      hctx.strokeStyle = 'rgba(255, 212, 94, 0.95)';
      hctx.lineWidth = 1;
      hctx.strokeRect(sx + 0.5, sy + 0.5, TS - 1, TS - 1);
      const y = sy - 9 + Math.round(bounce * 2);
      chevron(cx, y - 1, 4, '#2b2410');        // outline, so it reads on any tile
      chevron(cx, y, 3, '#ffd45e');
      hctx.fillStyle = '#2b2410';
      hctx.fillRect(cx - 1, y - 5, 2, 3);       // a little stalk above the arrow
      hctx.fillStyle = '#ffd45e';
      hctx.fillRect(cx - 1, y - 4, 2, 2);
    } else {
      hctx.globalAlpha = 0.72;
      const y = sy - 6 + Math.round(bounce * 1.5);
      chevron(cx, y, 2, '#f4efe2');
      hctx.globalAlpha = 1;
    }
  }
}

function drawPlayer(rx, ry, cam, now) {
  const art = P.dir === 'up' ? 'player_up' : P.dir === 'down' ? 'player_down' : 'player_side';
  const flip = P.dir === 'right';
  const walking = P.t < 1;
  const bob = walking && P.t > 0.22 && P.t < 0.78 ? -1 : 0;
  const sx = Math.round((rx - cam.cx) * TS);
  const sy = Math.round((ry - cam.cy) * TS) + bob;
  hctx.clearRect(0, 0, heroCanvas.width, heroCanvas.height);
  if (!U.sheetOpen()) drawMarkers(cam, now);
  // a small shadow keeps the sprite from floating over tall grass
  hctx.globalAlpha = 0.18;
  hctx.fillStyle = '#000';
  hctx.beginPath();
  hctx.ellipse(sx + 8, sy + 15, 5, 2, 0, 0, 7);
  hctx.fill();
  hctx.globalAlpha = 1;
  hctx.drawImage(bake(art, 1, flip), sx, sy);
}

/* ---------------- the actor layer ---------------- */

/* The residents are animated <img> elements sitting over the canvas rather than
   sprites drawn into it: the canvas is 16px tiles blown up by CSS, so scaling a
   48px sprite down to 22px and then magnifying it again looks like mud. This
   keeps one element per visible resident and moves it each frame, which is
   cheap -- no region has more than three on screen at once. */
const actorLayer = document.getElementById('actors');
const actors = new Map();     // species id -> img element
let actorMap = null;          // which region those elements belong to

function syncActors(cam) {
  const here = W.visibleEntities(P.map, S).filter(e => e.kind === 'wild' && BASE_DEX[e.species]);

  if (actorMap !== P.map || actors.size !== here.length ||
      here.some(e => !actors.has(e.species))) {
    for (const img of actors.values()) img.remove();
    actors.clear();
    actorMap = P.map;
    for (const e of here) {
      const img = document.createElement('img');
      img.src = animUrl(BASE_DEX[e.species]);
      img.alt = '';
      // if the file is missing, fall back to the hand-drawn 16x16 on the canvas
      img.addEventListener('error', () => {
        markBroken(e.species);
        img.remove();
        actors.delete(e.species);
      });
      actorLayer.appendChild(img);
      actors.set(e.species, img);
    }
  }

  const pctW = 100 / VIEW_W, pctH = 100 / VIEW_H;
  for (const e of here) {
    const img = actors.get(e.species);
    if (!img) continue;
    // anchored on the bottom centre of its tile, so it stands on the ground
    img.style.left = ((e.x - cam.cx + 0.5) * pctW) + '%';
    img.style.top = ((e.y - cam.cy + 1) * pctH) + '%';
    img.style.height = ((TILES_TALL[e.species] || 1.5) * pctH) + '%';
  }
}

/* ---------------- what you are facing ---------------- */

function facing() {
  const [dx, dy] = DELTA[P.dir];
  return { x: P.x + dx, y: P.y + dy };
}

function facingEntity() {
  const f = facing();
  return W.entityAt(P.map, f.x, f.y, S);
}

const KIND_VERB = {
  doc: 'Read this', sign: 'Look', dig: 'Dig here', item: 'Pick it up',
  wild: 'Say hello', project: 'Take a look', rocket: 'See what they are up to'
};

/* Has this thing never been looked at? Used for the faint markers, so the map
   shows what is left to find and then quietly stops nagging once it is done. */
function unexamined(e) {
  if (e.kind === 'doc') return !S.flags[e.doc];
  if (e.kind === 'sign') return !S.signs[e.sign];
  if (e.kind === 'dig') return !S.flags['dug:' + e.id];
  if (e.kind === 'item') return !S.flags['took:' + e.id];
  if (e.kind === 'project') return !S.projects[e.project];
  if (e.kind === 'rocket') return !S.flags[e.doc];
  return false;   // the animals are their own signpost, they do not need one
}

const actBtn = document.getElementById('btn-act');

function updatePrompt() {
  const el = document.getElementById('prompt');
  const e = U.sheetOpen() ? null : facingEntity();

  if (!e) {
    el.classList.add('hidden');
    actBtn.classList.remove('ready');
    actBtn.textContent = 'Look';
    return;
  }
  const verb = KIND_VERB[e.kind] || 'Look';
  el.innerHTML = `<b>${verb}</b><span>press Space</span>`;
  el.classList.remove('hidden');
  actBtn.classList.add('ready');
  actBtn.textContent = verb;
}

/* ---------------- interaction ---------------- */

function act() {
  if (U.sheetOpen()) return;
  const e = facingEntity();
  if (!e) return;
  const refresh = () => { advance(); refreshBar(P.map); persist(); checkGrowth(); };

  switch (e.kind) {
    case 'doc':
    case 'rocket':
      openDoc(e.doc, { onDone: refresh });
      break;

    case 'sign':
      openSign(e.sign, e.label);
      break;

    case 'dig': {
      const key = 'dug:' + e.id;
      if (e.gives && !S.flags[key]) {
        S.flags[key] = true;
        give(e.gives, 1);
        sfx.item();
        U.openSheet(`
          <h2>You dig</h2>
          ${U.passageHTML([e.found])}
          <div class="why">Picked up: <b>${U.esc(e.giveLabel || e.gives)}</b></div>
          <div class="row end" style="margin-top:16px">
            <button class="btn" type="button" data-close>Good</button>
          </div>`, { onClose: refresh });
      } else {
        U.openSheet(`
          <h2>You dig</h2>
          ${U.passageHTML([S.flags[key]
            ? 'Just the hole you dug here last time.'
            : (e.empty || 'Gravel, and more gravel. Nothing here.')])}
          <div class="row end" style="margin-top:16px">
            <button class="btn" type="button" data-close>Fill it back in</button>
          </div>`);
      }
      break;
    }

    case 'item': {
      const key = 'took:' + e.id;
      if (!e.repeat && S.flags[key]) {
        U.toast('Nothing left here.');
        break;
      }
      S.flags[key] = true;
      give(e.gives, 1);
      sfx.item();
      const total = S.items[e.gives] || 0;
      U.openSheet(`
        <h2>Picked up</h2>
        ${U.passageHTML([e.found])}
        <div class="why">Carrying: <b>${U.esc(e.giveLabel || e.gives)}</b> &times; ${total}</div>
        <div class="row end" style="margin-top:16px">
          <button class="btn" type="button" data-close>Done</button>
        </div>`, { onClose: refresh });
      break;
    }

    case 'wild':
      meet(e, () => { refresh(); });
      break;

    case 'project':
      openProject(e.project, refresh);
      break;
  }
}

/* ---------------- input ---------------- */

const KEYS = {
  ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right',
  w: 'up', s: 'down', a: 'left', d: 'right',
  W: 'up', S: 'down', A: 'left', D: 'right'
};

window.addEventListener('keydown', ev => {
  if (ev.metaKey || ev.ctrlKey || ev.altKey) return;

  if (ev.key === 'Escape') { U.closeSheet(); return; }

  const dir = KEYS[ev.key];
  if (dir) {
    if (!U.sheetOpen()) { held[dir] = true; ev.preventDefault(); }
    return;
  }

  // let the sheet own the keyboard while it is up, apart from Escape
  if (U.sheetOpen()) return;

  if (ev.key === ' ' || ev.key === 'Enter' || ev.key === 'e' || ev.key === 'E') {
    ev.preventDefault();
    act();
    return;
  }
  if (ev.key === 'j' || ev.key === 'J') openJournal();
  if (ev.key === 't' || ev.key === 'T') openTeam();
  if (ev.key === 'b' || ev.key === 'B') openBuildList(() => { advance(); refreshBar(P.map); checkGrowth(); });
  if (ev.key === '?' || ev.key === '/') openHelp();
});

window.addEventListener('keyup', ev => {
  const dir = KEYS[ev.key];
  if (dir) held[dir] = false;
});

window.addEventListener('blur', () => {
  for (const k of Object.keys(held)) held[k] = false;
});

/* touch / mouse pad */
document.querySelectorAll('.dbtn').forEach(b => {
  const dir = b.dataset.dir;
  const on = ev => { ev.preventDefault(); held[dir] = true; };
  const off = ev => { ev.preventDefault(); held[dir] = false; };
  b.addEventListener('pointerdown', on);
  b.addEventListener('pointerup', off);
  b.addEventListener('pointercancel', off);
  b.addEventListener('pointerleave', off);
});

document.getElementById('btn-act').addEventListener('click', act);

/* tapping the map walks toward, or interacts with, what you tapped */
canvas.addEventListener('click', ev => {
  if (U.sheetOpen()) return;
  const r = canvas.getBoundingClientRect();
  const scale = r.width / canvas.width;
  const rx = lerp(P.fromX, P.x, ease(P.t)), ry = lerp(P.fromY, P.y, ease(P.t));
  const cam = W.camera(rx, ry);
  const tx = Math.floor((ev.clientX - r.left) / scale / TS + cam.cx);
  const ty = Math.floor((ev.clientY - r.top) / scale / TS + cam.cy);
  const dx = tx - P.x, dy = ty - P.y;
  if (Math.abs(dx) + Math.abs(dy) === 1) {
    P.dir = dx === 1 ? 'right' : dx === -1 ? 'left' : dy === 1 ? 'down' : 'up';
    if (W.entityAt(P.map, tx, ty, S)) { act(); return; }
    tryMove(P.dir);
  } else if (Math.abs(dx) > Math.abs(dy)) {
    held[dx > 0 ? 'right' : 'left'] = true;
    setTimeout(() => { held.right = held.left = false; }, STEP_MS * Math.min(6, Math.abs(dx)));
  } else if (dy !== 0) {
    held[dy > 0 ? 'down' : 'up'] = true;
    setTimeout(() => { held.down = held.up = false; }, STEP_MS * Math.min(6, Math.abs(dy)));
  }
});

/* top bar */
document.querySelectorAll('#tools [data-open]').forEach(b =>
  b.addEventListener('click', () => {
    const which = b.dataset.open;
    if (which === 'journal') openJournal();
    if (which === 'team') openTeam();
    if (which === 'build') openBuildList(() => { advance(); refreshBar(P.map); checkGrowth(); });
    if (which === 'help') openHelp();
  }));

/* the sheet closes from its own button, from any [data-close], and from Esc */
document.getElementById('sheet-close').addEventListener('click', () => U.closeSheet());
document.getElementById('sheet').addEventListener('click', ev => {
  if (ev.target.closest('[data-close]')) { U.closeSheet(true); return; }
  if (ev.target.id === 'sheet') U.closeSheet();
});

/* the ending fires once, after the sheet that awarded the Ditto is dismissed */
const sheetEl = document.getElementById('sheet');
new MutationObserver(() => {
  music.duck(!sheetEl.classList.contains('hidden'));
  if (sheetEl.classList.contains('hidden') && S.finished && !S.flags.endingShown) {
    S.flags.endingShown = true;
    save();
    sfx.finale();
    setTimeout(openEnding, 420);
  }
}).observe(sheetEl, { attributes: true, attributeFilter: ['class'] });

/* keep the theme in step with the system when set to Auto */
if (window.matchMedia) {
  const mq = window.matchMedia('(prefers-color-scheme: light)');
  const onChange = () => { if ((S.theme || 'auto') === 'auto') applyTheme(); };
  mq.addEventListener ? mq.addEventListener('change', onChange) : mq.addListener(onChange);
}

/* Nothing should be playing into a background tab. */
document.addEventListener('visibilitychange', () => {
  if (document.hidden) music.suspend();
  else if (musicStarted && S.musicOn) music.resume();
});
