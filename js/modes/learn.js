/* Learn mode: a short primer, then how to solve it, then the quiz.

   Two decks per track, shown back to back:
     LESSONS  one idea per page, with the same picture the questions use
     SOLVE    each question type with a foundational route and a fast one

   Navigation is Next/Back only, one page on screen at a time, so there is
   nothing to scroll past and no wall of text. */

import { S, save, today } from '../state.js';
import { LESSONS, SOLVE } from '../content/lessons.js';
import { TRACK_BY_ID, skillKey } from '../content/standards.js';
import * as U from '../ui.js';
import { sfx } from '../audio.js';

/* One flat list: primer pages first, then the solve pages. */
function deckFor(id) {
  const primer = (LESSONS[id] || []).map(p => ({ ...p, kind: 'primer' }));
  const solve = (SOLVE[id] || []).map(p => ({ ...p, kind: 'solve' }));
  return [...primer, ...solve];
}

export const hasDeck = id => deckFor(id).length > 0;
export const deckSize = id => deckFor(id).length;
export const wasLearned = id => !!(S.learned || {})[id];
export const learnedOn = id => (S.learned || {})[id] || '';

export function learnDeck(id, onQuiz, onBack) {
  const track = TRACK_BY_ID[id];
  const pages = deckFor(id);
  if (!pages.length) return onQuiz();
  let i = 0;

  function paint() {
    const pg = pages[i];
    const solveStart = (LESSONS[id] || []).length;
    const label = pg.kind === 'primer'
      ? `What to know &nbsp;·&nbsp; ${i + 1} of ${solveStart}`
      : `How to solve it &nbsp;·&nbsp; ${i - solveStart + 1} of ${pages.length - solveStart}`;

    U.render(`
      <div class="learnhead">
        <span class="tag">${U.esc(track.label)}</span>
        <span class="muted" style="font-size:12px">${label}</span>
      </div>

      <div class="qcard learncard">
        <h2 class="learntitle">${pg.title}</h2>
        ${pg.art ? `<div class="artbox">${pg.art}</div>` : ''}
        ${pg.kind === 'primer'
          ? `<div class="learnbody">${pg.lines.map(l => `<p>${l}</p>`).join('')}</div>`
          : `<div class="pathbox sure">
               <div class="pathlabel">The sure way <span>always works</span></div>
               ${pg.sure.map(l => `<p>${l}</p>`).join('')}
             </div>
             <div class="pathbox fast">
               <div class="pathlabel">The fast way <span>once it clicks</span></div>
               ${pg.fast.map(l => `<p>${l}</p>`).join('')}
             </div>`}
      </div>

      <div class="pagedots">${pages.map((_, k) =>
        `<i class="${k === i ? 'on' : k < i ? 'done' : ''}"></i>`).join('')}</div>

      <div class="row" style="margin-top:12px">
        <button class="btn ghost" id="back" ${i === 0 ? '' : ''}>${i === 0 ? 'Menu' : 'Back'}</button>
        <span class="spacer"></span>
        ${i < pages.length - 1
          ? '<button class="btn go big" id="next">Next</button>'
          : '<button class="btn go big" id="quiz">I am ready &#9654;</button>'}
      </div>
      ${i < pages.length - 1
        ? '<div class="row" style="margin-top:8px"><span class="spacer"></span>'
          + '<button class="chip" id="skip">Skip to the quiz</button></div>'
        : ''}
    `);

    const back = document.getElementById('back');
    back.onclick = () => { sfx.tap(); if (i === 0) return onBack(); i--; paint(); };
    const next = document.getElementById('next');
    if (next) next.onclick = () => { sfx.tap(); i++; paint(); };
    const skip = document.getElementById('skip');
    if (skip) skip.onclick = () => { sfx.tap(); finish(); };
    const quiz = document.getElementById('quiz');
    if (quiz) quiz.onclick = () => { sfx.whoosh(); finish(); };
  }

  function finish() {
    S.learned = S.learned || {};
    S.learned[id] = today();
    save();
    onQuiz();
  }

  paint();
}

/* The screen you land on when you pick a track: learn first, or go straight in. */
export function trackIntro(id, onQuiz, onBack) {
  const t = TRACK_BY_ID[id];
  const lvl = S.levels[skillKey(id)] || 1;
  const seen = wasLearned(id);
  U.render(`
    <div class="panel center">
      <div class="introhero">${U.sp.heroSvg(t.hero, 'idle')}</div>
      <h2 style="margin-bottom:2px">${U.esc(t.label)}</h2>
      <p class="muted" style="margin-top:4px">${U.esc(t.blurb)}</p>
      <p class="muted" style="font-size:12px">Grade ${t.grade} &nbsp;·&nbsp; level ${lvl}
        &nbsp;·&nbsp; ${deckSize(id)} learning pages</p>
      <button class="btn ${seen ? 'ghost' : 'go'} big" id="learn">
        ${seen ? 'Read it again' : 'Teach me first'}</button>
      <button class="btn ${seen ? 'go' : 'ghost'} big" id="quiz" style="margin-top:10px">
        ${seen ? 'Quiz me' : 'Skip, just quiz me'}</button>
      <button class="btn ghost big" id="back" style="margin-top:10px">Back</button>
      ${seen ? `<p class="muted" style="font-size:11px;margin-bottom:0">Primer read on ${U.esc((S.learned || {})[id] || '')}</p>` : ''}
    </div>
  `);
  document.getElementById('learn').onclick = () => { sfx.tap(); learnDeck(id, onQuiz, () => trackIntro(id, onQuiz, onBack)); };
  document.getElementById('quiz').onclick = () => { sfx.whoosh(); onQuiz(); };
  document.getElementById('back').onclick = onBack;
}
