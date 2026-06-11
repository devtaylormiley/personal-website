import { DEFAULT_ABILITY_BASE } from './abilityScores'

export function makeDefaultHomebrewOperative(index = 0) {
  return {
    opTypeId: '',
    name: `Homebrew Operative ${index + 1}`,
    category: 'po',
    cardType: 'custom',
    role: 'Specialist',
    points: 0,
    apl: 2,
    move: '6"',
    save: '4+',
    wounds: 8,
    keywords: '',
    weapons: [],
    abilities: '',
    notes: '',
    imageUrl: '',
  }
}

export function makeDefaultBlackshieldOperative(slotIndex = 0, overrides = {}) {
  return {
    ...makeDefaultHomebrewOperative(slotIndex),
    name: `Blackshield ${slotIndex + 1}`,
    role: 'Blackshield',
    keywords: 'BLACKSHIELD, ADEPTUS ASTARTES',
    isBlackshield: true,
    level: 1,
    abilityScores: { ...DEFAULT_ABILITY_BASE },
    formerChapter: '',
    backstory: '',
    ...overrides,
  }
}
