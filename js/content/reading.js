/* Story Zone: quick read-and-answer drills plus full stories with
   RECALL / SEQUENCE / INFER / VOCAB / MAIN IDEA questions.
   Adapted from the workbook's reading comprehension chapter. */

export const QUICK = {
  label: 'Quick Read Drills',
  blurb: 'Read it once. Answer fast. Build reading speed.',
  items: [
    { id: 'q1', text: 'Dash ran so fast that a cloud of dust followed behind him the whole way down the hill.',
      q: 'What followed behind Dash?', choices: ['A cloud of dust', 'A robot', 'His sidekick', 'A ring'], answer: 0 },
    { id: 'q2', text: 'Blocky placed the last torch in the cave. Now it was bright enough to see the diamonds sparkling in the wall.',
      q: 'Why could Blocky see the diamonds?', choices: ['The sun came up', 'He put up torches, so it was bright', 'He was wearing goggles', 'The diamonds were glowing'], answer: 1 },
    { id: 'q3', text: 'Peter checked his camera one more time before Web swung past. He wanted the picture to be perfect.',
      q: 'What did Peter want?', choices: ['A new camera', 'A perfect picture', 'To go home', 'To meet the goblin'], answer: 1 },
    { id: 'q4', text: 'The trainer reached into his bag, but it was empty. He had used his last capture ball on a wild water turtle.',
      q: 'Why was the bag empty?', choices: ['He forgot to pack it', 'Someone stole it', 'He used his last ball on the turtle', 'It had a hole in it'], answer: 2 },
    { id: 'q5', text: 'The sidekick built a small plane using scrap metal he found in the villain’s old, abandoned base.',
      q: 'Where did he find the scrap metal?', choices: ['At a store', "In the villain's abandoned base", 'In the ocean', 'In his workshop'], answer: 1 },
    { id: 'q6', text: 'A miner placed a torch every ten steps so she would not get lost in the dark cave.',
      q: 'Why did she place torches every ten steps?', choices: ['To scare mobs', 'So she would not get lost', 'To cook food', 'To melt ice'], answer: 1 },
    { id: 'q7', text: 'The goblin cackled and flew off on his glider, leaving a trail of green smoke behind him.',
      q: 'What did the goblin leave behind?', choices: ['A trail of green smoke', 'A pumpkin bomb', 'His glider', 'A note'], answer: 0 },
    { id: 'q8', text: "The electric mouse's cheeks sparked with electricity whenever it got excited or surprised.",
      q: 'When did its cheeks spark?', choices: ['When it slept', 'When it got excited or surprised', 'Only at night', 'When it was hungry'], answer: 1 },
    { id: 'q9', text: 'First, Dash tied his shoes. Then he stretched his legs. Finally, he took off running through the zone.',
      q: 'What did Dash do FIRST?', choices: ['Stretched his legs', 'Started running', 'Tied his shoes', 'Collected rings'], answer: 2 },
    { id: 'q10', text: 'Blocky was exhausted after mining for three hours straight, so he decided to build a bed and rest.',
      q: 'Why did Blocky build a bed?', choices: ['He was exhausted', 'He was hungry', 'It was raining', 'To trade it'], answer: 0 },
    { id: 'q11', text: 'The sleepy giant is enormous, taking up almost the entire road while it naps.',
      q: '"Enormous" means:', choices: ['very small', 'very large', 'very fast', 'very loud'], answer: 1 },
    { id: 'q12', text: 'The trainer felt nervous as he lifted the ball to send out his first creature in the tournament.',
      q: 'How did the trainer feel?', choices: ['Bored', 'Angry', 'Nervous', 'Sleepy'], answer: 2 },
    { id: 'q13', text: 'The bridge creaked under Blocky’s feet. He backed up slowly and looked for another way across the ravine.',
      q: 'Why did Blocky back up?', choices: ['He forgot something', 'The bridge sounded unsafe', 'He saw a friend', 'He was tired'], answer: 1 },
    { id: 'q14', text: 'Web reached the rooftop just as the sirens faded into the distance. He had missed the whole thing.',
      q: 'What can you tell about Web?', choices: ['He arrived too late', 'He stopped the crime', 'He called the police', 'He was asleep'], answer: 0 },
    { id: 'q15', text: 'The rival trainer smirked. "Your team is no match for mine," he said, tossing a ball into the air.',
      q: 'What does "smirked" tell you about him?', choices: ['He felt sad', 'He felt confident and a little smug', 'He was confused', 'He was scared'], answer: 1 },
    { id: 'q16', text: 'Dash skidded to a stop at the edge of the cliff, gravel spraying out over the drop below.',
      q: 'What almost happened?', choices: ['He almost ran off the cliff', 'He almost won a race', 'He almost fell asleep', 'He almost lost a ring'], answer: 0 }
  ]
};

export const STORIES = [
  {
    id: 's1',
    title: 'The Ring Toss Challenge',
    level: 'Grade 3',
    hero: 'speedster',
    paras: [
      'Dash loved to run fast. One sunny morning, he challenged his best friend, the two-tailed sidekick, to a ring-collecting race through three zones. Whoever collected the most rings would win a shiny gold medal.',
      '"Ready, set, go!" shouted the sidekick.',
      'Dash zoomed off immediately, blazing through Zone One so fast that he missed half the rings hidden behind the rocks. In Zone Two, he ran even faster, barely slowing down to grab anything.',
      'The sidekick, on the other hand, moved carefully. He checked behind every rock and under every bush. It took him longer, but he collected every single ring in each zone.',
      'When they both reached the finish line, Dash was sure he had won. But when they counted the rings, the sidekick had collected 45, and Dash had only collected 28.',
      '"How did you beat me?" Dash asked, surprised.',
      '"You were fast," the sidekick said with a smile, "but I was thorough. Sometimes going slow and careful wins the race."',
      'Dash laughed and gave the sidekick the gold medal. From that day on, Dash tried to slow down just a little, so he would not miss anything important.'
    ],
    questions: [
      { tag: 'RECALL', q: 'How many rings did the sidekick collect?', choices: ['28', '45', '30', '17'], answer: 1 },
      { tag: 'SEQUENCE', q: 'What did Dash do right after the sidekick yelled "Ready, set, go"?', choices: ['He tied his shoes', 'He zoomed off through Zone One', 'He counted his rings', 'He took a nap'], answer: 1 },
      { tag: 'INFER', q: 'Why did Dash miss so many rings in Zone One?', choices: ['The rings were invisible', 'He was going too fast to notice rings behind the rocks', 'The sidekick took them first', 'He did not want them'], answer: 1 },
      { tag: 'VOCAB', q: 'In this story, "thorough" means:', choices: ['fast', 'careful and complete', 'lazy', 'lucky'], answer: 1 },
      { tag: 'MAIN IDEA', q: 'What is the lesson of this story?', choices: ['Always run as fast as you can', 'Going slow and careful can beat rushing', 'Medals do not matter', 'Never race your friends'], answer: 1 },
      { tag: 'MATH', q: 'How many MORE rings did the sidekick collect than Dash?', choices: ['17', '13', '27', '73'], answer: 0 }
    ]
  },
  {
    id: 's2',
    title: 'A Night in the Cave',
    level: 'Grade 3',
    hero: 'miner',
    paras: [
      'One evening, Blocky decided to explore a deep cave before the sun went down. He packed his pickaxe, some bread, and a stack of torches. As he walked deeper into the tunnel, it grew dark, so he placed a torch every ten steps to light his way.',
      'Suddenly, Blocky heard a soft hissing sound behind him. He spun around just in time to see a creeper creeping closer. His heart pounded, but he remembered what his friend had taught him: never let a creeper get too close. He backed away quickly and tossed a snowball to scare it off.',
      'With the creeper gone, Blocky kept exploring. Deep in the cave, his torchlight caught something sparkling in the wall. Diamonds. He carefully mined eight diamond blocks and placed them safely in his inventory.',
      'On his way back home, Blocky smiled to himself. If he had not packed enough torches, he might have gotten lost in the dark. And if he had not remembered the advice about creepers, he might not have made it out safely.',
      'Being prepared, Blocky realized, was just as important as being brave.'
    ],
    questions: [
      { tag: 'RECALL', q: 'What three things did Blocky pack?', choices: ['Pickaxe, bread, torches', 'Sword, water, map', 'Boat, bread, torches', 'Pickaxe, shield, cake'], answer: 0 },
      { tag: 'SEQUENCE', q: 'What happened right BEFORE Blocky found the diamonds?', choices: ['He packed his bag', 'He scared off the creeper', 'He went home', 'He built a bed'], answer: 1 },
      { tag: 'INFER', q: 'Why did Blocky place a torch every ten steps?', choices: ['To cook his bread', 'So he would not get lost in the dark', 'To melt the walls', 'To signal his friend'], answer: 1 },
      { tag: 'VOCAB', q: 'In this story, "creeping" means:', choices: ['running loudly', 'moving slowly and quietly', 'flying', 'shouting'], answer: 1 },
      { tag: 'MAIN IDEA', q: 'What did Blocky learn by the end?', choices: ['Caves are boring', 'Being prepared matters as much as being brave', 'Never mine diamonds', 'Snowballs are useless'], answer: 1 },
      { tag: 'MATH', q: 'If each diamond block is worth 5 emeralds, what are his 8 blocks worth?', choices: ['13', '40', '35', '48'], answer: 1 }
    ]
  },
  {
    id: 's3',
    title: 'Photo Day',
    level: 'Grade 3',
    hero: 'webhero',
    paras: [
      'Peter had one big problem: his photography assignment for the school newspaper was due tomorrow, and he still needed a great picture of Web in action.',
      'After school, Peter climbed onto a rooftop with his camera, hoping to catch a glimpse of the web-slinging hero. He waited, and waited, but nothing happened. The sun was starting to set, and Peter began to worry he would miss his deadline.',
      'Just as he was about to give up, he heard a familiar whoosh. Web swung past, chasing a runaway delivery truck that had lost its brakes. Peter snapped picture after picture as Web leaped from building to building, finally stopping the truck just before it reached a busy street.',
      'Peter looked at his camera screen and grinned. He had captured the perfect shot: Web in mid-air, arms stretched wide, city lights glowing behind him.',
      'Racing home, Peter emailed the photo to his teacher with ten minutes to spare. The next day, his picture was printed on the front page of the school newspaper, with the headline: "Web Saves the Day, Again!"',
      'Peter smiled. Sometimes, patience really did pay off.'
    ],
    questions: [
      { tag: 'RECALL', q: 'What was Web chasing?', choices: ['A runaway delivery truck', 'The goblin', 'A taxi', 'A pigeon'], answer: 0 },
      { tag: 'SEQUENCE', q: 'What did Peter do right AFTER taking the perfect picture?', choices: ['Climbed the rooftop', 'Raced home and emailed the photo', 'Went to sleep', 'Bought a new camera'], answer: 1 },
      { tag: 'INFER', q: 'Why did Peter feel worried on the rooftop?', choices: ['He was afraid of heights', 'He was running out of time before his deadline', 'He lost his camera', 'It was raining'], answer: 1 },
      { tag: 'VOCAB', q: 'In this story, "glimpse" means:', choices: ['a long look', 'a short, quick look', 'a loud noise', 'a photograph'], answer: 1 },
      { tag: 'MAIN IDEA', q: 'What is the message of this story?', choices: ['Cameras are expensive', 'Patience pays off', 'Never do homework', 'Trucks are dangerous'], answer: 1 },
      { tag: 'MATH', q: 'Peter emailed it with 10 minutes to spare at 8:50 pm. When was the deadline?', choices: ['8:40 pm', '9:00 pm', '9:10 pm', '8:00 pm'], answer: 1 }
    ]
  },
  {
    id: 's4',
    title: 'The Tournament Trade',
    level: 'Grade 4 stretch',
    hero: 'sparkmouse',
    paras: [
      'Rosa had trained for the regional tournament for six months. Her team was strong, but everyone in the stadium was whispering about one problem: her lead creature, a small electric mouse named Volt, was badly matched against the champion’s ground-type team. Electric attacks barely scratch a ground type.',
      'The night before the final, another trainer offered Rosa a trade. "Give me Volt," he said, "and I will give you a powerful water serpent. You will actually have a chance tomorrow." It was, on paper, a much better creature.',
      'Rosa thought about it for a long time. She looked at Volt, asleep on her backpack, cheeks faintly sparking the way they always did when he dreamed. They had lost their first eleven battles together. They had also won their last twenty-three.',
      '"No thanks," Rosa said.',
      'The final was brutal. Volt was knocked back twice, and Rosa heard the crowd groan. But Volt knew a trick that no ground type expected: instead of attacking, he sprinted circles around the arena until the champion’s heavy creature was too tired to move, then finished the battle with one clean hit.',
      'Afterward, a reporter asked Rosa why she had turned down a stronger creature. Rosa shrugged. "A stronger creature is not the same thing as a better partner," she said. "Volt and I know each other. That counts for something the numbers never show."'
    ],
    questions: [
      { tag: 'RECALL', q: 'What was Rosa offered in the trade?', choices: ['A water serpent', 'A ground type', 'Money', 'A gym badge'], answer: 0 },
      { tag: 'INFER', q: 'Why were people whispering about Volt before the final?', choices: ['Volt was injured', 'Electric attacks are weak against ground types', 'Volt was too big', 'Volt was new to the team'], answer: 1 },
      { tag: 'SEQUENCE', q: 'What happened right AFTER Volt was knocked back twice?', choices: ['Rosa gave up', 'Volt ran circles to tire the champion out', 'The battle ended', 'Rosa made the trade'], answer: 1 },
      { tag: 'VOCAB', q: 'In this story, "brutal" means:', choices: ['gentle', 'very hard and rough', 'funny', 'short'], answer: 1 },
      { tag: 'MAIN IDEA', q: 'What is the main idea?', choices: ['Always trade for the strongest creature', 'A trusted partner can beat raw power', 'Tournaments are unfair', 'Ground types always win'], answer: 1 },
      { tag: 'MATH', q: 'Volt and Rosa lost their first 11 battles and won their last 23. How many battles is that in all?', choices: ['12', '34', '33', '23'], answer: 1 },
      { tag: 'INFER', q: 'Rosa says "that counts for something the numbers never show." What does she mean?', choices: ['She is bad at math', 'Teamwork and trust do not appear in stats', 'The scoreboard was broken', 'Numbers are always wrong'], answer: 1 }
    ]
  }
];
