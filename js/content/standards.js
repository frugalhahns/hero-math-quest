/* Question banks built directly against the Common Core Grade 3 and Grade 4
   math standards (corestandards.org). The four-operation drills, Fraction
   Falls, Mystery Lab and Logic Lab already covered part of the list; this file
   fills in the standards that had nothing behind them.

   Every generator carries the standard code it answers to, so the grown-up
   screen can show coverage rather than asking anyone to take it on faith.

   Items reuse the existing question kinds only (numeric, choice, seq2, steps),
   with SVG from artkit.js for the standards that are about reading a picture. */

import { clockFace, barGraph, linePlot, tiledRect, dotArray, numberLine,
         angleArt, angleSplit, polygon, linePair,
         rectilinearL, pictograph, geoPrimitive } from './artkit.js';

const ri = (lo, hi) => lo + Math.floor(Math.random() * (hi - lo + 1));
const pick = arr => arr[Math.floor(Math.random() * arr.length)];
const gcd = (a, b) => (b ? gcd(b, a % b) : a);

/* The only denominators the Grade 3/4 fraction standards allow (3.NF and 4.NF
   footnotes). Wrong answers have to stay inside this list too. */
const LEGAL_DEN = [2, 3, 4, 5, 6, 8, 10, 12];

function shuffled(correct, distractors) {
  /* Dedupe across the whole set: a repeated option is a giveaway, and some
     generators can produce the same distractor twice for small numbers. */
  const all = [correct, ...[...new Set(distractors)].filter(d => d !== correct)];
  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [all[i], all[j]] = [all[j], all[i]];
  }
  return { choices: all, answer: all.indexOf(correct) };
}
const ch = (code, prompt, correct, distractors, explain, extra = {}) => {
  const { choices, answer } = shuffled(correct, distractors);
  return { kind: 'choice', code, prompt, choices, answer, explain, ...extra };
};
const num = (code, expr, answer, hint, extra = {}) =>
  ({ kind: 'numeric', code, expr, answer, hint, ...extra });

/* ================= GRADE 3: Operations & Algebraic Thinking ================= */

/* 3.OA.A.1 — a product is a number of equal groups, shown as an array. */
function g_product(lvl) {
  const rows = ri(2, lvl <= 2 ? 5 : 8), cols = ri(2, lvl <= 2 ? 6 : 9);
  return num('3.OA.A.1', '', rows * cols,
    `${rows} groups of ${cols}. Skip-count by ${cols}, ${rows} times.`,
    { art: dotArray(rows, cols), prompt: 'How many dots altogether?' });
}

/* 3.OA.A.2 — a quotient is sharing into equal groups. */
function g_quotient(lvl) {
  const d = ri(2, lvl <= 2 ? 6 : 9), q = ri(2, lvl <= 2 ? 8 : 12);
  const total = d * q;
  return num('3.OA.A.2', '', q,
    `Ask: ${d} times what equals ${total}? Skip-count by ${d}.`,
    { prompt: `${total} marbles are shared equally into ${d} bags. How many in each bag?` });
}

/* 3.OA.A.3 — equal groups, arrays and measurement word problems. */
function g_oaWord(lvl) {
  const a = ri(3, lvl <= 2 ? 7 : 12), b = ri(3, lvl <= 2 ? 8 : 12);
  const s = pick([
    [`${a} rows of chairs with ${b} chairs in each row. How many chairs?`, a * b],
    [`${a} packs of cards with ${b} cards in each pack. How many cards?`, a * b],
    [`A ribbon ${a * b} cm long is cut into ${a} equal pieces. How long is each piece?`, b]
  ]);
  return num('3.OA.A.3', '', s[1], 'Draw it as equal groups if that helps.', { prompt: s[0] });
}

/* 3.OA.A.4 and 3.OA.B.6 — the unknown in a multiplication or division equation. */
function g_unknownFactor(lvl) {
  const b = ri(2, lvl <= 2 ? 7 : 12), q = ri(2, lvl <= 2 ? 8 : 12);
  const total = b * q;
  const form = pick(['left', 'right', 'div']);
  if (form === 'div')
    return num('3.OA.B.6', `${total} ÷ ? = ${q}`, b,
      `Turn it around: ? × ${q} = ${total}.`, { prompt: 'Find the missing number.' });
  return num('3.OA.A.4', form === 'left' ? `${b} × ? = ${total}` : `? × ${q} = ${total}`,
    form === 'left' ? q : b,
    `Think of it as a division: ${total} ÷ ${form === 'left' ? b : q}.`,
    { prompt: 'Find the missing number.' });
}

/* 3.OA.B.5 — commutative and associative properties, no formal terms needed. */
function g_commutative() {
  const a = ri(3, 9), b = ri(3, 9);
  return ch('3.OA.B.5', `You already know ${a} × ${b} = ${a * b}. Which one must also be true?`,
    `${b} × ${a} = ${a * b}`,
    [`${b} × ${a} = ${a * b + b}`, `${a} + ${b} = ${a * b}`, `${b} ÷ ${a} = ${a * b}`],
    `Order does not change a product. ${a} groups of ${b} is the same total as ${b} groups of ${a}.`);
}

/* 3.OA.B.5 — the distributive property, as a break-apart. */
function g_distributive() {
  const a = ri(6, 9), b = ri(6, 9);
  const split = ri(2, b - 2);
  return num('3.OA.B.5', `${a} × ${b} = (${a} × ${split}) + (${a} × ?)`, b - split,
    `${split} plus what makes ${b}? Break ${b} into two easier pieces.`,
    { prompt: 'Break the big fact into two easy ones. What goes in the box?' });
}

/* 3.OA.D.9 — patterns in the tables, and why they hold. */
function g_arithPattern() {
  const opts = [
    ['Every answer in the 4 times table is...', 'Even', ['Odd', 'Always ending in 4', 'Prime'],
     '4 is even, and any number of groups of an even number is even. 4 × n splits into two equal addends.'],
    ['Every answer in the 5 times table ends in...', '0 or 5', ['2 or 7', 'Only 5', 'Only 0'],
     'Adding 5 lands you on a 0 or a 5, then back again, forever.'],
    ['An even number plus an even number is always...', 'Even', ['Odd', 'Sometimes odd', 'Prime'],
     'Both split into pairs with nothing left over, so the total does too.'],
    ['An odd number plus an odd number is always...', 'Even', ['Odd', 'Sometimes odd', 'Zero'],
     'Each has one left over. The two leftovers pair up.']
  ];
  const [p, c, d, e] = pick(opts);
  return ch('3.OA.D.9', p, c, d, e);
}

/* ================= GRADE 3: Number & Operations in Base Ten ================= */

/* 3.NBT.A.1 — rounding to the nearest 10 or 100. */
function g_round3(lvl) {
  const to = lvl <= 2 ? 10 : pick([10, 100]);
  const n = to === 10 ? ri(11, 99) : ri(105, 989);
  const ans = Math.round(n / to) * to;
  const half = to / 2;
  return num('3.NBT.A.1', '', ans,
    `Which multiple of ${to} is ${n} closer to? Halfway is ${Math.floor(n / to) * to + half}, and at halfway or above you round up.`,
    { prompt: `Round ${n} to the nearest ${to}.` });
}

/* 3.NBT.A.3 — one-digit times a multiple of ten. */
function g_multiple10() {
  const a = ri(2, 9), t = ri(2, 9) * 10;
  return num('3.NBT.A.3', `${a} × ${t}`, a * t,
    `Do ${a} × ${t / 10} first, then put the zero back on the end.`, { prompt: '' });
}

/* ================= GRADE 3: fractions on a number line ================= */

/* 3.NF.A.2 — locate a fraction on a number line. */
function g_fracLine(lvl) {
  const b = pick(lvl <= 2 ? [2, 3, 4] : [3, 4, 6, 8]);
  const a = ri(1, b - 1);
  const wrong = [`${a + 1 <= b ? a + 1 : a - 1}/${b}`, `${b - a}/${b}`];
  for (const alt of LEGAL_DEN) if (alt !== b && a < alt) wrong.push(`${a}/${alt}`);
  return ch('3.NF.A.2', 'What fraction is the dot sitting on?', `${a}/${b}`,
    [...new Set(wrong)].slice(0, 3),
    `0 to 1 is split into ${b} equal jumps, and the dot is ${a} jumps along, so ${a}/${b}.`,
    { art: numberLine(b, a) });
}

/* 3.NF.A.3c — whole numbers written as fractions. */
function g_wholeAsFraction() {
  const w = pick(LEGAL_DEN.filter(d => d <= 8));
  return pick([
    () => num('3.NF.A.3', `${w} = ?/1`, w, `Anything over 1 is just itself. ${w} wholes is ${w}/1.`,
      { prompt: 'Write the whole number as a fraction.' }),
    () => num('3.NF.A.3', `${w}/1 = ?`, w, `Dividing by 1 changes nothing.`,
      { prompt: 'Write the fraction as a whole number.' }),
    () => num('3.NF.A.3', `${w}/${w} = ?`, 1, `All ${w} parts out of ${w} is the whole thing, which is 1.`,
      { prompt: 'How many wholes is this?' })
  ])();
}

/* ================= GRADE 3: Measurement & Data ================= */

/* 3.MD.A.1 — read a clock to the minute. */
function g_readClock(lvl) {
  const h = ri(1, 12);
  const m = lvl <= 2 ? pick([0, 15, 30, 45]) : ri(1, 59);
  const fmt = mm => `${h}:${String(mm).padStart(2, '0')}`;
  const off = [];
  for (const d of [5, -5, 10, -10, 20]) {
    const mm = (m + d + 60) % 60;
    if (mm !== m) off.push(fmt(mm));
  }
  return ch('3.MD.A.1', 'What time does the clock show?', fmt(m), off.slice(0, 3),
    `The short hand is just past ${h}, and the long hand counts ${m} minutes past.`,
    { art: clockFace(h, m) });
}

/* 3.MD.A.1 — elapsed time in minutes. */
function g_elapsed(lvl) {
  const h = ri(1, 11), m1 = ri(0, 40);
  const gap = lvl <= 2 ? pick([10, 15, 20, 30]) : ri(5, 55);
  const t = mm => `${h + Math.floor((m1 + mm) / 60)}:${String((m1 + mm) % 60).padStart(2, '0')}`;
  return num('3.MD.A.1', '', gap,
    `Count up from ${t(0)} to ${t(gap)} in minutes. Jumping to the next hour first can help.`,
    { prompt: `Recess starts at ${t(0)} and ends at ${t(gap)}. How many minutes long is it?` });
}

/* 3.MD.A.2 — masses and liquid volumes in one step. */
function g_massVolume() {
  const s = pick([
    () => { const a = ri(2, 9), b = ri(2, 9);
      return [`A bottle holds ${a} liters. How many liters do ${b} bottles hold?`, a * b, 'liters']; },
    () => { const each = ri(20, 90), n = ri(2, 6);
      return [`One block has a mass of ${each} grams. What is the mass of ${n} blocks?`, each * n, 'grams']; },
    () => { const total = ri(2, 9) * 100, n = pick([2, 4, 5]);
      return [`A ${total} gram bag of sand is split evenly into ${n} cups. How many grams in each cup?`, total / n, 'grams']; },
    () => { const jug = ri(4, 9), used = ri(1, 3);
      return [`A jug had ${jug} liters. ${used} liters were poured out. How many liters are left?`, jug - used, 'liters']; }
  ])();
  return num('3.MD.A.2', '', s[1], `The answer is in ${s[2]}. One step only.`, { prompt: s[0] });
}

/* 3.MD.B.3 — read a scaled bar graph. */
function g_barGraph(lvl) {
  const scale = lvl <= 2 ? pick([2, 5]) : pick([5, 10]);
  const names = ['Cats', 'Dogs', 'Fish', 'Birds'];
  const vals = names.map(() => scale * ri(1, 6));
  const i = ri(0, 3);
  let j = ri(0, 3); while (j === i) j = ri(0, 3);
  const mode = pick(['more', 'total']);
  if (mode === 'total')
    return num('3.MD.B.3', '', vals.reduce((x, y) => x + y, 0),
      `Read each bar off the scale, then add all four.`,
      { art: barGraph(names, vals, scale), prompt: 'How many pets are there altogether?' });
  const hi = vals[i] >= vals[j] ? i : j, lo = hi === i ? j : i;
  return num('3.MD.B.3', '', vals[hi] - vals[lo],
    `${names[hi]} is ${vals[hi]} and ${names[lo]} is ${vals[lo]}. Subtract.`,
    { art: barGraph(names, vals, scale),
      prompt: `How many more ${names[hi].toLowerCase()} than ${names[lo].toLowerCase()}?` });
}

/* 3.MD.B.4 — a line plot marked in halves or fourths. */
function g_linePlot3() {
  const den = pick([2, 4]);
  const slots = den * 2 + 1;
  const counts = Array.from({ length: slots }, () => ri(0, 3));
  let at = ri(0, slots - 1);
  if (counts[at] === 0) counts[at] = ri(1, 3);
  const label = at % den === 0 ? String(at / den) : `${at}/${den}`;
  return num('3.MD.B.4', '', counts[at],
    'Count the X marks stacked above that mark.',
    { art: linePlot(den, counts, { unit: 'length in inches' }),
      prompt: `How many pencils measured ${label} inches?` });
}

/* 3.MD.C.5, C.6, C.7 and 3.MD.D.8 / 4.MD.A.3 — area and perimeter. */
function g_area(lvl) {
  const w = ri(2, lvl <= 2 ? 6 : 9), h = ri(2, lvl <= 2 ? 5 : 8);
  const mode = pick(lvl <= 2 ? ['count', 'count', 'perim'] : ['count', 'perim', 'missing', 'formula']);
  if (mode === 'count')
    return num('3.MD.C.6', '', w * h,
      `Count the squares, or notice it is ${h} rows of ${w} and multiply.`,
      { art: tiledRect(w, h), prompt: 'What is the area, in square units?' });
  if (mode === 'perim')
    return num('3.MD.D.8', '', 2 * (w + h),
      `Perimeter is all the way around: ${w} + ${h} + ${w} + ${h}.`,
      { art: tiledRect(w, h, { plain: true }), prompt: 'What is the perimeter, in units?' });
  if (mode === 'formula')
    return num('3.MD.C.7', '', w * h,
      `Area of a rectangle is length × width.`,
      { prompt: `A rectangle is ${w} units long and ${h} units wide. What is its area?` });
  return num('4.MD.A.3', '', h,
    `Area ÷ known side = the other side. ${w * h} ÷ ${w}.`,
    { prompt: `A rectangle has an area of ${w * h} square units and one side of ${w}. How long is the other side?` });
}

/* 3.MD.C.5 — what area actually measures, before any counting. */
function g_unitSquare() {
  const opts = [
    ['A square that is 1 unit on every side has an area of...', '1 square unit',
     ['4 square units', '1 unit', '2 square units'],
     'That square IS the unit of area. One of them covers exactly one square unit.'],
    ['Area measures...', 'How much flat space a shape covers',
     ['How far around a shape is', 'How tall a shape is', 'How many corners a shape has'],
     'Area is the covering. The distance around the outside is perimeter instead.'],
    ['A shape is covered by 12 unit squares with no gaps and no overlaps. Its area is...',
     '12 square units', ['12 units', '24 square units', '6 square units'],
     'Count the unit squares that cover it, with no gaps or overlaps. That count IS the area.']
  ];
  const [p, c, d, e] = pick(opts);
  return ch('3.MD.C.5', p, c, d, e);
}

/* 3.MD.C.7c — area as the distributive property. */
function g_areaSplit() {
  const a = ri(3, 8), b = ri(2, 5), c = ri(2, 5);
  return num('3.MD.C.7', `${a} × (${b} + ${c}) = (${a} × ${b}) + (${a} × ?)`, c,
    `Splitting the rectangle into two does not change its area.`,
    { prompt: 'One rectangle was cut into two. Fill in the box.' });
}

/* ================= GRADE 3: Geometry ================= */

/* 3.G.A.1 — shared attributes and quadrilateral categories. */
function g_shapeName() {
  const kinds = [
    ['square', 'Square', 'A quadrilateral with 4 equal sides and 4 right angles.'],
    ['rectangle', 'Rectangle', 'Four right angles, opposite sides equal.'],
    ['rhombus', 'Rhombus', 'Four equal sides, but the angles are not right angles.'],
    ['trapezoid', 'Trapezoid', 'A quadrilateral with exactly one pair of parallel sides.'],
    ['parallelogram', 'Parallelogram', 'Both pairs of opposite sides are parallel.'],
    ['pentagon', 'Pentagon', 'Five sides, so it is not a quadrilateral at all.'],
    ['hexagon', 'Hexagon', 'Six sides.']
  ];
  const [k, name, why] = pick(kinds);
  const others = kinds.filter(x => x[1] !== name).map(x => x[1]);
  for (let i = others.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [others[i], others[j]] = [others[j], others[i]];
  }
  return ch('3.G.A.1', 'What is this shape called?', name, others.slice(0, 3), why,
    { art: polygon(k) });
}

/* 3.G.A.1 — the category question, which is the real point of the standard. */
function g_quadCategory() {
  const opts = [
    ['Which is always a quadrilateral?', 'Square', ['Pentagon', 'Triangle', 'Hexagon'],
     'A quadrilateral is any shape with 4 sides. A square has 4, so every square is one.'],
    ['How many sides does every quadrilateral have?', '4', ['3', '5', '6'],
     'Quad means four. That is the only thing all of them share.'],
    ['A square is also a rectangle because...', 'It has 4 right angles', ['It is small', 'It is tilted', 'It has 3 sides'],
     'Rectangle means 4 right angles. A square has those, plus equal sides, so it is a special rectangle.']
  ];
  const [p, c, d, e] = pick(opts);
  return ch('3.G.A.1', p, c, d, e);
}

/* 3.G.A.2 — partition a shape, name one part as a unit fraction. */
function g_partition() {
  const b = pick([2, 3, 4, 6, 8]);
  const near = pick(LEGAL_DEN.filter(x => x !== b));
  return ch('3.G.A.2', `A shape is cut into ${b} equal parts. What fraction of the shape is ONE part?`,
    `1/${b}`, [`${b}/1`, `1/${near}`, `2/${b}`],
    `One part out of ${b} equal parts is 1/${b} of the area.`,
    { art: polygon('rectangle') });
}

/* ================= GRADE 4: Operations & Algebraic Thinking ================= */

/* 4.OA.A.1 — read a multiplication equation as a comparison. */
function g_timesAsMany() {
  const a = ri(3, 9), b = ri(3, 9);
  return num('4.OA.A.1', '', a,
    `"Times as many" is the multiplier. ${a} × ${b} = ${a * b}, so ${a * b} is ${a} times as many as ${b}.`,
    { prompt: `${a * b} is how many times as many as ${b}?` });
}

/* 4.OA.A.2 — multiplicative comparison word problems. */
function g_multCompare() {
  const base = ri(3, 12), k = ri(2, 6);
  return num('4.OA.A.2', '', base * k,
    `"${k} times as many" means multiply: ${base} × ${k}.`,
    { prompt: `Maya has ${base} stickers. Theo has ${k} times as many as Maya. How many does Theo have?` });
}

/* 4.OA.A.2 — telling a multiplicative comparison from an additive one. */
function g_compareType() {
  const base = ri(4, 10), k = ri(2, 5);
  const times = Math.random() < 0.5;
  const phrase = times ? `${k} times as many as` : `${k} more than`;
  const correct = times ? `${base} × ${k} = ${base * k}` : `${base} + ${k} = ${base + k}`;
  const other = times ? `${base} + ${k} = ${base + k}` : `${base} × ${k} = ${base * k}`;
  return ch('4.OA.A.2',
    `Sam has ${base} marbles. Dev has ${phrase} Sam. Which equation finds Dev's marbles?`,
    correct, [other, `${base} - ${k} = ${base - k}`, `${base} ÷ ${k}`],
    times ? '"Times as many" multiplies. "More than" would have added.'
          : '"More than" adds. "Times as many" would have multiplied.');
}

/* 4.OA.A.3 and 4.NBT.B.6 — a quotient with a remainder, one step at a time. */
function g_remainder(lvl) {
  const d = ri(3, 9);
  const q = lvl <= 2 ? ri(3, 12) : ri(11, 40);
  const r = ri(1, d - 1);
  const total = d * q + r;
  return {
    kind: 'steps', code: '4.NBT.B.6',
    title: 'Packing the crates',
    lines: [`There are ${total} apples.`, `Each crate holds exactly ${d} apples.`],
    question: `How many full crates, and how many apples left over?`,
    steps: [
      { label: `How many FULL crates of ${d}?`, answer: q },
      { label: 'How many apples left over?', answer: r }
    ],
    unit: 'apples left over',
    explain: `${total} ÷ ${d} = ${q} remainder ${r}.`
  };
}

/* 4.OA.A.3 — a remainder only means something once you read the question.
   Same division, but the answer needs one more crate for the leftovers. */
function g_interpretRemainder(lvl) {
  const d = ri(3, 9);
  const q = lvl <= 2 ? ri(3, 12) : ri(11, 30);
  const r = ri(1, d - 1);
  const total = d * q + r;
  return num('4.OA.A.3', '', q + 1,
    `${total} ÷ ${d} is ${q} with ${r} left over. Those ${r} still need a crate, so it takes one more.`,
    { prompt: `${total} apples are packed ${d} to a crate. How many crates are needed so that EVERY apple is packed?` });
}

/* 4.OA.B.4 — factor pairs, multiples, prime and composite. */
function g_factors(lvl) {
  const mode = pick(['pair', 'multiple', 'prime']);
  if (mode === 'pair') {
    const n = pick([12, 16, 18, 20, 24, 28, 30, 36, 40, 42, 48, 56, 60, 64, 72]);
    const divs = [];
    for (let i = 2; i * i <= n; i++) if (n % i === 0) divs.push(i);
    const f = pick(divs);
    const correct = `${f} × ${n / f}`;
    const bad = [];
    for (let t = 0; t < 40 && bad.length < 3; t++) {
      const x = ri(2, 12), y = ri(2, 12);
      if (x * y !== n && !bad.includes(`${x} × ${y}`)) bad.push(`${x} × ${y}`);
    }
    return ch('4.OA.B.4', `Which pair of factors multiplies to ${n}?`, correct, bad,
      `${f} × ${n / f} = ${n}, so both are factors of ${n}.`);
  }
  if (mode === 'multiple') {
    const d = ri(2, 9), yes = Math.random() < 0.5;
    const n = yes ? d * ri(2, 11) : d * ri(2, 11) + ri(1, d - 1);
    return ch('4.OA.B.4', `Is ${n} a multiple of ${d}?`, yes ? 'Yes' : 'No', [yes ? 'No' : 'Yes'],
      yes ? `${d} × ${n / d} = ${n}, so it lands exactly on ${n}.`
          : `Counting by ${d} skips right over ${n}. It leaves a remainder of ${n % d}.`);
  }
  const top = lvl <= 2 ? 30 : 60;
  const wantPrime = Math.random() < 0.5;
  let n, f;
  do {
    n = ri(4, top);
    f = 0;
    for (let i = 2; i * i <= n; i++) if (n % i === 0) { f = i; break; }
  } while ((f === 0) !== wantPrime);
  const isPrime = f === 0;
  return ch('4.OA.B.4', `Is ${n} prime or composite?`, isPrime ? 'Prime' : 'Composite',
    [isPrime ? 'Composite' : 'Prime'],
    isPrime ? `${n} has only 1 and ${n} as factors, so it is prime.`
            : `${n} divides by ${f} (${f} × ${n / f} = ${n}), so it has more than two factors.`);
}

/* 4.OA.C.5 — generate a pattern from a rule and notice a feature of it. */
function g_patternRule(lvl) {
  const start = ri(1, 9), step = ri(2, lvl <= 2 ? 5 : 9);
  const seq = [start, start + step, start + 2 * step];
  return { kind: 'seq2', code: '4.OA.C.5',
    prompt: `The rule is "add ${step}". Keep the pattern going.`,
    seq, answers: [start + 3 * step, start + 4 * step], rule: `add ${step}` };
}

/* ================= GRADE 4: Number & Operations in Base Ten ================= */

/* 4.NBT.A.1 — a digit is worth ten times the same digit one place right. */
function g_tenTimes() {
  const d = ri(2, 9);
  const val = d * 11 * Math.pow(10, pick([0, 1, 2]));   // e.g. 66, 660, 6600
  return num('4.NBT.A.1', '', 10,
    'Each place is worth ten times the place to its right. The answer is always ten.',
    { prompt: `Look at ${val.toLocaleString('en-US')}. The left ${d} is worth how many times the ${d} next to it on the right?` });
}

/* 4.NBT.A.2 — place value, expanded form and comparison. */
function g_placeValue(lvl) {
  const digits = Array.from({ length: lvl <= 2 ? 4 : 5 }, () => ri(1, 9));
  const n = Number(digits.join(''));
  const mode = pick(['value', 'expanded', 'compare']);
  if (mode === 'value') {
    const NAMES = ['ones', 'tens', 'hundreds', 'thousands', 'ten thousands'];
    const i = ri(0, digits.length - 1);
    const from_right = digits.length - 1 - i;
    const place = Math.pow(10, from_right);
    return num('4.NBT.A.2', '', digits[i] * place,
      `The digit in the ${NAMES[from_right]} place is ${digits[i]}, and it is worth ${digits[i]} × ${place.toLocaleString('en-US')}.`,
      { prompt: `In ${n.toLocaleString('en-US')}, what is the value of the digit in the ${NAMES[from_right]} place?` });
  }
  if (mode === 'expanded') {
    const parts = digits.map((d, i) => d * Math.pow(10, digits.length - 1 - i));
    const correct = parts.join(' + ');
    const wrong1 = parts.slice().reverse().join(' + ');
    const wrong2 = digits.join(' + ');
    const wrong3 = parts.map(p => p / 10).join(' + ');
    return ch('4.NBT.A.2', `Which is ${n.toLocaleString('en-US')} in expanded form?`,
      correct, [wrong1, wrong2, wrong3],
      `Each digit is worth its face value times its place.`);
  }
  let m = Number(digits.slice().reverse().join(''));
  if (m === n) m = n + ri(1, 900);
  const sym = n > m ? '>' : '<';
  return ch('4.NBT.A.2', `Compare: ${n.toLocaleString('en-US')} ___ ${m.toLocaleString('en-US')}`,
    sym, [sym === '>' ? '<' : '>', '='],
    `Line up the places and compare from the left. The first place where they differ decides it.`);
}

/* 4.NBT.A.3 — round to any place. */
function g_round4(lvl) {
  const to = pick(lvl <= 2 ? [10, 100] : [100, 1000, 10000]);
  const n = ri(to * 2 + 1, to * 40);
  const ans = Math.round(n / to) * to;
  return num('4.NBT.A.3', '', ans,
    `Look at the digit one place to the right of the ${to.toLocaleString('en-US')} place. 5 or more rounds up.`,
    { prompt: `Round ${n.toLocaleString('en-US')} to the nearest ${to.toLocaleString('en-US')}.` });
}

/* 4.NBT.B.5 — multi-digit multiplication. */
function g_bigMultiply(lvl) {
  if (lvl <= 2) { const a = ri(12, 99), b = ri(2, 9);
    return num('4.NBT.B.5', `${a} × ${b}`, a * b, `Break ${a} into tens and ones, multiply each by ${b}, then add.`, { prompt: '' }); }
  if (lvl <= 4) { const a = ri(101, 999), b = ri(2, 9);
    return num('4.NBT.B.5', `${a} × ${b}`, a * b, `Multiply the ones, then tens, then hundreds, and add the pieces.`, { prompt: '' }); }
  const a = ri(11, 49), b = ri(11, 29);
  return num('4.NBT.B.5', `${a} × ${b}`, a * b,
    `Two two-digit numbers: split ${b} into tens and ones, do two easier products, then add.`, { prompt: '' });
}

/* ================= GRADE 4: fractions ================= */

/* 4.NF.A.2 — compare fractions with unlike numerators AND denominators. */
function g_compareUnlike() {
  const pairs = [[1,3,1,2],[2,3,3,4],[1,4,2,5],[5,6,7,8],[2,5,1,2],[3,8,1,2],
                 [5,8,2,3],[3,5,2,3],[7,10,3,4],[4,6,5,8],[2,3,5,6],[1,3,2,5]];
  const [a, b, c, d] = pick(pairs);
  const sa = `${a}/${b}`, sc = `${c}/${d}`;
  const bigger = a / b > c / d ? sa : sc;
  const lcm = (b * d) / gcd(b, d);
  return ch('4.NF.A.2', `Which is greater, ${sa} or ${sc}?`, bigger, [bigger === sa ? sc : sa],
    `Give them the same bottom number: ${sa} = ${a * (lcm / b)}/${lcm} and ${sc} = ${c * (lcm / d)}/${lcm}. Now compare the tops.`);
}

/* 4.NF.B.3b — decompose a fraction into a sum of same-denominator parts. */
function g_decompose() {
  const d = pick([4, 5, 6, 8, 10]);
  const n = ri(3, d - 1);
  const k = ri(1, n - 1);
  const correct = `${k}/${d} + ${n - k}/${d}`;
  const other = pick(LEGAL_DEN.filter(x => x !== d && x > n - k));
  const bad = [`${k}/${d} + ${n - k}/${other}`, `${k}/${d} + ${n}/${d}`, `${n}/${d} + ${n}/${d}`]
    .filter(x => x !== correct);
  return ch('4.NF.B.3', `Which sum equals ${n}/${d}?`, correct, bad,
    `${k} parts plus ${n - k} parts makes ${n} parts, all of size 1/${d}. The bottom never changes.`);
}

/* 4.NF.B.3c — add and subtract mixed numbers with like denominators. */
function g_mixedNumber() {
  const d = pick([4, 5, 6, 8]);
  const w1 = ri(1, 4), w2 = ri(1, 4);
  const n1 = ri(1, d - 2), n2 = ri(1, d - 1 - n1);
  return num('4.NF.B.3', `${w1} ${n1}/${d} + ${w2} ${n2}/${d} = ${w1 + w2} ?/${d}`, n1 + n2,
    `Add the whole numbers, then add the fraction parts. The bottom stays ${d}.`,
    { prompt: 'Type the missing top number.' });
}

/* 4.NF.B.4 — a fraction times a whole number. */
function g_fracTimesWhole() {
  const d = pick([3, 4, 5, 6, 8]);
  const n = ri(1, d - 1), k = ri(2, 6);
  return pick([
    () => num('4.NF.B.4', `${k} × ${n}/${d} = ?/${d}`, k * n,
      `${k} lots of ${n}/${d}. Multiply the top by ${k}, leave the bottom alone.`,
      { prompt: 'Type the missing top number.' }),
    () => num('4.NF.B.4', `${n}/${d} = ${n} × 1/?`, d,
      `${n}/${d} is ${n} copies of the unit fraction 1/${d}.`,
      { prompt: 'Every fraction is a stack of unit fractions. Fill the box.' })
  ])();
}

/* ================= GRADE 4: decimals ================= */

/* 4.NF.C.5 — tenths rewritten as hundredths, then added. */
function g_tenthsHundredths() {
  const t = ri(1, 9), h = ri(1, 9) * (Math.random() < 0.5 ? 1 : 10);
  return pick([
    () => num('4.NF.C.5', `${t}/10 = ?/100`, t * 10,
      `Ten times as many pieces, each ten times smaller. ${t} × 10.`, { prompt: '' }),
    () => num('4.NF.C.5', `${t}/10 + ${h}/100 = ?/100`, t * 10 + h,
      `First swap ${t}/10 for ${t * 10}/100, then add the tops.`, { prompt: '' })
  ])();
}

/* 4.NF.C.6 — decimal notation for tenths and hundredths. */
function g_decimalNotation() {
  const hundredths = Math.random() < 0.6;
  const n = hundredths ? ri(11, 99) : ri(1, 9);
  const dec = hundredths ? (n / 100).toFixed(2) : (n / 10).toFixed(1);
  const frac = hundredths ? `${n}/100` : `${n}/10`;
  if (Math.random() < 0.5) {
    const wrong = hundredths
      ? [(n / 10).toFixed(1), `0.0${n}`, `${n}.0`]
      : [`0.0${n}`, `${n}.0`, `0.${n}${n}`];
    return ch('4.NF.C.6', `Write ${frac} as a decimal.`, dec, wrong,
      `${frac} means ${n} ${hundredths ? 'hundredths' : 'tenths'}, which is written ${dec}.`);
  }
  /* Tenths and hundredths are the only denominators 4.NF.C works in. */
  const wrongF = hundredths
    ? [`${n}/10`, `${Math.floor(n / 10) || 1}/100`, `${n}0/100`]
    : [`${n}/100`, `${n}0/100`, `${n}00/100`];
  return ch('4.NF.C.6', `Write ${dec} as a fraction.`, frac, wrongF,
    `The last digit sits in the ${hundredths ? 'hundredths' : 'tenths'} place, so the bottom is ${hundredths ? 100 : 10}.`);
}

/* 4.NF.C.7 — compare two decimals to hundredths. */
function g_compareDecimals() {
  let a = ri(1, 99) / 100, b = ri(1, 99) / 100;
  while (a === b) b = ri(1, 99) / 100;
  const sa = a.toFixed(2), sb = b.toFixed(2);
  const bigger = a > b ? sa : sb;
  return ch('4.NF.C.7', `Which is greater, ${sa} or ${sb}?`, bigger, [bigger === sa ? sb : sa],
    `Compare tenths first. If they tie, compare hundredths. ${sa} is ${Math.round(a * 100)} hundredths and ${sb} is ${Math.round(b * 100)} hundredths.`);
}

/* ================= GRADE 4: measurement ================= */

/* 4.MD.A.1 — convert from a larger unit to a smaller one. */
function g_convert() {
  const table = [['ft', 'in', 12], ['yd', 'ft', 3], ['m', 'cm', 100], ['km', 'm', 1000],
                 ['kg', 'g', 1000], ['l', 'ml', 1000], ['hr', 'min', 60], ['min', 'sec', 60],
                 ['lb', 'oz', 16]];
  const [big, small, f] = pick(table);
  const n = ri(2, 9);
  return num('4.MD.A.1', `${n} ${big} = ? ${small}`, n * f,
    `1 ${big} is ${f} ${small}, so multiply by ${f}.`, { prompt: '' });
}

/* 4.MD.A.2 — money, distance and time word problems. */
function g_measureWord() {
  const s = pick([
    () => { const price = ri(2, 9) * 25, n = ri(2, 5);
      return [`A sticker pack costs ${price} cents. How many cents for ${n} packs?`, price * n]; },
    () => { const paid = ri(5, 9) * 100, cost = ri(2, 9) * 45;
      return [`You pay with ${paid} cents and the snack costs ${cost} cents. How many cents change?`, paid - cost]; },
    () => { const km = ri(2, 9), trips = ri(2, 5);
      return [`A bus route is ${km} km each way. How many km for ${trips} round trips?`, km * 2 * trips]; },
    () => { const min = ri(2, 6) * 15;
      return [`A show lasts ${min} minutes. How many seconds is that?`, min * 60]; }
  ])();
  return num('4.MD.A.2', '', s[1], 'Work out what one of them is worth first.', { prompt: s[0] });
}

/* 4.MD.B.4 — line plot in eighths, with a subtraction across it. */
function g_linePlot4() {
  const den = 8, slots = den + 1;
  const counts = Array.from({ length: slots }, () => 0);
  const marks = [];
  for (let k = 0; k < 5; k++) { const at = ri(0, slots - 1); counts[at]++; marks.push(at); }
  const lo = Math.min(...marks), hi = Math.max(...marks);
  if (hi === lo) { counts[slots - 1]++; marks.push(slots - 1); }
  const lo2 = Math.min(...marks), hi2 = Math.max(...marks);
  return num('4.MD.B.4', `${hi2}/${den} − ${lo2}/${den} = ?/${den}`, hi2 - lo2,
    `Find the furthest right X and the furthest left X, then subtract the tops.`,
    { art: linePlot(den, counts, { unit: 'length in inches' }),
      prompt: 'How much longer is the longest bug than the shortest? Type the top number.' });
}

/* ================= GRADE 4: angles and geometry ================= */

/* 4.G.A.1 and 4.MD.C.5 — name an angle by size. */
function g_angleType() {
  const kind = pick(['acute', 'right', 'obtuse']);
  const deg = kind === 'right' ? 90 : kind === 'acute' ? ri(20, 80) : ri(100, 160);
  return ch('4.G.A.1', 'What kind of angle is this?',
    kind === 'right' ? 'Right' : kind === 'acute' ? 'Acute' : 'Obtuse',
    ['Right', 'Acute', 'Obtuse'].filter(x => x.toLowerCase() !== kind),
    kind === 'right' ? 'A square corner, exactly 90 degrees.'
      : kind === 'acute' ? 'Smaller than a square corner, so under 90 degrees.'
      : 'Wider open than a square corner, so over 90 degrees.',
    { art: angleArt(deg) });
}

/* 4.MD.C.5b — an angle that turns through n one-degree angles. */
function g_oneDegree() {
  const n = pick([30, 45, 60, 90, 120, 135, 150]);
  return num('4.MD.C.5', '', n,
    'One one-degree angle is 1/360 of a full turn. n of them measure n degrees.',
    { prompt: `An angle turns through ${n} one-degree angles. What is its measure, in degrees?` });
}

/* 4.MD.C.7 — angle measure is additive. */
function g_angleAdd() {
  const a1 = pick([20, 25, 30, 35, 40, 45, 50, 55, 60]);
  const a2 = pick([20, 25, 30, 35, 40, 45, 50]);
  const total = a1 + a2;
  return num('4.MD.C.7', `${total}° − ${a1}° = ?`, a2,
    `The two small angles add up to the big one, so subtract to find the missing piece.`,
    { art: angleSplit(a1, a2, `${a1}°`, '?'),
      prompt: `The whole angle is ${total}°. The bottom part is ${a1}°. How many degrees is the top part?` });
}

/* 4.G.A.1 and 4.G.A.2 — parallel, perpendicular, intersecting. */
function g_linePair() {
  const kind = pick(['parallel', 'perpendicular', 'intersecting']);
  const label = { parallel: 'Parallel', perpendicular: 'Perpendicular', intersecting: 'Intersecting but not perpendicular' };
  return ch('4.G.A.2', 'How would you describe these two lines?', label[kind],
    Object.values(label).filter(v => v !== label[kind]),
    kind === 'parallel' ? 'They never meet and stay the same distance apart.'
      : kind === 'perpendicular' ? 'They cross and make a square corner, marked with the little box.'
      : 'They cross, but the corners are not square.',
    { art: linePair(kind) });
}

/* 4.G.A.2 — right triangles as a category. */
function g_rightTriangle() {
  const kind = pick(['righttri', 'acutetri', 'obtusetri']);
  const isRight = kind === 'righttri';
  return ch('4.G.A.2', 'Is this a right triangle?', isRight ? 'Yes' : 'No', [isRight ? 'No' : 'Yes'],
    isRight ? 'One of its corners is a square corner, so it is a right triangle.'
            : 'None of its corners is a square corner, so it is not a right triangle.',
    { art: polygon(kind) });
}

/* 4.G.A.3 — lines of symmetry. */
function g_symmetry() {
  const cases = [
    ['square', [[80, 10], [80, 130]], true, 'Folding a square down the middle matches it up exactly.'],
    ['rectangle', [[90, 22], [90, 120]], true, 'A rectangle folds in half down the middle and matches.'],
    ['rhombus', [[80, 10], [80, 130]], true, 'A rhombus folds along its diagonal and matches.'],
    ['parallelogram', [[84, 18], [84, 122]], false, 'A slanted parallelogram does NOT match when folded down the middle. Its symmetry is a turn, not a fold.'],
    ['trapezoid', [[90, 18], [90, 122]], true, 'This trapezoid is even on both sides, so the middle fold matches.'],
    ['righttri', [[24, 24], [136, 120]], false, 'Folding this right triangle along that line does not match the two halves.']
  ];
  const [k, line, yes, why] = pick(cases);
  return ch('4.G.A.3', 'Is the dashed line a line of symmetry?', yes ? 'Yes' : 'No', [yes ? 'No' : 'Yes'],
    why, { art: polygon(k, { mirror: line }) });
}


/* ================= sub-parts that the first pass missed ================= */

/* 3.NF.A.3a — equivalent means the SAME POINT on the number line. */
function g_samePoint(lvl) {
  const pairs = [[1, 2, 2, 4], [1, 2, 3, 6], [1, 2, 4, 8], [1, 2, 5, 10], [1, 2, 6, 12],
                 [1, 3, 2, 6], [1, 3, 4, 12], [2, 3, 4, 6], [2, 3, 8, 12],
                 [1, 4, 2, 8], [3, 4, 6, 8], [1, 6, 2, 12], [1, 5, 2, 10]];
  const [sn, sd, bn, bd] = pick(pairs);
  const wrong = [];
  for (const alt of LEGAL_DEN) if (alt !== bd && sn < alt) wrong.push(`${sn}/${alt}`);
  if (bn + 1 <= bd) wrong.push(`${bn + 1}/${bd}`);
  return ch('3.NF.A.3', `The dot sits on ${bn}/${bd}. Which fraction is at the SAME point?`,
    `${sn}/${sd}`, [...new Set(wrong)].slice(0, 3),
    `${sn}/${sd} and ${bn}/${bd} land on exactly the same spot, so they are equal. Same point means same number.`,
    { art: numberLine(bd, bn) });
}

/* 3.MD.C.7d — area is additive: break the L into two rectangles and add. */
function g_areaAdditive(lvl) {
  const w = ri(4, lvl <= 2 ? 6 : 9);
  const h1 = ri(1, 3), h2 = ri(1, 3);
  const w2 = ri(2, w - 1);
  const total = w * h1 + w2 * h2;
  return num('3.MD.C.7', '', total,
    `Cut it into two rectangles: ${w} × ${h1} = ${w * h1} and ${w2} × ${h2} = ${w2 * h2}. Areas add up, so ${w * h1} + ${w2 * h2}.`,
    { art: rectilinearL(w, h1, w2, h2),
      prompt: 'What is the total area of this shape, in square units?' });
}

/* 4.NF.B.3d — the same like-denominator adding, but inside a word problem. */
function g_fracWord() {
  const d = pick([4, 5, 6, 8, 10, 12]);
  const a = ri(1, d - 2), b = ri(1, d - 1 - a);
  const add = Math.random() < 0.6;
  if (add)
    return num('4.NF.B.3', '', a + b,
      `Same bottom number, so add just the tops: ${a} + ${b}. The answer is ${a + b}/${d}.`,
      { prompt: `Ravi ate ${a}/${d} of a pizza and Mia ate ${b}/${d} of the same pizza. How much did they eat together? Type the top number of the answer over ${d}.` });
  const big = a + b;
  return num('4.NF.B.3', '', b,
    `Same bottom number, so subtract the tops: ${big} − ${a}. The answer is ${b}/${d}.`,
    { prompt: `A jug had ${big}/${d} of a litre in it. Someone drank ${a}/${d} of a litre. How much is left? Type the top number of the answer over ${d}.` });
}

/* 4.NF.B.4c — multiplying a fraction by a whole number, in a word problem. */
function g_fracTimesWord() {
  const d = pick([3, 4, 5, 6, 8]);
  const n = ri(1, d - 1), k = ri(2, 6);
  const s = pick([
    `Each person at the party eats ${n}/${d} of a pound of cheese. There are ${k} people. How many ${d}ths of a pound is that in total?`,
    `One lap of the track is ${n}/${d} of a mile. You run ${k} laps. How many ${d}ths of a mile did you run?`,
    `A recipe needs ${n}/${d} of a cup of flour. You make it ${k} times. How many ${d}ths of a cup do you need?`
  ]);
  return num('4.NF.B.4', '', n * k,
    `${k} lots of ${n}/${d} is ${k} × ${n} = ${n * k} pieces, each of size 1/${d}. So ${n * k}/${d}.`,
    { prompt: s });
}

/* 3.MD.B.3 — the standard asks for a picture graph as well as a bar graph. */
function g_pictograph(lvl) {
  const per = lvl <= 2 ? pick([2, 5]) : pick([5, 10]);
  const names = ['Red', 'Blue', 'Green'];
  const vals = names.map(() => per * ri(1, 6));
  const i = ri(0, 2);
  let j = ri(0, 2); while (j === i) j = ri(0, 2);
  const hi = vals[i] >= vals[j] ? i : j, lo = hi === i ? j : i;
  if (Math.random() < 0.5)
    return num('3.MD.B.3', '', vals[hi] - vals[lo],
      `Each circle stands for ${per}, so count the circles and multiply before subtracting.`,
      { art: pictograph(names, vals, per),
        prompt: `How many more ${names[hi].toLowerCase()} than ${names[lo].toLowerCase()}?` });
  return num('3.MD.B.3', '', vals.reduce((x, y) => x + y, 0),
    `Each circle is worth ${per}. Count all the circles, then multiply by ${per}.`,
    { art: pictograph(names, vals, per), prompt: 'How many votes altogether?' });
}

/* 4.G.A.1 — the vocabulary half of the standard: point, line, segment, ray. */
function g_geoName() {
  const kind = pick(['point', 'line', 'segment', 'ray']);
  const label = { point: 'A point', line: 'A line', segment: 'A line segment', ray: 'A ray' };
  const why = {
    point: 'Just a single position. No length at all.',
    line: 'Arrows on BOTH ends: it keeps going forever in both directions.',
    segment: 'Two endpoints, so it stops at both ends. It has a length you could measure.',
    ray: 'One endpoint and one arrow: it starts somewhere and goes on forever one way.'
  };
  return ch('4.G.A.1', 'What is this called?', label[kind],
    Object.values(label).filter(v => v !== label[kind]), why[kind],
    { art: geoPrimitive(kind) });
}

/* 4.NBT.A.2 — number names, the part of the standard between numerals and
   expanded form. Word form only goes to the hundred thousands here. */
const ONES = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
  'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen',
  'eighteen', 'nineteen'];
const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

function under1000(n) {
  if (n === 0) return '';
  const parts = [];
  if (n >= 100) { parts.push(ONES[Math.floor(n / 100)] + ' hundred'); n %= 100; }
  if (n >= 20) { parts.push(TENS[Math.floor(n / 10)] + (n % 10 ? '-' + ONES[n % 10] : '')); }
  else if (n > 0) parts.push(ONES[n]);
  return parts.join(' ');
}

export function numberName(n) {
  if (n === 0) return 'zero';
  const th = Math.floor(n / 1000), rest = n % 1000;
  const out = [];
  if (th) out.push(under1000(th) + ' thousand');
  if (rest) out.push(under1000(rest));
  return out.join(' ');
}

function g_numberName(lvl) {
  const n = lvl <= 2 ? ri(1001, 9999) : ri(10001, 999999);
  const correct = numberName(n);
  /* Near misses that a kid actually makes: a place slipped, or digits swapped. */
  const cands = [numberName(n * 10 % 1000000 || n + 1000), numberName(Math.floor(n / 10) || 1),
                 numberName(n + (n % 10 === 9 ? 1000 : 100))];
  const bad = [...new Set(cands)].filter(x => x && x !== correct).slice(0, 3);
  return ch('4.NBT.A.2', `How do you write ${n.toLocaleString('en-US')} in words?`, correct, bad,
    `Read the thousands first, then the rest: ${correct}.`);
}

/* 4.OA.B.4 — "find ALL factor pairs", so ask how many there are. */
function g_factorPairCount(lvl) {
  const n = pick(lvl <= 2 ? [12, 16, 18, 20, 24, 28, 30]
                          : [24, 30, 36, 40, 42, 48, 56, 60, 64, 72, 100]);
  let count = 0;
  for (let i = 1; i * i <= n; i++) if (n % i === 0) count++;
  const pairs = [];
  for (let i = 1; i * i <= n; i++) if (n % i === 0) pairs.push(`${i}×${n / i}`);
  return num('4.OA.B.4', '', count,
    `Work up from 1: ${pairs.join(', ')}. That is ${count} ${count === 1 ? 'pair' : 'pairs'}.`,
    { prompt: `How many different factor pairs does ${n} have? (1 × ${n} counts as one.)` });
}

/* 4.MD.A.1 — the two-column conversion table the standard asks for. */
function g_convTable() {
  const table = [['ft', 'in', 12], ['yd', 'ft', 3], ['m', 'cm', 100], ['kg', 'g', 1000],
                 ['hr', 'min', 60], ['min', 'sec', 60], ['lb', 'oz', 16], ['l', 'ml', 1000]];
  const [big, small, f] = pick(table);
  const start = ri(1, 4);
  const rows = [start, start + 1, start + 2].map(k => `(${k}, ${k * f})`).join(', ');
  const next = start + 3;
  return num('4.MD.A.1', '', next * f,
    `Every row multiplies the ${big} by ${f}. So row ${next} is ${next} × ${f}.`,
    { prompt: `A conversion table for ${big} and ${small} lists the pairs ${rows}, ... What is the second number in the pair that starts with ${next}?` });
}

/* ================= tracks =================
   One track per playable world. `codes` is the list of standards that track is
   answerable for; the grown-up screen reads it, so keep it honest. */

export const TRACKS = [
  { id: 'groups', label: 'Groups & Arrays', grade: '3', hero: 'webhero', color: 'spidey',
    blurb: 'What multiplying and dividing actually mean',
    codes: ['3.OA.A.1', '3.OA.A.2', '3.OA.A.3', '3.OA.A.4', '3.OA.B.5', '3.OA.B.6', '3.OA.D.9'],
    gens: [g_product, g_quotient, g_oaWord, g_unknownFactor, g_unknownFactor,
           g_commutative, g_distributive, g_arithPattern] },

  { id: 'place', label: 'Place Value Peak', grade: '3-4', hero: 'miner', color: 'mine',
    blurb: 'Rounding, big numbers, remainders',
    codes: ['3.NBT.A.1', '3.NBT.A.3', '4.NBT.A.1', '4.NBT.A.2', '4.NBT.A.3', '4.NBT.B.5', '4.NBT.B.6'],
    gens: [g_round3, g_multiple10, g_tenTimes, g_placeValue, g_numberName,
           g_round4, g_bigMultiply, g_remainder] },

  { id: 'fracfront', label: 'Fraction Frontier', grade: '3-4', hero: 'speedster', color: 'frac',
    blurb: 'Fractions on a line, mixed numbers, times a whole',
    codes: ['3.NF.A.2', '3.NF.A.3', '4.NF.A.2', '4.NF.B.3', '4.NF.B.4'],
    gens: [g_fracLine, g_samePoint, g_wholeAsFraction, g_compareUnlike,
           g_decompose, g_mixedNumber, g_fracTimesWhole, g_fracWord, g_fracTimesWord] },

  { id: 'decimal', label: 'Decimal Depot', grade: '4', hero: 'sparkmouse', color: 'poke',
    blurb: 'Tenths, hundredths and decimal points',
    codes: ['4.NF.C.5', '4.NF.C.6', '4.NF.C.7'],
    gens: [g_tenthsHundredths, g_decimalNotation, g_decimalNotation, g_compareDecimals] },

  { id: 'clock', label: 'Clock Tower', grade: '3-4', hero: 'speedster', color: 'sonic',
    blurb: 'Telling time, elapsed minutes, units',
    codes: ['3.MD.A.1', '3.MD.A.2', '4.MD.A.1', '4.MD.A.2'],
    gens: [g_readClock, g_readClock, g_elapsed, g_massVolume, g_convert,
           g_convTable, g_measureWord] },

  { id: 'data', label: 'Data Depot', grade: '3-4', hero: 'webhero', color: 'logic',
    blurb: 'Bar graphs and line plots',
    codes: ['3.MD.B.3', '3.MD.B.4', '4.MD.B.4'],
    gens: [g_barGraph, g_pictograph, g_pictograph, g_linePlot3, g_linePlot4] },

  { id: 'area', label: 'Area Arena', grade: '3-4', hero: 'miner', color: 'mystery',
    blurb: 'Area, perimeter and unit squares',
    codes: ['3.MD.C.5', '3.MD.C.6', '3.MD.C.7', '3.MD.D.8', '4.MD.A.3'],
    gens: [g_area, g_area, g_areaSplit, g_areaAdditive, g_unitSquare] },

  { id: 'shapes', label: 'Shape Shrine', grade: '3-4', hero: 'miner', color: 'detective',
    blurb: 'Quadrilaterals, lines and symmetry',
    codes: ['3.G.A.1', '3.G.A.2', '4.G.A.2', '4.G.A.3'],
    gens: [g_shapeName, g_quadCategory, g_partition, g_rightTriangle, g_symmetry, g_linePair] },

  { id: 'angles', label: 'Angle Academy', grade: '4', hero: 'sparkmouse', color: 'story',
    blurb: 'Angle types, degrees and adding angles',
    /* 4.MD.C.6 (measure and sketch with a protractor) is deliberately absent:
       it needs a real protractor, not a tap target. Left on paper. */
    codes: ['4.MD.C.5', '4.MD.C.7', '4.G.A.1'],
    gens: [g_angleType, g_geoName, g_oneDegree, g_angleAdd] },

  { id: 'factors', label: 'Factor Forest', grade: '4', hero: 'webhero', color: 'std',
    blurb: 'Times as many, factors, primes, patterns',
    codes: ['4.OA.A.1', '4.OA.A.2', '4.OA.A.3', '4.OA.B.4', '4.OA.C.5'],
    gens: [g_timesAsMany, g_multCompare, g_compareType, g_factors, g_factorPairCount,
           g_interpretRemainder, g_patternRule] }
];

export const TRACK_BY_ID = Object.fromEntries(TRACKS.map(t => [t.id, t]));

/* Skill key for the adaptive level, kept separate per track. */
export const skillKey = id => 'std_' + id;

export function makeStdItem(trackId, lvl) {
  const t = TRACK_BY_ID[trackId];
  lvl = Math.min(5, Math.max(1, lvl | 0 || 1));
  const item = pick(t.gens)(lvl);
  item.level = lvl;
  item.skill = skillKey(trackId);
  return item;
}

const keyOf = q => `${q.kind}|${q.code}|${q.expr || ''}|${q.prompt || ''}|${(q.choices || []).join(',')}`;

export function makeStdChunk(trackId, lvl, n = 8) {
  const out = [], seen = new Set();
  let guard = 0;
  while (out.length < n && guard++ < n * 60) {
    const q = makeStdItem(trackId, lvl);
    const k = keyOf(q);
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(q);
  }
  return out;
}

/* Every standard code any track can produce, for the coverage screen. */
export const ALL_CODES = [...new Set(TRACKS.flatMap(t => t.codes))].sort();
