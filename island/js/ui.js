/* Shared UI: the sheet that holds all reading, the passage formatter, the
   glossary tooltip, the single-question runner, read-aloud and toasts.
   Everything textual is DOM rather than canvas so it can be selected, zoomed,
   read by a screen reader and spoken by the browser. */

import { S, save, tally } from './state.js';
import { sfx } from './audio.js';
import { define } from './content/glossary.js';
import { creatureImg } from './creatures.js';

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

/* ---------------- bite-sized reading ---------------- */

/* One short chunk per screen, Next to go on. A wall of text is the fastest way
   to lose an 8 year old, so nothing here ever shows more than a few sentences
   at once, and Back is always available for the page you just left. */
export function readPages(opts) {
  const pages = opts.pages || [];
  const total = pages.length;
  let i = Math.min(opts.start || 0, Math.max(0, total - 1));
  let first = opts.first !== false;

  function draw() {
    const dots = pages.map((_, n) =>
      `<i class="dot${n === i ? ' on' : ''}${n < i ? ' seen' : ''}"></i>`).join('');
    const html = `
      <h2>${esc(opts.title || '')}</h2>
      ${opts.kicker ? `<p class="kicker">${esc(opts.kicker)}</p>` : ''}
      ${opts.head || ''}
      <div class="pagebar">
        <span class="small muted">Page ${i + 1} of ${total}</span>
        <span class="spacer"></span>
        <span class="dots" aria-hidden="true">${dots}</span>
      </div>
      <div class="passage big"><p>${fmt(pages[i] || '')}</p></div>
      <div class="row" style="margin-top:18px">
        ${i > 0 ? '<button class="btn ghost" type="button" id="pg-back">Back</button>' : ''}
        ${opts.closeLabel ? `<button class="btn ghost" type="button" data-close>${esc(opts.closeLabel)}</button>` : ''}
        <span class="spacer"></span>
        ${i < total - 1
          ? '<button class="btn" type="button" id="pg-next">Next &rarr;</button>'
          : `<button class="btn" type="button" id="pg-done">${esc(opts.doneLabel || 'Done')}</button>`}
      </div>`;

    const body = first ? openSheet(html) : updateSheet(html);
    first = false;

    const back = body.querySelector('#pg-back');
    if (back) back.addEventListener('click', () => { i--; draw(); });
    const next = body.querySelector('#pg-next');
    if (next) next.addEventListener('click', () => { i++; sfx.page(); draw(); });
    const done = body.querySelector('#pg-done');
    if (done) done.addEventListener('click', () => { if (opts.onDone) opts.onDone(); });
    // the Next button is where the eye already is, so put focus there
    const focus = next || done;
    if (focus) focus.focus({ preventScroll: true });
  }

  draw();
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

export { creatureImg };


