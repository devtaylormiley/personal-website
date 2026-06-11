import { projectCardArtUrl } from '../../../lib/cardImages'

const TILE_IMAGE = projectCardArtUrl({
  title: 'Sign in',
  subtitle: 'Member access',
  accent: '7c3aed',
})

/**
 * Compact home-dashboard navigation tile (shared layout for before/after demos).
 */
export default function NavSignInTileCard({ children, className = '' }) {
  return (
    <div
      className={`mx-auto w-full max-w-[15rem] overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900/60 shadow-sm ${className}`}
    >
      <div className="relative h-20 overflow-hidden bg-zinc-800">
        <img
          src={TILE_IMAGE}
          alt=""
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent" />
        <span className="absolute bottom-1.5 left-2 rounded bg-zinc-950/70 px-1.5 py-0.5 text-[9px] font-medium tracking-wide text-zinc-400 uppercase">
          Quick link
        </span>
      </div>
      <div className="p-3">
        <h4 className="text-sm font-medium leading-snug text-zinc-200">Member sign-in</h4>
        <p className="mt-0.5 text-[11px] leading-relaxed text-zinc-500">
          Access your account and saved work
        </p>
        <div className="mt-2 border-t border-zinc-800/80 pt-2">{children}</div>
      </div>
    </div>
  )
}
