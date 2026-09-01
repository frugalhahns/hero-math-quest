/* The trip tracker. The current step is the only nudge the game ever gives, and
   it is deliberately worded as a reminder of what you read rather than as a
   direction: "the chart says where the handle is", never "go to 5,18". */

import { S, save } from './state.js';
import { QUEST } from './content/quests.js';
import { REGIONS, EXITS } from './content/entities.js';
import { visibleEntities } from './world.js';
import { toast } from './ui.js';
import { sfx } from './audio.js';

export function step() {
  return QUEST[Math.min(S.step, QUEST.length - 1)];
}

export function stepIndex(id) {
  return QUEST.findIndex(q => q.id === id);
}

/* Where a step can be finished. Almost always the single region it names; the
   underground pair is the exception, because the light carrier is in the marsh
   and the sparker is back in the meadow, and a step that spans two regions must
   not point you home the moment you go and get the second half of it. */
export function regionsFor(q = step()) {
  return q.regions || [q.where];
}

/* Walk the chain forward past every step whose condition is now met. */
export function advance() {
  let moved = false;
  while (S.step < QUEST.length - 1 && QUEST[S.step].done(S)) {
    S.step++;
    moved = true;
  }
  if (moved) {
    save();
    sfx.unlock();
    toast('New in your journal: ' + step().objective, 4200);
  }
  return moved;
}

export function progress() {
  return { done: S.step, total: QUEST.length - 1 };
}

/* The two lines in the top bar. */
/* Does this entity satisfy the current step's `target`? Kind always, id only
   when the step names one -- "find two helpers" wants any resident in the
   region, and the crank step wants both mounds because choosing between them is
   the question. */
export function isTarget(e, target) {
  if (!target || !e || e.kind !== target.kind) return false;
  if (!target.id) return true;
  const id = e.doc || e.species || e.project || e.sign || e.id;
  return id === target.id;
}

/* Has this thing never been looked at? The faint markers use it, so the map
   shows what is left to find and then quietly stops nagging once it is done. */
export function unexamined(e, save) {
  if (e.kind === 'doc') return !save.flags[e.doc];
  if (e.kind === 'sign') return !save.signs[e.sign];
  if (e.kind === 'dig') return !save.flags['dug:' + e.id];
  if (e.kind === 'item') return !save.flags['took:' + e.id];
  if (e.kind === 'project') return !save.projects[e.project];
  if (e.kind === 'rocket') return !save.flags[e.doc];
  return false;   // the animals are their own signpost, they do not need one
}

/* Is this the thing the current step is about, and is pointing at it allowed?
   Two things never qualify, and both of them are the rule about pointing rather
   than answering:

     residents -- which animal the page described is the whole question, and a
       green chevron over the right one hands it over. The step still points at
       the *region*; it will never point at the animal.
     a hole you have already dug -- the choice between the two mounds has been
       made, and a marker left up over the answered one is noise.

   Everything else is a place, and finding a place is hunting rather than
   comprehension. Note this deliberately does NOT ask `unexamined`: the berry
   step needs two berries off a bush that records itself as picked after the
   first, and the marker has to survive that. */
function pointable(e, target, save) {
  if (!isTarget(e, target)) return false;
  if (e.kind === 'wild') return false;
  if (e.kind === 'dig') return !save.flags['dug:' + e.id];
  return true;
}

/* The crossing that takes you one hop closer to any of `goals`. Six regions in
   a line and a fork: from the grove, "go to the Tidepool Caves" is three
   crossings, and none of them are visible from where you are standing. Returns
   the EXITS entry to walk onto, or null if you are already there or there is no
   way through. */
export function nextHop(map, goals) {
  if (goals.includes(map)) return null;
  const first = { [map]: null };          // map -> the first exit on the path to it
  const queue = [map];
  const seen = new Set([map]);
  while (queue.length) {
    const cur = queue.shift();
    for (const x of EXITS) {
      if (x.map !== cur || seen.has(x.to)) continue;
      seen.add(x.to);
      first[x.to] = first[cur] || x;
      if (goals.includes(x.to)) return first[x.to];
      queue.push(x.to);
    }
  }
  return null;
}

/* What the map should be pointing at, given where you are standing. Kept here
   rather than inside the renderer so it can be asserted: "you land on the beach
   and exactly one thing is marked, and it is the notice" is the whole answer to
   a kid saying he does not know where to go, and it is worth a test.

   `goal` is the thing the current step is about, and it is marked however far
   away it is. Everything else has to be within `range`, because a whole
   region's worth of markers is a checklist rather than a map.

   When the step is in another region there is nothing here to mark, and the map
   used to go blank -- which is exactly the moment a kid is most lost, because
   the journal has just named a place he has never been. So the crossing gets
   the marker instead: `route` says this one is a way out rather than a thing to
   press Space on. */
export function markers(map, save, px, py, range) {
  const q = step();
  const want = q.target;
  const out = [];
  for (const e of visibleEntities(map, save)) {
    if (pointable(e, want, save)) { out.push({ e, goal: true }); continue; }
    if (!unexamined(e, save)) continue;
    if (Math.max(Math.abs(e.x - px), Math.abs(e.y - py)) <= range) out.push({ e, goal: false });
  }
  if (want) {
    const hop = nextHop(map, regionsFor(q));
    if (hop) out.push({
      e: { x: hop.x, y: hop.y, kind: 'exit', id: 'to:' + hop.to, to: hop.to },
      goal: true, route: true
    });
  }
  return out;
}

export function refreshBar(mapKey) {
  const region = REGIONS[mapKey];
  document.getElementById('place-name').textContent = region ? region.name : mapKey;
  document.getElementById('place-step').textContent = step().objective;
}
