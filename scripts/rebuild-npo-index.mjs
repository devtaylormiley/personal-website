/**
 * Rebuild npo-index.json from local joint-op JSON (no API calls).
 */
import { readFile, readdir, writeFile } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT_DIR = join(__dirname, '../public/data/kt24')
const JOINT_OPS_DIR = join(OUT_DIR, 'joint-ops')

async function main() {
  const files = (await readdir(JOINT_OPS_DIR)).filter((name) => name.endsWith('.json'))
  const npoIndex = []

  for (const file of files) {
    const raw = await readFile(join(JOINT_OPS_DIR, file), 'utf8')
    const pack = JSON.parse(raw)
    for (const op of pack.operatives ?? []) {
      npoIndex.push({
        key: `${pack.slug}:${op.id}`,
        jointOpSlug: pack.slug,
        jointOpName: pack.name,
        jointOpId: pack.killteamId,
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

  npoIndex.sort((a, b) => {
    const pack = a.jointOpName.localeCompare(b.jointOpName)
    return pack !== 0 ? pack : a.name.localeCompare(b.name)
  })

  await writeFile(join(OUT_DIR, 'npo-index.json'), JSON.stringify(npoIndex, null, 2))
  console.log(`Wrote ${npoIndex.length} joint-op NPOs to npo-index.json`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
