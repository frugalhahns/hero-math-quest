/* Mystery Lab: multi-step word problems with step scaffolding. */

import { S, markComplete } from '../state.js';
import { WORD_SETS } from '../content/wordproblems.js';
import { runSession } from '../session.js';
import * as U from '../ui.js';
import { sfx } from '../audio.js';

const ORDER = ['l1', 'l2', 'tricky', 'kumon'];

export function mysteryMenu(onDone) {
  U.render(`
    <div class="panel">
      <h2>Mystery Lab</h2>
      <p class="muted">Word problems that need more than one step. Read one line at a time. The numbers are highlighted for you.</p>
    </div>
    <div class="worldgrid">
      ${ORDER.map(k => {
        const set = WORD_SETS[k];
        const done = set.items.filter(it => S.completed[it.id]).length;
        return `<button class="world" data-c="mystery" data-set="${k}">
          <span class="lvlpill">${done}/${set.items.length}</span>
          <div class="art">${U.sp.magnifier()}</div>
          <b>${U.esc(set.label.replace('Mystery Lab: ', ''))}</b>
          <span>${U.esc(set.blurb)}</span>
        </button>`;
      }).join('')}
    </div>
    <button class="btn ghost big" id="back" style="margin-top:14px">Back to map</button>
  `);
  document.getElementById('back').onclick = onDone;
  document.querySelectorAll('[data-set]').forEach(b => {
    b.onclick = () => startSet(b.dataset.set, onDone);
  });
}

export function startSet(key, onDone) {
  const set = WORD_SETS[key];
  // fresh problems first, then recycle
  const fresh = set.items.filter(it => !S.completed[it.id]);
  const pool = (fresh.length >= 3 ? fresh : set.items).slice();
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  const picked = pool.slice(0, Math.min(4, pool.length));
  sfx.whoosh();
  runSession({
    title: set.label,
    subtitle: 'read, then step through it',
    heroKey: picked[0].hero,
    questions: picked.map(it => Object.assign({ kind: 'steps' }, it)),
    onDone: () => { picked.forEach(it => markComplete(it.id)); mysteryMenu(onDone); },
    onAgain: () => { picked.forEach(it => markComplete(it.id)); startSet(key, onDone); },
    onQuit: () => mysteryMenu(onDone)
  });
}
