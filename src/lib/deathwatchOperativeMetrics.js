import { getDeathwatchVeteranGuide } from '../data/deathwatchVeteranGuides.js'

const ABILITY_KEYS = [
  'strength',
  'dexterity',
  'constitution',
  'intelligence',
  'wisdom',
  'charisma',
]

function parsePlusStat(value, fallback) {
  const match = `${value ?? ''}`.match(/(\d+)\+/)
  if (!match) return fallback
  return Number(match[1])
}

function parseMoveInches(value) {
  const match = `${value ?? ''}`.match(/(\d+)/)
  return match ? Number(match[1]) : 6
}

function parseNormalDamage(value) {
  const match = `${value ?? ''}`.match(/(\d+)\s*\/\s*(\d+)/)
  if (!match) return 0
  return Number(match[1])
}

function isPistolWeapon(weapon) {
  return /pistol/i.test(weapon?.name ?? '')
}

function pickPrimaryWeapon(operative) {
  const weapons = (operative?.weapons ?? []).filter((weapon) => !isPistolWeapon(weapon))
  if (!weapons.length) return null
  return weapons
    .slice()
    .sort((a, b) => {
      const damageDelta = parseNormalDamage(b.dmg) - parseNormalDamage(a.dmg)
      if (damageDelta !== 0) return damageDelta
      return (Number(b.atk) || 0) - (Number(a.atk) || 0)
    })[0]
}

function addWeight(weights, key, amount) {
  if (!ABILITY_KEYS.includes(key)) return
  weights[key] += amount
}

function scoreTextSignals(weights, content) {
  const text = (content ?? '').toLowerCase()
  if (!text) return

  if (/leader|strategic|ploy|cp/.test(text)) {
    addWeight(weights, 'charisma', 2)
    addWeight(weights, 'intelligence', 1)
  }
  if (/scrambler|auspex|scan|guard|marksman|overwatch/.test(text)) {
    addWeight(weights, 'wisdom', 2)
    addWeight(weights, 'intelligence', 1)
  }
  if (/conceal|charge|headtaker|flank|stealth/.test(text)) {
    addWeight(weights, 'dexterity', 2)
  }
  if (/storm shield|anchor|bodyguard|forgiving/.test(text)) {
    addWeight(weights, 'constitution', 2)
  }
  if (/gravis|heavy|artillery|big guns|hammer|frontliner/.test(text)) {
    addWeight(weights, 'constitution', 1)
    addWeight(weights, 'strength', 1)
  }
}

export function deriveDeathwatchOperativeMetrics(operative) {
  const keywords = `${operative?.keywords ?? ''}`.toUpperCase()
  const primaryWeapon = pickPrimaryWeapon(operative)
  const isRangedPrimary = /rng/i.test(primaryWeapon?.rules ?? '')
  const move = parseMoveInches(operative?.move)
  const save = parsePlusStat(operative?.save, 4)
  const wounds = Number(operative?.wounds) || 0

  return {
    id: operative?.id ?? '',
    role: operative?.role ?? '',
    move,
    save,
    wounds,
    hasGravis: keywords.includes('GRAVIS'),
    isLeader: keywords.includes('LEADER'),
    primaryWeapon,
    isRangedPrimary,
    primaryAtk: Number(primaryWeapon?.atk) || 0,
    primaryHit: parsePlusStat(primaryWeapon?.hit, 4),
    primaryDamage: parseNormalDamage(primaryWeapon?.dmg),
  }
}

export function scoreDeathwatchOperativeAbilities(operative) {
  const metrics = deriveDeathwatchOperativeMetrics(operative)
  const weights = {
    strength: 0,
    dexterity: 0,
    constitution: 0,
    intelligence: 0,
    wisdom: 0,
    charisma: 0,
  }

  if (metrics.save <= 2) addWeight(weights, 'constitution', 3)
  if (metrics.wounds >= 18) {
    addWeight(weights, 'constitution', 2)
    addWeight(weights, 'strength', 1)
  } else if (metrics.wounds >= 15) {
    addWeight(weights, 'constitution', 1)
  }
  if (metrics.hasGravis) {
    addWeight(weights, 'constitution', 2)
    addWeight(weights, 'strength', 1)
  }
  if (metrics.move >= 7) addWeight(weights, 'dexterity', 2)
  if (metrics.move <= 5) addWeight(weights, 'constitution', 1)

  if (metrics.isRangedPrimary) {
    addWeight(weights, 'dexterity', 2)
    if (metrics.primaryHit <= 2) addWeight(weights, 'dexterity', 1)
    if (metrics.primaryAtk >= 5) addWeight(weights, 'wisdom', 1)
  } else {
    addWeight(weights, 'strength', 2)
    if (metrics.primaryDamage >= 5) addWeight(weights, 'strength', 1)
  }

  if (metrics.isLeader) {
    addWeight(weights, 'charisma', 2)
    addWeight(weights, 'intelligence', 1)
  }

  scoreTextSignals(weights, operative?.abilities)
  const guide = getDeathwatchVeteranGuide(operative?.id)
  if (guide) {
    scoreTextSignals(weights, `${guide.tagline} ${guide.summary} ${guide.bestFor}`)
    guide.strengths?.forEach((item) => scoreTextSignals(weights, item))
    guide.considerations?.forEach((item) => scoreTextSignals(weights, item))
  }

  return { metrics, weights }
}

export function rankDeathwatchAbilities(weights) {
  return ABILITY_KEYS.slice().sort((a, b) => {
    if (weights[b] !== weights[a]) return weights[b] - weights[a]
    return a.localeCompare(b)
  })
}
