export default function DisplayField({ label, value, multiline = false, className = '' }) {
  const text = value ?? ''
  if (!text && !label) return null

  return (
    <div className={`w-full min-w-0 ${className}`}>
      {label ? <p className="bf-mono-label mb-1">{label}</p> : null}
      {multiline ? (
        <p className="bf-body whitespace-pre-wrap text-sm">{text || '—'}</p>
      ) : (
        <p className="text-sm text-[var(--bf-field)]">{text || '—'}</p>
      )}
    </div>
  )
}
