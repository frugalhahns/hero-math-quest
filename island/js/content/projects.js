/* Build projects. This is the loop that makes reading pay: a document tells you
   which two jobs a project needs, you go and earn the trust of animals who do
   those jobs, you assign them, and a barrier tile on the map turns into a path.
   `clear` rewrites tiles in the live world; `needs` are job keys from
   content/pokemon.js. */

export const PROJECTS = [
  {
    id: 'gate', name: 'The Windlass Gate', region: 'beach', regionName: 'Landing Beach',
    needs: ['scout', 'water'],
    needsItem: { key: 'crank', count: 1, label: 'the iron windlass crank' },
    learn: 'fieldguide',
    blurb: 'A counterweighted door shut across the channel above the beach.',
    brief: [
      'The chain is sound and the counterweight is where it should be. Two things are missing: nobody has looked up the channel to see whether the sluice above the gate is clear, and the drum bearing is bone dry and will seize the instant it takes load.',
      'One helper goes up and reports back. One finds fresh water — not sea water — for the bearing. Then you turn the crank.'
    ],
    finish: 'The drum takes up the chain, the counterweight sinks, and the door lifts clear of the channel. Beyond it, the ground rises into a hollow full of tall grass.',
    opens: 'Meadow Hollow',
    clear: { map: 'beach', from: '1', to: '=' }
  },
  {
    id: 'bridge', name: 'The Rope Crossing', region: 'meadow', regionName: 'Meadow Hollow',
    needs: ['haul', 'plant'],
    learn: 'cairns',
    blurb: 'A ravine on the west edge of the hollow, four metres across and deep.',
    brief: [
      'There are no planks on this island long enough to span it, and the anchor stones on both sides weigh more than a person can shift.',
      'Rope-grass, grown across in a season, will hold more than timber will. Something has to grow the line and something has to set the anchors.'
    ],
    finish: 'Rope-grass takes the far anchor on the second throw and thickens as you watch. The crossing sways, holds, and stops swaying.',
    opens: 'Whispering Grove',
    clear: { map: 'meadow', from: '2', to: '_' }
  },
  {
    id: 'boardwalk', name: 'The Reed Boardwalk', region: 'meadow', regionName: 'Meadow Hollow',
    needs: ['dig', 'scout'],
    learn: 'shrine',
    blurb: 'A wall of reeds east of the hollow, and open water somewhere behind it.',
    brief: [
      'Reed ground will not carry weight unless the pilings go down past the muck to firm clay, and no crew of people has ever managed to sink a piling out there.',
      'Someone has to find where the firm channel runs. Someone else has to drive the posts along it. Elm was clear that neither is any use without the other.'
    ],
    finish: 'The posts go down in a line so straight it looks surveyed. Planks follow. The reeds part on a marsh that goes on further than you expected.',
    opens: 'Brackish Marsh',
    clear: { map: 'meadow', from: '3', to: '_' }
  },
  {
    id: 'lantern', name: 'The Lantern Line', region: 'marsh', regionName: 'Brackish Marsh',
    needs: ['light', 'power'],
    learn: 'ledger',
    blurb: 'A tunnel at the south end of the marsh. Ninety metres of it, entirely dark.',
    brief: [
      'It floods at every high water, so this happens at night, at low tide, once. No lanterns go into the water — the ledger is emphatic about that.',
      'One helper carries the light. One helper charges it before you start, which means walking that helper a good distance first.'
    ],
    finish: 'The bulbs hold steady the whole ninety metres and dim, unasked, whenever you crouch to look at the floor. The tunnel opens into a cavern hung with salt crystal.',
    opens: 'Tidepool Caverns',
    clear: { map: 'marsh', from: '4', to: '_' }
  },
  {
    id: 'rockslide', name: 'The Ridge Trail Rockslide', region: 'grove', regionName: 'Whispering Grove',
    needs: ['shove', 'dig', 'haul'],
    learn: 'vault',
    blurb: 'Six seasons of collapsed hillside across the only route to the summit.',
    brief: [
      'Elm brought eight people and moved about a fifth of it. The blocks at the base are the problem: everything above them is resting on them, so they have to come out last and they have to come out whole.',
      'Something has to undercut the pile, something has to carry away what comes loose, and something has to move the base blocks. Three jobs, not two.'
    ],
    finish: 'It takes an afternoon. The Snorlax works without hurrying, sets the last base block down rather than dropping it, and walks back toward the caverns to sleep.',
    opens: 'Ashen Ridge',
    clear: { map: 'grove', from: '5', to: '=' }
  },
  {
    id: 'garden', name: 'The Hollow Garden', region: 'meadow', regionName: 'Meadow Hollow', optional: true,
    needs: ['plant', 'water'],
    blurb: 'Thin soil on the south slope of the hollow. Elm never got to it.',
    brief: [
      'This one is not on the way to anywhere and nothing is blocked by it. It is the last thing on Elm\'s list of intentions and the only item with no instructions attached.',
      'A planter and a water-finder could turn the south slope into something in a single season. Nobody is asking you to.'
    ],
    finish: 'By the end of the week the south slope is unrecognisable. Nothing on the island needed this. You did it anyway.',
    opens: null,
    paint: { map: 'meadow', from: '.', to: 'f', rect: [5, 14, 30, 21], chance: 0.45 }
  }
];

export const PROJECT_BY_ID = Object.fromEntries(PROJECTS.map(p => [p.id, p]));
