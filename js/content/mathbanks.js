/* Math fact banks. Curated rows are lifted straight from the printed
   worksheets so the game matches the paper practice, then generators keep
   the well from ever running dry. Levels 1..5 mirror Mon -> Boss-Friday. */

export const CURATED = {
  add: {
    1: [[17,19],[27,16],[8,18],[18,9],[23,17],[18,12],[33,4],[21,8],[15,4],[33,19],[28,8],[35,12],
        [24,18],[19,26],[31,48],[42,39],[11,9],[26,14],[19,13],[22,17]],
    2: [[14,32],[30,23],[10,34],[28,20],[58,32],[54,31],[40,29],[58,18],[38,25],[45,29],[40,14],[46,25],
        [37,45],[53,29],[68,17],[76,15],[36,44],[41,30]],
    3: [[45,60],[71,51],[54,49],[61,35],[80,59],[36,27],[78,35],[53,28],[26,48],[55,60],[74,39],[22,60],
        [31,78],[44,81],[69,58],[19,87]],
    4: [[177,62],[159,85],[196,100],[173,90],[97,89],[162,73],[81,141],[68,146],[116,136],[77,117],[53,134],[176,145],
        [208,740],[103,839],[282,619]],
    5: [[427,244],[421,281],[223,267],[272,371],[286,187],[467,274],[280,330],[471,335],[105,290],[336,110],[487,289],[209,169],
        [836,369],[261,564],[612,880]]
  },
  sub: {
    1: [[24,12],[25,18],[26,13],[33,20],[42,3],[48,35],[48,12],[39,15],[29,17],[23,3],[18,12],[26,20],
        [20,18],[45,28],[58,22],[31,17],[36,19],[27,14]],
    2: [[68,25],[61,31],[46,13],[32,22],[45,4],[47,29],[48,3],[53,21],[32,8],[51,40],[68,42],[53,13],
        [52,27],[63,19],[54,14],[48,30],[47,46],[24,22],[27,17],[60,35]],
    3: [[65,35],[85,53],[60,13],[82,5],[54,26],[42,33],[79,26],[51,8],[72,43],[64,2],[70,15],[67,9],
        [81,34],[90,46],[77,39],[100,63]],
    4: [[225,25],[277,165],[206,104],[177,141],[216,105],[244,104],[261,175],[263,187],[143,1],[296,122],[259,123],[143,89],
        [356,291],[200,176],[719,303]],
    5: [[458,187],[286,162],[380,87],[418,21],[529,195],[459,40],[326,164],[300,166],[592,56],[538,165],[593,353],[475,120],
        [505,427],[752,643],[980,265]]
  },
  mul: {
    1: [[2,6],[5,4],[3,5],[2,9],[5,6],[3,4],[2,2],[5,3],[5,1],[3,3],[4,5],[3,2],[5,2],[2,4],[4,4]],
    2: [[9,5],[8,9],[7,3],[9,3],[4,6],[4,8],[8,5],[10,7],[6,8],[9,4],[7,5],[6,3],[6,4],[3,7],[7,4],[10,3],[8,10]],
    3: [[3,6],[7,11],[9,10],[4,7],[11,11],[10,7],[3,9],[7,3],[12,9],[8,12],[6,5],[8,6],[6,6]],
    4: [[7,9],[8,11],[6,12],[12,10],[9,10],[11,6],[7,10],[11,4],[12,11],[11,9],[5,12],[11,5],[6,10]],
    5: [[25,6],[25,7],[16,9],[14,3],[14,2],[11,3],[12,12],[15,6],[24,4],[13,7],[18,5],[22,4]]
  },
  div: {
    1: [[10,2],[40,5],[14,7],[8,4],[12,4],[21,3],[30,5],[16,8],[12,2],[20,5],[70,10],[15,3],[18,2],[30,10],[12,3],[5,5]],
    2: [[24,8],[72,8],[21,7],[28,4],[27,9],[90,9],[28,7],[25,5],[30,6],[56,8],[24,4],[40,4],[60,10],[88,11],[35,7],[60,6],[72,8]],
    3: [[30,5],[99,9],[42,6],[36,6],[9,3],[49,7],[45,9],[45,5],[80,10],[95,5],[75,3],[42,3]],
    4: [[50,5],[48,4],[54,9],[44,4],[60,5],[72,6],[48,6],[80,10],[128,8],[100,4],[72,4],[25,5]],
    5: [[143,11],[78,6],[144,12],[65,5],[120,10],[120,12],[54,6],[90,10],[60,4],[132,11],[156,12],[169,13]]
  }
};

const OPS = {
  add: { sym: '+', calc: (a, b) => a + b },
  sub: { sym: '−', calc: (a, b) => a - b },
  mul: { sym: '×', calc: (a, b) => a * b },
  div: { sym: '÷', calc: (a, b) => a / b }
};

const ri = (lo, hi) => lo + Math.floor(Math.random() * (hi - lo + 1));
const pick = arr => arr[Math.floor(Math.random() * arr.length)];

/* Procedural fallbacks, tuned to the same level bands. */
function gen(skill, lvl) {
  if (skill === 'add') {
    const bands = { 1: [[12, 40], [8, 25]], 2: [[10, 60], [10, 45]], 3: [[22, 90], [25, 70]],
                    4: [[53, 199], [60, 150]], 5: [[105, 490], [110, 340]] };
    const [[al, ah], [bl, bh]] = bands[lvl];
    return [ri(al, ah), ri(bl, bh)];
  }
  if (skill === 'sub') {
    const bands = { 1: [10, 48], 2: [24, 68], 3: [42, 100], 4: [143, 296], 5: [286, 592] };
    const [lo, hi] = bands[lvl];
    const a = ri(lo, hi);
    return [a, ri(1, Math.max(1, a - 1))];
  }
  if (skill === 'mul') {
    const bands = { 1: [[2, 5], [1, 6]], 2: [[3, 10], [2, 10]], 3: [[3, 12], [3, 11]],
                    4: [[5, 12], [4, 12]], 5: [[11, 25], [3, 9]] };
    const [[al, ah], [bl, bh]] = bands[lvl];
    return [ri(al, ah), ri(bl, bh)];
  }
  // div: build from a clean product so it always divides evenly
  const bands = { 1: [[2, 5], [2, 10]], 2: [[3, 9], [3, 11]], 3: [[3, 10], [3, 12]],
                  4: [[4, 12], [4, 12]], 5: [[6, 13], [8, 13]] };
  const [[dl, dh], [ql, qh]] = bands[lvl];
  const d = ri(dl, dh), q = ri(ql, qh);
  return [d * q, d];
}

export const FLAVOR = {
  add: [
    'Rings are scattered on the loop-de-loop. Grab them all!',
    'Two ring boxes cracked open at once. How many total?',
    'Speed shoes doubled the ring count. Add it up!',
    'A checkpoint bonus just landed. Total the rings.'
  ],
  sub: [
    'A creeper blew up part of your stack. How many blocks are left?',
    'You used some blocks on a wall. Count what remains.',
    'Lava ate part of your chest. What survived?',
    'You traded some blocks to a villager. What is left?'
  ],
  mul: [
    'Each building has the same number of windows. Multiply!',
    'Web-shots come in even bursts. How many total?',
    'Equal rows of skyscrapers. Find the total.',
    'Same swing, same count, over and over. Multiply.'
  ],
  div: [
    'Split the team into equal squads.',
    'Share the berries evenly. How many each?',
    'Every trainer gets the same number. How many?',
    'Divide the badges evenly between gyms.'
  ]
};

export const SKILL_META = {
  add: { label: 'Addition',       world: 'Green Hill Rings', hero: 'speedster', color: 'sonic' },
  sub: { label: 'Subtraction',    world: 'Deepslate Mine',   hero: 'miner',     color: 'mine' },
  mul: { label: 'Multiplication', world: 'Web-Swing City',   hero: 'webhero',   color: 'spidey' },
  div: { label: 'Division',       world: 'Trainer Gym',      hero: 'sparkmouse',color: 'poke' }
};

/* Build one drill question. */
export function makeFact(skill, lvl) {
  lvl = Math.min(5, Math.max(1, lvl | 0 || 1));
  const bank = CURATED[skill][lvl] || [];
  const pair = (bank.length && Math.random() < 0.6) ? pick(bank) : gen(skill, lvl);
  const [a, b] = pair;
  const op = OPS[skill];
  return {
    kind: 'numeric',
    skill,
    level: lvl,
    expr: `${a} ${op.sym} ${b}`,
    answer: op.calc(a, b),
    a, b,
    flavor: pick(FLAVOR[skill]),
    hint: hintFor(skill, a, b)
  };
}

function hintFor(skill, a, b) {
  if (skill === 'add') {
    if (a > 9 && b > 9) return `Break it up: ${Math.floor(a / 10) * 10} + ${Math.floor(b / 10) * 10} first, then add the ones.`;
    return `Start at ${a} and count up ${b}.`;
  }
  if (skill === 'sub') return `Start at ${b} and count UP to ${a}. That gap is the answer.`;
  if (skill === 'mul') return `${a} groups of ${b}. Try ${b} + ${b} ... ${a} times, or skip-count by ${b}.`;
  return `Ask: ${b} times WHAT equals ${a}? Skip-count by ${b} until you land on ${a}.`;
}

export function makeChunk(skill, lvl, n = 8) {
  const out = [], seen = new Set();
  let guard = 0;
  while (out.length < n && guard++ < n * 30) {
    const q = makeFact(skill, lvl);
    if (seen.has(q.expr)) continue;
    seen.add(q.expr);
    out.push(q);
  }
  return out;
}

/* Boss battle: mixed skills, one level above the player's average. */
export function makeBossChunk(levels, n = 12) {
  const skills = ['add', 'sub', 'mul', 'div'];
  const out = [];
  for (let i = 0; i < n; i++) {
    const s = skills[i % 4];
    out.push(makeFact(s, Math.min(5, (levels[s] || 1) + 1)));
  }
  // shuffle so the pattern is not guessable (same idea as the Kumon-style page)
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
