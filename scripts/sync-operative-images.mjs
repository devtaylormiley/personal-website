/**
 * Fetches square portrait URLs via Google Custom Search and writes them into KT24 team JSON.
 *
 * Requires:
 *   GOOGLE_CSE_API_KEY — Google Cloud API key with Custom Search API enabled
 *   GOOGLE_CSE_CX      — Programmable Search Engine ID (Image search on)
 *
 * Run: npm run sync:operative-images
 */
import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { searchOperativePortrait, sleep } from './lib/googleImageSearch.mjs'

const TEAMS_DIR = join(process.cwd(), 'public', 'data', 'kt24', 'teams')
const CACHE_PATH = join(process.cwd(), 'public', 'data', 'kt24', 'operative-images.json')
const DELAY_MS = 350

async function main() {
  const apiKey = process.env.GOOGLE_CSE_API_KEY
  const cx = process.env.GOOGLE_CSE_CX

  if (!apiKey || !cx) {
    console.error(
      'Set GOOGLE_CSE_API_KEY and GOOGLE_CSE_CX (Programmable Search Engine with image search).',
    )
    process.exit(1)
  }

  const { readdir } = await import('node:fs/promises')
  const files = (await readdir(TEAMS_DIR)).filter((f) => f.endsWith('.json'))

  let cache = {}
  try {
    cache = JSON.parse(await readFile(CACHE_PATH, 'utf8'))
  } catch {
    cache = {}
  }

  let updated = 0
  let skipped = 0

  for (const file of files) {
    const path = join(TEAMS_DIR, file)
    const team = JSON.parse(await readFile(path, 'utf8'))
    const teamName = team.killTeam?.name ?? team.id
    let teamChanged = false

    for (const op of team.operatives ?? []) {
      const cacheKey = op.opTypeId || `${team.id}:${op.id}`
      if (op.imageUrl || cache[cacheKey]) {
        if (!op.imageUrl && cache[cacheKey]) {
          op.imageUrl = cache[cacheKey]
          teamChanged = true
        }
        skipped += 1
        continue
      }

      process.stdout.write(`  ${teamName} — ${op.name}… `)
      try {
        const url = await searchOperativePortrait(
          { name: op.name, teamName, role: op.role },
          { apiKey, cx },
        )
        if (url) {
          op.imageUrl = url
          cache[cacheKey] = url
          cache[`${team.id}:${op.id}`] = url
          updated += 1
          console.log('ok')
        } else {
          console.log('no result')
        }
      } catch (err) {
        console.log(`error (${err.message})`)
      }

      teamChanged = true
      await sleep(DELAY_MS)
    }

    if (teamChanged) {
      await writeFile(path, JSON.stringify(team, null, 2))
    }
  }

  await writeFile(CACHE_PATH, JSON.stringify(cache, null, 2))
  console.log(`\nDone. ${updated} new images, ${skipped} already cached.`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
