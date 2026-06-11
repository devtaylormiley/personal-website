import { Link, useLocation } from 'react-router-dom'

const navLinks = [
  { label: 'About', href: '/#about' },
  { label: 'Projects', href: '/#projects' },
  { label: 'Contact', href: '/#contact' },
]

export default function Navbar({ minimal = false }) {
  const location = useLocation()
  const onHome = location.pathname === '/'

  return (
    <header className="site-navbar fixed inset-x-0 top-0 z-50 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link
          to="/"
          className="site-navbar__brand cursor-pointer text-sm font-semibold tracking-tight text-zinc-100 transition-colors hover:text-white"
        >
          {minimal ? '← Portfolio' : 'Portfolio'}
        </Link>
        {!minimal && (
          <ul className="flex items-center gap-6 sm:gap-8">
            {navLinks.map(({ label, href }) => (
              <li key={href}>
                <a
                  href={onHome ? href : href}
                  className="site-navbar__link cursor-pointer text-sm text-zinc-300 transition-colors hover:text-zinc-50"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        )}
        {minimal && (
          <span className="text-xs font-medium tracking-wide text-violet-400 uppercase">
            Blackfang Campaign
          </span>
        )}
      </nav>
    </header>
  )
}
