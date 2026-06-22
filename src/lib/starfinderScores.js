import { ABILITY_KEYS, ABILITY_META } from './abilityScores.js'

export { ABILITY_KEYS }

export const SF2E_LEVEL_ONE = 1
export const SF2E_MAX_LEVEL = 20
export const SF2E_MIN_SCORE = 8
export const SF2E_BOOST_LEVELS = [5, 10, 15, 20]
export const SF2E_POPULAR_LEVEL_ONE_ARRAY = [18, 16, 14, 12, 10, 8]

export const SF2E_SAVE_TO_ABILITY = {
  fortitude: 'constitution',
  reflex: 'dexterity',
  will: 'wisdom',
}

export const SF2E_PROFICIENCY_BONUS = {
  trained: 1,
  expert: 3,
  master: 5,
  legendary: 7,
}

export const SF2E_CLASS_SAVE_PROFILES = {
  envoy: { fortitude: 'trained', reflex: 'trained', will: 'expert' },
  soldier: { fortitude: 'expert', reflex: 'trained', will: 'trained' },
  solarian: { fortitude: 'trained', reflex: 'expert', will: 'trained' },
  operative: { fortitude: 'trained', reflex: 'expert', will: 'trained' },
}

/** Class save proficiency upgrades at higher levels (community build tracks). */
export const SF2E_CLASS_SAVE_UPGRADES = {
  envoy: [
    { atLevel: 9, save: 'will', proficiency: 'master' },
    { atLevel: 17, save: 'reflex', proficiency: 'expert' },
  ],
  soldier: [
    { atLevel: 9, save: 'reflex', proficiency: 'expert' },
    { atLevel: 17, save: 'fortitude', proficiency: 'master' },
    { atLevel: 19, save: 'fortitude', proficiency: 'legendary' },
  ],
  solarian: [
    { atLevel: 9, save: 'reflex', proficiency: 'master' },
    { atLevel: 13, save: 'fortitude', proficiency: 'expert' },
  ],
  operative: [
    { atLevel: 9, save: 'will', proficiency: 'expert' },
    { atLevel: 13, save: 'reflex', proficiency: 'master' },
    { atLevel: 17, save: 'will', proficiency: 'master' },
  ],
}

export function clampSf2eLevel(level) {
  return Math.min(SF2E_MAX_LEVEL, Math.max(1, Number(level) || SF2E_LEVEL_ONE))
}

export function maxAbilityScoreForSf2eLevel(level) {
  const lv = clampSf2eLevel(level)
  if (lv <= 4) return 18
  if (lv <= 9) return 19
  if (lv <= 14) return 20
  if (lv <= 19) return 21
  return 22
}

export function abilityModifier(score) {
  return Math.floor((Number(score) - 10) / 2)
}

export function applySf2eBoost(score) {
  const value = Number(score) || 10
  return value >= 18 ? value + 1 : value + 2
}

export function normalizeSf2eAbilityScores(scores, level = SF2E_MAX_LEVEL) {
  const maxScore = maxAbilityScoreForSf2eLevel(level)
  const normalized = {}
  for (const key of ABILITY_KEYS) {
    const value = Number(scores?.[key])
    if (!Number.isFinite(value)) {
      normalized[key] = 10
      continue
    }
    const rounded = Math.round(value / 2) * 2
    normalized[key] = Math.max(SF2E_MIN_SCORE, Math.min(maxScore, rounded))
  }
  return normalized
}

export function orderAbilityPriority(priorityKeys) {
  return [...(priorityKeys ?? [])]
    .filter((key) => ABILITY_KEYS.includes(key))
    .concat(ABILITY_KEYS.filter((key) => !(priorityKeys ?? []).includes(key)))
}

export function applyPopularLevelOneArray(priorityKeys) {
  const ordered = orderAbilityPriority(priorityKeys)
  const scores = {}
  for (let i = 0; i < ABILITY_KEYS.length; i += 1) {
    scores[ordered[i]] = SF2E_POPULAR_LEVEL_ONE_ARRAY[i]
  }
  return normalizeSf2eAbilityScores(scores, SF2E_LEVEL_ONE)
}

export function computeAbilityScoresAtLevel(priorityKeys, level) {
  const ordered = orderAbilityPriority(priorityKeys)
  let scores = applyPopularLevelOneArray(priorityKeys)
  const clampedLevel = clampSf2eLevel(level)

  SF2E_BOOST_LEVELS.forEach((milestone, index) => {
    if (clampedLevel < milestone) return
    const key = ordered[index % ordered.length]
    const boosted = applySf2eBoost(scores[key])
    scores[key] = Math.min(boosted, maxAbilityScoreForSf2eLevel(clampedLevel))
  })

  return normalizeSf2eAbilityScores(scores, clampedLevel)
}

export function saveLabel(saveKey) {
  if (saveKey === 'fortitude') return 'Fort'
  if (saveKey === 'reflex') return 'Ref'
  return 'Will'
}

export function classLabel(classKey) {
  if (!classKey) return 'Unknown'
  return classKey.charAt(0).toUpperCase() + classKey.slice(1)
}

export function resolveSf2eClassProfile(classKey) {
  return { ...(SF2E_CLASS_SAVE_PROFILES[classKey] ?? SF2E_CLASS_SAVE_PROFILES.soldier) }
}

export function resolveSaveProficienciesAtLevel(classKey, level) {
  const profs = resolveSf2eClassProfile(classKey)
  const clampedLevel = clampSf2eLevel(level)
  for (const upgrade of SF2E_CLASS_SAVE_UPGRADES[classKey] ?? []) {
    if (clampedLevel >= upgrade.atLevel && upgrade.save in profs) {
      profs[upgrade.save] = upgrade.proficiency
    }
  }
  return profs
}

export function computeSf2eSaves({ abilityScores, level = SF2E_LEVEL_ONE, saveProficiencies, sf2eClass }) {
  const normalized = normalizeSf2eAbilityScores(abilityScores, level)
  const profs =
    saveProficiencies ??
    (sf2eClass ? resolveSaveProficienciesAtLevel(sf2eClass, level) : resolveSf2eClassProfile('soldier'))
  const clampedLevel = clampSf2eLevel(level)
  const saves = {}

  for (const [saveKey, abilityKey] of Object.entries(SF2E_SAVE_TO_ABILITY)) {
    const proficiencyName = profs[saveKey] ?? 'trained'
    const proficiencyBonus = SF2E_PROFICIENCY_BONUS[proficiencyName] ?? SF2E_PROFICIENCY_BONUS.trained
    saves[saveKey] = 10 + clampedLevel + abilityModifier(normalized[abilityKey]) + proficiencyBonus
  }

  return saves
}

export function buildSf2eProfile({
  sf2eClass,
  abilityScores,
  level = SF2E_LEVEL_ONE,
  rationale = '',
  priority,
}) {
  const normalizedClass = sf2eClass ?? 'soldier'
  const clampedLevel = clampSf2eLevel(level)
  const normalizedScores = priority
    ? computeAbilityScoresAtLevel(priority, clampedLevel)
    : normalizeSf2eAbilityScores(abilityScores, clampedLevel)
  const saveProficiencies = resolveSaveProficienciesAtLevel(normalizedClass, clampedLevel)

  return {
    sf2eClass: normalizedClass,
    level: clampedLevel,
    abilityScores: normalizedScores,
    starfinderSaves: {
      ...computeSf2eSaves({
        abilityScores: normalizedScores,
        level: clampedLevel,
        saveProficiencies,
      }),
      manual: false,
    },
    rationale,
    saveProficiencies,
  }
}

export function abilityShortLabel(key) {
  return ABILITY_META[key]?.short ?? key.slice(0, 3).toUpperCase()
}
