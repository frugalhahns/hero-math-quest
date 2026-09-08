# The save sync

A box that holds one encrypted island per family code, so a game started on the
iPad can be carried on from the laptop without anybody signing into anything.

It cannot read what it holds. The code is stretched on the device into 512 bits:
the first half addresses the row, the second half encrypts the save, and only
the first half is ever sent. A dump of this database is a list of random
strings. See the header of `island/js/sync.js` for the rest of the reasoning.

## What it is

- `worker.js` — three routes, about eighty lines, no dependencies
- `schema.sql` — one table
- `cf` — wrangler, pointed at the right Cloudflare account

## Setting it up, once

This lives on its **own Cloudflare account**, not the one calendar-hub is on.
The free tier limits are per account rather than per project: Cloudflare stops
answering D1 queries "once an account spends either 5 million row reads or
100,000 row writes in a day", and calendar-hub already runs near that read
ceiling. Sharing an account would mean a busy calendar-hub day quietly stops the
kids' saves syncing.

**1. An API token** on that account. My Profile → API Tokens → Create Custom
Token, with these account-level permissions, scoped to that account alone:

| Scope | Permission | Level |
|---|---|---|
| Account | Workers Scripts | Edit |
| Account | D1 | Edit |
| Account | Workers Tail | Read |
| Account | Account Settings | Read |

The last two are only for reading logs and for `wrangler whoami`; the first two
are what deploying needs. A scoped token rather than `wrangler login` because
the login covers every account you can reach, and this should reach one.

**2. Keep it out of the shell history and out of this repo.** Omitting the value
after `-w` makes it prompt:

```sh
security add-generic-password -U -s verdant-cf-api-token -a cuhahn@gmail.com -w
```

**3. Two lines in `~/.zshenv`**, matching the pattern the other secrets there
use:

```sh
export VERDANT_CF_API_TOKEN="$(security find-generic-password -s verdant-cf-api-token -w 2>/dev/null)"
export VERDANT_CF_ACCOUNT_ID="<the account id, from the Workers & Pages sidebar>"
```

Deliberately not called `CLOUDFLARE_API_TOKEN`. That name is already exported
globally for calendar-hub and wrangler reads exactly it, so a second export
would send these commands to the wrong account without saying so. `./cf` maps
the Verdant names on to the ones wrangler wants, one command at a time, and
refuses to run if they are missing rather than falling back to whatever happens
to be in the environment.

**4. Make the database, and put its id in `wrangler.toml`:**

```sh
./cf d1 create verdant-saves          # prints the database_id
./cf d1 execute verdant-saves --remote --file=schema.sql
```

**5. Deploy, and tell the game where it is:**

```sh
./cf deploy                           # prints the workers.dev address
```

Then put that address in `HOME` at the top of `island/js/sync.js`. Until it is a
real URL the whole feature reports itself as not set up: no network calls, and
no section in the save panel, rather than a button that does not work.

## Working on it

`wrangler dev` runs the Worker and a local D1 with no account and no token:

```sh
npx wrangler dev --port 8788
npx wrangler d1 execute verdant-saves --local --file=schema.sql
```

Point a browser at it by setting the override the game looks for, which is there
for exactly this:

```js
localStorage.setItem('vi.sync.url', 'http://localhost:8788')
```

`sync/twodev.mjs` in the transcript for this work drove two origins (localhost
and 127.0.0.1 are the same files with separate localStorage, which is as close
to two tablets as one machine gets) through the whole thing: a second device
adopting an island from a code, changes going each way, and both devices moving
at once ending in a question rather than a guess.

## What is not here

No rate limiting. The address is 80 bits of the family's code, so guessing one
is not a realistic way in, but nothing stops somebody who has a code writing to
it as fast as they like. If that ever matters, the answer is a Cloudflare rate
limiting rule on the route rather than code in the Worker.
