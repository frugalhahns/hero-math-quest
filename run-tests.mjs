/* Run all three test pages and say whether they passed.
 *
 *   node run-tests.mjs            all three
 *   node run-tests.mjs selftest   just one
 *
 * There is no test framework here and there is not about to be one: the suites
 * are pages, because the thing being tested is a page. What this does is start
 * a static server, start a headless Chrome, open each page, wait for it to say
 * it has actually finished, and print the tally.
 *
 * The waiting is the whole point. The obvious incantation --
 *
 *   chrome --headless --virtual-time-budget=60000 --dump-dom selftest.html
 *
 * -- looks like it works and quietly lies. Virtual time only advances through
 * timers, so anything waiting on real work outside the timer queue is treated as
 * an idle page: offline audio rendering in audiotest, an animation frame in a
 * child frame in flowtest, a PBKDF2 stretch in selftest's sync checks. The
 * budget runs out, the DOM is dumped mid-report, and a truncated report has no
 * failures in it. All three pages set document.documentElement.dataset.done
 * when they are genuinely finished, and this waits for that.
 *
 * Node's built-in WebSocket does the debugging protocol, so there is nothing to
 * install for this either. */

import { spawn } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const PORT = 8791;
const DEBUG = 9333;
const PAGES = ['selftest', 'flowtest', 'audiotest'];
const wait = ms => new Promise(r => setTimeout(r, ms));

const only = process.argv[2];
const pages = only ? PAGES.filter(p => p === only) : PAGES;
if (!pages.length) {
  console.error(`no such page: ${only}. try one of ${PAGES.join(', ')}`);
  process.exit(2);
}

const profile = mkdtempSync(join(tmpdir(), 'verdant-test-'));
const server = spawn('python3', ['-m', 'http.server', String(PORT)], { stdio: 'ignore' });
const chrome = spawn(CHROME, [
  '--headless=new', '--disable-gpu', '--no-sandbox',
  '--autoplay-policy=no-user-gesture-required',
  `--remote-debugging-port=${DEBUG}`, `--user-data-dir=${profile}`,
  '--window-size=1200,900', 'about:blank'
], { stdio: 'ignore' });

const stop = () => {
  server.kill('SIGKILL');
  chrome.kill('SIGKILL');
  try { rmSync(profile, { recursive: true, force: true }); } catch (e) { /* it is in /tmp */ }
};
process.on('exit', stop);
process.on('SIGINT', () => { stop(); process.exit(130); });

async function ready(url, tries = 40) {
  for (let i = 0; i < tries; i++) {
    try { await fetch(url); return true; } catch (e) { await wait(250); }
  }
  return false;
}

/* One page, in its own tab, polled until it says it is done. Returns the title,
   which every page sets to PASS <n> or FAIL <n>, and any FAIL lines. */
async function run(page) {
  const url = `http://localhost:${PORT}/island/${page}.html`;
  const tab = await (await fetch(
    `http://127.0.0.1:${DEBUG}/json/new?${encodeURIComponent(url)}`, { method: 'PUT' })).json();
  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  let id = 0;
  const pending = new Map();
  const send = (method, params = {}) => new Promise(res => {
    const n = ++id;
    pending.set(n, res);
    ws.send(JSON.stringify({ id: n, method, params }));
  });
  ws.onmessage = e => {
    const m = JSON.parse(e.data);
    if (m.id && pending.has(m.id)) { pending.get(m.id)(m.result); pending.delete(m.id); }
  };
  await new Promise(r => ws.onopen = r);
  const evaluate = async expression =>
    (await send('Runtime.evaluate', { expression, returnByValue: true })).result?.value;

  const deadline = Date.now() + 180000;
  let done = false;
  while (Date.now() < deadline) {
    done = await evaluate("document.documentElement.dataset.done === '1'");
    if (done) break;
    await wait(500);
  }
  const title = await evaluate('document.title');
  const fails = await evaluate("(document.body.innerText.match(/^FAIL.*$/gm) || []).join('\\n')");
  await send('Page.close');
  ws.close();
  return { done, title, fails };
}

if (!await ready(`http://localhost:${PORT}/island/index.html`) ||
    !await ready(`http://127.0.0.1:${DEBUG}/json/version`)) {
  console.error('could not start the server or the browser');
  process.exit(2);
}

let bad = 0;
for (const page of pages) {
  const { done, title, fails } = await run(page);
  const state = !done ? 'DID NOT FINISH' : title;
  console.log(`${page.padEnd(10)} ${state}`);
  if (fails) console.log(fails.split('\n').map(l => '   ' + l).join('\n'));
  if (!done || /FAIL/.test(title)) bad++;
}

console.log(bad ? `\n${bad} page${bad === 1 ? '' : 's'} not clear` : '\nall clear');
process.exit(bad ? 1 : 0);
