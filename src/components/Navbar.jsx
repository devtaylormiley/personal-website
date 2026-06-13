import { useEffect, useId, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link, useLocation } from 'react-router-dom'

const navLinks = [
  { label: 'About', href: '/#about' },
  { label: 'Projects', href: '/#projects' },
  { label: 'Resume', href: '/#resume' },
  { label: 'Contact', href: '/#contact' },
]

function MenuIcon({ open }) {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      aria-hidden="true"
    >
      {open ? (
        <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
      ) : (
        <>
          <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
        </>
      )}
    </svg>
  )
}

export default function Navbar({ minimal = false }) {
  const location = useLocation()
  const onHome = location.pathname === '/'
  const [menuOpen, setMenuOpen] = useState(false)
  const menuId = useId()

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const linkHref = (href) => (onHome ? href.replace(/^\//, '') : href)

  const mobileMenu =
    !minimal && typeof document !== 'undefined'
      ? createPortal(
          <div
            id={menuId}
            className={`site-navbar-mobile-menu${menuOpen ? ' site-navbar-mobile-menu--open' : ''}`}
            aria-hidden={!menuOpen}
          >
            <button
              type="button"
              className="site-navbar-mobile-menu__backdrop"
              aria-label="Close menu"
              tabIndex={menuOpen ? 0 : -1}
              onClick={() => setMenuOpen(false)}
            />
            <nav
              className="site-navbar-mobile-menu__panel"
              aria-label="Mobile"
              role="navigation"
            >
              <p className="site-navbar-mobile-menu__label">Menu</p>
              <ul className="site-navbar-mobile-menu__links">
                {navLinks.map(({ label, href, to }) => (
                  <li key={href ?? to}>
                    {to ? (
                      <Link
                        to={to}
                        className="site-navbar-mobile-menu__link"
                        tabIndex={menuOpen ? 0 : -1}
                        onClick={() => setMenuOpen(false)}
                      >
                        {label}
                      </Link>
                    ) : (
                      <a
                        href={linkHref(href)}
                        className="site-navbar-mobile-menu__link"
                        tabIndex={menuOpen ? 0 : -1}
                        onClick={() => setMenuOpen(false)}
                      >
                        {label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          </div>,
          document.body,
        )
      : null

  return (
    <>
      <header
        className={`site-navbar fixed inset-x-0 top-0 z-50 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md${menuOpen ? ' site-navbar--menu-open' : ''}`}
      >
        <nav
          className="site-navbar__bar mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6 sm:py-4"
          aria-label="Primary"
        >
          <Link
            to="/"
            className="site-navbar__brand cursor-pointer text-sm font-semibold tracking-tight text-zinc-100 transition-colors hover:text-white"
          >
            {minimal ? '← Portfolio' : 'Taylor Miley'}
          </Link>

          {!minimal && (
            <>
              <ul className="site-navbar__links hidden items-center gap-6 md:flex md:gap-8">
                {navLinks.map(({ label, href, to }) => (
                  <li key={href ?? to}>
                    {to ? (
                      <Link
                        to={to}
                        className="site-navbar__link cursor-pointer text-sm text-zinc-300 transition-colors hover:text-zinc-50"
                      >
                        {label}
                      </Link>
                    ) : (
                      <a
                        href={linkHref(href)}
                        className="site-navbar__link cursor-pointer text-sm text-zinc-300 transition-colors hover:text-zinc-50"
                      >
                        {label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>

              <button
                type="button"
                className="site-navbar__menu-btn relative z-[60] inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-zinc-700/80 text-zinc-100 transition-colors hover:border-zinc-500 hover:text-white md:hidden"
                aria-expanded={menuOpen}
                aria-controls={menuId}
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                onClick={() => setMenuOpen((open) => !open)}
              >
                <MenuIcon open={menuOpen} />
              </button>
            </>
          )}

          {minimal && (
            <span className="text-xs font-medium tracking-wide text-violet-400 uppercase">
              Blackfang Campaign
            </span>
          )}
        </nav>
      </header>
      {mobileMenu}
    </>
  )
}
