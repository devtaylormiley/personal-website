/**
 * Fetches Kill Team 2024 roster data from KTDash and writes JSON under public/data/kt24/.
 * Run: npm run sync:kt24
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const API = 'https://ktdash.app/api/killteams'
const OUT_DIR = join(process.cwd(), 'public', 'data', 'kt24')
const TEAMS_DIR = join(OUT_DIR, 'teams')
const JOINT_OPS_DIR = join(OUT_DIR, 'joint-ops')

const JOINT_OP_IDS = ['SPEC-NPO', 'SPEC-AMB', 'SPEC-ARCH', 'SPEC-TITUS']

/** Joint-op packs not yet on KTDash; JSON lives in public/data/kt24/joint-ops/ */
const MANUAL_JOINT_OP_SLUGS = [
  'shadow-hunt-mission-pack',
  'terror-on-devlan-mission-pack',
  'nemesis-operatives-expansion-pack',
]

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function transformWeapons(weapons = []) {
  const rows = []
  for (const weapon of weapons) {
    for (const profile of weapon.profiles ?? []) {
      const label = profile.profileName?.trim()
      const name = label ? `${weapon.wepName} (${label})` : weapon.wepName
      rows.push({
        name,
        atk: Number(profile.ATK) || profile.ATK,
        hit: profile.HIT,
        dmg: profile.DMG,
        rules: profile.WR ?? '',
      })
    }
  }
  return rows
}

function collectFactionRules(opTypes) {
  const seen = new Set()
  const rules = []
  for (const op of opTypes) {
    for (const ability of op.abilities ?? []) {
      if (!ability.isFactionRule || seen.has(ability.abilityName)) continue
      seen.add(ability.abilityName)
      rules.push(`${ability.abilityName}: ${ability.description}`)
    }
  }
  return rules.join('\n\n')
}

function stripMarkup(html) {
  return (html ?? '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/\r/g, '')
    .trim()
}

function transformOperative(op, killteamName, { category = 'po' } = {}) {
  const operativeAbilities = (op.abilities ?? []).filter((a) => !a.isFactionRule)
  const abilities = operativeAbilities
    .map((a) => `${a.abilityName}: ${a.description}`)
    .join('\n\n')

  let name
  if (category === 'npo') {
    name = op.opTypeName
  } else {
    const prefix = killteamName.replace(/\s+kill\s*team$/i, '').trim()
    name = op.opTypeName.match(new RegExp(`^${prefix}`, 'i'))
      ? op.opTypeName
      : `${prefix} ${op.opTypeName}`.replace(/\s+/g, ' ').trim()
  }

  return {
    id: op.opTypeId.toLowerCase(),
    opTypeId: op.opTypeId,
    name,
    category,
    cardType: 'official',
    role: op.opTypeName,
    points: op.basesize ?? 0,
    imageUrl: '',
    apl: op.APL,
    move: op.MOVE,
    save: op.SAVE,
    wounds: op.WOUNDS,
    keywords: op.keywords ?? '',
    weapons: transformWeapons(op.weapons),
    abilities,
    notes: '',
  }
}

function ployTypeFromApi(type) {
  if (type === 'S') return 'strategy'
  if (type === 'T') return 'firefight'
  return null
}

function transformPloys(detail) {
  return (detail.ploys ?? [])
    .filter((p) => !p.isFactionRule)
    .map((p) => ({
      name: p.ployName?.trim() ?? '',
      description: stripMarkup(p.description ?? ''),
      type: ployTypeFromApi(p.ployType),
    }))
    .filter((p) => p.name)
}

function transformTeam(detail) {
  const slug = slugify(detail.killteamName)
  const factionRules = collectFactionRules(detail.opTypes ?? [])
  const ploys = transformPloys(detail)

  return {
    id: slug,
    killteamId: detail.killteamId,
    factionId: detail.factionId,
    imageUrl: `https://ktdash.app/img/killteams/${detail.killteamId}.webp`,
    killTeam: {
      name: detail.killteamName,
      archetypes: (detail.archetypes ?? '').replace(/\//g, ', '),
      factionRuleName: 'Faction rules',
      factionRule: factionRules || (detail.description ?? ''),
      ploys,
      specialIssueAmmunition: '',
      rosterNote: detail.composition ?? '',
      description: detail.description ?? '',
    },
    operatives: (detail.opTypes ?? []).map((op) => transformOperative(op, detail.killteamName)),
  }
}

function transformJointOpPack(detail) {
  const slug = slugify(detail.killteamName)
  return {
    slug,
    killteamId: detail.killteamId,
    name: detail.killteamName,
    description: stripMarkup(detail.description),
    operatives: (detail.opTypes ?? []).map((op) =>
      transformOperative(op, detail.killteamName, { category: 'npo' }),
    ),
  }
}

function addWeaponsToIndex(weaponsByName, weapons = []) {
  for (const weapon of weapons) {
    const name = weapon.name?.trim()
    if (!name) continue
    const key = name.toLowerCase()
    if (!weaponsByName.has(key)) {
      weaponsByName.set(key, {
        name,
        atk: weapon.atk ?? '',
        hit: weapon.hit ?? '',
        dmg: weapon.dmg ?? '',
        rules: weapon.rules ?? '',
      })
    }
  }
}

function indexJointOpPack(payload, jointOpsIndex, npoIndex) {
  jointOpsIndex.push({
    slug: payload.slug,
    killteamId: payload.killteamId,
    name: payload.name,
    operativeCount: payload.operatives.length,
  })

  for (const op of payload.operatives) {
    npoIndex.push({
      key: `${payload.slug}:${op.id}`,
      jointOpSlug: payload.slug,
      jointOpName: payload.name,
      jointOpId: payload.killteamId,
      operativeId: op.id,
      name: op.name,
      category: 'npo',
      role: op.role ?? '',
      apl: op.apl ?? null,
      move: op.move ?? '',
      save: op.save ?? '',
      wounds: op.wounds ?? null,
      keywords: op.keywords ?? '',
    })
  }
}

async function syncJointOps() {
  await mkdir(JOINT_OPS_DIR, { recursive: true })
  const jointOpsIndex = []
  const npoIndex = []

  for (const killteamId of JOINT_OP_IDS) {
    process.stdout.write(`  joint-op ${killteamId}… `)
    const detailRes = await fetch(`${API}/${killteamId}`)
    if (!detailRes.ok) {
      console.log(`SKIP (${detailRes.status})`)
      continue
    }
    const detail = await detailRes.json()
    const payload = transformJointOpPack(detail)
    await writeFile(join(JOINT_OPS_DIR, `${payload.slug}.json`), JSON.stringify(payload, null, 2))
    indexJointOpPack(payload, jointOpsIndex, npoIndex)
    console.log(`ok (${payload.operatives.length} NPOs)`)
  }

  for (const slug of MANUAL_JOINT_OP_SLUGS) {
    process.stdout.write(`  joint-op manual ${slug}… `)
    const path = join(JOINT_OPS_DIR, `${slug}.json`)
    try {
      const raw = await readFile(path, 'utf8')
      const payload = JSON.parse(raw)
      indexJointOpPack(payload, jointOpsIndex, npoIndex)
      console.log(`ok (${payload.operatives.length} NPOs)`)
    } catch (err) {
      console.log(`SKIP (${err.code === 'ENOENT' ? 'missing file' : err.message})`)
    }
  }

  jointOpsIndex.sort((a, b) => a.name.localeCompare(b.name))
  npoIndex.sort((a, b) => {
    const pack = a.jointOpName.localeCompare(b.jointOpName)
    return pack !== 0 ? pack : a.name.localeCompare(b.name)
  })

  await writeFile(join(OUT_DIR, 'joint-ops-index.json'), JSON.stringify(jointOpsIndex, null, 2))
  await writeFile(join(OUT_DIR, 'npo-index.json'), JSON.stringify(npoIndex, null, 2))

  return { jointOpsIndex, npoIndex }
}

async function syncEquipmentIndex() {
  process.stdout.write('  equipment (full API)… ')
  const listRes = await fetch(`${API}?full=Y`)
  if (!listRes.ok) throw new Error(`Equipment fetch failed: ${listRes.status}`)
  const list = await listRes.json()

  const byId = new Map()
  for (const team of list) {
    for (const eq of team.equipments ?? []) {
      const eqId = eq.eqId
      if (!eqId || byId.has(eqId)) continue
      const isUniversal = !eq.killteamId || eqId.startsWith('UNIVERSAL')
      byId.set(eqId, {
        eqId,
        name: eq.eqName ?? eqId,
        description: stripMarkup(eq.description),
        killteamId: eq.killteamId ?? null,
        teamName: isUniversal ? 'Universal' : (team.killteamName ?? eq.killteamId),
        isUniversal,
      })
    }
  }

  const equipmentIndex = [...byId.values()].sort((a, b) => {
    if (a.isUniversal !== b.isUniversal) return a.isUniversal ? -1 : 1
    const teamCmp = a.teamName.localeCompare(b.teamName)
    return teamCmp !== 0 ? teamCmp : a.name.localeCompare(b.name)
  })

  await writeFile(join(OUT_DIR, 'equipment-index.json'), JSON.stringify(equipmentIndex, null, 2))
  console.log(`ok (${equipmentIndex.length} items, ${equipmentIndex.filter((e) => e.isUniversal).length} universal)`)
  return equipmentIndex
}

async function main() {
  console.log('Fetching kill team list…')
  const listRes = await fetch(API)
  if (!listRes.ok) throw new Error(`List fetch failed: ${listRes.status}`)
  const list = await listRes.json()

  const teams = list.filter(
    (t) => t.isPublished && !t.isHomebrew && !t.killteamId.startsWith('SPEC-'),
  )

  await mkdir(TEAMS_DIR, { recursive: true })

  const index = []

  for (const summary of teams) {
    const slug = slugify(summary.killteamName)
    process.stdout.write(`  ${summary.killteamId} → ${slug}… `)

    const detailRes = await fetch(`${API}/${summary.killteamId}`)
    if (!detailRes.ok) {
      console.log(`SKIP (${detailRes.status})`)
      continue
    }
    const detail = await detailRes.json()
    const payload = transformTeam(detail)

    await writeFile(join(TEAMS_DIR, `${slug}.json`), JSON.stringify(payload, null, 2))

    index.push({
      slug,
      killteamId: summary.killteamId,
      name: summary.killteamName,
      factionId: summary.factionId,
      archetypes: (summary.archetypes ?? '').replace(/\//g, ', '),
      operativeCount: payload.operatives.length,
      imageUrl: `https://ktdash.app/img/killteams/${summary.killteamId}.webp`,
    })
    console.log(`ok (${payload.operatives.length} operatives)`)
  }

  index.sort((a, b) => a.name.localeCompare(b.name))
  await writeFile(join(OUT_DIR, 'index.json'), JSON.stringify(index, null, 2))

  const operativesIndex = []
  for (const entry of index) {
    const raw = await readFile(join(TEAMS_DIR, `${entry.slug}.json`), 'utf8')
    const team = JSON.parse(raw)
    for (const op of team.operatives ?? []) {
      operativesIndex.push({
        key: `${entry.slug}:${op.id}`,
        teamSlug: entry.slug,
        teamName: entry.name,
        operativeId: op.id,
        name: op.name,
        category: op.category ?? 'po',
        role: op.role ?? '',
        apl: op.apl ?? null,
        move: op.move ?? '',
        save: op.save ?? '',
        wounds: op.wounds ?? null,
        keywords: op.keywords ?? '',
      })
    }
  }
  operativesIndex.sort((a, b) => {
    const teamCmp = a.teamName.localeCompare(b.teamName)
    return teamCmp !== 0 ? teamCmp : a.name.localeCompare(b.name)
  })
  await writeFile(join(OUT_DIR, 'operatives-index.json'), JSON.stringify(operativesIndex, null, 2))

  const weaponsByName = new Map()
  for (const entry of index) {
    const raw = await readFile(join(TEAMS_DIR, `${entry.slug}.json`), 'utf8')
    const team = JSON.parse(raw)
    for (const op of team.operatives ?? []) {
      addWeaponsToIndex(weaponsByName, op.weapons)
    }
  }

  console.log('\nSyncing joint-operation NPOs…')
  const { npoIndex } = await syncJointOps()
  for (const entry of npoIndex) {
    const raw = await readFile(join(JOINT_OPS_DIR, `${entry.jointOpSlug}.json`), 'utf8')
    const pack = JSON.parse(raw)
    const op = pack.operatives.find((item) => item.id === entry.operativeId)
    if (op) addWeaponsToIndex(weaponsByName, op.weapons)
  }

  const weaponsIndex = [...weaponsByName.values()].sort((a, b) => a.name.localeCompare(b.name))
  await writeFile(join(OUT_DIR, 'weapons-index.json'), JSON.stringify(weaponsIndex, null, 2))

  console.log('\nSyncing equipment…')
  const equipmentIndex = await syncEquipmentIndex()

  console.log(`\nWrote ${index.length} teams to public/data/kt24/`)
  console.log(`Wrote ${operativesIndex.length} operatives to operatives-index.json`)
  console.log(`Wrote ${npoIndex.length} joint-op NPOs to npo-index.json`)
  console.log(`Wrote ${weaponsIndex.length} weapons to weapons-index.json`)
  console.log(`Wrote ${equipmentIndex.length} equipment entries to equipment-index.json`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
