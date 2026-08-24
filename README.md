# Hero Math Quest

A browser game that turns a stack of 3rd/4th grade math, reading and logic worksheets
into something a distractible 8 year old will actually finish. No install, no accounts,
no ads, no network calls. Everything saves in the browser on the device it is played on.

**Play it:** https://frugalhahns.github.io/hero-math-quest/

## What is in it

Eleven worlds. Nine come straight off the printed practice pages; Fraction Falls and
Standards Quest are the two additions that do not, and are marked as such:

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
| Standards Quest | Ten sub-worlds, Grade 3 and 4 | *Not from the worksheets.* Built from the Common Core standards |
| Boss Battle | All four operations, shuffled | Boss Battle Friday, Kumon-style Level C |

Every problem printed on the worksheets is in the game. Where the worksheets would run
out, generators produce new problems in the same difficulty band, so a level never
runs dry and never drifts off target. Fraction Falls is the exception: there were no
fraction pages in the stack, so all of it is generated.

## Standards coverage

Everything above grew out of a specific stack of worksheets. **Standards Quest** works
the other way round: it starts from the
[Common Core math standards](https://corestandards.org/wp-content/uploads/2023/09/Math_Standards1.pdf)
for Grade 3 and Grade 4 and fills in what the worksheets never touched. Ten sub-worlds,
each with its own adaptive level, covering **46 standards**:

| Sub-world | Grade | Standards |
|---|---|---|
| Groups & Arrays | 3 | 3.OA.A.1-4, 3.OA.B.5-6, 3.OA.D.9 |
| Place Value Peak | 3-4 | 3.NBT.A.1, 3.NBT.A.3, 4.NBT.A.1-3, 4.NBT.B.5-6 |
| Fraction Frontier | 3-4 | 3.NF.A.2-3, 4.NF.A.2, 4.NF.B.3-4 |
| Decimal Depot | 4 | 4.NF.C.5-7 |
| Clock Tower | 3-4 | 3.MD.A.1-2, 4.MD.A.1-2 |
| Data Depot | 3-4 | 3.MD.B.3-4, 4.MD.B.4 |
| Area Arena | 3-4 | 3.MD.C.5-7, 3.MD.D.8, 4.MD.A.3 |
| Shape Shrine | 3-4 | 3.G.A.1-2, 4.G.A.2-3 |
| Angle Academy | 4 | 4.MD.C.5, 4.MD.C.7, 4.G.A.1 |
| Factor Forest | 4 | 4.OA.A.1-3, 4.OA.B.4, 4.OA.C.5 |

The four-operation drills already covered 3.OA.C.7, 3.NBT.A.2 and 4.NBT.B.4; Mystery Lab
covers 3.OA.D.8; Fraction Falls covers 3.NF.A.1 and 4.NF.A.1. That is 52 of the 53 Grade 3
and Grade 4 standards.

**Counted at sub-part level, not just parent level.** Several standards break into lettered
parts, and having one question for the parent does not mean the parts are covered. Each of
these now has its own question: 3.NF.A.3a (equivalent means the same *point* on a number
line), 3.MD.C.7d (area is additive, so an L-shape decomposes into two rectangles),
4.NF.B.3d and 4.NF.B.4c (the fraction word problems, not just the bare arithmetic), plus
the halves of parent standards that were being skipped: scaled *picture* graphs as well as
bar graphs (3.MD.B.3), point/line/segment/ray vocabulary as well as angle types (4.G.A.1),
number names as well as expanded form (4.NBT.A.2), how many factor pairs a number has
rather than just one of them (4.OA.B.4), and the two-column conversion table (4.MD.A.1).

Fourteen of these standards are about reading a picture rather than a sentence, so the
picture is generated as SVG and *is* the question: an analog clock, a scaled bar graph, a
line plot in eighths, a number line, tiled unit squares, angles, polygons and line pairs.
All of it is drawn from CSS variables, so it works in both themes.

**Every world teaches before it tests.** The game used to open straight into questions,
which meant a kid could meet the word "perpendicular" for the first time in a question
about it, get it wrong, and learn nothing except that they got it wrong. Each of the ten
worlds now opens on a short primer, 91 pages in total:

- **What to know** — one idea per page, under about 45 words, with the *same drawing the
  questions use*, so nothing is new at quiz time except the question.
- **How to solve it** — every question type with two routes, always in this order:
  **the sure way** (foundational: count the squares, fold the shape, skip-count) and
  **the fast way** (efficient: length × width, look for the square-corner box, ×5 then
  adjust). A kid taught only the shortcut has nothing to fall back on when memory fails;
  a kid taught only the long way stays slow.

Geometry has the longest deck (17 pages for shapes, 12 for angles) because it carries the
most vocabulary. Nothing is forced: "Skip, just quiz me" is always there, and a tick on the
world marks a primer you have read.

**Denominators are held to the grades' own limits.** The 3.NF footnote limits Grade 3 to
denominators 2, 3, 4, 6 and 8; the 4.NF footnote allows 2, 3, 4, 5, 6, 8, 10, 12 and 100.
Nothing outside that list appears anywhere, including in wrong answers and in the
un-simplified half of a "simplest form" question, so a kid never meets a denominator they
have not been taught. A generated-content check enforces this over 80,000 items.

**One standard is deliberately left out.** 4.MD.C.6 asks a kid to measure and sketch angles
*with a protractor*. That wants a real protractor and paper, not a tap target, so it stays
on paper. The in-game coverage screen says so too, rather than quietly claiming it.

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

## Verdant Isle: a second game, all reading

`island/` is a separate game in this repo. It is an exploration game where reading
comprehension is the only thing that moves you forward: the game never marks your
objective on the map, and every step is written on a notice, a tide chart, a tablet or
a cave wall that you have to understand before you know where to go. You make friends
with the island's animals by answering questions about the ranger's notes on them, and
each one does a job that a build project needs — which project needs which job is,
again, something you have to read.

The reading comes a few sentences at a time: every passage is a stack of short pages
with Next and Back, and no page runs over 60 words. There is a cozy soundtrack, and
still not a single audio file in the repo — every note is generated in the browser,
one theme per region, and it ducks out of the way while a passage is on screen. Six regions, eleven animals in
twenty-four forms, 91 comprehension questions, a Team Rocket subplot about the
perils of not reading the instructions, no fighting and no failure states.
Animals evolve, and evolution is earned by *recall*: some time after you read an
animal's notes, it asks you to answer questions about them with the notes shut, and deliberately no
read-aloud button — comprehension is the skill being practised here, so having the
browser read the passage out would route around the point.

See [island/README.md](island/README.md) for the design, and `island/selftest.html` for
the ~1,090 assertions that prove the whole thing is still solvable in order and still
reading at grade level (measured with Flesch-Kincaid; it currently averages 2.3).

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
  content/         mathbanks, fractions, standards, artkit, lessons, wordproblems,
                   logic, reading, cases
  modes/           drill, fractions, standards, learn, mystery, logic, reading, detective
```

Adding content means editing one file in `js/content/`. The runner in `session.js`
already knows how to present these question kinds: `numeric`, `choice`, `seq2`,
`order`, `gridAssign`, `steps`.
