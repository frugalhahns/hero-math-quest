/* Projects. This is where the reading turns into a changed island.
   A document tells you which jobs a project needs; the animals you have earned
   supply those jobs; assigning them rewrites tiles and opens a region. */

import { S, save } from './state.js';
import { PROJECTS, PROJECT_BY_ID } from './content/projects.js';
import { BY_ID, JOBS } from './content/pokemon.js';
import { applyProject } from './world.js';
import * as U from './ui.js';
import { sfx } from './audio.js';
import { advance, step } from './quest.js';

/* A project is only listed once you have read the document that explains it. */
function known(p) { return !p.learn || !!S.flags[p.learn]; }

function teamFor(job) {
  return S.team.map(id => BY_ID[id]).filter(sp => sp && sp.job === job);
}

export function openBuildList(onChange) {
  const rows = PROJECTS.map(p => {
    if (!known(p)) {
      return `<div class="card locked">
        <div><div class="nm">Not yet described</div>
        <div class="jb">Something on this island explains this one. You have not read it.</div></div>
      </div>`;
    }
    const done = !!S.projects[p.id];
    const missing = p.needs.filter(j => !teamFor(j).length);
    const needItem = p.needsItem && (S.items[p.needsItem.key] || 0) < p.needsItem.count;
    const status = done
      ? '<span class="tick">Finished</span>'
      : missing.length || needItem
        ? `<span class="muted">Not ready</span>`
        : '<span class="tick">Ready</span>';
    return `<button class="card pick" type="button" data-p="${p.id}">
      <div>
        <div class="nm">${U.esc(p.name)}${p.optional ? ' <span class="muted small">(optional)</span>' : ''}</div>
        <div class="jb">${U.esc(p.regionName)} &middot; ${status}</div>
        <div class="jb">Needs: ${p.needs.map(j => U.esc(JOBS[j].name)).join(', ')}</div>
      </div>
    </button>`;
  }).join('');

  const body = U.openSheet(`
    <h2>Projects</h2>
    <p class="kicker">Six things Warden Elm never finished</p>
    <p class="muted small">Every project needs particular kinds of work done. Which kinds, and by whom, is written down somewhere on the island rather than listed here.</p>
    <div class="grid2" style="margin-top:14px">${rows}</div>
    <div class="row end" style="margin-top:18px">
      <button class="btn" type="button" data-close>Close</button>
    </div>`);

  body.querySelectorAll('.card.pick').forEach(b =>
    b.addEventListener('click', () => openProject(b.dataset.p, onChange)));
}

export function openProject(id, onChange) {
  const p = PROJECT_BY_ID[id];
  if (!p) return;

  if (!known(p)) {
    U.openSheet(`
      <h2>${U.esc(p.name)}</h2>
      ${U.passageHTML([p.blurb, 'You do not know what this needs. Somewhere on this island there is a page that explains it, and you have not read that page yet.'])}
      <div class="row end" style="margin-top:16px"><button class="btn" type="button" data-close>Close</button></div>`);
    return;
  }

  if (S.projects[p.id]) {
    const crew = (S.crew[p.id] || []).map(i => BY_ID[i]).filter(Boolean);
    U.openSheet(`
      <h2>${U.esc(p.name)}</h2>
      <p class="kicker">Finished</p>
      ${U.passageHTML([p.finish])}
      ${crew.length ? `<h3>Crew</h3><div class="grid2">${crew.map(sp => U.creatureCard(sp)).join('')}</div>` : ''}
      <div class="row end" style="margin-top:18px"><button class="btn" type="button" data-close>Close</button></div>`);
    return;
  }

  const picked = {};   // job index -> species id
  let first = true;
  render();

  function render() {
    const needItem = p.needsItem && (S.items[p.needsItem.key] || 0) < p.needsItem.count;
    const slots = p.needs.map((job, i) => {
      const candidates = teamFor(job).filter(sp =>
        !Object.entries(picked).some(([k, v]) => Number(k) !== i && v === sp.id));
      return `<h3>${U.esc(JOBS[job].name)}</h3>
        <p class="muted small" style="margin:0 0 8px">${U.esc(candidates[0] ? candidates[0].jobDesc : 'Nobody on your team does this kind of work yet.')}</p>
        <div class="grid2">
          ${candidates.length
            ? candidates.map(sp => `
              <button class="card pick" type="button" data-slot="${i}" data-sp="${sp.id}"
                aria-pressed="${picked[i] === sp.id}">
                ${U.creatureImg(sp.id, 48)}
                <div><div class="nm">${U.esc(sp.name)}</div><div class="jb">${U.esc(sp.jobName)}</div></div>
              </button>`).join('')
            : '<div class="card locked"><div><div class="nm">No one yet</div><div class="jb">Keep reading. Somebody on this island does this.</div></div></div>'}
        </div>`;
    }).join('');

    const ready = p.needs.every((_, i) => picked[i]) && !needItem;

    // re-render in place after the first paint, or every pick scrolls the
    // reader back to the top of a long brief
    const paint = first ? U.openSheet : U.updateSheet;
    first = false;
    const body = paint(`
      <h2>${U.esc(p.name)}</h2>
      <p class="kicker">${U.esc(p.regionName)}</p>
      ${U.passageHTML([p.blurb, ...p.brief])}
      ${p.needsItem ? `<p class="${needItem ? 'why' : 'muted small'}" style="margin-top:14px">
        ${needItem
          ? `<b>You need ${U.esc(p.needsItem.label)}.</b> Something you have read says where it is.`
          : `Carrying ${U.esc(p.needsItem.label)}. <span class="tick">Yes</span>`}
      </p>` : ''}
      ${slots}
      <div class="row end" style="margin-top:18px">
        <button class="btn ghost" type="button" data-close>Later</button>
        <button class="btn" type="button" id="go" ${ready ? '' : 'disabled'}>Begin work</button>
      </div>
      ${ready ? '' : '<p class="muted small" style="margin-top:10px">Fill every job above to begin.</p>'}
    `);

    body.querySelectorAll('.card.pick').forEach(b => b.addEventListener('click', () => {
      const slot = Number(b.dataset.slot);
      picked[slot] = picked[slot] === b.dataset.sp ? undefined : b.dataset.sp;
      render();
    }));
    const go = body.querySelector('#go');
    if (go) go.addEventListener('click', () => complete(p, Object.values(picked).filter(Boolean), onChange));
  }
}

function complete(p, crew, onChange) {
  S.projects[p.id] = true;
  S.crew[p.id] = crew;
  applyProject(p);
  save();
  sfx.build();

  const before = step().id;
  advance();
  const now = step();

  const body = U.openSheet(`
    <h2>${U.esc(p.name)}</h2>
    <p class="kicker">Finished</p>
    ${U.passageHTML([p.finish])}
    ${p.opens ? `<div class="why"><b>${U.esc(p.opens)}</b> is open to you now.</div>` : ''}
    <h3>Crew</h3>
    <div class="grid2">${crew.map(i => U.creatureCard(BY_ID[i])).join('')}</div>
    ${before !== now.id ? `<h3>Next</h3><div class="passage"><p>${U.esc(now.objective)}</p></div>` : ''}
    <div class="row end" style="margin-top:18px">
      <button class="btn" type="button" data-close>Go and look</button>
    </div>`);
  if (onChange) onChange();
}
