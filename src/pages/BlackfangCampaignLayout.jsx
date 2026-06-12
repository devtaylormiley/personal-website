import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import BlackfangBreadcrumbs from '../components/blackfang/BlackfangBreadcrumbs'
import BlackfangCampaignNav from '../components/blackfang/BlackfangCampaignNav'
import BlackfangTerminalShell from '../components/blackfang/BlackfangTerminalShell'
import PageEndNavFloats from '../components/PageEndNavFloats'
import ActionButton from '../components/ui/ActionButton'
import { useAuth } from '../context/AuthContext'
import { isBlackfangSignInVisible } from '../lib/blackfangAuth'
import {
  CAMPAIGN_HUB_PATH,
  getCampaignSection,
  getRegistryTabId,
  getRegistryTabLabel,
  isCampaignHub,
} from '../lib/blackfangNavigation'

const NAV_COLLAPSED_KEY = 'bf-nav-collapsed'

function readNavCollapsed() {
  try {
    return localStorage.getItem(NAV_COLLAPSED_KEY) === '1'
  } catch {
    return false
  }
}

export default function BlackfangCampaignLayout() {
  const { user, loading, hasSupabaseEnv, signInWithGoogle, signOut } = useAuth()
  const { pathname, search } = useLocation()
  const showSignIn = isBlackfangSignInVisible(search)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [navCollapsed, setNavCollapsed] = useState(readNavCollapsed)

  const hub = isCampaignHub(pathname)
  const section = getCampaignSection(pathname)
  const registryTabId = getRegistryTabId(pathname)
  const registryTabLabel = registryTabId ? getRegistryTabLabel(registryTabId) : null

  useEffect(() => {
    try {
      localStorage.setItem(NAV_COLLAPSED_KEY, navCollapsed ? '1' : '0')
    } catch {
      /* ignore */
    }
  }, [navCollapsed])

  const breadcrumbItems = [
    ...(hub
      ? [{ label: 'Blackfang Campaign', icon: 'campaign' }]
      : [
          { label: 'Blackfang Campaign', to: CAMPAIGN_HUB_PATH, icon: 'campaign' },
          ...(section
            ? [
                {
                  label: section.breadcrumbLabel,
                  to: `${CAMPAIGN_HUB_PATH}/${section.to}`,
                  icon: section.icon,
                },
              ]
            : []),
          ...(registryTabLabel ? [{ label: registryTabLabel }] : []),
        ]),
  ]

  return (
    <div className="blackfang-campaign bf-campaign-app min-h-screen">
      <div className="bf-campaign-shell">
        <BlackfangCampaignNav
          mobileOpen={mobileNavOpen}
          onMobileClose={() => setMobileNavOpen(false)}
          collapsed={navCollapsed}
          onToggleCollapsed={() => setNavCollapsed((value) => !value)}
        />

        <div className="bf-campaign-main">
          <BlackfangTerminalShell className="bf-campaign-terminal">
            <div className="bf-campaign-chrome mb-4 border-b border-[var(--bf-border)] pb-3">
              <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                <div className="flex min-w-0 flex-1 items-center gap-2">
                  <ActionButton
                    label="Menu"
                    iconOnly
                    onClick={() => setMobileNavOpen(true)}
                    className="bf-btn-ghost bf-nav-menu-trigger shrink-0 md:hidden"
                    aria-expanded={mobileNavOpen}
                    aria-controls="bf-campaign-nav-drawer"
                  />
                  <BlackfangBreadcrumbs items={breadcrumbItems} />
                </div>
                {hasSupabaseEnv && (user || showSignIn) ? (
                  <div className="flex shrink-0 items-center gap-2">
                    {user ? (
                      <>
                        <p className="bf-muted max-w-[14rem] truncate text-[11px]">{user.email}</p>
                        <ActionButton
                          label="Sign out"
                          onClick={() => signOut().catch(() => {})}
                          className="bf-btn-ghost px-2.5 py-1.5 text-[11px] font-medium"
                        />
                      </>
                    ) : (
                      <ActionButton
                        label="Sign in with Google"
                        disabled={loading}
                        onClick={() => signInWithGoogle().catch(() => {})}
                        className="bf-btn-primary px-2.5 py-1.5 text-[11px] font-medium disabled:opacity-50"
                      />
                    )}
                  </div>
                ) : hasSupabaseEnv ? null : (
                  <p className="bf-hint shrink-0 text-[11px]">
                    Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to enable sign-in.
                  </p>
                )}
              </div>
            </div>

            <Outlet />
          </BlackfangTerminalShell>
          <PageEndNavFloats variant="blackfang" />
        </div>
      </div>
    </div>
  )
}
