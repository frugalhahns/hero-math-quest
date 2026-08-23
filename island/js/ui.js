/* Shared UI: the sheet that holds all reading, the passage formatter, the
   glossary tooltip, the single-question runner, read-aloud and toasts.
   Everything textual is DOM rather than canvas so it can be selected, zoomed,
   read by a screen reader and spoken by the browser. */

import { S, save, tally } from './state.js';
import { sfx } from './audio.js';
import { define } from './content/glossary.js';
import { paintInto } from './pixels.js';

export const $ = sel => document.querySelector(sel);

export function esc(s) {
  return String(s).replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

/* {word} becomes a tappable definition inside a passage, and plain emphasis
   inside a question -- a question about a word must not hand over its meaning. */
export function fmt(text, gloss = true) {
  const safe = esc(text);
  return safe.replace(/\{([a-zA-Z][a-zA-Z-]*)\}/g, (m, w) =>
    gloss
      ? `<button type="button" class="gloss-word" data-w="${w.toLowerCase()}">${w}</button>`
      : `<em>${w}</em>`);
}

export function stripBraces(text) {
  return String(text).replace(/[{}]/g, '');
}

/* ---------------- the sheet ---------------- */

let onCloseHook = null;
let closeLocked = false;

export function openSheet(html, opts = {}) {
  const sheet = $('#sheet'), body = $('#sheet-body');
  body.innerHTML = html;
  sheet.classList.remove('hidden');
  $('#sheet-card').scrollTop = 0;
  closeLocked = !!opts.locked;
  $('#sheet-close').classList.toggle('hidden', closeLocked);
  onCloseHook = opts.onClose || null;
  sfx.open();
  const focus = body.querySelector('.btn, .choice, .reread');
  if (focus) focus.focus({ preventScroll: true });
  return body;
}

export function updateSheet(html) {
  const body = $('#sheet-body');
  body.innerHTML = html;
  const focus = body.querySelector('.btn, .choice');
  if (focus) focus.focus({ preventScroll: true });
  return body;
}

export function sheetOpen() { return !$('#sheet').classList.contains('hidden'); }

export function setLocked(v) {
  closeLocked = !!v;
  $('#sheet-close').classList.toggle('hidden', closeLocked);
}

export function closeSheet(force = false) {
  if (closeLocked && !force) return false;
  stopSpeak();
  hideGloss();
  $('#sheet').classList.add('hidden');
  $('#sheet-body').innerHTML = '';
  const hook = onCloseHook;
  onCloseHook = null;
  closeLocked = false;
  if (hook) hook();
  return true;
}

/* ---------------- passages ---------------- */

export function passageHTML(paras, opts = {}) {
  const cls = 'passage' + (S.bigText || opts.big ? ' big' : '');
  return `<div class="${cls}">${paras.map(p => `<p>${fmt(p)}</p>`).join('')}</div>`;
}

export function docHeaderHTML(doc) {
  return `<h2>${esc(doc.title)}</h2>
    <p class="kicker">${esc(doc.source || '')}</p>`;
}

export function readAloudButton(id) {
  return `<button class="btn ghost small" type="button" data-speak="${id}">Read it to me</button>`;
}

/* ---------------- glossary tooltip ---------------- */

export function wireGlossary(root = document) {
  root.addEventListener('click', ev => {
    const b = ev.target.closest('.gloss-word');
    if (!b) { hideGloss(); return; }
    ev.preventDefault();
    const d = define(b.dataset.w);
    if (!d) return;
    S.looked++; save();
    const tip = $('#gloss');
    tip.innerHTML = `<b>${esc(b.textContent)}</b> &mdash; ${esc(d)}`;
    tip.classList.remove('hidden');
    const r = b.getBoundingClientRect();
    const w = Math.min(260, window.innerWidth - 24);
    tip.style.left = Math.max(12, Math.min(window.innerWidth - w - 12, r.left + window.scrollX)) + 'px';
    tip.style.top = (r.bottom + window.scrollY + 6) + 'px';
  });
}

export function hideGloss() { $('#gloss').classList.add('hidden'); }

/* ---------------- read aloud ---------------- */

let voiceOn = false;

export function speak(text) {
  if (!('speechSynthesis' in window)) { toast('This browser cannot read aloud.'); return; }
  stopSpeak();
  const u = new SpeechSynthesisUtterance(stripBraces(text));
  u.rate = 0.92;
  u.pitch = 1;
  voiceOn = true;
  u.onend = () => { voiceOn = false; };
  window.speechSynthesis.speak(u);
}

export function stopSpeak() {
  if ('speechSynthesis' in window && voiceOn) window.speechSynthesis.cancel();
  voiceOn = false;
}

export function wireSpeak(root, textFor) {
  root.addEventListener('click', ev => {
    const b = ev.target.closest('[data-speak]');
    if (!b) return;
    const t = textFor(b.dataset.speak);
    if (t) speak(t);
  });
}

/* ---------------- one question at a time ---------------- */

const LETTERS = ['A', 'B', 'C', 'D', 'E'];

/* Choices are shuffled every time a question is rendered. The content files
   were written without watching where the right answer landed, so left as-is a
   reader could learn to just pick B. Shuffling also means a question re-asked
   after a wrong answer cannot be solved from memory of the layout. */
function shuffledOrder(n) {
  const a = [...Array(n).keys()];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* Renders one question into `host`. Calls back with true/false once the reader
   has read the explanation and pressed on. Nothing here ever dead-ends: a wrong
   answer always shows why, and the caller decides what to do about it. */
export function askOne(host, q, done, opts = {}) {
  const label = opts.label || q.tag || 'Question';
  host.innerHTML = `
    <div class="qwrap">
      <span class="qtag">${esc(label)}</span>
      ${opts.progress ? `<span class="muted small" style="float:right">${esc(opts.progress)}</span>` : ''}
      <p class="qtext">${fmt(q.q, false)}</p>
      <div class="choices">
        ${shuffledOrder(q.choices.length).map((orig, slot) =>
          `<button class="choice" type="button" data-i="${orig}"><b>${LETTERS[slot]}</b><span>${fmt(q.choices[orig], false)}</span></button>`
        ).join('')}
      </div>
      <div class="why hidden" id="why"></div>
      <div class="row end" style="margin-top:14px">
        <button class="btn hidden" type="button" id="q-next">Continue</button>
      </div>
    </div>`;

  const btns = [...host.querySelectorAll('.choice')];
  let answered = false;

  btns.forEach(b => b.addEventListener('click', () => {
    if (answered) return;
    answered = true;
    const i = Number(b.dataset.i);
    const ok = i === q.answer;
    tally(ok);
    btns.forEach(x => {
      x.disabled = true;
      if (Number(x.dataset.i) === q.answer) x.classList.add('right');
    });
    if (!ok) b.classList.add('wrong');
    ok ? sfx.right() : sfx.wrong();

    const why = host.querySelector('#why');
    why.innerHTML = `<b>${ok ? 'Yes.' : 'Not quite.'}</b> ${fmt(q.why, false)}`;
    why.classList.remove('hidden');

    const next = host.querySelector('#q-next');
    next.classList.remove('hidden');
    next.textContent = opts.nextLabel || 'Continue';
    next.focus({ preventScroll: true });
    next.addEventListener('click', () => done(ok), { once: true });
  }));
}

/* ---------------- toast ---------------- */

let toastTimer = null;

export function toast(msg, ms = 2600) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.add('hidden'), ms);
}

/* ---------------- small builders ---------------- */

export function creatureCard(sp, extra = '') {
  return `<div class="card">
    <canvas width="64" height="64" data-art="${sp.id}"></canvas>
    <div>
      <div class="nm">${esc(sp.name)}</div>
      <div class="jb">${esc(sp.kind)} &middot; ${esc(sp.jobName)}</div>
      ${extra}
    </div>
  </div>`;
}

/* Paints every <canvas data-art> inside a container. Called after any render
   that includes creature cards. */
export function paintArt(root) {
  root.querySelectorAll('canvas[data-art]').forEach(c => {
    const name = c.dataset.art;
    try { paintInto(c, name); } catch (e) { /* unknown art, leave blank */ }
  });
}
