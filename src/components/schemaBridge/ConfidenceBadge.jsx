import {
  formatConfidencePercent,
  getConfidenceToneClasses,
} from '../../lib/schemaBridgeConfidence'

export default function ConfidenceBadge({
  confidence,
  className = '',
  compact = false,
  suffix = null,
}) {
  if (confidence == null || Number.isNaN(Number(confidence))) return null

  const label = suffix
    ? `${formatConfidencePercent(confidence)} ${suffix}`
    : formatConfidencePercent(confidence)

  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-md border font-medium ${getConfidenceToneClasses(confidence)} ${
        compact ? 'px-1.5 py-px text-[10px]' : 'px-2 py-0.5 text-xs'
      } ${className}`}
    >
      {label}
    </span>
  )
}
