# Verdant Isle

A browser exploration game where **reading comprehension is the only mechanic that
moves you forward**. Written for a 3rd grade reader, a few sentences at a time.
No install, no accounts, no ads, no network calls. Everything saves in the browser
on the device it is played on.

**Play it:** https://frugalhahns.github.io/hero-math-quest/island/

## The idea

The game never puts an arrow on your map. Every step is written on something — a
notice nailed to a door, a tide chart in a metal box, a tablet by a stone circle,
words cut into a cave wall — and the writing is the only place the answer exists.
You read it, you answer questions about it, and then you have to work out where
that means you should go.

Three loops, all driven by text:

1. **Find out what to do.** A document explains the next problem without pointing
   at it. The tide chart says the iron handle is buried "where the shadow ends" and
   not "at the near end of the rock" — and the beach has a dug spot at each, so
   reading it wrong is possible and reading it right is a real result.
2. **Make a friend.** Walk up to any animal and you get Ranger Elm's notes on it.
   Correct answers build rapport; wrong ones spend patience, and at zero it walks
   off — back to where you found it, so you read the page again and try once more.
   No fighting, no ball, no way to lose anything permanently.
3. **Change the island.** Each animal has a job. Every project needs particular
   jobs, and *which* is something you have to read to find out. Finishing one
   rewrites the map and opens the region holding the next documents.

The chain cannot be short-circuited: the reed walkway needs a digger → the diggers
are in the grove → the grove is behind a rope crossing → the tablet explaining that
crossing is the only thing that says it needs a carrier *and* a planter.

## Reading a little at a time

A screen full of text is the fastest way to lose a reader this age, so **nothing
here ever shows more than a few sentences at once.** Every passage is a stack of
short pages:

```
The Tide Chart
FROM THE METAL BOX AT THE END OF THE DOCK

Page 3 of 7                        ● ● ● ○ ○ ○ ○

  The gate does not swing open. A handle turns a
  drum. The drum winds up a chain. The chain lifts
  the door up out of the water.

[ Back ]  [ Put it back ]              [ Next → ]
```

Back is always there for the page you just left, and during the questions a
**Read it again** button flips back through the same pages and returns you to the
question you were on. The self test enforces the format: no passage may be fewer
than 3 pages, and no single page may run over 60 words.

## What is in it

| Region | Opened by | Animals | Documents |
|---|---|---|---|
| Landing Beach | start | Pidgey, Psyduck | Notice, tide chart, who-can-do-what |
| Meadow Hollow | The Channel Gate | Chikorita, Machop, Pikachu | The tablet by the stone circle |
| Whispering Grove | The Rope Crossing | Bulbasaur, Diglett | The plaque in the clearing |
| Reed Marsh | The Reed Walkway | Wooper, Chinchou | The water notebook |
| Tidepool Caves | The Light Line | Snorlax | Words cut into the cave wall |
| Ash Ridge | The Rock Slide | Ditto | The last page |

- **6 regions**, hand-drawn as tile maps, 34 x 24 tiles each
- **11 animals**, each with a paged field-note passage and 5 questions
- **8 documents**, each with 3 or 4 questions
- **12 signs** and scenery notes, two of which carry a detail a document relies on
- **82 comprehension questions** in total
- **22 steps** in the chain
- **6 build projects**, one of them optional and worth nothing but doing

## The reading itself

Passages run 100–150 words in total, split across 4 to 8 pages. Short sentences,
plain words, one idea per page. The question types are the ones that matter at this
level rather than recall alone:

`Main idea` `Detail` `Inference` `Cause and effect` `Word meaning`
`Text evidence` `What to do` `Author's craft`

Some deliberate choices:

- **Every explanation quotes the text.** A wrong answer never just says "wrong" —
  it points at the sentence that settles it, and where a distractor is *nearly*
  right it says why it falls short.
- **Wrong answers requeue.** A missed question goes to the back of the line and
  comes round again after you have read the explanation. You cannot get stuck and
  you cannot skip past something you did not follow.
- **Choices are shuffled on every render.** The content was written without
  watching where the right answer landed and it came out badly lopsided; shuffling
  fixes that permanently, and also means a requeued question cannot be answered
  from memory of the layout.
- **Vocabulary is supported, not withheld.** Any word in a passage with a dotted
  underline gives its meaning *for that sentence* when tapped, in words easier
  than the one being explained. The same word appears in a question in plain
  italics, so a vocabulary question never hands over its answer.
- **There is deliberately no read-aloud.** The other game in this repo has a
  read-it-to-me button on every story, because there decoding is the bottleneck
  and speech removes it. Here comprehension *is* the skill being practised, so
  having the browser read the passage out would route straight around the thing
  the game exists to exercise. The glossary, the short pages and the
  always-available text are the supports instead.
- **Nothing is lost for good.** An animal that walks away goes back where it was.
  A project you cannot staff yet stays listed. There are no failure states.

The theme running through Ranger Elm's notes — that reading a place before acting
in it is slower than being confident and better than being confident — is also the
game's design brief.

## Running it locally

Plain HTML, CSS and ES modules. No build step, no dependencies.

```sh
python3 -m http.server 8000
# then open http://localhost:8000/island/
```

It has to be served over http rather than opened as a `file://` path, because ES
modules need a real origin.

## Self test

There is no build step and no type checker, so the invariants that would otherwise
be silent bugs are asserted instead. Open `island/selftest.html` and it runs ~1,090
checks in the browser, including:

- every tile map row is exactly the declared width, and every tile character is one
  the renderer knows how to draw
- every entity sits on a real tile and has at least one **reachable** walkable tile
  next to it, so no document or animal can be walled off
- every region crossing lands on a walkable, reachable tile and has a way back
- every question's answer index is in range, has no duplicate choices, and has a
  real explanation
- **the whole game is solvable in order** — a simulation reads what is reachable,
  befriends who is reachable, builds what it can staff, and repeats, then asserts
  that all 6 regions open, all 11 animals can be earned, all 6 projects can be
  finished, and the 22-step chain runs to its last step
- **the reading level is measured, not assumed** — a Flesch-Kincaid score is
  computed for every passage and for the questions and choices as a group, and each
  one has to come in at or under 5.0 with the corpus averaging 4.0 or easier. It
  currently averages **2.3**, and the hardest single passage is the Ditto page at
  3.2. It also enforces the page format: 3 pages minimum, 60 words maximum per
  page, 18 words maximum per question stem, 14 per answer choice
- every `{braced}` word has a definition and every definition is used
- every vocabulary question asks about a word that appears in its own passage
- every animal has a dex number, a sane overworld height, and **both sprite files
  actually present on disk** — fetched rather than assumed, since those are
  vendored binaries and a missing one would leave an empty tile
- all six regions render without throwing

The solvability simulation and the reading-level check are the two worth keeping.
One catches a requirement chain that has quietly become impossible; the other
catches prose drifting back above the target, which is very easy to do when editing
content.

## Layout

```
index.html          the shell: canvas, sprite layer, top bar, touch pad, sheet
selftest.html       content, reachability and reading-level assertions
css/island.css      one stylesheet, light and dark
js/
  main.js           boot, input, frame loop, what the action button does
  world.js          live tile grids, collision, crossings, camera, map renderer
  tileset.js        every tile drawn in code, four variants each, two water frames
  pixels.js         original 16x16 pixel art, baked to canvas on first use
  creatures.js      dex numbers, sprite paths, and how tall each one stands
  state.js          the save file
  ui.js             the sheet, the paged reader, glossary, question runner
  reading.js        documents and signs
  encounter.js      meeting an animal
  build.js          projects and crew assignment
  quest.js          the 22-step chain
  panels.js         journal, team, help, settings, ending
  audio.js          WebAudio synth, no audio files
  content/
    maps.js         the six tile maps
    entities.js     what is placed where, and the region crossings
    quests.js       the documents, the signs, the chain
    pokemon.js      the eleven animals: field notes and questions
    projects.js     what each project needs and what it changes
    glossary.js     definitions, written for the sentence not the dictionary
sprites/
  anim/             animated Gen V sprites, one per species, used everywhere
  still/            static Gen V sprites, kept as a non-animated fallback
```

Adding content means editing one file in `js/content/`, then opening
`selftest.html` to check you have not made something unreachable, unsolvable, or
too hard to read.

## About the characters and the art

**The animals' sprites are the real thing.** `sprites/` holds the Generation V
animated sprites for the eleven species, taken from the
[PokeAPI/sprites](https://github.com/PokeAPI/sprites) repository and vendored into
this repo so the game still runs with no network. They are Nintendo / Game Freak /
The Pokémon Company artwork, used here in a personal, non-commercial learning tool
for one kid — the usual fan-project footing, and worth knowing if this ever went
anywhere else. Everything needed to replace them is in one file, `js/creatures.js`.

They are deliberately **not** drawn into the world canvas. That canvas is 16px tiles
upscaled by CSS with nearest-neighbour, so squeezing a 48px sprite down to 22px and
then magnifying what survived looks like mud. Instead the animals are `<img>`
elements in a `#actors` layer positioned over the canvas, which keeps them sharp at
any window size and animates them for free. The player gets its own canvas above
that layer, because Snorlax is nearly three tiles across and the only tile you can
talk to it from is the one it would otherwise cover. `js/pixels.js` still carries a
hand-drawn 16x16 for every species; that is the fallback the canvas draws if an
image file fails to load, so a missing sprite can never turn an animal into an
invisible, unfindable tile.

Everything else is original: the player, the signposts, metal boxes, berry bushes
and dig mounds are 16x16 pixel art placed glyph by glyph in `js/pixels.js`, and
every tile of terrain is drawn in code in `js/tileset.js` — no tilesets, no fonts,
no audio files, and the effects are synthesised in `js/audio.js`. Every word of
prose — the field notes, the documents, the questions and the explanations — was
written for this game. Ranger Elm and Verdant Isle are inventions.

Swapping in original creature names is a one-line-per-species change: `name` in
`js/content/pokemon.js`.
