/* Every word wrapped in {curly braces} in a passage gets a tap-for-meaning
   definition. The definitions are written for the sentence the word is in, not
   as dictionary entries, and they are written for a 3rd grade reader: short,
   plain, and using only easier words than the one being explained. */

export const GLOSSARY = {
  calm:      'Quiet and not upset. Not in a hurry.',
  shallow:   'Not deep. Water you could stand up in.',
  shade:     'A cool dark spot out of the sun.',
  clumsy:    'Likely to drop things or knock them over.',
  stiff:     'Held hard and straight. Not bending.',
  vine:      'A long bendy plant stem that spreads along the ground.',
  tunnel:    'A hole that goes along under the ground.',
  marsh:     'Soft wet land with tall grass growing in it.',
  glow:      'A soft light that stays on, like a night light.',
  ripe:      'Grown all the way and ready to eat.',
  tide:      'The way the sea rises and falls again every day.',
  hollow:    'A dip or a low hole in the ground.',
  gravel:    'Lots of little loose stones.',
  attention: 'Really looking and really listening, so you see what is there.',
  burrow:    'A hole an animal digs in the ground to live in.',
  fleece:    'A thick woolly coat, like a sheep has.',
  steady:    'Going on the same way without changing or wobbling.',

  /* The second batch, added because an 8 year old reading the meadow intake
     sign asked what "intake" meant and there was nothing to tap. The rule for
     picking these: a word he is unlikely to have met, in a sentence where not
     knowing it costs him the sentence. Place names and animal names are not in
     here -- those are learned from the story, and a definition for every long
     word turns a page into a wall of buttons. */
  intake:    'A place where water is taken in through a pipe.',
  screen:    'A cover full of little holes. Water goes through it and bits do not.',
  tally:     'A count kept by making one mark each time.',
  uniform:   'The same clothes that everybody in a group wears.',
  channel:   'A deep strip of water, like a road for boats.',
  crossing:  'A place built for getting over a gap or a river.',
  walkway:   'A path built up off the ground, so you can walk over wet places.',
  reeds:     'Tall thin grass that grows in wet ground.',
  springs:   'Places where fresh water comes up out of the ground.',
  firm:      'Hard enough to hold you up without sinking.',
  notice:    'A short message put up where people will read it.',
  orders:    'What somebody has been told they have to do.',
  uniforms:  'The same clothes that everybody in a group wears.',
  visitors:  'People who come to a place for a little while.',
  harmless:  'Not able to hurt anybody.',
  sorted:    'Put in order, with the same kinds together.',
  chalk:     'Soft white stone you can draw with.',
  summit:    'The very top of a hill.',
  bolted:    'Held on tight with metal pins called bolts.',
  wedged:    'Pushed into a tight space so it cannot move.',
  oiled:     'Rubbed with oil, which keeps the water out.',
  spare:     'An extra one, kept in case you need it.',
  stake:     'A pointed stick pushed down into the ground.',
  clump:     'A little group of plants growing right next to each other.',
  bunch:     'A group of berries growing together on one stem.',
  dusk:      'The end of the day, when the light is going.',
  patch:     'A small bit of ground that is not like the ground round it.',
  slime:     'A wet slippery coat, like the outside of a fish.',
  spade:     'A tool for digging. A shovel.',
  evenly:    'The same amount apart, or the same amount each.',
  drifts:    'Moves along slowly without trying, the way water carries a leaf.',
  tucked:    'Folded up and put away out of sight.',
  confused:  'Not sure what is going on.',
  sluice:    'A gate that lets water through when you open it.',
  ripples:   'Little waves moving out across the water.',
  buried:    'Covered over, under the ground or under a pile.',
  scratched: 'Cut a thin line into something with something sharp.',
  northwest: 'The direction halfway between north and west.',
  southeast: 'The direction halfway between south and east.',
  bed:       'A place where one kind of plant grows thickly.',
  kelp:      'A very tall seaweed. It grows up from the sea floor toward the light.',
  frond:     'One long leaf of a seaweed or a fern.',
  timbers:   'The big pieces of wood a boat is built out of.',
  stalk:     'The long stem a plant grows up on.',
  gentle:    'Careful and soft, and never rough.',
  season:    'One of the four parts of a year, like summer or winter.'
};

export function define(word) {
  return GLOSSARY[String(word).toLowerCase().replace(/[^a-z]/g, '')] || null;
}
