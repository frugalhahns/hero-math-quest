/* Detective Casebook: three cases with suspect lineups, memory checkpoints,
   clue lists, an elimination grid, and a verdict. Adapted from the printed
   casebook. Order matters: read, remember, then decide. */

export const CASES = [
  {
    id: 'case1',
    title: 'The Missing Emerald Medal',
    difficulty: 'Rookie Case',
    hero: 'speedster',
    suspects: [
      { name: 'Sidekick', blurb: 'Was fixing his biplane engine all afternoon, hands covered in grease.' },
      { name: 'Hammer Girl', blurb: 'Was baking cookies for the picnic, stepped away once for two minutes.' },
      { name: 'Bat Thief', blurb: 'A treasure-loving bat who dropped by "just to visit".' }
    ],
    part1: [
      'It was a sunny afternoon on Angel Island, and the red knuckle-brawler was hosting a picnic to celebrate winning first place in the Zone Games. His prize was a shiny green medal shaped like a tiny Master Emerald, and he could not stop showing it off.',
      '"Just do not lose it," the sidekick laughed, wiping grease off his hands from fixing his biplane engine.',
      'The brawler placed the medal carefully inside his backpack and set the backpack down next to the picnic blanket. Hammer Girl was busy setting out a plate of fresh cookies, and the Bat Thief had swooped in to say hello, eyeing the shiny trophy the whole time.',
      'A little while later, Hammer Girl got up to refill the water pitcher. When she came back just two minutes later, everyone sat down to eat.',
      'That is when the brawler reached for his backpack to show the medal to a new visitor, and found it completely empty.'
    ],
    checkpoint: [
      { q: 'What was the prize the brawler won?', choices: ['A gold cup', 'A green medal shaped like a tiny Master Emerald', 'A ring', 'A pickaxe'], answer: 1 },
      { q: 'What was the sidekick doing before the medal disappeared?', choices: ['Baking cookies', 'Fixing his biplane engine', 'Sleeping', 'Flying a kite'], answer: 1 },
      { q: 'How long was Hammer Girl away from the picnic?', choices: ['Two minutes', 'Two hours', 'All afternoon', 'She never left'], answer: 0 }
    ],
    part2: [
      '"Someone took my medal!" the brawler shouted. Everyone gathered around the empty backpack to investigate.',
      'Right next to the backpack, in the soft dirt, was a single shiny bootprint, the kind made by tall boots, not sneakers or sandals.',
      'The sidekick held up his hands. "It was not me. Look, I have had grease all over my fingers all day. I could not have opened that zipper without leaving a mark, and the zipper is spotless."',
      'Hammer Girl shook her head too. "I was only gone two minutes to get water. Three of you saw me the whole rest of the time."',
      'The Bat Thief examined her own boots and smiled slyly. "Well, I certainly do love shiny things..."'
    ],
    clues: [
      'A shiny bootprint was found in the dirt next to the backpack.',
      'The sidekick had grease on his hands all day, but the zipper had NO grease marks on it.',
      'Hammer Girl was seen by three friends the entire time, except for two minutes.',
      'The Bat Thief loves shiny treasures and was near the backpack the whole visit.'
    ],
    grid: {
      cols: ['Wears tall boots?', 'Time alone with bag?', 'Evidence matches?'],
      rows: ['Sidekick', 'Hammer Girl', 'Bat Thief'],
      solution: { 'Sidekick': ['X', 'X', 'X'], 'Hammer Girl': ['X', 'O', 'X'], 'Bat Thief': ['O', 'O', 'O'] }
    },
    verdict: { q: 'Who took the medal?', choices: ['Sidekick', 'Hammer Girl', 'Bat Thief'], answer: 2,
      explain: 'Tall boots left the print, and only the Bat Thief wears them. The greasy hands cleared the sidekick, and witnesses cleared Hammer Girl.' },
    followup: [
      { q: 'Which clue rules out the sidekick the fastest?', choices: ['He loves treasure', 'The zipper had no grease on it', 'He was away two minutes', 'He wears tall boots'], answer: 1,
        explain: 'If greasy hands had opened it, the zipper would be smudged. It was spotless.' }
    ]
  },

  {
    id: 'case2',
    title: 'The Broken Enchanted Pickaxe',
    difficulty: 'Junior Detective Case',
    hero: 'miner',
    suspects: [
      { name: 'Miner Alex', blurb: 'Mining in the Deepslate Caves all night, far from the village.' },
      { name: 'Wandering Trader', blurb: 'Passing through the village that day with his llamas.' },
      { name: 'Cousin Max', blurb: "Blocky's curious cousin, visiting for the weekend." },
      { name: 'Blacksmith', blurb: 'A villager who repairs tools sometimes.' }
    ],
    part1: [
      'Blocky had just enchanted his brand new diamond pickaxe with Efficiency, making it mine blocks faster than ever before. He set it carefully on his crafting table before heading to bed, excited to use it in the morning.',
      'That weekend, his cousin Max was visiting from another village. Max had never seen an enchanted tool before and kept asking if he could hold the sparkly pickaxe.',
      '"Maybe tomorrow," Blocky said with a yawn. "Let us get some sleep first."',
      'The next morning, Blocky walked into his house and gasped. His pickaxe was lying on the floor, snapped clean in half. Scattered nearby was a strange black dust that sparkled faintly in the light.',
      '"Obsidian dust," Blocky whispered. "But I do not have any obsidian near my house..."'
    ],
    checkpoint: [
      { q: 'What enchantment did Blocky put on his pickaxe?', choices: ['Fortune', 'Efficiency', 'Sharpness', 'Silk Touch'], answer: 1 },
      { q: 'Who was visiting Blocky that weekend?', choices: ['The Trader', 'Cousin Max', 'Miner Alex', 'The Blacksmith'], answer: 1 },
      { q: 'What strange substance was found near the broken pickaxe?', choices: ['Redstone dust', 'Obsidian dust', 'Sand', 'Snow'], answer: 1 }
    ],
    part2: [
      'Blocky gathered everyone who had been near the village that night to ask questions.',
      'Miner Alex arrived with mud caked all over her boots. "I was mining in the Deepslate Caves all night," she said. "Ask anyone. There is no obsidian down there, just deepslate and mud."',
      'The Wandering Trader had already left the village before sunset. A nearby villager confirmed watching him walk out the front gate with his llamas hours before the pickaxe was found broken.',
      'The Blacksmith shrugged. "You know villagers cannot hold player tools. I could not have used it even if I wanted to."',
      'That left Max, who was suspiciously quiet. Blocky noticed obsidian dust on the bottom of Max\'s shoes, and remembered that the Nether portal behind his house was made of obsidian blocks.'
    ],
    clues: [
      'Obsidian dust was found near the broken pickaxe.',
      'Alex had cave mud on her boots, not obsidian dust, and she has an alibi.',
      'The Trader left the village hours before the pickaxe was found broken.',
      'Villagers physically cannot hold or use player tools.',
      'Max had obsidian dust on his shoes and had asked to hold the pickaxe earlier that day.'
    ],
    grid: {
      cols: ['Has an alibi?', 'Could use the tool?', 'Evidence matches?'],
      rows: ['Miner Alex', 'Wandering Trader', 'Cousin Max', 'Blacksmith'],
      solution: { 'Miner Alex': ['O', 'O', 'X'], 'Wandering Trader': ['O', 'O', 'X'], 'Cousin Max': ['X', 'O', 'O'], 'Blacksmith': ['X', 'X', 'X'] }
    },
    verdict: { q: 'Who broke the pickaxe?', choices: ['Miner Alex', 'Wandering Trader', 'Cousin Max', 'Blacksmith'], answer: 2,
      explain: 'Obsidian dust on his shoes matches the dust at the scene, he wanted to hold the pickaxe, and he had no alibi.' },
    followup: [
      { q: 'Was this on purpose, or an accident?', choices: ['On purpose, to be mean', 'Probably an accident while trying it out', 'Nobody can ever know'], answer: 1,
        explain: 'He was curious, not cruel. Motive matters: wanting to try something is different from wanting to break it.' },
      { q: 'Why could the Blacksmith not be the culprit?', choices: ['He was asleep', 'Villagers cannot hold player tools', 'He was out of town', 'He has no hands'], answer: 1,
        explain: 'That is a rule about what is POSSIBLE, which is even stronger than an alibi.' }
    ]
  },

  {
    id: 'case3',
    title: 'The Copycat Web-Slinger',
    difficulty: 'Ace Detective Case',
    hero: 'webhero',
    suspects: [
      { name: 'Flash', blurb: "A classmate who brags he could prove Web is a fraud." },
      { name: 'Illusion Man', blurb: 'A villain known for illusions and trick photography.' },
      { name: 'Betty', blurb: 'A newspaper intern eager to find a big story.' },
      { name: 'Street Performer', blurb: 'Dresses as Web near the high school for tips.' }
    ],
    part1: [
      'The city newspaper had just printed a shocking headline: "WEB GONE ROGUE?" Someone had submitted photos showing a figure in a red-and-blue suit knocking over trash cans and scaring pigeons downtown.',
      'Peter was stunned. He knew he had not done any of that. He had been busy stopping an actual robbery across town at the exact same time one of the photos was taken.',
      '"Someone is trying to make Web look bad," Peter said to his friend Ned. "But who?"',
      'They made a list of people who might want to embarrass Web: Flash, who was always bragging he could prove Web was a fraud; the Illusion Man, a villain known for using illusions and trick photography; and even Betty, the new intern at the paper who was eager to find a big story.'
    ],
    checkpoint: [
      { q: 'What was the headline in the newspaper?', choices: ['"WEB GONE ROGUE?"', '"WEB SAVES THE DAY"', '"CITY UNDER ATTACK"', '"MISSING MEDAL"'], answer: 0 },
      { q: 'What was Peter actually doing when one of the fake photos was taken?', choices: ['Sleeping', 'Stopping a robbery across town', 'Taking photos', 'In detention'], answer: 1 },
      { q: 'Name one person on the suspect list.', choices: ['Blocky', 'Flash', 'Volt', 'Hammer Girl'], answer: 1 }
    ],
    part2: [
      'Peter examined the photos closely, thinking hard about each suspect.',
      'Flash had actually been in detention with the entire class as witnesses during two of the exact times the photos were taken, a full room of alibis.',
      "The Illusion Man's illusions always looked shimmery and glitchy, like a hologram, but these photos were perfectly ordinary and clear, not illusions at all.",
      'Betty had been at her desk the whole time, and three coworkers confirmed it. Besides, she wanted GOOD stories about Web, not fake bad ones. That would not help her career at all.',
      'Then Peter noticed something: all the fake photos were taken in the same two blocks near the high school. A group of neighborhood kids mentioned a street performer who dressed up as Web for tips, practicing flips and jumps in that exact area.',
      'When Peter compared the suit in the photo closely, the red was a slightly different shade, and the web pattern did not quite match his own suit.'
    ],
    clues: [
      'Flash had a full-classroom alibi during two of the photo times.',
      "The Illusion Man's usual method (illusions) does not match the ordinary, clear photos.",
      'Betty was seen at her desk with witnesses, and had no real motive.',
      'All fake photos were taken in the same two blocks near the high school.',
      "The suit's red color and web pattern do not exactly match the real suit."
    ],
    grid: {
      cols: ['Has alibi?', 'Method matches?', 'Location matches?', 'Motive makes sense?'],
      rows: ['Flash', 'Illusion Man', 'Betty', 'Street Performer'],
      solution: {
        'Flash': ['O', 'X', 'X', 'O'],
        'Illusion Man': ['X', 'X', 'X', 'O'],
        'Betty': ['O', 'X', 'X', 'X'],
        'Street Performer': ['X', 'O', 'O', 'O']
      }
    },
    verdict: { q: 'Who was behind the fake photos?', choices: ['Flash', 'Illusion Man', 'Betty', 'Street Performer'], answer: 3,
      explain: 'The photos came from the exact two blocks where the performer works, the suit is a near-copy but not exact, and everyone else had an alibi or the wrong method.' },
    followup: [
      { q: 'Was the performer trying to be evil?', choices: ['Yes, pure evil', 'Probably not. He may have been showing off or making money, not plotting', 'He was framed'], answer: 1,
        explain: 'Good detectives separate WHAT happened from WHY. Not every wrong thing comes from a villain.' },
      { q: 'What TWO things about the suit gave it away?', choices: ['The mask and the boots', 'The shade of red and the web pattern', 'The gloves and the belt', 'The color of the eyes'], answer: 1,
        explain: 'Tiny details other people skip: that is a detective superpower.' }
    ]
  }
];

export const MASTER_CHALLENGE = {
  id: 'master',
  title: 'Master Detective Memory Challenge',
  blurb: 'No peeking. Answer from what you remember across ALL three cases.',
  items: [
    { q: 'Who actually stole the emerald medal?', choices: ['Sidekick', 'Hammer Girl', 'Bat Thief', 'The brawler'], answer: 2 },
    { q: 'What piece of evidence was found in the dirt?', choices: ['A feather', 'A shiny bootprint', 'A ring', 'A cookie'], answer: 1 },
    { q: 'Who broke the enchanted pickaxe?', choices: ['Miner Alex', 'Cousin Max', 'The Trader', 'The Blacksmith'], answer: 1 },
    { q: 'Why could the Blacksmith not be the culprit?', choices: ['He was asleep', 'Villagers cannot hold player tools', 'He lives far away', 'He had no motive'], answer: 1 },
    { q: 'Who was really behind the fake photos?', choices: ['Flash', 'Betty', 'The Illusion Man', 'The Street Performer'], answer: 3 },
    { q: 'What two things about the suit gave it away?', choices: ['Shade of red and web pattern', 'Boots and gloves', 'Mask and belt', 'Size and smell'], answer: 0 },
    { q: 'In all three cases, at least one suspect was ruled out because they had an ______.', choices: ['excuse', 'alibi', 'idea', 'apology'], answer: 1 }
  ]
};
