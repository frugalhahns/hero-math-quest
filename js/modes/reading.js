/* Story Zone: quick read drills and full stories with comprehension questions. */

import { S, markComplete, grantBadge } from '../state.js';
import { QUICK, STORIES } from '../content/reading.js';
import { runSession } from '../session.js';
import * as U from '../ui.js';
import { sfx } from '../audio.js';

export function readingMenu(onDone) {
  const storiesDone = STORIES.filter(s => S.completed[s.id]).length;
  U.render(`
    <div class="panel">
      <h2>Story Zone</h2>
      <p class="muted">Reading is the sneaky superpower. Every math word problem is a reading problem in disguise.</p>
      <p class="muted">Stories finished: <b>${storiesDone} / ${STORIES.length}</b></p>
    </div>
    <div class="worldgrid">
      <button class="world" data-c="story" data-go="quick">
        <span class="lvlpill">FAST</span>
        <div class="art">${U.sp.bookIcon()}</div>
        <b>Quick Read Drills</b><span>${U.esc(QUICK.blurb)}</span>
      </button>
      ${STORIES.map(s => `<button class="world" data-c="story" data-go="story:${s.id}">
        <span class="lvlpill">${S.completed[s.id] ? 'DONE' : s.level}</span>
        <div class="art">${U.sp.heroSvg(s.hero, 'happy')}</div>
        <b>${U.esc(s.title)}</b><span>${s.questions.length} questions. Read it, then answer.</span>
      </button>`).join('')}
    </div>
    <button class="btn ghost big" id="back" style="margin-top:14px">Back to map</button>
  `);
  document.getElementById('back').onclick = onDone;
  document.querySelectorAll('[data-go]').forEach(b => {
    b.onclick = () => {
      const v = b.dataset.go;
      if (v === 'quick') startQuick(onDone);
      else startStory(v.split(':')[1], onDone);
    };
  });
}

export function startQuick(onDone) {
  const pool = QUICK.items.slice();
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  const picked = pool.slice(0, 8).map(it => ({
    kind: 'choice',
    tag: 'READ FAST',
    passage: `<p>${U.esc(it.text)}</p>`,
    passageText: it.text,
    prompt: it.q,
    choices: it.choices,
    answer: it.answer
  }));
  sfx.whoosh();
  runSession({
    title: 'Quick Read Drills',
    subtitle: 'read once, answer fast',
    heroKey: 'webhero',
    questions: picked,
    onDone: () => readingMenu(onDone),
    onAgain: () => startQuick(onDone),
    onQuit: () => readingMenu(onDone)
  });
}

export function startStory(id, onDone) {
  const story = STORIES.find(s => s.id === id);
  if (!story) return readingMenu(onDone);
  const html = story.paras.map(p => `<p>${U.esc(p)}</p>`).join('');
  const plain = story.paras.join(' ');

  U.render(`
    <div class="panel">
      <div class="row">
        <div style="width:56px;height:56px">${U.sp.heroSvg(story.hero, 'happy')}</div>
        <div><h2 style="margin:0">${U.esc(story.title)}</h2><div class="muted">${U.esc(story.level)}</div></div>
      </div>
      <div class="storybox" style="max-height:none;margin-top:10px">${html}</div>
      <div class="row" style="margin-top:12px">
        ${U.canSpeak() ? '<button class="chip" id="say">Read it to me</button><button class="chip" id="stop">Stop reading</button>' : ''}
      </div>
      <button class="btn go big" id="go" style="margin-top:12px">I read it. Ask me the questions</button>
      <button class="btn ghost big" id="back" style="margin-top:10px">Back</button>
    </div>
  `);
  const say = document.getElementById('say');
  if (say) {
    say.onclick = () => U.speak(story.title + '. ' + plain);
    document.getElementById('stop').onclick = () => U.stopSpeak();
  }
  document.getElementById('back').onclick = () => { U.stopSpeak(); readingMenu(onDone); };
  document.getElementById('go').onclick = () => {
    U.stopSpeak();
    sfx.whoosh();
    runSession({
      title: story.title,
      subtitle: 'you can scroll back up to the story',
      heroKey: story.hero,
      questions: story.questions.map(q => ({
        kind: 'choice', tag: q.tag, prompt: q.q, choices: q.choices, answer: q.answer,
        passage: html, passageText: plain
      })),
      onDone: () => {
        markComplete(story.id);
        if (STORIES.every(s => S.completed[s.id])) grantBadge('reader');
        readingMenu(onDone);
      },
      onAgain: () => startStory(id, onDone),
      onQuit: () => readingMenu(onDone)
    });
  };
}
