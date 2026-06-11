import { useEffect, useRef, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import HeroEraBackdrop from '../components/HeroEraBackdrop'
import Navbar from '../components/Navbar'
import FortPykmanConnectionOverlay from '../components/blackfang/FortPykmanConnectionOverlay'
import useScrollToTopOnNavigate from '../hooks/useScrollToTopOnNavigate'

const CAMPAIGN_PREFIX = '/projects/blackfang-campaign'

function isCampaignPath(pathname) {
  return pathname.startsWith(CAMPAIGN_PREFIX)
}

export default function PortfolioLayout() {
  const { pathname } = useLocation()
  const isCampaign = isCampaignPath(pathname)
  const prevPathRef = useRef(null)
  const [connectionRunToken, setConnectionRunToken] = useState(0)

  useScrollToTopOnNavigate()

  useEffect(() => {
    const prev = prevPathRef.current
    if (prev !== null && !isCampaignPath(prev) && isCampaignPath(pathname)) {
      setConnectionRunToken((token) => token + 1)
    }
    prevPathRef.current = pathname
  }, [pathname])

  if (isCampaign) {
    return (
      <div className="portfolio-site min-h-svh bg-zinc-950 font-sans text-zinc-200 antialiased">
        <main>
          <Outlet />
        </main>
        <FortPykmanConnectionOverlay runToken={connectionRunToken} />
      </div>
    )
  }

  return (
    <div className="portfolio-site portfolio-site--themed hero-era hero-era--modern hero-era--dark min-h-svh font-sans antialiased">
      <HeroEraBackdrop />
      <div className="portfolio-site__foreground flex min-h-svh flex-col">
        <Navbar />
        <main className="flex-1">
          <Outlet />
        </main>
        <footer className="portfolio-site__footer border-t border-zinc-800/80 px-6 py-8 text-center text-sm text-zinc-400">
          <p>© {new Date().getFullYear()} Taylor Miley. Built with React & Tailwind CSS.</p>
        </footer>
      </div>
    </div>
  )
}
