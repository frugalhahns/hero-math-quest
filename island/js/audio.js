/* Sound effects. A tiny WebAudio synth, so there is nothing to download and
   nothing to load before the first frame.

   Everything runs through one bus at SFX_LEVEL rather than straight to the
   speakers, which is what lets the effects be balanced against the generated
   music in js/music.js as a group rather than one at a time. The balance is
   measured, not described: island/audiotest.html renders every effect offline
   through this bus and checks each one is louder than the music it lands on and
   quieter than getting an answer right. Footsteps are the reason that page
   exists -- they were four thousandths peak against a soundtrack sitting at
   twenty-six, and "I cannot hear the footsteps" turned out to be arithmetic. */

let ctx = null;
let bus = null;
let on = true;
let offline = false;      // true only while measure() is rendering

/* The effects bus. It was 0.5, which was set by ear against a description of
   the music rather than a measurement of it: the busiest region actually renders
   at rms 0.026 and peaks at 0.082, so everything on this bus was sitting at or
   under the soundtrack's continuous level and the quiet end of it -- footsteps --
   was inaudible. At 1.0 a footstep peaks around twice the music's rms and the
   reward sounds land near its peak, which is where they belong.
   island/audiotest.html renders all of it offline and holds the line. */
const SFX_LEVEL = 1.0;

function ac() {
  if (!ctx) {
    const C = window.AudioContext || window.webkitAudioContext;
    if (!C) return null;
    try { ctx = new C(); } catch (e) { return null; }
  }
  // an OfflineAudioContext must not be resumed by hand: rendering starts it
  if (!offline && ctx.state === 'suspended') ctx.resume();
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
  /* Broad lowpass rather than a narrow band: a filter tight enough to sound
     exactly like grass also throws away nearly all of the noise, which is how
     these ended up peaking at 0.004 while the music sat at 0.015. The character
     comes from the cutoff and the length now, and the level survives it. */
  grass: f => { noise(0.06, 2400 + f * 300, 0.07, 'lowpass'); },
  sand:  f => { noise(0.085, 900 + f * 90, 0.115, 'lowpass'); },
  dirt:  f => { noise(0.055, 780 + f * 100, 0.114, 'lowpass'); tone(f ? 232 : 214, 0, 0.045, 'sine', 0.024); },
  wood:  f => { tone(f ? 196 : 178, 0, 0.06, 'sine', 0.05); noise(0.03, 1700, 0.07, 'lowpass'); },
  stone: f => { noise(0.03, 1500 + f * 250, 0.10, 'bandpass'); noise(0.13, 900, 0.035, 'bandpass', 0.085); },
  water: f => { noise(0.09, 1100 + f * 150, 0.09, 'lowpass'); noise(0.05, 2600, 0.05, 'bandpass', 0.02); },
  /* Not a footstep at all: the submarine's motor, and a bubble behind it. Ninety
     hertz rather than sixty, because a tablet speaker cannot make sixty. */
  deep:  f => { tone(f ? 96 : 88, 0, 0.16, 'sine', 0.05); noise(0.07, 420, 0.06, 'lowpass', 0.04); }
};

export const SURFACES = Object.keys(SURFACE);

/* On the bicycle. Not a footstep: a short hum with a tick of chain on top, and
   deliberately a little under a footstep, because it fires nearly twice as
   often. A hundred and fifty hertz rather than ninety for the same reason the
   motor moved up -- the speaker this is played on cannot make ninety. */
function wheel(f) {
  tone(f ? 158 : 146, 0, 0.075, 'sine', 0.042);
  noise(0.02, 2800, 0.03, 'bandpass');
}

export const sfx = {
  /* A soft tap, never a tone: a pitched blip on every tile is what was drowning
     the music. `where` is a surface name from SURFACES, `foot` alternates. */
  step:    (where, foot) => on && (SURFACE[where] || SURFACE.dirt)(foot ? 1 : 0),
  wheel:   foot => on && wheel(foot ? 1 : 0),
  /* Walking into something. It was quieter than a footstep, which is the wrong
     way round: a bump is the game telling you no. */
  bump:    () => on && (tone(152, 0, 0.07, 'sine', 0.055) || noise(0.04, 500, 0.05, 'lowpass')),
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

/* ---------------- measuring ---------------- */

/* Render one effect offline and report how loud it actually is, the same way
   music.js renderOne does for a region theme. This exists because "I cannot
   hear the footsteps" was true and unarguable and there was no number anywhere
   to argue with: a step was peaking at 0.015, which is exactly the level the
   music sits at continuously, so it was buried by arithmetic.

   The whole effects graph is pointed at an offline context for the duration, so
   what comes back has been through the same SFX bus a player hears. */
export async function measure(play, seconds = 0.6) {
  const OC = window.OfflineAudioContext || window.webkitOfflineAudioContext;
  if (!OC) return null;
  const rate = 22050;
  const c = new OC(1, Math.ceil(rate * seconds), rate);

  const keepCtx = ctx, keepBus = bus, keepOn = on;
  ctx = c; bus = null; on = true; offline = true;
  try {
    play();
  } finally {
    ctx = keepCtx; bus = keepBus; on = keepOn; offline = false;
  }

  const buf = await c.startRendering();
  const d = buf.getChannelData(0);
  let peak = 0, sum = 0;
  for (let i = 0; i < d.length; i++) {
    const a = Math.abs(d[i]);
    if (a > peak) peak = a;
    sum += d[i] * d[i];
  }
  return { peak, rms: Math.sqrt(sum / d.length) };
}

/* Read by the self test so the balance against the music is checked rather than
   eyeballed. */
export function levels() {
  return { bus: SFX_LEVEL, step: 0.036, bump: 0.055, right: 0.085, caught: 0.10 };
}
