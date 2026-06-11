import { useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import ActionButton from '../ui/ActionButton'
import { ButtonIcon } from '../ui/buttonIcons'
import {
  CAMPAIGN_HUB_SUBROUTES,
  CAMPAIGN_NAV_HUB,
  CAMPAIGN_NAV_SECTIONS,
  getRegistryTabId,
  hubSubrouteIsActive,
  hubSubrouteToPath,
  isCampaignHub,
  isHubBranch,
  isKt24Branch,
  sectionIsActive,
  KT24_REGISTRY_TABS,
  registryTabToPath,
} from '../../lib/blackfangNavigation'

function registryTabIsActive(pathname, tabId) {
  return getRegistryTabId(pathname) === tabId
}

function navLinkClass(isActive, isSub = false) {
  const base = isSub ? 'bf-nav-drawer-sublink' : 'bf-nav-drawer-link'
  return `${base} ${isActive ? 'bf-nav-drawer-link-active' : ''}`
}

function NavItem({ to, end, title, icon, iconLabel, label, onNavigate, isActive, isSub = false }) {
  return (
    <NavLink
      to={to}
      end={end}
      title={title}
      onClick={onNavigate}
      className={() => navLinkClass(isActive, isSub)}
    >
      <ButtonIcon icon={icon} label={iconLabel} className="bf-nav-item-icon h-4 w-4 shrink-0" />
      <span className="bf-nav-item-label">{label}</span>
    </NavLink>
  )
}

export default function BlackfangCampaignNav({
  mobileOpen,
  onMobileClose,
  collapsed,
  onToggleCollapsed,
}) {
  const { pathname } = useLocation()
  const onHubBranch = isHubBranch(pathname)
  const onKt24 = isKt24Branch(pathname)

  useEffect(() => {
    if (!mobileOpen) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') onMobileClose()
    }
    document.addEventListener('keydown', onKey)
    const mq = window.matchMedia('(min-width: 768px)')
    if (!mq.matches) {
      const prevOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.removeEventListener('keydown', onKey)
        document.body.style.overflow = prevOverflow
      }
    }
    return () => document.removeEventListener('keydown', onKey)
  }, [mobileOpen, onMobileClose])

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    const onChange = () => {
      if (mq.matches) onMobileClose()
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [onMobileClose])

  const onNavigate = () => onMobileClose()

  return (
    <>
      <div
        className={`bf-nav-drawer-backdrop md:hidden ${mobileOpen ? 'bf-nav-drawer-backdrop-visible' : ''}`}
        onClick={onMobileClose}
        aria-hidden={!mobileOpen}
      />
      <aside
        id="bf-campaign-nav-drawer"
        className={`bf-campaign-nav ${mobileOpen ? 'bf-campaign-nav--mobile-open' : ''} ${collapsed ? 'bf-campaign-nav--collapsed' : ''}`}
        aria-label="Campaign navigation"
      >
        <div className="bf-nav-drawer-header">
          <p className="bf-nav-drawer-title">Navigation</p>
          <ActionButton
            label="Close"
            iconOnly
            onClick={onMobileClose}
            className="bf-btn-ghost bf-nav-drawer-close md:hidden"
          />
          <ActionButton
            label={collapsed ? 'Expand navigation' : 'Collapse navigation'}
            iconOnly
            onClick={onToggleCollapsed}
            className="bf-btn-ghost bf-nav-drawer-close hidden md:inline-flex"
            aria-expanded={!collapsed}
          />
        </div>

        <nav className="bf-nav-drawer-body" aria-label="Campaign sections">
          <ul className="bf-nav-drawer-list">
            <li className="bf-nav-drawer-section">
              <NavItem
                to={CAMPAIGN_NAV_HUB.to}
                end
                title={CAMPAIGN_NAV_HUB.title}
                icon={CAMPAIGN_NAV_HUB.icon}
                iconLabel={CAMPAIGN_NAV_HUB.iconLabel}
                label={CAMPAIGN_NAV_HUB.label}
                onNavigate={onNavigate}
                isActive={onHubBranch}
              />
              <ul
                className={`bf-nav-drawer-sublist ${onHubBranch ? '' : 'bf-nav-drawer-sublist-muted'}`}
                aria-label="Blackfang Campaign"
              >
                {CAMPAIGN_HUB_SUBROUTES.map((subroute) => (
                  <li key={subroute.to}>
                    <NavItem
                      to={hubSubrouteToPath(subroute.to)}
                      title={subroute.title}
                      icon={subroute.icon}
                      iconLabel={subroute.iconLabel}
                      label={subroute.label}
                      onNavigate={onNavigate}
                      isActive={hubSubrouteIsActive(pathname, subroute.pathMatch)}
                      isSub
                    />
                  </li>
                ))}
              </ul>
            </li>
            {CAMPAIGN_NAV_SECTIONS.map((section) => {
              const active = sectionIsActive(pathname, section)
              const showRegistry = section.pathMatch === '/kt24-data'

              return (
                <li key={section.to} className="bf-nav-drawer-section">
                  <NavItem
                    to={section.to}
                    title={section.title}
                    icon={section.icon}
                    iconLabel={section.iconLabel}
                    label={section.label}
                    onNavigate={onNavigate}
                    isActive={active}
                  />

                  {showRegistry && (
                    <ul
                      className={`bf-nav-drawer-sublist ${onKt24 ? '' : 'bf-nav-drawer-sublist-muted'}`}
                      aria-label="KT24 registry"
                    >
                      {KT24_REGISTRY_TABS.map((tab) => {
                        const subActive = registryTabIsActive(pathname, tab.id)
                        return (
                          <li key={tab.id}>
                            <NavItem
                              to={registryTabToPath(tab.id)}
                              title={tab.label}
                              iconLabel={tab.iconLabel}
                              label={tab.label}
                              onNavigate={onNavigate}
                              isActive={subActive}
                              isSub
                            />
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </li>
              )
            })}
          </ul>
        </nav>

        <footer className="bf-nav-drawer-footer">
          <Link
            to="/#projects"
            onClick={onNavigate}
            className="bf-nav-portfolio-link"
            title="Back to portfolio"
          >
            <ButtonIcon label="Portfolio" className="bf-nav-item-icon h-4 w-4 shrink-0" />
            <span className="bf-nav-item-label">Portfolio</span>
          </Link>
        </footer>
      </aside>
    </>
  )
}
