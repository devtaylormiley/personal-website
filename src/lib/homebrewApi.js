import { supabase } from './supabaseClient'
import { computeAbilityScores, DEFAULT_ABILITY_BASE, normalizeAbilityScores } from './abilityScores'
import { applyStarfinderBuildToOperative } from '../data/deathwatchVeteranStarfinder.js'
import { normalizeSf2eAbilityScores } from './starfinderScores'

const IMAGE_BUCKET = 'homebrew-team-images'
const MAX_IMAGE_BYTES = 5 * 1024 * 1024

function requireClient() {
  if (!supabase) throw new Error('Supabase is not configured.')
  return supabase
}

function mapTeam(row) {
  return {
    id: row.id,
    slug: row.slug,
    killteamId: row.killteam_id,
    factionId: row.faction_id,
    imageUrl: row.image_url ?? '',
    killTeam: {
      name: row.name,
      archetypes: row.archetypes ?? '',
      description: row.description ?? '',
      factionRuleName: row.faction_rule_name ?? 'Faction rules',
      factionRule: row.faction_rule ?? '',
      specialIssueAmmunition: row.special_issue_ammunition ?? '',
      ploys: Array.isArray(row.ploys) ? row.ploys : [],
      rosterNote: row.roster_note ?? '',
    },
  }
}

function mapOperative(row) {
  const isBlackshield = Boolean(row.is_blackshield)
  const isSf2e = row.scoring_system === 'sf2e'
  const level = isBlackshield || isSf2e ? (row.level ?? 1) : undefined
  const base = {
    id: row.id,
    opTypeId: row.op_type_id,
    name: row.name,
    category: row.category ?? 'po',
    cardType: row.card_type ?? 'custom',
    role: row.role ?? '',
    points: row.points ?? 0,
    apl: row.apl ?? 2,
    move: row.move ?? '6"',
    save: row.save ?? '4+',
    wounds: row.wounds ?? 8,
    keywords: row.keywords ?? '',
    weapons: Array.isArray(row.weapons) ? row.weapons : [],
    abilities: row.abilities ?? '',
    notes: row.notes ?? '',
    imageUrl: row.image_url ?? '',
    isBlackshield,
    formerChapter: row.former_chapter ?? '',
    homePlanet: row.home_planet ?? '',
    backstory: row.backstory ?? '',
    level,
    abilityScores: isBlackshield
      ? normalizeAbilityScores(row.ability_scores, level ?? 1)
      : isSf2e
        ? normalizeSf2eAbilityScores(row.ability_scores, level ?? 1)
        : undefined,
    scoringSystem: row.scoring_system ?? null,
    sf2eClass: row.sf2e_class ?? null,
    sourceVeteranId: row.source_veteran_id ?? null,
    starfinderSaves:
      row.starfinder_saves && typeof row.starfinder_saves === 'object'
        ? row.starfinder_saves
        : undefined,
    sortOrder: row.sort_order ?? 0,
  }

  if (isSf2e && row.source_veteran_id) {
    return applyStarfinderBuildToOperative(base, level ?? 1)
  }

  return base
}

export async function listHomebrewTeams(userId) {
  const client = requireClient()
  const { data, error } = await client
    .from('homebrew_kill_teams')
    .select('*, homebrew_operatives(count)')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })

  if (error) throw error
  return data.map((row) => ({
    ...mapTeam(row),
    operativeCount: row.homebrew_operatives?.[0]?.count ?? 0,
  }))
}

export async function getHomebrewTeam(teamId, userId) {
  const client = requireClient()
  const { data: teamRow, error: teamErr } = await client
    .from('homebrew_kill_teams')
    .select('*')
    .eq('id', teamId)
    .eq('user_id', userId)
    .single()

  if (teamErr) throw teamErr

  const { data: opRows, error: opErr } = await client
    .from('homebrew_operatives')
    .select('*')
    .eq('team_id', teamId)
    .eq('user_id', userId)
    .order('sort_order', { ascending: true })

  if (opErr) throw opErr

  return {
    ...mapTeam(teamRow),
    operatives: opRows.map(mapOperative),
  }
}

export async function createHomebrewTeam({ userId, slug, killTeam, factionId, killteamId }) {
  const client = requireClient()
  const payload = {
    user_id: userId,
    slug,
    name: killTeam.name,
    killteam_id: killteamId ?? null,
    faction_id: factionId ?? null,
    archetypes: killTeam.archetypes ?? '',
    description: killTeam.description ?? '',
    faction_rule_name: killTeam.factionRuleName ?? 'Faction rules',
    faction_rule: killTeam.factionRule ?? '',
    special_issue_ammunition: killTeam.specialIssueAmmunition ?? '',
    ploys: killTeam.ploys ?? [],
    roster_note: killTeam.rosterNote ?? '',
  }

  const { data, error } = await client
    .from('homebrew_kill_teams')
    .insert(payload)
    .select('*')
    .single()

  if (error) throw error
  return mapTeam(data)
}

export async function updateHomebrewTeam({
  teamId,
  userId,
  killTeam,
  killteamId,
  factionId,
  imageUrl,
}) {
  const client = requireClient()
  const payload = {
    name: killTeam.name,
    archetypes: killTeam.archetypes ?? '',
    description: killTeam.description ?? '',
    faction_rule_name: killTeam.factionRuleName ?? 'Faction rules',
    faction_rule: killTeam.factionRule ?? '',
    special_issue_ammunition: killTeam.specialIssueAmmunition ?? '',
    ploys: killTeam.ploys ?? [],
    roster_note: killTeam.rosterNote ?? '',
    updated_at: new Date().toISOString(),
  }
  if (killteamId !== undefined) payload.killteam_id = killteamId
  if (factionId !== undefined) payload.faction_id = factionId
  if (imageUrl !== undefined) payload.image_url = imageUrl

  const { data, error } = await client
    .from('homebrew_kill_teams')
    .update(payload)
    .eq('id', teamId)
    .eq('user_id', userId)
    .select('*')
    .single()

  if (error) throw error
  return mapTeam(data)
}

function operativeToRow(op, userId, teamId, idx) {
  const isBlackshield = Boolean(op.isBlackshield)
  const isSf2e = op.scoringSystem === 'sf2e'
  const level = isBlackshield || isSf2e ? Math.min(20, Math.max(1, Number(op.level) || 1)) : 1
  return {
    id: op.id?.length === 36 ? op.id : undefined,
    team_id: teamId ?? null,
    user_id: userId,
    op_type_id: op.opTypeId ?? null,
    name: op.name,
    category: op.category ?? 'po',
    card_type: op.cardType ?? 'custom',
    role: op.role ?? '',
    points: Number(op.points) || 0,
    apl: Number(op.apl) || 0,
    move: op.move ?? '',
    save: op.save ?? '',
    wounds: Number(op.wounds) || 0,
    keywords: op.keywords ?? '',
    weapons: Array.isArray(op.weapons) ? op.weapons : [],
    abilities: op.abilities ?? '',
    notes: op.notes ?? '',
    image_url: op.imageUrl ?? '',
    is_blackshield: isBlackshield,
    scoring_system: op.scoringSystem ?? null,
    sf2e_class: op.sf2eClass ?? null,
    source_veteran_id: op.sourceVeteranId ?? null,
    starfinder_saves: isSf2e ? op.starfinderSaves ?? null : null,
    former_chapter: op.formerChapter ?? '',
    home_planet: op.homePlanet ?? '',
    backstory: op.backstory ?? '',
    level,
    ability_scores: isBlackshield
      ? normalizeAbilityScores(op.abilityScores ?? { ...DEFAULT_ABILITY_BASE }, level)
      : isSf2e
        ? normalizeSf2eAbilityScores(op.abilityScores ?? { ...DEFAULT_ABILITY_BASE }, level)
      : { ...DEFAULT_ABILITY_BASE },
    sort_order: idx,
    updated_at: new Date().toISOString(),
  }
}

export async function replaceHomebrewOperatives({ teamId, userId, operatives }) {
  const client = requireClient()

  const { error: delError } = await client
    .from('homebrew_operatives')
    .delete()
    .eq('team_id', teamId)
    .eq('user_id', userId)

  if (delError) throw delError
  if (!operatives.length) return []

  const rows = operatives.map((op, idx) => operativeToRow(op, userId, teamId, idx))

  const { data, error } = await client.from('homebrew_operatives').insert(rows).select('*')
  if (error) throw error

  return data.sort((a, b) => a.sort_order - b.sort_order).map(mapOperative)
}

function mapOperativeWithTeam(row) {
  const team = row.homebrew_kill_teams
  return {
    ...mapOperative(row),
    teamId: row.team_id ?? null,
    teamName: team?.name ?? null,
    teamSlug: team?.slug ?? null,
    factionId: team?.faction_id ?? null,
  }
}

export async function listHomebrewOperatives(userId) {
  const client = requireClient()
  const { data, error } = await client
    .from('homebrew_operatives')
    .select('*, homebrew_kill_teams(id, name, slug, faction_id)')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })

  if (error) throw error
  return data.map(mapOperativeWithTeam)
}

export async function getHomebrewOperative(operativeId, userId) {
  const client = requireClient()
  const { data, error } = await client
    .from('homebrew_operatives')
    .select('*, homebrew_kill_teams(id, name, slug, faction_id)')
    .eq('id', operativeId)
    .eq('user_id', userId)
    .single()

  if (error) throw error
  return mapOperativeWithTeam(data)
}

export async function createHomebrewOperative({ userId, operative, teamId = null }) {
  const client = requireClient()
  const row = operativeToRow(operative, userId, teamId, 0)
  delete row.id

  const { data, error } = await client.from('homebrew_operatives').insert(row).select('*').single()
  if (error) throw error
  return mapOperative(data)
}

export async function updateHomebrewOperative({ operativeId, userId, operative, teamId }) {
  const client = requireClient()
  const resolvedTeamId = teamId === undefined ? operative.teamId : teamId
  const row = operativeToRow(operative, userId, resolvedTeamId, operative.sortOrder ?? 0)
  delete row.id

  const { data, error } = await client
    .from('homebrew_operatives')
    .update(row)
    .eq('id', operativeId)
    .eq('user_id', userId)
    .select('*')
    .single()

  if (error) throw error
  return mapOperative(data)
}

export async function deleteHomebrewOperative(operativeId, userId) {
  const client = requireClient()
  const { error } = await client
    .from('homebrew_operatives')
    .delete()
    .eq('id', operativeId)
    .eq('user_id', userId)
  if (error) throw error
}

export async function deleteHomebrewTeam(teamId, userId) {
  const client = requireClient()
  const { error } = await client
    .from('homebrew_kill_teams')
    .delete()
    .eq('id', teamId)
    .eq('user_id', userId)
  if (error) throw error
}

export async function uploadHomebrewTeamImage({ teamId, userId, file }) {
  const client = requireClient()
  if (!file.type.startsWith('image/')) {
    throw new Error('Please choose an image file.')
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error('Image must be 5 MB or smaller.')
  }

  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const safeExt = ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext) ? ext : 'jpg'
  const path = `${userId}/${teamId}/banner.${safeExt}`

  const { error: uploadError } = await client.storage
    .from(IMAGE_BUCKET)
    .upload(path, file, { upsert: true, contentType: file.type })

  if (uploadError) throw uploadError

  const { data } = client.storage.from(IMAGE_BUCKET).getPublicUrl(path)
  return `${data.publicUrl}?t=${Date.now()}`
}

export async function uploadHomebrewOperativeImage({ teamId, operativeId, userId, file }) {
  const client = requireClient()
  if (!file.type.startsWith('image/')) {
    throw new Error('Please choose an image file.')
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error('Image must be 5 MB or smaller.')
  }

  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const safeExt = ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext) ? ext : 'jpg'
  const teamSegment = teamId ?? 'unassigned'
  const path = `${userId}/${teamSegment}/operatives/${operativeId}.${safeExt}`

  const { error: uploadError } = await client.storage
    .from(IMAGE_BUCKET)
    .upload(path, file, { upsert: true, contentType: file.type })

  if (uploadError) throw uploadError

  const { data } = client.storage.from(IMAGE_BUCKET).getPublicUrl(path)
  return `${data.publicUrl}?t=${Date.now()}`
}
