/** Category labels (e.g. "Strategy / firefight ploys") are not section headers. */
function isSectionHeader(name) {
  return Boolean(name) && !/\s\/\s/.test(name)
}

function parseNamedLine(line) {
  const colon = line.indexOf(': ')
  if (colon === -1) return null
  const name = line.slice(0, colon).trim()
  if (!isSectionHeader(name)) return null
  return {
    name,
    body: line.slice(colon + 2).trim(),
  }
}

/** Split text on blank lines; extract `Name: body` for section headers and single-line abilities. */
export function parseAbilities(raw) {
  if (!raw?.trim()) return []

  const entries = []

  for (const block of raw.split(/\n\n+/).map((part) => part.trim()).filter(Boolean)) {
    const lines = block.split('\n').map((line) => line.trim()).filter(Boolean)
    const namedLines = lines.map(parseNamedLine)

    if (lines.length > 1 && namedLines.every(Boolean)) {
      entries.push(...namedLines)
      continue
    }

    const colon = block.indexOf(': ')
    if (colon === -1) {
      entries.push({ name: null, body: block })
      continue
    }

    const name = block.slice(0, colon).trim()
    if (!isSectionHeader(name)) {
      entries.push({ name: null, body: block })
      continue
    }

    entries.push({
      name,
      body: block.slice(colon + 2).trim(),
    })
  }

  return entries
}

/** Serialize ability entries back to the stored text format. */
export function serializeAbilities(entries) {
  if (!entries?.length) return ''

  return entries
    .map(({ name, body }) => {
      const trimmedName = name?.trim() ?? ''
      const trimmedBody = body?.trim() ?? ''
      if (trimmedName && trimmedBody) return `${trimmedName}: ${trimmedBody}`
      if (trimmedName) return `${trimmedName}:`
      return trimmedBody
    })
    .filter(Boolean)
    .join('\n\n')
}
