const KTDASH_CDN = 'https://ktdash.app'

let operativeImageCachePromise = null

export function killTeamImageUrl(killteamId) {
  if (!killteamId) return null
  return `${KTDASH_CDN}/img/killteams/${killteamId}.webp`
}

export function factionImageUrl(factionId) {
  if (!factionId) return null
  return `${KTDASH_CDN}/img/factions/${factionId}.jpg`
}

export function operativeCardArtUrl({ title, subtitle, accent = '8b5cf6' }) {
  const bg = '18181b'
  const name = encodeURIComponent(title || 'OP')
  return `https://ui-avatars.com/api/?name=${name}&size=512&background=${bg}&color=${accent.replace('#', '')}&bold=true&length=2&font-size=0.25&format=png`
}

/** @deprecated Use operativeCardArtUrl — kept for project cards */
export function projectCardArtUrl(options) {
  return operativeCardArtUrl(options)
}

export async function loadOperativeImageCache() {
  if (!operativeImageCachePromise) {
    operativeImageCachePromise = fetch('/data/kt24/operative-images.json')
      .then((res) => (res.ok ? res.json() : {}))
      .catch(() => ({}))
  }
  return operativeImageCachePromise
}

export function lookupCachedOperativeImage(operative, cache = {}) {
  if (!operative || !cache) return null
  if (operative.opTypeId && cache[operative.opTypeId]) return cache[operative.opTypeId]
  if (operative.id && cache[operative.id]) return cache[operative.id]
  return null
}

export function resolveOperativePortraitSources(operative, { killteamId, factionId, cache = {} }) {
  const sources = []
  const stored = operative?.imageUrl?.trim()
  if (stored) sources.push(stored)

  const cached = lookupCachedOperativeImage(operative, cache)
  if (cached) sources.push(cached)

  const team = killTeamImageUrl(killteamId)
  const faction = factionImageUrl(factionId)
  if (team) sources.push(team)
  if (faction) sources.push(faction)
  sources.push(
    operativeCardArtUrl({
      title: operative?.name ?? 'Operative',
      subtitle: operative?.role,
    }),
  )

  return [...new Set(sources.filter(Boolean))]
}
