/* Standards Quest: the worlds built straight from the Common Core Grade 3 and
   Grade 4 standards. Each track carries its own adaptive level, and the menu
   shows which standard codes a track answers to so a grown-up can check. */

import { S, save } from '../state.js';
import { TRACKS, TRACK_BY_ID, skillKey, makeStdChunk, ALL_CODES } from '../content/standards.js';
import { runSession } from '../session.js';
import * as U from '../ui.js';
import { sfx } from '../audio.js';

export function standardsMenu(onDone) {
  U.stopSpeak();
  const g = S.stdGrade || 'all';
  const shown = TRACKS.filter(t => g === 'all' || t.grade.includes(g));
  U.render(`
    <div class="panel">
      <h2>Standards Quest</h2>
      <p class="muted">Ten worlds built from the Common Core Grade 3 and Grade 4 math standards.
        Each one keeps its own level, 1 to 5.</p>
      <div class="row">
        ${['all', '3', '4'].map(v => `<button class="chip ${g === v ? 'on' : ''}" data-grade="${v}">${
          v === 'all' ? 'All' : 'Grade ' + v}</button>`).join('')}
      </div>
    </div>
    <div class="worldgrid">
      ${shown.map(t => `<button class="world" data-c="${t.color}" data-track="${t.id}">
        <span class="lvlpill">LV ${S.levels[skillKey(t.id)] || 1}</span>
        <div class="art">${U.sp.heroSvg(t.hero, 'idle')}</div>
        <b>${U.esc(t.label)}</b>
        <span>${U.esc(t.blurb)}</span>
        <span class="codestrip">${t.codes.map(c => U.esc(c)).join(' · ')}</span>
      </button>`).join('')}
    </div>
    <div class="row" style="margin-top:14px">
      <button class="btn ghost" id="back">Back to map</button>
      <span class="spacer"></span>
      <button class="chip" id="cov">Standards covered</button>
    </div>
  `);
  document.getElementById('back').onclick = onDone;
  document.getElementById('cov').onclick = () => coverage(onDone);
  document.querySelectorAll('[data-grade]').forEach(b => {
    b.onclick = () => { S.stdGrade = b.dataset.grade; save(); sfx.tap(); standardsMenu(onDone); };
  });
  document.querySelectorAll('[data-track]').forEach(b => {
    b.onclick = () => startTrack(b.dataset.track, onDone);
  });
}

export function startTrack(id, onDone) {
  const t = TRACK_BY_ID[id];
  const key = skillKey(id);
  const lvl = S.levels[key] || 1;
  const n = S.chunkSize || 8;
  sfx.whoosh();
  runSession({
    title: t.label,
    subtitle: `Grade ${t.grade} | level ${lvl}`,
    heroKey: t.hero,
    skill: key,
    questions: makeStdChunk(id, lvl, n),
    onDone: () => standardsMenu(onDone),
    onAgain: () => startTrack(id, onDone),
    onQuit: () => standardsMenu(onDone)
  });
}

/* What is covered and what is not. Honest about the gap. */
function coverage(onDone) {
  const rows = TRACKS.map(t =>
    `<li><b>${U.esc(t.label)}</b> <span class="muted">(Grade ${t.grade})</span><br>
       <span class="muted">${t.codes.map(c => U.esc(c)).join(', ')}</span></li>`).join('');
  U.render(`
    <div class="panel">
      <h2>Standards covered</h2>
      <p class="muted">${ALL_CODES.length} Grade 3 and Grade 4 standards have questions behind them in
        Standards Quest. The four-operation worlds, Fraction Falls, Mystery Lab and Logic Lab cover
        more on top of this.</p>
      <ul class="clues">${rows}</ul>
      <p class="muted"><b>Deliberately not covered:</b> 4.MD.C.6, measuring and sketching angles with a
        protractor. That one needs a real protractor and paper, not a screen.</p>
    </div>
    <button class="btn ghost big" id="back" style="margin-top:12px">Back</button>
  `);
  document.getElementById('back').onclick = () => standardsMenu(onDone);
}
