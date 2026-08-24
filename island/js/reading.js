/* Documents and signs.
   A document is the unit of progress in this game: you read it, you answer its
   questions, and answering them is what logs the step. The reading happens a
   few sentences at a time -- Next to go on, Back to re-read the page you just
   left -- because a screen full of text is the fastest way to lose a reader
   this age. Wrong answers are not punished and never block: the question goes
   to the back of the queue and comes round again after you have read why. You
   cannot get stuck, and you cannot skip past something you did not follow. */

import { S, save } from './state.js';
import { DOCS, SIGNS } from './content/quests.js';
import * as U from './ui.js';
import { sfx } from './audio.js';
import { advance, step } from './quest.js';

let afterDoc = null;

export function openSign(signId, label) {
  const lines = SIGNS[signId];
  if (!lines) return;
  S.signs[signId] = true;
  save();
  U.readPages({
    title: 'You look closer',
    kicker: label || 'Somewhere on Verdant Isle',
    pages: lines,
    doneLabel: 'Done',
    onDone: () => U.closeSheet(true)
  });
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

function runQuestions(doc) {
  const queue = doc.questions.slice();
  const total = doc.questions.length;
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
  save();
  sfx.build();

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
      ${wasNew ? `<p><b>Written in your journal.</b> ${U.esc(nowStep.log || '')}</p>` : ''}
    </div>
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
