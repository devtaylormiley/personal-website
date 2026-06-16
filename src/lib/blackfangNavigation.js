export const CAMPAIGN_HUB_PATH = '/projects/blackfang-campaign'
export const PLAYER_OPERATIVES_PATH = `${CAMPAIGN_HUB_PATH}/player-operatives`

export const CAMPAIGN_NAV_HUB = {
  to: CAMPAIGN_HUB_PATH,
  label: 'Blackfang Campaign',
  title: 'Blackfang Campaign',
  icon: 'campaign',
  iconLabel: 'Blackfang Campaign',
  tone: 'green',
}

export const CAMPAIGN_HUB_SUBROUTES = [
  {
    to: 'about',
    label: 'Campaign Lore',
    title: 'Campaign lore',
    icon: 'lore',
    iconLabel: 'Campaign lore',
    pathMatch: '/about',
    tone: 'amber',
  },
  {
    to: 'party',
    label: 'Party',
    title: 'Party',
    icon: 'party',
    iconLabel: 'Party',
    pathMatch: '/party',
    tone: 'orange',
  },
  {
    to: 'player-operatives',
    label: 'Player Operatives',
    title: 'Player operatives',
    icon: 'user',
    iconLabel: 'Player Operatives',
    pathMatch: '/player-operatives',
    tone: 'violet',
  },
]

export const CAMPAIGN_SECTIONS = [
  {
    to: 'about',
    label: 'Campaign Lore',
    title: 'Campaign lore',
    breadcrumbLabel: 'Campaign Lore',
    icon: 'lore',
    iconLabel: 'Campaign lore',
    shell: 'lore',
    pathMatch: '/about',
    tone: 'amber',
  },
  {
    to: 'party',
    label: 'Party',
    title: 'Party',
    breadcrumbLabel: 'Party',
    icon: 'party',
    iconLabel: 'Party',
    shell: 'party',
    pathMatch: '/party',
    tone: 'orange',
  },
  {
    to: 'player-operatives',
    label: 'Player Operatives',
    title: 'Player operatives',
    breadcrumbLabel: 'Player Operatives',
    icon: 'user',
    iconLabel: 'Player Operatives',
    shell: 'player_operatives',
    pathMatch: '/player-operatives',
    tone: 'violet',
  },
  {
    to: 'kt24-data',
    label: 'KT24 Data',
    title: 'KT24 data registry',
    breadcrumbLabel: 'KT24 Data',
    icon: 'logbook',
    iconLabel: 'Data registry',
    shell: 'kt24_data',
    pathMatch: '/kt24-data',
    tone: 'cyan',
  },
]

export const CAMPAIGN_NAV_SECTIONS = CAMPAIGN_SECTIONS.filter(
  (section) => section.pathMatch === '/kt24-data',
)

export const KT24_REGISTRY_TABS = [
  { id: 'teams', label: 'Kill teams', iconLabel: 'Kill teams', tone: 'green' },
  { id: 'operatives', label: 'Operatives', iconLabel: 'Operatives', tone: 'orange' },
  { id: 'joint-npos', label: 'Joint-op NPOs', iconLabel: 'Joint-op NPOs', tone: 'amber' },
  { id: 'weapons', label: 'Weapons', iconLabel: 'Weapons', tone: 'violet' },
  { id: 'equipment', label: 'Equipment', iconLabel: 'Equipment', tone: 'cyan' },
]

export const KT24_REGISTRY_TAB_IDS = KT24_REGISTRY_TABS.map((t) => t.id)

export const CAMPAIGN_MODULE_TILES = [
  {
    to: `${CAMPAIGN_HUB_PATH}/about`,
    code: '01',
    title: 'Campaign Lore',
    description:
      'Setting, narrative frame, and mission background for the joint-operation in the Ghoul Stars.',
    iconLabel: 'Campaign Lore',
    tone: 'amber',
  },
  {
    to: `${CAMPAIGN_HUB_PATH}/party`,
    code: '02',
    title: 'Party',
    description:
      'Your active campaign squad — six operative slots under one kill team, ready for the table.',
    icon: 'party',
    iconLabel: 'Party',
    tone: 'orange',
  },
  {
    to: `${CAMPAIGN_HUB_PATH}/player-operatives`,
    code: '03',
    title: 'Player Operatives',
    description:
      'Create and edit custom player operative dataslates — build characters, clone official profiles, and assign kill teams.',
    icon: 'user',
    iconLabel: 'Player Operatives',
    tone: 'violet',
  },
  {
    to: `${CAMPAIGN_HUB_PATH}/kt24-data`,
    code: '04',
    title: 'KT24 Data Registry',
    description:
      'Official kill team rosters, operatives, joint-op NPOs, weapons, and equipment — plus homebrew teams when signed in.',
    icon: 'logbook',
    iconLabel: 'Data registry',
    tone: 'cyan',
  },
]

export const REGISTRY_MODULE_TILES = KT24_REGISTRY_TABS.map((tab, index) => ({
  to: registryTabToPath(tab.id),
  code: `04.${index + 1}`,
  title: tab.label,
  description: registryTileDescription(tab.id),
  iconLabel: tab.label,
  tone: tab.tone,
}))

function registryTileDescription(tabId) {
  switch (tabId) {
    case 'teams':
      return 'Browse official and homebrew kill teams; open dataslates or clone rosters for your narrative.'
    case 'operatives':
      return 'Search every player operative profile across rosters for quick reference at the table.'
    case 'joint-npos':
      return 'Non-player operatives and hostile profiles used in joint-operation scenarios.'
    case 'weapons':
      return 'Weapon rules and profiles shared across teams and custom entries.'
    case 'equipment':
      return 'Gear, wargear, and special issue kit referenced during missions.'
    default:
      return ''
  }
}

export function bfToneClass(tone = 'green') {
  return `bf-tone-${tone}`
}

export function isCampaignHub(pathname) {
  return pathname === CAMPAIGN_HUB_PATH || pathname === `${CAMPAIGN_HUB_PATH}/`
}

export function isHubBranch(pathname) {
  return (
    isCampaignHub(pathname) ||
    pathname.includes('/about') ||
    pathname.includes('/party') ||
    pathname.includes('/player-operatives')
  )
}

export function hubSubrouteIsActive(pathname, pathMatch) {
  return pathname.includes(pathMatch)
}

export function hubSubrouteToPath(subrouteTo) {
  return `${CAMPAIGN_HUB_PATH}/${subrouteTo}`
}

const BLACKFANG_RESERVED_SEGMENTS = new Set([
  'about',
  'party',
  'player-operatives',
  'kt24-data',
  'kill-teams',
  'section-3',
  'homebrew-operative',
  'homebrew',
  'deathwatch-veterans',
])

export function isKillTeamSlugPage(pathname) {
  const match = pathname.match(/^\/projects\/blackfang-campaign\/([^/]+)$/)
  if (!match) return false
  return !BLACKFANG_RESERVED_SEGMENTS.has(match[1])
}

export function isKt24Branch(pathname) {
  return (
    pathname.includes('/kt24-data') ||
    pathname.includes('/homebrew-operative/') ||
    pathname.includes('/homebrew/') ||
    isKillTeamSlugPage(pathname)
  )
}

export function sectionIsActive(pathname, section) {
  if (section.pathMatch === '/kt24-data') return isKt24Branch(pathname)
  return pathname.includes(section.pathMatch)
}

export function getCampaignSection(pathname, { returnTo } = {}) {
  if (isCampaignHub(pathname)) return null
  if (pathname.includes('/player-operatives')) {
    return CAMPAIGN_SECTIONS.find((s) => s.pathMatch === '/player-operatives') ?? null
  }
  if (pathname.includes('/homebrew-operative/') && returnTo === 'player-operatives') {
    return CAMPAIGN_SECTIONS.find((s) => s.pathMatch === '/player-operatives') ?? null
  }
  if (
    pathname.includes('/homebrew-operative/') ||
    pathname.includes('/homebrew/') ||
    isKillTeamSlugPage(pathname)
  ) {
    return CAMPAIGN_SECTIONS.find((s) => s.pathMatch === '/kt24-data') ?? null
  }
  return CAMPAIGN_SECTIONS.find((s) => pathname.includes(s.pathMatch)) ?? null
}

export function getRegistryTabId(pathname, { returnTo } = {}) {
  if (pathname.includes('/homebrew-operative/')) {
    return returnTo === 'player-operatives' ? null : 'operatives'
  }
  if (pathname.includes('/homebrew/') || isKillTeamSlugPage(pathname)) return 'teams'
  if (!pathname.includes('/kt24-data')) return null
  const match = pathname.match(/\/kt24-data\/([^/]+)/)
  const id = match?.[1]
  if (id && KT24_REGISTRY_TAB_IDS.includes(id)) return id
  return 'teams'
}

export function registryTabToPath(tabId) {
  if (!tabId || tabId === 'teams') return '/projects/blackfang-campaign/kt24-data'
  return `/projects/blackfang-campaign/kt24-data/${tabId}`
}

export function getRegistryTabLabel(tabId) {
  return KT24_REGISTRY_TABS.find((t) => t.id === tabId)?.label ?? null
}
