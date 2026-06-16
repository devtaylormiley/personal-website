const LEGACY_PLOY_PREFIX = /^strategy\s*\/\s*firefight\s*ploys:\s*/i

export const PLOYS_SECTION_TITLE = 'Strategy / firefight ploys'

/** @typedef {'strategy' | 'firefight' | null} PloyType */

function normalizePloy(entry) {
  if (!entry) return null
  const name = (entry.name ?? entry.ployName ?? '').trim()
  if (!name) return null
  const type = entry.type ?? ployTypeFromApiCode(entry.ployType) ?? null
  return {
    name,
    description: (entry.description ?? '').trim(),
    type,
    cpCost: entry.cpCost ?? defaultCpCost(type),
    ployId: entry.ployId ?? null,
  }
}

function ployTypeFromApiCode(code) {
  if (code === 'S') return 'strategy'
  if (code === 'T') return 'firefight'
  return null
}

/** Default CP cost when not stored — KT24 core rules. */
function defaultCpCost(type) {
  if (type === 'strategy') return 0
  if (type === 'firefight') return 1
  return null
}

export function getPloyTypeLabel(type) {
  if (type === 'strategy') return 'Strategy ploy'
  if (type === 'firefight') return 'Firefight ploy'
  return 'Ploy'
}

export function getPloyCpShortLabel(ploy) {
  if (ploy.type === 'strategy') return '0'
  if (ploy.cpCost === 1) {
    if (/costs?\s+(?:you\s+)?0\s*CP/i.test(ploy.description ?? '')) {
      return '1 (0*)'
    }
    return '1'
  }
  if (ploy.cpCost === 0) return '0*'
  return '—'
}

export function getPloyUsageHint(description) {
  const text = description?.trim() ?? ''
  if (!text) return null
  const oncePerBattle = text.match(/once per battle[^.]*\./i)
  if (oncePerBattle) return oncePerBattle[0].trim()
  const oncePerTurningPoint = text.match(/once per turning point[^.]*\./i)
  if (oncePerTurningPoint) return oncePerTurningPoint[0].trim()
  return null
}

/** @param {string | undefined} raw */
export function parseLegacyPloyNames(raw) {
  const text = raw?.trim() ?? ''
  if (!text) return []
  const stripped = text.replace(LEGACY_PLOY_PREFIX, '').trim()
  if (!stripped) return []
  return stripped
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)
    .map((name) => ({ name, description: '', type: null, cpCost: null }))
}

/** @param {{ name: string, description?: string, type?: string | null }[]} ploys */
export function partitionKillTeamPloys(ploys) {
  const strategy = []
  const firefight = []

  for (const ploy of ploys ?? []) {
    if (ploy.type === 'firefight') {
      firefight.push(ploy)
    } else {
      strategy.push(ploy)
    }
  }

  return { strategy, firefight }
}

/** @param {{ ploys?: { name: string, description?: string, type?: string | null }[], specialIssueAmmunition?: string } | undefined} killTeam */
export function resolveKillTeamPloys(killTeam) {
  if (Array.isArray(killTeam?.ploys) && killTeam.ploys.length) {
    return killTeam.ploys.map(normalizePloy).filter(Boolean)
  }
  return parseLegacyPloyNames(killTeam?.specialIssueAmmunition)
}

/** @param {{ name: string, description?: string, type?: string | null }[]} ploys */
export function formatPloysForEdit(ploys) {
  return ploys
    .map((p) => {
      const name = p.name?.trim()
      if (!name) return ''
      const desc = p.description?.trim()
      return desc ? `${name}: ${desc}` : name
    })
    .filter(Boolean)
    .join('\n\n')
}

/** @param {string} raw */
export function parsePloysFromEditText(raw) {
  if (!raw?.trim()) return []

  return raw
    .split(/\n\n+/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      const colon = block.indexOf(': ')
      if (colon === -1) {
        return { name: block, description: '', type: null, cpCost: null }
      }
      return {
        name: block.slice(0, colon).trim(),
        description: block.slice(colon + 2).trim(),
        type: null,
        cpCost: null,
      }
    })
    .filter((p) => p.name)
}

