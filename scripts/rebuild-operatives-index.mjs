/**
 * Rebuild operatives-index.json from local team JSON (no API calls).
 */
import { readFile, writeFile } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT_DIR = join(__dirname, '../public/data/kt24')
const TEAMS_DIR = join(OUT_DIR, 'teams')

async function main() {
  const indexRaw = await readFile(join(OUT_DIR, 'index.json'), 'utf8')
  const index = JSON.parse(indexRaw)
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
  console.log(`Wrote ${operativesIndex.length} operatives to operatives-index.json`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
