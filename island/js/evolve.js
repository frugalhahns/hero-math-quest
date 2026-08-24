/* Growing up.
   An animal grows when you can answer questions about its field notes with the
   notes SHUT. That is the whole design: reading it once to make friends is
   comprehension, and answering about it later from memory is recall, which is a
   different skill and the harder one.

   Two things make it teach rather than just reward:
     - the gap. An animal is not offered the test the moment it joins you. It
       waits until you have moved a few steps further through the island, so by
       the time you are asked, the page is no longer fresh in your head. Spacing
       the recall out is what makes it stick.
     - no text. There is no "read it again" button anywhere in the test. If you
       cannot remember, you go and re-read the notes in the journal, and come
       back, which is exactly the loop you want.

   Nothing is ever lost. Getting it wrong just means not yet. */

import { S, save } from './state.js';
import { BY_ID } from './content/pokemon.js';
import { creatureImg } from './creatures.js';
import * as U from './ui.js';
import { sfx } from './audio.js';

const GAP_FIRST = 2;   // chain steps between joining you and the first test
const GAP_NEXT = 3;    // and between one growth and the next
const NEED = 3;        // correct answers required
const ALLOWED_WRONG = 1;

export function stage(id) { return S.stage[id] || 0; }

export function form(id) {
  const sp = BY_ID[id];
  if (!sp) return null;
  const i = Math.min(stage(id), sp.line.length - 1);
  return Object.assign({}, sp.line[i], { stage: i, last: i === sp.line.length - 1 });
}

export function nextForm(id) {
  const sp = BY_ID[id];
  if (!sp) return null;
  const i = stage(id) + 1;
  return i < sp.line.length ? Object.assign({}, sp.line[i], { stage: i }) : null;
}

/* Some animals are already what they are going to be, and that is worth saying
   out loud rather than leaving the player waiting for something. */
export function canGrow(id) { return !!nextForm(id); }

function lastChanged(id) {
  if (S.grownAt && S.grownAt[id] !== undefined) return S.grownAt[id];
  if (S.joinedAt && S.joinedAt[id] !== undefined) return S.joinedAt[id];
  return null;
}

export function stepsToGo(id) {
  const at = lastChanged(id);
  if (at === null) return 0;
  const gap = stage(id) === 0 ? GAP_FIRST : GAP_NEXT;
  return Math.max(0, (at + gap) - S.step);
}

export function ready(id) {
  return S.team.includes(id) && canGrow(id) && stepsToGo(id) === 0;
}

export function pending() { return S.team.filter(ready); }

export function grownCount() {
  return S.team.filter(id => stage(id) > 0).length;
}

export function growableCount() {
  return Object.keys(BY_ID).filter(id => BY_ID[id].line.length > 1).length;
}

function shuffle(a) {
  const b = a.slice();
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
}

/* ---------------- the test ---------------- */

export function tryGrow(id, onDone) {
  const sp = BY_ID[id];
  const now = form(id);
  const next = nextForm(id);
  if (!sp || !next) return;

  const body = U.openSheet(`
    <div class="speaker">
      ${creatureImg(now.dex, 84)}
      <div><b>${U.esc(now.name)}</b><br><span>${U.esc(sp.kind)} &middot; ready to grow</span></div>
    </div>
    <h2>Can you remember?</h2>
    <p class="kicker">From memory this time</p>
    <div class="passage">
      <p>${U.esc(now.name)} is ready to grow. But it wants to know that you really
      took its notes in, not just read them once.</p>
      <p><b>The notes stay shut for this.</b> There is no button to peek at them.
      Answer ${NEED} questions from what you remember.</p>
      <p>Get it wrong and nothing bad happens. Go and read the notes again in your
      journal, then come back and try once more.</p>
    </div>
    <div class="row" style="margin-top:18px">
      <button class="btn ghost" type="button" data-close>Not yet</button>
      <span class="spacer"></span>
      <button class="btn" type="button" id="go">I remember</button>
    </div>`);

  body.querySelector('#go').addEventListener('click', () => {
    run(id, sp, next, { pool: shuffle(sp.questions), got: 0, wrong: 0 }, onDone);
  });
}

function run(id, sp, next, st, onDone) {
  if (st.got >= NEED) return succeed(id, sp, next, onDone);
  if (st.wrong > ALLOWED_WRONG || !st.pool.length) return fall(id, sp, st, onDone);

  const q = st.pool.shift();
  const now = form(id);
  const body = U.updateSheet(`
    <div class="speaker">
      ${creatureImg(now.dex, 84)}
      <div><b>${U.esc(now.name)}</b><br><span>From memory &middot; no notes</span></div>
    </div>
    <div class="row small">
      <span>Remembered <b>${st.got} / ${NEED}</b></span>
      <span class="spacer"></span>
      <span>${st.wrong > 0 ? 'One miss so far' : 'No misses yet'}</span>
    </div>
    <div class="meter"><i style="width:${Math.round((st.got / NEED) * 100)}%"></i></div>
    <div id="qhost"></div>`);

  // deliberately no re-read button anywhere on this screen
  U.askOne(body.querySelector('#qhost'), q, ok => {
    if (ok) st.got++; else st.wrong++;
    run(id, sp, next, st, onDone);
  }, { nextLabel: 'Go on' });
}

function succeed(id, sp, next, onDone) {
  S.stage[id] = stage(id) + 1;
  if (!S.grownAt) S.grownAt = {};
  S.grownAt[id] = S.step;
  save();
  sfx.finale();

  const grown = form(id);
  U.readPages({
    title: `${sp.line[grown.stage - 1].name} grew into ${grown.name}!`,
    kicker: 'You remembered it',
    head: `<div class="speaker">
      ${creatureImg(grown.dex, 84)}
      <div><b>${U.esc(grown.name)}</b><br><span>${U.esc(sp.kind)} &middot; ${U.esc(sp.jobName)}</span></div>
    </div>`,
    pages: [
      grown.blurb || `${grown.name} looks very pleased with itself.`,
      grown.last
        ? `${grown.name} is fully grown now. It still does the same job for you, and it still remembers you reading its page out on the island.`
        : `${grown.name} may have further to go yet. Keep exploring, and come back to it later.`
    ],
    doneLabel: 'Wonderful',
    onDone: () => { U.closeSheet(true); if (onDone) onDone(); }
  });
}

function fall(id, sp, st, onDone) {
  const now = form(id);
  const body = U.updateSheet(`
    <div class="speaker">
      ${creatureImg(now.dex, 84)}
      <div><b>${U.esc(now.name)}</b><br><span>Not this time</span></div>
    </div>
    <h2>Not quite yet</h2>
    <div class="passage">
      <p>You remembered <b>${st.got}</b> of ${NEED}. That is not a problem and nothing is lost.</p>
      <p>Go to your journal, read ${U.esc(now.name)}'s notes again, and then come
      straight back here. It will still be waiting.</p>
    </div>
    <div class="row" style="margin-top:18px">
      <button class="btn ghost" type="button" data-close>Later</button>
      <span class="spacer"></span>
      <button class="btn" type="button" id="read">Read the notes now</button>
    </div>`);

  body.querySelector('#read').addEventListener('click', () => {
    U.readPages({
      title: sp.passage.title,
      kicker: sp.passage.source,
      pages: sp.passage.text,
      doneLabel: 'Try again',
      first: false,
      onDone: () => tryGrow(id, onDone)
    });
  });
}
