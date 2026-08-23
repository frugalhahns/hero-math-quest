/* The residents' artwork.
   These are the Generation V sprites from the PokeAPI/sprites repository
   (https://github.com/PokeAPI/sprites), vendored into sprites/ so the game
   still works with no network. They are animated GIFs, already tightly
   cropped, between 31 and 75 pixels tall.

   They are NOT drawn into the world canvas. The canvas is 16px tiles upscaled
   by CSS with nearest-neighbour, so squeezing a 48px sprite down to 22px and
   then blowing it back up would throw away the detail and then magnify what
   was left. Instead the sprites are <img> elements positioned over the canvas,
   which keeps them crisp at any window size and animates them for free.

   js/pixels.js still holds a hand-drawn 16x16 sprite for every resident. That
   is the fallback the canvas draws if one of these files fails to load, so a
   missing image can never make a resident invisible and unfindable. */

export const DEX = {
  bulbasaur: 1,
  pidgey: 16,
  pikachu: 25,
  diglett: 50,
  psyduck: 54,
  machop: 66,
  ditto: 132,
  snorlax: 143,
  chikorita: 152,
  chinchou: 170,
  wooper: 194
};

/* On-screen height in map tiles, out on the island. Set by eye rather than
   from the sprite files: the GIF canvases include room for each animation's
   bounce, so their pixel heights are a poor guide to how big the animal
   should look. The player is one tile, so these read as a little larger than
   the kid, and Snorlax reads as a wall. */
export const TILES_TALL = {
  diglett: 1.1,
  ditto: 1.2,
  wooper: 1.35,
  chinchou: 1.4,
  pidgey: 1.4,
  bulbasaur: 1.5,
  chikorita: 1.5,
  pikachu: 1.5,
  psyduck: 1.7,
  machop: 1.7,
  snorlax: 2.8
};

export function animUrl(id) { return `sprites/anim/${DEX[id]}.gif`; }
export function stillUrl(id) { return `sprites/still/${DEX[id]}.png`; }

/* Anything in here failed to load, so the canvas should draw the hand-drawn
   fallback for it instead of leaving an empty tile. */
const broken = new Set();
export function markBroken(id) { broken.add(id); }
export function isBroken(id) { return broken.has(id); }

/* A sprite sized to fill a square box in the sheet UI. object-fit keeps the
   aspect ratio, so a Diglett is scaled up to the box and a Snorlax down. */
export function creatureImg(id, px = 64, extra = '') {
  if (!DEX[id]) return '';
  return `<img class="mon" src="${animUrl(id)}" alt="" width="${px}" height="${px}" ${extra}>`;
}
