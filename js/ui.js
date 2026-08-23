/* Shared UI helpers: rendering, effects, modal, praise, brain breaks. */

import { S, save, level, xpInLevel } from './state.js';
import { sfx } from './audio.js';
import * as sp from './sprites.js';

export const app = () => document.getElementById('app');
export const fxLayer = () => document.getElementById('fx-layer');

export function h(html) {
  const t = document.createElement('template');
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}

export function render(html) {
  const a = app();
  a.innerHTML = html;
  a.scrollTop = 0;
  window.scrollTo(0, 0);
  return a;
}

export function esc(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

/* highlight numbers inside word problems so they pop for a distractible reader */
export function markNumbers(text) {
  return esc(text).replace(/\b\d+\b/g, m => `<span class="num">${m}</span>`);
}

export function updateHud() {
  document.getElementById('hud-level').textContent = level();
  document.getElementById('hud-coins').textContent = S.coins;
  document.getElementById('hud-streak').textContent = S.streak;
  const pct = xpInLevel();
  document.getElementById('xpbar').style.width = pct + '%';
  document.getElementById('xptext').textContent = `${pct} / 100 XP  (Level ${level()})`;
  document.getElementById('btn-sound').textContent = S.soundOn ? '\u266A On' : '\u266A Off';
  document.body.classList.toggle('no-motion', !!S.reduceMotion);
  document.body.classList.toggle('focus-mode', !!S.focusMode);
}

/* ---------------- effects ---------------- */

export function confetti(n = 40) {
  if (S.reduceMotion) return;
  const colors = ['#ffd400', '#2a7bff', '#e63946', '#5ac35a', '#a259ff', '#19d3c5'];
  const layer = fxLayer();
  for (let i = 0; i < n; i++) {
    const c = document.createElement('div');
    c.className = 'confetti';
    c.style.left = Math.random() * 100 + 'vw';
    c.style.background = colors[i % colors.length];
    c.style.animationDuration = (0.9 + Math.random() * 1.1) + 's';
    c.style.animationDelay = (Math.random() * 0.35) + 's';
    layer.appendChild(c);
    setTimeout(() => c.remove(), 2600);
  }
}

export function floater(text, el) {
  if (S.reduceMotion) return;
  const r = (el || document.getElementById('answerbox') || app()).getBoundingClientRect();
  const f = document.createElement('div');
  f.className = 'floater';
  f.textContent = text;
  f.style.left = (r.left + r.width / 2 - 24) + 'px';
  f.style.top = (r.top - 6) + 'px';
  fxLayer().appendChild(f);
  setTimeout(() => f.remove(), 1100);
}

export function shake(el) {
  if (!el || S.reduceMotion) return;
  el.classList.remove('shake');
  void el.offsetWidth;
  el.classList.add('shake');
}

export function pop(el) {
  if (!el || S.reduceMotion) return;
  el.classList.remove('pop');
  void el.offsetWidth;
  el.classList.add('pop');
}

/* ---------------- modal ---------------- */

export function modal(html, onMount) {
  const m = document.getElementById('modal');
  const card = document.getElementById('modal-card');
  card.innerHTML = html;
  m.classList.remove('hidden');
  if (onMount) onMount(card);
  return card;
}
export function closeModal() {
  document.getElementById('modal').classList.add('hidden');
  document.getElementById('modal-card').innerHTML = '';
}

/* ---------------- praise + nudges ---------------- */

const PRAISE = [
  'Boom! Nailed it.', 'Ring collected!', 'That is speed.', 'Locked in.',
  'Critical hit!', 'Web-shot landed.', 'Diamond found!', 'Super effective!',
  'Detective brain online.', 'Clean solve.', 'You made that look easy.',
  'Combo building!', 'Sharp eyes.', 'Big brain move.'
];
const ENCOURAGE = [
  'Close! Look again.', 'Not yet. One more try.', 'Almost. Slow it down a notch.',
  'Nope, but good thinking.', 'Good thinking, wrong turn.',
  'Mistakes are how the level goes up.', 'Reset. Read it one more time.'
];
export const praise = () => PRAISE[Math.floor(Math.random() * PRAISE.length)];
export const encourage = () => ENCOURAGE[Math.floor(Math.random() * ENCOURAGE.length)];

/* ---------------- reusable blocks ---------------- */

export function pips(total, results, current) {
  let out = '<div class="pips">';
  for (let i = 0; i < total; i++) {
    const r = results[i];
    const cls = r === true ? 'ok' : r === false ? 'no' : (i === current ? 'now' : '');
    out += `<span class="pip ${cls}"></span>`;
  }
  return out + '</div>';
}

export function qhead(heroKey, mood, title, sub, total, results, current) {
  return `<div class="qhead">
    <div class="sprite">${sp.heroSvg(heroKey, mood)}</div>
    <div><b>${esc(title)}</b><div class="qmeta">${esc(sub || '')}</div></div>
    ${pips(total, results, current)}
  </div>`;
}

export function keypad(opts = {}) {
  const enterLabel = opts.enterLabel || 'GO';
  return `<div class="keypad">
    ${[1,2,3,4,5,6,7,8,9].map(n => `<button type="button" data-k="${n}">${n}</button>`).join('')}
    <button type="button" class="del" data-k="del">&#9003;</button>
    <button type="button" data-k="0">0</button>
    <button type="button" class="act" data-k="ok">${enterLabel}</button>
  </div>`;
}

/* Wire a keypad + answer box. onSubmit(valueString) */
export function wireKeypad(root, onSubmit) {
  const box = root.querySelector('#answerbox');
  let val = '';
  const paint = () => { box.textContent = val === '' ? '?' : val; };
  paint();
  root.querySelectorAll('.keypad button').forEach(b => {
    b.addEventListener('click', () => {
      const k = b.dataset.k;
      if (k === 'del') { val = val.slice(0, -1); sfx.tap(); }
      else if (k === 'ok') { if (val !== '') onSubmit(val); else { shake(box); sfx.wrong(); } return; }
      else if (val.length < 6) { val += k; sfx.tap(); }
      paint(); pop(box);
    });
  });
  const keyHandler = e => {
    if (e.key >= '0' && e.key <= '9') { if (val.length < 6) { val += e.key; paint(); sfx.tap(); } }
    else if (e.key === 'Backspace') { val = val.slice(0, -1); paint(); }
    else if (e.key === 'Enter') { if (val !== '') onSubmit(val); }
  };
  document.addEventListener('keydown', keyHandler);
  return {
    clear() { val = ''; paint(); },
    destroy() { document.removeEventListener('keydown', keyHandler); }
  };
}

export function choiceList(choices) {
  const letters = 'ABCD EFGH'.replace(' ', '');
  return `<div class="choices">${choices.map((c, i) =>
    `<button type="button" class="choice" data-i="${i}"><span class="lt">${letters[i]}</span>${esc(c)}</button>`
  ).join('')}</div>`;
}

/* ---------------- brain break ---------------- */

const MOVES = [
  'Spin dash! 10 fast jumping jacks.',
  'Web-swing: reach up high 10 times, alternating arms.',
  'Creeper crouch: 10 squats, hiss on the way up.',
  'Sprint in place for 20 seconds. GO.',
  'Balance on one foot for 15 seconds. Then the other.',
  'Ten big arm circles forward, ten backward.',
  'Get a drink of water and stretch your arms over your head.',
  'Bear crawl across the room and back.',
  'Freeze dance: 20 seconds of your best moves, then FREEZE.',
  'Wall push-ups, 10 of them, hero style.',
  'Deep breaths: in for 4, hold for 4, out for 4. Three times.',
  'Touch 5 blue things in the room as fast as you can.'
];

export function brainBreak(seconds, onDone) {
  const move = MOVES[Math.floor(Math.random() * MOVES.length)];
  render(`
    <div class="panel brainbreak center">
      <h2>PLAY BREAK</h2>
      <div class="movecard">${esc(move)}</div>
      <div class="breaktimer" id="bt">${seconds}</div>
      <p class="muted">Your brain saves what it learned while you move. This is part of the training.</p>
      <button class="btn go big" id="skip">I am back, keep going</button>
    </div>
  `);
  let left = seconds;
  const t = setInterval(() => {
    left--;
    const el = document.getElementById('bt');
    if (!el) { clearInterval(t); return; }
    el.textContent = left;
    if (left <= 3 && left > 0) sfx.tick();
    if (left <= 0) { clearInterval(t); sfx.chunk(); onDone(); }
  }, 1000);
  document.getElementById('skip').onclick = () => { clearInterval(t); onDone(); };
}

export { sp };

/* ---------------- read-aloud ---------------- */

export function speak(text) {
  try {
    if (!('speechSynthesis' in window)) return false;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(String(text));
    u.rate = 0.95; u.pitch = 1.05;
    window.speechSynthesis.speak(u);
    return true;
  } catch (e) { return false; }
}
export function stopSpeak() {
  try { window.speechSynthesis && window.speechSynthesis.cancel(); } catch (e) {}
}
export const canSpeak = () => 'speechSynthesis' in window;
