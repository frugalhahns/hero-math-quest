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
import * as sync from './sync.js';

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

    ${syncSection()}

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

  wireSync(body);

  body.querySelector('#keep').addEventListener('click', async () => {
    const got = await askToPersist();
    U.toast(got === true ? 'This device will hold on to your game.'
      : got === false ? 'The browser said no. Save to a file instead.'
      : 'This browser cannot promise either way. Save to a file instead.');
    showPersist(U.$('#sheet-body'));
  });
}

/* ---------------- the same island on every device ---------------- */

/* Hidden entirely until the Worker exists, because a section explaining a thing
   the family cannot do yet is worse than no section. sync.js reports itself as
   not set up while its address is still a placeholder. */
function syncSection() {
  if (!sync.endpoint()) return '';
  const c = sync.code();
  if (!c) {
    return `
    <h3>Play on any device</h3>
    <p class="muted small">Turn this on and you get a family code. Type it into the
    other tablet or computer once, and every island here shows up there too, and
    stays up to date on its own. No account, no password, nothing to sign into.
    Your islands are locked with the code before they leave this device, so
    nobody at the other end can read them, not even us.</p>
    <div class="row" style="margin-top:8px">
      <button class="btn" type="button" id="sync-on">Turn this on</button>
      <button class="btn ghost" type="button" id="sync-have">I have a code</button>
    </div>`;
  }
  const when = sync.lastSync();
  const link = location.origin + location.pathname.replace(/[^/]*$/, '') + '#sync=' + c.replace(/-/g, '');
  return `
    <h3>Play on any device</h3>
    <p class="muted small">Your family code. Type it into another device, or open the
    link there, and the islands follow.</p>
    <p class="synccode" id="sync-code">${U.esc(c)}</p>
    <div class="row" style="margin-top:8px">
      <button class="chip" type="button" id="sync-copy">Copy the code</button>
      <button class="chip" type="button" id="sync-link" data-link="${U.esc(link)}">Copy a link</button>
      <button class="chip" type="button" id="sync-go">Sync now</button>
      <button class="chip" type="button" id="sync-off">Turn off</button>
    </div>
    <p class="muted small" id="sync-when">${when
      ? 'Last agreed with the other devices ' + U.esc(new Date(when).toLocaleString()) + '.'
      : 'Nothing has been sent yet.'}</p>`;
}

function wireSync(body) {
  const on = body.querySelector('#sync-on');
  if (on) on.addEventListener('click', () => {
    sync.setCode(sync.newCode());
    runSync('Turned on. Type this code into your other device.');
  });

  const have = body.querySelector('#sync-have');
  if (have) have.addEventListener('click', askCode);

  const copy = body.querySelector('#sync-copy');
  if (copy) copy.addEventListener('click', () => hand(sync.code(), 'Code copied.'));

  const link = body.querySelector('#sync-link');
  if (link) link.addEventListener('click', () => hand(link.dataset.link, 'Link copied. Open it on the other device.'));

  const go = body.querySelector('#sync-go');
  if (go) go.addEventListener('click', () => runSync(null));

  const off = body.querySelector('#sync-off');
  if (off) off.addEventListener('click', () => {
    sync.forget();
    sync.stopWatching();
    U.toast('Syncing off. Nothing already on this device is lost.');
    openSaves();
  });
}

/* Clipboard writes are refused often enough -- an insecure origin, a browser
   that wants a fresher gesture -- that the fallback matters more than the
   copy does. Being told the code and left looking at it is a fine outcome. */
async function hand(text, said) {
  try {
    await navigator.clipboard.writeText(text);
    U.toast(said);
  } catch (e) {
    U.toast(text, 9000);
  }
}

async function runSync(said) {
  U.toast(said || 'Syncing\u2026', 2000);
  const out = await sync.syncNow({ ask: askWhichCopy });
  sync.watch();
  if (out.changed.some(c => c.slot === activeSlot())) { location.reload(); return; }
  if (!out.ran) U.toast('Could not reach the other devices. Your island is safe here.', 4000);
  else if (out.clash.length) U.toast('One island is being played somewhere else. Nothing was overwritten.', 5000);
  else if (!said) U.toast('Up to date.', 2000);
  openSaves();
}

function askCode() {
  const body = U.updateSheet(`
    <h2>Type the family code</h2>
    <p class="muted small">It is on the other device, under Play on any device. Capital
    letters, dashes, spaces: none of it matters.</p>
    <input type="text" id="code-in" maxlength="24" autocomplete="off" autocapitalize="characters"
      spellcheck="false" placeholder="XXXX-XXXX-XXXX-XXXX">
    <p class="muted small" id="code-bad" style="min-height:1.2em"></p>
    <div class="row end" style="margin-top:14px">
      <button class="btn ghost" type="button" id="code-back">Back</button>
      <button class="btn" type="button" id="code-ok">Use this code</button>
    </div>`);
  const input = body.querySelector('#code-in');
  input.focus();
  body.querySelector('#code-back').addEventListener('click', openSaves);
  body.querySelector('#code-ok').addEventListener('click', () => {
    if (!sync.setCode(input.value)) {
      body.querySelector('#code-bad').textContent =
        'That is not a family code. It is sixteen letters and numbers.';
      return;
    }
    runSync('Code saved. Fetching your islands\u2026');
  });
  input.addEventListener('keydown', ev => { if (ev.key === 'Enter') body.querySelector('#code-ok').click(); });
}

/* Both sides have moved since they last agreed, so somebody has to lose. Ask,
   in the plainest words available, and never guess: the wrong guess here is an
   afternoon of reading gone. */
export function askWhichCopy({ name, here, there }) {
  return new Promise(resolve => {
    const body = U.updateSheet(`
      <h2>Two copies of ${U.esc(name || 'an island')}</h2>
      <p>This island has been played in two places since they last agreed, so they do
      not match any more. Keeping one means letting the other one go.</p>
      <ul>
        <li><b>This device</b> has ${here} saves on it.</li>
        <li><b>The other device</b> has ${there}.</li>
      </ul>
      <p class="muted small">More saves usually means further along, but not always.
      If you are not sure, close this and save both to a file first.</p>
      <div class="row end" style="margin-top:14px">
        <button class="btn ghost" type="button" id="clash-none">Decide later</button>
        <button class="btn ghost" type="button" id="clash-theirs">Keep the other one</button>
        <button class="btn" type="button" id="clash-mine">Keep this one</button>
      </div>`);
    /* Every way out of this sheet has to answer, including the ways that are not
       buttons. Sync waits on this promise and holds the queue while it waits, so
       a player who closes the sheet with the X or with Escape and never comes
       back would stop the island syncing for the rest of the session. */
    let said = false;
    const pick = what => {
      if (said) return;
      said = true;
      clearInterval(gone);
      resolve(what);
    };
    const gone = setInterval(() => {
      if (document.getElementById('sheet').classList.contains('hidden')) pick(null);
    }, 300);
    body.querySelector('#clash-mine').addEventListener('click', () => pick('mine'));
    body.querySelector('#clash-theirs').addEventListener('click', () => pick('theirs'));
    body.querySelector('#clash-none').addEventListener('click', () => pick(null));
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
