# Verdant Isle

A browser exploration game where **reading comprehension is the only mechanic that
moves you forward**. Written for a 3rd grade reader, a few sentences at a time.
No install, no accounts, no ads, no network calls. It opens on a home page that
asks who is playing, saves in the browser three players to a device, and the whole
game can be written to a file you keep.

**Play it:** https://frugalhahns.github.io/hero-math-quest/island/

## The idea

The game never puts an arrow on your map. Every step is written on something — a
notice nailed to a door, a tide chart in a metal box, a tablet by a stone circle,
words cut into a cave wall — and the writing is the only place the answer exists.
You read it, you answer questions about it, and then you have to work out where
that means you should go.

Two things ask you questions, and they ask different ones. **Documents** ask what
a page said. **Signs** ask what the numbers on them mean -- a tide board, a plank
tally, a water intake, a trail marker. A word problem is not a break from reading
comprehension; it is the densest form of it, as long as the numbers cannot be
found without reading. That rule is enforced by the self test, not by good
intentions: every figure a sign's question needs has to be printed on the sign.

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

Most jobs now have more than one animal who can do them — digging is Diglett or
Krabby, planting is Chikorita, Bulbasaur or Oddish — so missing one animal is
never a dead end. But the *order* still cannot be short-circuited: the reed walkway needs a digger → the diggers
are in the grove → the grove is behind a rope crossing → the tablet explaining that
crossing is the only thing that says it needs a carrier *and* a planter.

## The signs, and the arithmetic on them

Twelve signs, one question each, answered where you stand. They pay out a berry
the first time you get one right and cost nothing when you do not -- a sign is
optional, and punishing an optional thing is how you teach a kid to walk past it.
The Journal counts how many you have worked out.

The standards behind them are Common Core grade 3: `3.OA.D.8`, `3.OA.A.2`,
`3.OA.A.3`, `3.NBT.A.2`, `3.MD.A.1` and `3.MD.A.2`. Five of the twelve are
`3.OA.D.8` -- two-step word problems -- which is the one standard in the grade
that needs a story to exist, and therefore the only one the drill worlds in this
repo could never cover. The island can, because it has a story.

Two of the twelve are recall questions. The number they need is not on the sign
in front of you; it is on a sign in a region you have already walked through, and
remembering it is the point. The marsh asks what the meadow intake said its drum
holds. The ridge asks how high the high water line was down in the caves. The self
test checks that the source sign exists, prints a number, and sits earlier in the
chain than the question does -- so a recall question can never ask about something
you have not been able to read yet.

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
| Landing Beach | start | Pidgey, Psyduck, Krabby | Notice, tide chart, who-can-do-what |
| Meadow Hollow | The Channel Gate | Chikorita, Machop, Pikachu, Mareep | The tablet by the stone circle |
| Whispering Grove | The Rope Crossing | Bulbasaur, Diglett, Hoothoot, Oddish | The plaque in the clearing |
| Reed Marsh | The Reed Walkway | Wooper, Chinchou, Marill | The water notebook |
| Tidepool Caves | The Light Line | Snorlax, Geodude | Words cut into the cave wall |
| Ash Ridge | The Rock Slide | Ditto | The last page |

- **6 regions**, hand-drawn as tile maps, 34 x 24 tiles each
- **17 animals** in **39 forms**, each with a paged field-note passage and 5 questions
- **11 documents**, each with 3 or 4 questions
- **12 signs** and scenery notes, two of which carry a detail a document relies on
- **121 comprehension questions** in total
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
- **You can see what you can do.** Whatever you are facing gets a bouncing arrow
  and a ring round its tile, drawn above the sprite layer so a big animal cannot
  hide it, and the action button turns green and names the verb. Anything on
  screen you have never examined gets a small faint arrow that disappears once
  you have read it, so the map shows what is left to find without staying
  covered in markers. This was not the original design and it should have been:
  a real 8 year old walked straight past a thin grey "press Space" pill.

The theme running through Ranger Elm's notes — that reading a place before acting
in it is slower than being confident and better than being confident — is also the
game's design brief.

## Growing up: evolution as recall

Animals evolve, and **evolution is earned by remembering, not by grinding.**

Reading an animal's notes to make friends with it is comprehension: the text is
right there, one tap away. Answering about it *later, with the notes shut* is
recall, which is a different skill and the harder one. So that is what evolution
costs.

How it works:

1. You befriend an animal by reading its field notes and answering questions,
   with the text available throughout.
2. It does **not** offer to grow straight away. It waits until you have moved a
   few more steps through the island — two for a first growth, three after that —
   so by the time you are asked, the page is no longer fresh in your head.
   Spacing the recall out is what makes it stick.
3. When it is ready, the Team button gets a dot and the animal's card says
   **Ready to grow**. You answer 3 questions about its notes with **no text and
   no re-read button anywhere on the screen**. One miss is allowed.
4. Get them and it evolves: new name, new sprite, and a short new page to read
   about what changed.
5. Get them wrong and nothing is lost. It offers to open the notes there and
   then, and you can try again immediately.

That is spaced retrieval practice, which is about the best-evidenced study
technique there is, wearing a Pokémon costume. The kid sees his Pokémon levelling
up; what he is actually doing is being tested on a text he read half an hour ago
without being allowed to look at it.

**39 forms across the 17 animals**, of which 15 can grow — nine two-stage lines and
six three-stage ones. Snorlax and Ditto do not change, and their cards say so
rather than leaving you waiting for something that will not come.

The species id never changes when an animal grows, only its stage. Quest steps
and project crews are keyed on the id (`s.team.includes('machop')`), so a Machop
that has become a Machamp still satisfies every check that named Machop, and
still does the same job. Growing is a reward and a new page of reading, not a
balance change.

## Team Rocket

Team Rocket are in the game, and the thing they are is **the people who do not
read.** Ranger Elm's argument across nine years of notes is that you read a place
before you act in it, so the natural opposition is somebody who skimmed the page
and started digging.

They turn up three times, and each appearance is a mistake you can only catch
because you read the real document first — which is why each one is gated behind
that document:

| Where | What they are doing | What they missed |
|---|---|---|
| Landing Beach | Digging at the near end of the rock finger | The chart says dig where the *shadow* ends, and says the near end is empty |
| Reed Marsh | About to cut the reeds for a truck path | The reeds keep salt out of the springs; last time it cost four years of drinking water |
| Tidepool Caves | Trying to wake the Snorlax with a drum | The wall says noise never works. Smell does |

You deal with them by reading, not fighting. You find their plan, read it, answer
questions that pin down what they got wrong, and they leave. Getting a question
wrong costs nothing — it comes back round, same as everywhere else.

The beach one is the reason the island has always had *two* dug holes on the
shore, one at each end of the rock finger. That decoy was in the game long before
Team Rocket were; they just turned out to be the obvious explanation for it.

## Music

There is a soundtrack, and there is still not a single audio file in the repo.
Every note is generated in the browser by `js/music.js`.

That is not only about download size. A loop long enough not to grate is a big
file, and a short one grates. Generated music can amble along for an hour without
repeating a bar, which is what you want behind a game somebody sits and reads in.

It is aiming for cozy rather than exciting: slow tempos, warm detuned pads, a soft
music-box arpeggio, no drums at all, and a melody that rests more often than it
plays — it sits out the third bar of every four-bar loop to let the thing breathe.
Melody notes come from a small random walk along a pentatonic scale, which is the
trick that makes generated music safe to leave running: on a pentatonic scale there
is no note that can land wrong, so it never needs supervising.

Each region has its own key, chord loop, tempo and filter brightness, so the caves
sound muffled and low and the ridge sounds open and high. Walking from one region
into the next fades out, changes key, and fades back in.

| Region | Key centre | Tempo | Feel |
|---|---|---|---|
| Landing Beach | D | 82 | I–V–vi–IV, bright and plain |
| Meadow Hollow | E | 90 | I–iii–IV–V, the busiest of them |
| Whispering Grove | A | 72 | vi–IV–I–V, slower and a bit wistful |
| Reed Marsh | C | 68 | ii–V–I–vi, muffled, no arpeggio |
| Tidepool Caves | G minor | 62 | i–VI–III–VII, sparse and low |
| Ash Ridge | F | 78 | I–IV–vi–V, open and high |

Details that matter more than they sound like they should:

- **The music ducks while you are reading.** A passage on screen drops it from
  0.42 to 0.16. Reading is the point of the game; the soundtrack should not
  compete with it.
- **The effects are balanced against it as a group.** Everything in
  `js/audio.js` runs through one bus at 0.5 rather than straight to the speakers,
  because otherwise there is no way to tune effects against music at all. The
  footstep is a soft low-passed tap rather than a tone, and only every other one
  plays: a pitched blip on all eight steps of a walk across the screen buries
  the pads completely, which is exactly what it did on the first pass.
- **Nothing is built until you touch the page.** Browsers block audio before a
  gesture, so the whole graph waits for the first key press or tap rather than
  being created at load and silently refused.
- **It stops in a background tab**, and the scheduler is torn down entirely when
  you switch music off, so Off actually costs nothing.
- **Notes are scheduled ahead** on the audio clock — about 0.7s of lookahead,
  topped up every 45ms — rather than played from a timer, which is the only way
  to get timing that does not stutter when the frame rate dips.

Loudness is measured rather than assumed, but by hand rather than in the suite:
`renderOne()` in `js/music.js` renders a region into an `OfflineAudioContext` and
reports peak and RMS. Every region comes out around **rms 0.022, peak 0.07** —
clearly audible, nowhere near clipping. The comment on that function explains why
it is not automated: `OfflineAudioContext` proved too flaky to rely on, finishing
one short render per page and then stalling, and an await that never resolves
would stop the self test printing its report at all.

## The home page

The first thing you see is your own island with your own name on it:

```
        🌴  V E R D A N T   I S L E
            A reading expedition

   ┌────────────────────────────────┐
   │ Ada                            │
   │ step 4 of 22 · 2 animals ·     │
   │   played today                 │
   │ last seen in Reed Marsh        │
   │        [ Keep going ▸ ] [Rename]
   └────────────────────────────────┘
   ┌────────────────────────────────┐
   │ Sam                            │
   │ step 12 of 22 · 5 animals ·    │
   │   played 24 Aug                │
   │             [ Play ▸ ] [Rename]│
   └────────────────────────────────┘
   ┌ + New player ──────────────────┐
   │ An empty island starts here    │
   │                   [ Start one ]│
   └────────────────────────────────┘

     Load a saved file      Settings
```

It exists because the save panel was two taps deep behind the `?` button, which
in practice meant nobody was ever asked their name and a second kid would quietly
play on top of the first one's island. A name is optional and takes one tap to
set; the island you were last on is the card offered first, so carrying on is a
single tap on a button that says what it does.

It shows every visit, and not twice in a row: switching players reloads the page,
and the tab remembers where it was sent so the reload lands in the game rather
than back here. `Settings → Home page` comes back to it, since the game saves
continuously and there is nothing to lose by leaving.

The world is built behind it either way, so *Keep going* is instant. Nothing
walks and no nudges appear until a player has been chosen -- a toast about an
animal being ready to grow is no use to somebody still deciding who they are.
The soundtrack waits for the same moment, rather than starting over the home page
while a kid is still typing a name. Choosing an island other than the loaded one
reloads, and a reload carries no user activation, so the music starts on the first
tap inside the game instead: it retries until the audio context is really
running, rather than hanging off one listener that fires once and gives up.

## Saving

The save lives in `localStorage`, which is the right place for a game with no
accounts and the wrong place to leave something a kid cares about. Mobile Safari
clears it after about a week of not visiting the site, any browser may evict it
when disk runs short, and "clear browsing data" takes it every time. So there are
three answers, in order of how much they can be relied on.

**Three slots.** One device, three islands, so siblings do not overwrite each
other. A slot is a place; the person in it is a profile -- a name and a stable
random id, minted once and never changed again, not by renaming and not by being
carried to another device. Slot 1 deliberately keeps the original storage key, so anyone who was
already playing before slots existed is still in their game. The active slot is
fixed for the life of the page — switching players reloads rather than swapping
the save out from under fifteen modules that already hold a reference to it. The
theme has to be resolved before any module loads, so `index.html` builds the same
storage key inline; the self test compares the two so they cannot drift apart.

**A file.** *Save to a file* writes a `.json` the family actually holds. It is the
backup for all three ways a browser can lose the save, and it is also how you
carry a game to another computer: load it there and carry on from the same step.
Loading shows what is in the file and what is in each slot before it writes over
anything, because that is the one action here that can quietly destroy a game
further along than the one arriving.

A file can come from another device, so it is not trusted. It is checked before
it is offered, merged field by field against the defaults — unknown keys dropped,
wrong shapes falling back rather than reaching the game — and `__proto__` is
stripped at the JSON reviver so an imported save cannot write through to
`Object.prototype`. Every rejection comes back as one sentence at the same reading
level as the rest of the game, because that sentence is the whole error handling a
player ever sees.

**If there is ever an account.** There is no server and nothing leaves the
device, but three fields exist so that a real account could adopt these saves
later instead of asking everyone to start over: the profile `id` is the row it
would sync to, `rev` counts every write so two copies of one island can be
compared without trusting either device's clock, and a per-browser device id says
which copy came from where. Save files carry all three. Loading a file onto a
device that has never seen that island keeps its id, so both copies stay one
island; loading it alongside itself mints a new id, because that really is a
copy. v1 files, which predate profiles, still load and are given an id on
arrival.

That is the whole preparation, deliberately. Sync itself would be offline-first
-- localStorage stays the source of truth for the running game, and a backend
would push and pull in the background -- which is why none of the game had to
become asynchronous to leave the door open.

**Asking the browser to keep it.** `navigator.storage.persist()` is the only way
to opt out of eviction. It is granted on engagement, so it is asked for on the
first tap rather than at load, and nothing waits on the answer. The panel reports
what the browser actually said.

There is also a web app manifest and a pair of icons. On iOS that matters more
than it looks: an island added to the home screen is the one place Safari leaves
its storage alone. The panel says so, and says to save to a file first, since the
home screen copy starts out empty.

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
be silent bugs are asserted instead. Open `island/selftest.html` and it runs ~2,000
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
- **every number a sign's question needs is printed on that sign** -- the rule
  that stops a word problem decaying into arithmetic with scenery around it. The
  two recall questions are the deliberate exception, and are checked harder: the
  source sign has to exist, print a number, and sit in an earlier region than the
  question, so it can never ask about a board you have not reached
- every sign reads at or under the same grade as everything else, names the
  standard it answers to, has no duplicate choices, and explains itself
- every `{braced}` word has a definition and every definition is used
- every vocabulary question asks about a word that appears in its own passage
- every animal has a dex number, a sane overworld height, and **both sprite files
  actually present on disk** — fetched rather than assumed, since those are
  vendored binaries and a missing one would leave an empty tile. That covers
  every *form*, grown ones included: a grown animal with a missing file is a
  blank card in the team screen
- every evolution line is well formed: stage 0 matches the sprite used on the
  map, no two forms share a dex number, and every form you can grow into has a
  page of its own to read, held to the same reading level as everything else
- every region has a soundtrack theme with a sane tempo, root note, four bars of
  chords and a five-note scale, and the regions do not all sit in the same key
- the note scheduler starts, changes region and stops without throwing, and
  reports an audio context state main.js can act on -- it retries the soundtrack
  on the next tap when the context came up blocked, and a rename of that field
  would quietly turn the retry into never
- **a save survives the round trip** — what an export writes has to come back out
  of an import identical, field for field, and a slot can be exported without
  being the one loaded
- **a damaged or hostile file is turned away** — fourteen malformed files, each
  one refused with one plain sentence; unknown keys dropped; wrong types falling
  back to their defaults; and `__proto__` unable to reach `Object.prototype` from
  either the top level of a save or one of its own lists. The line describing a
  file is written before anyone has agreed to load it, so it is checked against
  ten kinds of nonsense too — it has to come back as a line, not an exception
- the slot list, renaming, loading into a chosen slot, switching players and
  erasing all do what they say, run against real `localStorage` — every `vi.*`
  key is copied first and put back afterwards, with no `await` in between, and
  the last check in that section proves the browser's own save came back exactly
  as it was
- `index.html` and `state.js` still build the storage keys the same way, and the
  page reads no key state.js has stopped writing
- **identity survives what should not change it** -- a rename, a v1 save that
  predates profiles, a backup loaded back over the island it came from -- and
  changes when it should: a second copy on one device, or a different kid in an
  erased slot
- what the home page will say is asserted against fabricated slot lists: the
  right card leads, exactly one offers to keep going, a free slot is offered once
  rather than three times, three islands is the most it offers, a name is escaped
  before it is drawn, and no card ever renders a hole where a field was missing
- all six regions render without throwing

The report is flushed to the page after every section rather than only at the end,
so if something does stall you can see exactly where it stopped.

The solvability simulation and the reading-level check are the two worth keeping.
One catches a requirement chain that has quietly become impossible; the other
catches prose drifting back above the target, which is very easy to do when editing
content.

## Layout

```
index.html          the shell: canvas, sprite layer, top bar, touch pad, sheet
selftest.html       content, reachability, reading-level and save-file assertions
manifest.json       so it can be installed, which is how iOS keeps the save
icons/              the two app icons, and the script that drew them
css/island.css      one stylesheet, light and dark
js/
  main.js           boot, input, frame loop, what the action button does
  world.js          live tile grids, collision, crossings, camera, map renderer
  tileset.js        every tile drawn in code, four variants each, two water frames
  pixels.js         original 16x16 pixel art, baked to canvas on first use
  creatures.js      dex numbers, sprite paths, and how tall each one stands
  evolve.js         growing up: the gap, the from-memory test, the forms
  state.js          the save file, the profiles, and the file format
  title.js          the home page: who is playing, and how far they have got
  saves.js          the save panel: players, backups, and keeping the save
  ui.js             the sheet, the paged reader, glossary, question runner
  reading.js        documents and signs
  encounter.js      meeting an animal
  build.js          projects and crew assignment
  quest.js          the 22-step chain
  panels.js         journal, team, help, settings, ending
  audio.js          WebAudio synth for the sound effects, no audio files
  music.js          the generated soundtrack: themes, voices, scheduler
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

The two Team Rocket grunts are **not** vendored, because there is no clean source
for them: `PokeAPI/sprites` is Pokémon only, the Showdown client repo's
`trainers/` directory contains an `index.php` and nothing else, and `smogon/sprites`
is build tooling. They are drawn here instead, in the same 16x16 style as the
player — a black uniform and a red R reads instantly at that size, and it matches
the player sprite rather than towering over it the way a battle sprite would.

Everything else is original too: the player, the signposts, metal boxes, berry
bushes and dig mounds are 16x16 pixel art placed glyph by glyph in `js/pixels.js`, and
every tile of terrain is drawn in code in `js/tileset.js` — no tilesets and no
fonts. There is no audio file either: the sound effects are synthesised in
`js/audio.js` and the music is generated in `js/music.js`, both written for this
game. Every word of prose — the field notes, the documents, the questions and the
explanations — was written for this game too. Ranger Elm and Verdant Isle are
inventions.

Swapping in original creature names is a one-line-per-species change: `name` in
`js/content/pokemon.js`.
