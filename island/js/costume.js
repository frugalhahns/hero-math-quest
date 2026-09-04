/* Costumes: what the kid on the screen looks like, and what he had to do to
   look like that.

   Every piece is a palette swap, never a second drawing. The player art is nine
   frames and the bicycle is six more, so a costume that added pixels would have
   to add them fifteen times and would go out of step with a walk frame the first
   time one changed. Swapping the letters `r`/`R` (cap), `g`/`G` (shirt) and `U`
   (trousers) costs nothing, works on every frame that exists and on every frame
   ever added, and still reads across a room: a kid in a yellow cap on a bicycle
   is visibly a different kid.

   The other half of the design is the parent's, and it is a constraint rather
   than a feature: an 8 year old given a dressing room will spend the afternoon
   in it. So this is reachable from the home page and from Settings, and from
   nowhere in the middle of the island. When something new is earned the game
   says so once, in a toast, and does not offer to open anything. */

import { S, save } from './state.js';
import * as U from './ui.js';
import { bake } from './pixels.js';
import { SIGNS } from './content/quests.js';
import { SPECIES } from './content/pokemon.js';
import { sfx } from './audio.js';

/* Three slots, and which palette letters each one paints. */
export const SLOTS = [
  { id: 'cap',   name: 'Cap',      letters: ['r', 'R'] },
  { id: 'shirt', name: 'Shirt',    letters: ['g', 'G'] },
  { id: 'legs',  name: 'Trousers', letters: ['U'] }
];

const allSigns = s => Object.keys(SIGNS).every(id => s.worked[id]);
const allAnimals = s => SPECIES.every(sp => s.team.includes(sp.id));

/* `have` is what unlocks a piece and `how` is what the locked swatch says. The
   two must always agree, which is the sort of thing that rots quietly, so the
   self test reads `how` and checks the piece really is locked at the start and
   really does unlock on a save where everything has been done. */
export const PIECES = {
  cap: [
    { id: 'red',    name: 'Red',    colours: { r: '#dd4f38', R: '#9c2f1e' } },
    { id: 'blue',   name: 'Blue',   colours: { r: '#3a7fc0', R: '#245a86' },
      how: 'Open the channel gate', have: s => !!s.projects.gate },
    { id: 'yellow', name: 'Yellow', colours: { r: '#f6c62e', R: '#c2900f' },
      how: 'Earn the bicycle', have: s => !!s.flags.bicycle },
    { id: 'black',  name: 'Black',  colours: { r: '#39404a', R: '#1e232a' },
      how: 'Catch all three of Team Rocket out',
      have: s => !!(s.flags.rocketBeach && s.flags.rocketMarsh && s.flags.rocketCaves) },
    { id: 'pink',   name: 'Pink',   colours: { r: '#f3a3c2', R: '#c4577f' },
      how: 'Make friends with ten animals', have: s => s.team.length >= 10 },
    { id: 'white',  name: 'White',  colours: { r: '#f4efe2', R: '#b3aa98' },
      how: 'Read Elm\'s last page, at the top', have: s => !!s.flags.summit }
  ],
  shirt: [
    { id: 'green',  name: 'Green',  colours: { g: '#79c257', G: '#3d8636' } },
    { id: 'orange', name: 'Orange', colours: { g: '#f0932a', G: '#b35c15' },
      how: 'Build the rope crossing', have: s => !!s.projects.bridge },
    { id: 'teal',   name: 'Teal',   colours: { g: '#5ec2b1', G: '#2c7a74' },
      how: 'Earn the submarine', have: s => !!s.flags.submarine },
    { id: 'purple', name: 'Purple', colours: { g: '#a07cd0', G: '#674a93' },
      how: 'Clear the rock slide', have: s => !!s.projects.rockslide },
    { id: 'sand',   name: 'Sand',   colours: { g: '#e6d49a', G: '#ab8f52' },
      how: 'Work out every sign on the island', have: allSigns },
    { id: 'red',    name: 'Red',    colours: { g: '#e2604a', G: '#9c2f1e' },
      how: 'Finish what Elm started', have: s => !!s.finished }
  ],
  legs: [
    { id: 'blue',  name: 'Blue',  colours: { U: '#3a6ea8' } },
    { id: 'brown', name: 'Brown', colours: { U: '#7b5730' },
      how: 'Build the reed walkway', have: s => !!s.projects.boardwalk },
    { id: 'grey',  name: 'Grey',  colours: { U: '#5c6a77' },
      how: 'Build the light line', have: s => !!s.projects.lantern },
    { id: 'green', name: 'Green', colours: { U: '#3f7a3c' },
      how: 'Plant the hollow garden', have: s => !!s.projects.garden },
    { id: 'black', name: 'Black', colours: { U: '#2a2f36' },
      how: 'Make friends with every animal there is', have: allAnimals }
  ]
};

/* The first piece in every list is what you start in, and it never locks. */
export function isUnlocked(piece, s = S) {
  return !piece.have || !!piece.have(s);
}

export function pieceOf(slotId, s = S) {
  const list = PIECES[slotId] || [];
  const worn = list.find(p => p.id === (s.costume || {})[slotId]);
  return worn && isUnlocked(worn, s) ? worn : list[0];
}

/* What bake() needs: one flat map of palette letter to colour. */
export function swap(s = S) {
  const out = {};
  for (const slot of SLOTS) Object.assign(out, pieceOf(slot.id, s).colours);
  return out;
}

export function wear(slotId, pieceId) {
  if (!S.costume || typeof S.costume !== 'object') S.costume = {};
  S.costume[slotId] = pieceId;
  save();
}

export function unlockedCount(s = S) {
  return SLOTS.reduce((n, slot) =>
    n + PIECES[slot.id].filter(p => isUnlocked(p, s)).length, 0);
}

export function pieceCount() {
  return SLOTS.reduce((n, slot) => n + PIECES[slot.id].length, 0);
}

/* Said once, when it happens, and never followed by an offer to go and look:
   the dressing room is a thing you visit on the way in or on the way out. */
export function checkWardrobe() {
  const now = unlockedCount();
  const before = S.wardrobe;
  /* The first look at any save is silent. A new island has the three starting
     colours unlocked and would otherwise be told about them before the player
     has done anything, and an island from before this existed would be told
     about fourteen at once. */
  if (typeof before !== 'number' || before <= 0 || now <= before) {
    if (S.wardrobe !== now) { S.wardrobe = now; save(); }
    return false;
  }
  S.wardrobe = now;
  save();
  U.toast('Something new to wear. It is in Get changed, on the home page.', 4600);
  return true;
}

/* ---------------- the dressing room ---------------- */

/* One big front view rather than three small ones, because the point of a close
   up is that a kid can see the colour he just chose from the sofa. It walks on
   the spot: the same two step frames the island uses, so what he is looking at
   is exactly what he will be looking at out there. */
const VIEW = 9;      // pixels per pixel, so 16x16 becomes 144x144

export function openDressingRoom(onDone) {
  let timer = null;
  let frame = 0;

  /* A locked swatch is pressable on purpose. Disabling it would be tidier and
     would also mean that on the tablet this is actually played on, where there
     is no such thing as hovering for a tooltip, a kid could never find out what
     any of them were for. Press it and it tells you, and changes nothing. */
  const swatches = slot => PIECES[slot.id].map(p => {
    const open = isUnlocked(p);
    const worn = pieceOf(slot.id).id === p.id;
    const dot = p.colours[slot.letters[0]];
    return `<button class="swatch${worn ? ' on' : ''}${open ? '' : ' locked'}" type="button"
      data-slot="${slot.id}" data-piece="${p.id}" data-locked="${open ? 0 : 1}"
      title="${U.esc(open ? p.name : p.how)}"
      aria-label="${U.esc(open ? p.name : p.name + ', locked. ' + p.how)}">
      <i style="background:${dot}"></i><span>${U.esc(open ? p.name : 'Locked')}</span></button>`;
  }).join('');

  const html = () => `
    <h2>Get changed</h2>
    <p class="kicker">Every colour here was earned somewhere on the island.</p>
    <div class="dress">
      <canvas id="dress-view" width="${16 * VIEW}" height="${16 * VIEW}" aria-hidden="true"></canvas>
      <div class="dress-slots">
        ${SLOTS.map(slot => `
          <div class="dress-row">
            <div class="small muted">${slot.name}</div>
            <div class="swatches">${swatches(slot)}</div>
          </div>`).join('')}
      </div>
    </div>
    <p class="small muted">${unlockedCount()} of ${pieceCount()} unlocked. The locked ones say what to go and do.</p>
    <div class="row end" style="margin-top:16px">
      <button class="btn" type="button" data-close>Done</button>
    </div>`;

  function paint() {
    const c = document.getElementById('dress-view');
    if (!c) { stop(); return; }
    const g = c.getContext('2d');
    g.imageSmoothingEnabled = false;
    g.clearRect(0, 0, c.width, c.height);
    const art = ['player_down', 'player_down_a', 'player_down', 'player_down_b'][frame % 4];
    g.drawImage(bake(art, 1, false, swap()), 0, 0, c.width, c.height);
  }

  function stop() {
    if (timer) clearInterval(timer);
    timer = null;
  }

  function draw() {
    const body = U.updateSheet(html());
    body.querySelectorAll('.swatch').forEach(b => b.addEventListener('click', () => {
      const slot = SLOTS.find(sl => sl.id === b.dataset.slot);
      const piece = PIECES[b.dataset.slot].find(p => p.id === b.dataset.piece);
      if (b.dataset.locked === '1') {
        U.toast(`${piece.name} ${slot.name.toLowerCase()}: ${piece.how}.`, 3800);
        return;
      }
      wear(b.dataset.slot, b.dataset.piece);
      sfx.open();
      draw();
    }));
    paint();
  }

  U.openSheet(html(), { onClose: () => { stop(); if (onDone) onDone(); } });
  draw();
  timer = setInterval(() => { frame++; paint(); }, 260);
}
