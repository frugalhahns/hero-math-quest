/* Meeting a resident.
   There is no battle. You read the warden's field notes on the animal, then
   answer questions about them, and each correct answer is a point of rapport.
   Get enough and it comes with you. Miss too many and it walks away -- which
   costs you nothing permanent, because you can read the page again and come
   back. The pressure is real without ever being a dead end. */

import { S, save, join, take } from './state.js';
import { BY_ID } from './content/pokemon.js';
import { DOCS } from './content/quests.js';
import * as U from './ui.js';
import { sfx } from './audio.js';
import { advance, step } from './quest.js';

const NEED = 3;          // correct answers required
const PATIENCE = 3;      // wrong answers tolerated

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* Ditto is the final exam: it asks about everything you have actually read. */
function poolFor(sp) {
  if (sp.id !== 'ditto') return shuffle(sp.questions);
  const pool = sp.questions.slice();
  for (const id of Object.keys(S.flags)) {
    if (S.flags[id] && DOCS[id]) pool.push(...DOCS[id].questions);
  }
  for (const id of S.team) {
    if (BY_ID[id]) pool.push(...BY_ID[id].questions);
  }
  return shuffle(pool);
}

export function meet(entity, onDone) {
  const sp = BY_ID[entity.species];
  if (!sp) return;

  if (entity.needsItem && (S.items[entity.needsItem.key] || 0) < entity.needsItem.count) {
    U.openSheet(`
      <h2>${U.esc(sp.name)}</h2>
      <p class="kicker">Asleep</p>
      ${U.passageHTML([entity.without || 'Nothing you try makes any difference.'])}
      <div class="row end" style="margin-top:16px">
        <button class="btn" type="button" data-close>Back away</button>
      </div>`);
    return;
  }

  const isFinal = sp.id === 'ditto';
  const need = isFinal ? 5 : NEED;
  const patience = isFinal ? 3 : PATIENCE;

  intro(sp, entity, need, patience, onDone);
}

function meterHTML(sp, got, need, left, patience) {
  return `
    <div class="speaker">
      ${U.creatureImg(sp.id, 84)}
      <div>
        <b>${U.esc(sp.name)}</b><br>
        <span>${U.esc(sp.kind)} &middot; ${U.esc(sp.jobName)}</span>
      </div>
    </div>
    <div class="row small">
      <span>Rapport <b>${got} / ${need}</b></span>
      <span class="spacer"></span>
      <span>Patience <b>${left} / ${patience}</b></span>
    </div>
    <div class="meter"><i style="width:${Math.round((got / need) * 100)}%"></i></div>`;
}

function intro(sp, entity, need, patience, onDone) {
  const body = U.openSheet(`
    ${meterHTML(sp, 0, need, patience, patience)}
    <h2>${U.esc(sp.passage.title)}</h2>
    <p class="kicker">${U.esc(sp.passage.source)}</p>
    ${U.passageHTML(sp.passage.text)}
    <p class="muted small" style="margin-top:12px">Tap any underlined word for its meaning. You can bring the page back up during the questions.</p>
    <div class="row" style="margin-top:14px">
      <span class="spacer"></span>
      <button class="btn ghost" type="button" data-close>Not yet</button>
      <button class="btn" type="button" id="begin">I have read it</button>
    </div>`);
  body.querySelector('#begin').addEventListener('click', () =>
    round(sp, entity, { got: 0, left: patience, need, patience, pool: poolFor(sp) }, onDone));
}

function round(sp, entity, st, onDone) {
  if (st.got >= st.need) return succeed(sp, entity, st, onDone);
  if (st.left <= 0) return depart(sp, entity, st, onDone);
  if (!st.pool.length) st.pool = poolFor(sp);

  const q = st.pool.shift();
  const body = U.updateSheet(`
    ${meterHTML(sp, st.got, st.need, st.left, st.patience)}
    <details style="margin:12px 0 14px">
      <summary class="muted small" style="cursor:pointer">Show the field notes again</summary>
      ${U.passageHTML(sp.passage.text)}
    </details>
    <div id="qhost"></div>`);

  U.askOne(body.querySelector('#qhost'), q, ok => {
    if (ok) {
      st.got++;
      sfx.rapport();
      U.toast(sp.lines.rapport, 2200);
    } else {
      st.left--;
    }
    round(sp, entity, st, onDone);
  }, { nextLabel: 'Go on' });
}

function succeed(sp, entity, st, onDone) {
  const wasNew = !S.team.includes(sp.id);
  join(sp.id);
  if (entity.needsItem) take(entity.needsItem.key, entity.needsItem.count);
  sfx.caught();

  const before = step().id;
  advance();
  const now = step();

  const body = U.updateSheet(`
    ${meterHTML(sp, st.need, st.need, st.left, st.patience)}
    <h2>${U.esc(sp.name)} joins the survey</h2>
    <div class="passage">
      <p>${U.esc(sp.lines.catch)}</p>
      <p class="muted">${U.esc(sp.name)} can do <b>${U.esc(sp.jobName.toLowerCase())}</b> work. ${U.esc(sp.jobDesc)}</p>
    </div>
    ${before !== now.id
      ? `<h3>Next</h3><div class="passage"><p>${U.esc(now.objective)}</p></div>`
      : ''}
    <div class="row end" style="margin-top:18px">
      <button class="btn" type="button" data-close>Back to the island</button>
    </div>`);
  if (wasNew && sp.id === 'ditto') S.finished = true;
  save();
  if (onDone) onDone(sp);
}

function depart(sp, entity, st, onDone) {
  sfx.flee();
  const body = U.updateSheet(`
    ${meterHTML(sp, st.got, st.need, 0, st.patience)}
    <h2>${U.esc(sp.name)} has had enough</h2>
    <div class="passage">
      <p>${U.esc(sp.lines.flee)}</p>
      <p>Nothing is lost. Read the page properly &mdash; the answers are all in it &mdash; and it will be back where you found it.</p>
    </div>
    <div class="row end" style="margin-top:18px">
      <button class="btn ghost" type="button" id="reread">Read the notes again</button>
      <button class="btn" type="button" data-close>Leave it alone</button>
    </div>`);
  body.querySelector('#reread').addEventListener('click', () =>
    intro(sp, entity, st.need, st.patience, onDone));
}
