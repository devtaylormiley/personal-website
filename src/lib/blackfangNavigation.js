export const CAMPAIGN_HUB_PATH = '/projects/blackfang-campaign'

export const CAMPAIGN_NAV_HUB = {
  to: CAMPAIGN_HUB_PATH,
  label: 'Blackfang Campaign',
  title: 'Blackfang Campaign',
  icon: 'campaign',
  iconLabel: 'Blackfang Campaign',
}

export const CAMPAIGN_HUB_SUBROUTES = [
  {
    to: 'about',
    label: 'Campaign Lore',
    title: 'Campaign lore',
    icon: 'lore',
    iconLabel: 'Campaign lore',
    pathMatch: '/about',
  },
  {
    to: 'party',
    label: 'Party',
    title: 'Party',
    icon: 'party',
    iconLabel: 'Party',
    pathMatch: '/party',
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
  },
]

export const CAMPAIGN_NAV_SECTIONS = CAMPAIGN_SECTIONS.filter(
  (section) => section.pathMatch === '/kt24-data',
)

export const KT24_REGISTRY_TABS = [
  { id: 'teams', label: 'Kill teams', iconLabel: 'Kill teams' },
  { id: 'operatives', label: 'Operatives', iconLabel: 'Operatives' },
  { id: 'joint-npos', label: 'Joint-op NPOs', iconLabel: 'Joint-op NPOs' },
  { id: 'weapons', label: 'Weapons', iconLabel: 'Weapons' },
  { id: 'equipment', label: 'Equipment', iconLabel: 'Equipment' },
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
  },
  {
    to: `${CAMPAIGN_HUB_PATH}/party`,
    code: '02',
    title: 'Party',
    description:
      'Your active campaign squad — six operative slots under one kill team, ready for the table.',
    icon: 'party',
    iconLabel: 'Party',
  },
  {
    to: `${CAMPAIGN_HUB_PATH}/kt24-data`,
    code: '03',
    title: 'KT24 Data Registry',
    description:
      'Official kill team rosters, operatives, joint-op NPOs, weapons, and equipment — plus homebrew teams when signed in.',
    icon: 'logbook',
    iconLabel: 'Data registry',
  },
]

export const REGISTRY_MODULE_TILES = KT24_REGISTRY_TABS.map((tab, index) => ({
  to: registryTabToPath(tab.id),
  code: `03.${index + 1}`,
  title: tab.label,
  description: registryTileDescription(tab.id),
  iconLabel: tab.label,
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

export function isCampaignHub(pathname) {
  return pathname === CAMPAIGN_HUB_PATH || pathname === `${CAMPAIGN_HUB_PATH}/`
}

export function isHubBranch(pathname) {
  return (
    isCampaignHub(pathname) ||
    pathname.includes('/about') ||
    pathname.includes('/party')
  )
}

export function hubSubrouteIsActive(pathname, pathMatch) {
  return pathname.includes(pathMatch)
}

export function hubSubrouteToPath(subrouteTo) {
  return `${CAMPAIGN_HUB_PATH}/${subrouteTo}`
}

export function isKt24Branch(pathname) {
  return (
    pathname.includes('/kt24-data') ||
    pathname.includes('/homebrew-operative/') ||
    pathname.includes('/homebrew/')
  )
}

export function sectionIsActive(pathname, section) {
  if (section.pathMatch === '/kt24-data') return isKt24Branch(pathname)
  return pathname.includes(section.pathMatch)
}

export function getCampaignSection(pathname) {
  if (isCampaignHub(pathname)) return null
  if (pathname.includes('/homebrew-operative/') || pathname.includes('/homebrew/')) {
    return CAMPAIGN_SECTIONS.find((s) => s.pathMatch === '/kt24-data') ?? null
  }
  return CAMPAIGN_SECTIONS.find((s) => pathname.includes(s.pathMatch)) ?? null
}

export function getRegistryTabId(pathname) {
  if (pathname.includes('/homebrew-operative/')) return 'operatives'
  if (pathname.includes('/homebrew/')) return 'teams'
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
