/* The reading spine of the game.
   Nothing on Verdant Isle ever puts an arrow on your map. Each step of the trip
   is written down somewhere, and the writing only tells you where to go if you
   actually follow it. Every document ends with a few questions; getting through
   them is what writes the step into your journal.

   Each item in a `text` array is ONE PAGE. The reader gets a few sentences,
   presses Next, and gets a few more. Written for a 3rd grade reader: short
   sentences, plain words, one idea per page. Words in {curly braces} are
   glossary words. */

export const DOCS = {

  notice: {
    ask: 2,          // the beach asks less; see pickQuestions in reading.js
    id: 'notice', title: 'Notice on the Cabin Door', source: 'Ranger Elm',
    text: [
      'If you are reading this, the boat has already gone. The island is yours to look after now. I am sorry it happened this way. I broke my leg in two places.',
      'Everything you need to know is written down somewhere on this island. I did that on purpose. The animals here will not be rushed and they will not be tricked. A person who gets handed the answer never learns that.',
      'So you are going to read. Start with the {tide}.',
      'The gate above the beach is shut. I could not lift it alone and neither can you. Not until you know what it does.',
      'The tide chart is in the metal box at the far end of the dock. The far end. Out over the water, not the post on the sand. Read the chart before you touch anything else.'
    ],
    questions: [
      { tag: 'Detail',
        q: 'Where is the tide chart?',
        choices: ['In the metal box at the far end of the dock', 'On the post on the sand', 'Inside the cabin', 'Buried next to the gate'],
        answer: 0,
        why: 'Elm says it and then says it again: "the metal box at the far end of the dock. The far end." He even tells you the wrong spot on purpose — not the post on the sand.' },
      { tag: 'Inference',
        q: 'Why did Elm write things down all over the island?',
        choices: ['A storm blew his papers around', 'So the reader learns instead of being handed answers', 'He ran out of paper in the cabin', 'The animals chew up paper left in one place'],
        answer: 1,
        why: 'He says he did it on purpose. "A person who gets handed the answer never learns that." It is a way of teaching, not an accident.' },
      { tag: 'Word meaning',
        q: 'The {tide} is —',
        choices: ['the sea rising and falling each day', 'a strong wind off the water', 'a kind of small boat', 'a path along the beach'],
        answer: 0,
        why: 'The tide is the sea going up and back down every day. That is why the very next thing Elm sends you to is a tide chart.' }
    ]
  },

  tidechart: {
    ask: 3,          // the beach asks less; see pickQuestions in reading.js
    id: 'tidechart', title: 'The Tide Chart', source: 'From the metal box at the end of the dock',
    text: [
      'LOW WATER comes just after sunrise this season. The sea drops down about as far as you are tall.',
      'A NOTE FROM ELM: this chart is here because of the gate. So let me explain the gate.',
      'The gate does not swing open. A handle turns a drum. The drum winds up a chain. The chain lifts the door up out of the water.',
      'The handle is iron and it is heavy. I do not keep it on the gate. In a storm, a loose iron handle turns into a flying weapon.',
      'The rock finger is that long line of stone on the west shore. At low water it throws a long shadow across the sand. Where the shadow ends there is a {hollow} full of rough {gravel}.',
      'The handle is down in that hollow, wrapped in oiled cloth. Dig where the shadow ends.',
      'Do not dig at the near end of the rock. Everybody digs there. There is nothing there but an old hole I made myself.'
    ],
    questions: [
      { tag: 'Text evidence',
        q: 'Where is the handle buried?',
        choices: ['At the near end of the rock', 'In the gravel hollow where the shadow ends', 'Inside the drum on the gate', 'In the metal box with the chart'],
        answer: 1,
        why: 'The shadow ends in a hollow full of gravel, and that is where the handle is. Elm even names the wrong place: the near end, where everybody digs.' },
      { tag: 'Cause and effect',
        q: 'Why does Elm keep the handle off the gate?',
        choices: ['So nobody else can lift the gate', 'In a storm it would fly around and hurt somebody', 'It would rust in the sea air', 'It is too heavy to carry that far'],
        answer: 1,
        why: 'He gives the reason right there: "a loose iron handle turns into a flying weapon." It is about being safe, not about locking people out.' },
      { tag: 'Detail',
        q: 'How does the gate open?',
        choices: ['A handle turns a drum, and a chain lifts the door', 'It swings out on hinges', 'It floats up when the tide comes in', 'It slides sideways into the rock'],
        answer: 0,
        why: 'The chart walks you through it one step at a time, and starts by saying the gate "does not swing open."' },
      { tag: 'Word meaning',
        q: 'A {hollow} is —',
        choices: ['a dip or low hole in the ground', 'a tall pile of sand', 'a long flat rock', 'a small pool of sea water'],
        answer: 0,
        why: 'The handle is down inside it, under rough gravel, so it must be a dip in the ground rather than something sticking up.' }
    ]
  },

  fieldguide: {
    ask: 2,          // the beach asks less; see pickQuestions in reading.js
    id: 'fieldguide', title: 'Who Can Do What', source: 'Ranger Elm, on a post outside the cabin',
    text: [
      'The gate needs two jobs done at the same time. You cannot do either one yourself.',
      'First, somebody has to go up the channel and check that it is clear. I cannot see up there from the beach. Neither can you.',
      'You want that small brown bird in the bushes above the tide line. The one that throws sand at you and vanishes. It is no fighter. But it is the best path finder on this island, and it comes back, and it remembers what it saw.',
      'Second, the drum is bone dry. It will lock up the moment it takes any weight. It needs fresh water. Not sea water. Salt would lock it up for good.',
      'Do not go hunting for a spring yourself. That takes a week. There is an animal in the {shallow} water at the west end of this beach. It stands around holding its head and looks completely useless.',
      'It is not useless. It can smell fresh water from far off. Let it do the finding.',
      'Both of them will say no if you rush them. Read their pages first. Then go out there quietly.'
    ],
    questions: [
      { tag: 'What to do',
        q: 'Which two helpers does the gate need?',
        choices: ['A digger and a carrier', 'A path finder and a water finder', 'A carrier and a planter', 'A light carrier and a sparker'],
        answer: 1,
        why: 'Elm describes two jobs without naming the animals: the bird that checks the channel and comes back, and the one that can smell fresh water.' },
      { tag: 'Cause and effect',
        q: 'Why should you not use sea water on the drum?',
        choices: ['Salt would lock it up for good', 'Sea water is too hard to carry', 'It would make the chain slip', 'Fresh water is easier to find'],
        answer: 0,
        why: 'The drum is already dry and about to lock up. Salt would make that permanent, so it has to be fresh water.' },
      { tag: 'Word meaning',
        q: '{shallow} water is water that is —',
        choices: ['not deep', 'very salty', 'very cold', 'moving fast'],
        answer: 0,
        why: 'The animal is standing around in it holding its head, so the water cannot be over its head. Shallow means not deep.' }
    ]
  },

  cairns: {
    id: 'cairns', title: 'The Tablet by the Stone Circle', source: 'Meadow Hollow',
    text: [
      'Read this before you decide what these stones are.',
      'Visitors call this circle a shrine. They leave little gifts on it. That is harmless, and it misses the point completely.',
      'The stones are sorted by weight. The smallest ones sit at the east edge. The biggest ones sit in the middle. And they move.',
      'I marked six of them with chalk over three summers. Every single mark ended up somewhere new. Nobody is praying here. Somebody is training.',
      'The trainers are the grey ones with the heavy brows. If you need something heavy moved, they are the only real answer. Wait at the circle. Do not help them lift. One will stop and look at you. That is the whole hello.',
      'You also want the small one with the leaf on its head. It is not at the circle. It stays on the sunniest ground in the hollow, where the tall grass grows thickest.',
      'That one grows rope grass. The crossing west of here needs rope more than it needs boards. A gap like that takes two workers. One to carry the weight. One to grow the line.'
    ],
    questions: [
      { tag: 'Main idea',
        q: 'What are the stones in the circle really for?',
        choices: ['Praying', 'Training, like weights', 'Marking the edge of the meadow', 'Keeping animals out'],
        answer: 1,
        why: 'The chalk marks are the proof. All six moved, so the stones are being lifted: "Nobody is praying here. Somebody is training."' },
      { tag: 'What to do',
        q: 'Where should you look for the one with the leaf on its head?',
        choices: ['At the stone circle', 'The sunniest ground, where the tall grass is thickest', 'By the pond in the middle', 'Down in the west gap'],
        answer: 1,
        why: 'The tablet rules out the circle first — "It is not at the circle" — and then gives you the real spot.' },
      { tag: 'Inference',
        q: 'What two helpers does the crossing need?',
        choices: ['Two people with boards', 'One to carry weight and one to grow rope', 'Two rope growers', 'One digger and one bird'],
        answer: 1,
        why: 'Put the two halves of the tablet together. The grey ones move heavy things and the leaf one grows rope grass, which is exactly "carry the weight" and "grow the line."' }
    ]
  },

  shrine: {
    id: 'shrine', title: 'The Plaque in the Clearing', source: 'Whispering Grove',
    text: [
      'This is the only spot on the island I left unplanted on purpose. Here is why.',
      'The ground in this grove is soft. And soft ground is a road for anything that travels underneath it.',
      'Follow the brook. That is the thin bit of water running from north to south through the trees. Watch the dirt on its banks, where the mushrooms grow thickest. That is where the {tunnel} comes closest to the top.',
      'Stand still on that bank. Something will come up to its neck, look at you, and drop back down. Do not dig for them. They decide, not you.',
      'Those diggers are what the marsh crossing needs. Soft reed ground will not hold a walkway unless the posts go down deep. No group of people has ever gotten a post into that mud.',
      'So put a digger together with the path finding bird. The bird finds the firm line. The digger sinks the posts along it. Neither one is any use out there on its own.',
      'One more thing, and it matters later. The trees around this clearing are Rowan. Their berries have the strongest smell on the island. One day you are going to need two of them badly. Remember where they grow.'
    ],
    questions: [
      { tag: 'What to do',
        q: 'Where does the tunnel come closest to the top?',
        choices: ['Under the stones in the clearing', 'On the brook banks where the mushrooms are thickest', 'At the east edge of the grove', 'Under the Rowan trees'],
        answer: 1,
        why: 'The plaque gives it in two steps: follow the brook, then watch the banks "where the mushrooms grow thickest."' },
      { tag: 'Inference',
        q: 'Why does the marsh crossing need two different helpers?',
        choices: ['The bird finds the firm line and the digger sinks the posts', 'The mud is too dangerous for one animal', 'The bird carries the posts to the digger', 'One works in the day and one at night'],
        answer: 0,
        why: 'Each has its own job, and the plaque says "neither one is any use out there on its own."' },
      { tag: 'Author\'s craft',
        q: 'Why does the plaque tell you about the Rowan berries?',
        choices: ['Because you will need them later', 'Because they are dangerous to eat', 'To explain why the clearing is empty', 'To name the trees for a list'],
        answer: 0,
        why: 'It says so out loud: "One day you are going to need two of them badly. Remember where they grow." That is a hint for a problem you have not met yet.' },
      { tag: 'Word meaning',
        q: 'A {tunnel} is —',
        choices: ['a hole that goes along under the ground', 'a stack of stones', 'a small stream', 'a soft patch of moss'],
        answer: 0,
        why: 'Something travels underneath the soft ground and comes up to its neck. The path it moves along is a tunnel.' }
    ]
  },

  ledger: {
    id: 'ledger', title: 'The Water Notebook', source: 'On a post at the marsh landing',
    text: [
      'The marsh is the reason this island has water you can drink. Almost nobody knows why. So here it is.',
      'Salt water pushes in from the south on every high tide. Fresh water runs down from the ridge. Where the two meet, the reeds hold the line.',
      'That half salty band is what keeps the salt away from our springs. Cut the reeds and the springs go bad. That is not a warning. It happened in my second year. It took four years to come back.',
      'You are going to want to get south, into the caves under the channel. You cannot go in the daytime. The tunnel floods at every high tide.',
      'So you go at night, at low water. And at night that tunnel is completely dark for a long way.',
      'Do not carry a lantern into that water. There is an animal in the deep channel at the south end of the marsh. After dark you will see it as two little lights. A lantern in the water shuts down everything it is doing for twenty minutes.',
      'Ask one to come with you instead. It will hold a steady {glow} for hours.',
      'But it needs a charge first, and that is a second animal\'s job. The one in the meadow with the yellow cheeks makes power while it moves, so walk it up the trail before you ask. A light carrier and a sparker. That is the pair you need underground.'
    ],
    questions: [
      { tag: 'Cause and effect',
        q: 'What happens if the marsh reeds get cut?',
        choices: ['Salt gets to the springs and the water goes bad', 'The tunnel floods for good', 'The marsh dries out', 'The animals move away'],
        answer: 0,
        why: 'The reeds hold the line that keeps salt off the springs. It already happened once: "It took four years to come back."' },
      { tag: 'What to do',
        q: 'Which pair do you need for the tunnel?',
        choices: ['A digger and a carrier', 'A light carrier and a sparker', 'A water finder and a path finder', 'A planter and a pusher'],
        answer: 1,
        why: 'The notebook even says it in those words at the end. One animal holds the light, and the yellow cheeked one gives it a charge first.' },
      { tag: 'Inference',
        q: 'Why should you not put a lantern in the water?',
        choices: ['The lantern would go out', 'It shuts the animal down for twenty minutes', 'It would attract bigger animals', 'The oil would spoil the water'],
        answer: 1,
        why: 'The reason is about the animal, not the lamp: a lantern in the water "shuts down everything it is doing for twenty minutes."' },
      { tag: 'Detail',
        q: 'Why can you not go into the tunnel in the daytime?',
        choices: ['It floods at every high tide', 'The animals are asleep', 'The gate is locked in the day', 'It is too hot inside'],
        answer: 0,
        why: 'You go at night at low water because "the tunnel floods at every high tide."' }
    ]
  },

  vault: {
    id: 'vault', title: 'Words Cut Into the Cave Wall', source: 'West room, Tidepool Caves',
    text: [
      'Whoever you are: it is asleep, not sick. And you are going to need it awake.',
      'The rock slide on the ridge trail came down in my sixth year. It buried the only path to the top. I brought eight people out there. We moved maybe a fifth of it before the season turned.',
      'The animal breathing behind this wall could clear the whole thing in one afternoon.',
      'You will not wake it with noise. I tried yelling. I tried a drum. I once watched it sleep through a rock fall close enough to shake dust off the ceiling.',
      'It has learned that loud noise in a cave is not worth getting up for. And it is right about that.',
      'Smell works, because smell means food, and food is the only thing worth standing up for. You need the strongest smelling fruit on this island, held a hand\'s width from its nose.',
      'That is the Rowan berry. Rowan grows in exactly one place: the clearing in the grove. Not the marsh. Not the ridge. The clearing. Go back for them.',
      'Bring two. The first one will only get an eye open. And when it clears the slide for you, let it go back to sleep. It earned that.'
    ],
    questions: [
      { tag: 'Cause and effect',
        q: 'Why has yelling not woken it up?',
        choices: ['The cave walls block the sound', 'It learned that loud cave noise is not worth waking for', 'It sleeps too deeply to hear anything', 'It only wakes up at high tide'],
        answer: 1,
        why: 'Elm lists what he tried, then gives the reason: it has slept through worse, so it has learned that noise in a cave never matters.' },
      { tag: 'What to do',
        q: 'What do you need, and where does it grow?',
        choices: ['One Rowan berry from the marsh', 'Two Rowan berries from the clearing in the grove', 'Two berries from anywhere on the ridge', 'A big meal from the cabin'],
        answer: 1,
        why: 'Both the number and the place are spelled out, and the wrong places are named too: "Not the marsh. Not the ridge. The clearing." And: "Bring two."' },
      { tag: 'Detail',
        q: 'How much of the rock slide did eight people move?',
        choices: ['About a fifth of it', 'All of it', 'None of it', 'About half of it'],
        answer: 0,
        why: 'Elm gives the number so you know how big the job is: "We moved maybe a fifth of it before the season turned."' }
    ]
  },

  summit: {
    id: 'summit', title: 'The Last Page', source: 'Ash Ridge, the top',
    text: [
      'There is no more writing after this one. So I will say the thing all the other pages were circling around.',
      'Every animal on this island said no to me at least once. Not because I was mean. I was not mean. It was because I showed up with a plan and expected the island to fit it.',
      'The Chikorita would not make its smell for me. The Bulbasaur walked away from a hill I was sure about, and that hill came down in the spring rain.',
      'The Wooper I let dry out on the trail never followed me again. And it was right not to.',
      'What changed was not my skill. What changed was that I started reading a place before I acted in it. A tide chart before a gate. A brook bank before a walkway. A smell before a shout.',
      'None of that is hard. It is just slower than being sure of yourself.',
      'If you got this far, you got here by reading. So you already know the lesson. I am only giving it a name.',
      'One more animal lives up here. It will not care about your team or your record. It will want to know whether you were paying attention. So: were you?'
    ],
    questions: [
      { tag: 'Main idea',
        q: 'What does Elm say really changed for him?',
        choices: ['He got better at handling animals', 'He started reading a place before acting in it', 'He got more people to help him', 'He stayed on the island longer'],
        answer: 1,
        why: 'He says straight out that it "was not my skill," and then names the change: a tide chart before a gate, a brook bank before a walkway.' },
      { tag: 'Inference',
        q: 'Why did the animals say no, if Elm was not mean?',
        choices: ['He came with a plan and expected the island to fit it', 'He was a stranger to them', 'He worked too slowly', 'He never brought them food'],
        answer: 0,
        why: 'He rules out being mean and then gives the real reason in the same sentence. Every example after that is him overruling an animal.' },
      { tag: 'Author\'s craft',
        q: 'What is that last question asking you to do?',
        choices: ['Show that you read carefully', 'Say how long you have played', 'Name all the animals', 'Go back down the ridge'],
        answer: 0,
        why: 'The animal up there "will want to know whether you were paying attention," and then Elm turns that question straight around onto you.' }
    ]
  },
  /* ---------------------------------------------------------------------
     Team Rocket. The idea behind all three of these: they are the people who
     do not read. Elm's whole argument across nine years of notes is that you
     read a place before you act in it, so the natural opposition is somebody
     who skimmed the page and started digging. Every one of these is a mistake
     the player can only catch because they read the real document first, which
     is why each is gated behind that document.

     It also explains the second hole on the beach, which was in the game long
     before Team Rocket were.
     --------------------------------------------------------------------- */

  rocketBeach: {
    id: 'rocketBeach', title: 'A Crumpled Plan', source: 'Dropped on the beach',
    outcome: 'The grunt reads the chart over your shoulder, looks at the hole, and goes very red. Then they walk off up the beach without saying anything.',
    text: [
      'There is a hole in the sand at the near end of the rock finger. Somebody in a black uniform is digging it. There is a big red R on the front of the uniform.',
      'They have not noticed you. A piece of paper has blown out of their pocket and landed by your boot. You pick it up.',
      'The paper says: PLAN. Go to the west beach. Find the big rock. Dig at the rock. Get the handle. Easy.',
      'But you have read the tide chart. It does not say dig at the rock. It says dig where the rock\'s shadow ends.',
      'And it says do not dig at the near end, because there is nothing there but an old hole.',
      'So that is why there were two holes on this beach. Somebody read four words of the chart and started digging.'
    ],
    questions: [
      { tag: 'Detail',
        q: 'Where does their plan say to dig?',
        choices: ['At the big rock', 'Where the shadow ends', 'By the dock', 'Next to the gate'],
        answer: 0,
        why: 'Their plan is only four steps long, and step three is "Dig at the rock." That is not what the chart says.' },
      { tag: 'Cause and effect',
        q: 'Why will Team Rocket not find the handle?',
        choices: ['They are digging in the wrong spot', 'They are digging too slowly', 'Somebody already took it', 'The handle is under the water'],
        answer: 0,
        why: 'The chart says to dig where the shadow ends, and warns that the near end of the rock has nothing in it. They are digging at the near end.' },
      { tag: 'Main idea',
        q: 'What did Team Rocket do wrong?',
        choices: ['They did not read the whole chart', 'They came at the wrong time of day', 'They brought the wrong tools', 'They dug too deep'],
        answer: 0,
        why: 'The plan skips the one detail that matters. Reading four words instead of the whole page is the mistake, and it is the same mistake all the way through.' }
    ]
  },

  rocketMarsh: {
    id: 'rocketMarsh', title: 'Team Rocket\'s Orders', source: 'Pinned to a post in the marsh',
    outcome: 'You hold the notebook out and let them read the page about the four years. The one holding the shears puts them down in the mud and does not pick them back up.',
    text: [
      'Two people in black uniforms are standing at the edge of the reeds. One of them is holding a very large pair of shears.',
      'Their orders are pinned to the post next to them. You read them.',
      'TODAY: cut the tall grass by the water. We need a clear path for the truck. Should take about an hour.',
      'But you have read the water notebook. The reeds are not tall grass in the way of anything.',
      'They hold the line between the salt water and the fresh water. Cut them and the salt gets to the springs.',
      'It happened once before. The island had no water you could drink for four years.'
    ],
    questions: [
      { tag: 'Cause and effect',
        q: 'What will happen if they cut the reeds?',
        choices: ['Salt will get to the springs', 'The marsh will dry out', 'The truck will get stuck', 'The animals will move away'],
        answer: 0,
        why: 'The reeds hold the line between the salt water and the fresh water. With the reeds gone, the salt reaches the springs.' },
      { tag: 'Detail',
        q: 'How long did the island have no drinking water last time?',
        choices: ['Four years', 'One hour', 'Four days', 'One summer'],
        answer: 0,
        why: 'This already happened once, and the notebook records how long it took to come back: four years.' },
      { tag: 'Inference',
        q: 'Why do the orders call the reeds "tall grass"?',
        choices: ['Whoever wrote them did not know what the reeds do', 'The reeds really are a kind of grass', 'They are trying to trick the reader', 'They could not see the reeds properly'],
        answer: 0,
        why: 'Calling them tall grass in the way is how you describe something you have not bothered to find out about. An hour of reading would have stopped this.' }
    ]
  },

  rocketCaves: {
    id: 'rocketCaves', title: 'A Note Taped to a Drum', source: 'Tidepool Caves',
    outcome: 'You point at the wall and wait. They read it twice. Then they pick up the drum between them and carry it back out through the tunnel.',
    text: [
      'There is a drum in the middle of the cave floor. A very big drum. Two people in black uniforms are taking turns hitting it.',
      'The Snorlax has not moved. It has not even changed the way it is breathing.',
      'There is a note taped to the side of the drum. STEP ONE: wake it with the drum. STEP TWO: it moves the rocks for us. STEP THREE: we take the rocks.',
      'But you have read the wall. Yelling does not work. Drums do not work.',
      'This animal has slept through waves, and falling rocks, and thunder. It learned a long time ago that loud noise in a cave is never worth getting up for.',
      'It gets up for one thing, and it is not a sound. They could hit that drum until the tide came in.'
    ],
    questions: [
      { tag: 'Cause and effect',
        q: 'Why is the drum not working?',
        choices: ['It learned that loud cave noise is never worth waking for', 'The drum is too small', 'It cannot hear the drum from there', 'It is not really asleep'],
        answer: 0,
        why: 'The wall says it has slept through waves, falling rocks and thunder. Noise is the one thing it has learned to ignore.' },
      { tag: 'What to do',
        q: 'What would actually wake it up?',
        choices: ['The smell of a ripe berry', 'A much bigger drum', 'Cold water', 'Waiting until night'],
        answer: 0,
        why: 'Smell means food, and food is the only thing worth standing up for. A ripe Rowan berry held near its nose does it in about a minute.' },
      { tag: 'Inference',
        q: 'What mistake did Team Rocket make this time?',
        choices: ['They tried it without reading the wall first', 'They came into the caves too early', 'They brought the wrong drum', 'They woke it up too fast'],
        answer: 0,
        why: 'The answer was cut into the wall a few steps away. It is the same mistake as the hole on the beach and the shears in the marsh: act first, read never.' }
    ]
  }
};

/* Signs. Short notes on scenery, and the island's numbers.

   Documents ask you what a page said. Signs ask you what the numbers on them
   mean, which is the same skill with the answer checkable: a tide board, a
   plank tally, a trail marker and a water intake all carry figures in real
   life, so the arithmetic is written into the world rather than bolted onto
   it. Every number a question needs is on the sign in front of you -- except
   two, marked `from`, where it is on a sign in a region you have already been
   through, and remembering it is the point.

   `code` is the Common Core grade 3 standard the question answers to. Most of
   these are 3.OA.D.8, two-step word problems, which is the one standard in the
   grade that needs a story to exist -- and so the one the drill worlds in this
   repo cannot cover. Keep the stems under 18 words and the choices under 14:
   a word problem nobody can read is not a reading game.

   `gives` is handed over once, the first time the question is answered right. */
export const SIGNS = {
  beachSign: {
    text: [
      'VERDANT ISLE RANGER STATION',
      'Landing beach. Cabin to the northwest. Dock to the southeast.',
      'Ranger E. Elm, nine years here. Elm walks the beach twice a day, every day. Please do not feed the Snorlax.'
    ],
    gives: 'berries',
    q: {
      code: '3.OA.A.3',
      q: 'Elm walks the beach twice a day. How many walks is that in one week?',
      choices: ['14 walks', '7 walks', '9 walks', '21 walks'],
      answer: 0,
      why: 'Two walks a day, and seven days in a week. 2 times 7 is 14.'
    }
  },

  dockSign: {
    text: [
      'The boards past this post are older than the post is.',
      'Walk out to the far end if you have to. Do not run.',
      'A tally is burned into the post: 24 BOARDS LAID. 6 SWAPPED FOR NEW ONES.'
    ],
    gives: 'berries',
    q: {
      code: '3.NBT.A.2',
      q: '24 boards, and 6 of them are new. How many are still the old ones?',
      choices: ['18 boards', '6 boards', '30 boards', '24 boards'],
      answer: 0,
      why: '24 boards in all. Take away the 6 new ones and 18 old ones are left.'
    }
  },

  cabinDoor: {
    text: [
      'The cabin door is locked from the inside. The key is gone.',
      'A notice is nailed to it, right at eye height.',
      'A card hangs in the window: GONE UP THE RIDGE. BACK IN 3 DAYS. The card is dated the 5th.'
    ],
    gives: 'berries',
    q: {
      code: '3.MD.A.1',
      q: 'The card is dated the 5th and says back in 3 days. Which day is that?',
      choices: ['The 8th', 'The 3rd', 'The 5th', 'The 15th'],
      answer: 0,
      why: 'Start at the 5th and count on 3 days. 5 and 3 is 8.'
    }
  },

  rockFinger: {
    text: [
      'A long line of grey stone runs out into the water.',
      'At low tide it throws a long shadow across the sand.',
      'A tide board is bolted to the first rock: LOW WATER 2:00. THE SEA COMES BACK UP 2 FEET AN HOUR. THIS ROCK STANDS 6 FEET ABOVE LOW WATER.'
    ],
    gives: 'berries',
    q: {
      code: '3.OA.D.8',
      q: 'When does the sea come back up to the top of this rock?',
      choices: ['5:00', '3:00', '6:00', '8:00'],
      answer: 0,
      why: '6 feet at 2 feet an hour is 3 hours. 3 hours after 2:00 is 5:00.'
    }
  },

  pondSign: {
    text: [
      'MEADOW WATER INTAKE. Keep the reeds off the screen.',
      'A card is wired to the frame: THIS PIPE FILLS THE DRUM. 5 LITRES A MINUTE. THE DRUM HOLDS 40 LITRES.',
      'Somebody scratched underneath: "the yellow one lives on the little island"'
    ],
    gives: 'berries',
    q: {
      code: '3.MD.A.2',
      q: 'The pipe gives 5 litres a minute. How long does the whole drum take?',
      choices: ['8 minutes', '5 minutes', '40 minutes', '35 minutes'],
      answer: 0,
      why: '40 litres, and 5 litres each minute. 40 split into 5s is 8 minutes.'
    }
  },

  brookSign: {
    text: [
      'The brook runs from north to south. Mushrooms crowd both banks.',
      'The dirt here sinks under your boot like bread.',
      'A stake by the water: 9 CLUMPS ON EACH BANK. 4 MUSHROOMS TO A CLUMP.'
    ],
    gives: 'berries',
    q: {
      code: '3.OA.D.8',
      q: '9 clumps on each bank, 4 to a clump. How many mushrooms in all?',
      choices: ['72 mushrooms', '36 mushrooms', '48 mushrooms', '13 mushrooms'],
      answer: 0,
      why: '9 times 4 is 36 on one bank. There are two banks, so 36 and 36 is 72.'
    }
  },

  rowanTree: {
    text: [
      'Rowan. The berries are small and orange and they smell very strong.',
      'They are ripe all season long.',
      'A ranger tag hangs from a low branch: TAKE NO MORE THAN A THIRD OF ANY BUNCH. The bunch by your hand holds 12.'
    ],
    gives: 'berries',
    q: {
      code: '3.OA.A.2',
      q: 'A third of the 12 berries in this bunch. How many may you take?',
      choices: ['4 berries', '3 berries', '6 berries', '12 berries'],
      answer: 0,
      why: 'A third means one part out of three. 12 split into 3 equal parts is 4 in each.'
    }
  },

  marshPost: {
    text: [
      'HALF SALT WATER. DO NOT CUT THE REEDS.',
      'Underneath, in different writing: "second year. four years. never again."',
      'A ranger note in pencil: THE MEADOW DRUM FILLS FROM HERE TOO. HALF OF WHAT IT HOLDS COMES OUT OF THIS MARSH.'
    ],
    gives: 'berries',
    q: {
      code: '3.OA.A.2',
      from: 'pondSign',
      q: 'Half of the meadow drum comes from here. How many litres is that?',
      choices: ['20 litres', '40 litres', '5 litres', '80 litres'],
      answer: 0,
      why: 'The card at the meadow intake said the drum holds 40 litres. Half of 40 is 20.'
    }
  },

  cavernWall: {
    text: [
      'Somebody scratched a line into the rock at shoulder height.',
      'Above the line: HIGH WATER. Below the line: YOU DROWN.',
      'Beside it, small and neat: THE LINE IS 5 FEET UP. THE WATER CLIMBS 1 FOOT EVERY 20 MINUTES.'
    ],
    gives: 'berries',
    q: {
      code: '3.OA.D.8',
      q: 'The water is 1 foot deep now. How long until it reaches the line?',
      choices: ['80 minutes', '100 minutes', '60 minutes', '20 minutes'],
      answer: 0,
      why: 'From 1 foot up to 5 feet is 4 feet. 4 times 20 minutes is 80 minutes.'
    }
  },

  vaultCache: {
    text: [
      'A tin box, dry inside. A spare pencil, a boot lace, a candle, and a note.',
      '"If you are reading this, you got it awake. That means you read the wall. You will be fine."',
      'On the back of the note: "I left 3 boxes like this one, packed the same way. Find them all."'
    ],
    gives: 'berries',
    q: {
      code: '3.OA.A.3',
      q: 'She left 3 boxes packed like this one. How many things is that in all?',
      choices: ['12 things', '4 things', '7 things', '3 things'],
      answer: 0,
      why: 'This box holds 4 things: a pencil, a lace, a candle, a note. 3 boxes of 4 is 12.'
    }
  },

  ridgeMarker: {
    text: [
      'A trail marker, snapped off at the bottom and wedged back up.',
      'The arrow points up.',
      'The paint on the post still reads: SUMMIT 3 MILES. 4 MARKERS TO EVERY MILE. 2 OF THEM ARE DOWN.'
    ],
    gives: 'berries',
    q: {
      code: '3.OA.D.8',
      q: '4 markers a mile for 3 miles, and 2 are down. How many still stand?',
      choices: ['10 markers', '12 markers', '14 markers', '6 markers'],
      answer: 0,
      why: '4 markers times 3 miles is 12. Take away the 2 that are down and 10 still stand.'
    }
  },

  terrace: {
    text: [
      'Old stone steps go down the west face and hold the slope together.',
      'There is not one tool mark on any of the stones.',
      'A note is wedged under a stone: THESE STEPS RISE AS HIGH AS THE HIGH WATER LINE DOWN IN THE CAVES. 3 STEPS TO EVERY FOOT.'
    ],
    gives: 'berries',
    q: {
      code: '3.OA.D.8',
      from: 'cavernWall',
      q: 'The steps rise as high as the cave line. How many steps is that?',
      choices: ['15 steps', '5 steps', '3 steps', '9 steps'],
      answer: 0,
      why: 'The wall down in the caves said the line is 5 feet up. 5 feet at 3 steps each is 15.'
    }
  }
};

/* ------------------------------------------------------------------ */
/* The trip. Each entry is one step; `done` reads the save file. */

/* `target` is what the step is pointing at, so the map can show where the next
   thing to read actually is. It never says what to do -- that is only ever in
   the writing -- and where the reading is the puzzle it stays vague on purpose:
   the crank step marks both mounds, because which one to dig is the whole
   comprehension question. `id` is optional; without it any entity of that kind
   in the step's region counts, which is what the "find two helpers" steps want. */
export const QUEST = [
  { id: 'notice', where: 'beach',
    target: { kind: 'doc', id: 'notice' },
    objective: 'Read the notice nailed to the cabin door.',
    log: 'Ranger Elm has left the island. You look after it now.',
    done: s => !!s.flags.notice },

  { id: 'tidechart', where: 'beach',
    target: { kind: 'doc', id: 'tidechart' },
    objective: 'Elm said the tide chart is in a metal box. Go find it and read it.',
    log: 'The chart is in the box at the far end of the dock.',
    done: s => !!s.flags.tidechart },

  { id: 'crank', where: 'beach',
    target: { kind: 'dig' },
    objective: 'The chart says where the iron handle is buried. Go dig it up.',
    log: 'Dig where the rock finger shadow ends. Not the near end.',
    done: s => (s.items.crank || 0) >= 1 },

  { id: 'fieldguide', where: 'beach',
    target: { kind: 'doc', id: 'fieldguide' },
    objective: 'Read Elm\'s page about who can work the gate.',
    log: 'The gate needs two helpers. Elm described both without naming them.',
    done: s => !!s.flags.fieldguide },

  { id: 'helpers1', where: 'beach',
    target: { kind: 'wild' },
    objective: 'Make friends with the two helpers Elm described.',
    log: 'A path finder from the bushes. A water finder from the shallows.',
    done: s => s.team.includes('pidgey') && s.team.includes('psyduck') },

  { id: 'gate', where: 'beach',
    target: { kind: 'project', id: 'gate' },
    objective: 'Open the Build menu and lift the channel gate.',
    log: 'The gate can be lifted now.',
    done: s => !!s.projects.gate },

  { id: 'cairns', where: 'meadow',
    target: { kind: 'doc', id: 'cairns' },
    objective: 'Meadow Hollow. Find the tablet by the stone circle and read it.',
    log: 'The stone circle is not a shrine. The tablet says what it really is.',
    done: s => !!s.flags.cairns },

  { id: 'helpers2', where: 'meadow',
    target: { kind: 'wild' },
    objective: 'The tablet named two helpers for the gap. Go find them both.',
    log: 'One to carry the weight. One to grow the line.',
    done: s => s.team.includes('machop') && s.team.includes('chikorita') },

  { id: 'bridge', where: 'meadow',
    target: { kind: 'project', id: 'bridge' },
    objective: 'Build the rope crossing over the west gap.',
    log: 'The gap can be crossed with rope grass and muscle.',
    done: s => !!s.projects.bridge },

  { id: 'shrine', where: 'grove',
    target: { kind: 'doc', id: 'shrine' },
    objective: 'Whispering Grove. Read the plaque in the clearing.',
    log: 'The clearing was left unplanted on purpose. The plaque says why.',
    done: s => !!s.flags.shrine },

  { id: 'helper3', where: 'grove',
    target: { kind: 'wild' },
    objective: 'The plaque said where the diggers come up. Go and wait there.',
    log: 'Brook banks, thickest mushrooms. Stand still and do not dig.',
    done: s => s.team.includes('diglett') },

  { id: 'boardwalk', where: 'meadow',
    target: { kind: 'project', id: 'boardwalk' },
    objective: 'Build the reed walkway east of the meadow.',
    log: 'A digger sinks the posts. The bird finds the firm line.',
    done: s => !!s.projects.boardwalk },

  { id: 'ledger', where: 'marsh',
    target: { kind: 'doc', id: 'ledger' },
    objective: 'Reed Marsh. Read the water notebook at the landing.',
    log: 'The notebook explains the marsh, and how to get underneath it.',
    done: s => !!s.flags.ledger },

  /* The only step that spans two regions: the light carrier is in the marsh and
     the sparker is back in the meadow, which the journal line says out loud. It
     is listed here as well so the map does not point you back to the marsh the
     moment you go and get the second half of it. */
  { id: 'helpers4', where: 'marsh', regions: ['marsh', 'meadow'],
    target: { kind: 'wild' },
    objective: 'The notebook named the pair you need underground. Get them both.',
    log: 'A light carrier from the south channel. A sparker from the meadow.',
    done: s => s.team.includes('chinchou') && s.team.includes('pikachu') },

  { id: 'lantern', where: 'marsh',
    target: { kind: 'project', id: 'lantern' },
    objective: 'Build the light line down the flooded tunnel.',
    log: 'No lanterns in the water. The Chinchou carries the light.',
    done: s => !!s.projects.lantern },

  { id: 'vault', where: 'caverns',
    target: { kind: 'doc', id: 'vault' },
    objective: 'Tidepool Caves. Read the words cut into the wall by the sleeping one.',
    log: 'Something huge is asleep in the west room.',
    done: s => !!s.flags.vault },

  { id: 'berries', where: 'grove',
    target: { kind: 'item', id: 'rowan' },
    objective: 'The wall said what wakes it, and where that grows. Go and get it.',
    log: 'Two Rowan berries. Rowan grows in exactly one place on this island.',
    done: s => (s.items.berries || 0) >= 2 },

  { id: 'snorlax', where: 'caverns',
    target: { kind: 'wild', id: 'snorlax' },
    objective: 'Go back to the west room and wake the sleeping one.',
    log: 'Smell, not noise. A hand\'s width from its nose.',
    done: s => s.team.includes('snorlax') },

  { id: 'rockslide', where: 'grove',
    target: { kind: 'project', id: 'rockslide' },
    objective: 'Clear the rock slide on the ridge trail, north of the grove.',
    log: 'Eight people moved a fifth of it. One Snorlax can finish it.',
    done: s => !!s.projects.rockslide },

  { id: 'summit', where: 'ridge',
    target: { kind: 'doc', id: 'summit' },
    objective: 'Ash Ridge. Climb to the top and read Elm\'s last page.',
    log: 'The last thing Elm wrote is at the top of the ridge.',
    done: s => !!s.flags.summit },

  { id: 'ditto', where: 'ridge',
    target: { kind: 'wild', id: 'ditto' },
    objective: 'One animal is left. Show it that you were paying attention.',
    log: 'It will not care about your team. Only about your reading.',
    done: s => s.team.includes('ditto') },

  { id: 'end', where: 'ridge',
    objective: 'The island is yours. Wander, read, and finish what Elm started.',
    log: 'All done.',
    done: () => false }
];

export const QUEST_BY_ID = Object.fromEntries(QUEST.map((q, i) => [q.id, { ...q, index: i }]));
