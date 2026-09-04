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
import { isTarget, markers, nextHop, regionsFor } from './quest.js';
import { SURFACES, sfx } from './audio.js';
import { THEMES, unlock as musicUnlock, setRegion as musicRegion, setMusic as musicSet, status as musicStatus } from './music.js';
import { askOne as U_askOne } from './ui.js';
import {
  S, SLOTS, activeSlot, slots, slotName, renameSlot, useSlot, eraseSlot,
  FILE_KIND, FILE_VERSION, PROFILES_VERSION, exportObject, fileName, checkFile,
  describeFile, importInto, roundTrip, slotProfile, ensureProfiles, deviceId,
  save as saveNow, markEntered, enteredThisSession, clearEntered
} from './state.js';
import { homeHTML } from './title.js';

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

/* ---------------- what the ground sounds like ---------------- */
/* Footsteps are per surface now, which is only world-building if the surface is
   right. A tile nobody mapped falls back to dirt at run time rather than going
   silent, and a wrong footstep is exactly the kind of thing nobody ever files a
   bug about, so the mapping is checked instead of trusted. */
head('footsteps');
{
  const walkable = new Set();
  for (const rows of Object.values(GRIDS)) {
    for (const row of rows) for (const ch of row) if (!isSolidTile(ch)) walkable.add(ch);
  }
  const unmapped = [...walkable].filter(ch => !W.TILE_SURFACE[ch]);
  ok(unmapped.length === 0, 'every tile you can stand on has a footstep of its own',
    unmapped.join(' '));
  const strange = Object.entries(W.TILE_SURFACE).filter(([, v]) => !SURFACES.includes(v));
  ok(strange.length === 0, 'and every one of those names a sound audio.js can make',
    strange.map(([k, v]) => `${k}=${v}`).join(', '));
  note(`surfaces in use: ${[...new Set([...walkable].map(ch => W.TILE_SURFACE[ch]))].sort().join(', ')}`);
}

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
  /* `when` hides an entity until the save says otherwise, and the beach now uses
     it to hand itself over a wave at a time. A simulation that ignored those
     predicates would happily read a page that is not there yet, and would sail
     straight past a circular gate -- a document you cannot see until you dig,
     behind a dig you cannot see until you read it. So every kind is checked,
     not just the residents. */
  const here = e => reachableRegions.has(e.map) && (!e.when || e.when(sim));

  /* Every step points at something with `target`, and the map marks it from
     anywhere in the region. A step that points at an entity you cannot see yet
     is worse than no arrow at all: the game would be telling a kid to go to a
     place that is not there. So as the simulation walks the chain, the step it
     is currently on has its target checked against what is actually visible. */
  const blind = [];
  const checked = new Set();
  function checkTarget() {
    let i = 0;
    while (i < QUEST.length - 1 && QUEST[i].done(sim)) i++;
    const q = QUEST[i];
    if (!q.target || checked.has(q.id)) return;
    checked.add(q.id);
    const seen = ENTITIES.some(e => e.map === q.where && here(e) && isTarget(e, q.target) );
    if (!seen) blind.push(`${q.id} wants ${q.target.kind}${q.target.id ? ' ' + q.target.id : ''} in ${q.where}`);
  }

  let progressed = true, guard = 0;
  while (progressed && guard++ < 40) {
    progressed = false;
    checkTarget();
    // read every document sitting in a reachable region
    for (const e of ENTITIES) {
      if (!here(e)) continue;
      if (e.kind === 'doc' && !sim.flags[e.doc]) { sim.flags[e.doc] = true; progressed = true; }
      if (e.kind === 'dig' && e.gives) sim.items[e.gives] = 1;
      if (e.kind === 'item' && e.gives) sim.items[e.gives] = 2;
    }
    checkTarget();
    // befriend every resident in a reachable region whose gate items are held
    for (const e of ENTITIES) {
      if (e.kind !== 'wild' || !here(e)) continue;
      if (e.needsItem && (sim.items[e.needsItem.key] || 0) < e.needsItem.count) continue;
      if (!sim.team.includes(e.species)) { sim.team.push(e.species); progressed = true; }
    }
    checkTarget();
    // build anything whose jobs are covered
    for (const p of PROJECTS) {
      if (sim.projects[p.id]) continue;
      const site = ENTITIES.find(e => e.kind === 'project' && e.project === p.id);
      if (!site || !here(site)) continue;      // the build site has its own `when`
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

  ok(blind.length === 0, 'no step points at something you cannot see yet', blind.join(' | '));
  note(`targets checked as the chain was walked: ${[...checked].join(', ')}`);
}

/* ---------------- what the step points at ---------------- */
head('where to go next');
{
  const targeted = QUEST.filter(q => q.target);
  ok(targeted.length >= QUEST.length - 1, 'every step but the last says what it is pointing at',
    `${targeted.length} of ${QUEST.length}`);
  for (const q of targeted) {
    const hits = ENTITIES.filter(e => e.map === q.where && isTarget(e, q.target));
    ok(hits.length > 0, `${q.id}: its target is a real thing standing in ${q.where}`,
      `${q.target.kind}${q.target.id ? ' ' + q.target.id : ''}`);
  }
  /* The complaint this was built for: "it is not clear where he should go". So
     stand on the tile a new player actually starts on and ask the map. */
  {
    const fresh = { projects: {}, team: [], flags: {}, items: {}, read: {}, signs: {}, crew: {}, step: 0, worked: {} };
    const lit = markers('beach', fresh, 17, 3, 5);
    const goals = lit.filter(m => m.goal);
    ok(goals.length === 1, 'you land and exactly one thing on the beach is marked',
      lit.map(m => (m.e.doc || m.e.sign || m.e.id) + (m.goal ? ' (goal)' : '')).join(', ') || 'nothing');
    ok(goals.length === 1 && goals[0].e.doc === 'notice', 'and it is the notice the top bar just told you to read',
      goals.length ? String(goals[0].e.doc || goals[0].e.sign) : 'nothing');
    ok(lit.length <= 3, 'and it is not competing with a screenful of others', String(lit.length));
  }

  /* Pointing is allowed. Answering is not: a target may say which post to walk
     to, never which of two holes to dig, because that is the question. */
  const dig = QUEST.find(q => q.id === 'crank');
  ok(dig && dig.target && !dig.target.id, 'the digging step marks both mounds and picks neither',
    JSON.stringify(dig && dig.target));
  ok(ENTITIES.filter(e => e.map === 'beach' && e.kind === 'dig').length === 2,
    'and there really are two of them to choose between');

  /* The beach never leaves its region, so for the first six steps "marked from
     anywhere in the region" is the whole job. Every step after it sends you
     somewhere else, and until the crossings were marked too the map simply went
     blank the moment the journal named a place -- which is the exact moment a
     kid has the least idea what to do. Six regions, ten crossings, and from the
     grove the caves are three of them away.

     So: from every region you could be standing in, every step has to point at
     something. Either its own object, or the way out. */
  const blank = [];
  for (const q of targeted) {
    for (const map of Object.keys(REGIONS)) {
      if (regionsFor(q).includes(map)) continue;
      const hop = nextHop(map, regionsFor(q));
      if (!hop) { blank.push(`${q.id}: no way out of ${map}`); continue; }
      if (hop.map !== map) blank.push(`${q.id}: the hop out of ${map} is not in ${map}`);
      if (!EXITS.includes(hop)) blank.push(`${q.id}: the hop out of ${map} is not a real crossing`);
    }
  }
  ok(blank.length === 0, 'from any region, a step somewhere else points at the way out',
    blank.join(' | '));

  for (const q of targeted) {
    for (const r of regionsFor(q)) ok(!!REGIONS[r], `${q.id}: "${r}" is a real region`);
  }

  /* Pointing at a place is allowed; pointing at an animal is not, because
     working out which animal the page described is the question. Every resident
     step is expected to have nothing marked once you are standing in the right
     region -- that is the design, and it is asserted rather than assumed so that
     "the map is blank here" can never quietly spread to a step that needs one. */
  const wildSteps = targeted.filter(q => q.target.kind === 'wild').map(q => q.id);
  ok(wildSteps.length === 6, 'six steps point at a region and leave the animal to the reader',
    wildSteps.join(', '));
  for (const q of targeted) {
    if (q.target.kind === 'wild') continue;
    const hits = regionsFor(q).flatMap(r => ENTITIES.filter(e => e.map === r && isTarget(e, q.target)));
    ok(hits.length > 0 && hits.every(e => e.kind !== 'wild'),
      `${q.id}: what it marks is a place, not a resident`);
  }

  /* Two things that used to go dark mid-step. markers() reads the live step, so
     these drive it and put it back. */
  const wasStep = S.step;
  const at = id => QUEST.findIndex(q => q.id === id);
  try {
    /* The berry step wants two berries off a bush that records itself as picked
       after the first one. It used to lose its marker halfway through the step
       it belongs to. */
    S.step = at('berries');
    const picked = { projects: { gate: true, bridge: true, boardwalk: true, lantern: true },
                     team: [], flags: { shrine: true, vault: true, 'took:rowan': true },
                     items: { berries: 1 }, read: {}, signs: {}, crew: {}, step: S.step };
    const stillLit = markers('grove', picked, 19, 11, 5).filter(m => m.goal && m.e.id === 'rowan');
    ok(stillLit.length === 1, 'the berry step keeps its marker after the first berry',
      `${stillLit.length} marked`);

    /* And standing in the wrong region gets you a crossing rather than nothing. */
    S.step = at('vault');
    const lost = { projects: {}, team: [], flags: {}, items: {}, read: {}, signs: {}, crew: {}, step: S.step };
    const way = markers('grove', lost, 17, 12, 5).filter(m => m.route);
    ok(way.length === 1 && way[0].goal, 'told to go to the caves from the grove, the way out is marked',
      way.length ? `${way[0].e.x},${way[0].e.y} -> ${way[0].e.to}` : 'nothing marked');

    /* ...and standing in the right one does not point you back out of it. */
    S.step = at('cairns');
    const home = markers('meadow', lost, 17, 12, 5);
    ok(home.filter(m => m.route).length === 0, 'and once you are there it stops pointing at the door');

    /* The step that sends you to find two of the four animals in the meadow used
       to leave the map with nothing on it at all. The residents get the faint
       marker now -- there is somebody here, and here is how many -- while the
       green one still refuses to say which. */
    S.step = at('helpers2');
    const hunting = { projects: { gate: true }, team: ['pidgey', 'psyduck'],
                      flags: { notice: true, tidechart: true, fieldguide: true, cairns: true },
                      items: { crank: 1 }, read: {}, signs: {}, crew: {}, step: S.step };
    const near = markers('meadow', hunting, 22, 17, 5);
    const faintWild = near.filter(m => !m.goal && m.e.kind === 'wild');
    ok(faintWild.length >= 2, 'looking for the two helpers, the meadow animals are marked faintly',
      faintWild.map(m => m.e.species).join(', ') || 'nothing');
    ok(near.every(m => !(m.goal && m.e.kind === 'wild')), 'and not one of them is marked as the answer',
      near.filter(m => m.goal).map(m => m.e.species || m.e.id).join(', ') || 'none');

    /* An animal already on your team is not somebody left to meet. */
    const met = { ...hunting, team: ['pidgey', 'psyduck', 'machop', 'chikorita'] };
    const after = markers('meadow', met, 22, 17, 5).filter(m => m.e.kind === 'wild');
    ok(after.every(m => !['machop', 'chikorita'].includes(m.e.species)),
      'a resident you have befriended stops being marked', after.map(m => m.e.species).join(', ') || 'none');
  } finally {
    S.step = wasStep;
  }
}

/* ---------------- what the first ten minutes look like ---------------- */
/* The beach is the tutorial and it is where a kid decides whether this game is
   work. It used to hand over fifteen things at once, about three thousand words
   and twenty-nine questions, every one of them with a marker bouncing over it.
   Mine took one look and said there was too much to read, and he was right.

   These are budgets, not descriptions. They fail if the opening grows back. */
head('the opening');
{
  const fresh = { projects: {}, team: [], flags: {}, items: {}, read: {}, signs: {}, crew: {}, step: 0, worked: {} };
  const wordsOf = s => grade(s).words;

  const atLanding = W.visibleEntities('beach', fresh);
  ok(atLanding.length <= 3, 'you land in front of three things at most, not fifteen',
    `${atLanding.length}: ${atLanding.map(e => e.doc || e.sign || e.species || e.project || e.id).join(', ')}`);

  const landingWords = atLanding.reduce((n, e) => {
    if (e.kind === 'doc') return n + DOCS[e.doc].text.reduce((m, x) => m + wordsOf(x), 0);
    if (e.kind === 'sign') return n + SIGNS[e.sign].text.reduce((m, x) => m + wordsOf(x), 0);
    return n;
  }, 0);
  ok(landingWords <= 400, 'and under 400 words of reading in front of you', `${landingWords} words`);

  /* Everything the chain actually requires before the first gate opens. Signs
     are not counted: they are the optional layer, and the prompt now says so. */
  const beachDocs = ENTITIES.filter(e => e.kind === 'doc' && e.map === 'beach').map(e => DOCS[e.doc]);
  const askedByDocs = beachDocs.reduce((n, d) => n + Math.min(d.ask || d.questions.length, d.questions.length), 0);
  /* The residents standing on the beach at the moment the gate becomes
     buildable: everything read, the handle dug, nothing built yet. A `when`
     predicate reads a whole save, so it gets a whole save. */
  const beforeGate = {
    projects: {}, team: [], items: { crank: 1 }, read: {}, signs: {}, crew: {}, step: 0,
    flags: { notice: true, tidechart: true, fieldguide: true }
  };
  const beachWilds = W.visibleEntities('beach', beforeGate).filter(e => e.kind === 'wild');
  const askedByAnimals = beachWilds.reduce((n, e) => n + (e.need || 3), 0);
  const mustAsk = askedByDocs + askedByAnimals;
  ok(mustAsk <= 14, 'the opening asks at most 14 questions before the first gate',
    `${askedByDocs} from documents, ${askedByAnimals} from animals`);

  const beachWords = beachDocs.reduce((n, d) => n + d.text.reduce((m, x) => m + wordsOf(x), 0), 0)
    + beachWilds.reduce((n, e) => n + BY_ID[e.species].passage.text.reduce((m, x) => m + wordsOf(x), 0), 0);
  ok(beachWords <= 1800, 'and under 1,800 words of it', `${beachWords} words`);

  /* Every wave has to be openable by the wave before it, or the beach is a
     locked room. The solvability simulation proves the whole island, this
     proves the beach in particular, from nothing. */
  const seen = new Set(atLanding.map(e => e.x + ',' + e.y));
  const sim = { projects: {}, team: [], flags: {}, items: {}, read: {}, signs: {}, crew: {}, step: 0 };
  for (let pass = 0; pass < 8; pass++) {
    for (const e of W.visibleEntities('beach', sim)) {
      seen.add(e.x + ',' + e.y);
      if (e.kind === 'doc') sim.flags[e.doc] = true;
      if (e.kind === 'dig' && e.gives) sim.items[e.gives] = 1;
      if (e.kind === 'wild') { if (!sim.team.includes(e.species)) sim.team.push(e.species); }
      if (e.kind === 'project') sim.projects[e.project] = true;
    }
  }
  const all = ENTITIES.filter(e => e.map === 'beach');
  const stuck = all.filter(e => !seen.has(e.x + ',' + e.y));
  ok(stuck.length === 0, 'and every wave of the beach opens from the one before it',
    stuck.map(e => e.doc || e.sign || e.species || e.project || e.id).join(', '));
  note(`landing: ${atLanding.length} things, ${landingWords} words. Whole beach before the gate: ${mustAsk} questions, ${beachWords} words.`);
}

/* ---------------- and the same for every other region ---------------- */
/* The beach was handed over a wave at a time and the other five regions were
   not, which is worse than doing it nowhere: the tutorial teaches a kid that a
   place gives him one thing at a time, and then Meadow Hollow opens with nine
   things standing in it and four animals in the grass. That is the version that
   got reported, in those words -- the first level is clear and the later ones
   are not.

   So the shape is asserted everywhere now. You walk in on the region's page and
   the sign nearest the way in, reading that page brings out what it describes,
   and what nobody wrote about arrives once the crossing is standing. This walks
   the real chain and looks at each region at the exact moment it opens, because
   that is the only state that matters here and it is twenty minutes of playing
   away from being visible in a screenshot. */
head('every region arrives in waves');
{
  const sim = { projects: {}, team: [], flags: {}, items: {}, read: {}, signs: {}, crew: {}, step: 0 };
  const reach = new Set(['beach']);
  const landing = { beach: W.visibleEntities('beach', sim) };
  const ever = new Set();
  const nameOf = e => e.doc || e.sign || e.species || e.project || e.id;
  const key = e => `${e.map} ${e.x},${e.y}`;
  const shown = (e, where) => where.has(e.map) && (!e.when || e.when(sim));

  for (let pass = 0; pass < 24; pass++) {
    for (const e of ENTITIES) if (shown(e, reach)) ever.add(key(e));
    for (const e of ENTITIES) {
      if (!shown(e, reach)) continue;
      if (e.kind === 'doc') sim.flags[e.doc] = true;
      if (e.kind === 'dig' && e.gives) sim.items[e.gives] = 1;
      if (e.kind === 'item' && e.gives) sim.items[e.gives] = 2;
    }
    for (const e of ENTITIES) {
      if (e.kind !== 'wild' || !shown(e, reach)) continue;
      if (e.needsItem && (sim.items[e.needsItem.key] || 0) < e.needsItem.count) continue;
      if (!sim.team.includes(e.species)) sim.team.push(e.species);
    }
    for (const p of PROJECTS) {
      if (sim.projects[p.id]) continue;
      const site = ENTITIES.find(e => e.kind === 'project' && e.project === p.id);
      if (!site || !shown(site, reach)) continue;
      if (p.learn && !sim.flags[p.learn]) continue;
      if (p.needsItem && (sim.items[p.needsItem.key] || 0) < p.needsItem.count) continue;
      const jobs = sim.team.map(id => BY_ID[id].job);
      if (!p.needs.every(j => jobs.includes(j))) continue;
      sim.projects[p.id] = true;
      const opened = p.opens && Object.keys(REGIONS).find(k => REGIONS[k].name === p.opens);
      if (opened && !reach.has(opened)) {
        reach.add(opened);
        landing[opened] = W.visibleEntities(opened, sim);   // what is there as you walk in
      }
    }
  }

  ok(reach.size === Object.keys(REGIONS).length, 'the walk gets into every region',
    [...reach].join(', '));

  for (const r of Object.keys(REGIONS)) {
    const at = landing[r] || [];
    const words = at.reduce((n, e) => {
      if (e.kind === 'doc') return n + DOCS[e.doc].text.reduce((m, x) => m + grade(x).words, 0);
      if (e.kind === 'sign') return n + SIGNS[e.sign].text.reduce((m, x) => m + grade(x).words, 0);
      return n;
    }, 0);
    const wilds = at.filter(e => e.kind === 'wild');
    ok(at.length > 0 && at.length <= 3, `${REGIONS[r].name}: three things at the door, not nine`,
      `${at.length}: ${at.map(nameOf).join(', ')}`);
    ok(at.some(e => e.kind === 'doc'), `${REGIONS[r].name}: and one of them is the page the place is about`,
      at.map(e => e.kind).join(', ') || 'nothing');
    ok(words <= 400, `${REGIONS[r].name}: under 400 words in front of you`, `${words} words`);
    /* The complaint was about the animals specifically. One at the door is a
       resident who is part of the scenery -- the sleeper in the caves is the
       blocked gap -- and four is a field of markers. */
    ok(wilds.length <= 1, `${REGIONS[r].name}: not a field of animals waiting at the door`,
      wilds.map(e => e.species).join(', ') || 'none');
    note(`${REGIONS[r].name}: ${at.length} at the door (${at.map(nameOf).join(', ') || 'nothing'}), ${words} words`);
  }

  /* The other half of a wave: something has to open it. A gate whose predicate
     never comes true is an entity nobody will ever see, and the whole point of
     staggering is lost the moment it silently deletes a page. */
  const orphans = ENTITIES.filter(e => !ever.has(key(e)));
  ok(orphans.length === 0, 'and every wave everywhere opens from the one before it',
    orphans.map(e => `${e.map} ${nameOf(e)}`).join(', '));
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
for (const [id, s] of Object.entries(SIGNS)) {
  s.text.forEach(l => scan('sign ' + id, l));
  if (s.q) { scan('sign ' + id, s.q.q); s.q.choices.forEach(c => scan('sign ' + id, c)); scan('sign ' + id, s.q.why); }
}
ok(missing.size === 0, 'every {braced} word has a definition', [...missing].join(', '));
const unused = Object.keys(GLOSSARY).filter(w => !used.has(w));
ok(unused.length === 0, 'no unused glossary entries', unused.join(', '));

/* The three rules the glossary is written to, which were a comment at the top
   of the file and are now checked. The one that matters is the second: a
   definition written in words harder than the word it defines is a dead end for
   the reader who needed it, and it is very easy to write one by accident. */
{
  const heads = Object.keys(GLOSSARY);
  const circular = [];
  const wordy = [];
  for (const [w, d] of Object.entries(GLOSSARY)) {
    const other = heads.filter(h => h !== w && new RegExp(`\\b${h}\\b`, 'i').test(d));
    if (other.length) circular.push(`${w} uses ${other.join('/')}`);
    if (grade(d).words > 16) wordy.push(`${w} (${grade(d).words} words)`);
  }
  ok(circular.length === 0, 'no definition leans on another word that also needed defining',
    circular.join(', '));
  ok(wordy.length === 0, 'every definition fits in 16 words', wordy.join(', '));
  const dg = grade(Object.values(GLOSSARY).join(' '));
  ok(dg.fk <= TARGET, `the definitions themselves read at ${dg.fk.toFixed(1)}, at or under ${TARGET.toFixed(1)}`);
}

/* A passage with nothing tappable in it is the state this started from: a kid
   hits "intake" on the meadow sign, has nowhere to go, and stops. Every page in
   the game now offers at least one word, and the count is a note rather than a
   ceiling because there is no such thing as too many definitions -- only
   definitions on words that did not need one. */
{
  const bare = [];
  let glossed = 0;
  const check = (what, text) => {
    const n = (text.match(/\{/g) || []).length;
    glossed += n;
    if (!n) bare.push(what);
  };
  for (const [id, d] of Object.entries(DOCS)) check('doc ' + id, d.text.join(' '));
  for (const [id, s2] of Object.entries(SIGNS)) check('sign ' + id, s2.text.join(' '));
  for (const sp of SPECIES) check(sp.id, sp.passage.text.join(' '));
  ok(bare.length === 0, 'every passage has at least one word you can tap for a meaning',
    bare.join(', '));
  note(`${Object.keys(GLOSSARY).length} words defined, tappable in ${glossed} places across the island`);
}

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
/* Three directions, and each one needs its two step frames or the walk goes
   back to a sprite sliding along the ground. main.js builds the name by
   appending _a and _b, so a missing one is a blank player rather than an error. */
for (const d of ['player_down', 'player_up', 'player_side']) {
  ok(!!ART[d], `player art "${d}" exists`);
  ok(!!ART[d + '_a'] && !!ART[d + '_b'], `${d}: has both walking frames`);
  const frames = [ART[d], ART[d + '_a'], ART[d + '_b']].filter(Boolean).map(r => r.join('\n'));
  ok(new Set(frames).size === frames.length, `${d}: the three frames are actually different`);
}

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
ok(mine.version === FILE_VERSION, 'an export carries a version number', String(mine.version));
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
/* The description is written before anyone has agreed to load the file, and for
   a bad file it is part of how you find out it is bad -- so every one of these
   has to come back as a line rather than an exception. */
{
  const shapes = [
    [null, 'nothing at all'],
    [undefined, 'nothing passed at all'],
    ['a saved game, honest', 'a bare string'],
    [[], 'a list'],
    [{}, 'an empty object'],
    [{ save: null }, 'no island inside'],
    [{ save: [] }, 'an island that is a list'],
    [{ player: 42, save: { step: 'three', team: 'everyone' } }, 'every field the wrong type'],
    [{ player: '   ', exported: 7, save: {} }, 'a blank name and a numeric date'],
    [{ player: '{marsh}', save: { step: -4 } }, 'braces in the name and a step before the start']
  ];
  for (const [d, what] of shapes) {
    let line = null, threw = null;
    try { line = describeFile(d); } catch (e) { threw = e.message; }
    ok(threw === null && typeof line === 'string' && /step \d+, \d+ animals?, saved /.test(line)
      && !line.includes('undefined') && !line.includes('NaN') && !/[{}]/.test(line)
      && line.split('\n').length === 1,
      `describes ${what} without throwing`, threw || String(line));
  }
  const long = describeFile({ player: 'Bartholomew Fitzgerald The Third Of That Name', save: {} });
  ok(long.length < 80, 'a very long name cannot run the description off the line', long);
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
    // the page reads three keys before any module loads; none may be one state.js
    // has since renamed
    const stray = page.filter(k => !mod.includes(k));
    ok(stray.length === 0, 'index.html reads no storage key state.js has stopped writing', stray.join(' '));
    ok(page.includes('vi.go') && mod.includes('vi.go'),
      'both agree on the key that decides whether the home page shows');
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

      /* --- profiles on disk --- */

      /* The v1 shape was a bare name per slot. Anyone playing before profiles
         existed has one of these, and must come out the other side with their
         name, their game, and a new id that then never moves again. */
      {
        const p1 = { kind: FILE_KIND, version: 1, exported: new Date().toISOString(),
          player: 'Ada', save: Object.assign({}, mine.save, { step: 5, map: 'grove' }) };
        ok(importInto(p1, '2') === null, 'a v1 file with no profile still loads');
        localStorage.setItem('vi.slots', JSON.stringify({ '2': 'Ada' }));   // back to the v1 shape
        const p = ensureProfiles();
        ok(p.version === PROFILES_VERSION, 'the stored profiles are upgraded in place', String(p.version));
        ok(slotName('2') === 'Ada', 'an island named before profiles existed keeps its name', slotName('2'));
        const id = slotProfile('2') && slotProfile('2').id;
        ok(typeof id === 'string' && id.startsWith('vi_'), 'and is given an id', String(id));
        ensureProfiles();
        ok(slotProfile('2').id === id, 'the id is minted once, not once per read', slotProfile('2').id);
        renameSlot('2', 'Bea');
        ok(slotProfile('2').id === id && slotName('2') === 'Bea', 'renaming does not change who you are');

        eraseSlot('2');
        ok(slotProfile('2') === null, 'erasing an island takes its identity with it');
        renameSlot('2', 'Cal');
        ok(slotProfile('2').id !== id, 'a different kid in the same slot is a different person',
          `${id} -> ${slotProfile('2').id}`);
      }

      /* --- what a file carries, and what happens to it --- */
      {
        const out = exportObject('2');
        ok(out.version === FILE_VERSION, 'a file says which format it is in', String(out.version));
        ok(out.profile && out.profile.id === slotProfile('2').id, 'a file carries the island it came from',
          JSON.stringify(out.profile));
        ok(out.device === deviceId(), 'and the device it was written on', String(out.device));
        ok(checkFile(out) === null, 'and is still a file this game will take', checkFile(out) || '');

        const newer = Object.assign({}, out, { version: FILE_VERSION + 1 });
        ok(typeof checkFile(newer) === 'string', 'a file from a newer game is turned away rather than half read',
          String(checkFile(newer)));

        /* Carried to a device that has never seen it: the island keeps its
           identity, which is the whole point -- an account looking at both
           devices later sees one island, not two. */
        const away = Object.assign({}, out, { profile: Object.assign({}, out.profile, { id: 'vi_fromsomewhereelse' }) });
        ok(importInto(away, '3') === null, 'a file from another device loads');
        ok(slotProfile('3').id === 'vi_fromsomewhereelse',
          'and the same island stays the same island', slotProfile('3').id);

        /* But the original is still sitting in slot 2 here, so loading it a
           second time alongside itself is a copy, and a copy is its own island. */
        ok(importInto(out, '3') === null, 'the island already open here loads again elsewhere');
        ok(slotProfile('3').id !== out.profile.id && slotProfile('2').id === out.profile.id,
          'a second copy on one device gets an identity of its own',
          `${slotProfile('3').id} vs ${slotProfile('2').id}`);

        // restoring your own island from your own backup is not a copy
        ok(importInto(out, '2') === null, 'a backup loads back over the island it came from');
        ok(slotProfile('2').id === out.profile.id, 'and that is still the same island',
          slotProfile('2').id);

        const v1 = { kind: FILE_KIND, version: 1, exported: out.exported, player: 'Old Ada', save: out.save };
        ok(importInto(v1, '3') === null, 'a v1 file loads too');
        ok(slotName('3') === 'Old Ada', 'and its name is taken from where v1 kept it', slotName('3'));
        ok(slotProfile('3').id.startsWith('vi_'), 'and it is given an id on arrival', slotProfile('3').id);
      }

      /* --- rev --- */
      {
        const before = S.rev;
        saveNow();
        ok(S.rev === before + 1, 'every write counts up, so two copies can be compared', `${before} -> ${S.rev}`);
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

/* ---------------- coming back to the home page ---------------- */
/* The home page shows every visit, but not twice in a row when switching players
   reloads the page. sessionStorage is what remembers that, so it is borrowed and
   put back the same way localStorage is. */
head('the home page mark');
{
  let before = null, had = false;
  try {
    had = sessionStorage.getItem('vi.go') !== null;
    before = sessionStorage.getItem('vi.go');
  } catch (e) { before = undefined; }

  if (before === undefined) {
    note('sessionStorage is not available here, so the home page mark was not exercised');
  } else {
    try {
      clearEntered();
      ok(enteredThisSession() === false, 'a fresh visit has not chosen anybody yet');
      markEntered(activeSlot());
      ok(enteredThisSession() === true, 'choosing a player is remembered across the reload it causes');
      markEntered(SLOTS.find(s => s !== activeSlot()));
      ok(enteredThisSession() === false, 'a mark for a different island does not count');
      clearEntered();
      ok(enteredThisSession() === false, 'asking for the home page again forgets it');
    } finally {
      try {
        if (had) sessionStorage.setItem('vi.go', before);
        else sessionStorage.removeItem('vi.go');
      } catch (e) { /* nothing better to do */ }
    }
  }
}

/* ---------------- profiles ---------------- */
/* A slot is a place; a profile is a person. The id is the part that has to
   outlive renaming, being carried to another device, and one day being handed to
   an account, so it is the part worth asserting hardest. */
head('profiles');
{
  const list = slots();
  ok(list.every(s => !s.used || (typeof s.id === 'string' && s.id.startsWith('vi_'))),
    'every island that exists has an id', JSON.stringify(list.map(s => [s.used, s.id])));
  const ids = list.filter(s => s.id).map(s => s.id);
  ok(new Set(ids).size === ids.length, 'no two islands share an id', ids.join(' '));
  ok(typeof deviceId() === 'string' && deviceId() === deviceId(), 'the device id is stable', deviceId());
}

/* ---------------- the home page ---------------- */
/* homeHTML is a string builder on purpose, so what the page will say can be
   read here without a page to put it on. */
head('the home page');
{
  const row = (slot, over) => Object.assign({
    slot, id: 'vi_' + slot, name: 'Player ' + slot, named: false, active: false, used: false,
    step: 0, team: 0, map: null, rev: 0, started: null, createdAt: null, updatedAt: null, finished: false
  }, over);

  const two = [
    row('1', { name: 'Ada', named: true, used: true, active: true, step: 3, team: 2, map: 'marsh', updatedAt: '2026-08-31T09:00:00.000Z' }),
    row('2', { name: 'Sam', named: true, used: true, step: 11, team: 5, map: 'ridge', updatedAt: '2026-08-24T09:00:00.000Z' }),
    row('3', {})
  ];
  const html = homeHTML(two);
  ok(html.includes('Ada') && html.includes('Sam'), 'the home page names both players');
  ok(html.includes('step 4 of ' + QUEST.length) && html.includes('step 12 of ' + QUEST.length),
    'and says how far each one has got');
  ok((html.match(/Keep going/g) || []).length === 1, 'exactly one card offers to keep going');
  ok(html.indexOf('Ada') < html.indexOf('Sam'), 'the island you were last on comes first');
  ok(html.includes('Reed Marsh') && !html.includes('Ash Ridge'),
    'and it is the only one that says where you were');
  ok(html.includes('animals · played') && !html.includes('· </div>'),
    'when it was played sits on the line above, with nothing left dangling');
  ok(html.includes('data-new="3"'), 'a free slot offers a new player');
  ok(html.includes('data-play="1"') && html.includes('data-play="2"'), 'both islands can be played');
  ok(html.includes('data-rename="1"'), 'and renamed');

  // the lead card is the active one even when another was played more recently
  const stale = [
    row('1', { name: 'Ada', named: true, used: true, active: true, updatedAt: '2026-01-01T00:00:00.000Z' }),
    row('2', { name: 'Sam', named: true, used: true, updatedAt: '2026-08-30T00:00:00.000Z' }),
    row('3', {})
  ];
  ok(homeHTML(stale).indexOf('Ada') < homeHTML(stale).indexOf('Sam'),
    'the island already loaded stays the one offered first');

  // nothing played yet
  const empty = [row('1', {}), row('2', {}), row('3', {})];
  const first = homeHTML(empty);
  ok(first.includes('Who is playing?'), 'a brand new device asks who is playing');
  ok(!first.includes('Keep going'), 'and has nothing to keep going with');
  ok((first.match(/data-new=/g) || []).length === 1, 'and offers exactly one new island, not three');

  // full house
  const full = [
    row('1', { used: true, name: 'Ada', named: true }),
    row('2', { used: true, name: 'Sam', named: true }),
    row('3', { used: true, name: 'Kit', named: true })
  ];
  const packed = homeHTML(full);
  ok(!packed.includes('data-new='), 'three islands is the most it offers');
  ok(packed.includes('erase one from'), 'and it says how to make room');

  // named but not yet saved: still theirs
  const justNamed = [row('1', { name: 'Ada', named: true, used: false }), row('2', {}), row('3', {})];
  const jn = homeHTML(justNamed);
  ok(jn.includes('Ada') && jn.includes('data-play="1"'),
    'an island keeps its name from the moment it is typed, before the first save');
  ok(jn.includes('data-new="2"') && !jn.includes('data-new="1"'),
    'and the slot it is in is not offered to the next player');

  // a name is text, not markup
  const nasty = [row('1', { used: true, named: true, name: '<img src=x>' }), row('2', {}), row('3', {})];
  const escaped = homeHTML(nasty);
  ok(!escaped.includes('<img src=x>') && escaped.includes('&lt;img'),
    'a name is escaped before it is drawn', escaped.slice(escaped.indexOf('home-who'), escaped.indexOf('home-who') + 90));

  for (const l of [two, stale, empty, full, nasty]) {
    const h = homeHTML(l);
    ok(!h.includes('undefined') && !h.includes('NaN') && !h.includes('null'),
      'the page never draws a hole where a field was missing');
  }
}

/* ---------------- the signs and their arithmetic ---------------- */
/* Signs carry the island's numbers. The rule that keeps them honest is the one
   below: every number a question needs has to be printed on the sign the reader
   is standing in front of, so the problem cannot be solved by pattern-matching
   two digits and guessing an operation -- you have to read the board. The two
   recall questions are the deliberate exception, and they are checked harder:
   the number lives on a sign in a region you have already walked through. */
head('sign arithmetic');

const REGION_ORDER = ['beach', 'meadow', 'grove', 'marsh', 'caverns', 'ridge'];
const signMap = {};
for (const e of ENTITIES) if (e.kind === 'sign') signMap[e.sign] = e.map;

const digitsIn = s => (String(s).match(/\d+/g) || []);

const signList = Object.entries(SIGNS);
const withQ = signList.filter(([, s]) => s.q);
ok(signList.length === withQ.length, 'every sign asks something', `${withQ.length} of ${signList.length}`);

for (const [id, s] of signList) {
  ok(Array.isArray(s.text) && s.text.length >= 2, `${id}: has something to read`, String(s.text && s.text.length));
  const long = s.text.map((x, i) => ({ i, n: grade(x).words })).filter(x => x.n > MAX_PAGE_WORDS);
  ok(long.length === 0, `${id}: no page over ${MAX_PAGE_WORDS} words`, long.map(x => `page ${x.i + 1} = ${x.n}`).join(', '));
  const g = grade(s.text.join(' '));
  ok(g.fk <= TARGET, `${id}: reads at ${g.fk.toFixed(1)}, at or under ${TARGET.toFixed(1)}`, `${g.words} words`);

  const q = s.q;
  if (!q) continue;
  ok(/^[34]\.[A-Z]+\.[A-Z]\.\d+$/.test(q.code || ''), `${id}: names the standard it answers to`, String(q.code));
  ok(typeof q.q === 'string' && q.q.length > 8, `${id}: has a question`);
  ok(Array.isArray(q.choices) && q.choices.length >= 3, `${id}: at least three choices`, String(q.choices && q.choices.length));
  ok(new Set(q.choices).size === q.choices.length, `${id}: no two choices are the same`, q.choices.join(' | '));
  ok(Number.isInteger(q.answer) && q.answer >= 0 && q.answer < q.choices.length,
    `${id}: the answer is one of the choices`, String(q.answer));
  ok(typeof q.why === 'string' && q.why.length > 20, `${id}: explains itself afterwards`);
  ok(grade(q.q).words <= 18, `${id}: the question fits in 18 words`, String(grade(q.q).words));
  const wide = q.choices.filter(c => grade(c).words > 14);
  ok(wide.length === 0, `${id}: no choice runs over 14 words`, wide.join(' | '));
  ok(grade(q.q + ' ' + q.choices.join('. ') + ' ' + q.why).fk <= TARGET,
    `${id}: the question reads at or under ${TARGET.toFixed(1)}`,
    grade(q.q + ' ' + q.choices.join('. ') + ' ' + q.why).fk.toFixed(1));
  ok(!q.gives || ['berries', 'crank'].includes(s.gives), `${id}: pays out something the game knows`, String(s.gives));

  /* the rule */
  const onSign = digitsIn(s.text.join(' '));
  const source = q.from ? SIGNS[q.from] : null;
  const pool = source ? onSign.concat(digitsIn(source.text.join(' '))) : onSign;
  const missing = digitsIn(q.q).filter(d => !pool.includes(d));
  ok(missing.length === 0,
    `${id}: every number the question uses is printed where the reader can find it`,
    missing.join(', '));

  if (q.from) {
    ok(!!source, `${id}: the sign it remembers back to exists`, String(q.from));
    if (source) {
      const here = REGION_ORDER.indexOf(signMap[id]);
      const there = REGION_ORDER.indexOf(signMap[q.from]);
      ok(there >= 0 && here >= 0 && there < here,
        `${id}: remembers back to ${q.from}, which is a region you have already walked`,
        `${signMap[q.from]} (${there}) then ${signMap[id]} (${here})`);
      ok(digitsIn(source.text.join(' ')).length > 0,
        `${id}: and that sign actually prints a number`, source.text.join(' '));
      ok(q.why.toLowerCase().includes(signMap[q.from]) || /said|sign|wall|card/i.test(q.why),
        `${id}: the explanation says where the number came from`, q.why);
    }
  }
}

/* Two-step word problems are the one grade 3 standard that needs a story, which
   is why the drill worlds in this repo have never covered it. */
{
  const codes = withQ.map(([, s]) => s.q.code);
  const recall = withQ.filter(([, s]) => s.q.from);
  ok(codes.filter(c => c === '3.OA.D.8').length >= 3, 'the island carries its share of two-step word problems',
    `${codes.filter(c => c === '3.OA.D.8').length} of ${codes.length}`);
  ok(recall.length === 2, 'exactly two questions ask you to remember a number', recall.map(r => r[0]).join(', '));
  note(`standards on the signs: ${[...new Set(codes)].sort().join(', ')}`);
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
  /* main.js reads this field to decide whether the soundtrack really started or
     came up blocked, and retries on the next tap if it did. A rename here would
     silently turn that retry into "never". */
  ok(['running', 'suspended', 'closed', 'interrupted', 'none'].includes(st.contextState),
    'status() reports an audio context state main.js can act on', String(st.contextState));
  // a suspended context has a frozen clock, so only assert progress if it is live
  if (st.contextState === 'running') {
    ok(st.steps > 0, 'the scheduler queued notes', `${st.steps} steps`);
  } else {
    note(`audio context is "${st.contextState}" here, so note timing was not exercised`);
  }
  /* Every footstep, actually played. These are six different code paths through
     the little synth and the only place they run is a keypress, so a typo in one
     of them would ship as "the dock is silent" and nobody would ever say so. */
  let stepThrew = '';
  try {
    for (const surface of SURFACES) { sfx.step(surface, 0); sfx.step(surface, 1); }
    sfx.step('nothing-like-this', 0);
  } catch (e) { stepThrew = e.message; }
  ok(!stepThrew, 'every surface can be walked on without throwing, unknown ones included',
    stepThrew || SURFACES.join(', '));

  musicSet(false);   // do not leave a dev page humming
  ok(true, 'soundtrack stopped cleanly after the check');
  note('loudness is measured by hand with renderOne() in js/music.js -- see the comment there for why it is not automated');
}


/* ---------------- report ---------------- */
out.unshift(`<h2>${fails ? fails + ' FAILURES' : 'all clear'} — ${checks} checks</h2>`);
document.getElementById('out').innerHTML = out.join('');
document.title = fails ? 'FAIL ' + fails : 'PASS ' + checks;
