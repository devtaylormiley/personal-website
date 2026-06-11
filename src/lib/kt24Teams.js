export async function fetchKillTeamIndex() {
  const res = await fetch('/data/kt24/index.json')
  if (!res.ok) throw new Error('Could not load kill team index')
  return res.json()
}

export async function fetchOperativesIndex() {
  const res = await fetch('/data/kt24/operatives-index.json')
  if (!res.ok) throw new Error('Could not load operatives index')
  return res.json()
}

export async function fetchWeaponsIndex() {
  const res = await fetch('/data/kt24/weapons-index.json')
  if (!res.ok) throw new Error('Could not load weapons index')
  return res.json()
}

export async function fetchJointOpsIndex() {
  const res = await fetch('/data/kt24/joint-ops-index.json')
  if (!res.ok) throw new Error('Could not load joint-ops index')
  return res.json()
}

export async function fetchNpoIndex() {
  const res = await fetch('/data/kt24/npo-index.json')
  if (!res.ok) throw new Error('Could not load NPO index')
  return res.json()
}

export async function fetchEquipmentIndex() {
  const res = await fetch('/data/kt24/equipment-index.json')
  if (!res.ok) throw new Error('Could not load equipment index')
  return res.json()
}

export async function fetchJointOpPack(slug) {
  const res = await fetch(`/data/kt24/joint-ops/${slug}.json`)
  if (!res.ok) throw new Error(`Could not load joint-op pack: ${slug}`)
  return res.json()
}

export function collectWeaponOptions(sources) {
  const byName = new Map()
  for (const weapons of sources) {
    for (const weapon of weapons ?? []) {
      const name = weapon.name?.trim()
      if (!name) continue
      const key = name.toLowerCase()
      if (!byName.has(key)) {
        byName.set(key, {
          name,
          atk: weapon.atk ?? '',
          hit: weapon.hit ?? '',
          dmg: weapon.dmg ?? '',
          rules: weapon.rules ?? '',
        })
      }
    }
  }
  return [...byName.values()].sort((a, b) => a.name.localeCompare(b.name))
}

export async function fetchOfficialKillTeam(slug) {
  const res = await fetch(`/data/kt24/teams/${slug}.json`)
  if (!res.ok) throw new Error(`Could not load kill team: ${slug}`)
  return res.json()
}

export async function fetchOfficialOperative(teamSlug, operativeId) {
  const team = await fetchOfficialKillTeam(teamSlug)
  const operative = team.operatives?.find((op) => op.id === operativeId)
  if (!operative) throw new Error('Operative not found in team data.')
  return operative
}

export function mapOfficialOperativeToHomebrew(officialOp, { keepId }) {
  return {
    ...structuredClone(officialOp),
    id: keepId,
    cardType: 'custom',
    imageUrl: officialOp.imageUrl ?? '',
    notes: officialOp.notes ?? '',
  }
}

export function mapOfficialToHomebrew(official, { idPrefix = 'copy-op' } = {}) {
  const stamp = Date.now()
  return {
    killteamId: official.killteamId ?? null,
    factionId: official.factionId ?? null,
    killTeam: {
      name: official.killTeam.name,
      archetypes: official.killTeam.archetypes ?? '',
      description: official.killTeam.description ?? '',
      factionRuleName: official.killTeam.factionRuleName ?? 'Faction rules',
      factionRule: official.killTeam.factionRule ?? '',
      specialIssueAmmunition: official.killTeam.specialIssueAmmunition ?? '',
      ploys: official.killTeam.ploys ?? [],
      rosterNote: official.killTeam.rosterNote ?? '',
    },
    operatives: (official.operatives ?? []).map((op, index) => ({
      ...structuredClone(op),
      id: `${idPrefix}-${stamp}-${index}`,
      cardType: 'custom',
    })),
  }
}
