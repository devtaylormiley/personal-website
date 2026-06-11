/** Default ability scores before boosts are applied. */
export const DEFAULT_ABILITY_BASE = {
  strength: 10,
  dexterity: 10,
  constitution: 10,
  intelligence: 10,
  wisdom: 10,
  charisma: 10,
}

export const DEFAULT_ABILITY_SCORES_JSON = JSON.stringify(DEFAULT_ABILITY_BASE)

export const ABILITY_KEYS = [
  'strength',
  'dexterity',
  'constitution',
  'intelligence',
  'wisdom',
  'charisma',
]

export const ABILITY_META = {
  strength: { short: 'STR', label: 'Strength', role: 'Key Stat' },
  dexterity: { short: 'DEX', label: 'Dexterity', role: 'Secondary' },
  constitution: { short: 'CON', label: 'Constitution', role: 'Tertiary' },
  intelligence: { short: 'INT', label: 'Intelligence', role: 'Dump' },
  wisdom: { short: 'WIS', label: 'Wisdom', role: 'Utility' },
  charisma: { short: 'CHA', label: 'Charisma', role: 'Flaw' },
}

/** Levels at which four additional boosts become available. */
export const BOOST_LEVELS = [5, 10, 15, 20]

export const BOOST_ORDER = ['strength', 'dexterity', 'constitution', 'wisdom']

/** Starting boost allocation at level 1 (before level-tier grants). */
export const BASE_BOOST_ALLOCATION = 9

/** Additional boosts granted at each tier in {@link BOOST_LEVELS}. */
export const BOOSTS_PER_TIER = 4

/** Minimum value for an ability flaw (always −2 from baseline 10). */
export const ABILITY_SCORE_MIN_BELOW_TEN = 8

const ABILITY_META_KEYS = ['_flawKey']

export function maxAbilityScoreForLevel(level) {
  const lv = Math.min(20, Math.max(1, Number(level) || 1))
  if (lv <= 4) return 18
  if (lv <= 9) return 19
  if (lv <= 14) return 20
  if (lv <= 19) return 21
  return 22
}

export function totalBoostsForLevel(level) {
  const lv = Math.min(20, Math.max(1, Number(level) || 1))
  let total = BASE_BOOST_ALLOCATION
  for (const boostLevel of BOOST_LEVELS) {
    if (lv >= boostLevel) total += BOOSTS_PER_TIER
  }
  return total
}

export function abilityModifier(score) {
  return Math.floor((Number(score) - 10) / 2)
}

export function formatModifier(mod) {
  return mod >= 0 ? `+${mod}` : `${mod}`
}

export function formatAbilityScore(score) {
  const mod = abilityModifier(score)
  return `${score} / ${formatModifier(mod)}`
}

/** +2 while score is 18 or lower; +1 once score is 19+. */
export function applyBoost(score) {
  return score >= 18 ? score + 1 : score + 2
}

/** Undo one boost step (inverse of {@link applyBoost}). */
export function reverseBoost(score) {
  if (score <= 10) return score
  if (score >= 19) return score - 1
  return score - 2
}

export function applyAbilityFlaw(score) {
  if (score === 10) return ABILITY_SCORE_MIN_BELOW_TEN
  return score
}

export function getFlawKey(scores) {
  if (scores?._flawKey && ABILITY_KEYS.includes(scores._flawKey)) {
    return scores._flawKey
  }
  return ABILITY_KEYS.find((key) => scores?.[key] === ABILITY_SCORE_MIN_BELOW_TEN) ?? null
}

export function hasAbilityFlaw(scores) {
  return getFlawKey(scores) != null
}

function boostsSpentFromBase(target, base) {
  if (target === base) return 0
  if (target < base) return Infinity

  let current = base
  let boosts = 0
  while (current < target) {
    current = applyBoost(current)
    boosts += 1
    if (boosts > 32) return Infinity
  }
  return current === target ? boosts : Infinity
}

export function boostsSpentOnStat(scores, key) {
  const score = Number(scores[key])
  if (!Number.isFinite(score)) return 0
  if (score === ABILITY_SCORE_MIN_BELOW_TEN) return 0

  return boostsSpentFromBase(score, 10)
}

export function totalBoostsSpent(scores) {
  return ABILITY_KEYS.reduce((sum, key) => sum + boostsSpentOnStat(scores, key), 0)
}

export function availableBoosts(scores, level) {
  const pool = totalBoostsForLevel(level)
  const spent = totalBoostsSpent(scores)
  const flawCredit = hasAbilityFlaw(scores) ? 1 : 0
  return pool - spent + flawCredit
}

export function isValidBoostScore(score) {
  const value = Number(score)
  if (!Number.isFinite(value)) return false
  if (value === ABILITY_SCORE_MIN_BELOW_TEN || value === 10) return true
  return boostsSpentFromBase(value, 10) !== Infinity
}

export function stripAbilityScoreMeta(scores) {
  const next = { ...scores }
  for (const key of ABILITY_META_KEYS) delete next[key]
  return next
}

export function normalizeAbilityScores(scores, level = 1) {
  if (!scores || typeof scores !== 'object') {
    return { ...DEFAULT_ABILITY_BASE }
  }

  const merged = { ...DEFAULT_ABILITY_BASE }
  for (const key of ABILITY_KEYS) {
    const value = Number(scores[key])
    if (Number.isFinite(value)) merged[key] = value
  }

  const flawKey = getFlawKey(scores)
  if (flawKey) merged._flawKey = flawKey

  return merged
}

export function clampAbilityScore(value, level = 20) {
  const max = maxAbilityScoreForLevel(level)
  const next = Math.min(max, Math.max(1, Number(value) || 10))
  if (next < 10) return Math.max(ABILITY_SCORE_MIN_BELOW_TEN, next)
  return next
}

export function clampAbilityScoresToLevel(scores, level) {
  const normalized = normalizeAbilityScores(scores, level)
  const clamped = {}
  for (const key of ABILITY_KEYS) {
    clamped[key] = clampAbilityScore(normalized[key], level)
  }

  const flawKey = getFlawKey(normalized)
  if (flawKey) clamped._flawKey = flawKey

  return clamped
}

function finalizeAbilityScores(scores) {
  const next = { ...scores }
  if (!next._flawKey) delete next._flawKey
  return next
}

export function adjustAbilityScoreWithBoost(scores, key, direction, level) {
  const normalized = normalizeAbilityScores(scores, level)
  const maxScore = maxAbilityScoreForLevel(level)
  const score = normalized[key]
  const flawKey = getFlawKey(normalized)
  const next = { ...normalized }

  if (direction > 0) {
    if (score === ABILITY_SCORE_MIN_BELOW_TEN && flawKey === key) {
      next[key] = 10
      delete next._flawKey
      return finalizeAbilityScores(next)
    }

    if (availableBoosts(normalized, level) <= 0) return normalized

    const boosted = applyBoost(score)
    if (boosted > maxScore) return normalized

    next[key] = boosted
    return finalizeAbilityScores(next)
  }

  if (direction < 0) {
    if (score === ABILITY_SCORE_MIN_BELOW_TEN) return normalized

    if (score === 10 && boostsSpentOnStat(normalized, key) === 0) {
      if (flawKey && flawKey !== key) return normalized
      next[key] = ABILITY_SCORE_MIN_BELOW_TEN
      next._flawKey = key
      return finalizeAbilityScores(next)
    }

    if (score > 10) {
      next[key] = reverseBoost(score)
      return finalizeAbilityScores(next)
    }
  }

  return normalized
}

export function canIncreaseAbilityScore(scores, key, level) {
  const normalized = normalizeAbilityScores(scores, level)
  const score = normalized[key]
  const maxScore = maxAbilityScoreForLevel(level)
  const flawKey = getFlawKey(normalized)

  if (score === ABILITY_SCORE_MIN_BELOW_TEN && flawKey === key) {
    return 10 <= maxScore
  }

  if (availableBoosts(normalized, level) <= 0) return false

  if (score >= maxScore) return false
  return applyBoost(score) <= maxScore
}

export function canDecreaseAbilityScore(scores, key) {
  const normalized = normalizeAbilityScores(scores)
  const score = normalized[key]
  const flawKey = getFlawKey(normalized)

  if (score === ABILITY_SCORE_MIN_BELOW_TEN) return false
  if (score > 10) return true
  if (score === 10 && boostsSpentOnStat(normalized, key) === 0) {
    return !flawKey || flawKey === key
  }
  return false
}

export function getAbilityScoreValidationIssues(scores, level = 1) {
  const normalized = normalizeAbilityScores(scores, level)
  const issues = []
  const belowTen = ABILITY_KEYS.filter((key) => normalized[key] < 10)
  const maxScore = maxAbilityScoreForLevel(level)
  const flawKey = getFlawKey(normalized)
  const spent = totalBoostsSpent(normalized)

  if (belowTen.length > 1) {
    issues.push('Only one ability score may be below 10 (ability flaw).')
  }

  const underMin = belowTen.filter((key) => normalized[key] < ABILITY_SCORE_MIN_BELOW_TEN)
  if (underMin.length > 0) {
    const labels = underMin.map((key) => ABILITY_META[key].short).join(', ')
    issues.push(`Ability flaws cannot be less than ${ABILITY_SCORE_MIN_BELOW_TEN} (${labels}).`)
  }

  if (flawKey && normalized[flawKey] !== ABILITY_SCORE_MIN_BELOW_TEN) {
    issues.push('Ability flaw marker does not match a score of 8.')
  }

  const overMax = ABILITY_KEYS.filter((key) => normalized[key] > maxScore)
  if (overMax.length > 0) {
    const labels = overMax.map((key) => ABILITY_META[key].short).join(', ')
    issues.push(`At level ${level}, no score may exceed ${maxScore} (${labels}).`)
  }

  const invalid = ABILITY_KEYS.filter((key) => !isValidBoostScore(normalized[key]))
  if (invalid.length > 0) {
    const labels = invalid.map((key) => ABILITY_META[key].short).join(', ')
    issues.push(`Scores must follow boost steps (+2 until 18, then +1): ${labels}.`)
  }

  if (availableBoosts(normalized, level) < 0) {
    issues.push(`Boosts spent (${spent}) exceed the amount available at level ${level}.`)
  }

  return issues
}

/** Example progression from the campaign table (auto-applied boosts at tier levels). */
export function computeAbilityScores(level, base = DEFAULT_ABILITY_BASE) {
  const scores = { ...DEFAULT_ABILITY_BASE, ...base }
  const clampedLevel = Math.min(20, Math.max(1, Number(level) || 1))

  for (const boostLevel of BOOST_LEVELS) {
    if (clampedLevel >= boostLevel) {
      for (const key of BOOST_ORDER) {
        scores[key] = applyBoost(scores[key])
      }
    }
  }

  return scores
}

export function resolveOperativeAbilityScores(operative) {
  const level = Math.min(20, Math.max(1, Number(operative?.level) || 1))
  if (operative?.abilityScores && typeof operative.abilityScores === 'object') {
    return normalizeAbilityScores(operative.abilityScores, level)
  }
  return { ...DEFAULT_ABILITY_BASE }
}
