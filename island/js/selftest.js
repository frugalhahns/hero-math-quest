/* Static checks over the island's content. Not shipped to players -- it exists
   because there is no build step and no type checker, so the invariants that
   would otherwise be silent bugs (a document nobody can reach, a question whose
   answer index is out of range, a glossary word with no definition) get proved
   here instead. Open selftest.html to run it. */

import { GRIDS, MAP_W, MAP_H } from './content/maps.js';
import { ENTITIES, EXITS, REGIONS } from './content/entities.js';
import { DOCS, SIGNS, QUEST } from './content/quests.js';
import { SPECIES, BY_ID, JOBS } from './content/pokemon.js';
import { PROJECTS } from './content/projects.js';
import { GLOSSARY } from './content/glossary.js';
import { ART, SPRITE_SIZE } from './pixels.js';
import { isKnownTile, isSolidTile } from './tileset.js';
import * as W from './world.js';
import { BASE_DEX, TILES_TALL, animUrl, stillUrl } from './creatures.js';
import { form, nextForm, canGrow, growableCount } from './evolve.js';
import { THEMES, unlock as musicUnlock, setRegion as musicRegion, setMusic as musicSet, status as musicStatus } from './music.js';
import { askOne as U_askOne } from './ui.js';
import {
  S, SLOTS, activeSlot, slots, slotName, renameSlot, useSlot, eraseSlot,
  FILE_KIND, exportObject, fileName, checkFile, describeFile, importInto, roundTrip
} from './state.js';

const out = [];
let fails = 0;
let checks = 0;

function ok(cond, label, detail = '') {
  checks++;
  if (!cond) fails++;
  out.push(`<div class="${cond ? 'ok' : 'bad'}">${cond ? 'PASS' : 'FAIL'}  ${label}${detail ? '  — ' + detail : ''}</div>`);
}
/* The report is flushed to the page after every section rather than only at the
   end. If something stalls -- and audio rendering in a headless browser is very
   good at stalling -- you still get everything up to that point, which is how
   you find out where it stopped. */
function flush() {
  const el = document.getElementById('out');
  if (el) el.innerHTML = out.join('');
}
function head(t) { out.push(`<h2>${t}</h2>`); flush(); }
function note(t) { out.push(`<div>      ${t}</div>`); flush(); }

/* ---------------- maps ---------------- */
head('maps');
for (const [k, rows] of Object.entries(GRIDS)) {
  ok(rows.length === MAP_H, `${k}: ${MAP_H} rows`, `got ${rows.length}`);
  const bad = rows.map((r, i) => r.length !== MAP_W ? `row ${i}=${r.length}` : null).filter(Boolean);
  ok(bad.length === 0, `${k}: every row ${MAP_W} wide`, bad.join(', '));
  const unknown = new Set();
  for (const r of rows) for (const ch of r) if (!isKnownTile(ch)) unknown.add(ch);
  ok(unknown.size === 0, `${k}: all tile characters known`, [...unknown].join(''));
}
ok(Object.keys(GRIDS).length === Object.keys(REGIONS).length,
  'every grid has a region name', `${Object.keys(GRIDS).length} grids, ${Object.keys(REGIONS).length} regions`);
for (const k of Object.keys(GRIDS)) ok(!!REGIONS[k], `region name for ${k}`);

/* ---------------- a fully finished save, for reachability ---------------- */
const FULL = {
  projects: Object.fromEntries(PROJECTS.map(p => [p.id, true])),
  team: [], flags: { summit: true }, items: {}, read: {}, signs: {}, crew: {}, step: 0
};
W.buildWorld(FULL);

const ENTRY = {
  beach: [17, 3], meadow: [17, 22], grove: [32, 12],
  marsh: [1, 6], caverns: [17, 1], ridge: [17, 22]
};

head('region entry tiles');
for (const [m, [x, y]] of Object.entries(ENTRY)) {
  const t = W.tileAt(m, x, y);
  ok(t !== null && !isSolidTile(t), `${m} entry ${x},${y} walkable`, `tile ${JSON.stringify(t)}`);
}

const REACH = {};
for (const [m, [x, y]] of Object.entries(ENTRY)) REACH[m] = W.reachable(m, x, y, FULL);

/* ---------------- exits ---------------- */
head('exits');
for (const e of EXITS) {
  const from = W.tileAt(e.map, e.x, e.y);
  const to = W.tileAt(e.to, e.tx, e.ty);
  ok(from !== null && !isSolidTile(from), `exit ${e.map} ${e.x},${e.y} stands on walkable tile`, `tile ${JSON.stringify(from)}`);
  ok(!!REGIONS[e.to], `exit ${e.map} -> ${e.to} names a real region`);
  ok(to !== null && !isSolidTile(to), `landing ${e.to} ${e.tx},${e.ty} walkable`, `tile ${JSON.stringify(to)}`);
  ok(REACH[e.map] && REACH[e.map].has(e.x + ',' + e.y), `exit ${e.map} ${e.x},${e.y} reachable from entry`);
  ok(REACH[e.to] && REACH[e.to].has(e.tx + ',' + e.ty), `landing ${e.to} ${e.tx},${e.ty} reachable from entry`);
  const back = EXITS.find(o => o.map === e.to && Math.abs(o.x - e.tx) + Math.abs(o.y - e.ty) <= 3);
  ok(!!back, `${e.to} has a way back near ${e.tx},${e.ty}`);
}

/* ---------------- entities ---------------- */
head('entities');
const seenTiles = new Set();
for (const e of ENTITIES) {
  const at = `${e.map} ${e.x},${e.y}`;
  ok(!!GRIDS[e.map], `${at}: map exists`);
  ok(!seenTiles.has(e.map + at), `${at}: no two entities share a tile`);
  seenTiles.add(e.map + at);
  ok(W.tileAt(e.map, e.x, e.y) !== null, `${at}: inside the map`);

  // you must be able to stand next to it
  const around = [[1, 0], [-1, 0], [0, 1], [0, -1]]
    .map(([dx, dy]) => [e.x + dx, e.y + dy])
    .filter(([x, y]) => {
      const t = W.tileAt(e.map, x, y);
      return t !== null && !isSolidTile(t) && !ENTITIES.some(o => o !== e && o.map === e.map && o.x === x && o.y === y);
    })
    .filter(([x, y]) => REACH[e.map] && REACH[e.map].has(x + ',' + y));
  ok(around.length > 0, `${at}: ${e.kind} ${e.doc || e.sign || e.species || e.project || e.id || ''} can be stood next to`,
     around.length ? '' : 'no reachable neighbour');

  if (e.art) ok(!!ART[e.art], `${at}: sprite "${e.art}" exists`);
  if (e.kind === 'doc' || e.kind === 'rocket') ok(!!DOCS[e.doc], `${at}: doc "${e.doc}" exists`);
  if (e.kind === 'sign') ok(!!SIGNS[e.sign], `${at}: sign "${e.sign}" exists`);
  if (e.kind === 'wild') ok(!!BY_ID[e.species], `${at}: species "${e.species}" exists`);
  if (e.kind === 'project') ok(PROJECTS.some(p => p.id === e.project), `${at}: project "${e.project}" exists`);
}

/* every resident and every document must be somewhere on the island */
head('coverage');
for (const sp of SPECIES) {
  ok(ENTITIES.some(e => e.kind === 'wild' && e.species === sp.id), `${sp.name} is placed on a map`);
  // residents are drawn as animated <img>; the canvas only needs a fallback for
  // when that file fails. Check the exact key world.js will reach for, which is
  // the entity's own art if it has one and the generic shape if it does not.
  const ent = ENTITIES.find(e => e.kind === 'wild' && e.species === sp.id);
  const fallback = (ent && ent.art) || 'mon_unknown';
  ok(!!ART[fallback], `${sp.name} has a canvas fallback sprite (${fallback})`);
}
ok(!!ART.mon_unknown, 'the generic fallback shape exists, so no resident can be invisible');
for (const id of Object.keys(DOCS)) {
  ok(ENTITIES.some(e => (e.kind === 'doc' || e.kind === 'rocket') && e.doc === id),
    `document "${id}" is placed on a map`);
}
for (const id of Object.keys(SIGNS)) {
  ok(ENTITIES.some(e => e.kind === 'sign' && e.sign === id), `sign "${id}" is placed on a map`);
}
for (const p of PROJECTS) {
  ok(ENTITIES.some(e => e.kind === 'project' && e.project === p.id), `project "${p.id}" has a site on a map`);
}

/* ---------------- projects ---------------- */
head('projects');
for (const p of PROJECTS) {
  for (const j of p.needs) {
    ok(!!JOBS[j], `${p.id}: job "${j}" is a real job`);
    ok(SPECIES.some(s => s.job === j), `${p.id}: some resident can do "${j}"`);
  }
  if (p.learn) ok(!!DOCS[p.learn], `${p.id}: learned from document "${p.learn}"`);
  if (p.clear) {
    const rows = GRIDS[p.clear.map];
    ok(!!rows, `${p.id}: clears a real map`);
    ok(rows && rows.some(r => r.includes(p.clear.from)),
      `${p.id}: barrier "${p.clear.from}" actually appears in ${p.clear.map}`);
    ok(isKnownTile(p.clear.to) && !isSolidTile(p.clear.to), `${p.id}: cleared tile "${p.clear.to}" is walkable`);
  }
  if (p.paint) ok(!!GRIDS[p.paint.map], `${p.id}: paints a real map`);
}

/* the requirement chain must be satisfiable in order */
head('progression is solvable in order');
{
  const sim = { projects: {}, team: [], flags: {}, items: {}, read: {}, signs: {}, crew: {}, step: 0 };
  const reachableRegions = new Set(['beach']);
  let progressed = true, guard = 0;
  while (progressed && guard++ < 40) {
    progressed = false;
    // read every document sitting in a reachable region
    for (const e of ENTITIES) {
      if (e.kind === 'doc' && reachableRegions.has(e.map) && !sim.flags[e.doc]) { sim.flags[e.doc] = true; progressed = true; }
      if (e.kind === 'dig' && e.gives && reachableRegions.has(e.map)) sim.items[e.gives] = 1;
      if (e.kind === 'item' && e.gives && reachableRegions.has(e.map)) sim.items[e.gives] = 2;
    }
    // befriend every resident in a reachable region whose gate items are held
    for (const e of ENTITIES) {
      if (e.kind !== 'wild' || !reachableRegions.has(e.map)) continue;
      if (e.when && !e.when(sim)) continue;
      if (e.needsItem && (sim.items[e.needsItem.key] || 0) < e.needsItem.count) continue;
      if (!sim.team.includes(e.species)) { sim.team.push(e.species); progressed = true; }
    }
    // build anything whose jobs are covered
    for (const p of PROJECTS) {
      if (sim.projects[p.id]) continue;
      if (p.learn && !sim.flags[p.learn]) continue;
      if (p.needsItem && (sim.items[p.needsItem.key] || 0) < p.needsItem.count) continue;
      const jobs = sim.team.map(id => BY_ID[id].job);
      if (!p.needs.every(j => jobs.includes(j))) continue;
      const distinct = new Set(p.needs).size === p.needs.length;
      if (!distinct) continue;
      sim.projects[p.id] = true;
      progressed = true;
      if (p.opens) {
        const region = Object.keys(REGIONS).find(k => REGIONS[k].name === p.opens);
        if (region) reachableRegions.add(region);
      }
    }
  }
  ok(reachableRegions.size === Object.keys(REGIONS).length,
    'every region becomes reachable', `reached ${[...reachableRegions].join(', ')}`);
  ok(sim.team.length === SPECIES.length, 'every resident can be befriended',
    `got ${sim.team.length}/${SPECIES.length}: missing ${SPECIES.filter(s => !sim.team.includes(s.id)).map(s => s.id).join(', ')}`);
  ok(Object.keys(sim.projects).length === PROJECTS.length, 'every project can be finished',
    `${Object.keys(sim.projects).length}/${PROJECTS.length}`);
  // and the quest chain must run to its end on that simulated save
  let stepIdx = 0, spin = 0;
  while (stepIdx < QUEST.length - 1 && QUEST[stepIdx].done(sim) && spin++ < 100) stepIdx++;
  ok(stepIdx === QUEST.length - 1, 'quest chain runs to the last step', `stopped at ${stepIdx} (${QUEST[stepIdx].id})`);
}

/* ---------------- questions ---------------- */
head('questions');
const dist = [0, 0, 0, 0];
let qCount = 0;
function checkQ(where, q) {
  qCount++;
  ok(Array.isArray(q.choices) && q.choices.length >= 3, `${where}: has choices`, String(q.choices && q.choices.length));
  ok(Number.isInteger(q.answer) && q.answer >= 0 && q.answer < q.choices.length,
    `${where}: answer index in range`, String(q.answer));
  ok(typeof q.why === 'string' && q.why.length > 40, `${where}: has a real explanation`);
  ok(new Set(q.choices).size === q.choices.length, `${where}: no duplicate choices`);
  if (q.answer < 4) dist[q.answer]++;
}
for (const [id, d] of Object.entries(DOCS)) {
  ok(d.questions.length >= 2, `doc ${id}: at least 2 questions`);
  ok(Array.isArray(d.text) && d.text.length >= 2, `doc ${id}: passage has paragraphs`);
  d.questions.forEach((q, i) => checkQ(`doc ${id} q${i}`, q));
}
for (const sp of SPECIES) {
  ok(sp.questions.length >= 3, `${sp.id}: at least 3 questions`, String(sp.questions.length));
  ok(!!(sp.lines && sp.lines.rapport && sp.lines.catch && sp.lines.flee), `${sp.id}: has all three flavour lines`);
  ok(!!JOBS[sp.job], `${sp.id}: job "${sp.job}" is real`);
  sp.questions.forEach((q, i) => checkQ(`${sp.id} q${i}`, q));
}
note(`${qCount} questions total; correct-answer positions as authored A/B/C/D = ${dist.join('/')}`);
note('authored positions do not matter because ui.askOne shuffles every render — checked next');

/* The authored data is lopsided towards one position, so the shuffle is not a
   nicety, it is the thing stopping a reader from guessing. Prove it moves. */
{
  const host = document.createElement('div');
  const probe = { tag: 'probe', q: 'q?', choices: ['w', 'x', 'y', 'z'], answer: 2, why: 'x'.repeat(50) };
  const slots = new Set();
  for (let i = 0; i < 60; i++) {
    U_askOne(host, probe, () => {});
    const btns = [...host.querySelectorAll('.choice')];
    slots.add(btns.findIndex(b => Number(b.dataset.i) === probe.answer));
    ok(btns.length === 4, 'probe renders four choices', String(btns.length));
    if (i > 0) out.pop();   // keep the log to one line for the 60 repeats
  }
  ok(slots.size >= 3, 'the correct answer lands in at least 3 different positions', `saw positions ${[...slots].sort().join(',')}`);
  ok(!slots.has(-1), 'the correct answer is always present after shuffling');
}

/* ---------------- reading level and page size ---------------- */
head('reading level');

/* Flesch-Kincaid grade level. The syllable count is the usual heuristic --
   strip a silent trailing e/ed/es, then count vowel runs -- which is a couple
   of tenths off a human count but plenty good enough to catch a passage that
   has drifted well above the target. */
function syllables(word) {
  let w = word.toLowerCase().replace(/[^a-z]/g, '');
  if (!w) return 0;
  if (w.length <= 3) return 1;
  w = w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '').replace(/^y/, '');
  const m = w.match(/[aeiouy]{1,2}/g);
  return m ? m.length : 1;
}

function grade(text) {
  const clean = String(text).replace(/[{}]/g, '');
  const sentences = clean.split(/[.!?]+/).filter(t => /[a-z]/i.test(t));
  const words = clean.split(/\s+/).filter(w => /[a-z]/i.test(w));
  if (!sentences.length || !words.length) return { fk: 0, words: 0, sentences: 0 };
  const syl = words.reduce((n, w) => n + syllables(w), 0);
  const fk = 0.39 * (words.length / sentences.length) + 11.8 * (syl / words.length) - 15.59;
  return { fk, words: words.length, sentences: sentences.length, syl };
}

const TARGET = 5.0;          // 3rd grade, with slack for the heuristic
const MAX_PAGE_WORDS = 60;   // a page has to stay bite sized
let worst = { fk: -99, what: '' };
const grades = [];

function checkPassage(what, pages) {
  ok(pages.length >= 3, `${what}: split into at least 3 pages`, `${pages.length} pages`);
  const long = pages
    .map((t, i) => ({ i, n: grade(t).words }))
    .filter(x => x.n > MAX_PAGE_WORDS);
  ok(long.length === 0, `${what}: no page over ${MAX_PAGE_WORDS} words`,
    long.map(x => `page ${x.i + 1} = ${x.n}`).join(', '));

  const g = grade(pages.join(' '));
  grades.push(g.fk);
  if (g.fk > worst.fk) worst = { fk: g.fk, what };
  ok(g.fk <= TARGET, `${what}: reading level ${g.fk.toFixed(1)} is at or under ${TARGET.toFixed(1)}`,
    `${g.words} words, ${g.sentences} sentences, ${(g.words / g.sentences).toFixed(1)} words per sentence`);
}

for (const sp of SPECIES) checkPassage(`${sp.id} notes`, sp.passage.text);
for (const [id, d] of Object.entries(DOCS)) checkPassage(`doc ${id}`, d.text);
for (const sp of SPECIES) {
  for (const f of sp.line) {
    if (!f.blurb) continue;
    const g = grade(f.blurb);
    ok(g.fk <= TARGET, `${f.name} blurb: reading level ${g.fk.toFixed(1)} at or under ${TARGET.toFixed(1)}`,
      `${g.words} words`);
    ok(g.words <= MAX_PAGE_WORDS, `${f.name} blurb: fits on one page`, `${g.words} words`);
  }
}

/* the questions have to be readable too, or the passage level is meaningless */
{
  const all = [];
  for (const sp of SPECIES) for (const q of sp.questions) all.push(q);
  for (const d of Object.values(DOCS)) for (const q of d.questions) all.push(q);
  const longStems = all.filter(q => grade(q.q).words > 18);
  ok(longStems.length === 0, 'no question stem runs over 18 words',
    longStems.slice(0, 3).map(q => q.q).join(' | '));
  const longChoices = all.flatMap(q => q.choices).filter(c => grade(c).words > 14);
  ok(longChoices.length === 0, 'no answer choice runs over 14 words',
    longChoices.slice(0, 3).join(' | '));
  const qg = grade(all.map(q => q.q + ' ' + q.choices.join('. ')).join(' '));
  ok(qg.fk <= TARGET, `questions and choices read at ${qg.fk.toFixed(1)}, at or under ${TARGET.toFixed(1)}`);
}

const avg = grades.reduce((a, b) => a + b, 0) / grades.length;
note(`average passage reading level ${avg.toFixed(2)} (Flesch-Kincaid); hardest is ${worst.what} at ${worst.fk.toFixed(1)}`);
ok(avg <= 4.0, 'the corpus averages 4th grade or easier', avg.toFixed(2));

/* ---------------- glossary ---------------- */
head('glossary');
const used = new Set();
const missing = new Set();
function scan(where, text) {
  for (const m of String(text).matchAll(/\{([a-zA-Z][a-zA-Z-]*)\}/g)) {
    const w = m[1].toLowerCase();
    used.add(w);
    if (!GLOSSARY[w]) missing.add(`${w} (${where})`);
  }
}
for (const [id, d] of Object.entries(DOCS)) {
  d.text.forEach(t => scan('doc ' + id, t));
  d.questions.forEach(q => { scan('doc ' + id, q.q); q.choices.forEach(c => scan('doc ' + id, c)); scan('doc ' + id, q.why); });
}
for (const sp of SPECIES) {
  sp.passage.text.forEach(t => scan(sp.id, t));
  sp.questions.forEach(q => { scan(sp.id, q.q); q.choices.forEach(c => scan(sp.id, c)); scan(sp.id, q.why); });
}
Object.values(SIGNS).forEach((lines, i) => lines.forEach(l => scan('sign ' + i, l)));
ok(missing.size === 0, 'every {braced} word has a definition', [...missing].join(', '));
const unused = Object.keys(GLOSSARY).filter(w => !used.has(w));
ok(unused.length === 0, 'no unused glossary entries', unused.join(', '));

/* every glossary word must actually appear in the prose of its own passage */
head('vocabulary questions are answerable from the text');
for (const sp of SPECIES) {
  const body = sp.passage.text.join(' ').toLowerCase();
  for (const q of sp.questions) {
    const m = String(q.q).match(/\{([a-zA-Z]+)\}/);
    if (!m) continue;
    ok(body.includes('{' + m[1].toLowerCase() + '}') || body.includes(m[1].toLowerCase()),
      `${sp.id}: asks about "${m[1]}", which appears in its passage`);
  }
}

/* ---------------- sprites ---------------- */
head('sprites');
for (const [name, rows] of Object.entries(ART)) {
  ok(rows.length === SPRITE_SIZE, `${name}: ${SPRITE_SIZE} rows`, String(rows.length));
  const bad = rows.map((r, i) => r.length !== SPRITE_SIZE ? `row ${i}=${r.length}` : null).filter(Boolean);
  ok(bad.length === 0, `${name}: every row ${SPRITE_SIZE} wide`, bad.join(', '));
}
for (const d of ['player_down', 'player_up', 'player_side']) ok(!!ART[d], `player art "${d}" exists`);

/* ---------------- vendored sprites ---------------- */
head('resident sprites');
for (const sp of SPECIES) {
  ok(Number.isInteger(BASE_DEX[sp.id]), `${sp.id}: has a national dex number`, String(BASE_DEX[sp.id]));
  const t = TILES_TALL[sp.id];
  ok(typeof t === 'number' && t >= 0.8 && t <= 4,
    `${sp.id}: overworld height is a sane number of tiles`, String(t));
}
ok(Object.keys(BASE_DEX).length === SPECIES.length, 'no dex entries for residents that do not exist',
  `${Object.keys(BASE_DEX).length} vs ${SPECIES.length}`);
ok(Object.keys(TILES_TALL).length === SPECIES.length, 'every dex entry has an overworld height');

/* ---------------- evolution lines ---------------- */
head('growing up');
const allForms = [];
for (const sp of SPECIES) {
  ok(Array.isArray(sp.line) && sp.line.length >= 1, `${sp.id}: has an evolution line`,
    String(sp.line && sp.line.length));
  if (!Array.isArray(sp.line)) continue;
  ok(sp.line[0].dex === BASE_DEX[sp.id],
    `${sp.id}: stage 0 dex matches the one used on the map`,
    `${sp.line[0].dex} vs ${BASE_DEX[sp.id]}`);
  ok(sp.line[0].name === sp.name, `${sp.id}: stage 0 name matches the species name`);
  sp.line.forEach((f, i) => {
    allForms.push({ id: sp.id, i, ...f });
    ok(typeof f.name === 'string' && f.name.length > 1, `${sp.id} stage ${i}: has a name`);
    ok(Number.isInteger(f.dex) && f.dex > 0, `${sp.id} stage ${i}: has a dex number`, String(f.dex));
    // every form you can grow into is a little more reading, so it needs its page
    if (i > 0) ok(typeof f.blurb === 'string' && f.blurb.length > 40,
      `${sp.id} stage ${i} (${f.name}): has a blurb to read`, String(f.blurb && f.blurb.length));
  });
  // a fresh save must start every animal at stage 0 and show a next form if it has one
  const f = form(sp.id);
  ok(f.stage === 0, `${sp.id}: starts at stage 0 on a new save`, String(f.stage));
  ok(canGrow(sp.id) === (sp.line.length > 1), `${sp.id}: canGrow agrees with the line length`);
  if (sp.line.length > 1) ok(!!nextForm(sp.id), `${sp.id}: has a next form to grow into`);
}
{
  const dexes = allForms.map(f => f.dex);
  ok(new Set(dexes).size === dexes.length, 'no two forms share a dex number',
    String(dexes.length - new Set(dexes).size) + ' duplicates');
  note(`${allForms.length} forms across ${SPECIES.length} animals; ${growableCount()} can grow`);
}

/* Every form needs its portrait on disk, grown ones included -- a grown animal
   with a missing file is a blank card in the team screen. */
{
  const results = await Promise.all(allForms.flatMap(f => [
    fetch(animUrl(f.dex)).then(r => [`${f.name} anim`, r.ok]).catch(() => [`${f.name} anim`, false]),
    fetch(stillUrl(f.dex)).then(r => [`${f.name} still`, r.ok]).catch(() => [`${f.name} still`, false])
  ]));
  const missing = results.filter(r => !r[1]).map(r => r[0]);
  ok(missing.length === 0, `all ${results.length} form sprite files are present`, missing.join(', '));
}



/* ---------------- soundtrack ---------------- */
head('soundtrack');
for (const key of Object.keys(REGIONS)) {
  const t = THEMES[key];
  ok(!!t, `${key}: has a theme`);
  if (!t) continue;
  ok(t.bpm >= 50 && t.bpm <= 110, `${key}: tempo ${t.bpm} is in the cozy range`, String(t.bpm));
  ok(t.root >= 40 && t.root <= 80, `${key}: root note is in a sane octave`, String(t.root));
  ok(Array.isArray(t.chords) && t.chords.length === 4, `${key}: four bars of chords`, String(t.chords && t.chords.length));
  ok(t.chords.every(c => c.length >= 3), `${key}: every chord has at least three notes`);
  ok(t.chords.every(c => c.every(n => n >= -12 && n <= 24)), `${key}: chord offsets stay near the root`);
  ok(Array.isArray(t.scale) && t.scale.length === 5, `${key}: melody uses a five note scale`);
  ok(t.bright > 0.2 && t.bright <= 2, `${key}: filter brightness is sane`, String(t.bright));
}
ok(Object.keys(THEMES).length === Object.keys(REGIONS).length,
  'no themes for regions that do not exist', `${Object.keys(THEMES).length} themes, ${Object.keys(REGIONS).length} regions`);
{
  const keys = Object.keys(THEMES);
  const roots = new Set(keys.map(k => THEMES[k].root));
  ok(roots.size >= 4, 'the regions do not all sit in the same key', `${roots.size} different roots`);
}

/* ---------------- quest chain ---------------- */
head('quest chain');
const empty = { projects: {}, team: [], flags: {}, items: {}, read: {}, signs: {}, crew: {}, step: 0 };
for (const q of QUEST) {
  ok(typeof q.objective === 'string' && q.objective.length > 8, `${q.id}: has an objective line`);
  ok(!!REGIONS[q.where], `${q.id}: region "${q.where}" exists`);
  let threw = false;
  try { q.done(empty); q.done(FULL); } catch (e) { threw = true; }
  ok(!threw, `${q.id}: done() survives both an empty and a finished save`);
}
ok(QUEST.filter(q => q.done(empty)).length === 0, 'no quest step is already complete on a new save');

/* ---------------- save files ---------------- */
/* The save is the only thing in here a player can actually lose, and since the
   file is now the only real backup, the format gets checked harder than
   anything else: what comes out of an export has to survive the trip back in
   unchanged, and a damaged or hostile file has to be turned away at the door
   rather than merged into a good game. */
head('save files');

/* Reports the first difference as a path, or null. JSON.stringify would nearly
   do, but it hides which field moved and it depends on key order. */
function same(a, b, path = 'save') {
  if (Array.isArray(a) || Array.isArray(b)) {
    if (!Array.isArray(a) || !Array.isArray(b)) return `${path}: one is a list, one is not`;
    if (a.length !== b.length) return `${path}: ${a.length} vs ${b.length} items`;
    for (let i = 0; i < a.length; i++) {
      const d = same(a[i], b[i], `${path}[${i}]`);
      if (d) return d;
    }
    return null;
  }
  if (a && b && typeof a === 'object' && typeof b === 'object') {
    const ka = Object.keys(a).sort(), kb = Object.keys(b).sort();
    if (ka.join() !== kb.join()) return `${path}: keys differ (${ka.join()} vs ${kb.join()})`;
    for (const k of ka) {
      const d = same(a[k], b[k], `${path}.${k}`);
      if (d) return d;
    }
    return null;
  }
  return a === b ? null : `${path}: ${JSON.stringify(a)} vs ${JSON.stringify(b)}`;
}

const mine = exportObject();
ok(mine.kind === FILE_KIND, 'an export says which game it came from', String(mine.kind));
ok(mine.version === 1, 'an export carries a version number', String(mine.version));
ok(typeof mine.exported === 'string' && !isNaN(Date.parse(mine.exported)), 'an export is dated', String(mine.exported));
ok(typeof mine.player === 'string' && !!mine.player, 'an export says whose game it is', String(mine.player));
ok(checkFile(mine) === null, 'the game accepts its own export', checkFile(mine) || '');
ok(mine.save !== S, 'an export is a copy, not the live save');
{
  const diff = same(roundTrip(mine), mine.save);
  ok(!diff, 'a save survives export and import unchanged', diff || '');
}
{
  const line = describeFile(mine);
  ok(typeof line === 'string' && line.includes(mine.player) && /step \d+/.test(line),
    'a file describes itself before anyone loads it', String(line));
}
ok(/^verdant-isle-[a-z0-9]+(-[a-z0-9]+)*-\d{4}-\d{2}-\d{2}\.json$/.test(fileName()),
  'the download gets a tidy file name', fileName());

/* Every one of these has to come back as a sentence a 3rd grader can read,
   because that sentence is the whole error handling the player ever sees. */
const JUNK = [
  [null, 'nothing at all'],
  ['a saved game, honest', 'a bare string'],
  [[1, 2, 3], 'a list'],
  [{}, 'an object with no kind'],
  [{ kind: 'some-other-game', save: mine.save }, 'a file from a different game'],
  [{ kind: FILE_KIND }, 'a file with no island inside'],
  [{ kind: FILE_KIND, save: 'beach' }, 'an island that is a string'],
  [{ kind: FILE_KIND, save: [] }, 'an island that is a list'],
  [{ kind: FILE_KIND, save: { map: 'beach' } }, 'a save with no step'],
  [{ kind: FILE_KIND, save: { step: '3', map: 'beach' } }, 'a step that is text'],
  [{ kind: FILE_KIND, save: { step: -3, map: 'beach' } }, 'a step before the beginning'],
  [{ kind: FILE_KIND, save: { step: Infinity, map: 'beach' } }, 'a step that is not a real number'],
  [{ kind: FILE_KIND, save: { step: 0 } }, 'a save with nowhere to stand'],
  [{ kind: FILE_KIND, save: { step: 0, map: '' } }, 'a save whose map has no name']
];
for (const [d, what] of JUNK) {
  const msg = checkFile(d);
  const said = typeof msg === 'string' && msg.length > 0;
  ok(said, `turns away ${what}`, said ? '' : JSON.stringify(msg));
  if (said) ok(/[.!]$/.test(msg) && msg.length < 90 && !/[{}[\]]/.test(msg),
    `${what}: the reason reads as a plain sentence`, msg);
}

/* A file arriving from another device is not trustworthy. Anything the game
   does not recognise is dropped, and anything of the wrong shape falls back to
   its default rather than reaching the rest of the game. */
{
  const out = roundTrip({
    kind: FILE_KIND, version: 1, exported: mine.exported, player: 'Test',
    save: Object.assign({}, mine.save, {
      nonsense: 41,
      x: 'over by the rocks',
      team: [SPECIES[0].id, 7, null, {}, SPECIES[1].id],
      items: { crank: 1 },
      finished: 'yes please'
    })
  });
  ok(!('nonsense' in out), 'a key the game has never heard of is dropped');
  ok(out.x === 17, 'a field of the wrong type keeps its default', JSON.stringify(out.x));
  ok(out.finished === false, 'and so does a flag of the wrong type', JSON.stringify(out.finished));
  ok(out.team.length === 2 && out.team[0] === SPECIES[0].id,
    'a team list keeps only the names in it', JSON.stringify(out.team));
  ok(out.items.crank === 1, 'the object fields still come through', JSON.stringify(out.items));
  ok(Object.keys(out).join() === Object.keys(mine.save).join(), 'an imported save has exactly the fields the game expects');
}

/* JSON.parse hangs "__proto__" on the object as a real key, and assigning it
   onward would write straight through to Object.prototype. Both the top level
   and the nested lists are checked, because they are merged by different code. */
{
  const text = '{"kind":"' + FILE_KIND + '","version":1,"save":'
    + '{"step":2,"map":"marsh","__proto__":{"pwned":true},"items":{"__proto__":{"owned":true},"crank":2}}}';
  const out = roundTrip(JSON.parse(text));
  ok({}.pwned === undefined, 'a save file cannot reach Object.prototype');
  ok({}.owned === undefined, 'not even from inside one of its own lists');
  ok(!Object.prototype.hasOwnProperty.call(out, '__proto__'), 'and __proto__ does not survive the import');
  ok(!Object.prototype.hasOwnProperty.call(out.items, '__proto__'), 'in either place');
  ok(out.step === 2 && out.map === 'marsh' && out.items.crank === 2,
    'the honest half of that file still loads', `step ${out.step}, map ${out.map}`);
}

/* ---------------- save slots ---------------- */
head('save slots');
{
  const list = slots();
  ok(list.length === SLOTS.length, 'there is one slot for every player', String(list.length));
  ok(list.map(s => s.slot).join() === SLOTS.join(), 'the slots come back in order', list.map(s => s.slot).join());
  ok(list.filter(s => s.active).length === 1, 'exactly one slot is the one being played');
  ok(list.find(s => s.active).slot === activeSlot(), 'and it is the one state.js loaded from', activeSlot());
  ok(list.every(s => typeof s.name === 'string' && !!s.name), 'every slot has a name to show',
    JSON.stringify(list.map(s => s.name)));
  ok(list.every(s => Number.isInteger(s.step) && s.step >= 0 && Number.isInteger(s.team) && s.team >= 0),
    'every slot reports a step and a team size', JSON.stringify(list.map(s => [s.step, s.team])));
}

/* index.html has to resolve the theme before any module loads, so it builds the
   storage key itself, inline and synchronous. That means the key format is
   written down in two places. This is the check that they have not drifted. */
{
  const names = t => [...new Set((t.match(/vi\.[A-Za-z0-9.]*/g) || []))].sort();
  const saveKeys = ks => ks.filter(k => k.startsWith('vi.save')).join(' ');
  let html = null;
  try {
    const r = await fetch('index.html');
    if (r.ok) html = await r.text();
  } catch (e) { /* file:// has no fetch for local pages */ }
  let js = null;
  try {
    const r = await fetch('js/state.js');
    if (r.ok) js = await r.text();
  } catch (e) { /* same */ }
  if (html && js) {
    const page = names(html), mod = names(js);
    ok(!!saveKeys(page) && saveKeys(page) === saveKeys(mod) && page.includes('vi.slot') && mod.includes('vi.slot'),
      'index.html and state.js build the save key the same way',
      `page: ${page.join(' ')} | module: ${mod.join(' ')}`);
  } else {
    note('could not read the sources over fetch here, so the duplicated storage key was not compared');
  }
}

/* ---------------- slots on disk ---------------- */
/* This section writes to localStorage -- the same storage the game on this
   browser is using, since the self test is served from the same folder. Every
   vi.* key is copied first and put back at the end, and there is no await
   between the two, so nothing can run while storage is borrowed. */
head('slots on disk');
{
  const PREFIX = 'vi.';
  const read = () => {
    const got = {};
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(PREFIX)) got[k] = localStorage.getItem(k);
    }
    return got;
  };
  let before = null;
  try { before = read(); } catch (e) { before = null; }

  if (!before) {
    note('localStorage is not available here, so writing to the slots was not exercised');
  } else {
    try {
      for (const s of SLOTS) eraseSlot(s);
      ok(slots().every(s => !s.used), 'erasing every slot leaves nothing behind',
        JSON.stringify(slots().map(s => s.used)));
      ok(slotName('2') === 'Player 2', 'a slot nobody has named is just its number', slotName('2'));

      renameSlot('2', '   Ada   Mae   ');
      ok(slotName('2') === 'Ada Mae', 'a name loses its extra spaces', slotName('2'));
      renameSlot('2', 'Bartholomew Fitzgerald III');
      ok(slotName('2').length === 16, 'a very long name is cut to fit the list', `"${slotName('2')}"`);
      renameSlot('2', '   ');
      ok(slotName('2') === 'Player 2', 'a name of nothing but spaces goes back to the default', slotName('2'));
      renameSlot('2', 'Ada');

      const file = {
        kind: FILE_KIND, version: 1, exported: new Date().toISOString(), player: 'Ada',
        save: Object.assign({}, mine.save, { step: 3, map: 'marsh', team: [SPECIES[0].id] })
      };
      const landed = importInto(file, '2');
      ok(landed === null, 'a good file loads into an empty slot', landed || '');
      {
        const list = slots();
        const two = list.find(s => s.slot === '2');
        ok(two.used && two.step === 3 && two.team === 1, 'and the slot list shows what landed there', JSON.stringify(two));
        ok(list.filter(s => s.used).length === 1, 'loading one slot leaves the other two alone',
          JSON.stringify(list.map(s => s.used)));
        ok(typeof two.updatedAt === 'string', 'an imported slot is stamped with when it arrived', String(two.updatedAt));
      }
      const nowhere = importInto(file, '4');
      ok(typeof nowhere === 'string', 'there is no fourth island to load into', String(nowhere));
      ok(typeof importInto({ kind: 'not-this-game' }, '3') === 'string', 'a file that fails the check is refused');
      ok(!slots().find(s => s.slot === '3').used, 'and the slot it was aimed at stays empty');

      {
        const out = exportObject('2');
        ok(out.player === 'Ada' && out.save.step === 3 && out.save.map === 'marsh',
          'a slot can be saved to a file without being played first',
          JSON.stringify([out.player, out.save.step, out.save.map]));
        const diff = same(roundTrip(out), out.save);
        ok(!diff, 'and that export round trips as well', diff || '');
        ok(fileName('2').startsWith('verdant-isle-ada-'), "the file is named after the slot's player", fileName('2'));
      }

      ok(useSlot('2') === true, 'the game can hand over to another player');
      ok(activeSlot() === '2', 'and that is the slot the next load will read', activeSlot());
      ok(useSlot('zzz') === false, 'a slot that does not exist is refused');
      ok(activeSlot() === '2', 'and a refused switch changes nothing', activeSlot());

      eraseSlot('2');
      {
        const two = slots().find(s => s.slot === '2');
        ok(!two.used, 'erasing a slot empties it');
        ok(two.name === 'Player 2', 'and takes the name with it', two.name);
      }
    } finally {
      try {
        for (const k of Object.keys(read())) localStorage.removeItem(k);
        for (const k of Object.keys(before)) localStorage.setItem(k, before[k]);
      } catch (e) { /* nothing useful left to do about it */ }
    }
    const diff = same(read(), before, 'storage');
    ok(!diff, 'the game already on this browser was put back exactly as it was', diff || '');
  }
}

/* ---------------- render smoke test ---------------- */
head('render');
try {
  const c = document.createElement('canvas');
  c.width = 352; c.height = 240;
  const g = c.getContext('2d');
  for (const m of Object.keys(GRIDS)) {
    W.drawMap(g, m, W.camera(17, 12), 0, FULL);
    W.drawMap(g, m, W.camera(3, 3), 1, FULL);
  }
  W.drawGloom(g, 352, 240);
  ok(true, 'every region draws without throwing');
} catch (e) {
  ok(false, 'every region draws without throwing', e.message);
}

/* ---------------- the soundtrack actually runs ---------------- */
head('soundtrack engine');
{
  let threw = null;
  try {
    musicUnlock('beach');
    await new Promise(r => setTimeout(r, 500));
    musicRegion('caverns');
    await new Promise(r => setTimeout(r, 500));
  } catch (e) {
    threw = e.message;
  }
  ok(!threw, 'starting the soundtrack and changing region throws nothing', threw || '');
  const st = musicStatus();
  ok(st.running, 'the note scheduler is running', JSON.stringify(st));
  // a suspended context has a frozen clock, so only assert progress if it is live
  if (st.contextState === 'running') {
    ok(st.steps > 0, 'the scheduler queued notes', `${st.steps} steps`);
  } else {
    note(`audio context is "${st.contextState}" here, so note timing was not exercised`);
  }
  musicSet(false);   // do not leave a dev page humming
  ok(true, 'soundtrack stopped cleanly after the check');
  note('loudness is measured by hand with renderOne() in js/music.js -- see the comment there for why it is not automated');
}


/* ---------------- report ---------------- */
out.unshift(`<h2>${fails ? fails + ' FAILURES' : 'all clear'} — ${checks} checks</h2>`);
document.getElementById('out').innerHTML = out.join('');
document.title = fails ? 'FAIL ' + fails : 'PASS ' + checks;
