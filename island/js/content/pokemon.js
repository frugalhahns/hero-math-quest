/* The eleven residents of Verdant Isle.
   Each one carries a field-note passage written at roughly an 8th grade level
   (long sentences, subordinate clauses, tier-two vocabulary) plus a bank of
   comprehension questions. Words wrapped in {curly braces} are glossary words;
   see content/glossary.js. Nothing here is copied artwork or copied text --
   the prose is original and the sprites are drawn in js/pixels.js. */

export const SPECIES = [
  /* ------------------------------------------------------------ beach */
  {
    id: 'pidgey', name: 'Pidgey', kind: 'Tiny Bird', region: 'beach',
    job: 'scout', jobName: 'Scouting', jobDesc: 'Maps a route and remembers it.',
    found: 'the driftwood scrub above the tide line, on the Landing Beach',
    passage: {
      title: 'Field Notes: Pidgey',
      source: 'Warden Elm, Verdant Isle Survey, entry 14',
      text: [
        'Pidgey is the most {ubiquitous} bird on the isle and, for that reason, the most underestimated. It almost never picks a fight. When something startles it, it beats its wings against the sand, throws up a screen of grit, and vanishes into the scrub before the dust has settled. Trainers who call this cowardice have missed the point entirely: the maneuver costs the Pidgey almost nothing, and it costs a predator its dinner.',
        'What makes Pidgey valuable to a survey crew is not speed but memory. A Pidgey that has flown a stretch of coastline once can retrace it in fog, at dusk, or after a storm has rearranged every landmark it used the first time. I banded one female in March and watched her return to the same feeding shelf eleven days later, arriving from the opposite direction, without a moment of hesitation.',
        'If you want a Pidgey\'s help, do not chase it. Stand still, keep your hands low, and let the bird decide that you are {innocuous}. To a Pidgey, patience reads as competence.'
      ]
    },
    questions: [
      { tag: 'Main idea',
        q: 'According to the notes, a survey crew values Pidgey mainly because it can —',
        choices: ['drive predators away from a campsite', 'retrace a route even when the landmarks have changed', 'fly faster than any other bird on the isle', 'be found on almost every beach'],
        answer: 1,
        why: 'The writer says outright that "what makes Pidgey valuable to a survey crew is not speed but memory," then gives the banded female as proof. Being found on every beach is true, but that is the reason Pidgey is underestimated, not the reason it is useful.' },
      { tag: 'Inference',
        q: 'The writer says trainers who call the dust screen cowardice have "missed the point entirely." What point have they missed?',
        choices: ['Pidgey is actually a dangerous fighter', 'The move is cheap for Pidgey and expensive for a predator', 'Pidgey only uses the move when it is alone', 'The dust is harmful to anything that breathes it'],
        answer: 1,
        why: 'The very next sentence explains the point: the maneuver "costs the Pidgey almost nothing, and it costs a predator its dinner." A move that wins by being efficient is smart, not cowardly.' },
      { tag: 'Vocabulary',
        q: 'In this passage, {innocuous} most nearly means —',
        choices: ['unable to be trusted', 'unlikely to do harm', 'difficult to notice', 'important to the flock'],
        answer: 1,
        why: 'The sentence tells you to stand still and keep your hands low until the bird decides you are innocuous. You are trying to look harmless. "Difficult to notice" is close, but the standing still is what makes you *safe* in the bird\'s judgment, not invisible.' },
      { tag: 'Author\'s craft',
        q: 'Why does Warden Elm include the story of the banded female who returned after eleven days?',
        choices: ['To show that Pidgey populations are shrinking', 'To give concrete evidence for the claim about memory', 'To explain why banding birds is difficult work', 'To prove that Pidgey migrates over long distances'],
        answer: 1,
        why: 'The story is evidence. Elm makes a general claim about Pidgey\'s memory and then supplies one documented case with specific details: eleven days, opposite direction, no hesitation. Good field writing works this way.' },
      { tag: 'Text evidence',
        q: 'Which line best supports the idea that Pidgey decides whether to trust a person?',
        choices: ['"Pidgey is the most ubiquitous bird on the isle"', '"It almost never picks a fight"', '"let the bird decide that you are innocuous"', '"the maneuver costs the Pidgey almost nothing"'],
        answer: 2,
        why: 'The word "decide" puts the choice in the bird\'s control, which is exactly the claim. The other lines are about how common Pidgey is, how it avoids fights, and why its escape works.' }
    ],
    lines: {
      rapport: 'The Pidgey stops sidestepping and turns one eye on you.',
      catch: 'It hops onto your pack as though the arrangement were obvious.',
      flee: 'A puff of grit, and the scrub is empty.'
    }
  },
  {
    id: 'psyduck', name: 'Psyduck', kind: 'Duck', region: 'beach',
    job: 'water', jobName: 'Water-finding', jobDesc: 'Smells out fresh water and carries it.',
    found: 'the shallows at the west end of the beach, near the rock finger',
    passage: {
      title: 'Field Notes: Psyduck',
      source: 'Warden Elm, Verdant Isle Survey, entry 22',
      text: [
        'Do not let the blank expression fool you. Psyduck spends most of its waking life managing a headache, and that headache is the whole story of the species.',
        'Psychic pressure gathers inside a Psyduck\'s skull the way water gathers behind a dam. The animal has no {deliberate} way to let it out. So it stands in the shallows, holds its head in both hands, and waits. When the pressure finally crests, the release is spectacular and completely uncontrolled: stones lift off the sand, ripples run backward against the wind, and the Psyduck looks every bit as startled as the observer.',
        'For our work here, though, the useful trait is a much quieter one. A Psyduck can distinguish fresh water from salt at a distance of several meters, and it will wade toward the fresh every single time. I have relied on that instinct for six seasons to locate the springs that feed the island\'s old sluice gates. Follow a thirsty Psyduck and you will find water worth drinking.',
        'Approach slowly. Raised voices make the pressure worse, and a Psyduck in pain trusts nobody.'
      ]
    },
    questions: [
      { tag: 'Inference',
        q: 'Why does a Psyduck look startled when its psychic power goes off?',
        choices: ['It has no control over when the release happens', 'It is frightened of the observers watching it', 'The power always injures the Psyduck itself', 'It has never seen stones lift off the sand before'],
        answer: 0,
        why: 'The passage calls the release "completely uncontrolled" and says the animal has no deliberate way to let the pressure out. If you cannot choose the moment, the moment surprises you.' },
      { tag: 'Vocabulary',
        q: 'In this passage, {deliberate} most nearly means —',
        choices: ['unusually slow and heavy', 'done on purpose', 'carried out in secret', 'painful but necessary'],
        answer: 1,
        why: '"Deliberate" can mean slow, but here it is paired with "no way to let it out" and contrasted with "completely uncontrolled." The missing thing is intention, not speed.' },
      { tag: 'Author\'s craft',
        q: 'The comparison to water behind a dam is used mainly to show that the pressure —',
        choices: ['is made of water rather than energy', 'builds up steadily until it must burst out', 'can be measured with simple instruments', 'only appears during storms'],
        answer: 1,
        why: 'A dam holds back a rising load until it gives way all at once. That is the shape of the idea the writer wants: slow accumulation, sudden release. The comparison is not a claim about what the pressure is made of.' },
      { tag: 'Detail',
        q: 'Warden Elm has followed Psyduck for six seasons in order to —',
        choices: ['study the psychic releases up close', 'find the springs that feed the sluice gates', 'keep the ducks away from the campsite', 'measure how far a Psyduck can smell salt'],
        answer: 1,
        why: 'Elm says the instinct has been relied on "for six seasons to locate the springs that feed the island\'s old sluice gates." The psychic release is described, but it is not what Elm is using the bird for.' },
      { tag: 'Inference',
        q: 'What does the last paragraph suggest about earning a Psyduck\'s trust?',
        choices: ['It is impossible while the Psyduck has a headache', 'Being calm and quiet matters more than being generous', 'A Psyduck will trust anyone who offers it fresh water', 'Trust must be earned before the pressure builds up'],
        answer: 1,
        why: 'The advice is behavioral: approach slowly, do not raise your voice. Nothing is said about gifts. The claim is that noise causes pain and pain destroys trust, so quiet is the price of admission.' }
    ],
    lines: {
      rapport: 'The Psyduck lowers one hand from its head and blinks at you.',
      catch: 'It waddles over and leans against your leg, still frowning.',
      flee: 'It wanders off into deeper water, muttering.'
    }
  },

  /* ------------------------------------------------------------ meadow */
  {
    id: 'chikorita', name: 'Chikorita', kind: 'Leaf', region: 'meadow',
    job: 'plant', jobName: 'Planting', jobDesc: 'Coaxes roots, vines and rope-grass to grow.',
    found: 'the sunny south end of Meadow Hollow, where the tall grass is thickest',
    passage: {
      title: 'Field Notes: Chikorita',
      source: 'Warden Elm, Verdant Isle Survey, entry 31',
      text: [
        'The broad leaf on a Chikorita\'s head is not decoration and it is not a weapon. It is an instrument. The leaf tracks changes in air pressure and humidity so precisely that a Chikorita will begin sheltering under a hedge a full hour before the first cloud appears over the water. Islanders once planted by the calendar. The ones who paid attention learned to plant by the Chikorita instead.',
        'The leaf also releases a faint, sweet scent when the animal is content. Botanists argue about what the scent is for. The most persuasive explanation is that it is not a signal to us at all: the compound appears to accelerate root growth in nearby seedlings, which means a happy Chikorita quietly improves the ground it is standing on.',
        'That second fact is the one worth remembering. A Chikorita that has been dragged somewhere against its will produces almost none of the scent. A Chikorita that wants to be where it is will turn thin soil into something that holds a sapling. The work is not {coerced}; it is {reciprocal}. Feed it, shade it, ask rather than pull, and it will do more for a hillside in one season than a crew of six with shovels.'
      ]
    },
    questions: [
      { tag: 'Main idea',
        q: 'What is the central idea of these notes?',
        choices: ['Chikorita\'s leaf is a better weather instrument than a barometer', 'A willing Chikorita improves soil, so it must be treated as a partner', 'Botanists still do not understand the scent Chikorita produces', 'Islanders should stop planting crops by the calendar'],
        answer: 1,
        why: 'The weather-sensing leaf and the botanical argument are both setup. The writer flags the real point directly: "That second fact is the one worth remembering," and then explains that the scent, and so the soil-building, depends on the animal being willing.' },
      { tag: 'Vocabulary',
        q: 'In this passage, {reciprocal} most nearly means —',
        choices: ['forced by one side', 'going both ways', 'repeated many times', 'kept secret from others'],
        answer: 1,
        why: 'It is set directly against "coerced" and followed by a list of things you give the Chikorita: feed it, shade it, ask. Both sides put something in, so both sides get something out.' },
      { tag: 'Inference',
        q: 'Why would a Chikorita that was dragged to a site be a poor choice for restoring soil?',
        choices: ['It would be too tired to move around the site', 'Unhappy Chikorita produce almost no root-growth scent', 'Its leaf stops predicting the weather when it is upset', 'It would try to return to the meadow it came from'],
        answer: 1,
        why: 'Chain the two facts: the scent speeds up root growth, and a Chikorita dragged somewhere "produces almost none of the scent." No scent means no soil benefit, so hauling one there defeats the purpose.' },
      { tag: 'Text evidence',
        q: 'Which detail best supports the claim that the leaf works as an instrument?',
        choices: ['The leaf is broad and sits on the animal\'s head', 'It releases a sweet scent when the animal is content', 'A Chikorita takes shelter an hour before clouds appear', 'Botanists still argue about the purpose of the scent'],
        answer: 2,
        why: 'An instrument measures something. Sheltering a full hour before any cloud is visible is a measurement of conditions a person cannot see yet — that is the evidence. The scent is a separate function.' },
      { tag: 'Author\'s craft',
        q: 'The comparison to "a crew of six with shovels" is included to —',
        choices: ['show how much slower human labor would be', 'suggest that the island is short of workers', 'argue that shovels damage thin soil', 'explain how the old islanders planted'],
        answer: 0,
        why: 'It is a scale comparison, placed at the end for impact: one willing Chikorita outworks six people. The sentence is about the animal\'s value, not about shovels or staffing.' }
    ],
    lines: {
      rapport: 'The leaf tilts toward you and the air turns faintly sweet.',
      catch: 'It trots a circle around your boots and settles.',
      flee: 'It slips under a hedge, leaf folded flat.'
    }
  },
  {
    id: 'machop', name: 'Machop', kind: 'Superpower', region: 'meadow',
    job: 'haul', jobName: 'Hauling', jobDesc: 'Lifts and carries what people cannot.',
    found: 'the cairn circle on the east side of Meadow Hollow',
    passage: {
      title: 'Field Notes: Machop',
      source: 'Warden Elm, Verdant Isle Survey, entry 38',
      text: [
        'A Machop the height of a nine-year-old child can lift a boulder that would {buckle} the knees of any adult on this island. The muscle itself is unremarkable under a microscope. What is remarkable is the leverage: the tendons attach unusually far from the joints, which trades away fine control and buys enormous force.',
        'That trade explains the behavior everyone notices. Machop are clumsy with small objects and endlessly patient with heavy ones. Hand a Machop a teacup and you will lose the teacup. Ask it to move a fallen cedar and it will study the trunk, walk around it twice, and then move it in one motion.',
        'Machop also train constantly, and they train in the open where others can watch. Younger animals imitate older ones without being taught. A visitor once described the cairn circle as a gymnasium, which is closer to the truth than it sounds: the stacked stones are not a shrine at all. They are weights, arranged by size, and they have been rearranged by hand — by Machop hands — for longer than anyone here has kept records.',
        'Never race a Machop through a job. It is measuring, and the measuring is why nothing gets dropped.'
      ]
    },
    questions: [
      { tag: 'Inference',
        q: 'Why is a Machop clumsy with a teacup but reliable with a fallen tree?',
        choices: ['Teacups are unfamiliar objects on the island', 'Its tendon layout gives it force at the cost of fine control', 'It is only interested in tasks that look difficult', 'It has poor eyesight for objects held close up'],
        answer: 1,
        why: 'The second paragraph opens with "That trade explains the behavior everyone notices," pointing back to the tendon design that "trades away fine control and buys enormous force." Small delicate work is exactly what that trade gives up.' },
      { tag: 'Vocabulary',
        q: 'In this passage, {buckle} most nearly means —',
        choices: ['fasten tightly', 'give way under weight', 'twist to one side', 'become stiff and sore'],
        answer: 1,
        why: 'The sentence is about a boulder too heavy for an adult. Knees that buckle collapse under a load. The "fasten" meaning of buckle is a different sense of the same word.' },
      { tag: 'Text structure',
        q: 'The claim that the cairn circle is "a gymnasium" revises an earlier assumption that the stones are —',
        choices: ['natural rock formations', 'a shrine', 'boundary markers', 'a Machop nest'],
        answer: 1,
        why: 'The writer states the correction directly: "the stacked stones are not a shrine at all. They are weights." The visitor\'s gymnasium remark is what sets up that reversal.' },
      { tag: 'Inference',
        q: 'What does the last paragraph suggest about a Machop that seems to be standing still on a job?',
        choices: ['It has lost interest and needs a new task', 'It is resting between heavy lifts', 'It is working out how to lift without dropping anything', 'It is waiting for an older Machop to show it what to do'],
        answer: 2,
        why: 'The passage says not to rush a Machop because "it is measuring, and the measuring is why nothing gets dropped." The earlier cedar example shows the same thing: study the trunk, circle it twice, then lift.' },
      { tag: 'Detail',
        q: 'According to the notes, how do young Machop learn to train?',
        choices: ['Older Machop deliberately teach them', 'They copy older Machop without instruction', 'Islanders arrange the stones for them', 'They are born already knowing how'],
        answer: 1,
        why: 'The line is precise: "Younger animals imitate older ones without being taught." Imitation is not the same as instruction, and the distinction is the point of the sentence.' }
    ],
    lines: {
      rapport: 'The Machop sets down its stone and squares up to listen.',
      catch: 'It shoulders your pack before you can object.',
      flee: 'It jogs off toward the cairns, unhurried.'
    }
  },
  {
    id: 'pikachu', name: 'Pikachu', kind: 'Mouse', region: 'meadow',
    job: 'power', jobName: 'Charging', jobDesc: 'Puts current through a dead circuit.',
    found: 'the reed islet in the middle of the meadow pond',
    passage: {
      title: 'Field Notes: Pikachu',
      source: 'Warden Elm, Verdant Isle Survey, entry 45',
      text: [
        'The two sacs in a Pikachu\'s cheeks are storage, not generation. Charge is produced along the spine as the animal moves and then banked in the cheeks until it is needed, which is why a Pikachu that has been asleep in one spot all afternoon has very little to give and a Pikachu that has spent the day running has a great deal.',
        'This has a practical consequence that people get wrong constantly. If you need a Pikachu to power something, do not corner it and demand a spark. Walk it there. A twenty-minute climb up the ridge trail will do more for the {yield} than any amount of coaxing at the panel.',
        'When a Pikachu is holding more charge than it is comfortable with, it will discharge whether or not anyone asked. The warning signs are consistent and easy to read once you know them: the cheeks brighten, the ears flatten backward, and the tail rises and stiffens. Stand clear at that point. The animal is not being {malicious}. It is doing the equivalent of setting down something too hot to hold.',
        'Islanders who lived alongside them built low copper posts beside their doorways for exactly this reason. A Pikachu with somewhere safe to dump a charge is a Pikachu that never has to dump it into a wall, a fence, or a person.'
      ]
    },
    questions: [
      { tag: 'Main idea',
        q: 'These notes are mostly concerned with —',
        choices: ['how Pikachu generate electricity inside their bodies', 'how to work with Pikachu given how their charge behaves', 'why Pikachu prefer to live near people', 'what the copper posts on the island were used for'],
        answer: 1,
        why: 'Every section turns into advice: walk it there, watch for the warning signs, give it somewhere to discharge. The biology in paragraph one exists to explain why the advice works.' },
      { tag: 'Inference',
        q: 'Why would walking a Pikachu up the ridge trail help before a job?',
        choices: ['The climb calms the animal so it cooperates', 'Movement builds charge, and the cheeks only store it', 'Higher ground improves the flow of electricity', 'The exercise makes the warning signs easier to see'],
        answer: 1,
        why: 'Paragraph one draws the distinction: charge is produced along the spine "as the animal moves" and merely banked in the cheeks. So a Pikachu that has moved a lot has more to give — the walk is the charging.' },
      { tag: 'Vocabulary',
        q: 'In this passage, {yield} most nearly means —',
        choices: ['the amount produced', 'the act of giving in', 'a safe hiding place', 'the speed of a reaction'],
        answer: 0,
        why: 'The sentence compares a climb with "coaxing at the panel" as ways to get more out of the animal. It is a quantity — how much charge you end up with. "Giving in" is a real meaning of yield, but not this one.' },
      { tag: 'Author\'s craft',
        q: 'The writer compares an involuntary discharge to "setting down something too hot to hold" in order to —',
        choices: ['warn that a Pikachu can burn a person badly', 'explain that the discharge is relief, not aggression', 'show that Pikachu dislike being handled', 'suggest that the charge is a kind of heat'],
        answer: 1,
        why: 'The comparison lands right after "The animal is not being malicious." Dropping something scalding is not an attack, it is a reflex — which is exactly how the writer wants the discharge understood.' },
      { tag: 'Text evidence',
        q: 'Which detail best explains why the islanders\' copper posts worked?',
        choices: ['They were built low to the ground', 'They stood beside doorways where people passed', 'They gave the animal a safe place to dump charge', 'They were made of a metal that conducts well'],
        answer: 2,
        why: 'The final sentence spells out the mechanism: with somewhere safe to discharge, a Pikachu "never has to dump it into a wall, a fence, or a person." Height, placement and material are details, not the reason.' }
    ],
    lines: {
      rapport: 'The Pikachu\'s ears come forward. The cheeks dim slightly.',
      catch: 'It scrambles up to your shoulder and settles there, warm.',
      flee: 'A crack of static, and it is gone across the water.'
    }
  },

  /* ------------------------------------------------------------ grove */
  {
    id: 'bulbasaur', name: 'Bulbasaur', kind: 'Seed', region: 'grove',
    job: 'plant', jobName: 'Planting', jobDesc: 'Coaxes roots, vines and rope-grass to grow.',
    found: 'the shrine clearing at the heart of Whispering Grove',
    passage: {
      title: 'Field Notes: Bulbasaur',
      source: 'Warden Elm, Verdant Isle Survey, entry 52',
      text: [
        'The bulb on a Bulbasaur\'s back is a {reservoir}. It stores water and nutrients drawn in through the animal\'s skin, and it feeds those stores back out slowly, which is why a Bulbasaur can go eight or nine days in dry weather without visible distress while every other creature in the grove is crowding the brook.',
        'That independence shapes how they live. Bulbasaur do not defend territory and they do not compete for the wet ground near water, because they do not need it. Instead they range widely, and as they range they seed. Vine cuttings drop from the bulb, take root in disturbed soil, and hold a slope together through the winter storms. The old terraces on the west face of the ridge were not built by people. They were grown, one Bulbasaur at a time, over a span nobody has managed to date.',
        'A word of caution. A Bulbasaur will refuse to plant on ground it judges unable to support what it puts there, and it is a better judge than you are. If your Bulbasaur turns away from a site, walk the site again. Twice I have argued with one about a hillside and twice the hillside came down in the spring rain.'
      ]
    },
    questions: [
      { tag: 'Inference',
        q: 'Why do Bulbasaur avoid competing for wet ground near the brook?',
        choices: ['Other creatures there are dangerous to them', 'Their bulb stores enough water that they do not need it', 'They prefer to stay hidden in the grove', 'The wet soil is too loose for planting vines'],
        answer: 1,
        why: 'The passage links the two directly: they "do not compete for the wet ground near water, because they do not need it," and the reason is the reservoir described in paragraph one.' },
      { tag: 'Vocabulary',
        q: 'In this passage, {reservoir} most nearly means —',
        choices: ['a heavy burden', 'a store held for later use', 'a protective shell', 'a source of new growth'],
        answer: 1,
        why: 'The next clause defines it in plain terms: it "stores water and nutrients" and "feeds those stores back out slowly." A reservoir is a supply you draw down over time.' },
      { tag: 'Main idea',
        q: 'The point of the paragraph about the ridge terraces is that Bulbasaur —',
        choices: ['once lived in far greater numbers than they do now', 'shaped the island\'s landscape without any human plan', 'were domesticated by the island\'s earliest residents', 'compete with people for the best planting ground'],
        answer: 1,
        why: 'The writer denies human authorship — "were not built by people. They were grown, one Bulbasaur at a time" — to make the case that the animals themselves are landscape builders. Nothing suggests domestication or competition.' },
      { tag: 'Author\'s craft',
        q: 'Why does Warden Elm admit to arguing with a Bulbasaur and losing twice?',
        choices: ['To show that Bulbasaur are stubborn and hard to work with', 'To lend weight to the advice to trust the animal\'s judgment', 'To explain why the spring rains are dangerous', 'To warn readers away from the west face of the ridge'],
        answer: 1,
        why: 'Admitting your own error is a persuasive move. Elm has just told you the Bulbasaur "is a better judge than you are," and the confession is the evidence: twice Elm overruled one, and twice the hillside collapsed.' },
      { tag: 'Inference',
        q: 'If a Bulbasaur refuses to plant on a slope you have chosen, the notes suggest you should —',
        choices: ['find a different Bulbasaur for the job', 'plant the slope yourself and watch it closely', 'inspect the slope again before insisting', 'wait until the dry season and try again'],
        answer: 2,
        why: 'The instruction is explicit: "If your Bulbasaur turns away from a site, walk the site again." The refusal is treated as information about the ground, not as an obstacle to work around.' }
    ],
    lines: {
      rapport: 'The Bulbasaur turns fully toward you, bulb swaying.',
      catch: 'It presses its forehead against your shin, once.',
      flee: 'Vines close behind it and the clearing is quiet.'
    }
  },
  {
    id: 'diglett', name: 'Diglett', kind: 'Mole', region: 'grove',
    job: 'dig', jobName: 'Digging', jobDesc: 'Sinks pilings and opens blocked ground.',
    found: 'the soft mushroom soil along the grove brook',
    passage: {
      title: 'Field Notes: Diglett',
      source: 'Warden Elm, Verdant Isle Survey, entry 60',
      text: [
        'I want to be careful here, because the honest version of these notes is mostly a list of things we do not know.',
        'No one on this survey has seen a Diglett\'s lower half. Not once, in nine seasons. They surface to the neck, look around, and drop. Every published drawing of the rest of the animal is somebody\'s guess dressed up as a diagram, and I would rather record the gap than fill it in with invention.',
        'What we can state is this. A Diglett moves through packed clay at roughly the speed a person walks on a path, and it leaves the tunnel behind it intact rather than collapsed, which suggests the walls are being compressed rather than merely displaced. Colonies coordinate. When we sank test posts along the brook, seven Digletts surfaced within four minutes, in a line, evenly spaced, well before the vibration could have reached the far end of that line by any route we can account for.',
        'Draw your own conclusion from that last observation, but do not mistake a conclusion for a measurement. Mine is that they were talking to each other. I cannot prove it, and I have written it down anyway so that whoever follows me knows which parts of this page are {conjecture}.'
      ]
    },
    questions: [
      { tag: 'Main idea',
        q: 'What is Warden Elm mainly doing in these notes?',
        choices: ['Proving that Diglett colonies communicate underground', 'Separating what the survey knows from what it only suspects', 'Correcting the published drawings of Diglett anatomy', 'Explaining how Diglett tunnels stay open'],
        answer: 1,
        why: 'The first line announces the purpose — the honest version is "mostly a list of things we do not know" — and the last line names it again: marking "which parts of this page are conjecture." The specific facts serve that larger project.' },
      { tag: 'Vocabulary',
        q: 'In this passage, {conjecture} most nearly means —',
        choices: ['a careful measurement', 'an unproven guess', 'a lasting mistake', 'a detailed drawing'],
        answer: 1,
        why: 'Elm has just written "I cannot prove it, and I have written it down anyway," and earlier warns not to "mistake a conclusion for a measurement." Conjecture is the unproven side of that line.' },
      { tag: 'Inference',
        q: 'What does the evidence about the seven Digletts suggest to Elm?',
        choices: ['The test posts frightened the whole colony at once', 'The animals were signaling to one another underground', 'Diglett can feel vibration from much farther than expected', 'Seven Digletts share a single connected tunnel'],
        answer: 1,
        why: 'Elm states the conclusion outright — "they were talking to each other" — because the timing rules out the simple explanation: the vibration could not have travelled the length of that line fast enough by any known route.' },
      { tag: 'Text evidence',
        q: 'Which observation supports the claim that tunnel walls are compressed rather than pushed aside?',
        choices: ['A Diglett moves as fast as a person walking', 'The tunnels stay open instead of collapsing', 'Diglett surface only as far as the neck', 'Colonies respond to vibration together'],
        answer: 1,
        why: 'A tunnel that holds its shape has walls doing structural work. Elm draws exactly that inference: it "leaves the tunnel behind it intact rather than collapsed, which suggests the walls are being compressed."' },
      { tag: 'Author\'s craft',
        q: 'Why does Elm criticize the published drawings of Diglett?',
        choices: ['They are drawn badly and hard to read', 'They present guesses in the style of established fact', 'They were made by people who never visited the isle', 'They leave out the animal\'s lower half entirely'],
        answer: 1,
        why: 'The complaint is about honesty, not skill: each drawing is "somebody\'s guess dressed up as a diagram." That is the same standard Elm applies to Elm\'s own writing a paragraph later.' }
    ],
    lines: {
      rapport: 'The Diglett rises another inch out of the soil, listening.',
      catch: 'It surfaces beside your boot and waits for instructions.',
      flee: 'The soil closes over. No sound at all.'
    }
  },

  /* ------------------------------------------------------------ marsh */
  {
    id: 'wooper', name: 'Wooper', kind: 'Water Fish', region: 'marsh',
    job: 'water', jobName: 'Water-finding', jobDesc: 'Smells out fresh water and carries it.',
    found: 'the firm reed island in the middle of the Brackish Marsh',
    passage: {
      title: 'Field Notes: Wooper',
      source: 'Warden Elm, Verdant Isle Survey, entry 71',
      text: [
        'Wooper live where the river meets the sea, in water that is neither fresh nor salt but {brackish}, and that choice of address costs them something. Water constantly moves across the skin of any animal in that zone, in one direction or the other, and most species spend real energy fighting it.',
        'A Wooper solves the problem with a coating. The film over its skin is thick, faintly bitter, and effective, and it lets the animal sit in changing salinity all day without adjusting anything. The film also makes a Wooper unpleasant to bite, which is presumably a second benefit rather than the original purpose.',
        'The cost shows up on land. Out of water the film dries within about half an hour, and a dry Wooper is a distressed Wooper. If you take one inland, take water with it, and give it a shallow pool at every stop. This is not a courtesy. It is the condition of the arrangement, and a Wooper that has been let dry out once will not follow you a second time.',
        'They are also, by some distance, the calmest animals on this island. A Wooper will stand in a working sluice channel for an hour with the current breaking over its back and never once try to leave. Whatever job you give one, it will still be doing it when you come back.'
      ]
    },
    questions: [
      { tag: 'Vocabulary',
        q: 'In this passage, {brackish} most nearly means —',
        choices: ['unusually deep', 'partly salty', 'slow moving', 'badly polluted'],
        answer: 1,
        why: 'The sentence defines it as it goes: "neither fresh nor salt." Brackish water is the mix you get where a river meets the sea.' },
      { tag: 'Inference',
        q: 'Why is the skin film such an advantage in brackish water?',
        choices: ['It keeps the animal warm as the tide changes', 'It saves the energy other species spend resisting water movement', 'It allows the Wooper to breathe while submerged', 'It makes the Wooper harder for predators to see'],
        answer: 1,
        why: 'Paragraph one sets up the cost — most species "spend real energy fighting" water crossing the skin — and paragraph two says the film lets a Wooper sit there "without adjusting anything." The saving is the point.' },
      { tag: 'Author\'s craft',
        q: 'The writer calls the film\'s bad taste "presumably a second benefit rather than the original purpose" in order to —',
        choices: ['admit uncertainty about how the trait evolved', 'warn handlers not to touch a Wooper\'s skin', 'argue that predators avoid Wooper entirely', 'explain why the film tastes bitter'],
        answer: 0,
        why: '"Presumably" flags a guess. Elm is being careful about the difference between what a trait does and what it developed for — the same care shown in the Diglett notes.' },
      { tag: 'Text structure',
        q: 'The third paragraph mainly serves to —',
        choices: ['describe how Wooper behave in the wild', 'explain the obligation that comes with taking a Wooper inland', 'compare Wooper with other marsh species', 'prove that the skin film has more than one use'],
        answer: 1,
        why: 'It begins with "The cost shows up on land" and becomes a set of duties: bring water, provide a pool at every stop. Elm calls it "the condition of the arrangement," not a courtesy.' },
      { tag: 'Inference',
        q: 'What can you conclude about a Wooper that refuses to follow a person?',
        choices: ['It is unwell and should be left in the marsh', 'It may have been allowed to dry out by that person before', 'It has been given a job it cannot do', 'It is too calm to be interested in travelling'],
        answer: 1,
        why: 'The passage supplies exactly one cause for that refusal: "a Wooper that has been let dry out once will not follow you a second time." The refusal is memory, not illness.' }
    ],
    lines: {
      rapport: 'The Wooper\'s tail sways once. It does not move otherwise.',
      catch: 'It plods over and stands on your foot, contentedly.',
      flee: 'It sinks until only two eyes remain, then those go too.'
    }
  },
  {
    id: 'chinchou', name: 'Chinchou', kind: 'Angler', region: 'marsh',
    job: 'light', jobName: 'Lighting', jobDesc: 'Holds a steady glow in the dark.',
    found: 'the deep channel at the south end of the marsh, after dusk',
    passage: {
      title: 'Field Notes: Chinchou',
      source: 'Warden Elm, Verdant Isle Survey, entry 78',
      text: [
        'The two antennae trailing from a Chinchou are modified fins. They no longer do anything useful for swimming, which makes them {vestigial} in the strict sense, but they have taken on a second career: each one ends in a bulb that the animal can charge and hold lit for hours.',
        'The light is not for hunting. That was the assumption for decades, and it is wrong. A hunting Chinchou goes dark, drifts, and strikes by sensing the electrical activity of its prey. It lights up afterward, and it lights up socially — in channels where a dozen Chinchou gather, the flashes fall into a pattern that takes about forty seconds to complete and then begins again.',
        'What that pattern means is unknown. What is known is that it stops the instant a lantern is lowered into the water and does not resume for twenty minutes or more. If you are working a channel at night and you want the Chinchou to keep doing what Chinchou do, keep your own light above the surface.',
        'A Chinchou that has agreed to work with you will hold a bulb steady at whatever brightness you ask for, indefinitely, and will dim it without being asked when you turn to look at something close by. I have never been able to explain how it knows.'
      ]
    },
    questions: [
      { tag: 'Main idea',
        q: 'A long-standing belief that these notes correct is that Chinchou light —',
        choices: ['comes from the animal\'s antennae', 'is used to hunt prey', 'can be held steady for hours', 'disturbs other creatures in the channel'],
        answer: 1,
        why: 'The correction is stated flatly: "The light is not for hunting. That was the assumption for decades, and it is wrong." A hunting Chinchou actually goes dark and hunts by sensing electrical activity.' },
      { tag: 'Vocabulary',
        q: 'In this passage, {vestigial} most nearly means —',
        choices: ['left over and no longer serving its first use', 'unusually large for the animal\'s size', 'able to grow back after injury', 'shared by every member of a species'],
        answer: 0,
        why: 'The definition is built into the sentence: the antennae "no longer do anything useful for swimming," which is what makes them vestigial "in the strict sense." The new job as a lamp is a second career, not the original one.' },
      { tag: 'Inference',
        q: 'Why does Elm tell night workers to keep their lanterns above the surface?',
        choices: ['Underwater light attracts predators to the channel', 'Submerged light shuts down the Chinchou flash pattern', 'Wet lanterns are difficult to relight in the marsh', 'The Chinchou will follow a lantern instead of working'],
        answer: 1,
        why: 'The pattern "stops the instant a lantern is lowered into the water and does not resume for twenty minutes or more." If you want the Chinchou behaving normally, do not put your light in the water.' },
      { tag: 'Text evidence',
        q: 'Which detail best shows that the flashing is social rather than practical?',
        choices: ['Each antenna ends in a bulb that can be charged', 'A hunting Chinchou goes dark before it strikes', 'Groups flash in a repeating forty-second pattern', 'A working Chinchou will dim its bulb on its own'],
        answer: 2,
        why: 'A shared, repeating pattern among a dozen animals is coordination between individuals — the definition of social behavior. Going dark to hunt shows what the light is *not* for, which is a different point.' },
      { tag: 'Author\'s craft',
        q: 'The last sentence, "I have never been able to explain how it knows," mainly shows that Elm —',
        choices: ['distrusts the Chinchou\'s cooperation', 'is willing to record a mystery rather than hide it', 'believes the behavior was learned from people', 'considers the observation unimportant'],
        answer: 1,
        why: 'It is the same habit as the Diglett entry: state the observation, then mark the limit of the explanation. Admitting the gap is presented as good practice, not as doubt about what was seen.' }
    ],
    lines: {
      rapport: 'Both bulbs brighten a shade, then settle.',
      catch: 'It rises to the surface beside you, lamps steady.',
      flee: 'Two lights wink out and the channel goes black.'
    }
  },

  /* ------------------------------------------------------------ caverns */
  {
    id: 'snorlax', name: 'Snorlax', kind: 'Sleeping', region: 'caverns',
    job: 'shove', jobName: 'Shoving', jobDesc: 'Moves what nothing else can move.',
    found: 'asleep across the west vault of the Tidepool Caverns',
    passage: {
      title: 'Field Notes: Snorlax',
      source: 'Warden Elm, Verdant Isle Survey, entry 90',
      text: [
        'A grown Snorlax needs something on the order of ten thousand calories a day, and it obtains them in a way that looks, to a casual visitor, like pure laziness. It is not. Sleeping is the strategy. An animal that large burns most of what it eats simply keeping itself running, so every hour spent motionless is an hour of food it does not have to find.',
        'This makes waking one a genuine problem, and the usual approaches all fail for the same reason. Shouting fails. Drums fail. A Snorlax has spent its whole life sleeping through surf, rockfall and thunder, and it has learned, correctly, that loud noises in a cave are almost never worth waking up for. Noise is the one signal it has been trained by experience to ignore.',
        'Scent is different. Scent means food, and food is the only thing worth the cost of standing up. A ripe {aromatic} berry held a hand\'s width from the nose will do in about a minute what an hour of hammering cannot. The Rowan berries that grow in the grove clearing are the strongest smelling fruit on this island; carry two.',
        'Once awake, a Snorlax is patient, careful with its feet, and strong beyond any useful comparison. It will move a rockfall that a full crew has given up on, and it will then go back to sleep, which it has earned.'
      ]
    },
    questions: [
      { tag: 'Main idea',
        q: 'Why does the writer insist that a Snorlax\'s sleeping is not laziness?',
        choices: ['Snorlax sleep less than visitors assume', 'Sleeping conserves the enormous energy it would otherwise need to replace', 'Snorlax are awake at night when visitors are gone', 'Sleeping is how a Snorlax digests such large meals'],
        answer: 1,
        why: '"Sleeping is the strategy." A body that large burns most of its intake just running, so every motionless hour is food it does not have to go find. That is an energy budget, not idleness.' },
      { tag: 'Inference',
        q: 'Why is noise a poor way to wake a Snorlax?',
        choices: ['Its hearing is weak after years in a cave', 'It has learned that loud sounds in a cave rarely matter', 'Noise makes it curl up more tightly', 'Sound does not travel well through cavern walls'],
        answer: 1,
        why: 'The passage says it has slept through surf, rockfall and thunder and "has learned, correctly, that loud noises in a cave are almost never worth waking up for." The problem is experience, not deafness.' },
      { tag: 'Vocabulary',
        q: 'In this passage, {aromatic} most nearly means —',
        choices: ['strongly scented', 'freshly picked', 'sweet to the taste', 'rare and valuable'],
        answer: 0,
        why: 'The whole paragraph is about scent, and the next sentence recommends "the strongest smelling fruit on this island." Ripeness and sweetness are mentioned, but the trait being asked for is smell.' },
      { tag: 'Application',
        q: 'Based on these notes, what should you bring to the caverns to wake the Snorlax?',
        choices: ['A drum and a lantern', 'Two Rowan berries from the grove clearing', 'A full work crew to help move the rockfall', 'A meal large enough to be worth standing up for'],
        answer: 1,
        why: 'The instruction is specific and countable: Rowan berries from the grove clearing are the strongest smelling fruit on the island, and Elm says "carry two." A big meal is the wrong scale — it is the smell that does the work.' },
      { tag: 'Text evidence',
        q: 'Which line best supports the claim that a woken Snorlax is worth the trouble?',
        choices: ['"Sleeping is the strategy"', '"It will move a rockfall that a full crew has given up on"', '"A grown Snorlax needs something on the order of ten thousand calories a day"', '"Noise is the one signal it has been trained by experience to ignore"'],
        answer: 1,
        why: 'That line names the payoff: work no crew of people can finish. The others explain its sleeping, its diet, and why noise fails.' }
    ],
    lines: {
      rapport: 'One eye opens a fraction. The breathing changes rhythm.',
      catch: 'It sits up, considers you, and gets to its feet.',
      flee: 'It rolls over. The cave shakes a little, then settles.'
    }
  },

  /* ------------------------------------------------------------ ridge */
  {
    id: 'ditto', name: 'Ditto', kind: 'Transform', region: 'ridge',
    job: 'mimic', jobName: 'Mimicry', jobDesc: 'Can stand in for any helper on the isle.',
    found: 'the summit cairn on Ashen Ridge',
    passage: {
      title: 'Field Notes: Ditto',
      source: 'Warden Elm, Verdant Isle Survey, final entry',
      text: [
        'I have saved this page for last because I am still not sure it is a field note rather than a confession.',
        'A Ditto can restructure itself into the shape of any creature it has looked at closely, down to details it has no obvious way of knowing. What it cannot do is invent. A Ditto that has never seen a Chinchou cannot produce one, and a Ditto working from a poor look produces something subtly, unsettlingly wrong. Copying, it turns out, is a form of attention. The quality of the copy is a record of how carefully the Ditto was watching.',
        'That is the part I keep returning to. For nine seasons I have walked this island writing down what I saw, and my notes are worth exactly what my attention was worth. Where I hurried, the page is thin. Where I sat still for an afternoon, it holds up. The Ditto and I are in the same business, and it is better at it than I am.',
        'One lives near the summit cairn. It has watched every animal on this isle, which means it has also watched me, and I suspect it could produce a passable Warden Elm if it saw a reason. If you have read your way up this ridge, you have earned an introduction. Show it that you were paying attention too. That is the only {credential} it recognizes.'
      ]
    },
    questions: [
      { tag: 'Main idea',
        q: 'The comparison Elm draws between Ditto and Elm\'s own work is that both —',
        choices: ['produce results only as good as the attention behind them', 'are able to imitate the creatures of the isle', 'have spent exactly nine seasons on the island', 'grow less reliable as the seasons pass'],
        answer: 0,
        why: 'Elm says "my notes are worth exactly what my attention was worth" right after establishing that "the quality of the copy is a record of how carefully the Ditto was watching." Same rule, two crafts.' },
      { tag: 'Inference',
        q: 'Why can a Ditto not produce a Chinchou it has never seen?',
        choices: ['Chinchou live underwater where Ditto cannot go', 'A Ditto can copy but cannot invent', 'The light of a Chinchou is impossible to imitate', 'Ditto only copy creatures of their own size'],
        answer: 1,
        why: 'The passage states the limit directly — "What it cannot do is invent" — and then gives the Chinchou as the example. Copying requires an original to have looked at.' },
      { tag: 'Vocabulary',
        q: 'In this passage, {credential} most nearly means —',
        choices: ['a warning sign', 'proof that you are qualified', 'a formal introduction', 'a gift offered in trade'],
        answer: 1,
        why: 'Elm has just said you must "show it that you were paying attention," and calls that the only credential it recognizes. A credential is the evidence that earns you standing.' },
      { tag: 'Inference',
        q: 'What does Elm mean by writing "Where I hurried, the page is thin"?',
        choices: ['Rushed observations produced weak, unreliable notes', 'Some pages were damaged by rain on the trail', 'Elm ran out of paper late in the survey', 'The early entries were shorter than the later ones'],
        answer: 0,
        why: 'It is figurative. A "thin" page is one with little of substance on it, and Elm pairs it against the entries written after sitting still all afternoon, which "hold up." Hurry costs quality.' },
      { tag: 'Author\'s craft',
        q: 'Elm calls this entry "a confession" rather than a field note because it —',
        choices: ['admits to breaking a survey rule', 'reveals that earlier entries were invented', 'judges Elm\'s own work rather than describing an animal', 'was written after Elm had left the island'],
        answer: 2,
        why: 'The entry turns inward: Elm compares the Ditto\'s attention with Elm\'s own and concedes "it is better at it than I am." A confession is about the writer, which is what makes this page different from the other ten.' }
    ],
    lines: {
      rapport: 'The Ditto shifts slightly, as if trying on your posture.',
      catch: 'For half a second it wears your face, then grins and stops.',
      flee: 'It flattens into the shape of a stone and will not be found.'
    }
  }
];

export const BY_ID = Object.fromEntries(SPECIES.map(s => [s.id, s]));

export const JOBS = {
  scout: { name: 'Scouting', icon: 'eye' },
  water: { name: 'Water-finding', icon: 'drop' },
  plant: { name: 'Planting', icon: 'leaf' },
  haul:  { name: 'Hauling', icon: 'weight' },
  power: { name: 'Charging', icon: 'bolt' },
  dig:   { name: 'Digging', icon: 'spade' },
  light: { name: 'Lighting', icon: 'lamp' },
  shove: { name: 'Shoving', icon: 'boulder' },
  mimic: { name: 'Mimicry', icon: 'blob' }
};
