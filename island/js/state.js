/* Save data. One localStorage key, no server, no accounts.
   Everything the world needs to rebuild itself lives here: where you are,
   which documents you have understood, who is on your team, and which
   projects are finished. Cleared tiles are NOT stored -- they are recomputed
   from the finished projects on load, which keeps the save small and honest. */

const KEY = 'vi.save.v1';

const DEFAULT = {
  theme: 'auto',          // 'auto' | 'light' | 'dark'
  soundOn: true,
  bigText: false,
  map: 'beach',
  x: 17, y: 3, dir: 'down',
  step: 0,                // index into content/quests.js QUEST
  flags: {},              // docId -> true, once its questions are answered
  read: {},               // docId -> times opened
  signs: {},              // signId -> true
  team: [],               // species ids, in the order they joined
  projects: {},           // projectId -> true
  crew: {},               // projectId -> [speciesId, ...] who did it
  items: {},              // crank: 1, berries: 2
  asked: 0,
  right: 0,
  looked: 0,              // glossary words tapped
  finished: false,
  started: null           // ISO date of first play
};

export let S = load();

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return fresh();
    const parsed = JSON.parse(raw);
    const s = Object.assign(fresh(), parsed);
    // objects need a deeper merge or a partial old save leaves holes
    for (const k of ['flags', 'read', 'signs', 'projects', 'crew', 'items']) {
      s[k] = Object.assign({}, DEFAULT[k], parsed[k] || {});
    }
    if (!Array.isArray(s.team)) s.team = [];
    return s;
  } catch (e) {
    return fresh();
  }
}

function fresh() {
  const s = structuredClone(DEFAULT);
  s.started = new Date().toISOString().slice(0, 10);
  return s;
}

export function save() {
  try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* private browsing */ }
}

export function resetAll() {
  const theme = S.theme, soundOn = S.soundOn, bigText = S.bigText;
  const s = fresh();
  s.theme = theme; s.soundOn = soundOn; s.bigText = bigText;
  for (const k of Object.keys(S)) delete S[k];
  Object.assign(S, s);
  save();
}

/* ---------------- small helpers used all over ---------------- */

export function has(item, n = 1) { return (S.items[item] || 0) >= n; }
export function give(item, n = 1) { S.items[item] = (S.items[item] || 0) + n; save(); }
export function take(item, n = 1) { S.items[item] = Math.max(0, (S.items[item] || 0) - n); save(); }

export function onTeam(id) { return S.team.includes(id); }

export function join(id) {
  if (!S.team.includes(id)) S.team.push(id);
  save();
}

export function accuracy() {
  return S.asked ? Math.round((S.right / S.asked) * 100) : 0;
}

export function tally(wasRight) {
  S.asked++;
  if (wasRight) S.right++;
  save();
}
