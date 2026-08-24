/* Journal, team, help and settings, and the closing screen.
   The journal is the important one: every document stays re-readable forever,
   a page at a time, because a game about comprehension should never take the
   text away. */

import { S, save, resetAll, accuracy } from './state.js';
import { QUEST, DOCS } from './content/quests.js';
import { SPECIES, BY_ID } from './content/pokemon.js';
import { PROJECTS } from './content/projects.js';
import { REGIONS } from './content/entities.js';
import * as U from './ui.js';
import { openDoc } from './reading.js';
import { setSound } from './audio.js';

export function applyTheme() {
  const pref = S.theme || 'auto';
  const light = pref === 'light' ||
    (pref !== 'dark' && window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches);
  document.documentElement.dataset.theme = light ? 'light' : 'dark';
  const bar = document.querySelector('meta[name="theme-color"]');
  if (bar) bar.setAttribute('content', light ? '#eef4ef' : '#0a1a17');
}

/* ---------------- journal ---------------- */

export function openJournal() {
  const upto = Math.min(S.step, QUEST.length - 1);
  const steps = QUEST.slice(0, upto + 1).map((q, i) => `
    <div class="entry ${i < upto ? 'done' : ''}">
      <div class="t">${i < upto ? '&#10003; ' : ''}${U.esc(q.objective)}</div>
      ${q.log ? `<div class="d">${U.esc(q.log)}</div>` : ''}
    </div>`).reverse().join('');

  const docIds = Object.keys(DOCS).filter(id => S.read[id]);
  const docs = docIds.length
    ? docIds.map(id => `
      <div class="entry ${S.flags[id] ? 'done' : ''}">
        <div class="t">${U.esc(DOCS[id].title)}</div>
        <div class="d">${U.esc(DOCS[id].source || '')}${S.flags[id] ? '' : ' &middot; questions not done yet'}</div>
        <button class="reread" type="button" data-doc="${id}">Read it again</button>
      </div>`).join('')
    : '<p class="muted">Nothing yet. There is a notice on the cabin door.</p>';

  const notes = SPECIES.filter(sp => S.team.includes(sp.id));
  const noteList = notes.length
    ? notes.map(sp => `
      <div class="entry done">
        <div class="t">${U.esc(sp.passage.title)}</div>
        <div class="d">${U.esc(sp.passage.source)}</div>
        <button class="reread" type="button" data-sp="${sp.id}">Read it again</button>
      </div>`).join('')
    : '<p class="muted">Animal notes show up here once you have made friends with that animal.</p>';

  const body = U.openSheet(`
    <h2>Journal</h2>
    <p class="kicker">Step ${Math.min(S.step + 1, QUEST.length)} of ${QUEST.length}</p>

    <h3>What you have done</h3>
    ${steps}

    <h3>Pages you have read</h3>
    ${docs}

    <h3>Animal notes</h3>
    ${noteList}

    <h3>Your reading</h3>
    <div class="passage">
      <p>Questions answered: <b>${S.asked}</b><br>
      Got right: <b>${S.right}</b> (<b>${accuracy()}%</b>)<br>
      Words you looked up: <b>${S.looked}</b><br>
      Animal friends: <b>${S.team.length}</b> of <b>${SPECIES.length}</b><br>
      Projects finished: <b>${Object.keys(S.projects).length}</b> of <b>${PROJECTS.length}</b></p>
    </div>

    <div class="row end" style="margin-top:18px">
      <button class="btn" type="button" data-close>Close</button>
    </div>`);

  body.querySelectorAll('[data-doc]').forEach(b =>
    b.addEventListener('click', () => openDoc(b.dataset.doc, { reread: true })));
  body.querySelectorAll('[data-sp]').forEach(b =>
    b.addEventListener('click', () => showFieldNote(b.dataset.sp)));
}

function showFieldNote(id) {
  const sp = BY_ID[id];
  if (!sp) return;
  U.readPages({
    title: sp.passage.title,
    kicker: sp.passage.source,
    head: `<div class="speaker">
      ${U.creatureImg(sp.id, 84)}
      <div><b>${U.esc(sp.name)}</b><br><span>${U.esc(sp.kind)} &middot; ${U.esc(sp.jobName)}</span></div>
    </div>`,
    pages: sp.passage.text,
    doneLabel: 'Close',
    onDone: () => U.closeSheet(true)
  });
}

/* ---------------- team ---------------- */

export function openTeam() {
  const mine = SPECIES.filter(sp => S.team.includes(sp.id));
  const rest = SPECIES.filter(sp => !S.team.includes(sp.id));

  const body = U.openSheet(`
    <h2>Your friends</h2>
    <p class="kicker">${mine.length} of ${SPECIES.length} animals</p>
    ${mine.length
      ? `<div class="grid2">${mine.map(sp =>
          `<button class="card pick" type="button" data-sp="${sp.id}">
            ${U.creatureImg(sp.id, 48)}
            <div><div class="nm">${U.esc(sp.name)}</div><div class="jb">${U.esc(sp.jobName)}</div></div>
          </button>`).join('')}</div>`
      : '<p class="muted">Nobody yet. Read the notice on the cabin door and start there.</p>'}

    ${rest.length ? `<h3>Not met yet</h3>
      <div class="grid2">${rest.map(() =>
        `<div class="card locked"><div><div class="nm">&mdash;</div>
        <div class="jb">Somewhere on the island</div></div></div>`).join('')}</div>` : ''}

    <div class="row end" style="margin-top:18px">
      <button class="btn" type="button" data-close>Close</button>
    </div>`);
  body.querySelectorAll('[data-sp]').forEach(b =>
    b.addEventListener('click', () => showFieldNote(b.dataset.sp)));
}

/* ---------------- help and settings ---------------- */

export function openHelp(onChange) {
  const body = U.openSheet(`
    <h2>How to play</h2>
    <p class="kicker">Reading is how you win</p>

    <div class="passage">
      <p><b>Nothing shows up on your map.</b> Every step is written down somewhere &mdash;
      a notice, a chart, a tablet, a cave wall. The writing is the only place the answer
      is. Read it, work out what it means, and you will know where to go.</p>
      <p><b>You read a little bit at a time.</b> Press Next for the next few sentences.
      Press Back to read the page you just left again. There is no rush.</p>
      <p><b>You make friends by understanding them.</b> Walk up to any animal and you get
      Ranger Elm's notes about it. Answer questions about those notes and it starts to
      trust you. Get too many wrong and it walks off &mdash; then you read the page again
      and try once more. Nothing is ever lost for good.</p>
      <p><b>Animals do work people cannot do.</b> Each one has a job. Every project needs
      certain jobs, and you have to read to find out which ones. Finishing a project
      changes the island and opens up a new place.</p>
      <p><b>Tap any underlined word</b> to see what it means.</p>
    </div>

    <h3>Buttons</h3>
    <div class="passage">
      <p>Walk: arrow keys, or W A S D, or the pad under the map.<br>
      Look at whatever you are facing: <b>Space</b>, <b>Enter</b>, <b>E</b>, or the big green button.<br>
      Journal <b>J</b> &middot; Team <b>T</b> &middot; Projects <b>B</b> &middot; Close a window <b>Esc</b></p>
    </div>

    <h3>Settings</h3>
    <div class="row" style="gap:6px;margin-bottom:10px">
      <span class="small" style="min-width:5.5em">Theme</span>
      <button class="chip" type="button" data-theme="auto"  data-on="${S.theme === 'auto' ? 1 : 0}">Auto</button>
      <button class="chip" type="button" data-theme="light" data-on="${S.theme === 'light' ? 1 : 0}">Light</button>
      <button class="chip" type="button" data-theme="dark"  data-on="${S.theme === 'dark' ? 1 : 0}">Dark</button>
    </div>
    <div class="row" style="gap:6px;margin-bottom:10px">
      <span class="small" style="min-width:5.5em">Sound</span>
      <button class="chip" type="button" id="snd" data-on="${S.soundOn ? 1 : 0}">${S.soundOn ? 'On' : 'Off'}</button>
    </div>
    <div class="row" style="gap:6px">
      <span class="small" style="min-width:5.5em">Text size</span>
      <button class="chip" type="button" id="big" data-on="${S.bigText ? 1 : 0}">${S.bigText ? 'Large' : 'Normal'}</button>
    </div>

    <h3>Start over</h3>
    <p class="muted small">This erases the whole game on this device. You cannot get it back.</p>
    <div class="row" style="margin-top:8px">
      <button class="btn ghost" type="button" id="reset">Erase and start again</button>
      <span class="spacer"></span>
      <button class="btn" type="button" data-close>Close</button>
    </div>`);

  body.querySelectorAll('[data-theme]').forEach(b => b.addEventListener('click', () => {
    S.theme = b.dataset.theme; save(); applyTheme(); openHelp(onChange);
  }));
  body.querySelector('#snd').addEventListener('click', () => {
    S.soundOn = !S.soundOn; setSound(S.soundOn); save(); openHelp(onChange);
  });
  body.querySelector('#big').addEventListener('click', () => {
    S.bigText = !S.bigText; save(); openHelp(onChange);
  });
  body.querySelector('#reset').addEventListener('click', () => {
    const b2 = U.updateSheet(`
      <h2>Erase everything?</h2>
      ${U.passageHTML(['Every page you have read, every animal, every project. All of it, on this device.'])}
      <div class="row end" style="margin-top:18px">
        <button class="btn ghost" type="button" data-close>Keep it</button>
        <button class="btn" type="button" id="yes">Erase it all</button>
      </div>`);
    b2.querySelector('#yes').addEventListener('click', () => {
      resetAll();
      location.reload();
    });
  });
}

/* ---------------- the end ---------------- */

export function openEnding() {
  const body = U.openSheet(`
    <h2>The island is yours</h2>
    <p class="kicker">Verdant Isle, end of the summer</p>
    <div class="passage">
      <p>The Ditto walks down off the ridge with you. It does not turn into anything the
      whole way, and you decide that is a compliment.</p>
      <p>Elm's cabin is still locked. The notice is still nailed to the door and you leave
      it there, because the next person off the boat is going to need it. Under it you pin
      a page of your own. It says: the tide chart is in the metal box at the far end of the
      dock. Read the chart before you touch anything else.</p>
      <p>Then you go and sit on the dock, and the island gets on with what it was doing.</p>
    </div>

    <h3>What you read</h3>
    <div class="passage">
      <p>Pages read all the way through: <b>${Object.keys(DOCS).filter(id => S.flags[id]).length}</b> of <b>${Object.keys(DOCS).length}</b><br>
      Animal notes finished: <b>${S.team.length}</b> of <b>${SPECIES.length}</b><br>
      Questions answered: <b>${S.asked}</b>, and you got <b>${accuracy()}%</b> right<br>
      Words you looked up: <b>${S.looked}</b><br>
      Projects finished: <b>${Object.keys(S.projects).length}</b> of <b>${PROJECTS.length}</b></p>
    </div>
    <p class="muted small">The island stays open. Anything you have not read yet is still out
    there, and every page stays in your journal as long as you want it.</p>
    <div class="row end" style="margin-top:18px">
      <button class="btn" type="button" data-close>Keep exploring</button>
    </div>`);
}
