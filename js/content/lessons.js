/* Short teaching decks, one per Standards Quest track. These exist because the
   game was testing knowledge it never taught: a kid who has not met the word
   "perpendicular" cannot answer a question about it, and getting it wrong
   teaches them nothing except that they got it wrong.

   Rules for a page, all deliberate:
     - one idea, one picture
     - under about 45 words, so it fits on a phone without scrolling
     - the picture is the same drawing the questions use, so nothing is new
       at quiz time except the question itself */

import { clockFace, barGraph, linePlot, tiledRect, dotArray, numberLine,
         angleArt, angleSplit, polygon, linePair,
         rectilinearL, pictograph, geoPrimitive } from './artkit.js';
import { fracBar } from './fractions.js';

const p = (title, lines, art) => ({ title, lines, art });

export const LESSONS = {

  /* ---------------- geometry: the fullest deck ---------------- */
  shapes: [
    p('Sides make the name', [
      'Shapes get their names from how many sides they have.',
      'A shape with <b>4 sides</b> is called a <b>quadrilateral</b>. "Quad" means four.',
      'Square, rectangle, rhombus, trapezoid — all quadrilaterals.'
    ], polygon('square')),

    p('Square', [
      'All <b>4 sides the same length</b>.',
      'All <b>4 corners are square corners</b> (right angles).',
      'A square is the fussiest quadrilateral: it has to get everything right.'
    ], polygon('square')),

    p('Rectangle', [
      'All <b>4 corners are square corners</b>, like a door.',
      'Opposite sides match, but the sides do not all have to be equal.',
      'Every square is also a rectangle. A square just went further.'
    ], polygon('rectangle')),

    p('Rhombus', [
      'All <b>4 sides the same length</b>, like a square that got pushed over.',
      'But the corners are <b>not</b> square corners.',
      'Think of a diamond on a playing card.'
    ], polygon('rhombus')),

    p('Parallelogram', [
      'Both pairs of opposite sides are <b>parallel</b> — they lean the same way and never meet.',
      'Opposite sides are equal, opposite corners match.',
      'A pushed-over rectangle.'
    ], polygon('parallelogram')),

    p('Trapezoid', [
      'Exactly <b>one pair</b> of parallel sides.',
      'The other two sides slant, so they would meet if you kept going.',
      'Shaped like a bucket, or a bridge support.'
    ], polygon('trapezoid')),

    p('Not every shape is a quadrilateral', [
      'This one has <b>5 sides</b>, so it is a <b>pentagon</b>, not a quadrilateral.',
      'Six sides is a <b>hexagon</b>. Three sides is a <b>triangle</b>.',
      'Count the sides first. Always.'
    ], polygon('pentagon')),

    p('Right triangle', [
      'A triangle with <b>one square corner</b> is a <b>right triangle</b>.',
      'Look for the corner that would fit the corner of a piece of paper.',
      'If no corner is square, it is not a right triangle.'
    ], polygon('righttri')),

    p('Parallel lines', [
      'Two lines that <b>never meet</b>, no matter how far they go.',
      'They stay exactly the same distance apart, like railway tracks.'
    ], linePair('parallel')),

    p('Perpendicular lines', [
      'Two lines that cross and make a <b>square corner</b>.',
      'The little box in the corner is the sign that says "this is square".',
      'Perpendicular lines always cross. Parallel lines never do.'
    ], linePair('perpendicular')),

    p('Crossing, but not square', [
      'These lines cross too, but the corners are <b>not</b> square.',
      'So they are intersecting, but <b>not</b> perpendicular.',
      'Crossing alone is not enough. Check for the square corner.'
    ], linePair('intersecting')),

    p('Line of symmetry', [
      'A <b>line of symmetry</b> is a fold line. Fold along it and the two halves land exactly on top of each other.',
      'This square folds down the middle and matches. So yes.'
    ], polygon('square', { mirror: [[80, 10], [80, 130]] })),

    p('When the fold does NOT match', [
      'This parallelogram is slanted. Fold it down the middle and the halves do <b>not</b> line up.',
      'So that dashed line is <b>not</b> a line of symmetry.',
      'Always picture the actual fold.'
    ], polygon('parallelogram', { mirror: [[84, 18], [84, 122]] })),

    p('Equal parts of a shape', [
      'Cut a shape into equal parts and each part is a <b>fraction</b> of the whole shape.',
      'Cut into 4 equal parts and one part is <b>1/4</b> of the area.',
      'The number of parts becomes the bottom number.'
    ], fracBar(4, 1))
  ],

  /* ---------------- angles ---------------- */
  angles: [
    p('What an angle is', [
      'An <b>angle</b> is the opening between two straight lines that start from the same point.',
      'The wider the lines swing apart, the bigger the angle.',
      'Angles are measured in <b>degrees</b>.'
    ], angleArt(55)),

    p('Right angle: exactly 90°', [
      'A <b>right angle</b> is a perfect square corner. It measures <b>90 degrees</b>.',
      'The corner of a book, a door, a window.',
      'This is the one to measure everything else against.'
    ], angleArt(90)),

    p('Acute angle: less than 90°', [
      '<b>Acute</b> angles are <b>smaller</b> than a square corner. Narrow and sharp.',
      'A slice of pizza. A partly-open pair of scissors.'
    ], angleArt(40)),

    p('Obtuse angle: more than 90°', [
      '<b>Obtuse</b> angles are <b>wider</b> than a square corner. Open and leaning back.',
      'A reclining chair. A door opened most of the way.'
    ], angleArt(135)),

    p('Where degrees come from', [
      'A full turn all the way around is <b>360 degrees</b>.',
      'One <b>one-degree angle</b> is 1/360 of that turn — a very thin sliver.',
      'An angle made of 45 of those slivers measures <b>45°</b>.'
    ], angleArt(45)),

    p('Angles add up', [
      'If a big angle is split into two smaller ones, the two parts <b>add up</b> to the whole.',
      'So if you know the whole and one part, <b>subtract</b> to find the other part.',
      'Here: whole − bottom part = top part.'
    ], angleSplit(35, 40, '35°', '?')),

    p('Point', [
      'A <b>point</b> is just one exact spot. It has no length and no width.',
      'We mark it with a dot and give it a letter.'
    ], geoPrimitive('point')),

    p('Line', [
      'A <b>line</b> goes on forever in <b>both</b> directions.',
      'The arrows on both ends are how we say "this never stops".'
    ], geoPrimitive('line')),

    p('Line segment', [
      'A <b>line segment</b> has <b>two endpoints</b>. It stops at both ends.',
      'Because it stops, you can measure how long it is.'
    ], geoPrimitive('segment')),

    p('Ray', [
      'A <b>ray</b> has <b>one endpoint</b> and goes on forever the other way.',
      'One dot, one arrow. A beam from a torch.',
      'Two rays from the same point make an angle.'
    ], geoPrimitive('ray'))
  ],

  /* ---------------- area and perimeter ---------------- */
  area: [
    p('The unit square', [
      'A square that is <b>1 unit on every side</b> is called a <b>unit square</b>.',
      'It covers exactly <b>one square unit</b> of space.',
      'This is the tile we measure area with.'
    ], tiledRect(1, 1)),

    p('Area is a count of squares', [
      '<b>Area</b> is how much flat space a shape covers.',
      'Cover it with unit squares, no gaps and no overlaps, then <b>count them</b>.',
      'This one is 6 across and 4 down: 24 squares, so 24 square units.'
    ], tiledRect(6, 4)),

    p('A faster way: multiply', [
      'You do not have to count every square.',
      '4 rows of 6 is the same as <b>6 × 4</b>.',
      'So area of a rectangle = <b>length × width</b>.'
    ], tiledRect(6, 4)),

    p('Perimeter is the walk around', [
      '<b>Perimeter</b> is the distance all the way <b>around the outside</b>.',
      'Add every side: 5 + 3 + 5 + 3 = 16.',
      'Area is the inside. Perimeter is the edge. Different jobs.'
    ], tiledRect(5, 3, { plain: true })),

    p('Areas add together', [
      'An odd shape can be <b>cut into rectangles</b>.',
      'Work out each rectangle, then <b>add</b> the areas.',
      'Here: the bottom bar plus the block on top.'
    ], rectilinearL(6, 2, 3, 2))
  ],

  /* ---------------- fractions ---------------- */
  fracfront: [
    p('Fractions live on the number line', [
      'The gap from <b>0 to 1</b> is one whole.',
      'Split it into equal jumps. The bottom number says how many jumps.',
      'Count jumps from 0 to find the fraction.'
    ], numberLine(4, 3)),

    p('Same point means equal', [
      'Two fractions that land on the <b>same point</b> are <b>equal</b>.',
      '1/2 and 2/4 sit on exactly the same spot, so 1/2 = 2/4.',
      'Different names, same amount.'
    ], numberLine(4, 2)),

    p('Whole numbers are fractions too', [
      'Anything over <b>1</b> is just itself: 3 = <b>3/1</b>.',
      'And all the parts together make one whole: 4/4 = <b>1</b>.',
      'So 6/1 = 6, and 8/8 = 1.'
    ], fracBar(4, 4)),

    p('Same bottom? Just add the tops', [
      'When the bottom numbers match, the pieces are the <b>same size</b>.',
      'So count them: 3 eighths + 2 eighths = <b>5 eighths</b>.',
      'The bottom number never changes.'
    ], fracBar(8, 5)),

    p('A fraction times a whole number', [
      '3 × 2/5 means <b>3 lots of 2/5</b>.',
      'That is 3 × 2 = 6 pieces, each one fifth. So <b>6/5</b>.',
      'Multiply the top. Leave the bottom alone.'
    ], fracBar(5, 2))
  ],

  /* ---------------- decimals ---------------- */
  decimal: [
    p('Tenths', [
      'One whole split into <b>10</b> equal parts. Each part is one <b>tenth</b>.',
      '3/10 is written <b>0.3</b>. The first spot after the dot is the tenths spot.'
    ], fracBar(10, 3)),

    p('Hundredths', [
      'Split each tenth into 10 again and you get <b>hundredths</b>.',
      '62/100 is written <b>0.62</b>. The second spot after the dot is hundredths.'
    ], null),

    p('Tenths and hundredths together', [
      '1 tenth is the same as <b>10 hundredths</b>. So 3/10 = <b>30/100</b>.',
      'To add 3/10 + 4/100, swap the tenths first: 30/100 + 4/100 = <b>34/100</b>.',
      'Match the pieces before adding.'
    ], null),

    p('Comparing decimals', [
      'Compare the <b>tenths</b> first. Bigger tenths wins.',
      'Only if the tenths tie do you look at the hundredths.',
      '0.7 is bigger than 0.68, even though 68 looks like a big number.'
    ], null)
  ],

  /* ---------------- time and measurement ---------------- */
  clock: [
    p('Reading a clock', [
      'The <b>short hand</b> is the hour. The <b>long hand</b> counts the minutes.',
      'Each little tick is one minute; each number is 5 minutes.',
      'Read the hour the short hand has just passed.'
    ], clockFace(3, 47)),

    p('How long did it take?', [
      'To find <b>elapsed time</b>, count forward from the start to the end.',
      'Jumping to the next whole hour first makes it easier.',
      '3:15 to 3:50 is 35 minutes.'
    ], clockFace(3, 50)),

    p('Bigger unit to smaller unit', [
      'Going from a <b>bigger</b> unit to a <b>smaller</b> one means you need <b>more</b> of them.',
      '1 foot = 12 inches, so 4 feet = 4 × 12 = 48 inches.',
      'Bigger to smaller: multiply.'
    ], null),

    p('Units worth knowing', [
      '1 ft = 12 in &nbsp;·&nbsp; 1 yd = 3 ft &nbsp;·&nbsp; 1 m = 100 cm',
      '1 km = 1000 m &nbsp;·&nbsp; 1 kg = 1000 g &nbsp;·&nbsp; 1 l = 1000 ml',
      '1 hr = 60 min &nbsp;·&nbsp; 1 min = 60 sec &nbsp;·&nbsp; 1 lb = 16 oz'
    ], null)
  ],

  /* ---------------- graphs and data ---------------- */
  data: [
    p('Bar graphs have a scale', [
      'The taller the bar, the more there is.',
      'Check the <b>scale</b> up the side first: here each line is <b>5</b>, not 1.',
      'Read the bar against the scale before you do any maths.'
    ], barGraph(['Cats', 'Dogs', 'Fish', 'Birds'], [15, 25, 10, 30], 5)),

    p('Picture graphs have a key', [
      'Each picture stands for more than one thing.',
      'The <b>key</b> at the bottom tells you how many: here one circle = <b>5</b>.',
      'Count the circles, then multiply.'
    ], pictograph(['Red', 'Blue', 'Green'], [15, 25, 10], 5)),

    p('Line plots', [
      'Each <b>X</b> is one measurement, stacked above the value it landed on.',
      'The marks along the bottom can be fractions, like 1/4 and 1/2.',
      'Tallest stack = most common. Furthest apart = biggest difference.'
    ], linePlot(4, [1, 0, 2, 1, 3, 0, 1, 2, 0], { unit: 'length in inches' }))
  ],

  /* ---------------- multiplication meaning ---------------- */
  groups: [
    p('Multiplying is equal groups', [
      '4 × 6 means <b>4 groups of 6</b>.',
      'You can count them, skip-count by 6, or just know the fact.',
      'Rows and columns like this are called an <b>array</b>.'
    ], dotArray(4, 6)),

    p('Dividing is sharing out', [
      '24 ÷ 4 asks: share 24 into <b>4 equal groups</b>, how many in each?',
      'Or: how many groups of 4 fit into 24?',
      'Both are the same question.'
    ], dotArray(4, 6)),

    p('Order does not matter', [
      '6 × 4 and 4 × 6 give the <b>same total</b>.',
      'Turn the array on its side — same dots, still 24.',
      'So learning one fact gives you two.'
    ], dotArray(4, 6)),

    p('Break a hard fact apart', [
      'Stuck on 8 × 7? Split the 7.',
      '8 × 7 = (8 × 5) + (8 × 2) = 40 + 16 = <b>56</b>.',
      'Two easy facts beat one hard one.'
    ], null),

    p('The missing number', [
      '8 × ? = 48 is really a division question.',
      'Ask: 48 ÷ 8. Or skip-count by 8 until you hit 48.',
      'Multiplying and dividing undo each other.'
    ], null)
  ],

  /* ---------------- place value ---------------- */
  place: [
    p('Each place is ten times bigger', [
      'Moving one place to the <b>left</b> makes a digit worth <b>10 times</b> more.',
      'In 660, the left 6 is worth 600 and the right 6 is worth 60.',
      '600 is ten times 60.'
    ], null),

    p('Rounding', [
      'Rounding asks: which <b>ten</b> (or hundred, or thousand) is it closest to?',
      'Look at the digit one place to the right. <b>5 or more, round up.</b>',
      '47 to the nearest ten is 50. 43 is 40.'
    ], null),

    p('Expanded form', [
      'Break a number into what each digit is <b>worth</b>.',
      '5,382 = 5000 + 300 + 80 + 2.',
      'The digit tells you how many; the place tells you how big.'
    ], null),

    p('Remainders', [
      'Sometimes things do not share out evenly.',
      '23 apples into crates of 5: that is <b>4 full crates and 3 left over</b>.',
      'Careful: if every apple must be packed, you need <b>5</b> crates.'
    ], null)
  ],

  /* ---------------- factors and comparison ---------------- */
  factors: [
    p('Times as many', [
      '"3 <b>times as many</b>" means <b>multiply</b> by 3.',
      '"3 <b>more than</b>" means <b>add</b> 3. Very different answers.',
      'Read those words carefully — they decide the whole problem.'
    ], null),

    p('Factor pairs', [
      'Two numbers that multiply to make a number are a <b>factor pair</b>.',
      '24: 1×24, 2×12, 3×8, 4×6. That is <b>4 pairs</b>.',
      'Work up from 1 and you will not miss any.'
    ], null),

    p('Prime or composite', [
      'A <b>prime</b> number has only two factors: 1 and itself. 2, 3, 5, 7, 11 …',
      'A <b>composite</b> number has more. 12 has 1, 2, 3, 4, 6, 12.',
      'Try dividing by 2, 3, 5, 7. If nothing works, it is prime.'
    ], null),

    p('Patterns follow a rule', [
      'Find the <b>jump</b> between the numbers, then keep jumping.',
      '2, 5, 8, 11 … the rule is "add 3".',
      'Notice extras too: add 3 to an odd number and you get even, then odd again.'
    ], null)
  ]
};

export const hasLesson = id => Array.isArray(LESSONS[id]) && LESSONS[id].length > 0;
export const lessonLength = id => (LESSONS[id] || []).length;

/* ================= how to solve it =================
   Every question type in the game, with two routes to the answer:

     sure — the foundational one. Slower, but it shows WHY the answer is the
            answer, and it works when memory fails. This is the one to fall
            back on, and the one that makes the fast route make sense.
     fast — the efficient one. What you use once the idea is solid.

   Both are given, always, and in that order. A kid taught only the shortcut
   has nothing to fall back on; a kid taught only the long way stays slow. */

const s = (title, art, sure, fast) => ({ title, art, sure, fast });

export const SOLVE = {

  groups: [
    s('4 × 6 = ?', dotArray(4, 6),
      ['Skip-count by 6, four times: 6, 12, 18, <b>24</b>.',
       'Or draw 4 rows of 6 dots and count them all.'],
      ['Know it as a fact: 4 × 6 = 24.',
       'Or double twice: 6 doubled is 12, doubled again is 24.']),
    s('8 × 7 = ? (a hard one)', null,
      ['Skip-count by 7 eight times. Slow, but it always works.'],
      ['Split the 7 into 5 + 2, because ×5 is easy:',
       '(8 × 5) + (8 × 2) = 40 + 16 = <b>56</b>.']),
    s('24 ÷ 4 = ?', null,
      ['Deal 24 counters into 4 piles, one at a time, then count one pile.'],
      ['Flip it into a multiplication: 4 × ? = 24.',
       'Skip-count by 4 and track the jumps: 4, 8, 12, 16, 20, 24 — <b>6</b> jumps.']),
    s('8 × ? = 48', null,
      ['Skip-count by 8, counting the jumps, until you land on 48.'],
      ['A missing factor is a division: 48 ÷ 8 = <b>6</b>.'])
  ],

  place: [
    s('Round 47 to the nearest 10', null,
      ['Picture a number line. 47 sits between 40 and 50.',
       'Halfway is 45. 47 is past halfway, so it is closer to <b>50</b>.'],
      ['Look at the digit to the right of the tens: it is 7.',
       '<b>5 or more, round up.</b> So 50.']),
    s('What is 5,382 in expanded form?', null,
      ['Name each place out loud: 5 thousands, 3 hundreds, 8 tens, 2 ones.'],
      ['Each digit × its place: 5000 + 300 + 80 + 2.']),
    s('236 × 4 = ?', null,
      ['Break 236 into places and do three easy multiplications:',
       '(200 × 4) + (30 × 4) + (6 × 4) = 800 + 120 + 24 = <b>944</b>.'],
      ['Stack it and use the standard algorithm, carrying as you go.',
       'Same answer, fewer steps written down.']),
    s('23 apples, crates of 5', null,
      ['Take 5 away over and over: 23, 18, 13, 8, 3.',
       'That was 4 crates, with 3 left over.'],
      ['Divide: 23 ÷ 5 = 4 remainder 3.',
       'Check by multiplying back: 4 × 5 = 20, and 23 − 20 = 3.'])
  ],

  fracfront: [
    s('What fraction is the dot on?', numberLine(4, 3),
      ['Count the equal jumps from 0 to 1: there are 4. That is the bottom number.',
       'Now count jumps to the dot: 3. That is the top. So <b>3/4</b>.'],
      ['Bottom = how many parts the whole is cut into.',
       'Top = how far along you are.']),
    s('Is 1/2 the same as 2/4?', numberLine(4, 2),
      ['Find both on a number line. They land on the same point, so they are equal.'],
      ['Multiply top and bottom by the same number: 1/2 × 2/2 = 2/4.',
       'Same number, different name.']),
    s('3/8 + 2/8 = ?', fracBar(8, 5),
      ['Shade 3 eighths, then 2 more. Count the shaded pieces: <b>5</b> eighths.'],
      ['Bottoms match, so add the tops only: 3 + 2 = 5, over 8.',
       'The bottom never changes.']),
    s('3 × 2/5 = ?', fracBar(5, 2),
      ['2/5 three times: 2/5 + 2/5 + 2/5. Count the fifths: <b>6</b>.'],
      ['Multiply the top by 3, leave the bottom: 6/5.'])
  ],

  decimal: [
    s('3/10 = ?/100', fracBar(10, 3),
      ['Split every tenth into 10 smaller pieces. Now 3 tenths is 30 of them.'],
      ['Multiply top and bottom by 10: 30/100.']),
    s('Write 62/100 as a decimal', null,
      ['Say it out loud: "sixty-two hundredths".',
       'Hundredths need two spots after the dot: <b>0.62</b>.'],
      ['Denominator 100 means two decimal places. Drop the digits in: 0.62.']),
    s('Which is bigger, 0.7 or 0.68?', null,
      ['Give them the same number of places: 0.70 and 0.68.',
       'Now compare: 70 hundredths beats 68 hundredths.'],
      ['Compare tenths first: 7 tenths vs 6 tenths. <b>0.7 wins.</b>',
       'Only check hundredths if the tenths tie.'])
  ],

  clock: [
    s('3:15 to 3:50 — how long?', clockFace(3, 50),
      ['Count on in 5s from 3:15: 3:20, 3:25 … 3:50. That is 7 jumps of 5 = <b>35</b>.'],
      ['Same hour, so just subtract the minutes: 50 − 15 = 35.']),
    s('4:40 to 5:10 — how long?', null,
      ['Go to the next hour first: 4:40 to 5:00 is 20 minutes.',
       'Then 5:00 to 5:10 is 10 more. 20 + 10 = <b>30</b>.'],
      ['Bridge the hour. It is nearly always the quickest route.']),
    s('4 ft = ? inches', null,
      ['Add 12 four times: 12 + 12 + 12 + 12 = <b>48</b>.'],
      ['Bigger unit to smaller unit means multiply: 4 × 12 = 48.'])
  ],

  data: [
    s('How many more dogs than fish?', barGraph(['Cats', 'Dogs', 'Fish', 'Birds'], [15, 25, 10, 30], 5),
      ['Check the scale: each line is 5.',
       'Count up the dog bar: 25. Count the fish bar: 10. Then subtract.'],
      ['Read both values off the scale, subtract: 25 − 10 = <b>15</b>.',
       'Never count bar segments as 1 each — check the scale first.']),
    s('Reading a picture graph', pictograph(['Red', 'Blue', 'Green'], [15, 25, 10], 5),
      ['Point at each circle and count the key value: 5, 10, 15 …'],
      ['Count the circles, multiply by the key: 5 circles × 5 = <b>25</b>.']),
    s('Longest minus shortest', linePlot(8, [1, 0, 1, 0, 2, 0, 1, 0, 1], { unit: 'inches' }),
      ['Find the furthest-left X and the furthest-right X. Count the ticks between them.'],
      ['Read both labels, subtract the tops: 8/8 − 0/8.',
       'Bottoms match, so only the tops matter.'])
  ],

  area: [
    s('Area of a 6 by 4 rectangle', tiledRect(6, 4),
      ['Count every unit square. There are 24.'],
      ['Multiply the sides: 6 × 4 = <b>24</b> square units.']),
    s('Perimeter of a 5 by 3 rectangle', tiledRect(5, 3, { plain: true }),
      ['Walk the edge and add each side: 5 + 3 + 5 + 3 = <b>16</b>.'],
      ['Add one long and one short, then double: (5 + 3) × 2 = 16.']),
    s('Area is 24, one side is 6', null,
      ['Try numbers: 6 × 3 = 18, too small. 6 × 4 = 24. Found it.'],
      ['Divide: 24 ÷ 6 = <b>4</b>. A missing side is always a division.']),
    s('Area of an L-shape', rectilinearL(6, 2, 3, 2),
      ['Count all the unit squares, one at a time. Slow but certain.'],
      ['Split it into two rectangles: (6 × 2) + (3 × 2) = 12 + 6 = <b>18</b>.',
       'Areas add together.'])
  ],

  shapes: [
    s('Naming a quadrilateral', polygon('rhombus'),
      ['Count the sides. Four means quadrilateral.',
       'Then check: are all sides equal? Are the corners square? Which sides are parallel?'],
      ['Square: equal sides AND square corners.',
       'Rectangle: square corners. Rhombus: equal sides, tilted.',
       'Trapezoid: only one parallel pair.']),
    s('Is that a line of symmetry?', polygon('parallelogram', { mirror: [[84, 18], [84, 122]] }),
      ['Imagine actually folding along the dashed line. Do the halves land on top of each other?'],
      ['Look for a mirror. If one side is a reflection of the other, yes.',
       'Slanted parallelograms almost never work.']),
    s('Parallel or perpendicular?', linePair('perpendicular'),
      ['Extend both lines in your head. Do they ever meet?',
       'If they meet, is the corner square?'],
      ['Never meet → parallel.',
       'Meet at a square corner (look for the little box) → perpendicular.'])
  ],

  angles: [
    s('Naming an angle', angleArt(135),
      ['Hold the corner of a piece of paper against it. That corner is exactly 90°.',
       'Does the angle fit inside the paper corner, match it, or spill outside?'],
      ['Smaller than a square corner → acute.',
       'Exactly square → right. Wider → obtuse.']),
    s('Finding a missing angle', angleSplit(35, 40, '35°', '?'),
      ['The two parts together make the whole angle. Count up from 35 to the whole.'],
      ['Subtract: whole − known part = missing part.'])
  ],

  factors: [
    s('All the factor pairs of 24', null,
      ['Try every number from 1 upward: does 1 divide 24? 2? 3? 4? 5? 6?',
       'Write each pair down: 1×24, 2×12, 3×8, 4×6.'],
      ['Stop once the pair crosses over (4×6, then 6×4 repeats).',
       'That crossover point is around the square root.']),
    s('Is 51 prime?', null,
      ['Try dividing by every number up to 51. Certain, but slow.'],
      ['Only test 2, 3, 5, 7 (primes up to about √51).',
       '5 + 1 = 6, which divides by 3, so <b>51 divides by 3</b>. Composite.']),
    s('"4 times as many"', null,
      ['Draw 6 counters for Sam, then draw 4 groups of 6 for Dev. Count them all.'],
      ['"Times as many" → multiply: 6 × 4 = <b>24</b>.',
       '"More than" → add. Watch which words you got.'])
  ]
};

export const hasSolve = id => Array.isArray(SOLVE[id]) && SOLVE[id].length > 0;
