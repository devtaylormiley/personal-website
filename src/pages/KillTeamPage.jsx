import { useState } from 'react'
import { useParams } from 'react-router-dom'
import BlackfangBreadcrumbs from '../components/blackfang/BlackfangBreadcrumbs'
import BlackfangTerminalShell from '../components/blackfang/BlackfangTerminalShell'
import KillTeamHeader from '../components/blackfang/KillTeamHeader'
import StickyAfterFullScroll from '../components/blackfang/StickyAfterFullScroll'
import OperativeDataslate from '../components/blackfang/OperativeDataslate'
import ActionButton from '../components/ui/ActionButton'
import { bfToneClass } from '../lib/blackfangNavigation'
import { useKillTeamRoster } from '../hooks/useKillTeamRoster'

export default function KillTeamPage() {
  const { teamSlug } = useParams()
  const {
    killTeam,
    poOperatives,
    npoOperatives,
    hydrated,
    loadError,
    killteamId,
    factionId,
  } = useKillTeamRoster(teamSlug)

  const [activeTab, setActiveTab] = useState('po')

  if (!hydrated) {
    return (
      <div className="blackfang-campaign flex min-h-[50vh] items-center justify-center px-4 pt-4 bf-muted">
        <span className="bf-terminal-prompt">LOADING</span>
        <span className="bf-terminal-cursor">█</span>
      </div>
    )
  }

  if (loadError) {
    return (
      <div className="blackfang-campaign min-h-screen px-4 pt-4 pb-16 sm:px-6">
        <div className="mx-auto max-w-screen-2xl">
          <BlackfangTerminalShell>
            <BlackfangBreadcrumbs
              items={[
                { label: 'Portfolio', to: '/#projects', icon: 'portfolio' },
                { label: 'KT24 Data', to: '/projects/blackfang-campaign/kt24-data', icon: 'killTeams' },
                { label: 'Error', icon: 'team' },
              ]}
            />
            <p className="bf-error mt-8 text-sm">{loadError}</p>
          </BlackfangTerminalShell>
        </div>
      </div>
    )
  }

  const tabOperatives = activeTab === 'po' ? poOperatives : npoOperatives

  const breadcrumbItems = [
    { label: 'Portfolio', to: '/#projects', icon: 'portfolio' },
    { label: 'KT24 Data', to: '/projects/blackfang-campaign/kt24-data', icon: 'killTeams' },
    { label: killTeam?.name ?? teamSlug ?? 'Kill team', icon: 'team' },
  ]

  return (
    <div className="blackfang-campaign min-h-screen px-4 pt-4 pb-16 sm:px-6">
      <div className="mx-auto max-w-screen-2xl">
        <BlackfangTerminalShell>
        <BlackfangBreadcrumbs items={breadcrumbItems} />

        <header className="bf-divider mt-6 border-b pb-8">
          <p className="bf-eyebrow">KT24 official dataslate</p>
          <h1 className="bf-title mt-2">{killTeam?.name}</h1>
          {killTeam?.description && (
            <p className="bf-body mt-4 max-w-2xl text-sm">{killTeam.description}</p>
          )}
          <p className="bf-muted mt-4 text-sm">Archetypes: {killTeam?.archetypes}</p>
        </header>

        <div className="mt-10 grid grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-8">
          <StickyAfterFullScroll className="min-w-0">
            <KillTeamHeader killTeam={killTeam} killteamId={killteamId} factionId={factionId} />
          </StickyAfterFullScroll>

          <section className="min-w-0 overflow-x-hidden">
            <div className="bf-divider flex flex-col gap-4 border-b pb-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="bf-heading text-xl">Operative dataslates</h2>
                <p className="bf-muted mt-1 text-sm">
                  {poOperatives.length} POs · {npoOperatives.length} NPOs
                </p>
              </div>
              <div className="bf-panel flex rounded-lg p-1" role="tablist" aria-label="Operative category">
                {[
                  { id: 'po', label: 'POs', tone: 'orange' },
                  { id: 'npo', label: 'NPOs', tone: 'amber' },
                ].map(({ id, label, tone }) => (
                  <ActionButton
                    key={id}
                    label={label}
                    role="tab"
                    aria-selected={activeTab === id}
                    onClick={() => setActiveTab(id)}
                    className={`bf-tab ${activeTab === id ? `bf-tab-active ${bfToneClass(tone)}` : 'bf-tab-inactive'}`}
                  />
                ))}
              </div>
            </div>

            {tabOperatives.length === 0 ? (
              <p className="bf-muted mt-8 rounded-xl border border-dashed border-[var(--bf-border)] px-6 py-12 text-center text-sm">
                No {activeTab === 'po' ? 'player' : 'non-player'} operatives in this tab.
              </p>
            ) : (
              <ul className="mt-6 space-y-4">
                {tabOperatives.map((operative) => (
                  <li key={operative.id}>
                    <OperativeDataslate
                      operative={operative}
                      density="compact"
                    />
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
        </BlackfangTerminalShell>
      </div>
    </div>
  )
}
