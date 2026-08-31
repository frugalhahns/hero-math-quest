/* Save data. localStorage only -- no server, no accounts, no network calls.
   Everything the world needs to rebuild itself lives here: where you are,
   which documents you have understood, who is on your team, and which
   projects are finished. Cleared tiles are NOT stored -- they are recomputed
   from the finished projects on load, which keeps the save small and honest.

   Three slots share this file so more than one kid can play on one device, and
   the whole save can be written to a file and read back, which is the only way
   to move a game to another device or to survive a browser that clears its
   storage. Slot 1 deliberately keeps the original key, so anyone who was
   already playing before slots existed is still in their game.

   A slot is a place, not a person. The person is a profile: a name and a
   stable random id that is minted once and then never changes, not even when
   the island is renamed or carried to another device. Nothing here talks to a
   server, but if it ever does, that id is the row it syncs to, `rev` says which
   copy is newer without having to trust two devices' clocks, and the device id
   says which of them a copy came from. Those three fields are the whole reason
   a real account could adopt these saves later instead of starting over. */

const SLOT_KEY = 'vi.slot';
const NAMES_KEY = 'vi.slots';       // profile per slot; held the bare names in v1
const DEVICE_KEY = 'vi.device';
export const SLOTS = ['1', '2', '3'];
export const PROFILES_VERSION = 2;

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
  updatedAt: null,        // ISO timestamp of the last write, shown in the slot list
  rev: 0                  // writes so far; only ever counts up, so two copies of
                          // one island can be compared without trusting clocks
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
  S.rev = (typeof S.rev === 'number' && isFinite(S.rev) ? S.rev : 0) + 1;
  try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* private browsing */ }
}

export function resetAll() {
  const theme = S.theme, soundOn = S.soundOn, musicOn = S.musicOn, bigText = S.bigText;
  const s = fresh();
  s.theme = theme; s.soundOn = soundOn; s.musicOn = musicOn; s.bigText = bigText;
  // starting over is still the same island to anything counting revisions
  s.rev = (typeof S.rev === 'number' && isFinite(S.rev)) ? S.rev : 0;
  for (const k of Object.keys(S)) delete S[k];
  Object.assign(S, s);
  save();
}

/* ---------------- profiles and slots ---------------- */

/* Random, opaque, and minted exactly once per island. Not derived from the name
   or the slot number, because both of those change and an identity must not. */
function newId() {
  try {
    const b = new Uint8Array(8);
    crypto.getRandomValues(b);
    return 'vi_' + [...b].map(n => n.toString(16).padStart(2, '0')).join('');
  } catch (e) {
    return 'vi_' + Date.now().toString(16) + Math.random().toString(16).slice(2, 10);
  }
}

/* One id per browser, so a copy of an island can later be told apart from the
   island it was copied from. Nothing is sent anywhere; it exists so that a
   merge, if there is ever anything to merge with, has something to go on. */
export function deviceId() {
  try {
    let d = localStorage.getItem(DEVICE_KEY);
    if (!d || typeof d !== 'string') {
      d = newId();
      localStorage.setItem(DEVICE_KEY, d);
    }
    return d;
  } catch (e) {
    return 'vi_nodevice';
  }
}

function today() { return new Date().toISOString().slice(0, 10); }

/* v1 stored `{ "2": "Ada" }` -- a name and nothing else. v2 stores a profile,
   and any slot that has a game but no profile gets one, so every island that
   already exists on this device ends up with an id it keeps from here on. */
function readProfiles() {
  let raw = null;
  try { raw = parse(localStorage.getItem(NAMES_KEY) || '{}'); } catch (e) { raw = null; }
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) raw = {};

  const out = { version: PROFILES_VERSION, bySlot: {} };
  const src = (raw.version >= 2 && raw.bySlot && typeof raw.bySlot === 'object') ? raw.bySlot : raw;
  for (const slot of SLOTS) {
    const rec = src[slot];
    if (typeof rec === 'string') {                       // the v1 shape
      if (rec) out.bySlot[slot] = { id: newId(), name: rec.slice(0, 16), createdAt: today() };
    } else if (rec && typeof rec === 'object' && !Array.isArray(rec)) {
      out.bySlot[slot] = {
        id: typeof rec.id === 'string' && rec.id ? rec.id : newId(),
        name: typeof rec.name === 'string' ? rec.name.slice(0, 16) : '',
        createdAt: typeof rec.createdAt === 'string' ? rec.createdAt : today()
      };
    }
  }
  return out;
}

function writeProfiles(p) {
  try { localStorage.setItem(NAMES_KEY, JSON.stringify(p)); } catch (e) { /* ignore */ }
}

function rawSlot(slot) {
  try {
    const d = parse(localStorage.getItem(keyFor(slot)) || 'null');
    return (d && typeof d === 'object' && !Array.isArray(d)) ? d : null;
  } catch (e) {
    return null;
  }
}

/* Runs at load: upgrade the stored shape, and give an id to any island that
   predates profiles. Writes only when something actually changed, so a normal
   load does not touch storage before the game has even started. Idempotent and
   exported so the self test can hand it a v1 fixture and watch it convert. */
export function ensureProfiles() {
  let raw = null;
  try { raw = parse(localStorage.getItem(NAMES_KEY) || 'null'); } catch (e) { raw = null; }
  const p = readProfiles();
  let changed = !raw || raw.version !== PROFILES_VERSION;
  for (const slot of SLOTS) {
    if (p.bySlot[slot]) continue;
    const d = rawSlot(slot);
    if (!d) continue;                                    // an empty slot needs no profile yet
    p.bySlot[slot] = {
      id: newId(),
      name: '',
      createdAt: typeof d.started === 'string' ? d.started : today()
    };
    changed = true;
  }
  if (changed) writeProfiles(p);
  return p;
}
ensureProfiles();

export function slotProfile(slot) {
  return readProfiles().bySlot[slot] || null;
}

export function slotName(slot) {
  const rec = readProfiles().bySlot[slot];
  return (rec && rec.name) ? rec.name : `Player ${slot}`;
}

/* Mints the profile if this slot never had one, which is what happens the first
   time a name is typed on the home page. */
export function renameSlot(slot, name) {
  if (!SLOTS.includes(slot)) return null;
  const p = readProfiles();
  const clean = String(name || '').replace(/[{}]/g, '').replace(/\s+/g, ' ').trim().slice(0, 16);
  const rec = p.bySlot[slot] || { id: newId(), name: '', createdAt: today() };
  rec.name = clean;
  p.bySlot[slot] = rec;
  writeProfiles(p);
  return rec.id;
}

/* A summary of every slot, read straight out of storage so looking at the list
   never disturbs the game currently loaded. This is what the home page draws. */
export function slots() {
  const active = activeSlot();
  const p = readProfiles();
  return SLOTS.map(slot => {
    const d = rawSlot(slot);
    const rec = p.bySlot[slot] || null;
    return {
      slot,
      id: rec ? rec.id : null,
      name: (rec && rec.name) ? rec.name : `Player ${slot}`,
      named: !!(rec && rec.name),
      active: slot === active,
      used: !!d,
      step: d && typeof d.step === 'number' ? d.step : 0,
      team: d && Array.isArray(d.team) ? d.team.length : 0,
      map: d && typeof d.map === 'string' ? d.map : null,
      rev: d && typeof d.rev === 'number' ? d.rev : 0,
      started: d && typeof d.started === 'string' ? d.started : null,
      createdAt: rec ? rec.createdAt : null,
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
  const p = readProfiles();
  delete p.bySlot[slot];               // a different kid here later is a different person
  writeProfiles(p);
}

/* ---------------- the home page ---------------- */

/* Which island this tab has already been sent into. The home page is meant to
   be the first thing you see every visit, but switching players reloads the
   page, and a reload must not drop you back on the page you just finished with.
   sessionStorage is exactly the right lifetime for that: it survives a reload
   and dies with the tab. Kept here with the other storage keys, and read again
   inline in index.html, which has to decide before the first paint. */
const GO_KEY = 'vi.go';

export function markEntered(slot) {
  try { sessionStorage.setItem(GO_KEY, slot); } catch (e) { /* ignore */ }
}

export function enteredThisSession() {
  try { return sessionStorage.getItem(GO_KEY) === activeSlot(); } catch (e) { return false; }
}

/* Asking for the home page from inside the game. Forgetting the mark and
   reloading is the whole implementation: the game saves continuously, so there
   is nothing to lose, and it leaves one path into the home page rather than
   two. */
export function clearEntered() {
  try { sessionStorage.removeItem(GO_KEY); } catch (e) { /* ignore */ }
}

/* ---------------- save files ---------------- */

export const FILE_KIND = 'verdant-isle-save';
export const FILE_VERSION = 2;

/* v1 files carry a name and a save. v2 adds the profile, so a file is a whole
   island rather than a heap of progress: load it on a second device and both
   copies know they are the same island, which is what a later account would
   need in order to adopt them instead of making duplicates. `player` is still
   written for the v1 readers of already-downloaded files, and still read for
   the v1 files those readers produced. */
export function exportObject(slot = activeSlot()) {
  let data = S;
  if (slot !== activeSlot()) {
    try { data = sanitize(parse(localStorage.getItem(keyFor(slot)) || '{}')); } catch (e) { data = fresh(); }
  }
  const rec = slotProfile(slot);
  return {
    kind: FILE_KIND,
    version: FILE_VERSION,
    exported: new Date().toISOString(),
    player: slotName(slot),
    profile: {
      id: rec ? rec.id : newId(),
      name: slotName(slot),
      createdAt: rec ? rec.createdAt : today()
    },
    device: deviceId(),
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
  // a file from a later version may hold things this copy would silently drop
  if (typeof d.version === 'number' && d.version > FILE_VERSION) {
    return 'That saved game is from a newer Verdant Isle than this one.';
  }
  const s = d.save;
  if (!s || typeof s !== 'object' || Array.isArray(s)) return 'That saved game is missing its island.';
  if (typeof s.step !== 'number' || !isFinite(s.step) || s.step < 0) return 'That saved game is damaged.';
  if (typeof s.map !== 'string' || !s.map) return 'That saved game is damaged.';
  return null;
}

/* A short line describing what is in a save file, so nobody overwrites a good
   game with a worse one by accident. Every field is treated as suspect. This
   describes a file the moment it is picked, which is before anyone has agreed
   to load it, so it must not throw on a file that turns out to be nonsense --
   the description is part of how you find out that it is. */
export function describeFile(d) {
  const f = (d && typeof d === 'object' && !Array.isArray(d)) ? d : {};
  const s = (f.save && typeof f.save === 'object' && !Array.isArray(f.save)) ? f.save : {};
  const team = Array.isArray(s.team) ? s.team.length : 0;
  const step = (typeof s.step === 'number' && isFinite(s.step) && s.step >= 0) ? Math.floor(s.step) : 0;
  // braces are glossary markup once this reaches a passage, and the line has to
  // stay one line, so a name is trimmed of both
  const name = typeof f.player === 'string' ? f.player.replace(/[{}]/g, '').trim().slice(0, 24) : '';
  const when = typeof f.exported === 'string' ? f.exported.slice(0, 10) : 'an unknown day';
  return `${name || 'A player'} — step ${step + 1}, ${team} animal${team === 1 ? '' : 's'}, saved ${when}`;
}

/* The island moves, identity and all. A v2 file brings its profile with it, so
   the same island loaded onto a second device stays one island rather than
   becoming two -- unless it is already open in another slot here, in which case
   this really is a copy and gets an identity of its own. A v1 file has no
   profile, so one is minted, and the name is taken from the old `player` field.
   Any profile already in the target slot is being written over along with the
   game, so it does not survive. */
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

  const incoming = (d.profile && typeof d.profile === 'object' && !Array.isArray(d.profile)) ? d.profile : {};
  const name = typeof incoming.name === 'string' && incoming.name ? incoming.name
    : typeof d.player === 'string' ? d.player : '';
  const p = readProfiles();
  const taken = SLOTS.some(s => s !== slot && p.bySlot[s] && p.bySlot[s].id === incoming.id);
  p.bySlot[slot] = {
    id: (typeof incoming.id === 'string' && incoming.id && !taken) ? incoming.id : newId(),
    name: name.replace(/[{}]/g, '').replace(/\s+/g, ' ').trim().slice(0, 16),
    createdAt: typeof incoming.createdAt === 'string' ? incoming.createdAt : today()
  };
  writeProfiles(p);
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
