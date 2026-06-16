/** Community-facing breakdowns to help new players pick a Deathwatch veteran archetype. */
export const DEATHWATCH_TEAM_SLUG = 'deathwatch'

export const DEATHWATCH_VETERAN_GUIDES = {
  'imp-dw-sgt': {
    tagline: 'The battlefield coordinator',
    summary:
      'Brings extra wargear flexibility and one-time free ploy plays — ideal if you like calling the shots and squeezing value from CP.',
    strengths: ['Extra equipment pick', 'One free strategy + firefight ploy each per battle', 'Strong all-round statline (3 APL)'],
    considerations: ['Leader-style payoff — you get more from planning turns ahead', 'Plasma pistol needs mode management'],
    bestFor: 'Players who enjoy tactics, ploys, and flexible loadouts.',
  },
  'imp-dw-aeg': {
    tagline: 'The unmovable anchor',
    summary:
      '2+ save with storm shield makes this the toughest generalist bodyguard on the roster — hold doors, soak shots, and protect key operatives.',
    strengths: ['Best save in the roster (2+)', 'Storm shield softens Piercing', 'Reliable bolt pistol + power maul'],
    considerations: ['Lower damage output than specialists', 'Wants positioning to block lanes and tie up shooters'],
    bestFor: 'New players who want a forgiving, hard-to-kill frontliner.',
  },
  'imp-dw-blm': {
    tagline: 'The duelist blender',
    summary:
      'Xenophase blade chains extra Fight actions in crowds — a high-skill melee piece that can wipe multiple targets in one activation.',
    strengths: ['Phase Sweep snowballs in brawls', 'Adaptive Swordsmanship ignores Hit penalties', 'Lethal 5+ on melee'],
    considerations: ['Must reach combat to shine', 'Complex ability timing — read Phase Sweep carefully'],
    bestFor: 'Aggressive players comfortable with Fight action sequencing.',
  },
  'imp-dw-bom': {
    tagline: 'The Gravis artillery piece',
    summary:
      'Slow but carries a frag cannon with shell and shrapnel profiles — excellent for deleting elite targets or clearing clumps at range.',
    strengths: ['High wound count (18)', 'Frag cannon versatility (Prc1 vs Tor 2")', 'Only one Gravis slot — big threat'],
    considerations: ['Move 5" — plan routes early', 'Gravis limits team composition to one heavy armoured vet'],
    bestFor: 'Players who like big guns and deliberate positioning.',
  },
  'imp-dw-brc': {
    tagline: 'The breaching specialist',
    summary:
      'Gravis operative with grenade launcher, hellstorm bolt rifle, and melta bomb — cracks tough targets and clears lanes into objectives.',
    strengths: ['Melta bomb deletes heavy targets', 'Hellstorm bolt rifle with Torrent', 'Flexible krak/frag launcher'],
    considerations: ['Melta bomb is single-use pressure — time it well', 'Also uses the lone Gravis slot'],
    bestFor: 'Objective rushers who want a toolbox for breaking stalemates.',
  },
  'imp-dw-dem': {
    tagline: 'The hammer that keeps swinging',
    summary:
      'Heavy thunder hammer specialist that gets Ceaseless on Charge and Brutal while fighting — a straightforward “run in and smash” profile.',
    strengths: ['Stun + Shock on hammer', 'Charge synergy (Ceaseless)', 'Aggressive Force reduces chip damage in fights'],
    considerations: ['Hit 4+ — needs setup or buffs', 'Single weapon profile — all-in on melee'],
    bestFor: 'Players who want a simple, explosive melee plan.',
  },
  'imp-dw-dis': {
    tagline: 'The tempo thief',
    summary:
      'Fastest baseline move (7") with omni-scrambler activation denial and cheap Auspex Scan support — controls when the enemy gets to act.',
    strengths: ['7" Move for flanks and scrambles', 'Omni-scrambler delays enemy activations', 'Lower wounds but harder to pin down'],
    considerations: ['Lower wounds (13) — avoid getting focused', 'Scrambler is a Strategic Gambit — pick the right target'],
    bestFor: 'Experienced players who like disruption and map control.',
  },
  'imp-dw-gnr': {
    tagline: 'The plasma brick',
    summary:
      'Heavy plasma incinerator with standard and supercharge — a mid-range delete button that rewards safe angles and target priority.',
    strengths: ['5 attacks at 3+ with Prc1', 'Supercharge for Lethal 5+ burst', 'Solid general statline'],
    considerations: ['Hot on supercharge — know when to risk it', 'Wants lines without return fire'],
    bestFor: 'Shooting players who like one strong “turn on” weapon.',
  },
  'imp-dw-htk': {
    tagline: 'The concealed assassin',
    summary:
      'Can Charge under Conceal and punishes unaware targets with bonus strikes — a mobile knife fighter for picking off stragglers.',
    strengths: ['Conceal Charge bypasses normal restrictions', '7" Move + grav-chute vertical mobility', 'Bonus strike when unseen'],
    considerations: ['Lower wounds (13)', 'Needs terrain and order manipulation to stay hidden'],
    bestFor: 'Flankers who enjoy stealthy eliminations.',
  },
  'imp-dw-hsl': {
    tagline: 'The anti-horde platform',
    summary:
      'Gravis infernus heavy bolter with flame, focused, and sweep modes — built to erase infantry clusters and control chokepoints.',
    strengths: ['Sat + Tor2" flame mode for groups', 'Multiple bolter profiles for different targets', '18 wounds stays on board'],
    considerations: ['Move 5" and Gravis slot commitment', 'Multiple profiles — learn when to swap'],
    bestFor: 'Players facing lots of low-wound targets or tight corridors.',
  },
  'imp-dw-mrk': {
    tagline: 'The overwatch sentinel',
    summary:
      'Stalker bolt rifle with mobile and heavy modes plus enhanced Guard — excellent at locking down lanes and punishing movement.',
    strengths: ['Heavy mode: 2+ hit, Lethal 5+, PrcCrit1', 'Vigilant Marksman improves Guard play', 'Strong at holding vantage points'],
    considerations: ['Less mobile than Disruptor/Headtaker', 'Rewards patient positioning over rushing objectives'],
    bestFor: 'Defensive players and newcomers who prefer “anchor and shoot.”',
  },
}

export function getDeathwatchVeteranGuide(operativeId) {
  return DEATHWATCH_VETERAN_GUIDES[operativeId] ?? null
}
