/* Detective Casebook. A case runs as a chain of screens:
   suspects -> part 1 -> memory checkpoint -> part 2 + clues -> elimination
   grid -> verdict. Memory questions come BEFORE the clue list on purpose. */

import { S, markComplete, grantBadge } from '../state.js';
import { CASES, MASTER_CHALLENGE } from '../content/cases.js';
import { runSession } from '../session.js';
import * as U from '../ui.js';
import { sfx } from '../audio.js';

export function caseMenu(onDone) {
  const solved = CASES.filter(c => S.completed[c.id]).length;
  const allSolved = solved === CASES.length;
  U.render(`
    <div class="panel">
      <div class="row">
        <div style="width:56px;height:56px">${U.sp.magnifier()}</div>
        <div><h2 style="margin:0">Detective Casebook</h2><div class="muted">Cases solved: ${solved} / ${CASES.length}</div></div>
      </div>
      <ul class="clues" style="margin-top:12px">
        <li><b>1. Read every clue.</b> Do not skip small words. Details other people miss are your superpower.</li>
        <li><b>2. Wait for ALL the clues.</b> Guessing early is how mistakes happen.</li>
        <li><b>3. Use the grid.</b> Cross off who CANNOT have done it until one is left.</li>
      </ul>
    </div>
    <div class="worldgrid">
      ${CASES.map((c, i) => `<button class="world" data-c="detective" data-case="${c.id}">
        <span class="lvlpill">${S.completed[c.id] ? 'SOLVED' : 'CASE ' + (i + 1)}</span>
        <div class="art">${U.sp.heroSvg(c.hero, 'idle')}</div>
        <b>${U.esc(c.title)}</b><span>${U.esc(c.difficulty)}</span>
      </button>`).join('')}
      <button class="world" data-c="detective" data-case="master" ${allSolved ? '' : 'disabled style="opacity:.45"'}>
        <span class="lvlpill">${allSolved ? 'OPEN' : 'LOCKED'}</span>
        <div class="art">${U.sp.crown()}</div>
        <b>Master Memory Challenge</b><span>${allSolved ? 'Remember all 3 cases. No peeking.' : 'Solve all 3 cases to unlock.'}</span>
      </button>
    </div>
    <button class="btn ghost big" id="back" style="margin-top:14px">Back to map</button>
  `);
  document.getElementById('back').onclick = onDone;
  document.querySelectorAll('[data-case]').forEach(b => {
    if (b.disabled) return;
    b.onclick = () => {
      if (b.dataset.case === 'master') return startMaster(onDone);
      startCase(b.dataset.case, onDone);
    };
  });
}

function readScreen({ title, sub, hero, paras, cta, extraHtml = '' }, next, back) {
  const html = paras.map(p => `<p>${U.esc(p)}</p>`).join('');
  const plain = paras.join(' ');
  U.render(`
    <div class="panel">
      <div class="row">
        <div style="width:56px;height:56px">${U.sp.heroSvg(hero, 'idle')}</div>
        <div><h2 style="margin:0">${U.esc(title)}</h2><div class="muted">${U.esc(sub)}</div></div>
      </div>
      <div class="storybox" style="max-height:none;margin-top:10px">${html}</div>
      ${extraHtml}
      <div class="row" style="margin-top:10px">
        ${U.canSpeak() ? '<button class="chip" id="say">Read it to me</button><button class="chip" id="stop">Stop</button>' : ''}
      </div>
      <button class="btn go big" id="go" style="margin-top:12px">${U.esc(cta)}</button>
      <button class="btn ghost big" id="back" style="margin-top:10px">Back to cases</button>
    </div>
  `);
  const say = document.getElementById('say');
  if (say) {
    say.onclick = () => U.speak(plain);
    document.getElementById('stop').onclick = () => U.stopSpeak();
  }
  document.getElementById('go').onclick = () => { U.stopSpeak(); sfx.tap(); next(); };
  document.getElementById('back').onclick = () => { U.stopSpeak(); back(); };
}

export function startCase(id, onDone) {
  const c = CASES.find(x => x.id === id);
  if (!c) return caseMenu(onDone);
  const back = () => caseMenu(onDone);

  /* 1. suspect lineup */
  U.render(`
    <div class="panel">
      <span class="tag">${U.esc(c.difficulty)}</span>
      <h2>${U.esc(c.title)}</h2>
      <p class="muted">Meet the suspects first. Read what each one was doing. You will need this later, so pay attention now.</p>
      <ul class="suspects">
        ${c.suspects.map(s => `<li><b>${U.esc(s.name)}</b> - ${U.esc(s.blurb)}</li>`).join('')}
      </ul>
      <button class="btn go big" id="go">Open the case file</button>
      <button class="btn ghost big" id="back" style="margin-top:10px">Back to cases</button>
    </div>
  `);
  document.getElementById('back').onclick = back;
  document.getElementById('go').onclick = part1;

  /* 2. part one */
  function part1() {
    readScreen({
      title: c.title, sub: 'Case file, part 1', hero: c.hero, paras: c.part1,
      cta: 'Detective checkpoint (do not look back)'
    }, checkpoint, back);
  }

  /* 3. memory checkpoint */
  function checkpoint() {
    sfx.whoosh();
    runSession({
      title: 'Detective Checkpoint',
      subtitle: 'answer from memory',
      heroKey: c.hero,
      countsAsChunk: false,
      questions: c.checkpoint.map(q => ({ kind: 'choice', tag: 'FROM MEMORY', prompt: q.q, choices: q.choices, answer: q.answer })),
      onDone: part2, onAgain: part2, onQuit: back
    });
  }

  /* 4. part two plus clue list */
  function part2() {
    const clues = `<h3 style="margin-top:14px">Clue list</h3><ul class="clues">${c.clues.map(x => `<li>${U.esc(x)}</li>`).join('')}</ul>`;
    readScreen({
      title: c.title, sub: 'Case file, part 2', hero: c.hero, paras: c.part2,
      cta: 'Open the clue tracker grid', extraHtml: clues
    }, gridScreen, back);
  }

  /* 5. elimination grid, practice only, nothing to get wrong */
  function gridScreen() {
    const g = c.grid;
    U.render(`
      <div class="panel">
        <h2>Clue Tracker</h2>
        <p class="muted">Mark O for yes and X for no. This is your thinking space, nothing is graded here.</p>
        <div class="gridwrap">
          <table class="lgrid">
            <thead><tr><th></th>${g.cols.map(x => `<th>${U.esc(x)}</th>`).join('')}</tr></thead>
            <tbody>${g.rows.map(r => `<tr><th class="rowh">${U.esc(r)}</th>${g.cols.map(x =>
              `<td><button type="button" data-v="">&nbsp;</button></td>`).join('')}</tr>`).join('')}</tbody>
          </table>
        </div>
        <ul class="clues" style="margin-top:12px">${c.clues.map(x => `<li>${U.esc(x)}</li>`).join('')}</ul>
        <button class="btn go big" id="go">I know who did it</button>
        <button class="btn ghost big" id="back" style="margin-top:10px">Back to cases</button>
      </div>
    `);
    document.querySelectorAll('table.lgrid button').forEach(b => {
      b.onclick = () => {
        const next = b.dataset.v === '' ? 'O' : b.dataset.v === 'O' ? 'X' : '';
        b.dataset.v = next;
        b.innerHTML = next === '' ? '&nbsp;' : next;
        sfx.tap();
      };
    });
    document.getElementById('go').onclick = verdict;
    document.getElementById('back').onclick = back;
  }

  /* 6. verdict plus follow-ups */
  function verdict() {
    sfx.whoosh();
    const qs = [{ kind: 'choice', tag: 'VERDICT', prompt: c.verdict.q, choices: c.verdict.choices, answer: c.verdict.answer, explain: c.verdict.explain }]
      .concat((c.followup || []).map(f => ({ kind: 'choice', tag: 'FOLLOW UP', prompt: f.q, choices: f.choices, answer: f.answer, explain: f.explain })));
    runSession({
      title: 'Name the culprit',
      subtitle: c.title,
      heroKey: c.hero,
      questions: qs,
      onDone: solved, onAgain: solved, onQuit: back
    });
  }

  function solved() {
    markComplete(c.id);
    if (CASES.every(x => S.completed[x.id])) grantBadge('detective');
    U.confetti(70); sfx.badge();
    U.render(`
      <div class="panel center">
        <div style="height:80px">${U.sp.magnifier()}</div>
        <h2>CASE CLOSED</h2>
        <p><b>${U.esc(c.title)}</b></p>
        <div class="fb ok">${U.esc(c.verdict.explain)}</div>
        <p class="muted">Detective move you just used: rule out what CANNOT be true, and the truth is what is left.</p>
        <button class="btn go big" id="more">Back to the casebook</button>
      </div>
    `);
    document.getElementById('more').onclick = back;
  }
}

export function startMaster(onDone) {
  sfx.whoosh();
  runSession({
    title: MASTER_CHALLENGE.title,
    subtitle: MASTER_CHALLENGE.blurb,
    heroKey: 'webhero',
    questions: MASTER_CHALLENGE.items.map(q => ({ kind: 'choice', tag: 'MEMORY', prompt: q.q, choices: q.choices, answer: q.answer })),
    onDone: () => caseMenu(onDone),
    onAgain: () => startMaster(onDone),
    onQuit: () => caseMenu(onDone)
  });
}
