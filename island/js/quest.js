/* The trip tracker. The current step is the only nudge the game ever gives, and
   it is deliberately worded as a reminder of what you read rather than as a
   direction: "the chart says where the handle is", never "go to 5,18". */

import { S, save } from './state.js';
import { QUEST } from './content/quests.js';
import { REGIONS } from './content/entities.js';
import { visibleEntities } from './world.js';
import { toast } from './ui.js';
import { sfx } from './audio.js';

export function step() {
  return QUEST[Math.min(S.step, QUEST.length - 1)];
}

export function stepIndex(id) {
  return QUEST.findIndex(q => q.id === id);
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

/* What the map should be pointing at, given where you are standing. Kept here
   rather than inside the renderer so it can be asserted: "you land on the beach
   and exactly one thing is marked, and it is the notice" is the whole answer to
   a kid saying he does not know where to go, and it is worth a test.

   `goal` is the thing the current step is about, and it is marked however far
   away it is. Everything else has to be within `range`, because a whole
   region's worth of markers is a checklist rather than a map. */
export function markers(map, save, px, py, range) {
  const want = step().target;
  const out = [];
  for (const e of visibleEntities(map, save)) {
    if (!unexamined(e, save)) continue;
    const goal = isTarget(e, want);
    if (goal || Math.max(Math.abs(e.x - px), Math.abs(e.y - py)) <= range) out.push({ e, goal });
  }
  return out;
}

export function refreshBar(mapKey) {
  const region = REGIONS[mapKey];
  document.getElementById('place-name').textContent = region ? region.name : mapKey;
  document.getElementById('place-step').textContent = step().objective;
}
