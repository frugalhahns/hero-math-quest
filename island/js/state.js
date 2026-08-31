/* Save data. localStorage only -- no server, no accounts, no network calls.
   Everything the world needs to rebuild itself lives here: where you are,
   which documents you have understood, who is on your team, and which
   projects are finished. Cleared tiles are NOT stored -- they are recomputed
   from the finished projects on load, which keeps the save small and honest.

   Three slots share this file so more than one kid can play on one device, and
   the whole save can be written to a file and read back, which is the only way
   to move a game to another device or to survive a browser that clears its
   storage. Slot 1 deliberately keeps the original key, so anyone who was
   already playing before slots existed is still in their game. */

const SLOT_KEY = 'vi.slot';
const NAMES_KEY = 'vi.slots';
export const SLOTS = ['1', '2', '3'];

/* Kept in step with the inline theme script in index.html, which has to build
   this same key before any module has loaded. */
function keyFor(slot) { return slot === '1' ? 'vi.save.v1' : `vi.save.v1.s${slot}`; }

export function activeSlot() {
  try {
    const s = localStorage.getItem(SLOT_KEY);
    return SLOTS.includes(s) ? s : '1';
  } catch (e) {
    return '1';
  }
}

/* Fixed for the life of the page. Changing slots reloads rather than swapping S
   underneath fifteen modules that already hold a reference to it. */
const KEY = keyFor(activeSlot());

const DEFAULT = {
  theme: 'auto',          // 'auto' | 'light' | 'dark'
  soundOn: true,
  musicOn: true,
  bigText: false,
  map: 'beach',
  x: 17, y: 3, dir: 'down',
  step: 0,                // index into content/quests.js QUEST
  flags: {},              // docId -> true, once its questions are answered
  read: {},               // docId -> times opened
  signs: {},              // signId -> true
  team: [],               // species ids, in the order they joined
  stage: {},              // speciesId -> how many times it has grown
  joinedAt: {},           // speciesId -> the chain step it joined on
  grownAt: {},            // speciesId -> the chain step it last grew on
  projects: {},           // projectId -> true
  crew: {},               // projectId -> [speciesId, ...] who did it
  items: {},              // crank: 1, berries: 2
  asked: 0,
  right: 0,
  looked: 0,              // glossary words tapped
  finished: false,
  started: null,          // ISO date of first play
  updatedAt: null         // ISO timestamp of the last write, shown in the slot list
};

export let S = load();

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return fresh();
    return sanitize(parse(raw));
  } catch (e) {
    return fresh();
  }
}

/* "__proto__" arriving as a key would be assigned through the prototype setter
   further down, so it is dropped at the door. Save files can come from another
   device and are not automatically trustworthy. */
function parse(text) {
  return JSON.parse(text, (k, v) => (k === '__proto__' ? undefined : v));
}

/* One merge used by both loading and importing: unknown keys are dropped,
   known keys keep their default when the incoming value is the wrong shape, and
   the object fields are filled in rather than replaced, so a partial or older
   save never leaves a hole for the rest of the game to trip over. */
function sanitize(raw) {
  const s = fresh();
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return s;
  for (const k of Object.keys(DEFAULT)) {
    if (!Object.prototype.hasOwnProperty.call(raw, k)) continue;
    const v = raw[k], d = DEFAULT[k];
    if (Array.isArray(d)) {
      if (Array.isArray(v)) s[k] = v.filter(x => typeof x === 'string');
    } else if (d !== null && typeof d === 'object') {
      if (v && typeof v === 'object' && !Array.isArray(v)) {
        for (const key of Object.keys(v)) {
          if (key !== '__proto__') s[k][key] = v[key];
        }
      }
    } else if (d === null) {
      // started and updatedAt: an ISO string, or nothing
      if (v === null || typeof v === 'string') s[k] = v;
    } else if (typeof v === typeof d) {
      s[k] = v;
    }
  }
  return s;
}

function fresh() {
  const s = structuredClone(DEFAULT);
  s.started = new Date().toISOString().slice(0, 10);
  return s;
}

export function save() {
  S.updatedAt = new Date().toISOString();
  try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* private browsing */ }
}

export function resetAll() {
  const theme = S.theme, soundOn = S.soundOn, musicOn = S.musicOn, bigText = S.bigText;
  const s = fresh();
  s.theme = theme; s.soundOn = soundOn; s.musicOn = musicOn; s.bigText = bigText;
  for (const k of Object.keys(S)) delete S[k];
  Object.assign(S, s);
  save();
}

/* ---------------- slots ---------------- */

function readNames() {
  try {
    const n = parse(localStorage.getItem(NAMES_KEY) || '{}');
    return (n && typeof n === 'object' && !Array.isArray(n)) ? n : {};
  } catch (e) {
    return {};
  }
}

export function slotName(slot) {
  const n = readNames()[slot];
  return (typeof n === 'string' && n) ? n : `Player ${slot}`;
}

export function renameSlot(slot, name) {
  if (!SLOTS.includes(slot)) return;
  const names = readNames();
  const clean = String(name || '').replace(/\s+/g, ' ').trim().slice(0, 16);
  if (clean) names[slot] = clean; else delete names[slot];
  try { localStorage.setItem(NAMES_KEY, JSON.stringify(names)); } catch (e) { /* ignore */ }
}

/* A summary of every slot, read straight out of storage so looking at the list
   never disturbs the game currently loaded. */
export function slots() {
  const active = activeSlot();
  return SLOTS.map(slot => {
    let d = null;
    try {
      const raw = localStorage.getItem(keyFor(slot));
      if (raw) d = parse(raw);
    } catch (e) { /* unreadable slot reads as empty */ }
    if (!d || typeof d !== 'object' || Array.isArray(d)) d = null;
    return {
      slot,
      name: slotName(slot),
      active: slot === active,
      used: !!d,
      step: d && typeof d.step === 'number' ? d.step : 0,
      team: d && Array.isArray(d.team) ? d.team.length : 0,
      started: d && typeof d.started === 'string' ? d.started : null,
      updatedAt: d && typeof d.updatedAt === 'string' ? d.updatedAt : null,
      finished: !!(d && d.finished)
    };
  });
}

export function useSlot(slot) {
  if (!SLOTS.includes(slot)) return false;
  try { localStorage.setItem(SLOT_KEY, slot); return true; } catch (e) { return false; }
}

export function eraseSlot(slot) {
  if (!SLOTS.includes(slot)) return;
  try { localStorage.removeItem(keyFor(slot)); } catch (e) { /* ignore */ }
  renameSlot(slot, '');
}

/* ---------------- save files ---------------- */

export const FILE_KIND = 'verdant-isle-save';

export function exportObject(slot = activeSlot()) {
  let data = S;
  if (slot !== activeSlot()) {
    try { data = sanitize(parse(localStorage.getItem(keyFor(slot)) || '{}')); } catch (e) { data = fresh(); }
  }
  return {
    kind: FILE_KIND,
    version: 1,
    exported: new Date().toISOString(),
    player: slotName(slot),
    save: structuredClone(data)
  };
}

export function fileName(slot = activeSlot()) {
  const who = slotName(slot).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'player';
  return `verdant-isle-${who}-${new Date().toISOString().slice(0, 10)}.json`;
}

/* Returns null when the file is usable, or a sentence to show the player. The
   messages are written for a 3rd grade reader, same as everything else. */
export function checkFile(d) {
  if (!d || typeof d !== 'object' || Array.isArray(d)) return 'That file is not a saved game.';
  if (d.kind !== FILE_KIND) return 'That file is from a different game, not Verdant Isle.';
  const s = d.save;
  if (!s || typeof s !== 'object' || Array.isArray(s)) return 'That saved game is missing its island.';
  if (typeof s.step !== 'number' || !isFinite(s.step) || s.step < 0) return 'That saved game is damaged.';
  if (typeof s.map !== 'string' || !s.map) return 'That saved game is damaged.';
  return null;
}

/* A short line describing what is in a save file, so nobody overwrites a good
   game with a worse one by accident. */
export function describeFile(d) {
  const s = (d && d.save) || {};
  const team = Array.isArray(s.team) ? s.team.length : 0;
  const when = typeof d.exported === 'string' ? d.exported.slice(0, 10) : 'an unknown day';
  return `${d.player || 'A player'} — step ${(s.step || 0) + 1}, ${team} animal${team === 1 ? '' : 's'}, saved ${when}`;
}

export function importInto(d, slot) {
  const bad = checkFile(d);
  if (bad) return bad;
  if (!SLOTS.includes(slot)) return 'There is nowhere to put that saved game.';
  const clean = sanitize(d.save);
  clean.updatedAt = new Date().toISOString();
  try {
    localStorage.setItem(keyFor(slot), JSON.stringify(clean));
  } catch (e) {
    return 'This browser would not let the game save. Turn off private browsing and try again.';
  }
  return null;
}

/* Round trip in memory, used by the self test: what comes out of an export has
   to survive an import unchanged. */
export function roundTrip(d) {
  return sanitize(parse(JSON.stringify(d)).save);
}

/* ---------------- keeping the save on this device ---------------- */

/* Browsers throw storage away when space runs short, and mobile Safari clears
   it after about a week of not visiting the site. Asking for persistence is the
   only way to opt out of that, and it is granted on engagement, so it is asked
   for on the first tap rather than on load. Resolves true, false, or null when
   the browser has no opinion to give. */
export async function persistStatus() {
  try {
    if (!navigator.storage || !navigator.storage.persisted) return null;
    return await navigator.storage.persisted();
  } catch (e) {
    return null;
  }
}

export async function askToPersist() {
  try {
    if (!navigator.storage || !navigator.storage.persist) return null;
    if (await navigator.storage.persisted()) return true;
    return await navigator.storage.persist();
  } catch (e) {
    return null;
  }
}

/* ---------------- small helpers used all over ---------------- */

export function has(item, n = 1) { return (S.items[item] || 0) >= n; }
export function give(item, n = 1) { S.items[item] = (S.items[item] || 0) + n; save(); }
export function take(item, n = 1) { S.items[item] = Math.max(0, (S.items[item] || 0) - n); save(); }

export function onTeam(id) { return S.team.includes(id); }

export function join(id) {
  if (!S.team.includes(id)) {
    S.team.push(id);
    // remember which step it joined on, so js/evolve.js can leave a gap before
    // asking you to recall its notes
    S.joinedAt[id] = S.step;
  }
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
