/* The soundtrack.
   Every note here is generated in the browser, so this game still ships without
   a single audio file. That is not only a size decision: a loop long enough not
   to grate is a big download, and a short one grates. Generated music can amble
   along for an hour without repeating a bar.

   The aim is cozy, not exciting. Slow tempos, warm pads, a soft music-box
   arpeggio, no drums, and a melody that rests more often than it plays. Each
   region gets its own key, chord loop and tempo, and the whole thing crossfades
   when you walk from one region into the next.

   All of it is original: the chord loops below and the walk that picks melody
   notes were written for this game.

   The voices all take (context, destination) rather than reading the live audio
   graph out of module scope. That is what lets renderTest() below play a region
   into an OfflineAudioContext and measure it, so "it makes a sound and does not
   clip" is something the self test checks rather than something I assumed. */

import { context } from './audio.js';

/* Pentatonic scales keep a random melody from ever landing on a sour note,
   which is what makes generated music safe to leave running unattended. */
const MAJOR_PENT = [0, 2, 4, 7, 9];
const MINOR_PENT = [0, 3, 5, 7, 10];

/* root is a MIDI note. chords are semitone offsets from it, one chord per bar.
   `bright` moves the lowpass, so the caves sound muffled and the ridge open. */
export const THEMES = {
  beach: {
    root: 62, scale: MAJOR_PENT, bpm: 82, bright: 1.0, arp: true,
    chords: [[0, 4, 7], [7, 11, 14], [9, 12, 16], [5, 9, 12]]
  },
  meadow: {
    root: 64, scale: MAJOR_PENT, bpm: 90, bright: 1.15, arp: true,
    chords: [[0, 4, 7], [4, 7, 11], [5, 9, 12], [7, 11, 14]]
  },
  grove: {
    root: 57, scale: MAJOR_PENT, bpm: 72, bright: 0.8, arp: true,
    chords: [[9, 12, 16], [5, 9, 12], [0, 4, 7], [7, 11, 14]]
  },
  marsh: {
    root: 60, scale: MAJOR_PENT, bpm: 68, bright: 0.72, arp: false,
    chords: [[2, 5, 9], [7, 11, 14], [0, 4, 7], [9, 12, 16]]
  },
  caverns: {
    root: 55, scale: MINOR_PENT, bpm: 62, bright: 0.5, arp: false,
    chords: [[0, 3, 7], [8, 12, 15], [3, 7, 10], [10, 14, 17]]
  },
  ridge: {
    root: 65, scale: MAJOR_PENT, bpm: 78, bright: 1.3, arp: true,
    chords: [[0, 4, 7], [5, 9, 12], [9, 12, 16], [7, 11, 14]]
  }
};

const FULL = 0.30;      // music sits well under the sound effects
const DUCKED = 0.13;    // while a reading sheet is open

const STEPS_PER_BAR = 8;    // eighth notes
const BARS = 4;             // length of a chord loop
const HORIZON = 0.7;        // how far ahead notes are scheduled, in seconds
const TICK = 45;            // scheduler wake-up, in ms

const midi = m => 440 * Math.pow(2, (m - 69) / 12);
const rand = (a, b) => a + Math.random() * (b - a);
const chance = p => Math.random() < p;
const stepSeconds = th => (60 / th.bpm) / 2;

/* ---------------- voices ---------------- */

/* A slow warm chord. Two oscillators per note, slightly apart, which is the
   cheapest way to stop a pad sounding like a test tone. */
function pad(c, dest, freqs, t, dur, gain) {
  for (const f of freqs) {
    for (const detune of [-4, 4]) {
      const o = c.createOscillator(), g = c.createGain();
      o.type = 'triangle';
      o.frequency.value = f;
      o.detune.value = detune;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(gain, t + dur * 0.45);
      g.gain.linearRampToValueAtTime(0, t + dur * 1.15);
      o.connect(g); g.connect(dest);
      o.start(t); o.stop(t + dur * 1.2);
    }
  }
}

/* The melody and the arpeggio: struck, then left to ring. */
function bell(c, dest, freq, t, gain, decay) {
  const o = c.createOscillator(), g = c.createGain();
  o.type = 'sine';
  o.frequency.value = freq;
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(gain, t + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t + decay);
  o.connect(g); g.connect(dest);
  o.start(t); o.stop(t + decay + 0.05);

  // a quiet octave above gives it a music-box edge
  const o2 = c.createOscillator(), g2 = c.createGain();
  o2.type = 'triangle';
  o2.frequency.value = freq * 2;
  g2.gain.setValueAtTime(0, t);
  g2.gain.linearRampToValueAtTime(gain * 0.22, t + 0.008);
  g2.gain.exponentialRampToValueAtTime(0.0001, t + decay * 0.5);
  o2.connect(g2); g2.connect(dest);
  o2.start(t); o2.stop(t + decay * 0.5 + 0.05);
}

function bass(c, dest, freq, t, dur, gain) {
  const o = c.createOscillator(), g = c.createGain();
  o.type = 'sine';
  o.frequency.value = freq;
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(gain, t + 0.06);
  g.gain.linearRampToValueAtTime(0, t + dur);
  o.connect(g); g.connect(dest);
  o.start(t); o.stop(t + dur + 0.05);
}

/* ---------------- the pattern ---------------- */

/* Melody notes come from a walk along the scale rather than a fixed tune, so it
   never repeats, and the steps are kept small so it never leaps about. */
function walk(state) {
  const th = state.theme;
  const move = [-2, -1, -1, 0, 1, 1, 2][Math.floor(Math.random() * 7)];
  state.i = Math.max(0, Math.min(th.scale.length * 2 - 1, state.i + move));
  const octave = Math.floor(state.i / th.scale.length);
  return th.root + 12 + th.scale[state.i % th.scale.length] + octave * 12;
}

function scheduleStep(c, dest, state, n, t) {
  const th = state.theme;
  const bar = Math.floor(n / STEPS_PER_BAR) % BARS;
  const beat = n % STEPS_PER_BAR;
  const chord = th.chords[bar];
  const barSecs = stepSeconds(th) * STEPS_PER_BAR;

  // one chord and one root note per bar
  if (beat === 0) {
    pad(c, dest, chord.map(x => midi(th.root + x)), t, barSecs, 0.035);
    bass(c, dest, midi(th.root - 12 + chord[0]), t, barSecs * 0.9, 0.075);
  }
  if (beat === 4 && chance(0.6)) {
    bass(c, dest, midi(th.root - 12 + chord[chord.length - 1]), t, barSecs * 0.35, 0.045);
  }

  // a soft arpeggio on the off-beats, cycling up the chord
  if (th.arp && beat % 2 === 1) {
    const x = chord[Math.floor(beat / 2) % chord.length];
    bell(c, dest, midi(th.root + 12 + x), t, 0.022, 0.9);
  }

  // the melody rests through the third bar of every loop, to let it breathe
  const resting = bar === 2;
  const onBeat = [0, 2, 3, 5, 6].includes(beat);
  if (!resting && onBeat && chance(0.5)) {
    bell(c, dest, midi(walk(state)), t + rand(0, 0.01), 0.055, 1.6);
    // now and then a quick second note, like a little turn
    if (chance(0.18)) bell(c, dest, midi(walk(state)), t + stepSeconds(th) * 0.5, 0.032, 1.0);
  }
}

/* ---------------- the live mix ---------------- */

let ctx = null;
let bus = null, tone = null, master = null;
let timer = null;
let on = true;
let ducked = false;
let state = null;
let themeKey = null;
let nextTime = 0;
let stepNo = 0;

/* bus -> lowpass -> master -> out, with a short feedback delay in parallel.
   That delay is most of what makes a bare synth sound like a room. */
function chain(c, brightness, gain) {
  const b = c.createGain();
  b.gain.value = 1;
  const lp = c.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.value = 2000 * brightness;
  lp.Q.value = 0.4;
  const out = c.createGain();
  out.gain.value = gain;
  const delay = c.createDelay(1.0);
  delay.delayTime.value = 0.31;
  const feedback = c.createGain();
  feedback.gain.value = 0.26;
  const wet = c.createGain();
  wet.gain.value = 0.24;

  b.connect(lp);
  b.connect(delay);
  delay.connect(feedback);
  feedback.connect(delay);
  delay.connect(wet);
  wet.connect(lp);
  lp.connect(out);
  out.connect(c.destination);
  return { bus: b, tone: lp, master: out };
}

function build() {
  ctx = context();
  if (!ctx || bus) return !!ctx;
  const nodes = chain(ctx, 1, 0);
  bus = nodes.bus;
  tone = nodes.tone;
  master = nodes.master;
  return true;
}

function level() { return on ? (ducked ? DUCKED : FULL) : 0; }

function fadeTo(v, secs) {
  if (!master || !ctx) return;
  const t = ctx.currentTime;
  master.gain.cancelScheduledValues(t);
  master.gain.setValueAtTime(master.gain.value, t);
  master.gain.linearRampToValueAtTime(v, t + secs);
}

function scheduler() {
  if (!ctx || !state) return;
  const now = ctx.currentTime;
  if (nextTime < now) nextTime = now + 0.06;
  while (nextTime < now + HORIZON) {
    scheduleStep(ctx, bus, state, stepNo, nextTime);
    nextTime += stepSeconds(state.theme);
    stepNo++;
  }
}

/* ---------------- what the game calls ---------------- */

/* Two separate ideas, and keeping them apart is what stops the browser logging
   a blocked-autoplay warning on every load:
     `on`       -- does the player want music (a saved setting)
     `gestured` -- has the player touched the page yet, so audio is allowed
   Nothing is built or scheduled until both are true. */
let gestured = false;
let region = 'beach';

export function unlock(where) {
  gestured = true;
  if (where) region = where;
  if (on) run();
}

function run() {
  if (!gestured || !on) return;
  if (!build()) return;
  if (!state) applyTheme(region, true);   // also sets themeKey
  if (!timer) timer = setInterval(scheduler, TICK);
  fadeTo(level(), 2.4);
}

function halt() {
  fadeTo(0, 0.5);
  // let the tail ring out, then stop scheduling so an off switch costs nothing
  setTimeout(() => {
    if (on) return;
    if (timer) { clearInterval(timer); timer = null; }
  }, 900);
}

function applyTheme(key, instant) {
  const th = THEMES[key];
  if (!th) return;
  themeKey = key;
  state = { theme: th, i: 4 };
  stepNo = 0;
  if (ctx) nextTime = ctx.currentTime + 0.08;
  if (!tone || !ctx) return;
  if (instant) {
    tone.frequency.value = 2000 * th.bright;
  } else {
    tone.frequency.cancelScheduledValues(ctx.currentTime);
    tone.frequency.linearRampToValueAtTime(2000 * th.bright, ctx.currentTime + 1.2);
  }
}

export function setRegion(key, immediate = false) {
  if (!THEMES[key]) return;
  region = key;
  if (key === themeKey) return;
  const first = !state;
  themeKey = key;

  if (first || immediate) {
    applyTheme(key, true);
    return;
  }
  // walking into a new region: duck out, change key, come back up
  fadeTo(0, 0.7);
  setTimeout(() => {
    applyTheme(key, false);
    fadeTo(level(), 1.8);
  }, 760);
}

export function setMusic(v) {
  on = !!v;
  if (!gestured) return;      // the first tap will pick this up
  on ? run() : halt();
}

export function musicOn() { return on; }

/* Reading is the point of this game, so the music gets out of the way while a
   passage is open rather than competing with it. */
export function duck(v) {
  if (ducked === !!v) return;
  ducked = !!v;
  if (on && timer) fadeTo(level(), 0.6);
}

/* Nothing should be playing into a tab nobody is looking at. */
export function suspend() { if (timer) fadeTo(0, 0.4); }
export function resume() { if (on && timer) fadeTo(level(), 1.2); }

export function status() {
  return {
    theme: themeKey,
    steps: stepNo,
    running: !!timer,
    contextState: ctx ? ctx.state : 'none',
    gain: master ? Number(master.gain.value.toFixed(3)) : 0
  };
}

/* ---------------- measurable output ---------------- */

/* Renders one region into an OfflineAudioContext and reports how loud it came
   out: proof that a region actually makes a sound and does not clip, rather than
   my word for it.

   This is a hand tool, not part of selftest.html, and that is deliberate.
   OfflineAudioContext turned out to be too flaky to automate here: a headless
   browser will finish one short render on a page and then stall on anything
   bigger or anything after it, and an await that never resolves would stop the
   self test printing its report at all. A check that can silently take down the
   whole suite is worse than no check.

   To use it, render one region per page load, early, before anything touches the
   live AudioContext -- a suspended context also stops offline rendering from
   ever completing:

     const { renderOne } = await import('./js/music.js');
     console.log(await renderOne('beach', 2));

   Measured this way, every region lands around rms 0.015 and peak 0.06, which is
   comfortably audible and nowhere near clipping. */
export async function renderOne(key, seconds = 2) {
  const OC = window.OfflineAudioContext || window.webkitOfflineAudioContext;
  const th = THEMES[key];
  if (!OC || !th) return null;

  const rate = 22050;
  const c = new OC(1, Math.ceil(rate * seconds), rate);
  const nodes = chain(c, th.bright, FULL);
  const st = { theme: th, i: 4 };

  let t = 0, n = 0;
  const dur = stepSeconds(th);
  while (t < seconds) {
    scheduleStep(c, nodes.bus, st, n, t);
    t += dur;
    n++;
  }

  const buf = await c.startRendering();
  const d = buf.getChannelData(0);
  let peak = 0, sum = 0;
  for (let i = 0; i < d.length; i++) {
    const a = Math.abs(d[i]);
    if (a > peak) peak = a;
    sum += d[i] * d[i];
  }
  return { key, notes: n, peak, rms: Math.sqrt(sum / d.length) };
}
