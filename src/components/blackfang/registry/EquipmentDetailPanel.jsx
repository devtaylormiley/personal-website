export default function EquipmentDetailPanel({ item }) {
  if (!item) return null

  const sourceLabel = item.isUniversal ? 'Universal' : item.teamName

  return (
    <article className="bf-equipment-dataslate">
      <header className="bf-equipment-dataslate-header">
        <h3 className="bf-equipment-dataslate-title">{item.name}</h3>
        <p className="bf-equipment-dataslate-source">{sourceLabel}</p>
      </header>
      <div className="bf-equipment-dataslate-body">
        {item.description ? (
          <p className="bf-body whitespace-pre-wrap text-xs leading-relaxed text-[var(--bf-text)]">
            {item.description}
          </p>
        ) : (
          <p className="bf-muted text-xs">No description available.</p>
        )}
      </div>
    </article>
  )
}
