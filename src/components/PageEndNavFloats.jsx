import { Link, useLocation } from 'react-router-dom'
import useBlackfangMainSectionInsets from '../hooks/useBlackfangMainSectionInsets'
import useFooterClearance from '../hooks/useFooterClearance'
import usePageEndReached from '../hooks/usePageEndReached'
import usePageHasScrollbar from '../hooks/usePageHasScrollbar'
import useScrollPastThreshold from '../hooks/useScrollPastThreshold'
import useScrollY, { isAtScrollTop } from '../hooks/useScrollY'
import { getParentRouteNav } from '../lib/pageEndNav'

const BASE_BOTTOM_REM = 1.25

function ArrowUpIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="page-end-nav__icon">
      <path
        d="M12 19V5M12 5l-6 6M12 5l6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ArrowLeftIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="page-end-nav__icon">
      <path
        d="M19 12H5M5 12l6-6M5 12l6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function PageEndNavFloats({ variant = 'portfolio' }) {
  const { pathname, search } = useLocation()
  const atPageEnd = usePageEndReached({ pathname })
  const hasScrollbar = usePageHasScrollbar({ pathname })
  const scrollY = useScrollY(pathname)
  const scrolledPast = useScrollPastThreshold({ pathname })
  const parent = getParentRouteNav(pathname, search)
  const footerClearance = useFooterClearance(
    variant === 'portfolio' ? '.portfolio-site__footer' : null,
    pathname,
  )
  const mainInsets = useBlackfangMainSectionInsets(variant === 'blackfang' ? pathname : '')

  const showTop = scrolledPast
  const showParent = Boolean(
    parent && hasScrollbar && atPageEnd && !isAtScrollTop(scrollY),
  )

  if (!showTop && !showParent) return null

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const themeClass = variant === 'blackfang' ? 'page-end-nav--blackfang' : 'page-end-nav--portfolio'
  const navStyle =
    variant === 'blackfang'
      ? {
          '--page-end-nav-bottom': `${mainInsets.bottomPx}px`,
          '--page-end-nav-left': `${mainInsets.leftPx}px`,
          '--page-end-nav-right': `${mainInsets.rightPx}px`,
        }
      : { '--page-end-nav-bottom': `calc(${BASE_BOTTOM_REM}rem + ${footerClearance}px)` }

  return (
    <div
      className={`page-end-nav ${themeClass}`}
      style={navStyle}
      aria-live="polite"
    >
      {showParent ? (
        <Link
          to={parent.to}
          className="page-end-nav__fab page-end-nav__fab--parent"
          aria-label={`Back to ${parent.label}`}
          title={parent.label}
        >
          <ArrowLeftIcon />
          <span className="page-end-nav__fab-label">{parent.label}</span>
        </Link>
      ) : null}

      {showTop ? (
        <button
          type="button"
          className={`page-end-nav__fab page-end-nav__fab--top${atPageEnd ? '' : ' page-end-nav__fab--subtle'}`}
          onClick={scrollToTop}
          aria-label="Back to top"
          title="Back to top"
        >
          <ArrowUpIcon />
        </button>
      ) : null}
    </div>
  )
}
