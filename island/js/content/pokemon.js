/* The eleven residents of Verdant Isle.
   Each one has a field-note passage written for a 3rd grade reader: short
   sentences, plain words, one idea at a time. The passage is an array and each
   item is ONE PAGE -- the reader gets a few sentences, presses Next, and gets a
   few more. Keep new pages that short.
   Words in {curly braces} are glossary words; see content/glossary.js.
   The prose is original. The sprites are described in js/creatures.js.

   `line` is the evolution line: stage 0 is what you meet in the wild, and each
   later stage is earned by RECALL -- answering questions about this animal's
   notes later on, with the notes shut. See js/evolve.js. The species id never
   changes when it grows, only the stage, because quest steps and project crews
   are keyed on the id. Each grown form carries a short `blurb`, so growing one
   is also a little more reading. */

export const SPECIES = [
  /* ------------------------------------------------------------ beach */
  {
    id: 'pidgey', name: 'Pidgey', kind: 'Tiny Bird', region: 'beach',
    job: 'scout', jobName: 'Scouting', jobDesc: 'Finds a path and remembers it.',
    found: 'the bushes above the tide line, on the Landing Beach',
    line: [
      { name: 'Pidgey', dex: 16 },
      { name: 'Pidgeotto', dex: 17,
        blurb: 'Pidgeotto is bigger, and it flies much further. It can hold a whole stretch of coast in its head for a full season now. It still throws sand at you when it is cross.' },
      { name: 'Pidgeot', dex: 18,
        blurb: 'Pidgeot can cross the island in the time it takes you to walk to the dock. Elm wrote one line about them: a Pidgeot never gets lost. Not once, in nine years of watching.' }
    ],
    passage: {
      title: 'Field Notes: Pidgey',
      source: 'Ranger Elm, note 14',
      text: [
        'Pidgey is the most common bird on this island. You will see one on your first day. Most people think Pidgey is boring. They are wrong.',
        'When a Pidgey gets scared, it flaps hard at the sand. The sand flies up in a big cloud. The bird hides inside that cloud and runs away. It does not have to fight anything.',
        'But here is the best thing about Pidgey. It never forgets a path. Fly one bird down the beach one time and it will remember. It can find that same spot in thick fog. It can find it after a storm moves everything around.',
        'So do not chase a Pidgey. Stand still. Keep your hands down low. Wait. When the bird sees that you are {calm}, it will come closer. Waiting is how you make friends here.'
      ]
    },
    questions: [
      { tag: 'Main idea',
        q: 'What is the best thing about Pidgey?',
        choices: ['It never forgets a path', 'It is easy to find', 'It can fight off bigger animals', 'It can make a sand cloud'],
        answer: 0,
        why: 'The notes say it straight out: "here is the best thing about Pidgey. It never forgets a path." It can find the same spot in fog, or after a storm.' },
      { tag: 'Detail',
        q: 'What does a Pidgey do when it gets scared?',
        choices: ['It sits very still', 'It flaps sand into a cloud and hides in it', 'It flies straight up', 'It calls the other birds'],
        answer: 1,
        why: 'It "flaps hard at the sand," and the sand "flies up in a big cloud." Then the bird hides inside the cloud and runs away.' },
      { tag: 'Cause and effect',
        q: 'How does the sand cloud help the Pidgey?',
        choices: ['It scares other animals away', 'It hides the bird while it runs away', 'It helps the bird fly higher', 'It keeps the bird warm'],
        answer: 1,
        why: 'The cloud is a hiding place, not a weapon. The notes say the bird "hides inside that cloud and runs away."' },
      { tag: 'What to do',
        q: 'How should you act if you want a Pidgey to come closer?',
        choices: ['Chase it into the bushes', 'Stand still and wait', 'Call to it loudly', 'Hold food up high'],
        answer: 1,
        why: 'The last page is a list: do not chase, stand still, keep your hands low, wait. The bird comes closer once it sees you are calm.' },
      { tag: 'Word meaning',
        q: 'The word {calm} means —',
        choices: ['fast and jumpy', 'quiet and not upset', 'loud and friendly', 'hungry'],
        answer: 1,
        why: 'You are told to stand still, keep your hands low and wait. All of those make you look quiet and not upset.' }
    ],
    lines: {
      rapport: 'The Pidgey stops hopping sideways and looks right at you.',
      catch: 'It hops onto your bag like that was always the plan.',
      flee: 'A puff of sand, and the bushes are empty.'
    }
  },
  {
    id: 'psyduck', name: 'Psyduck', kind: 'Duck', region: 'beach',
    job: 'water', jobName: 'Finding Water', jobDesc: 'Sniffs out fresh water and carries it.',
    found: 'the shallow water at the west end of the beach',
    line: [
      { name: 'Psyduck', dex: 54 },
      { name: 'Golduck', dex: 55,
        blurb: 'The headache is gone. Golduck can use its power when it wants to now, instead of waiting for it to burst out on its own. It swims faster than anything else on this coast.' }
    ],
    passage: {
      title: 'Field Notes: Psyduck',
      source: 'Ranger Elm, note 22',
      text: [
        'Psyduck always looks {confused}. That is because its head hurts almost all the time. The headache is the whole story of this animal.',
        'Power builds up inside a Psyduck\'s head. It cannot let that power out when it wants to. So it stands in the {shallow} water, holds its head, and waits.',
        'When the power finally comes out, rocks lift off the sand. The water {ripples} the wrong way. And the Psyduck looks just as surprised as you do. It never knows when it will happen.',
        'Here is the part we can use. A Psyduck can smell fresh water from far away. It always walks toward the fresh water and away from the salty sea. Follow a thirsty Psyduck and you will find a spring.',
        'Walk up to one slowly. Loud noise makes the headache worse. And a Psyduck whose head hurts will not trust anybody.'
      ]
    },
    questions: [
      { tag: 'Cause and effect',
        q: 'Why does a Psyduck look surprised when its power comes out?',
        choices: ['It cannot control when the power comes out', 'It has never seen the power before', 'The power hurts it every time', 'Someone else set the power off'],
        answer: 0,
        why: 'The notes say it "cannot let that power out when it wants to," and it "never knows when it will happen." If you cannot pick the moment, the moment surprises you.' },
      { tag: 'Word meaning',
        q: '{shallow} water is water that is —',
        choices: ['very cold', 'not deep', 'moving fast', 'full of salt'],
        answer: 1,
        why: 'Shallow means not deep. The Psyduck stands up in it while it holds its head, so the water cannot be over its head.' },
      { tag: 'What to do',
        q: 'Why would you follow a thirsty Psyduck?',
        choices: ['It will lead you to fresh water', 'It will show you where it sleeps', 'It will keep other animals away', 'It will carry your bag'],
        answer: 0,
        why: 'A Psyduck "can smell fresh water from far away" and "always walks toward the fresh water." So it walks to a spring, and you can just follow.' },
      { tag: 'Detail',
        q: 'What makes a Psyduck\'s headache worse?',
        choices: ['Cold water', 'Loud noise', 'Bright sun', 'Being hungry'],
        answer: 1,
        why: 'The last page says loud noise makes the headache worse. That is why you should come up to one slowly and quietly.' },
      { tag: 'Inference',
        q: 'Why is it a bad idea to shout at a Psyduck?',
        choices: ['It will not be able to hear you', 'It will hurt its head, and then it will not trust you', 'It will run into deeper water', 'It will let its power out at you'],
        answer: 1,
        why: 'Put the two last sentences together. Loud noise makes the headache worse, and a Psyduck whose head hurts "will not trust anybody."' }
    ],
    lines: {
      rapport: 'The Psyduck takes one hand off its head and blinks at you.',
      catch: 'It waddles over and leans on your leg, still frowning.',
      flee: 'It wanders off into deeper water, muttering.'
    }
  },

  {
    id: 'krabby', name: 'Krabby', kind: 'River Crab', region: 'beach',
    job: 'dig', jobName: 'Digging', jobDesc: 'Sinks posts and opens up blocked ground.',
    found: 'the wet sand at the tide line, on the Landing Beach',
    line: [
      { name: 'Krabby', dex: 98 },
      { name: 'Kingler', dex: 99,
        blurb: 'Kingler\'s big claw is enormous now, strong enough to crack a rock. It still uses it as a shovel most of the time. It can move a whole bank of sand in an hour.' }
    ],
    passage: {
      title: 'Field Notes: Krabby',
      source: 'Ranger Elm, note 18',
      text: [
        'Krabby lives where the sand stays wet. It digs a {burrow} down into the shallow water and backs into it when anything comes near.',
        'Its two claws do not match. One is always bigger. If a Krabby loses the big one, the small one grows to take its place, and a new small one grows on the other side.',
        'The big claw is not really for fighting. It is a shovel. A Krabby can move a pile of wet sand faster than a person with a {spade}.',
        'Elm used them to sink the first posts on the dock. He wrote that a Krabby will dig all day, as long as the sand stays wet.',
        'They are shy. Stand still and one will come out and get back to work right in front of you. Move fast and you will be looking at an empty hole.'
      ]
    },
    questions: [
      { tag: 'Detail',
        q: 'What does a Krabby do when something comes near?',
        choices: ['It backs into its burrow', 'It waves both claws', 'It runs up the beach', 'It buries its claws'],
        answer: 0,
        why: 'The first page says it digs a burrow and "backs into it when anything comes near." Hiding is its first move, not fighting.' },
      { tag: 'Word meaning',
        q: 'A {burrow} is —',
        choices: ['a hole an animal digs to live in', 'a pile of wet sand', 'a large claw', 'a kind of shell'],
        answer: 0,
        why: 'The Krabby digs one down into the sand and then backs into it, so it must be a hole it lives in.' },
      { tag: 'Main idea',
        q: 'What is the big claw really for?',
        choices: ['Digging, like a shovel', 'Fighting off other crabs', 'Holding on to rocks', 'Cracking open shells'],
        answer: 0,
        why: 'The notes say it straight out: "It is not really for fighting. It is a shovel." That is why Elm used them on the dock posts.' },
      { tag: 'Cause and effect',
        q: 'What happens if a Krabby loses its big claw?',
        choices: ['The small one grows big, and a new small one grows', 'It cannot dig any more', 'It grows two new big ones', 'The big one grows straight back'],
        answer: 0,
        why: 'The claws swap over. The small one takes the big one\'s place, and a new small one appears on the other side.' },
      { tag: 'What to do',
        q: 'How do you get a Krabby to keep working while you watch?',
        choices: ['Stand still', 'Bring it wet sand', 'Move slowly toward it', 'Wait until dark'],
        answer: 0,
        why: 'They are shy. Stand still and it comes back out; move fast and all you get is an empty hole.' }
    ],
    lines: {
      rapport: 'The Krabby edges out of its hole and lifts the big claw at you.',
      catch: 'It sidles over and settles by your boot, claw up like a salute.',
      flee: 'A puff of wet sand, and the burrow is empty.'
    }
  },

  /* ------------------------------------------------------------ meadow */
  {
    id: 'chikorita', name: 'Chikorita', kind: 'Leaf', region: 'meadow',
    job: 'plant', jobName: 'Planting', jobDesc: 'Makes roots, vines and rope grass grow.',
    found: 'the sunny south end of Meadow Hollow, where the tall grass is thickest',
    line: [
      { name: 'Chikorita', dex: 152 },
      { name: 'Bayleef', dex: 153,
        blurb: 'Bayleef has a ring of leaves around its neck now, and the sweet smell is much stronger. Plants near a Bayleef grow so fast you can almost watch them do it.' },
      { name: 'Meganium', dex: 154,
        blurb: 'Meganium\'s flower can calm an angry animal from right across a field. The ground it walks on turns dark and rich. Elm called it the best gardener on the island.' }
    ],
    passage: {
      title: 'Field Notes: Chikorita',
      source: 'Ranger Elm, note 31',
      text: [
        'The big leaf on a Chikorita\'s head is not just for show. It is a tool. The leaf can feel changes in the air.',
        'A Chikorita will walk under a bush a whole hour before the rain starts. The sky still looks blue. The leaf already knows.',
        'When a Chikorita is happy, its leaf gives off a sweet smell. That smell helps little plants grow roots faster. So a happy Chikorita makes the ground better just by standing there.',
        'That is the part to remember. A Chikorita that got dragged somewhere makes almost no smell at all. A Chikorita that wants to be there will turn thin dirt into good soil.',
        'So ask. Do not pull. Give it food and {shade}, and it will do more for a hillside in one summer than six people with shovels.'
      ]
    },
    questions: [
      { tag: 'Main idea',
        q: 'How does a happy Chikorita make the ground better?',
        choices: ['It digs the dirt up with its feet', 'Its sweet smell helps plant roots grow faster', 'It carries water to the plants', 'It keeps hungry animals away'],
        answer: 1,
        why: 'The third page explains it: the sweet smell "helps little plants grow roots faster," so the Chikorita helps "just by standing there."' },
      { tag: 'Inference',
        q: 'Why is a dragged Chikorita a bad helper?',
        choices: ['It will be too tired to walk', 'An unhappy one makes almost no smell', 'It will run back to the meadow', 'Its leaf stops feeling the weather'],
        answer: 1,
        why: 'Two facts, joined up. The smell is what helps roots grow, and a dragged Chikorita "makes almost no smell at all." No smell means no help.' },
      { tag: 'Detail',
        q: 'What can the leaf on its head do?',
        choices: ['Feel changes in the air before rain comes', 'Hold water for later', 'Make a loud sound', 'Cut through tall grass'],
        answer: 0,
        why: 'The leaf is called a tool because it "can feel changes in the air." That is how the Chikorita takes cover an hour before the rain.' },
      { tag: 'Word meaning',
        q: 'In this passage, {shade} means —',
        choices: ['a cool spot out of the sun', 'a kind of food', 'a light rain', 'a soft bed'],
        answer: 0,
        why: 'Shade is the cool dark spot the sun does not reach. Elm lists it as something you give the animal, along with food.' },
      { tag: 'Author\'s craft',
        q: 'Why does Elm talk about six people with shovels?',
        choices: ['To say the island needs more workers', 'To show how much work one Chikorita can do', 'To explain how shovels hurt the soil', 'To say the work takes a long time'],
        answer: 1,
        why: 'It is a way of showing size. One willing Chikorita beats six people, which tells you how much it is worth being kind to it.' }
    ],
    lines: {
      rapport: 'The leaf tips toward you and the air turns a little sweet.',
      catch: 'It trots a circle around your boots and sits down.',
      flee: 'It slips under a bush with its leaf folded flat.'
    }
  },
  {
    id: 'machop', name: 'Machop', kind: 'Superpower', region: 'meadow',
    job: 'haul', jobName: 'Carrying', jobDesc: 'Lifts what people cannot lift.',
    found: 'the stone circle on the east side of Meadow Hollow',
    line: [
      { name: 'Machop', dex: 66 },
      { name: 'Machoke', dex: 67,
        blurb: 'Machoke is thicker through the arms and the shoulders. It still stops and measures before it lifts. It just has less to measure now.' },
      { name: 'Machamp', dex: 68,
        blurb: 'Machamp has four arms. It can hold a block steady with two of them and set it down with the other two. Nothing here moves more in an afternoon.' }
    ],
    passage: {
      title: 'Field Notes: Machop',
      source: 'Ranger Elm, note 38',
      text: [
        'A Machop is about as tall as a nine year old kid. It can lift a rock that no grown up on this island can move.',
        'How? Its arms are built for power, not for care. That trade makes it very strong. It also makes it {clumsy}.',
        'Hand a Machop a cup and you will lose the cup. But ask it to move a fallen tree, and it will look at the tree, walk around it twice, and then move it in one push.',
        'Machop train out in the open where everyone can see. Young ones copy the older ones. Nobody teaches them.',
        'The stones in the meadow circle are not a shrine. They are weights. Machop have been moving them around for longer than we have kept notes.',
        'Never rush a Machop on a job. When it stands still, it is measuring. The measuring is why it never drops anything.'
      ]
    },
    questions: [
      { tag: 'Cause and effect',
        q: 'Why is a Machop clumsy with a cup?',
        choices: ['Cups are new to the island', 'Its arms are built for power, not for care', 'It cannot see things held close up', 'It is not interested in small jobs'],
        answer: 1,
        why: 'The notes give the reason and then the result: the arms are "built for power, not for care," and "that trade" is what makes it clumsy.' },
      { tag: 'Detail',
        q: 'What are the stones in the meadow circle really for?',
        choices: ['They mark a shrine', 'They are weights for training', 'They show the edge of the meadow', 'They keep the grass down'],
        answer: 1,
        why: 'Elm says it plainly: "The stones in the meadow circle are not a shrine. They are weights."' },
      { tag: 'Inference',
        q: 'A Machop is standing still in the middle of a job. What is it doing?',
        choices: ['Working out how to lift without dropping it', 'Waiting for you to help', 'Resting because it is tired', 'Losing interest in the job'],
        answer: 0,
        why: 'The last line says not to rush it: "When it stands still, it is measuring." The fallen tree is the same thing — look, walk around, then lift.' },
      { tag: 'Detail',
        q: 'How do young Machop learn to train?',
        choices: ['Older ones teach them', 'They copy the older ones', 'People show them how', 'They already know when they are born'],
        answer: 1,
        why: '"Young ones copy the older ones. Nobody teaches them." Copying and being taught are not the same thing, and that is the point.' },
      { tag: 'Word meaning',
        q: '{clumsy} means —',
        choices: ['very strong', 'likely to drop or break things', 'slow to wake up', 'easy to scare'],
        answer: 1,
        why: 'The very next page shows you what clumsy means: hand a Machop a cup, and "you will lose the cup."' }
    ],
    lines: {
      rapport: 'The Machop puts down its stone and stands up to listen.',
      catch: 'It picks up your bag before you can say no.',
      flee: 'It jogs back toward the stones, in no hurry at all.'
    }
  },
  {
    id: 'pikachu', name: 'Pikachu', kind: 'Mouse', region: 'meadow',
    job: 'power', jobName: 'Sparking', jobDesc: 'Puts power into something dead.',
    found: 'the little reed island in the middle of the meadow pond',
    line: [
      { name: 'Pikachu', dex: 25 },
      { name: 'Raichu', dex: 26,
        blurb: 'Raichu holds a lot more power than Pikachu did. Its long tail ends in a flat shape that lets the extra power run away into the ground. Watch for the same three signs.' }
    ],
    passage: {
      title: 'Field Notes: Pikachu',
      source: 'Ranger Elm, note 45',
      text: [
        'The two red spots on a Pikachu\'s cheeks are like little batteries. They hold power. They do not make it.',
        'The power gets made along the Pikachu\'s back while it moves. So a Pikachu that napped all day has almost nothing to give. A Pikachu that ran all day is full.',
        'That means you should not corner one and ask it for a spark. Take it for a walk first. Twenty minutes up the ridge trail works better than any amount of begging.',
        'When a Pikachu is holding too much power, it lets it out. It does not ask first. Watch for three signs: the cheeks get bright, the ears fold back, and the tail goes {stiff} and up.',
        'Step away when you see those signs. The Pikachu is not being mean. It is putting down something too hot to hold.'
      ]
    },
    questions: [
      { tag: 'Cause and effect',
        q: 'Why should you walk a Pikachu before you need power from it?',
        choices: ['Walking calms it down', 'The power gets made while it moves', 'Higher ground makes the spark stronger', 'It gets hungry and asks for food'],
        answer: 1,
        why: 'The cheeks only hold power. The power itself "gets made along the Pikachu\'s back while it moves." So the walk is the charging.' },
      { tag: 'Detail',
        q: 'What are the three warning signs?',
        choices: ['Bright cheeks, ears folded back, stiff tail', 'Closed eyes, flat ears, a loud squeak', 'Bright eyes, a raised paw, a long yawn', 'Dark cheeks, a curled tail, shaking'],
        answer: 0,
        why: 'The notes list all three together: "the cheeks get bright, the ears fold back, and the tail goes stiff and up."' },
      { tag: 'Inference',
        q: 'Why does Elm say the Pikachu is "not being mean"?',
        choices: ['It has to let the power out, like dropping something hot', 'It is only playing a game', 'It is scared of you', 'It does not know you are there'],
        answer: 0,
        why: 'The line right after it explains: it is "putting down something too hot to hold." Dropping something scalding is not an attack.' },
      { tag: 'Main idea',
        q: 'What do the red spots on its cheeks do?',
        choices: ['They make the power', 'They hold the power', 'They keep it warm', 'They help it see at night'],
        answer: 1,
        why: 'The very first page draws the line: the spots "hold power. They do not make it." The making happens along the back while it moves.' },
      { tag: 'Word meaning',
        q: 'A {stiff} tail is one that is —',
        choices: ['soft and floppy', 'held hard and straight', 'wet', 'very short'],
        answer: 1,
        why: 'Stiff means it is not bending. It is held hard and straight, which is why a stiff tail sticking up is easy to spot.' }
    ],
    lines: {
      rapport: 'The Pikachu\'s ears come forward. Its cheeks dim a little.',
      catch: 'It climbs up to your shoulder and sits there, warm.',
      flee: 'A crack of sparks, and it is gone across the water.'
    }
  },

  {
    id: 'mareep', name: 'Mareep', kind: 'Wool', region: 'meadow',
    job: 'power', jobName: 'Sparking', jobDesc: 'Puts power into something dead.',
    found: 'the tall grass on the south side of Meadow Hollow',
    line: [
      { name: 'Mareep', dex: 179 },
      { name: 'Flaaffy', dex: 180,
        blurb: 'Flaaffy has less wool now. The bare pink skin under it holds power better than the fleece did. A Flaaffy is smaller than a Mareep, but it carries much more.' },
      { name: 'Ampharos', dex: 181,
        blurb: 'The light on an Ampharos tail is bright enough to be seen from out at sea. Boats used to steer by them on bad nights. Elm called it the brightest thing on the island.' }
    ],
    passage: {
      title: 'Field Notes: Mareep',
      source: 'Ranger Elm, note 34',
      text: [
        'Mareep is covered in a thick white {fleece}. The wool rubs against itself while the animal walks, and that rubbing is where all of its power comes from.',
        'So the more it walks, the more it holds. The tip of its tail glows brighter as the day goes on.',
        'That makes a Mareep easy to read. Dim tail, walk it further. Bright tail, it is ready.',
        'Do not brush a Mareep. The fleece is doing a job. A brushed Mareep holds almost nothing until the wool grows back.',
        'Elm kept one by the {sluice} gate for a whole summer. He wrote that it never once gave him a shock he had not asked for.'
      ]
    },
    questions: [
      { tag: 'Cause and effect',
        q: 'Where does a Mareep\'s power come from?',
        choices: ['Its wool rubbing together as it walks', 'The sun on its fleece', 'The glow in its tail', 'Standing still for a long time'],
        answer: 0,
        why: 'The first page names it: the wool "rubs against itself while the animal walks, and that rubbing is where all of its power comes from."' },
      { tag: 'Word meaning',
        q: 'A {fleece} is —',
        choices: ['a thick woolly coat', 'a long tail', 'a bright light', 'a kind of grass'],
        answer: 0,
        why: 'It is the thick white wool covering the animal, the same word you would use for a sheep.' },
      { tag: 'Detail',
        q: 'How can you tell a Mareep is ready to give you power?',
        choices: ['Its tail tip glows bright', 'Its wool stands up', 'It stops walking', 'It makes a sound'],
        answer: 0,
        why: '"Dim tail, walk it further. Bright tail, it is ready." The tail is the gauge.' },
      { tag: 'Inference',
        q: 'Why should you not brush a Mareep?',
        choices: ['The fleece is what makes the power', 'It does not like being touched', 'The wool is needed for rope', 'Brushing makes it walk less'],
        answer: 0,
        why: 'No wool means no rubbing, and no rubbing means no power. A brushed Mareep "holds almost nothing until the wool grows back."' },
      { tag: 'Main idea',
        q: 'What did Elm say about the Mareep he kept all summer?',
        choices: ['It never shocked him without being asked', 'It walked away every night', 'It needed brushing every day', 'It was the brightest one he saw'],
        answer: 0,
        why: 'That is the whole point of his note about it, and it is why he trusted them around the gate.' }
    ],
    lines: {
      rapport: 'The tail tip brightens a little. The Mareep takes a step closer.',
      catch: 'It leans its woolly side against your leg and stays there.',
      flee: 'It trots off into the tall grass, tail dimming as it goes.'
    }
  },

  /* ------------------------------------------------------------ grove */
  {
    id: 'bulbasaur', name: 'Bulbasaur', kind: 'Seed', region: 'grove',
    job: 'plant', jobName: 'Planting', jobDesc: 'Makes roots, vines and rope grass grow.',
    found: 'the shrine clearing in the middle of Whispering Grove',
    line: [
      { name: 'Bulbasaur', dex: 1 },
      { name: 'Ivysaur', dex: 2,
        blurb: 'The bulb has opened into a bud. Ivysaur carries more water than it used to, so it can walk further from the brook. It plants as it goes, the same as always.' },
      { name: 'Venusaur', dex: 3,
        blurb: 'Venusaur has a wide flower on its back that drinks the sun all day. A hillside a Venusaur has crossed will hold together through any storm. Nothing plants better.' }
    ],
    passage: {
      title: 'Field Notes: Bulbasaur',
      source: 'Ranger Elm, note 52',
      text: [
        'The bulb on a Bulbasaur\'s back is a water tank. It holds water and food inside, and it lets them out slowly.',
        'That is why a Bulbasaur can go eight days with no rain and still look fine. Every other animal in the grove is crowding around the brook.',
        'Because it does not need the wet ground, it does not fight over it. Instead it walks all over the island. And while it walks, it plants.',
        'Bits of {vine} drop off the bulb and take root. They hold a hillside together through the winter storms. The old stone steps on the ridge were not built by people. Bulbasaur grew them.',
        'One warning. A Bulbasaur will not plant on ground it does not trust. It is a better judge of ground than you are. If yours turns away from a hill, go walk that hill again.'
      ]
    },
    questions: [
      { tag: 'Detail',
        q: 'What is inside the bulb on its back?',
        choices: ['Seeds for new plants', 'Water and food, let out slowly', 'Air, to help it float', 'Nothing at all'],
        answer: 1,
        why: 'The first page calls the bulb a water tank: "It holds water and food inside, and it lets them out slowly."' },
      { tag: 'Cause and effect',
        q: 'Why does a Bulbasaur not fight over the wet ground?',
        choices: ['Its bulb means it does not need the wet ground', 'The other animals are bigger than it', 'It does not like the brook', 'It is asleep during the day'],
        answer: 0,
        why: 'It can go eight days with no rain because of the tank on its back. If you do not need something, there is nothing to fight about.' },
      { tag: 'What to do',
        q: 'Your Bulbasaur turns away from a hill. What should you do?',
        choices: ['Plant the hill yourself', 'Go and look at that hill again', 'Find a different Bulbasaur', 'Wait for the rain to stop'],
        answer: 1,
        why: 'Elm says the animal "is a better judge of ground than you are," and then says straight out: "go walk that hill again."' },
      { tag: 'Detail',
        q: 'Who made the old stone steps on the ridge?',
        choices: ['People, a long time ago', 'Bulbasaur, by growing vines', 'Machop, by stacking rocks', 'Nobody knows'],
        answer: 1,
        why: 'The notes say it twice over: "were not built by people. Bulbasaur grew them." The vines take root and hold the hillside.' },
      { tag: 'Word meaning',
        q: 'A {vine} is —',
        choices: ['a long bendy plant stem', 'a small round seed', 'a kind of rock', 'a deep hole'],
        answer: 0,
        why: 'The vines drop off the bulb, take root, and hold a whole hillside together. They are long spreading plant stems.' }
    ],
    lines: {
      rapport: 'The Bulbasaur turns all the way toward you, bulb swaying.',
      catch: 'It presses its head against your leg, once.',
      flee: 'Vines close up behind it and the clearing goes quiet.'
    }
  },
  {
    id: 'diglett', name: 'Diglett', kind: 'Mole', region: 'grove',
    job: 'dig', jobName: 'Digging', jobDesc: 'Sinks posts and opens up blocked ground.',
    found: 'the soft mushroom dirt along the grove brook',
    line: [
      { name: 'Diglett', dex: 50 },
      { name: 'Dugtrio', dex: 51,
        blurb: 'There are three heads now, and they work as one. A Dugtrio digs three times as fast. Nobody has seen the bottom half of any of the three, either.' }
    ],
    passage: {
      title: 'Field Notes: Diglett',
      source: 'Ranger Elm, note 60',
      text: [
        'I will be honest with you. Most of this page is a list of things we do not know.',
        'Nobody here has ever seen the bottom half of a Diglett. Not once in nine years. They pop up to the neck, look around, and drop back down.',
        'Here is what we do know. A Diglett moves through hard dirt about as fast as you walk on a path. And the {tunnel} behind it does not fall in. Something is pressing those walls tight.',
        'One day we were hammering posts by the brook. Seven Digletts popped up in four minutes. They came up in a line, spaced out {evenly}.',
        'They were too far apart to all feel the same hammer. I think they were talking to each other under the ground.',
        'I cannot prove that. I wrote it down anyway, so that you know which part of this page is only a guess.'
      ]
    },
    questions: [
      { tag: 'Main idea',
        q: 'What is this page mostly about?',
        choices: ['How fast a Diglett can dig', 'What we know about Diglett and what we only guess', 'Why Diglett live near the brook', 'How to catch a Diglett'],
        answer: 1,
        why: 'It opens with "most of this page is a list of things we do not know" and ends by marking which part "is only a guess." That is the whole shape of it.' },
      { tag: 'Detail',
        q: 'What has nobody ever seen?',
        choices: ['A Diglett in the daytime', 'The bottom half of a Diglett', 'A Diglett tunnel', 'More than one Diglett at a time'],
        answer: 1,
        why: 'Not once in nine years. They come up "to the neck, look around, and drop back down," so the rest stays hidden.' },
      { tag: 'Inference',
        q: 'Why does Elm think the Digletts were talking to each other?',
        choices: ['They came up together but were too far apart to feel one hammer', 'They made noises Elm could hear', 'They came up one at a time', 'They came up in the wrong place'],
        answer: 0,
        why: 'That is the whole clue. Seven came up in a line in four minutes, and the hammer could not have reached them all — so something else told them.' },
      { tag: 'Detail',
        q: 'Why do Diglett tunnels not fall in?',
        choices: ['They are held up with roots', 'Something presses the walls tight', 'They are very short', 'They are full of water'],
        answer: 1,
        why: 'The notes say the tunnel "does not fall in. Something is pressing those walls tight." Elm does not claim to know what.' },
      { tag: 'Word meaning',
        q: 'A {tunnel} is —',
        choices: ['a hole that goes along under the ground', 'a tall pile of dirt', 'a wide open field', 'a kind of tree root'],
        answer: 0,
        why: 'The Diglett makes one by moving through hard dirt, and it stays open behind the animal. It is a hole running along underground.' }
    ],
    lines: {
      rapport: 'The Diglett rises another inch out of the dirt, listening.',
      catch: 'It comes up beside your boot and waits to be told what to do.',
      flee: 'The dirt closes over. No sound at all.'
    }
  },

  {
    id: 'hoothoot', name: 'Hoothoot', kind: 'Owl', region: 'grove',
    job: 'scout', jobName: 'Scouting', jobDesc: 'Finds a path and remembers it.',
    found: 'the dark side of Whispering Grove, at dusk',
    line: [
      { name: 'Hoothoot', dex: 163 },
      { name: 'Noctowl', dex: 164,
        blurb: 'Noctowl can see when there is almost no light. It flies without a sound. It can hold a whole night of flying in its head. Then it gives it all back to you, in order.' }
    ],
    passage: {
      title: 'Field Notes: Hoothoot',
      source: 'Ranger Elm, note 56',
      text: [
        'Hoothoot stands on one foot. The other one is {tucked} up in its feathers. It swaps them over so fast that most people never see it happen.',
        'It has a very good clock inside it. A Hoothoot turns its head at the same {steady} beat all night long, like something ticking.',
        'That clock is what makes it useful. A Hoothoot always knows how long it has been flying. So it always knows how far it has gone.',
        'Send one out over the trees and it comes back and tells you the distance, not just the way.',
        'It sleeps through the day. If you want a Hoothoot, come to the grove at {dusk} and wait for the ticking to start.'
      ]
    },
    questions: [
      { tag: 'Detail',
        q: 'How does a Hoothoot stand?',
        choices: ['On one foot', 'On both feet', 'Hanging upside down', 'Flat on its front'],
        answer: 0,
        why: 'It stands on one foot with the other tucked up in its feathers, and swaps them faster than you can see.' },
      { tag: 'Word meaning',
        q: '{steady} means —',
        choices: ['going on the same way, without changing', 'very fast', 'very quiet', 'happening once'],
        answer: 0,
        why: 'The head turns at the same beat all night, "like something ticking." A steady beat does not speed up or slow down.' },
      { tag: 'Main idea',
        q: 'Why is a Hoothoot so useful for finding a path?',
        choices: ['It knows how far it went, not just which way', 'It can fly higher than other birds', 'It never sleeps', 'It can see in the dark'],
        answer: 0,
        why: 'The clock inside it means it knows how long it flew, and so how far. It brings back a distance as well as a direction.' },
      { tag: 'Cause and effect',
        q: 'Why does a Hoothoot always know the distance?',
        choices: ['It keeps time like a clock', 'It counts the trees below it', 'It follows the same path each time', 'It never flies very far'],
        answer: 0,
        why: 'Steady time plus flying speed gives you distance. That is why the ticking head matters.' },
      { tag: 'What to do',
        q: 'When should you go looking for a Hoothoot?',
        choices: ['At dusk', 'Early in the morning', 'In the middle of the day', 'After a storm'],
        answer: 0,
        why: 'It sleeps all day. The last page tells you to come at dusk and wait for the ticking to start.' }
    ],
    lines: {
      rapport: 'The ticking stops. Both eyes are on you now.',
      catch: 'It drops onto your shoulder, and the ticking starts again.',
      flee: 'It lifts off without a sound and the grove goes quiet.'
    }
  },
  {
    id: 'oddish', name: 'Oddish', kind: 'Weed', region: 'grove',
    job: 'plant', jobName: 'Planting', jobDesc: 'Makes roots, vines and rope grass grow.',
    found: 'bare ground in Whispering Grove, where nothing else is growing',
    line: [
      { name: 'Oddish', dex: 43 },
      { name: 'Gloom', dex: 44,
        blurb: 'Gloom drips a smell most people cannot stand. The drips are worth having, though. Ground where a Gloom has stood grows better than any soil on this island.' },
      { name: 'Vileplume', dex: 45,
        blurb: 'Vileplume has the biggest flower of anything here. It can shake out a cloud of dust that makes seeds take root in a single night. Stand upwind of it.' }
    ],
    passage: {
      title: 'Field Notes: Oddish',
      source: 'Ranger Elm, note 63',
      text: [
        'Oddish spends the whole day buried. Only the leaves on its head show, and from a step away they look exactly like a small plant.',
        'It is not hiding from you. It is drinking. An Oddish sits in the ground all day and takes water up through its feet.',
        'At {dusk} it pulls itself out and walks. It goes a long way for something so small, and it plants seeds the whole time it is moving.',
        'Sun hurts an Oddish. It looks for {shade} before it looks for food.',
        'So if you want one, look for leaves in a {patch} of ground with no other plants in it. Then wait for the sun to go down.'
      ]
    },
    questions: [
      { tag: 'Inference',
        q: 'Why does an Oddish stay buried all day?',
        choices: ['It is drinking water through its feet', 'It is hiding from people', 'It is asleep', 'It is waiting for rain'],
        answer: 0,
        why: 'The notes correct the obvious guess: "It is not hiding from you. It is drinking."' },
      { tag: 'Detail',
        q: 'When does an Oddish walk about?',
        choices: ['At dusk', 'At noon', 'Only in the rain', 'It never walks'],
        answer: 0,
        why: 'At dusk it pulls itself out of the ground and walks, because sun hurts it.' },
      { tag: 'Word meaning',
        q: 'In this passage, {shade} means —',
        choices: ['a cool spot out of the sun', 'a kind of leaf', 'wet ground', 'a dark colour'],
        answer: 0,
        why: 'Sun hurts an Oddish, so it looks for somewhere the sun does not reach before it even looks for food.' },
      { tag: 'Main idea',
        q: 'What does an Oddish do while it is walking?',
        choices: ['It plants seeds', 'It drinks water', 'It looks for other Oddish', 'It digs new holes'],
        answer: 0,
        why: 'It "plants seeds the whole time it is moving." That is what makes it worth having on a hillside.' },
      { tag: 'What to do',
        q: 'How do you spot an Oddish?',
        choices: ['Leaves in bare ground with no other plants', 'A hole in the wet sand', 'A bright light at dusk', 'Tracks along the brook'],
        answer: 0,
        why: 'The last page gives you the trick: leaves in a patch of ground where nothing else is growing. The leaves are the only part showing.' }
    ],
    lines: {
      rapport: 'The leaves turn toward you. Something shuffles under the soil.',
      catch: 'It hauls itself out of the ground and waits by your feet.',
      flee: 'The leaves sink out of sight and the ground looks empty again.'
    }
  },

  /* ------------------------------------------------------------ marsh */
  {
    id: 'wooper', name: 'Wooper', kind: 'Water Fish', region: 'marsh',
    job: 'water', jobName: 'Finding Water', jobDesc: 'Sniffs out fresh water and carries it.',
    found: 'the firm reed island in the middle of the Reed Marsh',
    line: [
      { name: 'Wooper', dex: 194 },
      { name: 'Quagsire', dex: 195,
        blurb: 'Quagsire is bigger and somehow even calmer. It still needs its skin kept wet. It will stand in a stream all day and look pleased about it.' }
    ],
    passage: {
      title: 'Field Notes: Wooper',
      source: 'Ranger Elm, note 71',
      text: [
        'Wooper live in the {marsh}, where the river runs into the sea. The water there is half fresh and half salty. Most animals have to work hard to live in water like that.',
        'A Wooper does not. Its skin has a thick coat of {slime}. The slime keeps the water out. So a Wooper can sit there all day and never worry about it.',
        'The slime also tastes bad, so most things leave it alone. That is probably just good luck and not the reason the slime grew.',
        'On land the slime dries out in about half an hour. A dry Wooper is a sad Wooper. If you take one away from the water, bring water with you. Give it a puddle at every stop.',
        'That is not being nice. That is the deal. A Wooper you let dry out will not follow you a second time.',
        'Keep it wet, though, and it is the calmest worker on this island. It will stand in a stream for an hour with the water breaking over its back and never once try to leave.'
      ]
    },
    questions: [
      { tag: 'Word meaning',
        q: 'A {marsh} is —',
        choices: ['soft wet land with tall grass', 'a deep hole in the rock', 'a fast river', 'a dry field'],
        answer: 0,
        why: 'It is the wet place where the river runs into the sea, full of reeds. Soft wet ground with tall grass growing in it.' },
      { tag: 'Cause and effect',
        q: 'Why can a Wooper sit in half salty water all day?',
        choices: ['It holds its breath', 'Its slime keeps the water out', 'It only stays a short time', 'It drinks the salt water'],
        answer: 1,
        why: 'Other animals "have to work hard to live in water like that." The Wooper does not, because "the slime keeps the water out."' },
      { tag: 'Detail',
        q: 'How long does the slime take to dry out on land?',
        choices: ['About half an hour', 'About a whole day', 'A few seconds', 'It never dries out'],
        answer: 0,
        why: 'The notes give a number: "On land the slime dries out in about half an hour." That is why you bring water along.' },
      { tag: 'Inference',
        q: 'A Wooper will not follow you. What probably happened before?',
        choices: ['It was given a job it could not do', 'Somebody let it dry out', 'It was fed the wrong food', 'It got lost on the trail'],
        answer: 1,
        why: 'The passage names exactly one cause: "A Wooper you let dry out will not follow you a second time." It remembers.' },
      { tag: 'Main idea',
        q: 'Why is a Wooper such a good worker?',
        choices: ['It works faster than the others', 'It stays calm and does not leave its job', 'It can lift heavy things', 'It never needs to eat'],
        answer: 1,
        why: 'The last page is the answer: it will stand in a stream for an hour with water breaking over its back "and never once try to leave."' }
    ],
    lines: {
      rapport: 'The Wooper\'s tail swings once. Nothing else moves.',
      catch: 'It plods over and stands on your foot, happily.',
      flee: 'It sinks until only two eyes are left, then those go too.'
    }
  },
  {
    id: 'chinchou', name: 'Chinchou', kind: 'Angler', region: 'marsh',
    job: 'light', jobName: 'Lighting', jobDesc: 'Holds a steady light in the dark.',
    found: 'the deep channel at the south end of the marsh, after dark',
    line: [
      { name: 'Chinchou', dex: 170 },
      { name: 'Lanturn', dex: 171,
        blurb: 'Lanturn\'s light is far brighter, and it can hold it steady all night. Boats used to steer by them. Keep your own lantern above the water anyway.' }
    ],
    passage: {
      title: 'Field Notes: Chinchou',
      source: 'Ranger Elm, note 78',
      text: [
        'The two long parts trailing behind a Chinchou used to be fins. They do not help it swim any more. Now each one ends in a bulb that can {glow} for hours.',
        'People used to think the light was for hunting. That is wrong. A hunting Chinchou goes dark. It {drifts}, and it finds its food by feeling tiny sparks in the water.',
        'The light is for talking. Where a dozen Chinchou gather, the flashes make a pattern. The pattern takes about forty seconds. Then it starts over again.',
        'Nobody knows what the pattern means. We do know it stops the second you lower a lantern into the water. And it does not start again for twenty minutes.',
        'So keep your own light above the water. A Chinchou that agrees to help will hold its bulb steady for as long as you ask.',
        'It even dims the light on its own when you lean in close to look at something. I still cannot explain how it knows to do that.'
      ]
    },
    questions: [
      { tag: 'Main idea',
        q: 'What is the Chinchou\'s light really for?',
        choices: ['Hunting for food', 'Talking to other Chinchou', 'Scaring animals away', 'Finding its way home'],
        answer: 1,
        why: 'The notes fix an old mistake: "People used to think the light was for hunting. That is wrong." A hunting Chinchou goes dark. The light is for talking.' },
      { tag: 'Word meaning',
        q: 'To {glow} means to —',
        choices: ['give off a soft steady light', 'flash on and off fast', 'get very hot', 'make a low sound'],
        answer: 0,
        why: 'The bulbs can glow "for hours," and a helper will "hold its bulb steady." That is a soft steady light, not a flash.' },
      { tag: 'Cause and effect',
        q: 'What happens if you put a lantern into the water?',
        choices: ['The Chinchou come closer', 'The Chinchou stop flashing for twenty minutes', 'The lantern goes out', 'The Chinchou go dark and hunt'],
        answer: 1,
        why: 'The pattern "stops the second you lower a lantern into the water. And it does not start again for twenty minutes."' },
      { tag: 'Detail',
        q: 'How does a hunting Chinchou find its food?',
        choices: ['By feeling tiny sparks in the water', 'By lighting up the water', 'By listening for splashes', 'By following other Chinchou'],
        answer: 0,
        why: 'It "goes dark. It drifts, and it finds its food by feeling tiny sparks in the water." The light is off while it hunts.' },
      { tag: 'What to do',
        q: 'Where should you keep your lantern in the marsh at night?',
        choices: ['Under the water', 'Above the water', 'Left behind on the shore', 'Wrapped in cloth'],
        answer: 1,
        why: 'Because a lantern in the water shuts the Chinchou down for twenty minutes, Elm says to "keep your own light above the water."' }
    ],
    lines: {
      rapport: 'Both bulbs get a shade brighter, then settle.',
      catch: 'It comes up to the surface beside you, lights steady.',
      flee: 'Two lights blink out and the channel goes black.'
    }
  },

  {
    id: 'marill', name: 'Marill', kind: 'Aqua Mouse', region: 'marsh',
    job: 'water', jobName: 'Finding Water', jobDesc: 'Sniffs out fresh water and carries it.',
    found: 'the deep water of the Reed Marsh, near the boardwalk',
    line: [
      { name: 'Marill', dex: 183 },
      { name: 'Azumarill', dex: 184,
        blurb: 'Azumarill can hold its breath for ten minutes and hear a fish move right across a pool. It still floats on its tail whenever it can. It is far stronger than it looks.' }
    ],
    passage: {
      title: 'Field Notes: Marill',
      source: 'Ranger Elm, note 74',
      text: [
        'Marill has a round blue tail with a ball on the end of it. The ball floats. The Marill itself does not.',
        'So it uses the tail like a life ring. It holds the ball up on top of the water and lets the rest of itself hang underneath.',
        'That is how it crosses the deep parts of the {marsh} without swimming at all. It floats across and walks out the other side.',
        'The tail stores food as well, which is why a Marill can work a long day without stopping to eat.',
        'Elm liked them for one reason. A Marill can tell you how deep any water is before you step into it. Watch how much of the tail is showing.'
      ]
    },
    questions: [
      { tag: 'Main idea',
        q: 'What does a Marill use its tail for?',
        choices: ['As a float, like a life ring', 'To swim faster', 'To hold on to reeds', 'To dig in the mud'],
        answer: 0,
        why: 'The ball on the end floats even though the animal does not, so it holds the ball up and hangs underneath it.' },
      { tag: 'Word meaning',
        q: 'A {marsh} is —',
        choices: ['soft wet land with tall grass', 'a deep cave', 'a fast river', 'a sandy beach'],
        answer: 0,
        why: 'It is the wet reedy ground where the river meets the sea, which is where Marill live.' },
      { tag: 'Inference',
        q: 'How can a Marill cross deep water without swimming?',
        choices: ['The floating ball carries it across', 'It walks along the bottom', 'It jumps from reed to reed', 'It holds its breath'],
        answer: 0,
        why: 'Put the first two pages together: the ball floats, the animal does not, so the ball carries it and it drifts across.' },
      { tag: 'Detail',
        q: 'What else does the tail hold?',
        choices: ['Food', 'Water', 'Air', 'Seeds'],
        answer: 0,
        why: 'The tail stores food too, which is why a Marill can work all day without stopping to eat.' },
      { tag: 'What to do',
        q: 'How does a Marill tell you how deep the water is?',
        choices: ['By how much of its tail is showing', 'By how fast it swims', 'By the sound it makes', 'By which way it faces'],
        answer: 0,
        why: 'Elm\'s reason for liking them. Watch the tail and you know whether to step in.' }
    ],
    lines: {
      rapport: 'The tail ball bobs once. The Marill watches you with both eyes.',
      catch: 'It floats over, stands up in the shallows, and shakes itself off.',
      flee: 'It ducks under, and only the ball is left, drifting away.'
    }
  },

  /* ------------------------------------------------------------ caverns */
  {
    id: 'snorlax', name: 'Snorlax', kind: 'Sleeping', region: 'caverns',
    job: 'shove', jobName: 'Pushing', jobDesc: 'Moves what nothing else can move.',
    found: 'asleep across the west room of the Tidepool Caves',
    line: [
      { name: 'Snorlax', dex: 143 }
    ],
    passage: {
      title: 'Field Notes: Snorlax',
      source: 'Ranger Elm, note 90',
      text: [
        'A Snorlax eats about as much in one day as a whole family eats in a month. Getting that much food is hard work.',
        'So it sleeps. That is the trick, and it is a smart one. A body that big burns most of its food just staying alive. Every hour asleep is food it does not have to go and find.',
        'This makes waking one up a real problem. Yelling does not work. Drums do not work.',
        'A Snorlax has slept through waves, falling rocks and thunder. It has learned that loud noise in a cave is never worth getting up for. And it is right.',
        'Smell is different. Smell means food, and food is the one thing worth standing up for. Hold a {ripe} berry a hand\'s width from its nose. In a minute it will do what an hour of banging cannot.',
        'Rowan berries grow in the grove. They smell stronger than any other fruit here. Bring two.',
        'Once it is up, a Snorlax is gentle and careful. It will move a rock pile that eight people gave up on. Then it will go back to sleep, and it will have earned that.'
      ]
    },
    questions: [
      { tag: 'Main idea',
        q: 'Why does a Snorlax sleep so much?',
        choices: ['Sleeping saves the food it would burn', 'It is sick', 'It only wakes up at night', 'It is bored of the cave'],
        answer: 0,
        why: 'Elm calls the sleeping "the trick, and it is a smart one." A huge body burns food just staying alive, so every hour asleep is food it does not have to find.' },
      { tag: 'Cause and effect',
        q: 'Why does yelling not wake a Snorlax?',
        choices: ['It cannot hear very well', 'It learned that loud cave noise is never worth waking for', 'It is too deep inside the cave', 'Sound does not travel in caves'],
        answer: 1,
        why: 'It has slept through waves, rock falls and thunder. So it "has learned that loud noise in a cave is never worth getting up for."' },
      { tag: 'Word meaning',
        q: 'A {ripe} berry is one that is —',
        choices: ['ready to eat', 'still green', 'dried out', 'very small'],
        answer: 0,
        why: 'Ripe means grown all the way and ready to eat. That is why the ripe berry has such a strong smell.' },
      { tag: 'What to do',
        q: 'What should you bring to wake the Snorlax up?',
        choices: ['A drum', 'Two Rowan berries from the grove', 'A big meal', 'A bright lantern'],
        answer: 1,
        why: 'Smell is what works, and Rowan "smell stronger than any other fruit here." Elm even gives the number: "Bring two."' },
      { tag: 'Detail',
        q: 'What can a Snorlax do once it is awake?',
        choices: ['Dig a new tunnel', 'Move a rock pile that eight people gave up on', 'Carry water for a whole day', 'Find fresh water springs'],
        answer: 1,
        why: 'The last page tells you what all the trouble is for: it "will move a rock pile that eight people gave up on."' }
    ],
    lines: {
      rapport: 'One eye opens a crack. The breathing changes.',
      catch: 'It sits up, has a good look at you, and gets to its feet.',
      flee: 'It rolls over. The cave shakes a little, then goes still.'
    }
  },

  {
    id: 'geodude', name: 'Geodude', kind: 'Rock', region: 'caverns',
    job: 'shove', jobName: 'Pushing', jobDesc: 'Moves what nothing else can move.',
    found: 'the south chamber of the Tidepool Caves',
    line: [
      { name: 'Geodude', dex: 74 },
      { name: 'Graveler', dex: 75,
        blurb: 'Graveler has arms enough to climb with and still hold on. It eats rock, and it is not fussy about which rock. Do not leave one beside a stone wall you want to keep.' },
      { name: 'Golem', dex: 76,
        blurb: 'Golem sheds its shell once a year, and the old shell is harder than anything else on the island. It can roll straight through a rock pile. Get out of the way first.' }
    ],
    passage: {
      title: 'Field Notes: Geodude',
      source: 'Ranger Elm, note 85',
      text: [
        'A Geodude looks exactly like a rock until it opens its eyes. People have sat on them. People have picked them up and thrown them.',
        'It does not seem to mind. A Geodude is hard all the way through, and it has no interest in being anywhere in particular.',
        'It moves by rolling, and it rolls downhill by choice. Uphill it uses its arms, one pull at a time, and it is slow.',
        'The older a Geodude is, the smoother it gets. All the sharp edges wear off over the years. A round Geodude is an old Geodude.',
        'For work, a Geodude will lean on anything you point it at. It does not push fast. It just does not stop, and the {gravel} gives way in the end.'
      ]
    },
    questions: [
      { tag: 'Detail',
        q: 'What does a Geodude look like?',
        choices: ['A rock', 'A small tree', 'A pile of sand', 'A shell'],
        answer: 0,
        why: 'It looks exactly like a rock until it opens its eyes, which is why people have sat on them by mistake.' },
      { tag: 'Cause and effect',
        q: 'Why is a round Geodude an old Geodude?',
        choices: ['The sharp edges wear off over the years', 'It rolls itself into a ball to sleep', 'Young ones are always round', 'Roundness helps it roll faster'],
        answer: 0,
        why: 'The notes say the older it is, the smoother it gets, because the edges wear away with time.' },
      { tag: 'Detail',
        q: 'How does a Geodude go uphill?',
        choices: ['It pulls itself with its arms, slowly', 'It rolls up', 'It waits to be carried', 'It goes around instead'],
        answer: 0,
        why: 'Downhill it rolls by choice. Uphill is arms only, "one pull at a time, and it is slow."' },
      { tag: 'Main idea',
        q: 'How does a Geodude move something heavy?',
        choices: ['It leans on it and does not stop', 'It pushes as hard as it can, all at once', 'It rolls into it fast', 'It digs underneath it'],
        answer: 0,
        why: 'The last page is the whole method: not fast, just never stopping, until the ground gives way.' },
      { tag: 'Word meaning',
        q: '{gravel} is —',
        choices: ['lots of little loose stones', 'a large boulder', 'wet clay', 'a kind of sand'],
        answer: 0,
        why: 'It is the loose stony ground that finally shifts when a Geodude keeps leaning on it.' }
    ],
    lines: {
      rapport: 'The rock opens one eye, then the other.',
      catch: 'It rolls over to your feet and stops, waiting to be pointed at something.',
      flee: 'It shuts its eyes. Now it is just a rock again, and you cannot tell which one.'
    }
  },

  /* ------------------------------------------------------------ ridge */
  {
    id: 'ditto', name: 'Ditto', kind: 'Transform', region: 'ridge',
    job: 'mimic', jobName: 'Copying', jobDesc: 'Can stand in for any helper here.',
    found: 'the stone pile at the top of Ash Ridge',
    line: [
      { name: 'Ditto', dex: 132 }
    ],
    passage: {
      title: 'Field Notes: Ditto',
      source: 'Ranger Elm, last note',
      text: [
        'I saved this page for last. It ended up being less about the animal and more about me.',
        'A Ditto can turn into any animal it has looked at closely. What it cannot do is make one up. A Ditto that has never seen a Chinchou cannot turn into one.',
        'And a Ditto that only took a quick look makes a copy that is a little bit wrong. So copying is really a kind of {attention}. A good copy means the Ditto was watching carefully.',
        'That is the part I keep thinking about. For nine years I walked this island and wrote down what I saw. My notes are only as good as my looking was.',
        'Where I hurried, the page is thin. Where I sat still all afternoon, the page holds up. The Ditto and I are in the same line of work, and it is better at it than I am.',
        'One Ditto lives by the stone pile at the top of the ridge. It has watched every animal here. It has watched me too. If you read your way up this ridge, you have earned a meeting. Show it that you were paying attention. That is the only thing it cares about.'
      ]
    },
    questions: [
      { tag: 'Main idea',
        q: 'What do the Ditto and Elm have in common?',
        choices: ['Both are only as good as the attention they paid', 'Both have lived here nine years', 'Both can copy other animals', 'Both like the top of the ridge'],
        answer: 0,
        why: 'A good copy means the Ditto watched carefully, and Elm says "my notes are only as good as my looking was." Same rule, two different jobs.' },
      { tag: 'Cause and effect',
        q: 'Why can a Ditto not turn into an animal it has never seen?',
        choices: ['It can copy, but it cannot make things up', 'It is too small to copy big animals', 'It has to be told the animal\'s name', 'It can only copy animals it likes'],
        answer: 0,
        why: 'The notes say the limit plainly: "What it cannot do is make one up." Copying needs something real to copy from.' },
      { tag: 'Inference',
        q: 'What does Elm mean by "the page is thin"?',
        choices: ['Elm hurried, so those notes are not very good', 'The paper got wet in the rain', 'Elm ran out of paper', 'The page was torn out'],
        answer: 0,
        why: 'It is a picture, not a fact about paper. "Where I hurried, the page is thin" is set against the pages Elm wrote after sitting still all afternoon.' },
      { tag: 'Detail',
        q: 'Where does this Ditto live?',
        choices: ['By the stone pile at the top of the ridge', 'In the caves under the marsh', 'In the grove clearing', 'On the beach by the dock'],
        answer: 0,
        why: 'The last page gives the address: "One Ditto lives by the stone pile at the top of the ridge."' },
      { tag: 'Word meaning',
        q: 'In this passage, {attention} means —',
        choices: ['really looking and noticing things', 'being very fast', 'being very strong', 'asking a lot of questions'],
        answer: 0,
        why: 'A careful look makes a good copy and a quick look makes a wrong one. That is what attention is: really looking, so you notice.' }
    ],
    lines: {
      rapport: 'The Ditto shifts a little, like it is trying on the way you stand.',
      catch: 'For half a second it wears your face, then grins and stops.',
      flee: 'It flattens into the shape of a stone and will not be found.'
    }
  }
];

export const BY_ID = Object.fromEntries(SPECIES.map(s => [s.id, s]));

export const JOBS = {
  scout: { name: 'Scouting', icon: 'eye' },
  water: { name: 'Finding Water', icon: 'drop' },
  plant: { name: 'Planting', icon: 'leaf' },
  haul:  { name: 'Carrying', icon: 'weight' },
  power: { name: 'Sparking', icon: 'bolt' },
  dig:   { name: 'Digging', icon: 'spade' },
  light: { name: 'Lighting', icon: 'lamp' },
  shove: { name: 'Pushing', icon: 'boulder' },
  mimic: { name: 'Copying', icon: 'blob' }
};
