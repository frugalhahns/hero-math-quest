/* Generic question runner. Feed it a list of questions of mixed kinds and it
   handles input, feedback, hints, XP, and the end-of-chunk reward screen.

   Question kinds:
     numeric   { expr | prompt, answer, hint?, flavor?, passage? }
     choice    { prompt, choices[], answer(index), explain?, tag?, passage? }
     seq2      { prompt, seq[], answers[2], rule }
     order     { prompt, correct[] }
     gridAssign{ prompt, rows[], cols[], clues[], solution{row:col}, explain }
     steps     { title, lines[], question, steps[{label,answer}], unit, trap?, trapNote? }
*/

import { S, save, addXp, addCoins, recordAnswer, tuneSkill, chunkFinished, grantBadge } from './state.js';
import { sfx } from './audio.js';
import * as U from './ui.js';

const XP_FIRST = 10, XP_RETRY = 5, XP_SHOWN = 2;

export function runSession(cfg) {
  const q = cfg.questions;
  const total = q.length;
  const results = [];
  let i = 0, correctCount = 0, combo = 0, bestCombo = 0;
  let attempts = 0, hintUsed = false, missed = false, keypadCtl = null;

  function finishQuestion(ok) {
    if (keypadCtl) { keypadCtl.destroy(); keypadCtl = null; }
    results[i] = ok;
    if (ok) { correctCount++; combo++; bestCombo = Math.max(bestCombo, combo); }
    else combo = 0;
    if (cfg.skill) recordAnswer(cfg.skill, ok);
    const gained = ok ? (!missed && !hintUsed ? XP_FIRST : XP_RETRY) : XP_SHOWN;
    const bonus = ok && combo >= 3 ? 5 : 0;
    const leveled = addXp(gained + bonus);
    if (ok) addCoins(2 + (combo >= 5 ? 2 : 0));
    U.updateHud();
    if (leveled) { sfx.levelup(); U.confetti(30); }
    i++; attempts = 0; hintUsed = false; missed = false;
    setTimeout(() => (i >= total ? finish() : draw()), 480);
  }

  function finish() {
    U.stopSpeak();
    if (cfg.skill) tuneSkill(cfg.skill, correctCount, total);
    const badge = cfg.countsAsChunk === false ? null : chunkFinished();
    if (cfg.badgeOnFinish && correctCount >= Math.ceil(total * 0.6)) grantBadge(cfg.badgeOnFinish);
    save();
    rewardScreen({ correctCount, total, bestCombo, badge, cfg });
  }

  /* ------- per-kind renderers ------- */

  function draw() {
    const item = q[i];
    const head = U.qhead(item.hero || cfg.heroKey, 'idle', cfg.title,
      `${i + 1} of ${total}${cfg.subtitle ? ' | ' + cfg.subtitle : ''}`, total, results, i);
    if (item.kind === 'numeric') return drawNumeric(item, head);
    if (item.kind === 'choice') return drawChoice(item, head);
    if (item.kind === 'seq2') return drawSeq2(item, head);
    if (item.kind === 'order') return drawOrder(item, head);
    if (item.kind === 'gridAssign') return drawGrid(item, head);
    if (item.kind === 'steps') return drawSteps(item, head);
    return drawChoice(item, head);
  }

  function footer(extra = '') {
    return `<div class="row" style="margin-top:12px">
      ${extra}
      <span class="spacer"></span>
      <button class="chip" id="quit">Stop for now</button>
    </div>`;
  }

  function wireQuit(root) {
    const b = root.querySelector('#quit');
    if (b) b.onclick = () => {
      if (keypadCtl) keypadCtl.destroy();
      U.stopSpeak();
      if (cfg.onQuit) cfg.onQuit({ correctCount, total });
    };
  }

  function fbBox(root) {
    let el = root.querySelector('#fb');
    if (!el) {
      el = U.h('<div id="fb"></div>');
      root.querySelector('.qcard').appendChild(el);
    }
    return el;
  }

  function drawNumeric(item, head) {
    const root = U.render(`
      ${head}
      <div class="qcard">
        ${item.flavor ? `<div class="muted" style="font-size:15px;margin-bottom:6px">${U.esc(item.flavor)}</div>` : ''}
        ${item.prompt ? `<div class="qtext">${U.markNumbers(item.prompt)}</div>` : ''}
        ${item.expr ? `<div class="bigexpr">${U.esc(item.expr)} = ?</div>` : ''}
      </div>
      <div class="answerline"><div id="answerbox">?</div></div>
      ${U.keypad()}
      ${footer('<button class="chip" id="hint">Hint</button>')}
    `);
    wireQuit(root);
    root.querySelector('#hint').onclick = () => {
      hintUsed = true;
      fbBox(root).innerHTML = `<div class="fb ok">${U.esc(item.hint || 'Read it once more, slowly. Underline the numbers.')}</div>`;
    };
    keypadCtl = U.wireKeypad(root, val => {
      attempts++;
      const box = root.querySelector('#answerbox');
      if (Number(val) === Number(item.answer)) {
        box.classList.add('ok'); sfx.correct(); U.floater('+' + (!missed && !hintUsed ? XP_FIRST : XP_RETRY) + ' XP');
        U.confetti(14);
        fbBox(root).innerHTML = `<div class="fb ok">${U.praise()}</div>`;
        finishQuestion(true);
      } else if (attempts < 2) {
        missed = true;
        box.classList.add('no'); sfx.wrong(); U.shake(box);
        fbBox(root).innerHTML = `<div class="fb no">${U.encourage()}<br><small>${U.esc(item.hint || '')}</small></div>`;
        setTimeout(() => { box.classList.remove('no'); keypadCtl.clear(); }, 550);
      } else {
        box.classList.add('no'); sfx.wrong();
        fbBox(root).innerHTML = `<div class="fb no">The answer was <b>${item.answer}</b>.${item.hint ? '<br>' + U.esc(item.hint) : ''}<br>You will see this one again soon.</div>`;
        finishQuestion(false);
      }
    });
  }

  function drawChoice(item, head) {
    const root = U.render(`
      ${head}
      <div class="qcard">
        ${item.tag ? `<span class="tag">${U.esc(item.tag)}</span>` : ''}
        ${item.passage ? `<div class="storybox">${item.passage}</div><hr class="rule">` : ''}
        <div class="qtext">${U.markNumbers(item.prompt)}</div>
      </div>
      ${U.choiceList(item.choices)}
      ${footer(U.canSpeak() ? '<button class="chip" id="say">Read it to me</button>' : '')}
    `);
    wireQuit(root);
    const say = root.querySelector('#say');
    if (say) say.onclick = () => U.speak((item.passageText ? item.passageText + '. ' : '') + item.prompt + '. ' + item.choices.join('. '));
    root.querySelectorAll('.choice').forEach(btn => {
      btn.onclick = () => {
        attempts++;
        const idx = Number(btn.dataset.i);
        if (idx === item.answer) {
          btn.classList.add('ok'); sfx.correct(); U.floater('+XP', btn); U.confetti(12);
          fbBox(root).innerHTML = `<div class="fb ok"><b>${U.praise()}</b>${item.explain ? '<br>' + U.esc(item.explain) : ''}</div>`;
          root.querySelectorAll('.choice').forEach(b => b.disabled = true);
          finishQuestion(true);
        } else if (attempts < 2) {
          missed = true;
          btn.classList.add('no'); btn.disabled = true; sfx.wrong(); U.shake(btn);
          fbBox(root).innerHTML = `<div class="fb no">${U.encourage()}</div>`;
        } else {
          btn.classList.add('no'); sfx.wrong();
          const right = root.querySelector(`.choice[data-i="${item.answer}"]`);
          if (right) right.classList.add('ok');
          fbBox(root).innerHTML = `<div class="fb no">The answer was <b>${U.esc(item.choices[item.answer])}</b>.${item.explain ? '<br>' + U.esc(item.explain) : ''}</div>`;
          root.querySelectorAll('.choice').forEach(b => b.disabled = true);
          finishQuestion(false);
        }
      };
    });
  }

  function drawSeq2(item, head) {
    const root = U.render(`
      ${head}
      <div class="qcard">
        <div class="qtext">${U.esc(item.prompt)}</div>
        <div class="bigexpr" style="font-size:clamp(26px,8vw,42px)">${item.seq.join(', ')}, <span id="slot1">?</span>, <span id="slot2">?</span></div>
        <div class="muted center">Type the next number, then the one after that.</div>
      </div>
      <div class="answerline"><div id="answerbox">?</div></div>
      ${U.keypad()}
      ${footer('<button class="chip" id="hint">Hint</button>')}
    `);
    wireQuit(root);
    let stage = 0;
    root.querySelector('#hint').onclick = () => {
      hintUsed = true;
      fbBox(root).innerHTML = `<div class="fb ok">Look at the jump between each number. The rule is <b>${U.esc(item.rule)}</b>.</div>`;
    };
    keypadCtl = U.wireKeypad(root, val => {
      attempts++;
      const box = root.querySelector('#answerbox');
      if (Number(val) === item.answers[stage]) {
        root.querySelector('#slot' + (stage + 1)).textContent = item.answers[stage];
        sfx.coin(); stage++; attempts = 0;
        keypadCtl.clear();
        if (stage === 2) {
          sfx.correct(); U.confetti(16);
          fbBox(root).innerHTML = `<div class="fb ok"><b>${U.praise()}</b> The rule was ${U.esc(item.rule)}.</div>`;
          finishQuestion(true);
        } else {
          fbBox(root).innerHTML = `<div class="fb ok">Yes! Now the next one.</div>`;
        }
      } else if (attempts < 3) {
        missed = true;
        box.classList.add('no'); sfx.wrong(); U.shake(box);
        fbBox(root).innerHTML = `<div class="fb no">${U.encourage()}</div>`;
        setTimeout(() => { box.classList.remove('no'); keypadCtl.clear(); }, 500);
      } else {
        sfx.wrong();
        root.querySelector('#slot1').textContent = item.answers[0];
        root.querySelector('#slot2').textContent = item.answers[1];
        fbBox(root).innerHTML = `<div class="fb no">The rule was <b>${U.esc(item.rule)}</b>, so it goes ${item.answers[0]}, then ${item.answers[1]}.</div>`;
        finishQuestion(false);
      }
    });
  }

  function drawOrder(item, head) {
    const shuffled = item.correct.slice();
    for (let k = shuffled.length - 1; k > 0; k--) {
      const j = Math.floor(Math.random() * (k + 1));
      [shuffled[k], shuffled[j]] = [shuffled[j], shuffled[k]];
    }
    let chosen = [];
    const root = U.render(`
      ${head}
      <div class="qcard">
        <div class="qtext">${U.esc(item.prompt)}</div>
        <div class="muted" style="margin-top:6px">Tap them 1, 2, 3, 4 in the order they happen.</div>
      </div>
      <div class="choices" id="opts">${shuffled.map((c, k) =>
        `<button type="button" class="choice" data-t="${U.esc(c)}"><span class="lt" data-slot>&nbsp;</span>${U.esc(c)}</button>`).join('')}</div>
      ${footer('<button class="chip" id="reset">Start over</button>')}
    `);
    wireQuit(root);
    root.querySelector('#reset').onclick = () => {
      chosen = [];
      root.querySelectorAll('.choice').forEach(b => { b.disabled = false; b.classList.remove('ok', 'no'); b.querySelector('[data-slot]').innerHTML = '&nbsp;'; });
    };
    root.querySelectorAll('#opts .choice').forEach(btn => {
      btn.onclick = () => {
        if (btn.disabled) return;
        chosen.push(btn.dataset.t);
        btn.disabled = true;
        btn.querySelector('[data-slot]').textContent = chosen.length;
        sfx.tap();
        if (chosen.length === item.correct.length) {
          attempts++;
          const ok = chosen.every((c, k) => c === item.correct[k]);
          if (ok) {
            sfx.correct(); U.confetti(16);
            root.querySelectorAll('.choice').forEach(b => b.classList.add('ok'));
            fbBox(root).innerHTML = `<div class="fb ok"><b>${U.praise()}</b> Perfect order.</div>`;
            finishQuestion(true);
          } else if (attempts < 2) {
            sfx.wrong();
            fbBox(root).innerHTML = `<div class="fb no">Not quite. Think about what has to happen FIRST before anything else is possible. Tap Start over.</div>`;
            root.querySelectorAll('.choice').forEach(b => { b.disabled = false; b.classList.remove('ok'); b.querySelector('[data-slot]').innerHTML = '&nbsp;'; });
            chosen = [];
          } else {
            sfx.wrong();
            fbBox(root).innerHTML = `<div class="fb no">The real order is:<br>${item.correct.map((c, k) => `${k + 1}. ${U.esc(c)}`).join('<br>')}</div>`;
            finishQuestion(false);
          }
        }
      };
    });
  }

  function drawGrid(item, head) {
    const marks = {};
    item.rows.forEach(r => { marks[r] = {}; });
    const root = U.render(`
      ${head}
      <div class="qcard">
        <div class="qtext">${U.esc(item.prompt)}</div>
        <ul class="clues">${item.clues.map(c => `<li>${U.markNumbers(c)}</li>`).join('')}</ul>
        <div class="muted">Tap a box to cycle: blank, O for yes, X for no. Put exactly one O in each row.</div>
        <div class="gridwrap">
          <table class="lgrid"><thead><tr><th></th>${item.cols.map(c => `<th>${U.esc(c)}</th>`).join('')}</tr></thead>
          <tbody>${item.rows.map(r => `<tr><th class="rowh">${U.esc(r)}</th>${item.cols.map(c =>
            `<td><button type="button" data-r="${U.esc(r)}" data-c="${U.esc(c)}" data-v="">&nbsp;</button></td>`).join('')}</tr>`).join('')}</tbody></table>
        </div>
      </div>
      <button class="btn go big" id="check">Check my grid</button>
      ${footer()}
    `);
    wireQuit(root);
    root.querySelectorAll('table.lgrid button').forEach(b => {
      b.onclick = () => {
        const cur = b.dataset.v;
        const next = cur === '' ? 'O' : cur === 'O' ? 'X' : '';
        b.dataset.v = next;
        b.innerHTML = next === '' ? '&nbsp;' : next;
        marks[b.dataset.r][b.dataset.c] = next;
        sfx.tap();
      };
    });
    root.querySelector('#check').onclick = () => {
      attempts++;
      const ok = item.rows.every(r => {
        const os = item.cols.filter(c => marks[r][c] === 'O');
        return os.length === 1 && os[0] === item.solution[r];
      });
      if (ok) {
        sfx.correct(); U.confetti(24);
        fbBox(root).innerHTML = `<div class="fb ok"><b>Case cracked!</b><br>${U.esc(item.explain || '')}</div>`;
        finishQuestion(true);
      } else if (attempts < 3) {
        sfx.wrong();
        fbBox(root).innerHTML = `<div class="fb no">Not solved yet. Start with the clue that tells you something for SURE, mark that O, then X out the rest of that row and column.</div>`;
      } else {
        sfx.wrong();
        fbBox(root).innerHTML = `<div class="fb no">Solution:<br>${item.rows.map(r => `${U.esc(r)} = <b>${U.esc(item.solution[r])}</b>`).join('<br>')}<br>${U.esc(item.explain || '')}</div>`;
        finishQuestion(false);
      }
    };
  }

  function drawSteps(item, head) {
    let stage = 0;
    const vals = item.steps.map(() => null);
    const speakText = item.lines.join(' ') + ' ' + item.question;

    function paint() {
      const root = U.render(`
        ${head}
        <div class="qcard">
          ${item.trap ? `<span class="tag trap">TRAP: ${U.esc(item.trap)}</span>` : ''}
          <b style="font-size:17px">${U.esc(item.title)}</b>
          <div class="qtext" style="margin-top:8px">${item.lines.map(l => `<div style="margin:.28em 0">${U.markNumbers(l)}</div>`).join('')}</div>
          <div class="qtext" style="margin-top:10px;color:var(--accent-ink)"><b>${U.markNumbers(item.question)}</b></div>
          <div class="steps">
            ${item.steps.map((s, k) => `<div class="step ${k < stage ? 'done' : k === stage ? 'active' : ''}">
              <div class="n">${k + 1}</div><div class="lbl">${U.esc(s.label)}</div>
              <div class="val">${vals[k] === null ? '?' : vals[k]}</div></div>`).join('')}
          </div>
        </div>
        <div class="answerline"><div id="answerbox">?</div></div>
        ${U.keypad(stage === item.steps.length - 1 ? { enterLabel: 'ANSWER' } : {})}
        ${footer(`<button class="chip" id="hint">Hint</button>${U.canSpeak() ? '<button class="chip" id="say">Read it to me</button>' : ''}`)}
      `);
      wireQuit(root);
      const say = root.querySelector('#say');
      if (say) say.onclick = () => U.speak(speakText);
      root.querySelector('#hint').onclick = () => {
        hintUsed = true;
        const s = item.steps[stage];
        fbBox(root).innerHTML = `<div class="fb ok">Step ${stage + 1}: ${U.esc(s.label)}.${item.trapNote ? '<br>' + U.esc(item.trapNote) : ''}</div>`;
      };
      if (keypadCtl) keypadCtl.destroy();
      keypadCtl = U.wireKeypad(root, val => {
        attempts++;
        const box = root.querySelector('#answerbox');
        const want = item.steps[stage].answer;
        if (Number(val) === Number(want)) {
          vals[stage] = Number(val);
          sfx.coin(); U.floater('+', box);
          stage++; attempts = 0;
          if (stage >= item.steps.length) {
            sfx.correct(); U.confetti(20);
            const finalV = vals[vals.length - 1];
            U.render(`
              ${head}
              <div class="qcard center">
                <b style="font-size:17px">${U.esc(item.title)}</b>
                <div class="steps" style="margin-top:10px">
                  ${item.steps.map((s, k) => `<div class="step done"><div class="n">${k + 1}</div><div class="lbl">${U.esc(s.label)}</div><div class="val">${vals[k]}</div></div>`).join('')}
                </div>
                <div class="bigstat" style="margin-top:12px">${finalV}</div>
                <div class="muted">${U.esc(item.unit || '')}</div>
                <div class="fb ok" style="margin-top:12px"><b>${U.praise()}</b> You broke a big problem into small ones. That is the whole trick.</div>
              </div>`);
            finishQuestion(true);
          } else {
            paint();
            fbBox(document.getElementById('app')).innerHTML = `<div class="fb ok">Step done. Now step ${stage + 1}.</div>`;
          }
        } else if (attempts < 3) {
          missed = true;
          box.classList.add('no'); sfx.wrong(); U.shake(box);
          fbBox(root).innerHTML = `<div class="fb no">${U.encourage()}<br><small>Right now you only need: ${U.esc(item.steps[stage].label)}</small></div>`;
          setTimeout(() => { box.classList.remove('no'); keypadCtl.clear(); }, 550);
        } else {
          sfx.wrong();
          vals[stage] = want;
          fbBox(root).innerHTML = `<div class="fb no">Step ${stage + 1} was <b>${want}</b>. ${U.esc(item.steps[stage].label)}.</div>`;
          stage++; attempts = 0;
          if (stage >= item.steps.length) finishQuestion(false);
          else setTimeout(paint, 1500);
        }
      });
    }
    paint();
  }

  /* ------- reward screen ------- */

  function rewardScreen({ correctCount, total, bestCombo, badge, cfg }) {
    const pct = Math.round((correctCount / total) * 100);
    const chained = cfg.countsAsChunk === false;
    const stars = pct >= 90 ? 3 : pct >= 70 ? 2 : pct >= 40 ? 1 : 0;
    sfx.chunk();
    if (pct >= 70) U.confetti(70);
    if (badge) sfx.badge();
    U.render(`
      <div class="panel center">
        <div class="rewardart">${'⭐'.repeat(Math.max(stars, 1))}${stars === 0 ? '' : ''}</div>
        <h2>${pct >= 90 ? 'PERFECT RUN!' : pct >= 70 ? 'Chunk cleared!' : 'Chunk finished!'}</h2>
        <div class="bigstat">${correctCount} / ${total}</div>
        <p class="muted">Best streak in a row: <b>${bestCombo}</b>${bestCombo >= 3 ? ' (combo bonus earned)' : ''}</p>
        ${badge ? `<div class="fb ok"><b>NEW BADGE:</b> ${badge.toUpperCase()}</div>` : ''}
        ${cfg.skill ? `<p class="muted">${U.esc(skillNote(cfg.skill))}</p>` : ''}
        <div class="row" style="margin-top:10px">
          <button class="btn go" id="again">${chained ? 'Keep going' : 'One more round'}</button>
          ${chained ? '' : '<button class="btn warn" id="brk">Play break</button>'}
          <button class="btn ghost" id="map">${chained ? 'Back' : 'Back to map'}</button>
        </div>
      </div>
    `);
    document.getElementById('again').onclick = () => cfg.onAgain ? cfg.onAgain() : cfg.onDone();
    const brk = document.getElementById('brk');
    if (brk) brk.onclick = () => U.brainBreak(120, () => cfg.onAgain ? cfg.onAgain() : cfg.onDone());
    document.getElementById('map').onclick = () => cfg.onDone();
  }

  function skillNote(skill) {
    const lv = S.levels[skill] || 1;
    const names = { add: 'Addition', sub: 'Subtraction', mul: 'Multiplication', div: 'Division' };
    return `Your ${names[skill] || skill} level is now ${lv} of 5.`;
  }

  draw();
}
