/* Tiny WebAudio synth. No audio files, so there is nothing to download and
   nothing to load before the first frame. */

let ctx = null;
let on = true;

function ac() {
  if (!ctx) {
    const C = window.AudioContext || window.webkitAudioContext;
    if (!C) return null;
    try { ctx = new C(); } catch (e) { return null; }
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

export function setSound(v) { on = !!v; }
export function soundOn() { return on; }

function tone(freq, start, dur, type = 'triangle', gain = 0.11) {
  const c = ac(); if (!c) return;
  const o = c.createOscillator(), g = c.createGain();
  o.type = type; o.frequency.value = freq;
  const t0 = c.currentTime + start;
  g.gain.setValueAtTime(0, t0);
  g.gain.linearRampToValueAtTime(gain, t0 + 0.014);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  o.connect(g); g.connect(c.destination);
  o.start(t0); o.stop(t0 + dur + 0.02);
}

function seq(notes, type = 'triangle', gain = 0.11) {
  if (!on) return;
  let t = 0;
  for (const [f, d] of notes) { tone(f, t, d, type, gain); t += d * 0.85; }
}

function noise(dur, freq, gain) {
  if (!on) return;
  const c = ac(); if (!c) return;
  const len = Math.max(1, Math.floor(c.sampleRate * dur));
  const buf = c.createBuffer(1, len, c.sampleRate), d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len) ** 2;
  const b = c.createBufferSource(); b.buffer = buf;
  const f = c.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = freq;
  const g = c.createGain(); g.gain.value = gain;
  b.connect(f); f.connect(g); g.connect(c.destination); b.start();
}

export const sfx = {
  step:    () => on && tone(180 + Math.random() * 40, 0, 0.035, 'square', 0.028),
  bump:    () => on && tone(110, 0, 0.07, 'square', 0.05),
  open:    () => seq([[520, .06], [700, .1]], 'triangle', 0.08),
  page:    () => noise(0.14, 2600, 0.05),
  right:   () => seq([[660, .09], [880, .09], [1180, .16]]),
  wrong:   () => seq([[300, .12], [210, .18]], 'sawtooth', 0.09),
  rapport: () => seq([[784, .08], [1046, .14]], 'sine', 0.12),
  caught:  () => seq([[523, .1], [659, .1], [784, .1], [1046, .3]], 'triangle', 0.13),
  flee:    () => noise(0.3, 700, 0.09),
  build:   () => seq([[196, .12], [262, .12], [330, .12], [392, .1], [523, .34]], 'triangle', 0.13),
  unlock:  () => seq([[440, .1], [554, .1], [659, .1], [880, .32]], 'triangle', 0.14),
  item:    () => seq([[1046, .06], [1568, .14]], 'square', 0.09),
  finale:  () => seq([[392, .16], [523, .16], [659, .16], [784, .16], [1046, .2], [1318, .5]], 'triangle', 0.14)
};
