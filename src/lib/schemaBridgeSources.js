/** Legacy export identifiers and their UI tones in Schema Bridge. */

const SOURCE_TONE_CLASSES = {
  crm_export: 'text-violet-300 border-violet-500/30 bg-violet-500/10',
  maintenance_dump: 'text-orange-300 border-orange-500/30 bg-orange-500/10',
  spreadsheet_export: 'text-sky-300 border-sky-500/30 bg-sky-500/10',
}

const FALLBACK_TONE_CLASSES = 'text-zinc-300 border-zinc-600/40 bg-zinc-800/80'

export function getSourceToneClasses(source) {
  if (!source) return FALLBACK_TONE_CLASSES
  return SOURCE_TONE_CLASSES[source] ?? FALLBACK_TONE_CLASSES
}

export function formatSourceLabel(source) {
  if (!source) return 'unknown'
  return String(source)
}
