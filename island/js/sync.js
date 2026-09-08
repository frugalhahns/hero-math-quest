/* Carrying an island between devices, without an account.

   The file export has always been the way to do this, and it works, and nobody
   does it: it is a deliberate act on both ends, and an eight year old moving
   from the iPad to the laptop is not going to do it. So there is a family code.
   Type it once on each device and the islands follow you around.

   No sign in, and nothing to remember but the code. There is no account here
   because an account is a thing to lose the password to, and because a kid
   under thirteen cannot have most of them anyway.

   WHAT THE SERVER KNOWS. Nothing. The code is stretched into 512 bits on this
   device: the first half addresses the row and the second half is the key the
   save is encrypted with. The server is handed an address and a lump. It never
   sees the code, so it cannot derive the key, so it cannot read a save, so a
   copy of that database is a list of random strings. The island id is in the
   clear because a new device has to be able to ask what is there, and it is a
   random token that means nothing on its own.

   WHAT GETS SENT. Exactly the file the export button writes, which is already a
   whole island with its identity attached, and which importInto already knows
   how to take back in. Sync is that file, encrypted, kept up to date.

   HOW IT DECIDES. Every save carries `rev`, a counter that only goes up. This
   module remembers the rev it last agreed on with the server, so it can tell
   the difference between "this device has moved on", "the other one has" and
   "both have, and somebody has to choose". Only the last of those asks. A write
   is a compare and set, so two devices cannot both win and nothing is ever
   quietly overwritten -- the loser is told.

   The file export stays exactly where it was. This is the convenient copy; that
   is the one that outlives whoever is hosting this. */

import { slots, activeSlot, exportObject, importInto, checkFile, SLOTS } from './state.js';

/* Filled in when the Worker is deployed; see sync/README.md. Until then the
   whole feature reports itself as not set up rather than half working. */
const HOME = 'https://verdant-sync.PENDING.workers.dev';

const STORE = 'vi.sync';
const URL_KEY = 'vi.sync.url';      // an override, for running against a local worker
const PUSH_EVERY = 15000;           // at most one push per island per this
const TIMEOUT = 8000;

/* Crockford's alphabet: no I, L, O or U, so nothing in a code can be misread as
   something else and nobody can accidentally spell anything. Sixteen of them is
   eighty bits, which is far more than a family needs and still fits on a sticky
   note. */
const ALPHABET = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';

export function endpoint() {
  let over = null;
  try { over = localStorage.getItem(URL_KEY); } catch (e) { /* private mode */ }
  const url = (over || HOME).replace(/\/+$/, '');
  return url.includes('PENDING') ? null : url;
}

export function ready() { return !!endpoint() && !!code(); }

/* ---------------- the code ---------------- */

export function newCode() {
  const raw = new Uint8Array(16);
  crypto.getRandomValues(raw);
  let out = '';
  for (const b of raw) out += ALPHABET[b & 31];
  return group(out);
}

function group(s) { return s.replace(/(.{4})(?=.)/g, '$1-'); }

/* Anything a human might type: lower case, spaces, the dashes left in or taken
   out, and the three letters Crockford treats as digits because they look like
   them. Returns the tidy form, or null if it is not a code. */
export function tidy(text) {
  if (typeof text !== 'string') return null;
  const up = text.toUpperCase().replace(/[^A-Z0-9]/g, '')
    .replace(/O/g, '0').replace(/[IL]/g, '1');
  if (up.length !== 16) return null;
  for (const ch of up) if (!ALPHABET.includes(ch)) return null;
  return group(up);
}

/* ---------------- what this device remembers ---------------- */

function record() {
  try {
    const r = JSON.parse(localStorage.getItem(STORE) || '{}');
    return {
      code: typeof r.code === 'string' ? r.code : null,
      seen: (r.seen && typeof r.seen === 'object' && !Array.isArray(r.seen)) ? r.seen : {},
      at: typeof r.at === 'string' ? r.at : null
    };
  } catch (e) {
    return { code: null, seen: {}, at: null };
  }
}

function keep(r) {
  try { localStorage.setItem(STORE, JSON.stringify(r)); } catch (e) { /* nothing better to do */ }
}

export function code() { return record().code; }
export function lastSync() { return record().at; }

export function setCode(text) {
  const c = tidy(text);
  if (!c) return false;
  const r = record();
  /* A different code is a different family: what this device agreed with the
     old one says nothing about the new one, so the agreed revs go. */
  if (r.code !== c) { r.seen = {}; r.at = null; }
  r.code = c;
  keep(r);
  keys = null;
  return true;
}

export function forget() {
  keep({ code: null, seen: {}, at: null });
  keys = null;
}

/* ---------------- the two halves of the code ---------------- */

let keys = null;    // { code, addr, key }, kept because the stretch is slow on purpose

/* Exported for the self test, which checks that the same code always addresses
   the same row, that two codes never collide, and that the address it builds is
   one the Worker will actually accept. */
export async function keysFor(c) {
  if (keys && keys.code === c) return keys;
  const enc = new TextEncoder();
  const base = await crypto.subtle.importKey('raw', enc.encode(c), 'PBKDF2', false, ['deriveBits']);
  const bits = new Uint8Array(await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: enc.encode('verdant.isle.sync.v1'), iterations: 150000, hash: 'SHA-256' },
    base, 512
  ));
  const key = await crypto.subtle.importKey('raw', bits.slice(32), { name: 'AES-GCM' }, false,
    ['encrypt', 'decrypt']);
  keys = { code: c, addr: b64url(bits.slice(0, 32)), key };
  return keys;
}

function b64url(bytes) {
  let s = '';
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export async function seal(obj, key) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key,
    new TextEncoder().encode(JSON.stringify(obj))));
  const both = new Uint8Array(iv.length + ct.length);
  both.set(iv, 0);
  both.set(ct, iv.length);
  let s = '';
  for (const b of both) s += String.fromCharCode(b);
  return btoa(s);
}

export async function unseal(blob, key) {
  const raw = atob(blob);
  const bytes = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);
  const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: bytes.slice(0, 12) }, key,
    bytes.slice(12));
  return JSON.parse(new TextDecoder().decode(plain));
}

/* ---------------- talking to the box ---------------- */

async function call(path, opts = {}) {
  const url = endpoint();
  if (!url) return { ok: false, status: 0, body: null };
  const stop = new AbortController();
  const timer = setTimeout(() => stop.abort(), TIMEOUT);
  try {
    const res = await fetch(url + path, { ...opts, signal: stop.signal });
    let body = null;
    try { body = await res.json(); } catch (e) { body = null; }
    return { ok: res.ok, status: res.status, body };
  } catch (e) {
    return { ok: false, status: 0, body: null };   // offline, asleep, blocked: all the same here
  } finally {
    clearTimeout(timer);
  }
}

/* ---------------- who is ahead ---------------- */

/* Pure, and the only interesting logic in the file, so the self test can go at
   it directly. `seen` is the rev this device and the server last agreed on:
   without it you cannot tell a device that has moved on from one that is simply
   behind, and every sync that guesses that wrong eats somebody's afternoon. */
export function decide(local, cloud, seen) {
  if (local === null && cloud === null) return 'nothing';
  if (cloud === null) return 'push';
  if (local === null) return 'pull';
  if (seen === null || seen === undefined) return local === cloud ? 'same' : 'ask';
  if (local === seen && cloud === seen) return 'same';
  if (local === seen) return 'pull';
  if (cloud === seen) return 'push';
  return 'ask';
}

/* ---------------- pulling and pushing ---------------- */

function bySlot() {
  const out = {};
  for (const s of slots()) if (s.id) out[s.id] = s;
  return out;
}

function freeSlot(taken) {
  for (const s of slots()) if (!s.used && !taken.has(s.slot)) return s.slot;
  return null;
}

async function pushOne(addr, key, slot, island, prev) {
  /* The rev comes out of the very object being sent, not from a second look at
     the slot list. They agree in the game, because a save is written before
     anything can read it back, but a row whose rev describes one copy and whose
     blob is another is a sync that makes confident wrong decisions for ever
     afterwards. One source, and it is the thing in the envelope. */
  const file = exportObject(slot);
  const rev = (file.save && typeof file.save.rev === 'number') ? file.save.rev : 0;
  const blob = await seal(file, key);
  const res = await call(`/v1/${addr}/${island}`, {
    method: 'PUT',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ rev, blob, prev: prev === undefined ? null : prev })
  });
  if (res.ok) {
    const r = record();
    r.seen[island] = rev;
    r.at = new Date().toISOString();
    keep(r);
    return 'sent';
  }
  return res.status === 409 ? 'clash' : 'later';
}

async function pullOne(addr, key, island, slot) {
  const res = await call(`/v1/${addr}/${island}`);
  if (!res.ok || !res.body || typeof res.body.blob !== 'string') return 'later';
  let file = null;
  try { file = await unseal(res.body.blob, key); } catch (e) { return 'unreadable'; }
  if (checkFile(file)) return 'unreadable';
  if (importInto(file, slot)) return 'later';
  const r = record();
  r.seen[island] = Number(res.body.rev) || 0;
  r.at = new Date().toISOString();
  keep(r);
  return 'taken';
}

/* Everything, in both directions. `ask` is handed the two sides when neither is
   clearly the newer and has to answer 'mine' or 'theirs'; without one, an
   argument is left alone rather than guessed at. Returns what happened, which
   is what the boot code needs to know whether the island under the player just
   changed out from under it. */
/* One at a time, always. Boot syncs, the fifteen second beat and a tap on Sync
   now can all land together, and two of them pushing the same island means one
   gets a 409 from its own device and reports it to the player as "this island is
   being played somewhere else". It was not. Everything goes through here and
   waits its turn. */
let chain = Promise.resolve();

export function syncNow(opts = {}) {
  const run = () => doSync(opts);
  const next = chain.then(run, run);
  chain = next.then(() => {}, () => {});
  return next;
}

async function doSync({ ask } = {}) {
  const c = code();
  if (!c || !endpoint()) return { ran: false, changed: [], clash: [] };

  const { addr, key } = await keysFor(c);
  const listed = await call(`/v1/${addr}`);
  if (!listed.ok || !listed.body) return { ran: false, changed: [], clash: [] };

  const cloud = {};
  for (const row of (listed.body.islands || [])) cloud[row.island] = Number(row.rev) || 0;

  const mine = bySlot();
  const seen = record().seen;
  const changed = [];
  const clash = [];
  const taken = new Set();

  const ids = new Set([...Object.keys(cloud), ...Object.keys(mine)]);
  for (const id of ids) {
    const here = mine[id] ? mine[id].rev : null;
    const there = id in cloud ? cloud[id] : null;
    let what = decide(here, there, seen[id]);

    if (what === 'ask') {
      const answer = ask ? await ask({ island: id, name: mine[id] ? mine[id].name : '', here, there }) : null;
      if (answer === 'mine') what = 'push';
      else if (answer === 'theirs') what = 'pull';
      else { clash.push(id); continue; }
    }

    if (what === 'push') {
      /* prev is what the server had when this device last agreed with it. Null
         means "there should be no row"; anything else is the compare and set. */
      const got = await pushOne(addr, key, mine[id].slot, id, there === null ? null : seen[id] ?? there);
      if (got === 'clash') clash.push(id);
    } else if (what === 'pull') {
      const slot = mine[id] ? mine[id].slot : freeSlot(taken);
      if (!slot) { clash.push(id); continue; }
      taken.add(slot);
      const got = await pullOne(addr, key, id, slot);
      if (got === 'taken') changed.push({ island: id, slot });
    }
  }

  return { ran: true, changed, clash };
}

/* ---------------- the background half ---------------- */

/* A save is written on every tile, so watching for writes would be a request a
   second. This looks instead: every fifteen seconds, has any island's rev moved
   past what the server was last told? Almost always no, and then it costs a
   read of localStorage. */
let timer = null;

export function watch() {
  if (timer || !ready()) return;
  const beat = () => {
    const c = code();
    if (!c || !endpoint()) return Promise.resolve();
    const seen = record().seen;
    const behind = slots().filter(s => s.used && s.id && seen[s.id] !== s.rev);
    if (!behind.length) return Promise.resolve();
    /* Through the same queue as everything else, so a beat cannot collide with
       a sync that is already in the air. */
    const run = async () => {
      const { addr, key } = await keysFor(c);
      for (const s of behind) await pushOne(addr, key, s.slot, s.id, seen[s.id]);
    };
    const next = chain.then(run, run);
    chain = next.then(() => {}, () => {});
    return next;
  };
  timer = setInterval(beat, PUSH_EVERY);
  /* Leaving is the one moment worth catching: a tab closed on a tablet may not
     come back for a week, and everything since the last beat would sit there. */
  addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') beat(); });
  addEventListener('pagehide', beat);
}

export function stopWatching() {
  if (timer) clearInterval(timer);
  timer = null;
}
