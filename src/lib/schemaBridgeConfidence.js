/** Shared confidence thresholds for Schema Bridge UI (0–1 scale). */

export function getConfidenceToneClasses(confidence) {
  const value = Number(confidence)
  if (value >= 0.9) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10'
  if (value >= 0.8) return 'text-amber-300 border-amber-500/30 bg-amber-500/10'
  return 'text-red-300 border-red-500/30 bg-red-500/10'
}

export function formatConfidencePercent(confidence) {
  return `${(Number(confidence) * 100).toFixed(0)}%`
}
