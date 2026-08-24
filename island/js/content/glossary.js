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
  glow:      'A soft steady light, like a night light.',
  ripe:      'Grown all the way and ready to eat.',
  tide:      'The way the sea rises and falls again every day.',
  hollow:    'A dip or a low hole in the ground.',
  gravel:    'Lots of little loose stones.',
  attention: 'Really looking and really listening, so you notice things.'
};

export function define(word) {
  return GLOSSARY[String(word).toLowerCase().replace(/[^a-z]/g, '')] || null;
}
