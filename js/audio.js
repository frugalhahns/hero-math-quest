/* Tiny WebAudio synth. No audio files, so nothing to download. */

let ctx = null;
let on = true;

function ac() {
  if (!ctx) {
    const C = window.AudioContext || window.webkitAudioContext;
    if (!C) return null;
    ctx = new C();
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

export function setSound(v) { on = !!v; }
export function soundOn() { return on; }

function tone(freq, start, dur, type = 'square', gain = 0.13) {
  const c = ac(); if (!c) return;
  const o = c.createOscillator(), g = c.createGain();
  o.type = type; o.frequency.value = freq;
  const t0 = c.currentTime + start;
  g.gain.setValueAtTime(0, t0);
  g.gain.linearRampToValueAtTime(gain, t0 + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  o.connect(g); g.connect(c.destination);
  o.start(t0); o.stop(t0 + dur + 0.02);
}

function seq(notes, type = 'square', gain = 0.13) {
  if (!on) return;
  let t = 0;
  for (const [f, d] of notes) { tone(f, t, d, type, gain); t += d * 0.85; }
}

export const sfx = {
  tap:    () => on && tone(520, 0, 0.05, 'square', 0.06),
  correct:() => seq([[660, .09], [880, .09], [1180, .16]]),
  wrong:  () => seq([[300, .13], [200, .2]], 'sawtooth', 0.1),
  coin:   () => seq([[1046, .06], [1568, .14]], 'square', 0.1),
  levelup:() => seq([[523, .1], [659, .1], [784, .1], [1046, .26]], 'triangle', 0.15),
  chunk:  () => seq([[784, .1], [988, .1], [1318, .1], [1568, .3]], 'triangle', 0.15),
  badge:  () => seq([[659, .12], [784, .12], [988, .12], [1318, .12], [1568, .34]], 'triangle', 0.15),
  whoosh: () => { if (!on) return; const c = ac(); if (!c) return;
    const b = c.createBufferSource(), len = c.sampleRate * 0.3;
    const buf = c.createBuffer(1, len, c.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len) ** 2;
    b.buffer = buf;
    const f = c.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 900;
    const g = c.createGain(); g.gain.value = 0.16;
    b.connect(f); f.connect(g); g.connect(c.destination); b.start();
  },
  tick:   () => on && tone(1200, 0, 0.03, 'square', 0.04)
};
