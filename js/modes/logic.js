/* Logic Lab: six kinds of reasoning puzzle. */

import { S, save, grantBadge } from '../state.js';
import { LOGIC, LOGIC_KEYS } from '../content/logic.js';
import { runSession } from '../session.js';
import * as U from '../ui.js';
import { sfx } from '../audio.js';

const ICON = { brain: U.sp.brainIcon, magnifier: U.sp.magnifier, crown: U.sp.crown };

export function logicMenu(onDone) {
  const cleared = LOGIC_KEYS.filter(k => S.completed['logic-' + k]).length;
  U.render(`
    <div class="panel">
      <h2>Logic Lab</h2>
      <p class="muted">No formulas here. Just careful thinking. This is the kind of brain work that helps in every subject.</p>
      <p class="muted">Sections cleared: <b>${cleared} / ${LOGIC_KEYS.length}</b></p>
    </div>
    <div class="worldgrid">
      ${LOGIC_KEYS.map(k => {
        const sec = LOGIC[k];
        const done = S.completed['logic-' + k];
        return `<button class="world" data-c="logic" data-sec="${k}">
          <span class="lvlpill">${done ? 'CLEAR' : sec.items.length + ' q'}</span>
          <div class="art">${(ICON[sec.icon] || U.sp.brainIcon)()}</div>
          <b>${U.esc(sec.label)}</b>
          <span>${U.esc(sec.blurb)}</span>
        </button>`;
      }).join('')}
    </div>
    <button class="btn ghost big" id="back" style="margin-top:14px">Back to map</button>
  `);
  document.getElementById('back').onclick = onDone;
  document.querySelectorAll('[data-sec]').forEach(b => {
    b.onclick = () => startSection(b.dataset.sec, onDone);
  });
}

function toQuestion(it) {
  if (it.kind === 'grid') {
    return { kind: 'gridAssign', prompt: it.prompt, rows: it.rows, cols: it.cols,
             clues: it.clues, solution: it.solution, explain: it.explain };
  }
  return it;
}

export function startSection(key, onDone) {
  const sec = LOGIC[key];
  const pool = sec.items.slice();
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  const picked = pool.slice(0, Math.min(6, pool.length)).map(toQuestion);
  sfx.whoosh();
  runSession({
    title: sec.label,
    subtitle: 'Logic Lab',
    heroKey: 'sparkmouse',
    questions: picked,
    onDone: () => { markSection(key); logicMenu(onDone); },
    onAgain: () => { markSection(key); startSection(key, onDone); },
    onQuit: () => logicMenu(onDone)
  });
}

function markSection(key) {
  S.completed['logic-' + key] = true;
  save();
  if (LOGIC_KEYS.every(k => S.completed['logic-' + k])) grantBadge('thinker');
}
