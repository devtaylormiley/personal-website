import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

import {
  CURATED_PRIORITY,
  DEATHWATCH_VETERAN_IDS,
  deriveStarfinderProfileFromOperative,
  resolveStarfinderBuildAtLevel,
} from '../data/deathwatchVeteranStarfinder.js'
import { getFeatsForVeteranUpToLevel } from '../data/deathwatchVeteranStarfinderBuilds.js'
import {
  SF2E_LEVEL_ONE,
  SF2E_POPULAR_LEVEL_ONE_ARRAY,
  computeAbilityScoresAtLevel,
  computeSf2eSaves,
  resolveSf2eClassProfile,
} from './starfinderScores.js'

async function loadDeathwatchOperatives() {
  const raw = await readFile(
    new URL('../../public/data/kt24/teams/deathwatch.json', import.meta.url),
    'utf8',
  )
  const team = JSON.parse(raw)
  return team.operatives ?? []
}

test('SF2e save formula uses level, ability mod, and proficiency', () => {
  const saves = computeSf2eSaves({
    abilityScores: {
      strength: 18,
      dexterity: 14,
      constitution: 16,
      intelligence: 10,
      wisdom: 12,
      charisma: 8,
    },
    level: SF2E_LEVEL_ONE,
    saveProficiencies: resolveSf2eClassProfile('soldier'),
  })

  assert.equal(saves.fortitude, 17)
  assert.equal(saves.reflex, 14)
  assert.equal(saves.will, 13)
})

test('level 1 popular array spreads 18,16,14,12,10,8 by priority', () => {
  const scores = computeAbilityScoresAtLevel(CURATED_PRIORITY['imp-dw-aeg'], 1)
  const spread = Object.values(scores).sort((a, b) => b - a)
  assert.equal(spread.join(','), SF2E_POPULAR_LEVEL_ONE_ARRAY.join(','))
  assert.equal(scores.strength, 18)
})

test('level 5 boost increases primary ability for Aegis veteran', () => {
  const atOne = computeAbilityScoresAtLevel(CURATED_PRIORITY['imp-dw-aeg'], 1)
  const atFive = computeAbilityScoresAtLevel(CURATED_PRIORITY['imp-dw-aeg'], 5)
  assert.equal(atOne.strength, 18)
  assert.equal(atFive.strength, 19)
})

test('level 10 applies second priority boost for Aegis veteran', () => {
  const atFive = computeAbilityScoresAtLevel(CURATED_PRIORITY['imp-dw-aeg'], 5)
  const atTen = computeAbilityScoresAtLevel(CURATED_PRIORITY['imp-dw-aeg'], 10)
  assert.equal(atFive.constitution, 16)
  assert.equal(atTen.constitution, 18)
})

test('saves increase with operative level', () => {
  const buildOne = resolveStarfinderBuildAtLevel({
    veteranId: 'imp-dw-aeg',
    level: 1,
    sf2eClass: 'soldier',
  })
  const buildTen = resolveStarfinderBuildAtLevel({
    veteranId: 'imp-dw-aeg',
    level: 10,
    sf2eClass: 'soldier',
  })
  assert.ok(buildTen.starfinderSaves.fortitude > buildOne.starfinderSaves.fortitude)
  assert.ok(buildTen.starfinderSaves.reflex > buildOne.starfinderSaves.reflex)
  assert.ok(buildTen.starfinderSaves.will > buildOne.starfinderSaves.will)
})

test('every Deathwatch veteran has a valid level-1 SF2e profile', async () => {
  const operatives = await loadDeathwatchOperatives()
  const ids = new Set(operatives.map((entry) => entry.id))

  assert.equal(DEATHWATCH_VETERAN_IDS.length, 11)
  for (const id of DEATHWATCH_VETERAN_IDS) {
    assert.equal(ids.has(id), true, `Missing operative ${id} in deathwatch.json`)
    const operative = operatives.find((entry) => entry.id === id)
    const profile = deriveStarfinderProfileFromOperative(operative)
    const spread = Object.values(profile.abilityScores).sort((a, b) => b - a)

    assert.equal(profile.level, SF2E_LEVEL_ONE)
    assert.equal(typeof profile.sf2eClass, 'string')
    assert.equal(spread.join(','), SF2E_POPULAR_LEVEL_ONE_ARRAY.join(','))
    assert.equal(typeof profile.starfinderSaves.fortitude, 'number')
    assert.equal(typeof profile.starfinderSaves.reflex, 'number')
    assert.equal(typeof profile.starfinderSaves.will, 'number')
  }
})

test('all veterans have feat data through level 20', () => {
  for (const id of DEATHWATCH_VETERAN_IDS) {
    const feats = getFeatsForVeteranUpToLevel(id, 20)
    assert.ok(feats.length > 0, `Expected feats for ${id}`)
    assert.ok(feats.some((feat) => feat.level === 1), `Expected level-1 feat for ${id}`)
    assert.ok(feats.some((feat) => feat.level === 20), `Expected level-20 feat for ${id}`)
  }
})

test('lower level shows fewer feats than level 20', () => {
  for (const id of DEATHWATCH_VETERAN_IDS) {
    const atThree = getFeatsForVeteranUpToLevel(id, 3)
    const atTwenty = getFeatsForVeteranUpToLevel(id, 20)
    assert.ok(atThree.length < atTwenty.length, `Expected fewer feats at level 3 for ${id}`)
    assert.ok(atThree.every((feat) => feat.level <= 3))
  }
})
