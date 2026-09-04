/* The home page: who is playing, and how far they have got.

   It exists because the save panel was two taps deep behind the "?" button, so
   in practice nobody was ever asked their name and a second kid would quietly
   play on top of the first one's island. Now the first thing you see is your own
   island with your own name on it, and starting a second one is a card rather
   than a settings screen.

   The world behind this is already built by the time it is drawn, so "Keep
   going" is instant. Nothing in the game moves while it is up: main.js blocks
   input, and the overlay is opaque, so there is never a frame of somebody
   else's island showing through. */

import * as U from './ui.js';
import {
  slots, renameSlot, useSlot, activeSlot, markEntered, enteredThisSession
} from './state.js';
import { QUEST } from './content/quests.js';
import { REGIONS } from './content/entities.js';
import { openImport } from './saves.js';
import { openHelp } from './panels.js';
import { openDressingRoom } from './costume.js';

/* index.html decides this before first paint, so the page never flashes the
   home screen at somebody who has already chosen, or the island at somebody who
   has not. This only reads that decision back. */
export function needed() {
  return document.documentElement.dataset.home !== 'off' && !enteredThisSession();
}

/* ---------------- the lines under a name ---------------- */

function when(iso) {
  if (typeof iso !== 'string' || !iso) return '';
  const day = iso.slice(0, 10);
  const today = new Date().toISOString().slice(0, 10);
  if (day === today) return 'played today';
  const y = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  if (day === y) return 'played yesterday';
  const d = new Date(day + 'T00:00:00');
  if (isNaN(d)) return '';
  return 'played ' + d.getDate() + ' ' +
    ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][d.getMonth()];
}

/* One line, so it can never wrap with a dangling separator: how far, how many,
   and when. Where you were gets a line of its own on the card you are being
   offered, and nowhere else -- it is a reminder, not an inventory. */
function progress(s) {
  const bits = [`step ${Math.min(s.step + 1, QUEST.length)} of ${QUEST.length}`];
  bits.push(`${s.team} animal${s.team === 1 ? '' : 's'}`);
  if (s.finished) bits.push('finished');
  const w = when(s.updatedAt);
  if (w) bits.push(w);
  return bits.join(' · ');
}

function place(s) {
  const r = s.map && REGIONS[s.map];
  return r ? `last seen in ${r.name}` : '';
}

/* ---------------- the page ---------------- */

/* The card offered first is the one you were last on, so the common case --
   one kid, one island, coming back to it -- is a single tap on a button that
   says what it does. */
/* An island counts as somebody's the moment a name is typed, not once the first
   save lands. Otherwise a kid who names an island and then closes the tab comes
   back to find their name gone and the slot offered to the next person. */
function taken(s) { return s.used || s.named; }

function pick(list) {
  const used = list.filter(taken);
  if (!used.length) return null;
  const active = used.find(s => s.active);
  if (active) return active;
  return used.slice().sort((a, b) => String(b.updatedAt || '').localeCompare(String(a.updatedAt || '')))[0];
}

/* A string rather than a mounted element, so the self test can read it without
   a page to put it on. */
/* The dressing room edits the island that is actually loaded, which is the
   active slot and no other. Offering it on a card that would need a page reload
   to become current is how you dress the wrong kid. */
export function homeHTML(list, active = activeSlot()) {
  const first = pick(list);
  const used = list.filter(taken);
  const cards = first ? [first, ...used.filter(s => s !== first)] : used;
  const free = list.find(s => !taken(s));

  const card = s => {
    const lead = s === first;
    return `
    <div class="home-card${lead ? ' lead' : ''}">
      <div class="home-who">
        <b>${U.esc(s.name)}</b>
        <div class="small muted">${U.esc(progress(s))}</div>
        ${lead && place(s) ? `<div class="small muted">${U.esc(place(s))}</div>` : ''}
      </div>
      <div class="home-go">
        <button class="btn${lead ? '' : ' ghost'}" type="button" data-play="${s.slot}">
          ${lead ? 'Keep going' : 'Play'} &#9656;</button>
        <button class="chip" type="button" data-rename="${s.slot}">Rename</button>
      </div>
    </div>`;
  };

  const newCard = free ? `
    <div class="home-card new" id="home-new">
      <div class="home-who">
        <b>+ New player</b>
        <div class="small muted">An empty island starts here</div>
      </div>
      <div class="home-go">
        <button class="btn ghost" type="button" data-new="${free.slot}">Start one</button>
      </div>
    </div>` : `
    <p class="muted small home-full">Three islands is all one device holds. To make room,
    erase one from <b>Players and backups</b> in Settings.</p>`;

  const nobody = !list.some(taken);

  return `
    <div class="home-inner">
      <h1 class="home-title">&#127796; Verdant Isle</h1>
      <p class="home-kicker">A reading expedition</p>
      ${nobody ? '<p class="home-lead">Who is playing? Type a name and the island is yours.</p>' : ''}
      <div class="home-list">${cards.map(card).join('')}${newCard}</div>
      <div class="home-feet">
        ${first && first.slot === active
          ? '<button class="chip" type="button" id="home-dress">Get changed</button>'
          : ''}
        <button class="chip" type="button" id="home-load">Load a saved file</button>
        <button class="chip" type="button" id="home-settings">Settings</button>
      </div>
      <p class="home-note muted small">Your game is saved on this device. Nothing is sent anywhere.</p>
    </div>`;
}

/* ---------------- naming ---------------- */

/* The name box replaces the card it was tapped on rather than opening a sheet,
   because a sheet on top of the home page is one lid too many. */
function nameCard(slot, existing) {
  return `
    <div class="home-card naming">
      <div class="home-who">
        <b>${existing ? 'What should we call you?' : 'Who is playing?'}</b>
        <div class="small muted">A first name is plenty. It only shows up here.</div>
        <input type="text" id="home-name" maxlength="16" autocomplete="off"
               value="${U.esc(existing || '')}" aria-label="Player name">
      </div>
      <div class="home-go">
        <button class="btn" type="button" id="home-ok">${existing ? 'Save it' : "That's me"}</button>
        <button class="chip" type="button" id="home-cancel">Never mind</button>
      </div>
    </div>`;
}

/* ---------------- mounting ---------------- */

let root = null;
let begin = null;

export function mount(onStart) {
  root = document.getElementById('title');
  begin = onStart;
  if (!root) { onStart(false); return; }
  draw();
}

function draw() {
  root.innerHTML = homeHTML(slots(), activeSlot());
  const dress = root.querySelector('#home-dress');
  if (dress) dress.addEventListener('click', () => openDressingRoom(draw));
  root.querySelectorAll('[data-play]').forEach(b =>
    b.addEventListener('click', () => enter(b.dataset.play)));
  root.querySelectorAll('[data-rename]').forEach(b =>
    b.addEventListener('click', () => ask(b.dataset.rename, false)));
  root.querySelectorAll('[data-new]').forEach(b =>
    b.addEventListener('click', () => ask(b.dataset.new, true)));
  root.querySelector('#home-load').addEventListener('click', () => openImport());
  root.querySelector('#home-settings').addEventListener('click', () => openHelp());
  const lead = root.querySelector('.home-card.lead .btn') || root.querySelector('.home-card .btn');
  if (lead) lead.focus({ preventScroll: true });
}

/* `isNew` is the difference between naming a fresh island, which then starts,
   and renaming one that is already being played, which then goes back. */
function ask(slot, isNew) {
  const list = slots();
  const s = list.find(x => x.slot === slot);
  const card = isNew ? root.querySelector('#home-new') : null;
  if (card) card.outerHTML = nameCard(slot, '');
  else root.innerHTML = `<div class="home-inner">${nameCard(slot, s && s.named ? s.name : '')}</div>`;

  const input = root.querySelector('#home-name');
  input.focus();
  input.select();
  const done = () => {
    renameSlot(slot, input.value);
    if (isNew) enter(slot); else draw();
  };
  root.querySelector('#home-ok').addEventListener('click', done);
  root.querySelector('#home-cancel').addEventListener('click', draw);
  input.addEventListener('keydown', ev => { if (ev.key === 'Enter') done(); });
}

/* ---------------- into the game ---------------- */

/* Continuing the island already loaded is just a matter of getting out of the
   way. Any other island means a reload, because which save is loaded is settled
   once, at boot, and fifteen modules are already holding a reference to it. */
function enter(slot) {
  if (slot === activeSlot()) {
    markEntered(slot);
    hide();
    return;
  }
  if (!useSlot(slot)) {
    U.toast('This browser will not let the game switch players.');
    return;
  }
  markEntered(slot);
  location.reload();
}

function hide() {
  document.documentElement.dataset.home = 'off';
  if (root) root.classList.add('hidden');
  const go = begin;
  begin = null;
  if (go) go(true);         // a finger got us here, which the soundtrack needs
}
