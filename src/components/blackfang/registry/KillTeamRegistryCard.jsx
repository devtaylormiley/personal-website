import { Link } from 'react-router-dom'
import CardImage from '../../ui/CardImage'
import ActionButton from '../../ui/ActionButton'
import { ButtonIcon } from '../../ui/buttonIcons'
import { factionImageUrl, killTeamImageUrl, operativeCardArtUrl } from '../../../lib/cardImages'

function teamImageSources(team) {
  if (team.kind === 'homebrew' && team.imageUrl) {
    return { src: team.imageUrl, fallback: factionImageUrl(team.factionId) }
  }
  return {
    src: killTeamImageUrl(team.killteamId),
    fallback: factionImageUrl(team.factionId) ?? operativeCardArtUrl({ title: team.name }),
  }
}

export default function KillTeamRegistryCard({ team, factionLabel, deleteBusyId, onDelete }) {
  const isHomebrew = team.kind === 'homebrew'
  const href = isHomebrew
    ? `/projects/blackfang-campaign/homebrew/${team.id}`
    : `/projects/blackfang-campaign/${team.slug}`
  const { src, fallback } = teamImageSources(team)
  const badge = isHomebrew ? 'Homebrew' : factionLabel

  return (
    <article className="bf-team-card flex h-full flex-col overflow-hidden rounded-2xl">
      <Link to={href} className="group flex flex-1 flex-col overflow-hidden">
        <CardImage
          src={src}
          fallbackSrc={fallback}
          alt={team.name}
          aspect="video"
          badge={badge}
          subtitle={team.name}
          overlayClassName="bf-team-card-overlay"
          subtitleClassName="bf-team-card-title"
        />
        <div className="flex flex-1 flex-col px-5 pt-2 pb-5">
          <p className="bf-muted flex-1 text-sm">{team.archetypes || '—'}</p>
          <p className="bf-accent-text mt-3 font-medium">
            {team.operativeCount} operative{team.operativeCount === 1 ? '' : 's'} →
          </p>
        </div>
      </Link>

      {isHomebrew ? (
        <div className="flex flex-wrap items-center gap-2 border-t border-[var(--bf-border)]/60 bg-zinc-950/40 px-3 py-2.5">
          <Link
            to={href}
            className="bf-btn-ghost inline-flex cursor-pointer items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium"
          >
            <ButtonIcon label="Edit" className="h-3.5 w-3.5 shrink-0" />
            <span>Edit</span>
          </Link>
          <ActionButton
            label={deleteBusyId === team.id ? 'Deleting…' : 'Delete'}
            onClick={() => onDelete(team)}
            disabled={deleteBusyId === team.id}
            className="bf-btn-danger ml-auto cursor-pointer rounded-md px-2.5 py-1.5 text-xs font-medium disabled:opacity-50"
          />
        </div>
      ) : null}
    </article>
  )
}
