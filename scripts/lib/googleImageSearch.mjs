/**
 * Google Programmable Search (Custom Search JSON API) — image results.
 * @see https://developers.google.com/custom-search/v1/overview
 */

const SEARCH_ENDPOINT = 'https://www.googleapis.com/customsearch/v1'

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function isSquareEnough(width, height) {
  if (!width || !height) return true
  const ratio = width / height
  return ratio >= 0.65 && ratio <= 1.45
}

function isLargeEnough(width, height) {
  const minSide = Math.min(width || 0, height || 0)
  return minSide === 0 || minSide >= 200
}

/**
 * @param {string} query
 * @param {{ apiKey: string, cx: string, num?: number }} options
 * @returns {Promise<string|null>}
 */
export async function searchGoogleImage(query, { apiKey, cx, num = 8 }) {
  const params = new URLSearchParams({
    key: apiKey,
    cx,
    q: query,
    searchType: 'image',
    num: String(Math.min(10, Math.max(1, num))),
    safe: 'active',
    imgSize: 'medium',
  })

  const res = await fetch(`${SEARCH_ENDPOINT}?${params}`)
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Google image search failed (${res.status}): ${body.slice(0, 200)}`)
  }

  const data = await res.json()
  const items = data.items ?? []

  for (const item of items) {
    const link = item.link
    if (!link) continue
    const width = item.image?.width ?? 0
    const height = item.image?.height ?? 0
    if (!isSquareEnough(width, height)) continue
    if (!isLargeEnough(width, height)) continue
    return link
  }

  return items[0]?.link ?? null
}

export function buildOperativeImageQuery({ name, teamName, role }) {
  const parts = [
    'Warhammer 40k Kill Team',
    name,
    role && role !== name ? role : '',
    teamName ? `${teamName} miniature` : 'miniature',
  ].filter(Boolean)
  return parts.join(' ')
}

export async function searchOperativePortrait(options, searchOptions) {
  const query = buildOperativeImageQuery(options)
  const url = await searchGoogleImage(query, searchOptions)
  if (url) return url
  return searchGoogleImage(`${options.name} Warhammer miniature`, searchOptions)
}

export { sleep }
