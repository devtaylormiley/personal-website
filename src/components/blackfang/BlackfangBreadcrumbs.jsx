import { Link } from 'react-router-dom'

const ICONS = {
  portfolio: (
    <svg className="bf-breadcrumb-icon" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M2.5 6.5 8 2.5l5.5 4v7H2.5v-7Z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      <path d="M6.5 13.5v-4h3v4" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round" />
    </svg>
  ),
  campaign: (
    <svg className="bf-breadcrumb-icon" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3 4.5A1.5 1.5 0 0 1 4.5 3h7A1.5 1.5 0 0 1 13 4.5v7A1.5 1.5 0 0 1 11.5 13h-7A1.5 1.5 0 0 1 3 11.5v-7Z"
        stroke="currentColor"
        strokeWidth="1.25"
      />
      <path d="M6 6.5h4M6 9h2.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  ),
  killTeams: (
    <svg className="bf-breadcrumb-icon" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3 4h10v8H3V4Z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      <path d="M5.5 7h5M5.5 9.5h3" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  ),
  team: (
    <svg className="bf-breadcrumb-icon" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M5 2.5h6l1.5 1.5V13.5H3.5V2.5H5Z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      <path d="M6 5.5h4M6 8h4M6 10.5h2.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  ),
  lore: (
    <svg className="bf-breadcrumb-icon" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M4 2.5h5l3 3v8H4V2.5Z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      <path d="M9 2.5V5.5H12" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round" />
    </svg>
  ),
}

function Separator() {
  return (
    <svg
      className="bf-breadcrumb-separator"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M6 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/**
 * @param {{ items: Array<{ label: string, to?: string, icon?: keyof typeof ICONS }> }} props
 */
export default function BlackfangBreadcrumbs({ items }) {
  if (!items?.length) return null

  return (
    <nav className="bf-breadcrumbs" aria-label="Breadcrumb">
      <ol className="bf-breadcrumbs-list">
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          const icon = item.icon ? ICONS[item.icon] : null

          return (
            <li key={`${item.label}-${index}`} className="bf-breadcrumbs-item">
              {index > 0 ? <Separator /> : null}
              {item.to && !isLast ? (
                <Link to={item.to} className="bf-breadcrumb-link">
                  {icon}
                  <span>{item.label}</span>
                </Link>
              ) : (
                <span className="bf-breadcrumb-current" aria-current={isLast ? 'page' : undefined}>
                  {icon}
                  <span>{item.label}</span>
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
