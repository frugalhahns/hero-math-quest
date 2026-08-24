/* Fraction bank. Same shape as mathbanks.js: curated rows first, generators
   behind them so a level never runs dry. Levels 1..5 walk the standard
   3rd/4th grade order: name a fraction, find a fraction of a set, equivalents,
   compare, then add and subtract with like denominators.

   Every item reuses an existing question kind, so session.js needs no new
   renderer: whole-number answers are 'numeric', fraction-valued answers are
   'choice'. Where the answer IS a fraction but the denominator is fixed by the
   question, we ask for the numerator only and keep the keypad. */

const ri = (lo, hi) => lo + Math.floor(Math.random() * (hi - lo + 1));
const pick = arr => arr[Math.floor(Math.random() * arr.length)];
const gcd = (a, b) => (b ? gcd(b, a % b) : a);

/* ---------------- fraction bar art ----------------
   Fills come from --frac rather than --accent: the accent is a single yellow in
   both themes, which all but disappears against the light theme's pale --sunk.
   --frac is defined per theme, so the shaded parts stay obvious either way. */
export function fracBar(parts, shaded) {
  const W = 264, H = 46, w = W / parts;
  let cells = '';
  for (let i = 0; i < parts; i++) {
    cells += `<rect x="${(i * w).toFixed(2)}" y="0" width="${w.toFixed(2)}" height="${H}"
      fill="${i < shaded ? 'var(--frac)' : 'var(--sunk)'}"
      stroke="var(--line)" stroke-width="2"/>`;
  }
  return `<svg viewBox="0 0 ${W} ${H}" width="100%" height="${H}" role="img"
    aria-label="${shaded} of ${parts} parts shaded">${cells}</svg>`;
}

/* Shuffle choices and report where the right one landed. */
function shuffled(correct, distractors) {
  const all = [correct, ...distractors];
  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [all[i], all[j]] = [all[j], all[i]];
  }
  return { choices: all, answer: all.indexOf(correct) };
}

/* Two different values from a list, no rejection loop to get stuck in. */
function twoDistinct(arr) {
  const pool = arr.slice();
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, 2);
}

const range = (lo, hi) => Array.from({ length: hi - lo + 1 }, (_, i) => lo + i);

/* Denominators are held to the ones the standards allow: Grade 3 is limited to
   2, 3, 4, 6 and 8 (3.NF footnote), Grade 4 adds 5, 10, 12 and 100 (4.NF
   footnote). Nothing outside that list appears anywhere, including in wrong
   answers and in the un-simplified form of a simplify question, so a kid never
   meets a denominator they have not been taught. */
const LEGAL = [2, 3, 4, 5, 6, 8, 10, 12];
const isLegal = d => LEGAL.includes(d);
const DENOMS = { 1: [2, 3, 4], 2: [2, 3, 4, 6, 8], 3: [3, 4, 5, 6, 8, 10],
                 4: [4, 5, 6, 8, 10, 12], 5: [4, 5, 6, 8, 10, 12] };

/* ---------------- question builders ---------------- */

/* "What fraction is shaded?" — the picture question, always first-level safe. */
function identify(lvl) {
  const d = pick(DENOMS[lvl]);
  const n = ri(1, d - 1);
  const correct = `${n}/${d}`;
  const distract = new Set();
  if (isLegal(n)) distract.add(`${d}/${n}`);       // flipped, the classic slip
  if (n + 1 < d) distract.add(`${n + 1}/${d}`);    // counted a shaded part twice
  distract.add(`${d - n}/${d}`);                   // named the unshaded part
  if (n > 1) distract.add(`${n - 1}/${d}`);        // counted one too few
  /* Any spare has to stay on a legal denominator, so borrow a neighbouring one. */
  for (const alt of LEGAL) if (alt !== d && n < alt) distract.add(`${n}/${alt}`);
  const picks = [...distract].filter(x => x !== correct).slice(0, 3);
  const { choices, answer } = shuffled(correct, picks);
  return {
    kind: 'choice', skill: 'frac', level: lvl,
    art: fracBar(d, n),
    prompt: 'What fraction of the bar is shaded?',
    choices, answer,
    explain: `${d} equal parts in the whole, ${n} of them shaded, so ${n}/${d}. The bottom number is how many parts the whole is cut into.`
  };
}

/* "3/4 of 20 rings" — the one that shows up most on the worksheets. */
function ofSet(lvl) {
  const caps = { 1: 12, 2: 24, 3: 30, 4: 48, 5: 72 };
  const d = pick(DENOMS[lvl]);
  const n = lvl <= 1 ? 1 : ri(1, d - 1);
  const maxMult = Math.max(1, Math.floor(caps[lvl] / d));
  const total = d * ri(1, maxMult);
  const each = total / d;
  return {
    kind: 'numeric', skill: 'frac', level: lvl,
    flavor: pick(FLAVOR),
    expr: `${n}/${d} of ${total}`,
    answer: n * each,
    hint: `Split ${total} into ${d} equal groups first: ${total} ÷ ${d} = ${each}. Then take ${n} ${n === 1 ? 'group' : 'groups'} of ${each}.`
  };
}

/* Equivalent fractions with the numerator missing: keypad stays useful. */
/* Every (small denominator -> bigger legal denominator) step available. */
const SCALE_UP = LEGAL.flatMap(d => LEGAL.filter(D => D > d && D % d === 0).map(D => [d, D]));

function equivalent(lvl) {
  const opts = lvl <= 2 ? SCALE_UP.filter(([, D]) => D <= 8) : SCALE_UP;
  const [d, D] = pick(opts);
  const n = ri(1, d - 1);
  const k = D / d;
  return {
    kind: 'numeric', skill: 'frac', level: lvl,
    flavor: pick(FLAVOR),
    prompt: 'Type the missing top number.',
    expr: `${n}/${d} = ?/${d * k}`,
    answer: n * k,
    hint: `The bottom went from ${d} to ${d * k}, so it was multiplied by ${k}. Do the same to the top: ${n} × ${k}.`
  };
}

/* Compare two fractions. Same denominator, or same numerator, never both.
   Denominators below 3 are excluded: with halves there is only one proper
   numerator, so there would be nothing to compare. */
function compare(lvl) {
  const wide = DENOMS[lvl].filter(x => x >= 3);
  const sameDen = lvl <= 2 ? true : Math.random() < 0.5;
  const pool = DENOMS[lvl].filter(x => x > 3);
  let a, b, why;
  if (sameDen || pool.length < 2) {
    const d = pick(wide);
    const [x, y] = twoDistinct(range(1, d - 1));
    a = [x, d]; b = [y, d];
    why = `Same size pieces, so more pieces wins: ${Math.max(x, y)} beats ${Math.min(x, y)}.`;
  } else {
    const [d1, d2] = twoDistinct(pool);
    const n = ri(1, 3);
    a = [n, d1]; b = [n, d2];
    why = `Same number of pieces, but cutting the whole into ${Math.max(d1, d2)} makes each piece SMALLER than cutting it into ${Math.min(d1, d2)}. Bigger bottom, smaller piece.`;
  }
  const va = a[0] / a[1], vb = b[0] / b[1];
  const sa = `${a[0]}/${a[1]}`, sb = `${b[0]}/${b[1]}`;
  const correct = va > vb ? sa : sb;
  return {
    kind: 'choice', skill: 'frac', level: lvl,
    prompt: `Which is greater, ${sa} or ${sb}?`,
    choices: [sa, sb], answer: [sa, sb].indexOf(correct),
    explain: why
  };
}

/* Add or subtract with like denominators. Numerator-only answer. */
function likeDen(lvl, op) {
  const d = pick(DENOMS[lvl]);
  let x, y;
  if (op === 'add') {
    const room = lvl >= 5 ? d + Math.floor(d / 2) : d;   // level 5 may pass 1 whole
    x = ri(1, Math.max(1, room - 2));
    y = ri(1, Math.max(1, room - x - 1));
  } else {
    x = ri(2, d - 1);
    y = ri(1, x - 1);
  }
  const sym = op === 'add' ? '+' : '−';
  const ans = op === 'add' ? x + y : x - y;
  return {
    kind: 'numeric', skill: 'frac', level: lvl,
    flavor: pick(FLAVOR),
    prompt: 'Type the missing top number.',
    expr: `${x}/${d} ${sym} ${y}/${d} = ?/${d}`,
    answer: ans,
    hint: `The bottoms match, so leave the bottom alone at ${d} and just work the tops: ${x} ${sym} ${y}.`
  };
}

/* Simplest form. Answer is a fraction, so this one is multiple choice. */
/* Reducible fractions whose BEFORE and AFTER denominators are both legal. */
const REDUCIBLE = (() => {
  const out = [];
  for (const d of LEGAL) for (let n = 2; n < d; n++) {
    const g = gcd(n, d);
    if (g > 1 && isLegal(d / g)) out.push([n, d, n / g, d / g]);
  }
  return out;
})();

function simplify(lvl) {
  const pool = lvl <= 3 ? REDUCIBLE.filter(([, d]) => d <= 8) : REDUCIBLE;
  const [n, d, sn, sd] = pick(pool.length ? pool : REDUCIBLE);
  const g = gcd(n, d);
  const correct = `${sn}/${sd}`;
  /* Wrong answers: a half-done reduction, and near misses on legal denominators. */
  const distract = [`${n}/${d}`];
  for (const alt of LEGAL) if (alt !== sd && sn < alt) distract.push(`${sn}/${alt}`);
  if (sn + 1 < sd) distract.push(`${sn + 1}/${sd}`);
  const { choices, answer } = shuffled(correct, [...new Set(distract)].slice(0, 3));
  return {
    kind: 'choice', skill: 'frac', level: lvl,
    prompt: `Which one is ${n}/${d} in simplest form?`,
    choices, answer,
    explain: `${n} and ${d} both divide by ${g}. ${n} ÷ ${g} = ${sn} and ${d} ÷ ${g} = ${sd}, so ${sn}/${sd}.`
  };
}

/* Benchmark against 1/2 — the comparison trick worth owning. */
function benchmark(lvl) {
  const d = pick(DENOMS[lvl].filter(x => x >= 4 && isLegal(x)));
  let n = ri(1, d - 1);
  while (n * 2 === d) n = ri(1, d - 1);      // never exactly one half
  const more = n / d > 0.5;
  const half = d / 2;
  return {
    kind: 'choice', skill: 'frac', level: lvl,
    prompt: `Is ${n}/${d} more or less than 1/2?`,
    choices: ['More than 1/2', 'Less than 1/2'],
    answer: more ? 0 : 1,
    explain: `Half of ${d} is ${half % 1 === 0 ? half : d / 2}. The top number ${n} is ${more ? 'bigger' : 'smaller'} than that, so ${n}/${d} is ${more ? 'more' : 'less'} than 1/2.`
  };
}

export const FLAVOR = [
  'A chunk of the ring pile got split up. Work out the share.',
  'The block got mined into equal pieces. How much is that?',
  'Split the loot fairly, no arguing.',
  'Part of the stack, not the whole stack. How much?',
  'The pizza at the checkpoint came pre-sliced. Do the math.'
];

export const FRAC_META = {
  label: 'Fractions', world: 'Fraction Falls', hero: 'miner', color: 'frac'
};

/* Which builders are in play at each level, weighted by repetition. */
const PLAN = {
  1: [identify, identify, ofSet, compare],
  2: [identify, ofSet, ofSet, equivalent, compare],
  3: [ofSet, equivalent, compare, compare, i => likeDen(i, 'add')],
  4: [equivalent, i => likeDen(i, 'add'), i => likeDen(i, 'sub'), simplify, benchmark, ofSet],
  5: [i => likeDen(i, 'add'), i => likeDen(i, 'sub'), simplify, benchmark, equivalent, ofSet]
};

export function makeFrac(lvl) {
  lvl = Math.min(5, Math.max(1, lvl | 0 || 1));
  return pick(PLAN[lvl])(lvl);
}

/* Dedupe key: the visible question, so a round never repeats itself. */
const keyOf = q => `${q.kind}|${q.expr || ''}|${q.prompt || ''}`;

export function makeFracChunk(lvl, n = 8) {
  const out = [], seen = new Set();
  let guard = 0;
  while (out.length < n && guard++ < n * 40) {
    const q = makeFrac(lvl);
    const k = keyOf(q);
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(q);
  }
  return out;
}
