import { parseAbilities } from '../../lib/parseAbilities'

function SectionHeading({ title, compact }) {
  if (!title?.trim()) return null
  return <p className={`bf-mono-label mb-2 ${compact ? 'text-[10px]' : ''}`}>{title}</p>
}

function EntryCard({ name, body, compact }) {
  return (
    <li
      className={`w-full rounded-lg border border-[var(--bf-border)] bg-[rgb(4_10_6/0.6)] ${compact ? 'px-3 py-2' : 'px-4 py-3'}`}
    >
      {name ? (
        <p
          className={`font-semibold tracking-wide text-[var(--bf-accent)] uppercase ${compact ? 'font-mono text-xs' : 'font-mono text-sm'}`}
        >
          {name}
        </p>
      ) : null}
      <p
        className={`bf-body whitespace-pre-wrap text-sm ${name ? (compact ? 'mt-1' : 'mt-2') : ''}`}
      >
        {body}
      </p>
    </li>
  )
}

export default function DataslateTextSection({
  title,
  content,
  parseNamedEntries = false,
  className = '',
  compact = false,
}) {
  const text = content?.trim() ?? ''
  const entries = parseNamedEntries ? parseAbilities(text) : []

  if (parseNamedEntries && entries.length) {
    return (
      <div className={`w-full min-w-0 ${className}`}>
        <SectionHeading title={title} compact={compact} />
        <ul className={compact ? 'space-y-2' : 'space-y-4'}>
          {entries.map((entry, index) => (
            <EntryCard
              key={`${entry.name ?? 'entry'}-${index}`}
              name={entry.name}
              body={entry.body}
              compact={compact}
            />
          ))}
        </ul>
      </div>
    )
  }

  if (!text) {
    return (
      <div className={`w-full min-w-0 ${className}`}>
        <SectionHeading title={title} compact={compact} />
        <p className={`bf-muted text-sm`}>—</p>
      </div>
    )
  }

  return (
    <div className={`w-full min-w-0 ${className}`}>
      <SectionHeading title={title} compact={compact} />
      <div
        className={`w-full rounded-lg border border-[var(--bf-border)] bg-[rgb(4_10_6/0.6)] ${compact ? 'px-3 py-2' : 'px-4 py-3'}`}
      >
        <p className={`bf-body whitespace-pre-wrap text-sm`}>{text}</p>
      </div>
    </div>
  )
}
