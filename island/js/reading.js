/* Documents and signs.
   A document is the unit of progress in this game: you read it, you answer its
   questions, and answering them is what logs the step. The reading happens a
   few sentences at a time -- Next to go on, Back to re-read the page you just
   left -- because a screen full of text is the fastest way to lose a reader
   this age. Wrong answers are not punished and never block: the question goes
   to the back of the queue and comes round again after you have read why. You
   cannot get stuck, and you cannot skip past something you did not follow. */

import { S, save, give } from './state.js';
import { DOCS, SIGNS } from './content/quests.js';
import * as U from './ui.js';
import { sfx } from './audio.js';
import { advance, step } from './quest.js';

let afterDoc = null;

/* A sign is read the same way a document is, and then it asks its one question.
   Getting it right pays out once; getting it wrong costs nothing but a walk
   back, because a sign is optional and punishing an optional thing is how you
   teach a kid to walk past it. */
export function openSign(signId, label) {
  const sign = SIGNS[signId];
  if (!sign) return;
  S.signs[signId] = true;
  save();
  const ask = !!sign.q;
  U.readPages({
    title: 'You look closer',
    kicker: label || 'Somewhere on Verdant Isle',
    pages: sign.text,
    doneLabel: ask ? (S.worked[signId] ? 'Work it out again' : 'Work it out') : 'Done',
    onDone: () => (ask ? askSign(signId, sign, label) : U.closeSheet(true))
  });
}

function askSign(signId, sign, label) {
  const q = sign.q;
  const body = U.updateSheet(`
    <h2>Work it out</h2>
    <p class="kicker">${U.esc(q.from
      ? 'The number you want is on a sign you have already read'
      : 'Everything you need is on the sign')}</p>
    <div class="row" style="margin-bottom:14px">
      <button class="btn ghost small" type="button" id="reread">Read it again</button>
    </div>
    <div id="qhost"></div>`);

  body.querySelector('#reread').addEventListener('click', () => {
    U.readPages({
      title: 'You look closer',
      kicker: label || 'Somewhere on Verdant Isle',
      pages: sign.text,
      doneLabel: 'Back to the question',
      first: false,
      onDone: () => askSign(signId, sign, label)
    });
  });

  const first = !S.worked[signId];
  U.askOne(body.querySelector('#qhost'), q, ok => {
    if (!ok) {
      U.closeSheet(true);
      U.toast('Have another look at it, then come back.', 3200);
      return;
    }
    if (first) {
      S.worked[signId] = true;
      if (sign.gives) give(sign.gives, 1);   // give() saves
      else save();
      sfx.item();
    }
    U.updateSheet(`
      <h2>${first ? 'Worked out' : 'Right again'}</h2>
      ${U.passageHTML([first
        ? 'Tucked behind the sign, where only somebody who stopped to work it out would think to look:'
        : 'Same answer as last time, and still the right one.'])}
      ${first && sign.gives
        ? `<div class="why">Picked up: <b>a Rowan berry</b>. You have <b>${S.items[sign.gives] || 0}</b>.</div>`
        : ''}
      <div class="row end" style="margin-top:16px">
        <button class="btn" type="button" data-close>Good</button>
      </div>`);
  }, { label: 'Work it out', nextLabel: 'Done' });
}

export function openDoc(docId, opts = {}) {
  const doc = DOCS[docId];
  if (!doc) return;
  S.read[docId] = (S.read[docId] || 0) + 1;
  save();
  afterDoc = opts.onDone || null;
  showPassage(doc, !!S.flags[docId]);
}

function showPassage(doc, alreadyDone) {
  U.readPages({
    title: doc.title,
    kicker: doc.source || '',
    pages: doc.text,
    closeLabel: 'Put it back',
    doneLabel: alreadyDone ? 'Answer again' : 'Ask me about it',
    onDone: () => runQuestions(doc)
  });
}

/* `ask` is how many of a document's questions get asked. The beach documents set
   it below the number they carry, because the first region was asking ten
   questions before the first gate opened. The ones left out are not wasted: the
   subset is drawn fresh each time, so answering again asks a different pair, and
   it stays in the order the text made its points. */
function pickQuestions(doc) {
  const all = doc.questions;
  const want = Math.min(doc.ask || all.length, all.length);
  if (want >= all.length) return all.slice();
  const idx = all.map((_, i) => i);
  for (let i = idx.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  return idx.slice(0, want).sort((a, b) => a - b).map(i => all[i]);
}

function runQuestions(doc) {
  const queue = pickQuestions(doc);
  const total = queue.length;
  queue.forEach(q => { delete q._missed; });
  let firstTry = 0;
  let seen = 0;
  let current = null;

  function showQuestion() {
    const body = U.updateSheet(`
      <h2>${U.esc(doc.title)}</h2>
      <p class="kicker">Question ${Math.min(seen, total)} of ${total}</p>
      <div class="row" style="margin-bottom:14px">
        <button class="btn ghost small" type="button" id="reread">Read it again</button>
      </div>
      <div id="qhost"></div>`);

    body.querySelector('#reread').addEventListener('click', () => {
      U.readPages({
        title: doc.title,
        kicker: doc.source || '',
        pages: doc.text,
        doneLabel: 'Back to the question',
        first: false,
        onDone: showQuestion
      });
    });

    U.askOne(body.querySelector('#qhost'), current, ok => {
      if (ok) {
        if (!current._missed) firstTry++;
      } else {
        current._missed = true;
        queue.push(current);
        U.toast('We will come back to that one. Read the note first.', 3000);
      }
      nextQuestion();
    });
  }

  function nextQuestion() {
    if (!queue.length) return finish(doc, firstTry, total);
    current = queue.shift();
    seen++;
    showQuestion();
  }

  nextQuestion();
}

function finish(doc, firstTry, total) {
  const wasNew = !S.flags[doc.id];
  S.flags[doc.id] = true;
  /* A reward page pays out the moment its questions are done: the flag the
     document already sets IS the thing you now own, so there is nothing else to
     record. Riding starts switched on, because a kid who has just been given a
     bicycle should not have to find a button to use it. */
  if (wasNew && doc.reward && doc.id === 'bicycle') S.riding = true;
  save();
  if (wasNew && doc.reward) sfx.unlock(); else sfx.build();

  const before = step().id;
  advance();
  const nowStep = step();
  const clean = firstTry === total;

  U.updateSheet(`
    <h2>You read it</h2>
    <p class="kicker">${U.esc(doc.title)}</p>
    <div class="passage">
      <p>${clean
        ? 'Every question right the first time. That is what paying attention looks like.'
        : `You got there. <b>${firstTry} of ${total}</b> right the first time, and the rest after you read why.`}</p>
      ${doc.outcome
        ? `<p>${U.esc(doc.outcome)}</p>`
        : (wasNew && !doc.reward ? `<p><b>Written in your journal.</b> ${U.esc(nowStep.log || '')}</p>` : '')}
    </div>
    ${doc.reward ? `<div class="why"><b>${U.esc(doc.reward)}</b></div>` : ''}
    ${before !== nowStep.id
      ? `<h3>What now</h3><div class="passage"><p>${U.esc(nowStep.objective)}</p></div>`
      : ''}
    <div class="row end" style="margin-top:18px">
      <button class="btn" type="button" data-close>Back to the island</button>
    </div>`);

  const hook = afterDoc;
  afterDoc = null;
  if (hook) hook();
}
