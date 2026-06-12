import { Link } from 'react-router-dom'
import { ButtonIcon } from '../ui/buttonIcons'
import { bfToneClass } from '../../lib/blackfangNavigation'

export default function BlackfangCampaignNavTile({ to, title, description, icon, iconLabel, tone = 'green' }) {
  return (
    <Link to={to} className={`bf-campaign-nav-tile ${bfToneClass(tone)} group`}>
      <div className="bf-campaign-nav-tile-head">
      <h3 className="bf-campaign-nav-tile-title">{title}</h3>
        <ButtonIcon icon={icon} label={iconLabel ?? title} className="bf-campaign-nav-tile-icon h-5 w-5" />
      </div>
      
      <p className="bf-campaign-nav-tile-desc">{description}</p>
      <span className="bf-campaign-nav-tile-cta" aria-hidden>
        Enter →
      </span>
    </Link>
  )
}
