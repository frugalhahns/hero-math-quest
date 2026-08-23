# Verdant Isle

A browser exploration game where **reading comprehension is the only mechanic that
moves you forward**. Built for an 8th grade reader. No install, no accounts, no ads,
no network calls. Everything saves in the browser on the device it is played on.

**Play it:** https://frugalhahns.github.io/hero-math-quest/island/

## The idea

The game never puts an arrow on your map. Every step of the expedition is written on
something — a notice nailed to a door, a tide chart in a lockbox, a tablet at a cairn
circle, letters cut into a cave wall — and the writing is the only place the answer
exists. You read it, you answer questions about it, and then you have to work out
where that means you should go.

Three loops, all driven by text:

1. **Find out what to do.** A document explains the next problem, obliquely. The tide
   chart, for instance, tells you the windlass crank is buried "at the tip of the
   shadow, not at the base of the finger" — and the beach has a dug spot at each,
   so getting it wrong is possible and getting it right is a reading result.
2. **Earn a resident.** Walk up to any creature and you get the warden's field notes
   on it. Answer questions about the notes and it builds rapport with you; answer badly
   and it wanders off. There is no fighting and no catching device. Understanding the
   animal is how you earn it.
3. **Change the island.** Each resident has a job. Every project needs particular jobs,
   and *which* jobs is something you have to read to discover. Finishing a project
   rewrites the map and opens a region, which contains the next documents.

The three loops interlock, so you cannot skip the reading and grind your way through:
the marsh boardwalk needs a digger, the only diggers are in the grove, the grove is
behind a rope bridge, and the tablet explaining the bridge is the only thing that tells
you a bridge needs a hauler and a planter.

## What is in it

| Region | Opened by | Residents | Documents |
|---|---|---|---|
| Landing Beach | start | Pidgey, Psyduck | Notice, tide chart, field guide page |
| Meadow Hollow | The Windlass Gate | Chikorita, Machop, Pikachu | Cairn circle tablet |
| Whispering Grove | The Rope Crossing | Bulbasaur, Diglett | Shrine plaque |
| Brackish Marsh | The Reed Boardwalk | Wooper, Chinchou | Sluice ledger |
| Tidepool Caverns | The Lantern Line | Snorlax | Vault inscription |
| Ashen Ridge | The Ridge Trail Rockslide | Ditto | The summit cairn |

- **6 regions**, hand-drawn as tile maps, 34 x 24 tiles each
- **11 residents**, each with a ~200 word field-note passage and 5 questions
- **8 expedition documents**, each with 2–4 questions
- **11 signs** and scenery notes, two of which carry details the documents rely on
- **78 comprehension questions** in total
- **21 steps** in the expedition chain
- **6 build projects**, one of them optional and worth nothing but doing

## The reading itself

Passages run 150–220 words at roughly an 8th grade level: long sentences with
subordinate clauses, concessions, and tier-two vocabulary. The questions are the ones
that matter at that level rather than recall-only:

`Main idea` `Inference` `Vocabulary in context` `Text evidence` `Author's craft`
`Text structure` `Cause and effect` `Application` `Detail`

Some deliberate choices:

- **Every explanation quotes the text.** A wrong answer never just says "wrong" — it
  points at the sentence that settles it, and where a distractor is *nearly* right it
  says why it falls short.
- **Wrong answers requeue.** A missed question goes to the back of the line and comes
  round again after you have read the explanation. You cannot get stuck and you cannot
  skip past something you did not understand.
- **Choices are shuffled on every render.** The content was written without watching
  where the right answer landed and it came out badly lopsided towards B; shuffling
  fixes that permanently, and also means a requeued question cannot be answered from
  memory of the layout.
- **Vocabulary is supported, not withheld.** Any word in a passage with a dotted
  underline gives its meaning *for that sentence* when tapped. The same word appears
  in a question in plain italics, so a vocabulary question never hands over its answer.
- **The text never goes away.** Every question screen has the passage one tap below it,
  and every document stays in the journal permanently.
- **There is deliberately no read-aloud.** The other game in this repo has a
  read-it-to-me button on every story, because for a 3rd grader decoding is the
  bottleneck and speech removes it. Here comprehension *is* the skill being
  practised, so having the browser read the passage out would route straight
  around the thing the game exists to exercise. If a passage is too hard, the
  glossary and the always-available text are the supports, not a narrator.
- **Nothing is lost for good.** A resident that walks away goes back where it was. A
  project you cannot staff yet stays listed. There are no failure states.

The recurring theme of the writing — Warden Elm's whole argument across nine seasons of
notes — is that reading a place before acting in it is slower than being confident and
better than being confident. That is also the game's design brief.

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
be silent bugs are asserted instead. Open `island/selftest.html` and it runs ~1,020
checks in the browser, including:

- every tile map row is exactly the declared width, and every tile character is one
  the renderer knows how to draw
- every entity sits on a real tile and has at least one **reachable** walkable tile
  next to it, so no document or resident can be walled off
- every region crossing lands on a walkable, reachable tile and has a way back
- every question's answer index is in range, has no duplicate choices, and has a
  real explanation
- **the whole game is solvable in order** — a simulation reads what is reachable,
  befriends who is reachable, builds what it can staff, and repeats, and then asserts
  that all 6 regions open, all 11 residents can be earned, all 6 projects can be
  finished, and the 21-step quest chain runs to its last step
- every `{braced}` word has a definition and every definition is used
- every vocabulary question asks about a word that actually appears in its own passage
- every resident has a dex number, a sane overworld height, and **both sprite files
  actually present on disk** — fetched rather than assumed, since those are vendored
  binaries and a missing one would leave an empty tile
- all six regions render without throwing

That last simulation is the one worth keeping: it is what catches a requirement chain
that has quietly become impossible, which is very easy to do when editing content.

## Layout

```
index.html          the shell: canvas, top bar, touch pad, sheet
selftest.html       content and reachability assertions, run in a browser
css/island.css      one stylesheet, light and dark
js/
  main.js           boot, input, frame loop, what the action button does
  world.js          live tile grids, collision, crossings, camera, map renderer
  tileset.js        every tile drawn in code, four variants each, two water frames
  pixels.js         original 16x16 pixel art, baked to canvas on first use
  state.js          the save file
  ui.js             the sheet, passage formatter, glossary, question runner
  reading.js        documents and signs
  encounter.js      meeting a resident
  build.js          projects and crew assignment
  quest.js          the expedition chain
  panels.js         journal, team, help, settings, ending
  audio.js          WebAudio synth, no audio files
  creatures.js      dex numbers, sprite paths, and how tall each one stands
  content/
    maps.js         the six tile maps
    entities.js     what is placed where, and the region crossings
    quests.js       the documents, the signs, the 21-step chain
    pokemon.js      the eleven residents: field notes and questions
    projects.js     what each project needs and what it changes
    glossary.js     definitions, written for the sentence not the dictionary
sprites/
  anim/             animated Gen V sprites, one per species, used everywhere
  still/            static Gen V sprites, kept as a non-animated fallback
```

Adding content means editing one file in `js/content/`, then opening `selftest.html`
to check you have not made something unreachable or unsolvable.

## About the characters and the art

**The residents' sprites are the real thing.** `sprites/` holds the Generation V
animated sprites for the eleven species, taken from the
[PokeAPI/sprites](https://github.com/PokeAPI/sprites) repository and vendored into
this repo so the game still runs with no network. They are Nintendo / Game Freak /
The Pokémon Company artwork, used here in a personal, non-commercial learning tool for
one kid — the usual fan-project footing, and worth knowing if this ever went anywhere
else. Everything needed to replace them is in one file, `js/creatures.js`.

They are deliberately **not** drawn into the world canvas. That canvas is 16px tiles
upscaled by CSS with nearest-neighbour, so squeezing a 48px sprite down to 22px and
then magnifying what survived looks like mud. Instead the residents are `<img>`
elements in a `#actors` layer positioned over the canvas, which keeps them sharp at
any window size and animates them for free. `js/pixels.js` still carries a hand-drawn
16x16 for every species; that is the fallback the canvas draws if one of the image
files fails to load, so a missing sprite can never turn a resident into an invisible,
unfindable tile.

Everything else is original: the player, the signposts, lockboxes, berry bushes and
dig mounds are 16x16 pixel art placed glyph by glyph in `js/pixels.js`, and every tile
of terrain is drawn in code in `js/tileset.js` — no tilesets, no fonts, no audio files,
and the music and effects are synthesised in `js/audio.js`. Every word of prose — the
field notes, the documents, the questions and the explanations — was written for this
game. Warden Elm and Verdant Isle are inventions.

Swapping in original creature names is a one-line-per-species change: `name` in
`js/content/pokemon.js`.
