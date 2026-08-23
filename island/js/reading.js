/* Documents and signs.
   A document is the unit of progress in this game: you read it, you answer its
   questions, and answering them is what logs the step. Wrong answers are not
   punished and never block -- the question goes to the back of the queue and
   comes round again after you have read why. You cannot get stuck, but you
   also cannot skip past something you did not understand. */

import { S, save } from './state.js';
import { DOCS, SIGNS } from './content/quests.js';
import * as U from './ui.js';
import { sfx } from './audio.js';
import { advance, step } from './quest.js';

let afterDoc = null;

export function openSign(signId, label) {
  const lines = SIGNS[signId];
  if (!lines) return;
  S.signs[signId] = true; save();
  U.openSheet(`
    <h2>You look closer</h2>
    <p class="kicker">${U.esc(label || 'Somewhere on Verdant Isle')}</p>
    ${U.passageHTML(lines)}
    <div class="row end" style="margin-top:16px">
      <button class="btn" type="button" data-close>Done</button>
    </div>`);
}

export function openDoc(docId, opts = {}) {
  const doc = DOCS[docId];
  if (!doc) return;
  S.read[docId] = (S.read[docId] || 0) + 1;
  save();
  afterDoc = opts.onDone || null;
  const alreadyDone = !!S.flags[docId];
  showPassage(doc, alreadyDone, !!opts.reread);
}

function showPassage(doc, alreadyDone, reread) {
  U.openSheet(`
    ${U.docHeaderHTML(doc)}
    ${U.passageHTML(doc.text)}
    <div class="row" style="margin-top:16px">
      <span class="spacer"></span>
      <button class="btn ghost" type="button" data-close>Put it back</button>
      ${alreadyDone
        ? `<button class="btn" type="button" id="again">Answer again</button>`
        : `<button class="btn" type="button" id="go">I have read it. Ask me.</button>`}
    </div>
    ${alreadyDone ? '<p class="muted small" style="margin:14px 0 0">You have already worked through this one. It stays in your journal for as long as you need it.</p>' : ''}
  `);

  const body = U.$('#sheet-body');
  const start = body.querySelector('#go') || body.querySelector('#again');
  if (start) start.addEventListener('click', () => runQuestions(doc));
}

function runQuestions(doc) {
  const queue = doc.questions.slice();
  const total = doc.questions.length;
  queue.forEach(q => { delete q._missed; });
  let firstTry = 0;
  let seen = 0;

  const nextQ = () => {
    if (!queue.length) return finish(doc, firstTry, total);
    const q = queue.shift();
    seen++;
    const body = U.updateSheet(`
      <h2>${U.esc(doc.title)}</h2>
      <p class="kicker">Comprehension check</p>
      <details style="margin-bottom:14px">
        <summary class="muted small" style="cursor:pointer">Show the text again</summary>
        ${U.passageHTML(doc.text)}
      </details>
      <div id="qhost"></div>`);
    U.askOne(body.querySelector('#qhost'), q, ok => {
      if (ok) {
        if (!q._missed) firstTry++;
      } else {
        q._missed = true;
        queue.push(q);
        U.toast('That one comes back round. Read the note and try it again.', 3000);
      }
      nextQ();
    }, { progress: `${Math.min(seen, total)} of ${total}` });
  };
  nextQ();
}

function finish(doc, firstTry, total) {
  const wasNew = !S.flags[doc.id];
  S.flags[doc.id] = true;
  save();
  sfx.build();

  const before = step().id;
  advance();
  const nowStep = step();
  const clean = firstTry === total;

  U.updateSheet(`
    <h2>Understood</h2>
    <p class="kicker">${U.esc(doc.title)}</p>
    <div class="passage">
      <p>${clean
        ? 'Every question first time. That is what Elm meant about paying attention.'
        : `You got there: <b>${firstTry} of ${total}</b> first time, and the rest after reading why.`}</p>
      ${wasNew ? `<p><b>Logged.</b> ${U.esc(nowStep.log || '')}</p>` : ''}
    </div>
    ${before !== nowStep.id
      ? `<h3>Next</h3><div class="passage"><p>${U.esc(nowStep.objective)}</p></div>`
      : ''}
    <div class="row end" style="margin-top:18px">
      <button class="btn" type="button" data-close>Back to the island</button>
    </div>`);

  const hook = afterDoc;
  afterDoc = null;
  if (hook) hook();
}
