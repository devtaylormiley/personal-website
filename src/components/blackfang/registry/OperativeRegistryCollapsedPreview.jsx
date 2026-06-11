import { Link } from 'react-router-dom'
import OperativeCardProfileStatsTable from '../operativeCard/OperativeCardProfileStatsTable'
import {
  RegistryDataslateToggle,
  RegistryOpenJointOpLink,
  RegistryOpenTeamLink,
} from './RegistryDataslateActions'

function ExpandableRegion({ onToggle, isExpanded, children, className = '' }) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onToggle}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onToggle()
        }
      }}
      aria-expanded={isExpanded}
      className={`group cursor-pointer text-left outline-none focus-visible:ring-1 focus-visible:ring-[var(--bf-accent)] ${className}`}
    >
      {children}
    </div>
  )
}

export default function OperativeRegistryCollapsedPreview({
  entry,
  isExpanded,
  onToggle,
}) {
  const keywords = entry.keywords?.trim()
  const isHomebrew = entry.kind === 'homebrew'

  const sourceLink = isHomebrew ? (
    entry.teamId ? (
      <Link
        to={`/projects/blackfang-campaign/homebrew/${entry.teamId}`}
        className="bf-btn-ghost inline-flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium"
        onClick={(e) => e.stopPropagation()}
      >
        Open {entry.teamName ?? 'homebrew team'}
      </Link>
    ) : (
      <span className="bf-muted inline-flex w-full items-center justify-center px-2.5 py-1.5 text-xs font-medium uppercase tracking-wider">
        Unassigned
      </span>
    )
  ) : entry.teamSlug ? (
    <RegistryOpenTeamLink
      teamSlug={entry.teamSlug}
      teamName={entry.teamName}
      className="w-full justify-center"
    />
  ) : (
    <RegistryOpenJointOpLink
      jointOpSlug={entry.jointOpSlug}
      jointOpName={entry.jointOpName}
      className="w-full justify-center"
    />
  )

  const mobileSourceLink = isHomebrew ? (
    entry.teamId ? (
      <Link
        to={`/projects/blackfang-campaign/homebrew/${entry.teamId}`}
        className="bf-btn-ghost inline-flex cursor-pointer items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium"
        onClick={(e) => e.stopPropagation()}
      >
        Open {entry.teamName ?? 'homebrew team'}
      </Link>
    ) : (
      <span className="bf-muted text-xs font-medium uppercase tracking-wider">Unassigned</span>
    )
  ) : entry.teamSlug ? (
    <RegistryOpenTeamLink teamSlug={entry.teamSlug} teamName={entry.teamName} />
  ) : (
    <RegistryOpenJointOpLink jointOpSlug={entry.jointOpSlug} jointOpName={entry.jointOpName} />
  )

  return (
    <div className="operative-registry-collapsed flex flex-col gap-3 md:flex-row md:items-start md:gap-8">
      <div className="flex w-full min-w-0 flex-col md:min-w-[16rem] md:max-w-[min(42%,32rem)] md:flex-[1_1_38%] md:shrink-0">
        <ExpandableRegion
          onToggle={onToggle}
          isExpanded={isExpanded}
          className="flex w-full items-end py-2"
        >
          <h3 className="w-full text-lg font-medium leading-tight text-[var(--bf-accent-bright)] group-hover:text-[var(--bf-accent)] md:text-xl">
            {entry.name}
            {isHomebrew ? (
              <span className="bf-accent-text ml-2 text-[10px] font-semibold tracking-widest uppercase sm:text-xs">
                Homebrew
              </span>
            ) : null}
          </h3>
        </ExpandableRegion>

        <ExpandableRegion
          onToggle={onToggle}
          isExpanded={isExpanded}
          className="flex w-full items-start py-2.5"
        >
          {keywords ? (
            <p className="operative-card-keywords operative-card-keywords--inline w-full text-[10px] leading-snug font-medium tracking-wide uppercase sm:text-xs">
              {keywords}
            </p>
          ) : (
            <p className="bf-muted w-full text-[10px] leading-snug sm:text-xs">—</p>
          )}
        </ExpandableRegion>
      </div>

      <ExpandableRegion
        onToggle={onToggle}
        isExpanded={isExpanded}
        className="min-w-0 shrink-0 md:flex-[0_1_auto]"
      >
        <OperativeCardProfileStatsTable operative={entry} hideRoleColumn listPreview />
      </ExpandableRegion>

      <div className="hidden shrink-0 md:grid md:w-44 md:grid-rows-[auto_auto]">
        <div className="flex items-end py-2 md:border-l md:border-[var(--bf-border)]/60 md:pl-5">
          {sourceLink}
        </div>
        <div className="flex items-start py-2.5 md:border-l md:border-[var(--bf-border)]/60 md:pl-5">
          <RegistryDataslateToggle isExpanded={isExpanded} onClick={onToggle} className="w-full" />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 border-t border-[var(--bf-border)]/60 pt-3 md:hidden">
        {mobileSourceLink}
        <RegistryDataslateToggle
          isExpanded={isExpanded}
          onClick={onToggle}
          className="ml-auto"
        />
      </div>
    </div>
  )
}
