import BlackfangCampaignNavTile from '../components/blackfang/BlackfangCampaignNavTile'
import { CAMPAIGN_MODULE_TILES, REGISTRY_MODULE_TILES } from '../lib/blackfangNavigation'

export default function BlackfangCampaignHomePage() {
  return (
    <section className="bf-panel-elevated p-4 sm:p-6 lg:p-8">
      <header className="max-w-3xl">
        <p className="bf-muted font-[family-name:var(--bf-font-mono)] text-[11px] tracking-[0.18em] uppercase sm:text-xs">
          Operational repository · Kill Team 2024
        </p>
        <h1 className="bf-page-title mt-2 text-2xl sm:text-3xl">Blackfang Campaign</h1>
        <p className="bf-body mt-4 text-sm leading-relaxed sm:text-base">
          Blackfang is a homebrew <strong className="font-medium text-[var(--bf-text)]">Kill Team</strong>{' '}
          narrative and <strong className="font-medium text-[var(--bf-text)]">joint-operations</strong>{' '}
          campaign played in the Warhammer 40,000 universe. This site is the living repository for that
          table — lore, roster data, and tools you need before, during, and after each operation.
        </p>
        <p className="bf-body mt-3 text-sm leading-relaxed sm:text-base">
          The <strong className="font-medium text-[var(--bf-text)]">KT24 Data Registry</strong> mirrors
          official dataslates (kill teams, operatives, weapons, equipment) and supports{' '}
          <strong className="font-medium text-[var(--bf-text)]">homebrew teams</strong> when you sign in:
          clone an official roster, edit player operatives and NPOs, and run joint-op scenarios with
          consistent profiles at the table.
        </p>
        <p className="bf-muted mt-4 text-xs leading-relaxed sm:text-sm">
          Use the menu for full navigation, or pick a module below to jump straight into lore, data, or
          your party roster.
        </p>
      </header>

      <div className="mt-8">
        <h2 className="bf-section-label">Campaign modules</h2>
        <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {CAMPAIGN_MODULE_TILES.map((tile) => (
            <li key={tile.to}>
              <BlackfangCampaignNavTile {...tile} />
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-10">
        <h2 className="bf-section-label">KT24 registry</h2>
        <p className="bf-muted mt-1 max-w-2xl text-xs sm:text-sm">
          Direct links into the data registry — the same sections available under KT24 Data in the nav
          drawer.
        </p>
        <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {REGISTRY_MODULE_TILES.map((tile) => (
            <li key={tile.to}>
              <BlackfangCampaignNavTile {...tile} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
