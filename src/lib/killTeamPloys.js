const LEGACY_PLOY_PREFIX = /^strategy\s*\/\s*firefight\s*ploys:\s*/i

export const PLOYS_SECTION_TITLE = 'Strategy / firefight ploys'

function normalizePloy(entry) {
  if (!entry) return null
  const name = (entry.name ?? entry.ployName ?? '').trim()
  if (!name) return null
  return {
    name,
    description: (entry.description ?? '').trim(),
    type: entry.type ?? null,
  }
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
    .map((name) => ({ name, description: '', type: null }))
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
        return { name: block, description: '', type: null }
      }
      return {
        name: block.slice(0, colon).trim(),
        description: block.slice(colon + 2).trim(),
        type: null,
      }
    })
    .filter((p) => p.name)
}

export function ployTooltip(ploy) {
  const desc = ploy.description?.trim()
  if (!desc) return 'No description available.'
  if (ploy.type === 'strategy') return `Strategy ploy — ${desc}`
  if (ploy.type === 'firefight') return `Firefight ploy — ${desc}`
  return desc
}
