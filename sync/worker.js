/* The save sync for Verdant Isle. About eighty lines, and deliberately stupid:
   it is a box that holds an encrypted lump per island and refuses to lose one.

   It cannot read anything it stores. The family code is stretched on the device
   into two halves; the first half addresses the row, the second encrypts the
   save. This side sees the address and the ciphertext and never the code, so a
   dump of this database is a list of random strings.

   Three routes:

     GET  /v1/:addr             what islands are here, and how far along each is
     GET  /v1/:addr/:island     one island
     PUT  /v1/:addr/:island     store one island, if you know its current rev

   The PUT is a compare and set. The body says which rev it believes is there;
   if that is wrong the write is refused with a 409 and the row that is actually
   there, and the device asks the player which copy to keep. A save that quietly
   disappears because a second device was a minute behind is the one failure
   this whole thing exists to avoid. */

const ORIGINS = [
  'https://frugalhahns.github.io',
  'http://localhost:8777',
  'http://127.0.0.1:8777'
];

const MAX_BLOB = 96 * 1024;          // a save is a few KB; this is room to grow
const ADDR = /^[A-Za-z0-9_-]{43}$/;  // base64url of a 256 bit hash
const ISLAND = /^vi_[a-z0-9]{4,40}$/;

function cors(origin) {
  const allow = ORIGINS.includes(origin) ? origin : ORIGINS[0];
  return {
    'access-control-allow-origin': allow,
    'access-control-allow-methods': 'GET, PUT, OPTIONS',
    'access-control-allow-headers': 'content-type',
    'access-control-max-age': '86400',
    'vary': 'origin'
  };
}

function send(body, status, origin) {
  return new Response(body === null ? null : JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store', ...cors(origin) }
  });
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('origin') || '';
    if (request.method === 'OPTIONS') return send(null, 204, origin);

    const parts = new URL(request.url).pathname.split('/').filter(Boolean);
    if (parts[0] !== 'v1' || !ADDR.test(parts[1] || '')) {
      return send({ error: 'not found' }, 404, origin);
    }
    const [, addr, island] = parts;
    if (island !== undefined && !ISLAND.test(island)) {
      return send({ error: 'not an island' }, 400, origin);
    }

    if (request.method === 'GET' && !island) {
      const { results } = await env.DB
        .prepare('SELECT island, rev, updated FROM saves WHERE addr = ?')
        .bind(addr).all();
      return send({ islands: results || [] }, 200, origin);
    }

    if (request.method === 'GET') {
      const row = await env.DB
        .prepare('SELECT island, rev, updated, blob FROM saves WHERE addr = ? AND island = ?')
        .bind(addr, island).first();
      return row ? send(row, 200, origin) : send({ error: 'no such island' }, 404, origin);
    }

    if (request.method === 'PUT') {
      let body;
      try { body = await request.json(); } catch (e) { body = null; }
      const rev = body && Number(body.rev);
      const blob = body && body.blob;
      const prev = body && (body.prev === null ? null : Number(body.prev));
      if (!Number.isInteger(rev) || rev < 0 || typeof blob !== 'string' || !blob) {
        return send({ error: 'that is not a save' }, 400, origin);
      }
      if (blob.length > MAX_BLOB) return send({ error: 'too big' }, 413, origin);

      const updated = new Date().toISOString();
      /* Both of these are conditional on the rev the device thinks is there, so
         two devices racing cannot both win. SQLite counts the rows it changed,
         and zero means somebody else got there first. */
      const done = prev === null
        ? await env.DB.prepare(
            'INSERT INTO saves (addr, island, rev, blob, updated) VALUES (?, ?, ?, ?, ?) ' +
            'ON CONFLICT (addr, island) DO NOTHING'
          ).bind(addr, island, rev, blob, updated).run()
        : await env.DB.prepare(
            'UPDATE saves SET rev = ?, blob = ?, updated = ? WHERE addr = ? AND island = ? AND rev = ?'
          ).bind(rev, blob, updated, addr, island, prev).run();

      if (done.meta && done.meta.changes > 0) return send({ rev, updated }, 200, origin);

      const row = await env.DB
        .prepare('SELECT island, rev, updated, blob FROM saves WHERE addr = ? AND island = ?')
        .bind(addr, island).first();
      return send({ error: 'someone else got there first', current: row || null }, 409, origin);
    }

    return send({ error: 'no' }, 405, origin);
  }
};
