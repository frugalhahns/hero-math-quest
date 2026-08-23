# Hero Math Quest

A browser game that turns a stack of 3rd/4th grade math, reading and logic worksheets
into something a distractible 8 year old will actually finish. No install, no accounts,
no ads, no network calls. Everything saves in the browser on the device it is played on.

**Play it:** https://frugalhahns.github.io/hero-math-quest/

## What is in it

Ten worlds. Nine come straight off the printed practice pages; Fraction Falls is
the one addition that does not, and is marked as such:

| World | Skill | Source material |
|---|---|---|
| Green Hill Rings | Addition | Daily Math Practice Week 1, Super Math Quest chunk 1 |
| Deepslate Mine | Subtraction | Daily Math Practice Week 1, Super Math Quest chunk 2 |
| Web-Swing City | Multiplication | Daily Math Practice Week 1, Super Math Quest chunk 3 |
| Trainer Gym | Division | Daily Math Practice Week 1, Super Math Quest chunk 4 |
| Fraction Falls | Fractions | *Not from the worksheets.* Generated to the standard 3rd/4th grade sequence |
| Mystery Lab | Multi-step word problems | Multi-Step Word Problems L1 and L2, Tricky Mode, Kumon-style set |
| Detective Casebook | Deduction, memory, inference | A Detective's Casebook, all 3 cases plus the master memory challenge |
| Logic Lab | Patterns, comparisons, odd-one-out, logic grids, sequencing, if-then | Complete Math and Logic Workbook, chapter 7 |
| Story Zone | Reading comprehension | Complete Math and Logic Workbook, chapter 8, plus one grade-4 stretch story |
| Boss Battle | All four operations, shuffled | Boss Battle Friday, Kumon-style Level C |

Every problem printed on the worksheets is in the game. Where the worksheets would run
out, generators produce new problems in the same difficulty band, so a level never
runs dry and never drifts off target. Fraction Falls is the exception: there were no
fraction pages in the stack, so all of it is generated.

## How the difficulty works

Each of the four operations has its own level, 1 to 5, and each level matches a day
of the printed Week 1 pages:

1. two-digit work, no regrouping to speak of (Monday)
2. two-digit with regrouping (Tuesday)
3. sums past 100, harder facts (Wednesday)
4. three-digit, 12x tables (Thursday)
5. three-digit carrying and borrowing, bigger division (Boss Battle Friday)

Fractions carry their own level on the same 1 to 5 ladder, but the bands are the
standard 3rd/4th grade order rather than the Week 1 pages:

1. name the shaded fraction, unit fractions of a small set (halves, thirds, fourths)
2. fifths through eighths, equivalent fractions, a fraction of a set
3. comparing (same top or same bottom), bigger sets, first like-denominator sums
4. adding and subtracting with like denominators, simplest form, against 1/2
5. sums past one whole, harder simplifying, denominators to twelfths

Fractions start at level 1 rather than 2, since the naming questions come before
anything on the arithmetic pages.

After each round the level moves on its own: 85% or better bumps it up, under 50%
eases it back down. Nothing to configure, and the kid never sees a screen full of
problems that are too hard.

## The ADHD-specific parts

These are deliberate, not decoration:

- **Rounds are short.** Default 8 problems, adjustable down to 4 in settings. The
  worksheets used a 10-minutes-on, 10-minutes-off structure. Same idea here.
- **Play break built into the reward screen.** A two-minute timer with a random
  movement card (jumping jacks, bear crawl, freeze dance). Skippable, but offered
  every single round.
- **Nothing dead-ends.** Two or three tries, then the answer plus the reasoning, then
  the game moves on. No stuck screens, no red X wall.
- **On-screen keypad.** No hunting for keys, no typos ruining a right answer.
- **Numbers in word problems are highlighted** so they pop out of the sentence.
- **Step boxes for multi-step problems.** One step at a time, previous answers stay
  visible, so nothing has to be held in working memory.
- **Read-it-to-me** on every story, case file and word problem, using the browser's
  built-in speech.
- **Calm mode** kills the animation. **Focus mode** hides the XP bar and counters for
  days when the numbers themselves are the distraction.
- **Fraction bars are drawn, not described.** The naming questions show the shaded
  bar as SVG, colored from the theme so it reads in light and dark.
- **Light and dark themes.** The theme follows the device by default and can be pinned
  to Light or Dark in settings. The light palette is measured against WCAG AA: 4.5:1 or
  better on every text pair, 3:1 or better on borders, controls and the focus ring.
- **Immediate, varied feedback.** Sound, confetti, a different praise line every time.
- **Progress that accumulates:** XP, levels, rings to spend, 11 badges, a day streak.

## Grown-up view

The **Grown-up stats** button on the map shows questions answered, accuracy per skill,
current level per skill, rounds finished, day streak and badges. It also explains what
the levels mean. Everything is local to the device; there is no server and nothing is
uploaded.

## Verdant Isle: a second game, for an older reader

`island/` is a separate game in this repo, aimed at an 8th grade reader instead of a
3rd/4th grade one. It is an exploration game where reading comprehension is the only
thing that moves you forward: the game never marks your objective on the map, and every
step is written on a notice, a tide chart, a tablet or a cave wall that you have to
understand before you know where to go. You earn the island's residents by answering
questions about the warden's field notes on them, and each one does a job that a build
project needs — which project needs which job is, again, something you have to read.

Six regions, eleven residents, 78 comprehension questions, no fighting and no failure
states, and deliberately no read-aloud button — comprehension is the skill being
practised, so having the browser read the passage out would route around the point.
See [island/README.md](island/README.md) for the design, and `island/selftest.html`
for the ~1,020 assertions that prove the whole thing is still solvable in order.

**Play it:** https://frugalhahns.github.io/hero-math-quest/island/

## Running it locally

It is plain HTML, CSS and ES modules. No build step, no dependencies.

```sh
python3 -m http.server 8000
# then open http://localhost:8000
```

It has to be served over http rather than opened as a `file://` path, because ES
modules need a real origin.

## Deploying

GitHub Pages, served from the default branch root. `.nojekyll` is present so the
`js/` directory is published as-is. Push to `main` and Pages redeploys.

## About the characters

All artwork here is original SVG drawn from scratch: a blue speedster, a masked
web-hero, a blocky miner, an electric mouse. No copyrighted art or audio files are
included or downloaded, and the in-game characters use their own names (Dash, Web,
Blocky, Volt). This is a personal learning tool for one kid, in the same spirit as
the worksheets it came from.

## Layout

```
index.html
island/          Verdant Isle, the grade-8 reading game (see island/README.md)
css/style.css
js/
  main.js          home map, shop, settings, grown-up stats, boot
  session.js       the question runner, all question kinds live here
  state.js         save data, XP, levels, badges, adaptive difficulty
  ui.js            rendering, effects, brain breaks, read-aloud
  audio.js         WebAudio synth, no audio files
  sprites.js       original SVG characters and icons
  theme.js         light / dark / auto color theme
  content/         mathbanks, fractions, wordproblems, logic, reading, cases
  modes/           drill, mystery, logic, reading, detective
```

Adding content means editing one file in `js/content/`. The runner in `session.js`
already knows how to present these question kinds: `numeric`, `choice`, `seq2`,
`order`, `gridAssign`, `steps`.
