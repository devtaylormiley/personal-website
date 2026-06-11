function StatCard({ label, value, detail }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-5 py-4">
      <p className="text-xs font-medium tracking-wide text-zinc-500 uppercase">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-zinc-50">{value}</p>
      {detail ? <p className="mt-1 text-xs text-zinc-500">{detail}</p> : null}
    </div>
  )
}

export default function MigrationStats({ manifest }) {
  if (!manifest) {
    return (
      <p className="text-sm text-zinc-500">Migration manifest unavailable.</p>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Rows in" value={manifest.rows_in} detail="Across 3 legacy sources" />
        <StatCard label="Accepted" value={manifest.rows_accepted} detail="Validated work orders" />
        <StatCard label="Review queue" value={manifest.rows_review} detail="Human approval needed" />
        <StatCard label="Runtime" value={`${manifest.runtime_ms} ms`} detail="Local CLI run" />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="AI-assisted" value={manifest.ai_assisted_mappings} />
        <StatCard label="Rule-based" value={manifest.rule_mappings} />
        <StatCard label="Duplicates flagged" value={manifest.duplicate_candidates?.length ?? 0} />
      </div>

      {manifest.status_normalizations?.length ? (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-5">
          <h3 className="text-sm font-medium text-zinc-200">AI status normalizations</h3>
          <ul className="mt-3 flex flex-wrap gap-2">
            {manifest.status_normalizations.map((entry) => (
              <li
                key={entry.raw}
                className="rounded-md border border-zinc-700/80 bg-zinc-800/60 px-2.5 py-1 text-xs text-zinc-300"
                title={entry.reason}
              >
                <span className="text-zinc-500">{entry.raw}</span>
                <span className="mx-1 text-zinc-600" aria-hidden="true">
                  →
                </span>
                <span className="text-teal-300">{entry.canonical}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  )
}
