/* Sound effects. A tiny WebAudio synth, so there is nothing to download and
   nothing to load before the first frame.

   Everything runs through one bus at SFX_LEVEL rather than straight to the
   speakers. That is what lets the effects be balanced against the generated
   music in js/music.js as a group: the music sits around rms 0.015, so a bare
   0.03 square wave blip walks right over the top of it. Footsteps in
   particular are a soft tick rather than a tone, and main.js only plays every
   other one -- a beep on every tile at walking pace is the single loudest thing
   in the game otherwise. */

let ctx = null;
let bus = null;
let on = true;

const SFX_LEVEL = 0.5;   // headroom for the music to sit under the effects

function ac() {
  if (!ctx) {
    const C = window.AudioContext || window.webkitAudioContext;
    if (!C) return null;
    try { ctx = new C(); } catch (e) { return null; }
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

/* All effects land here, never on ctx.destination directly. */
function out() {
  const c = ac();
  if (!c) return null;
  if (!bus) {
    bus = c.createGain();
    bus.gain.value = SFX_LEVEL;
    bus.connect(c.destination);
  }
  return bus;
}

export function setSound(v) { on = !!v; }
export function soundOn() { return on; }

/* music.js needs the same AudioContext -- two of them on one page is a good way
   to run a phone's battery down and get throttled by the browser. */
export function context() { return ac(); }

function tone(freq, start, dur, type = 'triangle', gain = 0.11) {
  const dest = out(); if (!dest) return;
  const c = ctx;
  const o = c.createOscillator(), g = c.createGain();
  o.type = type; o.frequency.value = freq;
  const t0 = c.currentTime + start;
  g.gain.setValueAtTime(0, t0);
  g.gain.linearRampToValueAtTime(gain, t0 + 0.014);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  o.connect(g); g.connect(dest);
  o.start(t0); o.stop(t0 + dur + 0.02);
}

function seq(notes, type = 'triangle', gain = 0.11) {
  if (!on) return;
  let t = 0;
  for (const [f, d] of notes) { tone(f, t, d, type, gain); t += d * 0.85; }
}

/* Filtered noise. The filter type is what makes it a tap rather than a hiss:
   lowpass for something soft and close, bandpass for something with an edge.
   `at` delays the burst, which is the whole of the cave echo. */
function noise(dur, freq, gain, type = 'bandpass', at = 0) {
  if (!on) return;
  const dest = out(); if (!dest) return;
  const c = ctx;
  const len = Math.max(1, Math.floor(c.sampleRate * dur));
  const buf = c.createBuffer(1, len, c.sampleRate), d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len) ** 2;
  const b = c.createBufferSource(); b.buffer = buf;
  const f = c.createBiquadFilter(); f.type = type; f.frequency.value = freq;
  const g = c.createGain(); g.gain.value = gain;
  b.connect(f); f.connect(g); g.connect(dest); b.start(c.currentTime + at);
}

/* ---------------- footsteps ---------------- */

/* One tap per two tiles, and what it sounds like depends on what is under you.
   This is the cheapest world-building in the game: the dock knocks, the cave
   floor clicks and comes back off the walls a moment later, the stepping stones
   in the meadow pond splash. A kid who cannot yet read "boardwalk" can hear
   that he has walked onto one.

   `foot` alternates 0/1 so a walk is two feet rather than one sound repeating,
   which is most of what makes the old single tick read as a machine. Nothing
   here goes over 0.036: the music sits at rms 0.015 and footsteps are the one
   effect that fires hundreds of times a minute. */
const SURFACE = {
  grass: f => { noise(0.055, 1300 + f * 260, 0.020, 'bandpass'); },
  sand:  f => { noise(0.075, 240 + f * 40, 0.030, 'lowpass'); },
  dirt:  f => { noise(0.045, 230 + f * 60, 0.032, 'lowpass'); },
  wood:  f => { tone(f ? 128 : 112, 0, 0.055, 'sine', 0.030); noise(0.028, 1000, 0.014, 'bandpass'); },
  stone: f => { noise(0.03, 1050 + f * 220, 0.026, 'bandpass'); noise(0.14, 760, 0.008, 'bandpass', 0.085); },
  water: f => { noise(0.09, 620 + f * 120, 0.030, 'lowpass'); noise(0.05, 2400, 0.010, 'bandpass', 0.02); }
};

export const SURFACES = Object.keys(SURFACE);

export const sfx = {
  /* A soft tap, never a tone: a pitched blip on every tile is what was drowning
     the music. `where` is a surface name from SURFACES, `foot` alternates. */
  step:    (where, foot) => on && (SURFACE[where] || SURFACE.dirt)(foot ? 1 : 0),
  bump:    () => on && tone(120, 0, 0.06, 'sine', 0.030),
  open:    () => seq([[520, .06], [700, .1]], 'triangle', 0.06),
  page:    () => noise(0.1, 2200, 0.030),
  right:   () => seq([[660, .09], [880, .09], [1180, .16]], 'triangle', 0.085),
  wrong:   () => seq([[300, .12], [210, .18]], 'sine', 0.07),
  rapport: () => seq([[784, .08], [1046, .14]], 'sine', 0.09),
  caught:  () => seq([[523, .1], [659, .1], [784, .1], [1046, .3]], 'triangle', 0.10),
  flee:    () => noise(0.28, 600, 0.06, 'lowpass'),
  build:   () => seq([[196, .12], [262, .12], [330, .12], [392, .1], [523, .34]], 'triangle', 0.10),
  unlock:  () => seq([[440, .1], [554, .1], [659, .1], [880, .32]], 'triangle', 0.10),
  item:    () => seq([[1046, .06], [1568, .14]], 'triangle', 0.075),
  finale:  () => seq([[392, .16], [523, .16], [659, .16], [784, .16], [1046, .2], [1318, .5]], 'triangle', 0.11)
};

/* Read by the self test so the balance against the music is checked rather than
   eyeballed. */
export function levels() {
  return { bus: SFX_LEVEL, step: 0.036, bump: 0.030, right: 0.085, caught: 0.10 };
}
