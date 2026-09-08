/* How long a tile takes, and the arithmetic for spending a frame on one.

   This is a module rather than four lines inside main.js because of the bug it
   is here to stop coming back. A tile almost never finishes exactly on a frame
   boundary, and the loop used to throw the remainder away and then spend a whole
   further frame doing nothing before starting the next tile. Every tile cost one
   frame more than it asked for: about 17ms on a 60Hz screen.

   Which sounds like nothing, and is a tenth of a walking step and a quarter of a
   riding one. 145 and 72 should be twice the speed; measured, they were an
   eighth apart, and the bicycle -- the one thing in the game you earn by reading
   something nobody made you read -- felt exactly like walking. A number that
   quietly means something other than what it says is worth a test, and a test
   needs something it can import. */

export const STEP_MS = 145;   // one tile, walking
export const RIDE_MS = 72;    // one tile, on the bicycle: twice walking, near enough

/* Spend dt milliseconds of a frame on a tile that is already t of the way done.
   Says where the tile got to, whether it landed, and how much of the frame is
   left over -- because a tile that lands halfway through a frame has to hand the
   rest to the tile after it, or that time is simply gone. */
export function advanceTile(t, dt, ms) {
  const now = t + dt / ms;
  if (now < 1) return { t: now, left: 0, landed: false };
  return { t: 1, left: (now - 1) * ms, landed: true };
}
