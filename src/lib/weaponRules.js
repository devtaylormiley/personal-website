const RULE_EXPLANATIONS = {
  accurate: 'You can retain one attack die result without rolling it.',
  bal: 'You can re-roll one of your attack dice.',
  blas: 'On a hit, this weapon can also affect nearby operatives within the listed distance.',
  bru: 'Your opponent can only block with critical successes.',
  ceaseless: 'You can re-roll all attack dice results of 1.',
  dev: 'Each retained critical success inflicts additional mortal damage.',
  hvy: 'This weapon is less effective after moving (core Heavy restriction applies).',
  hot: 'After resolving attacks, your operative can suffer damage from overheating.',
  lethal: 'Normal hits of the listed value or higher become critical hits.',
  obscured: 'Attacks against obscured targets are restricted as defined by the core rules.',
  piercing: 'The target retains fewer defense dice equal to the Piercing value.',
  'piercing crits': 'Critical hits reduce retained defense dice by the listed value.',
  prc: 'The target retains fewer defense dice equal to the Piercing value.',
  range: 'Maximum distance in inches this weapon can target.',
  relentless: 'You can re-roll any or all of your attack dice.',
  rending: 'If you retain any critical successes, you can retain one normal success as a critical success.',
  rng: 'Maximum distance in inches this weapon can target.',
  sat: 'The target cannot retain cover saves against this attack.',
  severe: 'If you retain any critical successes, you can retain one normal success as a critical success.',
  silent: 'Allows an operative to perform a Shoot action even when they have a Conceal order.',
  stun: 'Can reduce enemy APL or apply stun effects per core rule.',
  tor: 'Hits can chain to additional nearby operatives in sequence.',
}

const RULE_KEYS = Object.keys(RULE_EXPLANATIONS)

export function splitWeaponRules(raw) {
  if (!raw) return []
  return raw
    .split(',')
    .map((r) => r.trim())
    .filter(Boolean)
}

export function describeWeaponRule(rule) {
  const lower = rule.toLowerCase()
  const key = RULE_KEYS.find((k) => lower.startsWith(k))
  return key
    ? RULE_EXPLANATIONS[key]
    : 'Rule description unavailable. Add this rule to the glossary for custom tooltip text.'
}
