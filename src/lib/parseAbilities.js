/** Category labels (e.g. "Strategy / firefight ploys") are not section headers. */
function isSectionHeader(name) {
  return Boolean(name) && !/\s\/\s/.test(name)
}

/** Split text on blank lines; extract `Name: body` only for true section headers. */
export function parseAbilities(raw) {
  if (!raw?.trim()) return []

  return raw
    .split(/\n\n+/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      const colon = block.indexOf(': ')
      if (colon === -1) return { name: null, body: block }
      const name = block.slice(0, colon).trim()
      if (!isSectionHeader(name)) return { name: null, body: block }
      return {
        name,
        body: block.slice(colon + 2).trim(),
      }
    })
}
