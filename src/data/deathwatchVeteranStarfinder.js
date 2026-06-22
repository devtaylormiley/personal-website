import { rankDeathwatchAbilities, scoreDeathwatchOperativeAbilities } from '../lib/deathwatchOperativeMetrics.js'
import {
  buildSf2eProfile,
  clampSf2eLevel,
} from '../lib/starfinderScores.js'
import { getFeatsForVeteranUpToLevel } from './deathwatchVeteranStarfinderBuilds.js'

export const VETERAN_CLASSES = {
  'imp-dw-sgt': 'envoy',
  'imp-dw-aeg': 'soldier',
  'imp-dw-blm': 'solarian',
  'imp-dw-bom': 'soldier',
  'imp-dw-brc': 'soldier',
  'imp-dw-dem': 'soldier',
  'imp-dw-dis': 'operative',
  'imp-dw-gnr': 'soldier',
  'imp-dw-htk': 'operative',
  'imp-dw-hsl': 'soldier',
  'imp-dw-mrk': 'operative',
}

export const CURATED_PRIORITY = {
  'imp-dw-sgt': ['charisma', 'wisdom', 'intelligence', 'constitution'],
  'imp-dw-aeg': ['strength', 'constitution', 'wisdom', 'dexterity'],
  'imp-dw-blm': ['dexterity', 'strength', 'wisdom', 'constitution'],
  'imp-dw-bom': ['dexterity', 'constitution', 'strength', 'wisdom'],
  'imp-dw-brc': ['strength', 'constitution', 'dexterity', 'wisdom'],
  'imp-dw-dem': ['strength', 'constitution', 'wisdom', 'intelligence'],
  'imp-dw-dis': ['dexterity', 'wisdom', 'intelligence', 'constitution'],
  'imp-dw-gnr': ['dexterity', 'constitution', 'wisdom', 'intelligence'],
  'imp-dw-htk': ['dexterity', 'wisdom', 'strength', 'constitution'],
  'imp-dw-hsl': ['dexterity', 'constitution', 'strength', 'wisdom'],
  'imp-dw-mrk': ['dexterity', 'wisdom', 'intelligence', 'constitution'],
}

const RATIONALE_BY_ID = {
  'imp-dw-sgt': 'Leader signals and command language weight CHA/INT; durability keeps CON relevant.',
  'imp-dw-aeg': '2+ save plus storm shield strongly favors CON; maul profile pushes STR.',
  'imp-dw-blm': 'Melee duelist profile with mobile pressure favors DEX/STR balance.',
  'imp-dw-bom': 'Gravis artillery durability and heavy weapon identity favor CON/STR.',
  'imp-dw-brc': 'Breaching Gravis profile blends CON/STR with tactical DEX.',
  'imp-dw-dem': 'Thunder hammer bruiser concentrates on STR/CON with disciplined support stats.',
  'imp-dw-dis': 'Scrambler control and highest movement place DEX/WIS/INT at the top.',
  'imp-dw-gnr': 'Plasma gunline profile favors DEX for attack reliability with CON fallback.',
  'imp-dw-htk': 'Stealth flanker and conceal charge plan prioritize DEX and battlefield awareness.',
  'imp-dw-hsl': 'Gravis anti-horde platform leans into CON/STR with targeting discipline.',
  'imp-dw-mrk': 'Guard-focused marksman profile naturally weights DEX/WIS/INT.',
}

export function resolveVeteranPriority(veteranId, operative) {
  const { weights } = operative ? scoreDeathwatchOperativeAbilities(operative) : { weights: {} }
  const ranked = rankDeathwatchAbilities(weights)
  return [...(CURATED_PRIORITY[veteranId] ?? []), ...ranked].filter(
    (key, index, all) => all.indexOf(key) === index,
  )
}

export function resolveStarfinderBuildAtLevel({
  veteranId,
  level = 1,
  sf2eClass,
  priority,
  operative,
}) {
  const resolvedId = veteranId ?? operative?.id ?? operative?.sourceVeteranId
  const resolvedClass = sf2eClass ?? VETERAN_CLASSES[resolvedId] ?? 'soldier'
  const resolvedPriority = priority ?? resolveVeteranPriority(resolvedId, operative)
  const clampedLevel = clampSf2eLevel(level)
  const profile = buildSf2eProfile({
    sf2eClass: resolvedClass,
    level: clampedLevel,
    priority: resolvedPriority,
    rationale: RATIONALE_BY_ID[resolvedId] ?? '',
  })

  return {
    ...profile,
    sourceVeteranId: resolvedId,
    priority: resolvedPriority,
    feats: getFeatsForVeteranUpToLevel(resolvedId, clampedLevel),
  }
}

export function deriveStarfinderProfileFromOperative(operative) {
  return resolveStarfinderBuildAtLevel({
    veteranId: operative?.id,
    level: 1,
    operative,
  })
}

export function applyStarfinderBuildToOperative(operative, level = operative?.level ?? 1) {
  const build = resolveStarfinderBuildAtLevel({
    veteranId: operative?.sourceVeteranId ?? operative?.id,
    level,
    sf2eClass: operative?.sf2eClass,
    priority: operative?.sf2ePriority,
    operative,
  })

  return {
    ...operative,
    scoringSystem: 'sf2e',
    sourceVeteranId: build.sourceVeteranId ?? operative?.sourceVeteranId,
    sf2eClass: build.sf2eClass,
    level: build.level,
    abilityScores: build.abilityScores,
    starfinderSaves: build.starfinderSaves,
    sf2ePriority: build.priority,
  }
}

export function getStarfinderProfileForVeteran(operativeId, operative) {
  if (!operative || operative.id !== operativeId) return null
  return deriveStarfinderProfileFromOperative(operative)
}

export const DEATHWATCH_VETERAN_IDS = Object.keys(VETERAN_CLASSES)
