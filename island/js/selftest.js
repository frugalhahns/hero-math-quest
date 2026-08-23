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
import { askOne as U_askOne } from './ui.js';

const out = [];
let fails = 0;
let checks = 0;

function ok(cond, label, detail = '') {
  checks++;
  if (!cond) fails++;
  out.push(`<div class="${cond ? 'ok' : 'bad'}">${cond ? 'PASS' : 'FAIL'}  ${label}${detail ? '  — ' + detail : ''}</div>`);
}
function head(t) { out.push(`<h2>${t}</h2>`); }
function note(t) { out.push(`<div>      ${t}</div>`); }

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
  if (e.kind === 'doc') ok(!!DOCS[e.doc], `${at}: doc "${e.doc}" exists`);
  if (e.kind === 'sign') ok(!!SIGNS[e.sign], `${at}: sign "${e.sign}" exists`);
  if (e.kind === 'wild') ok(!!BY_ID[e.species], `${at}: species "${e.species}" exists`);
  if (e.kind === 'project') ok(PROJECTS.some(p => p.id === e.project), `${at}: project "${e.project}" exists`);
}

/* every resident and every document must be somewhere on the island */
head('coverage');
for (const sp of SPECIES) {
  ok(ENTITIES.some(e => e.kind === 'wild' && e.species === sp.id), `${sp.name} is placed on a map`);
  ok(!!ART[sp.id], `${sp.name} has sprite art`);
}
for (const id of Object.keys(DOCS)) {
  ok(ENTITIES.some(e => e.kind === 'doc' && e.doc === id), `document "${id}" is placed on a map`);
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

/* ---------------- report ---------------- */
out.unshift(`<h2>${fails ? fails + ' FAILURES' : 'all clear'} — ${checks} checks</h2>`);
document.getElementById('out').innerHTML = out.join('');
document.title = fails ? 'FAIL ' + fails : 'PASS ' + checks;
