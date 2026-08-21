/* Math fact worlds (addition, subtraction, multiplication, division) and the
   mixed Boss Battle. Difficulty follows the player's adaptive skill level. */

import { S } from '../state.js';
import { makeChunk, makeBossChunk, SKILL_META } from '../content/mathbanks.js';
import { runSession } from '../session.js';
import * as U from '../ui.js';
import { sfx } from '../audio.js';

export function startDrill(skill, onDone) {
  const meta = SKILL_META[skill];
  const lvl = S.levels[skill] || 1;
  const n = S.chunkSize || 8;
  sfx.whoosh();
  runSession({
    title: meta.world,
    subtitle: `${meta.label} | level ${lvl}`,
    heroKey: meta.hero,
    skill,
    questions: makeChunk(skill, lvl, n),
    onDone,
    onAgain: () => startDrill(skill, onDone),
    onQuit: onDone
  });
}

export function startBoss(onDone) {
  sfx.whoosh();
  runSession({
    title: 'BOSS BATTLE',
    subtitle: 'all four skills, mixed on purpose',
    heroKey: 'speedster',
    questions: makeBossChunk(S.levels, 12),
    badgeOnFinish: 'boss',
    onDone,
    onAgain: () => startBoss(onDone),
    onQuit: onDone
  });
}

/* Optional pre-screen so the boss feels like an event. */
export function bossIntro(onDone) {
  U.render(`
    <div class="panel center">
      <div style="height:90px">${U.sp.crown()}</div>
      <h2>BOSS BATTLE</h2>
      <p>12 problems. Addition, subtraction, multiplication and division, all shuffled so you cannot guess the pattern.</p>
      <p class="muted">One notch harder than your normal levels. Beating it earns the Boss Slayer badge.</p>
      <button class="btn go big" id="go">Let's go</button>
      <button class="btn ghost big" id="back" style="margin-top:10px">Not today</button>
    </div>
  `);
  document.getElementById('go').onclick = () => startBoss(onDone);
  document.getElementById('back').onclick = onDone;
}
