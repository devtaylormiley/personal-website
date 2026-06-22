export default function StatChip({ label, value }) {
  return (
    <span className="inline-flex items-center gap-1 rounded border border-[var(--bf-border)] bg-[var(--bf-bg)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--bf-text-muted)]">
      <span className="uppercase tracking-wide">{label}</span>
      <span className="font-semibold text-[var(--bf-field)]">{value}</span>
    </span>
  )
}
