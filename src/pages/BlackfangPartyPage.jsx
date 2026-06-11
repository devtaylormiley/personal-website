import { PARTY_SLOT_COUNT } from '../lib/partyStorage'

function SquadSlot({ index }) {
  return (
    <article className="bf-party-slot bf-party-slot--empty">
      <p className="bf-party-slot-label">Squad member {index + 1}</p>
      <p className="bf-party-slot-empty-text">Empty slot</p>
    </article>
  )
}

export default function BlackfangPartyPage() {
  return (
    <section className="bf-panel-elevated p-4 sm:p-6 lg:p-8">
      <header className="max-w-3xl">
        <p className="bf-muted font-[family-name:var(--bf-font-mono)] text-[11px] tracking-[0.18em] uppercase sm:text-xs">
          Campaign roster · Kill Team 2024
        </p>
        <h1 className="bf-page-title mt-2 text-2xl sm:text-3xl">Party</h1>
        <p className="bf-body mt-3 text-sm leading-relaxed sm:text-base">
          Your active squad for the Blackfang campaign table.
        </p>
      </header>

      <div className="mt-10">
        <h2 className="bf-section-label">Squad roster</h2>
        <p className="bf-muted mt-1 text-xs sm:text-sm">{PARTY_SLOT_COUNT} slots</p>
        <ul className="bf-party-squad mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: PARTY_SLOT_COUNT }, (_, index) => (
            <li key={index}>
              <SquadSlot index={index} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
