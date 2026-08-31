/* The save panel: which kid is playing, moving a game to another device, and
   keeping the browser from throwing the save away.

   The whole reason this exists: localStorage is not durable. Mobile Safari
   clears it after about a week of not visiting the site, any browser can drop
   it when disk runs low, and "clear browsing data" takes it every time. A file
   the family actually holds is the only backup that survives all three, and it
   doubles as the way to carry a game to a different computer. */

import * as U from './ui.js';
import {
  slots, slotName, renameSlot, useSlot, eraseSlot, activeSlot,
  exportObject, fileName, checkFile, describeFile, importInto,
  persistStatus, askToPersist
} from './state.js';
import { QUEST } from './content/quests.js';

/* Running from the home screen rather than inside the browser. Worth knowing
   twice over: iOS only exempts installed apps from clearing their storage, and
   the "add this to your home screen" advice is pointless once you have. */
export function installed() {
  return (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches)
    || window.navigator.standalone === true;
}

function isIOS() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent)
    || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

function slotLine(s) {
  if (!s.used) return 'Empty. A new island starts here.';
  const bits = [`step ${Math.min(s.step + 1, QUEST.length)} of ${QUEST.length}`];
  bits.push(`${s.team} animal${s.team === 1 ? '' : 's'}`);
  if (s.finished) bits.push('finished');
  if (s.updatedAt) bits.push(`played ${s.updatedAt.slice(0, 10)}`);
  return bits.join(' · ');
}

/* Where "never mind" goes. The file flow is reached both from this panel and
   straight off the home page, and on the home page there is no panel to go back
   to -- closing the sheet is the whole way out. */
let back = openSaves;

/* The sheet may or may not already be open depending on which of those two
   doors was used. */
function sheet(html) {
  return U.sheetOpen() ? U.updateSheet(html) : U.openSheet(html);
}

/* ---------------- the panel ---------------- */

export function openSaves() {
  back = openSaves;
  const list = slots();
  const rows = list.map(s => `
    <div class="slot${s.active ? ' on' : ''}">
      <div class="slot-who">
        <b>${U.esc(s.name)}</b>${s.active ? ' <span class="slot-tag">playing now</span>' : ''}
        <div class="small muted">${U.esc(slotLine(s))}</div>
      </div>
      <div class="row">
        ${s.active
          ? `<button class="chip" type="button" data-rename="${s.slot}">Rename</button>`
          : `<button class="chip" type="button" data-use="${s.slot}">${s.used ? 'Play this one' : 'Start here'}</button>`}
        ${s.used ? `<button class="chip" type="button" data-erase="${s.slot}">Erase</button>` : ''}
      </div>
    </div>`).join('');

  const body = U.openSheet(`
    <h2>Your game</h2>
    <p class="kicker">Three islands, one for each player</p>
    <div class="slot-list">${rows}</div>

    <h3>Move it or back it up</h3>
    <p class="muted small">Saving to a file gives you a copy you keep. Load it on any
    other computer or tablet to carry on from exactly where you are, and load it here
    if this browser ever forgets your game.</p>
    <div class="row" style="margin-top:8px">
      <button class="btn" type="button" id="dl">Save to a file</button>
      <button class="btn ghost" type="button" id="up">Load from a file</button>
    </div>
    <input type="file" id="file" accept=".json,application/json" hidden>

    <h3>Keep it on this device</h3>
    <div id="persist" class="muted small">Checking&hellip;</div>
    <div class="row" style="margin-top:8px">
      <button class="btn ghost" type="button" id="keep">Ask to keep it</button>
    </div>
    ${installed() ? '' : `
    <p class="muted small" style="margin-top:14px">${isIOS()
      ? `<b>On an iPad or iPhone:</b> tap the share button, then <b>Add to Home Screen</b>.
         Safari deletes saved games after about a week of not playing, and an island
         opened from the home screen is the one place it leaves them alone.
         <b>Save to a file first</b> &mdash; the home screen copy starts out empty, so
         load your file back in once it is there.`
      : `<b>Tip:</b> install this from your browser's address bar or menu. An installed
         island holds on to its save far better than a tab does.`}</p>`}

    <div class="row end" style="margin-top:18px">
      <button class="btn" type="button" data-close>Close</button>
    </div>`);

  showPersist(body);

  body.querySelectorAll('[data-use]').forEach(b => b.addEventListener('click', () => {
    if (useSlot(b.dataset.use)) location.reload();
    else U.toast('This browser will not let the game switch players.');
  }));

  body.querySelectorAll('[data-rename]').forEach(b => b.addEventListener('click', () => {
    askName(b.dataset.rename);
  }));

  body.querySelectorAll('[data-erase]').forEach(b => b.addEventListener('click', () => {
    confirmErase(b.dataset.erase);
  }));

  body.querySelector('#dl').addEventListener('click', download);

  const file = body.querySelector('#file');
  body.querySelector('#up').addEventListener('click', () => file.click());
  file.addEventListener('change', () => {
    const f = file.files && file.files[0];
    file.value = '';                 // so picking the same file twice still fires
    if (f) readFile(f);
  });

  body.querySelector('#keep').addEventListener('click', async () => {
    const got = await askToPersist();
    U.toast(got === true ? 'This device will hold on to your game.'
      : got === false ? 'The browser said no. Save to a file instead.'
      : 'This browser cannot promise either way. Save to a file instead.');
    showPersist(U.$('#sheet-body'));
  });
}

async function showPersist(body) {
  const el = body && body.querySelector('#persist');
  if (!el) return;
  const state = await persistStatus();
  el.textContent = state === true
    ? 'Protected. This browser has promised not to throw your game away.'
    : state === false
      ? 'Not protected yet. This browser may clear your game to make room.'
      : 'This browser will not say whether your game is protected.';
  const keep = body.querySelector('#keep');
  if (keep) keep.disabled = state === true;
}

/* ---------------- renaming ---------------- */

function askName(slot) {
  const body = U.updateSheet(`
    <h2>Who is playing?</h2>
    ${U.passageHTML(['A first name is plenty. It only shows up on this list.'])}
    <div class="row" style="margin-top:12px">
      <input type="text" id="nm" maxlength="16" autocomplete="off"
             value="${U.esc(slotName(slot))}" aria-label="Player name">
    </div>
    <div class="row end" style="margin-top:18px">
      <button class="btn ghost" type="button" id="back">Never mind</button>
      <button class="btn" type="button" id="ok">That's me</button>
    </div>`);
  const input = body.querySelector('#nm');
  input.focus();
  input.select();
  const commit = () => { renameSlot(slot, input.value); openSaves(); };
  body.querySelector('#ok').addEventListener('click', commit);
  body.querySelector('#back').addEventListener('click', openSaves);
  input.addEventListener('keydown', ev => { if (ev.key === 'Enter') commit(); });
}

/* ---------------- erasing ---------------- */

function confirmErase(slot) {
  const s = slots().find(x => x.slot === slot);
  const body = U.updateSheet(`
    <h2>Erase ${U.esc(s.name)}'s island?</h2>
    ${U.passageHTML([
      `Every page they have read, every animal, every project. ${slotLine(s)}.`,
      'There is no way to get it back afterwards. If you might want it later, close this and save it to a file first.'
    ])}
    <div class="row end" style="margin-top:18px">
      <button class="btn ghost" type="button" id="back">Keep it</button>
      <button class="btn" type="button" id="yes">Erase it</button>
    </div>`);
  body.querySelector('#back').addEventListener('click', openSaves);
  body.querySelector('#yes').addEventListener('click', () => {
    eraseSlot(slot);
    if (slot === activeSlot()) location.reload();
    else openSaves();
  });
}

/* ---------------- to a file and back ---------------- */

function download() {
  let url = null;
  try {
    const text = JSON.stringify(exportObject(), null, 2);
    const blob = new Blob([text], { type: 'application/json' });
    url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName();
    document.body.appendChild(a);
    a.click();
    a.remove();
    U.toast('Saved. Keep that file somewhere safe.');
  } catch (e) {
    U.toast('This browser would not save the file.');
  } finally {
    // revoked late: Safari has not finished reading the blob when click() returns
    if (url) setTimeout(() => URL.revokeObjectURL(url), 10000);
  }
}

/* The home page's "Load a saved file": no panel, just the picker, and then
   straight into choosing where it goes. */
export function openImport() {
  back = () => U.closeSheet(true);
  const file = document.createElement('input');
  file.type = 'file';
  file.accept = '.json,application/json';
  file.hidden = true;
  document.body.appendChild(file);
  file.addEventListener('change', () => {
    const f = file.files && file.files[0];
    file.remove();
    if (f) readFile(f);
  });
  file.click();
}

async function readFile(f) {
  let data = null;
  try {
    const text = await f.text();
    data = JSON.parse(text, (k, v) => (k === '__proto__' ? undefined : v));
  } catch (e) {
    U.toast('That file could not be read.');
    return;
  }
  const bad = checkFile(data);
  if (bad) { U.toast(bad); return; }
  chooseTarget(data);
}

/* Which island to write it over. Showing what is already in each one is the
   whole point -- loading a file is the one action here that can quietly destroy
   a game that was further along. */
function chooseTarget(data) {
  const rows = slots().map(s => `
    <button class="slot pick" type="button" data-into="${s.slot}">
      <div class="slot-who">
        <b>${U.esc(s.name)}</b>${s.active ? ' <span class="slot-tag">playing now</span>' : ''}
        <div class="small muted">${s.used ? 'Has a game: ' + U.esc(slotLine(s)) : 'Empty &mdash; nothing to lose here'}</div>
      </div>
    </button>`).join('');

  const body = sheet(`
    <h2>Load this game</h2>
    ${U.passageHTML([describeFile(data), 'Which island should it go on? Anything already there is written over.'])}
    <div class="slot-list" style="margin-top:12px">${rows}</div>
    <div class="row end" style="margin-top:18px">
      <button class="btn ghost" type="button" id="back">Never mind</button>
    </div>`);

  body.querySelector('#back').addEventListener('click', () => back());
  body.querySelectorAll('[data-into]').forEach(b => b.addEventListener('click', () => {
    const slot = b.dataset.into;
    const s = slots().find(x => x.slot === slot);
    if (!s.used) return commit(data, slot);
    const b2 = U.updateSheet(`
      <h2>Write over ${U.esc(s.name)}?</h2>
      ${U.passageHTML([`${U.esc(s.name)} has a game here: ${slotLine(s)}. Loading this file erases it.`])}
      <div class="row end" style="margin-top:18px">
        <button class="btn ghost" type="button" id="no">Pick another</button>
        <button class="btn" type="button" id="yes">Write over it</button>
      </div>`);
    b2.querySelector('#no').addEventListener('click', () => chooseTarget(data));
    b2.querySelector('#yes').addEventListener('click', () => commit(data, slot));
  }));
}

function commit(data, slot) {
  const bad = importInto(data, slot);
  if (bad) { U.toast(bad); return; }
  useSlot(slot);
  location.reload();
}
