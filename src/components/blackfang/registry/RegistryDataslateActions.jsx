import { Link } from 'react-router-dom'
import ActionButton from '../../ui/ActionButton'
import { ButtonIcon } from '../../ui/buttonIcons'
import { registryTabToPath } from '../../../lib/blackfangNavigation'

export function RegistryDataslateToggle({ isExpanded, onClick, label = 'Dataslate', className = '' }) {
  return (
    <ActionButton
      label={isExpanded ? 'Close' : label}
      onClick={onClick}
      className={`bf-btn-primary cursor-pointer rounded-md px-2.5 py-1.5 text-xs font-medium ${className}`}
    />
  )
}

export function RegistryDataslateCloseButton({ onClick, className = '' }) {
  return (
    <ActionButton
      label="Close"
      onClick={onClick}
      className={`bf-btn-primary cursor-pointer rounded-md px-2.5 py-1.5 text-xs font-medium ${className}`}
    />
  )
}

export function RegistryOpenJointOpLink({ jointOpSlug, jointOpName, className = '' }) {
  if (!jointOpSlug) return null

  return (
    <Link
      to={`${registryTabToPath('joint-npos')}?pack=${encodeURIComponent(jointOpSlug)}`}
      className={`bf-btn-ghost inline-flex cursor-pointer items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium ${className}`}
      onClick={(e) => e.stopPropagation()}
    >
      <ButtonIcon label="Open" className="h-3.5 w-3.5 shrink-0" />
      <span>{jointOpName ? `Open ${jointOpName}` : 'Open joint-op pack'}</span>
    </Link>
  )
}

export function RegistryOpenTeamLink({ teamSlug, teamName, className = '' }) {
  if (!teamSlug) return null

  return (
    <Link
      to={`/projects/blackfang-campaign/${teamSlug}`}
      className={`bf-btn-ghost inline-flex cursor-pointer items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium ${className}`}
      onClick={(e) => e.stopPropagation()}
    >
      <ButtonIcon label="Open" className="h-3.5 w-3.5 shrink-0" />
      <span>{teamName ? `Open ${teamName}` : 'Open kill team'}</span>
    </Link>
  )
}
