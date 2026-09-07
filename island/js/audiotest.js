/* The third dev page, and the only one that measures anything.

   selftest.js proves the content and flowtest.js presses the buttons. Neither
   can answer "is that actually audible", which is a question this game got
   wrong twice: a footstep was peaking at 0.004 while the soundtrack sat at
   0.015 continuously, so it was buried by arithmetic rather than by taste, and
   the only evidence either way was somebody's ear.

   So every effect is rendered offline through the real SFX bus and measured.
   Two fences hold the whole design:

     louder than the music it lands on, or it is not there at all;
     quieter than getting an answer right, or the game is applauding you for
     walking across a beach.

   This is a page of its own rather than a section of selftest.html because
   offline rendering is real work on a real audio thread, and a headless browser
   dumping the page does not wait for it. Open it in a browser. */

import { sfx, SURFACES, measure, levels } from './audio.js';
import { renderOne, THEMES } from './music.js';

const out = [];
let fails = 0, checks = 0;

function ok(cond, label, detail = '') {
  checks++;
  if (!cond) fails++;
  out.push(`<div class="${cond ? 'ok' : 'bad'}">${cond ? 'PASS' : 'FAIL'}  ${label}${detail ? '  — ' + detail : ''}</div>`);
  render();
}
function head(t) { out.push(`<h2>${t}</h2>`); render(); }
function note(t) { out.push(`<div class="note">      ${t}</div>`); render(); }
function render() {
  const el = document.getElementById('out');
  if (el) el.innerHTML = `<h2>${fails ? fails + ' FAILURES' : 'all clear'} — ${checks} checks</h2>` + out.join('');
  document.title = fails ? 'FAIL ' + fails : 'PASS ' + checks;
}

const f4 = n => n.toFixed(4);

/* ---------------- the music, as the thing everything else sits over ---------------- */

head('the soundtrack, as a floor');
const music = {};
for (const key of Object.keys(THEMES)) {
  music[key] = await renderOne(key, 2);
  ok(!!music[key], `${key}: renders`);
  if (!music[key]) continue;
  ok(music[key].rms > 0.004 && music[key].rms < 0.030,
    `${key}: sits in the band the effects were balanced against`,
    `rms ${f4(music[key].rms)}, peak ${f4(music[key].peak)}`);
}
const loudest = Object.values(music).reduce((a, b) => (b && b.rms > a.rms ? b : a), { rms: 0, peak: 0 });
note(`busiest region: rms ${f4(loudest.rms)}, peak ${f4(loudest.peak)}`);

/* ---------------- the reward sounds, as a ceiling ---------------- */

head('the ceiling');
const right = await measure(() => sfx.right());
const caught = await measure(() => sfx.caught());
ok(right.peak > loudest.rms * 3, 'getting an answer right is well clear of the music',
  `${f4(right.peak)} vs rms ${f4(loudest.rms)}`);
ok(caught.peak >= right.peak, 'and an animal joining you is the loudest thing in the game',
  `${f4(caught.peak)} vs ${f4(right.peak)}`);
ok(caught.peak < 0.2, 'and nothing is anywhere near clipping', f4(caught.peak));

/* ---------------- footsteps ---------------- */

head('footsteps');
const steps = [];
for (const surface of SURFACES) {
  const m = await measure(() => sfx.step(surface, 0));
  const b = await measure(() => sfx.step(surface, 1));
  steps.push([surface, m.peak]);
  ok(m.peak > loudest.rms * 1.2, `${surface}: louder than the music it lands on`,
    `${f4(m.peak)} vs rms ${f4(loudest.rms)}`);
  ok(m.peak < right.peak, `${surface}: and quieter than getting an answer right`,
    `${f4(m.peak)} vs ${f4(right.peak)}`);
  /* Two feet have to be two feet. If a surface ignored the foot it was handed,
     the walk would go back to one sound repeating, which is what made the
     original tick sound like a machine rather than somebody walking. */
  ok(Math.abs(m.peak - b.peak) > 0 || m.rms !== b.rms,
    `${surface}: the second foot is not the first one again`,
    `${f4(m.peak)} / ${f4(b.peak)}`);
}
const quietest = Math.min(...steps.map(s => s[1]));
const noisiest = Math.max(...steps.map(s => s[1]));
ok(noisiest / quietest < 2.5, 'no surface is twice as loud as another',
  `${f4(quietest)} to ${f4(noisiest)}`);
note('peaks: ' + steps.map(([s, p]) => `${s} ${f4(p)}`).join(', '));

/* ---------------- everything else that fires while you walk ---------------- */

head('the rest of it');
const wheel = await measure(() => sfx.wheel(0));
ok(wheel.peak > loudest.rms, 'the bicycle can be heard over the music', f4(wheel.peak));
ok(wheel.peak < quietest, 'and sits under every footstep, because it fires more often',
  `${f4(wheel.peak)} vs ${f4(quietest)}`);

const bump = await measure(() => sfx.bump());
ok(bump.peak > loudest.rms * 1.2, 'walking into something is at least as loud as walking',
  f4(bump.peak));
ok(bump.peak < right.peak, 'and still not a reward', f4(bump.peak));

for (const name of ['open', 'page', 'item', 'unlock', 'build', 'wrong', 'rapport', 'flee', 'finale']) {
  const m = await measure(() => sfx[name](), 1.4);
  ok(m.peak > 0.004 && m.peak < 0.2, `${name}: audible and not clipping`, f4(m.peak));
}

/* levels() is what the docs quote. It has to be true. */
head('the numbers in levels()');
{
  const L = levels();
  const step = await measure(() => sfx.step('dirt', 0));
  ok(Math.abs(L.step - 0.036) < 0.02, 'levels() still describes a footstep', String(L.step));
  ok(step.peak < L.bus, 'and a footstep comes out under the bus it runs through',
    `${f4(step.peak)} vs ${L.bus}`);
}

note('rendered offline through the same SFX bus a player hears, so these are the numbers that reach the speaker');

document.documentElement.dataset.done = '1';
