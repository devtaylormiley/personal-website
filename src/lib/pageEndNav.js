import { CAMPAIGN_HUB_PATH } from './blackfangNavigation'

const BLACKFANG_RESERVED_SEGMENTS = new Set([
  'about',
  'party',
  'kt24-data',
  'kill-teams',
  'section-3',
  'homebrew-operative',
  'deathwatch-veterans',
])

function normalizePath(pathname) {
  if (!pathname || pathname === '/') return '/'
  return pathname.replace(/\/+$/, '') || '/'
}

/** Routes that have nested pages beneath them — no “back to parent” float on these. */
export function pathHasChildRoutes(pathname) {
  const path = normalizePath(pathname)

  if (path === '/') return true
  if (path === '/projects/ux') return true
  if (path === CAMPAIGN_HUB_PATH) return true
  if (path === `${CAMPAIGN_HUB_PATH}/kt24-data`) return true

  return false
}

function isKillTeamSlugPage(pathname) {
  const match = pathname.match(/^\/projects\/blackfang-campaign\/([^/]+)$/)
  if (!match) return false
  const segment = match[1]
  return !BLACKFANG_RESERVED_SEGMENTS.has(segment) && !segment.startsWith('homebrew')
}

/**
 * Parent link for leaf routes only (null when at a section hub or home).
 * @returns {{ to: string, label: string } | null}
 */
export function getParentRouteNav(pathname) {
  const path = normalizePath(pathname)

  if (pathHasChildRoutes(path)) return null

  if (path.startsWith('/projects/ux/') && path !== '/projects/ux') {
    return { to: '/projects/ux', label: 'UI/UX improvements' }
  }

  if (path === '/projects/schema-bridge') {
    return { to: '/#projects', label: 'Projects' }
  }

  if (path === `${CAMPAIGN_HUB_PATH}/about` || path === `${CAMPAIGN_HUB_PATH}/party`) {
    return { to: CAMPAIGN_HUB_PATH, label: 'Blackfang Campaign' }
  }

  const kt24TabMatch = path.match(/^\/projects\/blackfang-campaign\/kt24-data\/([^/]+)$/)
  if (kt24TabMatch) {
    return { to: `${CAMPAIGN_HUB_PATH}/kt24-data`, label: 'KT24 Data' }
  }

  if (/^\/projects\/blackfang-campaign\/homebrew\/[^/]+$/.test(path)) {
    return { to: `${CAMPAIGN_HUB_PATH}/kt24-data/teams`, label: 'Kill teams' }
  }

  if (/^\/projects\/blackfang-campaign\/homebrew-operative\/[^/]+$/.test(path)) {
    return { to: `${CAMPAIGN_HUB_PATH}/party`, label: 'Party' }
  }

  if (isKillTeamSlugPage(path)) {
    return { to: `${CAMPAIGN_HUB_PATH}/kt24-data/teams`, label: 'Kill teams' }
  }

  return null
}
