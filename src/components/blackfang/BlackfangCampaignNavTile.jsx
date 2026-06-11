import { Link } from 'react-router-dom'
import { ButtonIcon } from '../ui/buttonIcons'

export default function BlackfangCampaignNavTile({ to, code, title, description, icon, iconLabel }) {
  return (
    <Link to={to} className="bf-campaign-nav-tile group">
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
