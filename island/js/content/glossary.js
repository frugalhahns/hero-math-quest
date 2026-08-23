/* Every word wrapped in {curly braces} in a passage gets a tap-for-meaning
   definition. Definitions are written for the sentence the word appears in,
   not as dictionary entries -- a word means one thing at a time. */

export const GLOSSARY = {
  ubiquitous:  'Found everywhere; present in every part of a place.',
  innocuous:   'Harmless. Not likely to cause any damage or offence.',
  deliberate:  'Done on purpose, with intention behind it.',
  coerced:     'Forced. Made to do something against your will.',
  reciprocal:  'Going both ways. Each side gives something and gets something.',
  buckle:      'To bend or collapse under a weight that is too heavy.',
  yield:       'The amount something produces. (It can also mean "to give in" — not here.)',
  malicious:   'Meaning to cause harm; spiteful.',
  reservoir:   'A store of something held back and drawn on later.',
  conjecture:  'A guess or opinion formed without proof.',
  brackish:    'Slightly salty. The mix you get where fresh water meets the sea.',
  vestigial:   'Left over from an earlier form and no longer serving its first purpose.',
  aromatic:    'Strongly and distinctly scented.',
  credential:  'Evidence that proves you are qualified or entitled to something.'
};

export function define(word) {
  return GLOSSARY[String(word).toLowerCase().replace(/[^a-z]/g, '')] || null;
}
