/* The reading spine of the game.
   Nothing in Verdant Isle ever puts an arrow on your map. Each step of the
   expedition is delivered as a written document, and the document only tells
   you where to go if you actually understand it. Each document ends with a
   comprehension check; passing the check is what logs the step.
   Words in {curly braces} are glossary words. */

export const DOCS = {

  notice: {
    id: 'notice', title: 'Notice, Nailed to the Cabin Door', source: 'Warden Elm',
    text: [
      'If you are reading this, the boat has already gone back and you are the survey now. I am sorry about the abruptness. My leg is broken in two places and the mainland set the schedule, not me.',
      'Everything you need is written down somewhere on this island. That is deliberate. I spent nine seasons learning that the animals here will not be rushed and will not be tricked, and a person who is handed answers learns neither of those things. So you will be reading.',
      'Start with the tide. The channel gate above the beach is shut and I could not raise it alone; you will not raise it either until you understand what it does. The tide chart for this season is in the lockbox at the seaward end of the dock — the far end, out over the water, not the post on the sand. Read the chart before you touch anything else.',
      'Everything else follows from that. Trust the animals\' judgment over your own for the first month. Mine was wrong more often than theirs.'
    ],
    questions: [
      { tag: 'Detail',
        q: 'Where does the notice say the tide chart is kept?',
        choices: ['In the cabin, on Elm\'s desk', 'In the lockbox at the far end of the dock, over the water', 'In the post standing on the sand', 'Buried near the channel gate'],
        answer: 1,
        why: 'Elm is unusually specific and even corrects a likely mistake: "the seaward end of the dock — the far end, out over the water, not the post on the sand." When a document goes out of its way to rule something out, that is the part to notice.' },
      { tag: 'Inference',
        q: 'Why has Elm deliberately left instructions written down all over the island instead of in one list?',
        choices: ['The pages were scattered by a storm', 'Elm wants the reader to learn to read the island rather than be handed answers', 'Elm ran out of paper in the cabin', 'The animals destroy any writing left in one place'],
        answer: 1,
        why: 'Elm says it plainly: "a person who is handed answers learns neither of those things," meaning patience and honesty. The scattering is a teaching method, not an accident.' }
    ]
  },

  tidechart: {
    id: 'tidechart', title: 'Seasonal Tide Chart, Verdant Isle', source: 'Lockbox, dock end',
    text: [
      'MORNING LOW WATER, this season: shortly after sunrise, falling about one and a half meters below the mean line. Evening low water is roughly forty minutes later each day and never falls as far.',
      'NOTE FROM ELM, in the margin: The chart is here because of the gate, so let me explain the gate.',
      'The channel gate is a windlass gate. It does not swing. A crank drives a drum, the drum takes up a chain, and the chain lifts a counterweighted door out of the channel. The crank handle is iron, it is heavy, and it is not on the gate, because a loose iron handle in a storm is a thrown weapon. I stowed it where the sea puts it back if it is lost.',
      'The rock finger on the west shore is a spit of stone that runs out into the water. At mean tide it is a rock. At morning low water it is a rock with a shadow, and the shadow ends in a hollow of coarse gravel that is dry for about an hour. The handle is in that hollow, wrapped in oiled canvas. Dig at the tip of the shadow, not at the base of the finger — the base is where everyone digs, and there is nothing there but a hole I made myself.'
    ],
    questions: [
      { tag: 'Text evidence',
        q: 'Where exactly is the windlass crank hidden?',
        choices: ['At the base of the rock finger', 'In the gravel hollow at the tip of the rock finger\'s shadow', 'In the drum of the windlass itself', 'In the lockbox with the chart'],
        answer: 1,
        why: 'The chart says the shadow "ends in a hollow of coarse gravel" and then tells you to "dig at the tip of the shadow, not at the base of the finger." The base is named specifically as the wrong answer — Elm even admits digging there.' },
      { tag: 'Inference',
        q: 'Why does Elm keep the crank handle off the gate?',
        choices: ['To stop visitors from raising the gate', 'Because a loose iron handle becomes dangerous in a storm', 'Because the salt air would rust it on the gate', 'So that the counterweight stays balanced'],
        answer: 1,
        why: 'The reason is given directly: "a loose iron handle in a storm is a thrown weapon." It is a safety decision, not a lock.' },
      { tag: 'Vocabulary',
        q: 'A "windlass" gate, as the chart describes it, is one that —',
        choices: ['swings open on hinges', 'is lifted by a crank turning a chain drum', 'floats up with the rising tide', 'slides sideways into a stone slot'],
        answer: 1,
        why: 'The chart defines the mechanism step by step: "A crank drives a drum, the drum takes up a chain, and the chain lifts a counterweighted door." It also states outright that it "does not swing."' }
    ]
  },

  fieldguide: {
    id: 'fieldguide', title: 'Who Can Do What: A Page for My Replacement', source: 'Warden Elm, pinned inside the cabin',
    text: [
      'The gate needs two things done at once, and neither of them is something you can do yourself.',
      'First, somebody has to go up the channel and tell you whether the sluice above the gate is clear. I cannot see it from the beach and neither can you. What you want is the bird in the driftwood scrub above the tide line — the small brown one that throws sand at you and disappears. It is not much of a fighter. It is the best route-finder on this island, and it will come back and it will remember what it saw.',
      'Second, the drum bearing is dry, and it will seize the moment it takes load. It needs fresh water, not sea water — salt will weld it solid inside a season. Do not go looking for a spring yourself; you will spend a week. There is a creature in the shallows at the west end of this beach that stands around holding its head and looks entirely useless. It can tell fresh water from salt at several meters and it always wades toward the fresh. Let it do the finding.',
      'Both of them will refuse you if you rush them. Read their pages in this guide before you go out. Then go out quietly.'
    ],
    questions: [
      { tag: 'Application',
        q: 'Based on this page, which two helpers does the gate need?',
        choices: ['A digger and a hauler', 'A route-finder and a water-finder', 'A hauler and a planter', 'A light-carrier and a charger'],
        answer: 1,
        why: 'Elm describes exactly two jobs: someone to scout the channel and report back, and someone to locate fresh water for the dry bearing. The descriptions — a small brown bird in the scrub, and the creature holding its head in the shallows — are Pidgey and Psyduck.' },
      { tag: 'Inference',
        q: 'Why does Elm insist on fresh water rather than sea water for the drum bearing?',
        choices: ['Sea water is harder to carry up the channel', 'Salt would seize the bearing solid within a season', 'Fresh water is easier for a Psyduck to find', 'The counterweight would rust in salt water'],
        answer: 1,
        why: 'The page states the consequence: "salt will weld it solid inside a season." The bearing is dry and will seize under load, and using salt water would make that permanent.' }
    ]
  },

  cairns: {
    id: 'cairns', title: 'Tablet at the Cairn Circle', source: 'Meadow Hollow',
    text: [
      'Read this before you assume you know what these stones are.',
      'Visitors call the circle a shrine and leave offerings on it, which is harmless and completely beside the point. The stones are graded by weight, arranged from the smallest at the eastern edge to the largest at the centre, and they are moved constantly. I have marked six of them with chalk over three seasons and every mark has migrated. Nobody is worshipping here. Somebody is training.',
      'The trainers are the grey ones with the ridged brows, and if you need something heavy moved on this island they are the only real answer. Wait at the circle. Do not help them lift. A grown one will stop and look at you eventually, and that is the whole of the introduction.',
      'You will also want the small one with the leaf on its head, which you will not find at the circle. It keeps to the sunniest ground in the hollow, where the tall grass grows thickest, and it will be sheltering under a hedge an hour before you see any reason to. It grows rope-grass, and the crossing west of here needs rope more than it needs planks. A ravine takes two workers: one to carry the load and one to grow the line.'
    ],
    questions: [
      { tag: 'Main idea',
        q: 'The tablet is written mainly to correct the belief that the cairn circle is —',
        choices: ['dangerous to approach', 'a place of worship', 'a natural rock formation', 'a boundary between regions'],
        answer: 1,
        why: 'The writer opens by warning against assumptions, calls the offerings "completely beside the point," and closes the argument with "Nobody is worshipping here. Somebody is training." The chalk marks are the evidence.' },
      { tag: 'Application',
        q: 'According to the tablet, where should you look for the creature that grows rope-grass?',
        choices: ['At the cairn circle with the grey ones', 'On the sunniest ground in the hollow, in the thickest tall grass', 'Beside the pond in the middle of the meadow', 'In the ravine west of the meadow'],
        answer: 1,
        why: 'The tablet rules out the circle — "which you will not find at the circle" — and then gives the address: "the sunniest ground in the hollow, where the tall grass grows thickest."' },
      { tag: 'Inference',
        q: 'What does the tablet mean by "A ravine takes two workers: one to carry the load and one to grow the line"?',
        choices: ['The crossing must be built by two people, not animals', 'Building the bridge needs both a hauler and a planter', 'Two ravines must be crossed to reach the grove', 'The rope must be carried in two separate loads'],
        answer: 1,
        why: 'Put the two halves of the tablet together: the grey ones move heavy things, and the leaf one grows rope-grass. "Carry the load" and "grow the line" are those two jobs, which is what the crossing requires.' }
    ]
  },

  shrine: {
    id: 'shrine', title: 'Plaque in the Shrine Clearing', source: 'Whispering Grove',
    text: [
      'This clearing is the only ground on the isle that has been left deliberately unplanted, and the reason is worth writing down.',
      'The grove floor is soft, and soft ground is a road for anything that travels underneath it. Follow the brook — the thin water that runs north to south through the trees — and watch the soil on its banks where the mushrooms grow thickest. That is where the tunnels come closest to the surface. Stand still on that bank and something will come up to the neck, look at you, and drop back down. Do not dig for them. They will decide.',
      'Those diggers are what the marsh crossing needs. Reed ground will not hold a boardwalk unless the pilings go deep, and no crew of people has ever sunk pilings in that muck. Pair a digger with the route-finding bird: the bird tells you where the firm channel runs and the digger sinks the posts along it. Neither is any use there without the other.',
      'One more thing, and it matters later. The trees around this clearing are Rowan. The berries are the strongest smelling fruit on the island, they ripen all season, and there will come a day when you need two of them badly. Remember where they grow.'
    ],
    questions: [
      { tag: 'Application',
        q: 'Where does the plaque say the tunnels come closest to the surface?',
        choices: ['Under the shrine stones in the clearing', 'On the brook banks where the mushrooms are thickest', 'Along the eastern edge of the grove', 'Beneath the Rowan trees'],
        answer: 1,
        why: 'The plaque gives a two-part address: follow the brook, then watch "the soil on its banks where the mushrooms grow thickest. That is where the tunnels come closest to the surface."' },
      { tag: 'Inference',
        q: 'Why does the marsh crossing need a digger and a route-finder together?',
        choices: ['The muck is too dangerous for one animal alone', 'The bird finds the firm channel and the digger sinks pilings along it', 'The digger cannot see where it is going underground', 'The bird carries the posts and the digger drives them in'],
        answer: 1,
        why: 'The plaque assigns each a distinct job — "the bird tells you where the firm channel runs and the digger sinks the posts along it" — and then says neither "is any use there without the other."' },
      { tag: 'Author\'s craft',
        q: 'Why does the plaque end with the note about the Rowan berries?',
        choices: ['To warn that the berries are dangerous to eat', 'To flag something the reader will need later and should remember now', 'To explain why the clearing was left unplanted', 'To identify the trees for a botanical record'],
        answer: 1,
        why: 'The writer signals it outright: "One more thing, and it matters later... there will come a day when you need two of them badly. Remember where they grow." That is a deliberate setup for a problem you have not met yet.' }
    ]
  },

  ledger: {
    id: 'ledger', title: 'Sluice Ledger, Water Pages', source: 'Post at the marsh landing',
    text: [
      'The marsh is the reason this island has drinking water, and almost nobody understands why, so here it is.',
      'Salt water pushes in from the south channel on every high tide. Fresh water pushes down from the ridge. Where the two meet, the reeds hold the boundary in place, and the {brackish} band that results is what keeps the salt from reaching the springs. Cut the reeds and you lose the springs. That is not a prediction; it happened in the second season and it took four years to come back.',
      'You will want to get south, into the caverns under the channel, and you cannot do it in daylight because the tunnel floods at every high water. You go at night, at low water, and at night the tunnel is entirely dark for about ninety meters.',
      'Do not take a lantern into that water. There is a creature in the deep channel at the south end of the marsh — you will see it after dusk, two lights trailing behind it — and a lantern lowered into the water shuts down everything it is doing for twenty minutes or more. Ask one to come with you instead. It will hold a steady glow for hours and dim it when you look at something close.',
      'It will need a charge before a long night. That is a second animal\'s job, not yours. The one in the meadow with the yellow cheeks banks current as it moves, so walk it up the trail before you ask it for anything. A light-carrier and a charger. That is the pair you need underground.'
    ],
    questions: [
      { tag: 'Cause and effect',
        q: 'According to the ledger, what happens if the marsh reeds are cut?',
        choices: ['The tunnel to the caverns floods permanently', 'Salt reaches the springs and the drinking water is lost', 'The Chinchou leave the south channel', 'The marsh dries out within four years'],
        answer: 1,
        why: 'The chain is spelled out: the reeds hold the boundary, the brackish band "keeps the salt from reaching the springs," and "Cut the reeds and you lose the springs." The writer adds that it already happened once and took four years to recover.' },
      { tag: 'Application',
        q: 'Which pair does the ledger say you need to get through the flooded tunnel?',
        choices: ['A digger and a hauler', 'A light-carrier and a charger', 'A water-finder and a route-finder', 'A planter and a shover'],
        answer: 1,
        why: 'The last paragraph names them: the creature with the two trailing lights, and the meadow animal "with the yellow cheeks" that banks current. The ledger even summarizes it — "A light-carrier and a charger."' },
      { tag: 'Inference',
        q: 'Why does the ledger forbid taking a lantern into the water?',
        choices: ['The lantern would be extinguished by the tide', 'Submerged light stops the Chinchou\'s behavior for twenty minutes or more', 'The light attracts salt-water predators up the channel', 'Lantern oil poisons the brackish band'],
        answer: 1,
        why: 'The reason given is about the animals, not the equipment: "a lantern lowered into the water shuts down everything it is doing for twenty minutes or more." That is why you bring a Chinchou rather than a lamp.' }
    ]
  },

  vault: {
    id: 'vault', title: 'Inscription Beside the Sleeping One', source: 'West vault, Tidepool Caverns',
    text: [
      'Whoever you are: it is asleep, not ill, and you will need it awake.',
      'The rockslide on the ridge trail came down in my sixth season and buried the only route to the summit. I brought a crew of eight and we moved perhaps a fifth of it before the season turned. The animal breathing behind this wall could clear it in an afternoon.',
      'You will not wake it with noise. I have tried shouting, I have tried a drum, and I have watched it sleep through a rockfall close enough to shake grit out of the ceiling. It has learned that loud sounds in a cave are not worth standing up for, and it is right.',
      'Scent works, because scent means food and food is the only thing that pays for standing up. You want the strongest smelling fruit on this island held a hand\'s width from its nose. That is the Rowan berry, and Rowan grows in exactly one place: the shrine clearing in the grove. Not the marsh, not the ridge — the clearing. Go back for them. Bring two, because the first one will only get an eye open.',
      'And when it clears the slide for you, let it go back to sleep. It will have earned that, and I would rather you owed it a favor than the other way round.'
    ],
    questions: [
      { tag: 'Inference',
        q: 'Why has shouting failed to wake the sleeping one?',
        choices: ['The cave walls muffle the sound too much', 'It has learned that loud noises in a cave are not worth waking for', 'It sleeps too deeply to hear anything at all', 'Noise only works at low water'],
        answer: 1,
        why: 'The inscription reports the experiments — shouting, a drum, a rockfall overhead — and gives the explanation: "It has learned that loud sounds in a cave are not worth standing up for, and it is right."' },
      { tag: 'Application',
        q: 'What exactly must you fetch, and from where?',
        choices: ['One Rowan berry from the marsh', 'Two Rowan berries from the shrine clearing in the grove', 'Two Rowan berries from anywhere on the ridge', 'A meal large enough to be worth standing up for'],
        answer: 1,
        why: 'Both the count and the place are stated and then narrowed: "Rowan grows in exactly one place: the shrine clearing in the grove. Not the marsh, not the ridge," and "Bring two, because the first one will only get an eye open."' },
      { tag: 'Inference',
        q: 'What does the writer mean by "I would rather you owed it a favor than the other way round"?',
        choices: ['You should pay the animal for its work', 'It is better to be in the animal\'s debt than to make it indebted to you', 'The animal will demand something in return later', 'Favors between people and animals should be avoided'],
        answer: 1,
        why: 'Elm is describing the ethic that runs through the whole survey: let it return to sleep, accept that you are the one who benefited. Being in debt to an animal keeps you honest about who did the work.' }
    ]
  },

  summit: {
    id: 'summit', title: 'The Summit Cairn', source: 'Ashen Ridge',
    text: [
      'There is no more writing after this one, so I will use it to say the thing all the other pages were circling.',
      'Every animal on this island refused me at least once. Not because I was cruel — I was not — but because I arrived with a plan and expected the island to fit it. The Chikorita would not scent for me. The Bulbasaur walked away from a hillside I was certain about, and the hillside came down. The Wooper I let dry out on the ridge trail never followed me again, and it was right not to.',
      'What changed was not my technique. It was that I started reading the place before acting in it. A tide chart before a gate. A brook bank before a boardwalk. A scent before a shout. None of that is difficult. It is only slower than being confident.',
      'If you have got this far, you did it by reading, which means you already know the lesson and I am only naming it. There is one more resident up here and it will not be impressed by your team, your route or your record. It will want to know whether you were paying attention. So: were you?'
    ],
    questions: [
      { tag: 'Main idea',
        q: 'What does Elm identify as the real change that made the survey work?',
        choices: ['Learning better handling techniques', 'Reading and understanding a place before acting in it', 'Recruiting a larger team of helpers', 'Spending more seasons on the island'],
        answer: 1,
        why: 'Elm rejects the technique explanation outright — "What changed was not my technique" — and names the replacement: "I started reading the place before acting in it," with the tide chart, the brook bank and the scent as examples.' },
      { tag: 'Inference',
        q: 'Why does Elm say the animals refused him even though he was not cruel?',
        choices: ['He was a stranger they had not met before', 'He came with a fixed plan and expected the island to fit it', 'He worked too quickly for them to keep up', 'He did not bring them enough food'],
        answer: 1,
        why: 'The sentence supplies the reason directly after ruling out cruelty: "I arrived with a plan and expected the island to fit it." The failures listed are all cases of overriding an animal\'s judgment.' },
      { tag: 'Author\'s craft',
        q: 'The final line, "So: were you?", is meant to —',
        choices: ['challenge the reader to prove they read carefully', 'suggest the reader has probably failed', 'ask whether the reader met the last resident', 'question whether Elm\'s notes were accurate'],
        answer: 0,
        why: 'Elm has just said the last resident "will want to know whether you were paying attention." Turning that into a direct question to the reader hands the test over. It is an invitation, not an accusation.' },
      { tag: 'Vocabulary',
        q: 'When Elm writes that reading first "is only slower than being confident," the point is that —',
        choices: ['confidence makes people work faster and better', 'careful reading costs time, and that is its only drawback', 'slow work is always more accurate than fast work', 'confident people rarely finish what they start'],
        answer: 1,
        why: 'The word "only" is doing the work. Elm concedes a single disadvantage — time — after listing the disasters that confidence without reading produced. It is a concession that argues for the other side.' }
    ]
  }
};

/* Short flavour text on signs and scenery. No questions; these reward looking
   around, and two of them contain details the documents rely on. */
export const SIGNS = {
  beachSign:  ['VERDANT ISLE SURVEY STATION', 'Landing beach. Cabin north-west, dock south-east.', 'Warden E. Elm, nine seasons resident. Please do not feed the Snorlax.'],
  dockSign:   ['The planks past this post are older than the post.', 'Walk out to the seaward end if you must. Do not run.'],
  cabinDoor:  ['The cabin door is locked from the inside and the key is gone.', 'A notice is nailed to it at eye height.'],
  rockFinger: ['A spit of grey stone runs out into the water.', 'At low tide it throws a long shadow across the sand.'],
  pondSign:   ['MEADOW SLUICE — INTAKE. Keep the reeds clear of the screen.', 'Someone has scratched underneath: "the yellow one lives on the islet"'],
  brookSign:  ['The brook runs north to south. Mushrooms crowd the banks.', 'The soil here gives under your boot like bread.'],
  rowanTree:  ['Rowan. The berries are small, orange, and startlingly strong smelling.', 'They ripen all season.'],
  marshPost:  ['BRACKISH BAND — DO NOT CUT REEDS.', 'Below, in a different hand: "second season. four years. never again."'],
  cavernWall: ['Someone has scratched a tide line into the rock at shoulder height.', 'Above it: HIGH WATER. Below it: YOU DROWN.'],
  ridgeMarker:['Trail marker, snapped off at the base and wedged back upright.', 'The arrow points up.'],
  terrace:    ['Old terraces step down the west face, holding the slope together.', 'No tool marks anywhere on the stones.']
};

/* ------------------------------------------------------------------ */
/* The expedition. Each entry is one step; `done` reads the save file. */

export const QUEST = [
  { id: 'notice', where: 'beach',
    objective: 'Read the notice nailed to the cabin door.',
    log: 'Warden Elm has left the island. The survey is yours.',
    done: s => !!s.flags.notice },

  { id: 'tidechart', where: 'beach',
    objective: 'Elm said the tide chart is in a lockbox. Find it and read it.',
    log: 'The chart is in the lockbox at the seaward end of the dock.',
    done: s => !!s.flags.tidechart },

  { id: 'crank', where: 'beach',
    objective: 'The chart says where the windlass crank is buried. Go dig it up.',
    log: 'Dig at the tip of the rock finger\'s shadow, not the base.',
    done: s => (s.items.crank || 0) >= 1 },

  { id: 'fieldguide', where: 'beach',
    objective: 'Read Elm\'s page on who can work the gate.',
    log: 'The gate needs two helpers, and Elm described both without naming them.',
    done: s => !!s.flags.fieldguide },

  { id: 'helpers1', where: 'beach',
    objective: 'Earn the trust of the two helpers Elm described.',
    log: 'A route-finder from the scrub and a water-finder from the shallows.',
    done: s => s.team.includes('pidgey') && s.team.includes('psyduck') },

  { id: 'gate', where: 'beach',
    objective: 'Open the Build menu and raise the channel gate.',
    log: 'The windlass gate can be raised now.',
    done: s => !!s.projects.gate },

  { id: 'cairns', where: 'meadow',
    objective: 'Meadow Hollow. Find the tablet at the cairn circle and read it.',
    log: 'The cairn circle is not a shrine. Read the tablet to learn what it is.',
    done: s => !!s.flags.cairns },

  { id: 'helpers2', where: 'meadow',
    objective: 'The tablet named two helpers for the ravine. Find them both.',
    log: 'One to carry the load, one to grow the line.',
    done: s => s.team.includes('machop') && s.team.includes('chikorita') },

  { id: 'bridge', where: 'meadow',
    objective: 'Build the rope crossing over the west ravine.',
    log: 'The ravine can be bridged with rope-grass and muscle.',
    done: s => !!s.projects.bridge },

  { id: 'shrine', where: 'grove',
    objective: 'Whispering Grove. Read the plaque in the shrine clearing.',
    log: 'The clearing was left unplanted on purpose. The plaque explains why.',
    done: s => !!s.flags.shrine },

  { id: 'helper3', where: 'grove',
    objective: 'The plaque said where the diggers surface. Go and wait there.',
    log: 'Brook banks, thickest mushrooms. Stand still and do not dig.',
    done: s => s.team.includes('diglett') },

  { id: 'boardwalk', where: 'meadow',
    objective: 'Build the reed boardwalk east of the meadow.',
    log: 'A digger sinks the pilings; the bird finds the firm channel.',
    done: s => !!s.projects.boardwalk },

  { id: 'ledger', where: 'marsh',
    objective: 'Brackish Marsh. Read the sluice ledger at the landing.',
    log: 'The ledger explains the marsh, and how to get underneath it.',
    done: s => !!s.flags.ledger },

  { id: 'helpers4', where: 'marsh',
    objective: 'The ledger named the pair you need underground. Get them both.',
    log: 'A light-carrier from the south channel, a charger from the meadow.',
    done: s => s.team.includes('chinchou') && s.team.includes('pikachu') },

  { id: 'lantern', where: 'marsh',
    objective: 'Build the lantern line down the flooded tunnel.',
    log: 'No lanterns in the water. The Chinchou carries the light.',
    done: s => !!s.projects.lantern },

  { id: 'vault', where: 'caverns',
    objective: 'Tidepool Caverns. Read the inscription beside the sleeping one.',
    log: 'Something enormous is asleep in the west vault.',
    done: s => !!s.flags.vault },

  { id: 'berries', where: 'grove',
    objective: 'The inscription said what wakes it, and where that grows. Go get it.',
    log: 'Two Rowan berries. Rowan grows in exactly one place on this island.',
    done: s => (s.items.berries || 0) >= 2 },

  { id: 'snorlax', where: 'caverns',
    objective: 'Return to the west vault and wake the sleeping one.',
    log: 'Scent, not noise. A hand\'s width from the nose.',
    done: s => s.team.includes('snorlax') },

  { id: 'rockslide', where: 'grove',
    objective: 'Clear the rockslide on the ridge trail, north of the grove.',
    log: 'Eight people moved a fifth of it. One Snorlax can finish it.',
    done: s => !!s.projects.rockslide },

  { id: 'summit', where: 'ridge',
    objective: 'Ashen Ridge. Climb to the summit cairn and read Elm\'s last page.',
    log: 'The last thing Elm wrote is at the top of the ridge.',
    done: s => !!s.flags.summit },

  { id: 'ditto', where: 'ridge',
    objective: 'One resident is left. Show it you were paying attention.',
    log: 'It will not be impressed by your team. Only by your reading.',
    done: s => s.team.includes('ditto') },

  { id: 'end', where: 'ridge',
    objective: 'The survey is yours. Wander, read, and finish what Elm started.',
    log: 'Expedition complete.',
    done: () => false }
];

export const QUEST_BY_ID = Object.fromEntries(QUEST.map((q, i) => [q.id, { ...q, index: i }]));

/* One more sign, added late: what Elm left in the vault behind the Snorlax. */
SIGNS.vaultCache = [
  'A tin box, dry inside. A spare pencil, a bootlace, and a note.',
  '"If you are reading this you got it awake, which means you read the wall, which means you will be fine."'
];
