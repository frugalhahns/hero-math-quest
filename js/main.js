/* Boot, home map, shop, settings, grown-up dashboard. */

import { S, save, resetAll, touchDay, level, BADGES } from './state.js';
import { setSound, sfx } from './audio.js';
import { applyTheme } from './theme.js';
import * as U from './ui.js';
import { SKILL_META } from './content/mathbanks.js';
import { HEROES } from './sprites.js';
import { startDrill, startFractions, bossIntro } from './modes/drill.js';
import { mysteryMenu } from './modes/mystery.js';
import { logicMenu } from './modes/logic.js';
import { readingMenu } from './modes/reading.js';
import { caseMenu } from './modes/detective.js';

const SHOP = [
  { key: 'speedster', name: 'Dash the Speedster', price: 0 },
  { key: 'webhero',   name: 'Web the Wall-Crawler', price: 60 },
  { key: 'miner',     name: 'Blocky the Miner', price: 120 },
  { key: 'sparkmouse',name: 'Volt the Spark Mouse', price: 200 }
];

/* ---------------- home ---------------- */

export function home() {
  U.stopSpeak();
  U.updateHud();
  const goal = S.dailyGoal || 3;
  const doneToday = S.chunksToday || 0;
  const pct = Math.min(100, Math.round((doneToday / goal) * 100));

  U.render(`
    <div class="panel" id="playercard">
      <div class="avatar bob">${U.sp.heroSvg(S.hero, 'happy')}</div>
      <div class="who">
        <h2>${U.esc(S.name)}</h2>
        <div class="muted">Level ${level()} | ${S.coins} rings | ${S.streak} day streak</div>
        <div class="badgestrip">
          ${BADGES.map(b => `<span class="badge ${S.badges[b.id] ? 'on' : ''}" title="${U.esc(b.need)}">${U.esc(b.name)}</span>`).join('')}
        </div>
      </div>
    </div>

    <div class="panel">
      <div class="row">
        <b>Today's mission</b>
        <span class="spacer"></span>
        <span class="muted">${doneToday} of ${goal} rounds</span>
      </div>
      <div class="meter"><i style="width:${pct}%"></i></div>
      ${doneToday >= goal ? '<p class="muted" style="margin-bottom:0">Mission complete. Anything else today is bonus XP.</p>'
        : '<p class="muted" style="margin-bottom:0">Each round is a short chunk. Break in between. That is the plan.</p>'}
    </div>

    <h3 style="margin:16px 4px 8px">Pick a world</h3>
    <div class="worldgrid">
      ${['add','sub','mul','div'].map(sk => {
        const m = SKILL_META[sk];
        return `<button class="world" data-c="${m.color}" data-go="drill:${sk}">
          <span class="lvlpill">LV ${S.levels[sk] || 1}</span>
          <div class="art">${U.sp.heroSvg(m.hero, 'idle')}</div>
          <b>${U.esc(m.world)}</b><span>${U.esc(m.label)} practice, ${S.chunkSize} problems</span>
        </button>`;
      }).join('')}

      <button class="world" data-c="frac" data-go="frac">
        <span class="lvlpill">LV ${S.levels.frac || 1}</span>
        <div class="art">${U.sp.heroSvg('miner', 'idle')}</div>
        <b>Fraction Falls</b><span>Parts of a whole, ${S.chunkSize} problems</span>
      </button>

      <button class="world" data-c="mystery" data-go="mystery">
        <span class="lvlpill">READ + MATH</span>
        <div class="art">${U.sp.magnifier()}</div>
        <b>Mystery Lab</b><span>Multi-step word problems with step boxes</span>
      </button>

      <button class="world" data-c="detective" data-go="cases">
        <span class="lvlpill">${Object.keys(S.completed).filter(k => k.startsWith('case')).length}/3</span>
        <div class="art">${U.sp.magnifier()}</div>
        <b>Detective Casebook</b><span>Mysteries, clues, memory and deduction</span>
      </button>

      <button class="world" data-c="logic" data-go="logic">
        <span class="lvlpill">6 TYPES</span>
        <div class="art">${U.sp.brainIcon()}</div>
        <b>Logic Lab</b><span>Patterns, grids, odd-one-out, if-then</span>
      </button>

      <button class="world" data-c="story" data-go="reading">
        <span class="lvlpill">STORIES</span>
        <div class="art">${U.sp.bookIcon()}</div>
        <b>Story Zone</b><span>Reading comprehension drills and stories</span>
      </button>

      <button class="world" data-c="boss" data-go="boss">
        <span class="lvlpill">HARD</span>
        <div class="art">${U.sp.crown()}</div>
        <b>Boss Battle</b><span>All four skills mixed. One level harder.</span>
      </button>
    </div>

    <div class="row" style="margin-top:16px">
      <button class="btn ghost" id="shop">Ring Shop</button>
      <button class="btn ghost" id="grown">Grown-up stats</button>
    </div>
  `);

  document.querySelectorAll('[data-go]').forEach(b => {
    b.onclick = () => {
      const v = b.dataset.go;
      sfx.tap();
      if (v.startsWith('drill:')) return startDrill(v.split(':')[1], home);
      if (v === 'frac') return startFractions(home);
      if (v === 'mystery') return mysteryMenu(home);
      if (v === 'cases') return caseMenu(home);
      if (v === 'logic') return logicMenu(home);
      if (v === 'reading') return readingMenu(home);
      if (v === 'boss') return bossIntro(home);
    };
  });
  document.getElementById('shop').onclick = shop;
  document.getElementById('grown').onclick = grownUp;
}

/* ---------------- shop ---------------- */

function shop() {
  U.render(`
    <div class="panel">
      <h2>Ring Shop</h2>
      <p class="muted">You have <b>${S.coins}</b> rings. Earn 2 per correct answer, more on a hot streak.</p>
    </div>
    <div class="shopgrid">
      ${SHOP.map(it => {
        const owned = S.owned.includes(it.key);
        const equipped = S.hero === it.key;
        return `<div class="shopitem ${owned ? 'owned' : ''} ${equipped ? 'equipped' : ''}" data-key="${it.key}">
          ${U.sp.heroSvg(it.key, 'happy')}
          <div style="font-size:13px;font-weight:700;margin-top:4px">${U.esc(it.name)}</div>
          <div class="price">${equipped ? 'EQUIPPED' : owned ? 'tap to equip' : it.price + ' rings'}</div>
        </div>`;
      }).join('')}
    </div>
    <button class="btn ghost big" id="back" style="margin-top:16px">Back to map</button>
  `);
  document.getElementById('back').onclick = home;
  document.querySelectorAll('.shopitem').forEach(el => {
    el.onclick = () => {
      const key = el.dataset.key;
      const item = SHOP.find(x => x.key === key);
      if (S.owned.includes(key)) { S.hero = key; save(); sfx.coin(); U.updateHud(); shop(); return; }
      if (S.coins < item.price) { sfx.wrong(); U.shake(el); return; }
      S.coins -= item.price; S.owned.push(key); S.hero = key; save();
      sfx.badge(); U.confetti(50); U.updateHud(); shop();
    };
  });
}

/* ---------------- grown-up dashboard ---------------- */

function grownUp() {
  const acc = sk => {
    const s = S.stats['sk_' + sk];
    if (!s || (s.right + s.wrong) === 0) return 'no data yet';
    return Math.round((s.right / (s.right + s.wrong)) * 100) + '% of ' + (s.right + s.wrong);
  };
  const overall = S.totalAnswered ? Math.round((S.totalCorrect / S.totalAnswered) * 100) : 0;
  U.render(`
    <div class="panel">
      <h2>Grown-up stats</h2>
      <p class="muted">Everything is stored on this device only. Nothing is uploaded anywhere.</p>
      <ul class="clues">
        <li>Questions answered: <b>${S.totalAnswered}</b> | overall accuracy <b>${overall}%</b></li>
        <li>Rounds finished: <b>${S.stats.chunks || 0}</b> | day streak <b>${S.streak}</b> | days played <b>${S.daysPlayed.length}</b></li>
        <li>Addition: level <b>${S.levels.add}</b> (${acc('add')})</li>
        <li>Subtraction: level <b>${S.levels.sub}</b> (${acc('sub')})</li>
        <li>Multiplication: level <b>${S.levels.mul}</b> (${acc('mul')})</li>
        <li>Division: level <b>${S.levels.div}</b> (${acc('div')})</li>
        <li>Fractions: level <b>${S.levels.frac}</b> (${acc('frac')})</li>
        <li>Badges: <b>${Object.keys(S.badges).length} of ${BADGES.length}</b></li>
      </ul>
      <p class="muted">Levels move on their own: 85% or better on a round bumps the level up, under 50% eases it back down. Levels 1 to 5 run from
      2-digit work up to 3-digit carrying and 12x tables, matching the printed Week 1 pages.</p>
      <button class="btn ghost big" id="back">Back to map</button>
    </div>
  `);
  document.getElementById('back').onclick = home;
}

/* ---------------- settings ---------------- */

function settings() {
  U.modal(`
    <h2>Settings</h2>
    <label class="field"><span>Player name</span><input type="text" id="s-name" value="${U.esc(S.name)}" maxlength="16"></label>
    <label class="field"><span>Problems per round (shorter is better for a wiggly day)</span>
      <select id="s-chunk">
        ${[4, 6, 8, 10, 12].map(n => `<option value="${n}" ${S.chunkSize === n ? 'selected' : ''}>${n}</option>`).join('')}
      </select></label>
    <label class="field"><span>Rounds per day goal</span>
      <select id="s-goal">
        ${[1, 2, 3, 4, 5].map(n => `<option value="${n}" ${S.dailyGoal === n ? 'selected' : ''}>${n}</option>`).join('')}
      </select></label>
    <label class="field"><span>Color theme</span>
      <select id="s-theme">
        ${[['auto', 'Auto (match my device)'], ['light', 'Light'], ['dark', 'Dark']]
          .map(([v, lbl]) => `<option value="${v}" ${(S.theme || 'auto') === v ? 'selected' : ''}>${lbl}</option>`).join('')}
      </select></label>
    <label class="check"><input type="checkbox" id="s-motion" ${S.reduceMotion ? 'checked' : ''}> Calm mode (less animation)</label>
    <label class="check"><input type="checkbox" id="s-focus" ${S.focusMode ? 'checked' : ''}> Focus mode (hide XP and counters)</label>
    <label class="check"><input type="checkbox" id="s-sound" ${S.soundOn ? 'checked' : ''}> Sound effects</label>
    <div class="row" style="margin-top:14px">
      <button class="btn go" id="s-save">Save</button>
      <button class="btn ghost" id="s-close">Cancel</button>
      <span class="spacer"></span>
      <button class="chip" id="s-reset">Erase all progress</button>
    </div>
  `, card => {
    card.querySelector('#s-close').onclick = U.closeModal;
    card.querySelector('#s-save').onclick = () => {
      S.name = card.querySelector('#s-name').value.trim() || 'Hero';
      S.chunkSize = Number(card.querySelector('#s-chunk').value);
      S.dailyGoal = Number(card.querySelector('#s-goal').value);
      S.theme = card.querySelector('#s-theme').value;
      S.reduceMotion = card.querySelector('#s-motion').checked;
      S.focusMode = card.querySelector('#s-focus').checked;
      S.soundOn = card.querySelector('#s-sound').checked;
      setSound(S.soundOn);
      applyTheme();
      save(); U.closeModal(); U.updateHud(); home();
    };
    card.querySelector('#s-reset').onclick = () => {
      U.modal(`<h2>Erase everything?</h2><p>This wipes levels, badges, rings and stats on this device. It cannot be undone.</p>
        <div class="row"><button class="btn warn" id="yes">Yes, erase</button><button class="btn ghost" id="no">No, keep it</button></div>`, c2 => {
        c2.querySelector('#no').onclick = U.closeModal;
        c2.querySelector('#yes').onclick = () => { resetAll(); U.closeModal(); setSound(S.soundOn); applyTheme(); U.updateHud(); home(); };
      });
    };
  });
}

/* ---------------- first run ---------------- */

function welcome() {
  U.render(`
    <div class="panel center">
      <div class="row" style="justify-content:center">
        ${Object.keys(HEROES).map(k => `<div style="width:62px;height:62px">${U.sp.heroSvg(k, 'happy')}</div>`).join('')}
      </div>
      <h2>Hero Math Quest</h2>
      <p>Short rounds. Real breaks. Math, reading and detective work with your crew.</p>
      <label class="field" style="text-align:left"><span>What should we call you?</span>
        <input type="text" id="w-name" placeholder="Type your name" maxlength="16"></label>
      <button class="btn go big" id="w-go">Start the quest</button>
      <p class="muted" style="font-size:12px;margin-top:14px">Everything saves on this device. No accounts, no ads, nothing sent anywhere.</p>
    </div>
  `);
  document.getElementById('w-go').onclick = () => {
    const v = document.getElementById('w-name').value.trim();
    S.name = v || 'Hero';
    S.completed['welcomed'] = true;
    save(); sfx.levelup(); U.confetti(40); home();
  };
}

/* ---------------- boot ---------------- */

function boot() {
  touchDay();
  applyTheme();
  setSound(S.soundOn);
  U.updateHud();

  document.getElementById('btn-home').onclick = () => { U.stopSpeak(); home(); };
  document.getElementById('btn-settings').onclick = settings;
  document.getElementById('btn-sound').onclick = () => {
    S.soundOn = !S.soundOn; setSound(S.soundOn); save(); U.updateHud();
    if (S.soundOn) sfx.coin();
  };
  document.getElementById('modal').addEventListener('click', e => {
    if (e.target.id === 'modal') U.closeModal();
  });

  if (S.completed['welcomed']) home(); else welcome();
}

boot();
