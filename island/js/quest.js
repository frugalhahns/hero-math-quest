/* The expedition tracker. The current step is the only guidance the game ever
   gives, and it is deliberately written as a reminder of what you read rather
   than as a direction: "the chart says where the crank is", never "go to 5,18". */

import { S, save } from './state.js';
import { QUEST } from './content/quests.js';
import { REGIONS } from './content/entities.js';
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
    toast('Expedition log: ' + step().objective, 4200);
  }
  return moved;
}

export function progress() {
  return { done: S.step, total: QUEST.length - 1 };
}

/* The two lines in the top bar. */
export function refreshBar(mapKey) {
  const region = REGIONS[mapKey];
  document.getElementById('place-name').textContent = region ? region.name : mapKey;
  document.getElementById('place-step').textContent = step().objective;
}
