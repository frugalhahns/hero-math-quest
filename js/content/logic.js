/* Logic Lab: patterns, comparisons, odd-one-out, a logic grid, sequencing,
   and if-then reasoning. Built from the workbook's Logic & Reasoning chapter
   with extra items added so it can be replayed. */

export const LOGIC = {
  pattern: {
    label: 'Pattern Detective',
    icon: 'brain',
    blurb: 'Find the rule, then say what comes next.',
    items: [
      { id: 'p1', kind: 'seq2', seq: [2, 4, 6, 8], answers: [10, 12], rule: 'counting by 2s',
        prompt: 'Dash collects rings in this order.' },
      { id: 'p2', kind: 'seq2', seq: [5, 10, 15, 20], answers: [25, 30], rule: 'counting by 5s',
        prompt: 'Capture balls are stacked like this.' },
      { id: 'p3', kind: 'seq2', seq: [100, 90, 80, 70], answers: [60, 50], rule: 'counting DOWN by 10s',
        prompt: "Blocky's health bar drops like this." },
      { id: 'p4', kind: 'seq2', seq: [1, 2, 4, 8], answers: [16, 32], rule: 'doubling each time',
        prompt: "Web's web count doubles every swing." },
      { id: 'p5', kind: 'choice', prompt: 'Shape pattern: circle, triangle, circle, triangle, circle ... what are the next two?',
        choices: ['triangle, circle', 'circle, circle', 'triangle, triangle', 'circle, triangle'],
        answer: 0, explain: 'It alternates every time, so triangle comes next, then circle.' },
      { id: 'p6', kind: 'seq2', seq: [3, 6, 9, 12], answers: [15, 18], rule: 'counting by 3s',
        prompt: 'Emeralds appear in this order.' },
      { id: 'p7', kind: 'seq2', seq: [7, 14, 21, 28], answers: [35, 42], rule: 'counting by 7s',
        prompt: 'Gym badges are handed out like this.' },
      { id: 'p8', kind: 'seq2', seq: [64, 32, 16, 8], answers: [4, 2], rule: 'cutting in half each time',
        prompt: 'A stack of blocks keeps splitting in half.' },
      { id: 'p9', kind: 'seq2', seq: [1, 4, 9, 16], answers: [25, 36], rule: 'square numbers: 1x1, 2x2, 3x3, 4x4 ...',
        prompt: 'Tricky one. Square platforms grow like this.' },
      { id: 'p10', kind: 'seq2', seq: [1, 1, 2, 3, 5, 8], answers: [13, 21], rule: 'add the two numbers before it',
        prompt: 'Super tricky. Each number is built from the two before it.' }
    ]
  },

  compare: {
    label: "Who's First?",
    icon: 'crown',
    blurb: 'Line them up from the clues. No math needed, just careful thinking.',
    items: [
      { id: 'c1', kind: 'choice', prompt: 'Dash is faster than the sidekick. The sidekick is faster than the red knuckle-brawler. Who is the FASTEST?',
        choices: ['Dash', 'The sidekick', 'The knuckle-brawler', 'Cannot tell'], answer: 0,
        explain: 'Dash beats the sidekick, and the sidekick beats the brawler, so Dash is on top.' },
      { id: 'c2', kind: 'choice', prompt: 'Same clues: Dash > sidekick > knuckle-brawler. Who is the SLOWEST?',
        choices: ['Dash', 'The sidekick', 'The knuckle-brawler', 'Cannot tell'], answer: 2,
        explain: 'The brawler loses to the sidekick, who loses to Dash. Bottom of the list.' },
      { id: 'c3', kind: 'choice', prompt: 'The fire lizard is bigger than the electric mouse. The sleepy giant is bigger than the fire lizard. Which is BIGGEST?',
        choices: ['The electric mouse', 'The fire lizard', 'The sleepy giant', 'They tie'], answer: 2,
        explain: 'The giant beats the lizard, and the lizard beats the mouse.' },
      { id: 'c4', kind: 'choice', prompt: 'Blocky has more diamonds than the other miner. The other miner has more than the little brother. Who has the FEWEST?',
        choices: ['Blocky', 'The other miner', 'The little brother', 'Cannot tell'], answer: 2,
        explain: 'The little brother is under both of them.' },
      { id: 'c5', kind: 'choice', prompt: 'Web swings higher than the goblin glides. The goblin glides higher than the octopus villain jumps. Who goes the LOWEST?',
        choices: ['Web', 'The goblin', 'The octopus villain', 'Cannot tell'], answer: 2,
        explain: 'The octopus villain is below the goblin, who is below Web.' },
      { id: 'c6', kind: 'choice', prompt: 'Zone 2 is longer than Zone 1. Zone 3 is shorter than Zone 1. Which zone is the LONGEST?',
        choices: ['Zone 1', 'Zone 2', 'Zone 3', 'Cannot tell'], answer: 1,
        explain: 'Zone 2 beats Zone 1, and Zone 1 already beats Zone 3.' },
      { id: 'c7', kind: 'choice', prompt: 'Mia scored more points than Jake. Sam scored more points than Mia. Who is in the MIDDLE?',
        choices: ['Mia', 'Jake', 'Sam', 'Cannot tell'], answer: 0,
        explain: 'Order is Sam, then Mia, then Jake. Mia is the middle one.' },
      { id: 'c8', kind: 'choice', prompt: 'A creeper is scarier than a zombie. A zombie is scarier than a chicken. Is a creeper scarier than a chicken?',
        choices: ['Yes', 'No', 'Cannot tell from these clues'], answer: 0,
        explain: 'If A beats B and B beats C, then A beats C. That chain is called transitivity.' }
    ]
  },

  odd: {
    label: 'Odd One Out',
    icon: 'magnifier',
    blurb: 'Circle the one that does NOT belong, and know WHY.',
    items: [
      { id: 'o1', kind: 'choice', prompt: 'Which does NOT belong?', choices: ['Dash', 'The sidekick fox', 'The knuckle-brawler', 'The electric mouse'],
        answer: 3, explain: 'The other three are from the speedster world. The electric mouse is a pocket creature.' },
      { id: 'o2', kind: 'choice', prompt: 'Which does NOT belong?', choices: ['Diamond', 'Emerald', 'Gold', 'Cow'],
        answer: 3, explain: 'The others are things you mine. A cow is an animal.' },
      { id: 'o3', kind: 'choice', prompt: 'Which does NOT belong?', choices: ['Web the wall-crawler', 'The goblin', 'The octopus villain', 'A creature trainer'],
        answer: 3, explain: 'The other three are from the wall-crawler world.' },
      { id: 'o4', kind: 'choice', prompt: 'Which does NOT belong?', choices: ['Electric mouse', 'Fire lizard', 'Leaf turtle', 'Creeper'],
        answer: 3, explain: 'The others are pocket creatures. A creeper is from the block world.' },
      { id: 'o5', kind: 'choice', prompt: 'Which does NOT belong?', choices: ['Sword', 'Pickaxe', 'Shovel', 'Capture ball'],
        answer: 3, explain: 'The others are block-world tools.' },
      { id: 'o6', kind: 'choice', prompt: 'Which does NOT belong?', choices: ['2', '4', '7', '10'],
        answer: 2, explain: '7 is odd. The rest are even.' },
      { id: 'o7', kind: 'choice', prompt: 'Which does NOT belong?', choices: ['Ring', 'Coin', 'Emerald', 'Ladder'],
        answer: 3, explain: 'The others are things you collect for value. A ladder is for climbing.' },
      { id: 'o8', kind: 'choice', prompt: 'Which does NOT belong?', choices: ['Running', 'Swinging', 'Flying', 'Sleeping'],
        answer: 3, explain: 'The others are ways to move. Sleeping is staying still.' },
      { id: 'o9', kind: 'choice', prompt: 'Which does NOT belong?', choices: ['9', '16', '25', '30'],
        answer: 3, explain: '9, 16 and 25 are square numbers (3x3, 4x4, 5x5). 30 is not.' }
    ]
  },

  grid: {
    label: 'Logic Grid Mystery',
    icon: 'magnifier',
    blurb: 'Cross off what CANNOT be true until only one answer is left.',
    items: [
      { id: 'g1', kind: 'grid',
        prompt: 'Three friends each caught a different type: Fire, Water, or Grass.',
        rows: ['Mia', 'Jake', 'Sam'],
        cols: ['Fire', 'Water', 'Grass'],
        clues: ['Mia did NOT catch a Water type.', 'Jake caught a Fire type.', 'Sam did NOT catch a Grass type.'],
        solution: { Mia: 'Grass', Jake: 'Fire', Sam: 'Water' },
        explain: 'Jake is Fire (given). Mia is not Water and Fire is taken, so Mia is Grass. That leaves Water for Sam, which also fits clue 3.' },
      { id: 'g2', kind: 'grid',
        prompt: 'Three heroes each grabbed a different item: Ring, Pickaxe, or Web-shooter.',
        rows: ['Dash', 'Blocky', 'Web'],
        cols: ['Ring', 'Pickaxe', 'Web-shooter'],
        clues: ['Web never uses a pickaxe.', 'Dash grabbed the Ring.', 'Blocky did NOT take the Web-shooter.'],
        solution: { Dash: 'Ring', Blocky: 'Pickaxe', Web: 'Web-shooter' },
        explain: 'Dash has the Ring. Blocky is not the Web-shooter, so Blocky is the Pickaxe. Web gets the Web-shooter, which fits clue 1.' },
      { id: 'g3', kind: 'grid',
        prompt: 'Three friends each ate a different snack: Apple, Cookie, or Cake.',
        rows: ['Ana', 'Ben', 'Cruz'],
        cols: ['Apple', 'Cookie', 'Cake'],
        clues: ['Ana hates cake.', 'Cruz ate the cookie.', 'Ben did NOT eat the apple.'],
        solution: { Ana: 'Apple', Ben: 'Cake', Cruz: 'Cookie' },
        explain: 'Cruz has the cookie. Ben is not the apple and not the cookie, so Ben has cake. Ana gets the apple, which fits clue 1.' }
    ]
  },

  order: {
    label: 'Put It In Order',
    icon: 'brain',
    blurb: 'Tap the events in the order they really happen.',
    items: [
      { id: 'or1', kind: 'order', prompt: "Dash's day. Tap them in order.",
        correct: ['Dash wakes up in Green Hill Zone', 'Dash runs and collects rings', 'Dash defeats the egg villain', 'Dash takes a nap after the battle'] },
      { id: 'or2', kind: 'order', prompt: "Blocky's build. Tap them in order.",
        correct: ['Blocky draws a plan for the house', 'Blocky gathers wood from the forest', 'Blocky crafts blocks at the crafting table', 'Blocky places the blocks to build the house'] },
      { id: 'or3', kind: 'order', prompt: 'Photo day. Tap them in order.',
        correct: ['Peter climbs onto the rooftop', 'Web swings past chasing a truck', 'Peter snaps the perfect picture', 'The photo is printed in the paper'] },
      { id: 'or4', kind: 'order', prompt: 'Catching a creature. Tap them in order.',
        correct: ['Walk into the tall grass', 'A wild creature appears', 'Throw a capture ball', 'Add it to your team'] },
      { id: 'or5', kind: 'order', prompt: 'Mining trip. Tap them in order.',
        correct: ['Pack torches and bread', 'Walk into the dark cave', 'Place torches along the tunnel', 'Mine the diamonds you spot'] }
    ]
  },

  ifthen: {
    label: 'If This, Then That',
    icon: 'brain',
    blurb: 'Read the rule carefully. Some of these are sneaky.',
    items: [
      { id: 'i1', kind: 'choice', prompt: 'RULE: If it rains, the trainer wears his raincoat. Today it is raining. What will he wear?',
        choices: ['His raincoat', 'Nothing special', 'You cannot tell'], answer: 0,
        explain: 'The rule fires because the "if" part came true.' },
      { id: 'i2', kind: 'numeric', prompt: 'RULE: If Blocky finds a diamond, he gets 10 points. Blocky finds 3 diamonds. How many points?',
        answer: 30, explain: '10 points, 3 times: 10 x 3 = 30.' },
      { id: 'i3', kind: 'choice', prompt: 'RULE: If a creature is a Water type, it is weak to Electric attacks. The turtle is a Water type. Is it weak to Electric?',
        choices: ['Yes', 'No', 'You cannot tell'], answer: 0,
        explain: 'It is a Water type, so the rule applies to it.' },
      { id: 'i4', kind: 'choice', prompt: 'EXTRA TRICKY. RULE: If Web is nearby, you might hear web-shooters clicking. You hear a clicking sound. Is Web DEFINITELY nearby?',
        choices: ['Yes, definitely', 'No, not definitely. Other things click too', 'Web is never nearby'], answer: 1,
        explain: 'A clue can be a HINT without being PROOF. Lots of things click. Great detectives notice that difference.' },
      { id: 'i5', kind: 'choice', prompt: 'RULE: If the sun is down, creepers come out. The sun is still up. What do you know about creepers?',
        choices: ['They are definitely out', 'The rule says nothing about right now', 'They are gone forever'], answer: 1,
        explain: 'The rule only tells you what happens when the sun IS down. It says nothing about daytime.' },
      { id: 'i6', kind: 'numeric', prompt: 'RULE: Every 5 rings gives 1 extra life. Dash has 35 rings. How many extra lives?',
        answer: 7, explain: '35 / 5 = 7.' },
      { id: 'i7', kind: 'choice', prompt: 'RULE: All emeralds are green. This block is green. Is it definitely an emerald?',
        choices: ['Yes', 'No. Green things can be other blocks too', 'Only on Tuesdays'], answer: 1,
        explain: 'Flipping a rule backwards does not work. Grass is green too.' },
      { id: 'i8', kind: 'numeric', prompt: 'RULE: Each web-shot uses 2 units of web fluid. Web has 18 units. How many shots can he fire?',
        answer: 9, explain: '18 / 2 = 9.' }
    ]
  }
};

export const LOGIC_KEYS = Object.keys(LOGIC);
