/* The other half of the testing. selftest.js proves the content: that every
   document is reachable, that the chain is solvable, that a sign's arithmetic
   uses numbers the sign actually prints. It never presses a button.

   This does. The real game shell is underneath this report, and everything here
   is a genuine click on a genuine handler: page through a sign, work out its
   question, take the berry, and check the save afterwards. It exists because
   "the content is right" and "the game works" are different claims, and I had
   been making the second one on the evidence of the first.

   It writes to the same localStorage the game on this browser uses, so every
   vi.* key is copied at the start and put back at the end. Open flowtest.html
   to run it. */

import * as U from './ui.js';
import { S, save, slots, renameSlot, eraseSlot, activeSlot } from './state.js';
import { SIGNS, DOCS } from './content/quests.js';
import { openSign, openDoc } from './reading.js';
import { meet } from './encounter.js';
import { ENTITIES } from './content/entities.js';
import { BY_ID } from './content/pokemon.js';
import { visibleEntities } from './world.js';
import * as title from './title.js';

const out = [];
let fails = 0, checks = 0;

function ok(cond, label, detail = '') {
  checks++;
  if (!cond) fails++;
  out.push(`<span class="${cond ? 'p' : 'f'}">${cond ? 'PASS' : 'FAIL'}</span>  ${label}${detail ? '  — ' + detail : ''}`);
  render();
}
function head(t) { out.push(`\n<b>${t}</b>`); render(); }
function render() {
  const el = document.getElementById('flow');
  if (el) el.innerHTML = `<b>${fails ? fails + ' FAILURES' : 'all clear'} — ${checks} checks</b>\n` + out.join('\n');
  document.title = fails ? 'FAIL ' + fails : 'PASS ' + checks;
}

const wait = ms => new Promise(r => setTimeout(r, ms));
const $ = s => document.querySelector(s);
const sheetText = () => ($('#sheet-body') || {}).textContent || '';
const stem = () => (($('.qtext') || {}).textContent || '').trim();

/* Click Next until the last page of a passage. */
async function pageThrough() {
  for (let n = 0; n < 12 && $('#pg-next'); n++) { $('#pg-next').click(); await wait(4); }
}

/* Find the question being asked in the content it came from, and click the
   right answer. Documents draw a random subset, so which one is on screen is
   not known in advance. */
async function answerRight(questions) {
  const asked = stem();
  const q = questions.find(x => x.q.replace(/[{}]/g, '').trim() === asked);
  if (!q) { ok(false, 'the question on screen comes from the content', asked); return null; }
  const btn = $(`.choice[data-i="${q.answer}"]`);
  if (!btn) { ok(false, 'the right answer is one of the choices', asked); return null; }
  btn.click();
  await wait(4);
  return q;
}

/* ---------------- borrow the save ---------------- */

const PREFIX = 'vi.';
const readStorage = () => {
  const got = {};
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && k.startsWith(PREFIX)) got[k] = localStorage.getItem(k);
  }
  return got;
};

let before = null;
try { before = readStorage(); } catch (e) { before = null; }

try {
  /* ---------------- a sign, from walking up to it to the berry ---------------- */
  head('working out a sign');
  {
    delete S.worked.beachSign;
    S.items.berries = 0;
    save();

    openSign('beachSign', 'test');
    await wait(8);
    ok(!$('#sheet').classList.contains('hidden'), 'a sign opens a sheet');
    ok(sheetText().includes('RANGER STATION'), 'and shows what is written on it');

    await pageThrough();
    const done = $('#pg-done');
    ok(!!done && done.textContent.trim() === 'Work it out',
      'the last page offers to work it out', done ? done.textContent.trim() : 'no button');
    done.click();
    await wait(8);

    ok(stem() === SIGNS.beachSign.q.q, 'the question is the one the sign carries', stem());
    ok(document.querySelectorAll('.choice').length === SIGNS.beachSign.q.choices.length,
      'every choice is on screen', String(document.querySelectorAll('.choice').length));

    $(`.choice[data-i="${SIGNS.beachSign.q.answer}"]`).click();
    await wait(8);
    ok(sheetText().includes('Yes.'), 'a right answer says so');
    ok(sheetText().includes(SIGNS.beachSign.q.why.slice(0, 24)), 'and explains why it is right');

    $('#q-next').click();
    await wait(8);
    ok(S.worked.beachSign === true, 'the sign is marked worked out');
    ok((S.items.berries || 0) === 1, 'and pays out a berry', String(S.items.berries));
    ok(sheetText().includes('Picked up'), 'and says what you picked up');
    U.closeSheet(true);
    await wait(4);

    // second time round it must not pay again
    openSign('beachSign', 'test');
    await wait(8);
    await pageThrough();
    ok($('#pg-done').textContent.includes('again'), 'a sign already done offers to work it out again',
      $('#pg-done').textContent.trim());
    $('#pg-done').click();
    await wait(8);
    $(`.choice[data-i="${SIGNS.beachSign.q.answer}"]`).click();
    await wait(8);
    $('#q-next').click();
    await wait(8);
    ok((S.items.berries || 0) === 1, 'and does not pay twice for the same sign', String(S.items.berries));
    U.closeSheet(true);
    await wait(4);
  }

  /* ---------------- getting it wrong ---------------- */
  head('getting a sign wrong');
  {
    delete S.worked.dockSign;
    const held = S.items.berries || 0;
    openSign('dockSign', 'test');
    await wait(8);
    await pageThrough();
    $('#pg-done').click();
    await wait(8);
    const wrong = SIGNS.dockSign.q.choices.map((_, i) => i).find(i => i !== SIGNS.dockSign.q.answer);
    $(`.choice[data-i="${wrong}"]`).click();
    await wait(8);
    ok(sheetText().includes('Not quite.'), 'a wrong answer says so');
    ok(sheetText().includes(SIGNS.dockSign.q.why.slice(0, 24)), 'and still explains the right answer');
    $('#q-next').click();
    await wait(8);
    ok(!S.worked.dockSign, 'a wrong answer does not mark the sign done');
    ok((S.items.berries || 0) === held, 'and costs nothing but the walk back', String(S.items.berries));
    U.closeSheet(true);
    await wait(4);
  }

  /* ---------------- a recall sign says where to remember from ---------------- */
  head('the recall signs');
  {
    delete S.worked.marshPost;
    openSign('marshPost', 'test');
    await wait(8);
    await pageThrough();
    $('#pg-done').click();
    await wait(8);
    ok(sheetText().includes('already read'), 'a recall question says the number is on a sign you have read',
      sheetText().slice(0, 80).replace(/\s+/g, ' '));
    ok(!stem().match(/\d/), 'and does not print the number in the question itself', stem());
    U.closeSheet(true);
    await wait(4);
  }

  /* ---------------- a document asks only as many as it says ---------------- */
  head('reading a document');
  {
    delete S.flags.notice;
    save();
    openDoc('notice');
    await wait(8);
    ok(sheetText().includes(DOCS.notice.text[0].slice(0, 20)), 'a document opens on its first page');
    await pageThrough();
    ok($('#pg-done').textContent.includes('Ask me'), 'and then offers its questions',
      $('#pg-done').textContent.trim());
    $('#pg-done').click();
    await wait(8);

    let asked = 0;
    for (let n = 0; n < 8 && $('.qtext'); n++) {
      asked++;
      if (!await answerRight(DOCS.notice.questions)) break;
      if ($('#q-next')) { $('#q-next').click(); await wait(8); }
    }
    ok(asked === DOCS.notice.ask, `the notice asks ${DOCS.notice.ask} of the ${DOCS.notice.questions.length} it carries`,
      String(asked));
    ok(S.flags.notice === true, 'and reading it logs the step');
    ok(sheetText().includes('You read it'), 'and says so at the end', sheetText().slice(0, 40));
    U.closeSheet(true);
    await wait(4);
  }

  /* ---------------- and that opens the next wave of the beach ---------------- */
  head('the beach opening up');
  {
    delete S.flags.notice;
    delete S.flags.tidechart;
    S.items.crank = 0;
    const atLanding = visibleEntities('beach', S).length;
    S.flags.notice = true;
    const afterNotice = visibleEntities('beach', S).length;
    S.flags.tidechart = true;
    const afterChart = visibleEntities('beach', S).length;
    S.items.crank = 1;
    S.flags.fieldguide = true;
    const afterGuide = visibleEntities('beach', S).length;

    ok(atLanding === 2, 'you land in front of two things', String(atLanding));
    ok(afterNotice > atLanding, 'reading the notice brings out the dock', `${atLanding} -> ${afterNotice}`);
    ok(afterChart > afterNotice, 'reading the chart brings out the digging', `${afterNotice} -> ${afterChart}`);
    ok(afterGuide > afterChart, 'reading the guide brings out the animals', `${afterChart} -> ${afterGuide}`);
  }

  /* ---------------- befriending an animal, which is the loop ---------------- */
  /* The beach animals were changed to need 2 right answers instead of 3, and
     nothing had clicked through an encounter to find out whether that is what
     actually happens. */
  head('making a friend');
  {
    const bird = ENTITIES.find(e => e.kind === 'wild' && e.map === 'beach' && e.species === 'pidgey');
    ok(bird.need === 2, 'the beach birds are set to need two right answers', String(bird.need));
    S.team = S.team.filter(id => id !== 'pidgey');
    save();

    meet(bird, () => {});
    await wait(8);
    ok(sheetText().includes(BY_ID.pidgey.name), 'walking up to an animal opens its page',
      sheetText().slice(0, 40).replace(/\s+/g, ' '));
    await pageThrough();
    $('#pg-done').click();
    await wait(8);

    let right = 0;
    for (let n = 0; n < 8 && $('.qtext') && !S.team.includes('pidgey'); n++) {
      if (!await answerRight(BY_ID.pidgey.questions)) break;
      right++;
      if ($('#q-next')) { $('#q-next').click(); await wait(10); }
    }
    ok(right === 2, 'two right answers is all a beach animal asks for', `${right} answered`);
    ok(S.team.includes('pidgey'), 'and then it joins you');
    ok(sheetText().length > 0, 'and the game says something about it');
    U.closeSheet(true);
    await wait(4);
  }

  /* ---------------- the home page, actually clicked ---------------- */
  head('starting a game from the home page');
  {
    for (const s of ['1', '2', '3']) eraseSlot(s);
    let started = null;
    title.mount(fromTap => { started = fromTap; });
    await wait(8);

    const root = document.getElementById('title');
    ok(!!root.querySelector('[data-new]'), 'an empty device offers a new player');
    root.querySelector('[data-new]').click();
    await wait(8);

    const input = root.querySelector('#home-name');
    ok(!!input, 'and asks who is playing');
    input.value = 'Ada';
    root.querySelector('#home-ok').click();
    await wait(8);

    ok(started === true, 'saying who you are starts the game', String(started));
    ok(document.documentElement.dataset.home === 'off', 'and the home page gets out of the way');
    ok(slots().find(s => s.slot === activeSlot()).name === 'Ada', 'and the island has your name on it',
      slots().find(s => s.slot === activeSlot()).name);

    renameSlot(activeSlot(), 'Ada');
    title.mount(() => {});
    await wait(8);
    ok(document.getElementById('title').textContent.includes('Ada'),
      'coming back to the home page shows it');
  }
} finally {
  try {
    for (const k of Object.keys(readStorage())) localStorage.removeItem(k);
    if (before) for (const k of Object.keys(before)) localStorage.setItem(k, before[k]);
  } catch (e) { /* nothing better to do */ }
  const now = readStorage();
  const same = before && Object.keys(before).length === Object.keys(now).length
    && Object.keys(before).every(k => now[k] === before[k]);
  ok(!!same, 'the game already on this browser was put back exactly as it was');
  out.push('\nThe save on this browser was borrowed and returned. The page itself is left mid-test on purpose: close it.');
  render();
}
