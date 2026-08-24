/* Build projects. This is the loop that makes the reading pay off: a document
   tells you which two jobs a project needs, you go and earn the trust of
   animals who do those jobs, you put them on the job, and a blocked tile on
   the map turns into a path.

   `needs` are job keys from content/pokemon.js. `opens` must match a region
   name in content/entities.js exactly -- the self test walks the whole chain
   through those names to prove the game is still finishable in order.
   Keep `brief` to two short lines: this screen has the crew picker under it,
   so it is not paged like the documents are. */

export const PROJECTS = [
  {
    id: 'gate', name: 'The Channel Gate', region: 'beach', regionName: 'Landing Beach',
    needs: ['scout', 'water'],
    needsItem: { key: 'crank', count: 1, label: 'the iron handle' },
    learn: 'fieldguide',
    blurb: 'A heavy door shut across the channel above the beach.',
    brief: [
      'The chain is fine and the weights are where they should be. Two things are missing. Nobody has been up the channel to check that it is clear, and the drum is bone dry.',
      'One helper goes up and comes back. One helper finds fresh water for the drum. Then you turn the handle.'
    ],
    finish: 'The drum winds up the chain. The weights sink down and the door lifts up out of the channel. Past it, the ground rises into a hollow full of tall grass.',
    opens: 'Meadow Hollow',
    clear: { map: 'beach', from: '1', to: '=' }
  },
  {
    id: 'bridge', name: 'The Rope Crossing', region: 'meadow', regionName: 'Meadow Hollow',
    needs: ['haul', 'plant'],
    learn: 'cairns',
    blurb: 'A gap on the west edge of the hollow. Four steps across, and deep.',
    brief: [
      'There are no boards on this island long enough to reach. And the anchor stones on both sides weigh more than a person can shift.',
      'Rope grass will hold more than wood will. So somebody has to grow the line, and somebody has to set the stones.'
    ],
    finish: 'The rope grass catches the far stone on the second throw and thickens while you watch. The crossing sways, holds, and then stops swaying.',
    opens: 'Whispering Grove',
    clear: { map: 'meadow', from: '2', to: '_' }
  },
  {
    id: 'boardwalk', name: 'The Reed Walkway', region: 'meadow', regionName: 'Meadow Hollow',
    needs: ['dig', 'scout'],
    learn: 'shrine',
    blurb: 'A wall of reeds east of the hollow, with open water somewhere behind it.',
    brief: [
      'Reed ground will not hold any weight unless the posts go down past the mud to firm clay. No group of people has ever gotten a post in out there.',
      'Somebody has to find where the firm line runs. Somebody else has to sink the posts along it.'
    ],
    finish: 'The posts go down in a line so straight it looks measured. Boards follow. The reeds open up on a marsh that goes further than you expected.',
    opens: 'Reed Marsh',
    clear: { map: 'meadow', from: '3', to: '_' }
  },
  {
    id: 'lantern', name: 'The Light Line', region: 'marsh', regionName: 'Reed Marsh',
    needs: ['light', 'power'],
    learn: 'ledger',
    blurb: 'A tunnel at the south end of the marsh. Dark the whole way through.',
    brief: [
      'It floods at every high tide, so this happens at night, at low water, once. No lanterns go in the water. The notebook is very clear about that.',
      'One helper carries the light. One helper charges it first, which means walking that helper a good long way.'
    ],
    finish: 'The lights hold steady the whole way, and dim on their own every time you crouch down to look at the floor. The tunnel opens into a cave hung with salt crystals.',
    opens: 'Tidepool Caves',
    clear: { map: 'marsh', from: '4', to: '_' }
  },
  {
    id: 'rockslide', name: 'The Rock Slide', region: 'grove', regionName: 'Whispering Grove',
    needs: ['shove', 'dig', 'haul'],
    learn: 'vault',
    blurb: 'Six years of fallen hillside across the only path to the top.',
    brief: [
      'Elm brought eight people and moved about a fifth of it. The blocks at the bottom are the problem. Everything above is resting on them, so they come out last and they come out whole.',
      'Somebody digs under the pile. Somebody carries away what comes loose. Somebody moves the big blocks. Three jobs, not two.'
    ],
    finish: 'It takes one afternoon. The Snorlax never hurries, sets the last block down instead of dropping it, and walks back toward the caves to sleep.',
    opens: 'Ash Ridge',
    clear: { map: 'grove', from: '5', to: '=' }
  },
  {
    id: 'garden', name: 'The Hollow Garden', region: 'meadow', regionName: 'Meadow Hollow', optional: true,
    needs: ['plant', 'water'],
    blurb: 'Thin dirt on the south slope of the hollow. Elm never got to it.',
    brief: [
      'This one is not on the way to anywhere and nothing is blocked by it. It is the last thing on Elm\'s list, and the only one with no instructions.',
      'A planter and a water finder could turn the south slope into something in one summer. Nobody is asking you to.'
    ],
    finish: 'By the end of the week the south slope looks like a different place. Nothing on this island needed this. You did it anyway.',
    opens: null,
    paint: { map: 'meadow', from: '.', to: 'f', rect: [5, 14, 30, 21], chance: 0.45 }
  }
];

export const PROJECT_BY_ID = Object.fromEntries(PROJECTS.map(p => [p.id, p]));
