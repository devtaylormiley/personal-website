import {
  formatSourceLabel,
  getSourceToneClasses,
} from '../../lib/schemaBridgeSources'

export default function SourceBadge({ source, className = '', compact = false }) {
  if (!source) return null

  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-md border font-mono font-medium ${getSourceToneClasses(source)} ${
        compact ? 'px-1.5 py-px text-[10px]' : 'px-2 py-0.5 text-xs'
      } ${className}`}
    >
      {formatSourceLabel(source)}
    </span>
  )
}
