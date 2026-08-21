/* Player save data + progression. Everything lives in localStorage. */

const KEY = 'hmq.save.v1';

const DEFAULT = {
  name: 'Hero',
  hero: 'speedster',
  xp: 0,
  coins: 0,
  soundOn: true,
  reduceMotion: false,
  focusMode: false,
  chunkSize: 8,
  dailyGoal: 3,
  // adaptive difficulty per skill, 1..5
  levels: { add: 1, sub: 1, mul: 1, div: 1 },
  // rolling accuracy per skill
  stats: {},
  badges: {},          // badgeId -> ISO date earned
  owned: ['speedster'],// unlocked heroes / cosmetics
  seen: {},            // contentId -> times answered right
  completed: {},       // questId -> true (cases, stories)
  streak: 0,
  lastPlayed: null,    // YYYY-MM-DD
  daysPlayed: [],
  chunksToday: 0,
  totalCorrect: 0,
  totalAnswered: 0
};

export const BADGES = [
  { id: 'bronze',   name: 'Bronze',   need: 'Finish 1 chunk' },
  { id: 'silver',   name: 'Silver',   need: 'Finish 5 chunks' },
  { id: 'gold',     name: 'Gold',     need: 'Finish 15 chunks' },
  { id: 'platinum', name: 'Platinum', need: 'Finish 30 chunks' },
  { id: 'diamond',  name: 'Diamond',  need: 'Finish 50 chunks' },
  { id: 'detective',name: 'Detective',need: 'Solve all 3 cases' },
  { id: 'reader',   name: 'Reader',   need: 'Finish all 3 stories' },
  { id: 'thinker',  name: 'Thinker',  need: 'Clear Logic Lab' },
  { id: 'boss',     name: 'Boss Slayer', need: 'Beat a Boss Battle' },
  { id: 'streak3',  name: '3-Day Streak', need: 'Play 3 days in a row' },
  { id: 'streak7',  name: '7-Day Streak', need: 'Play 7 days in a row' }
];

export let S = load();

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return structuredClone(DEFAULT);
    const parsed = JSON.parse(raw);
    return Object.assign(structuredClone(DEFAULT), parsed);
  } catch (e) {
    return structuredClone(DEFAULT);
  }
}

export function save() {
  try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* private mode */ }
}

export function resetAll() {
  S = structuredClone(DEFAULT);
  save();
}

export function today() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/* Call once at boot: rolls the daily streak. */
export function touchDay() {
  const t = today();
  if (S.lastPlayed === t) return;
  const y = new Date(); y.setDate(y.getDate() - 1);
  const yStr = `${y.getFullYear()}-${String(y.getMonth() + 1).padStart(2, '0')}-${String(y.getDate()).padStart(2, '0')}`;
  S.streak = S.lastPlayed === yStr ? S.streak + 1 : 1;
  S.lastPlayed = t;
  S.chunksToday = 0;
  if (!S.daysPlayed.includes(t)) S.daysPlayed.push(t);
  if (S.streak >= 3) grantBadge('streak3');
  if (S.streak >= 7) grantBadge('streak7');
  save();
}

export function level() { return Math.floor(S.xp / 100) + 1; }
export function xpInLevel() { return S.xp % 100; }

export function addXp(n) {
  const before = level();
  S.xp += n;
  save();
  return level() > before;
}

export function addCoins(n) { S.coins += n; save(); }
export function spendCoins(n) {
  if (S.coins < n) return false;
  S.coins -= n; save(); return true;
}

export function grantBadge(id) {
  if (S.badges[id]) return false;
  S.badges[id] = today();
  save();
  return true;
}

export function chunkFinished() {
  S.chunksToday++;
  const total = (S.stats.chunks || 0) + 1;
  S.stats.chunks = total;
  const ladder = [[1, 'bronze'], [5, 'silver'], [15, 'gold'], [30, 'platinum'], [50, 'diamond']];
  let earned = null;
  for (const [n, id] of ladder) if (total >= n && grantBadge(id)) earned = id;
  save();
  return earned;
}

/* Adaptive: nudge a skill level after each chunk. */
export function tuneSkill(skill, correct, total) {
  if (!S.levels[skill]) S.levels[skill] = 1;
  const pct = total ? correct / total : 0;
  let moved = 0;
  if (pct >= 0.85 && total >= 4 && S.levels[skill] < 5) { S.levels[skill]++; moved = 1; }
  else if (pct < 0.5 && S.levels[skill] > 1) { S.levels[skill]--; moved = -1; }
  save();
  return moved;
}

export function recordAnswer(skill, ok) {
  S.totalAnswered++;
  if (ok) S.totalCorrect++;
  const k = 'sk_' + skill;
  const s = S.stats[k] || { right: 0, wrong: 0 };
  ok ? s.right++ : s.wrong++;
  S.stats[k] = s;
  save();
}

export function markComplete(id) { S.completed[id] = today(); save(); }
export function isComplete(id) { return !!S.completed[id]; }
