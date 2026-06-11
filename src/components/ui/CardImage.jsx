import { useEffect, useMemo, useState } from 'react'

const ASPECT = {
  video: 'aspect-video',
  wide: 'aspect-[2/1]',
  square: 'aspect-square',
  banner: 'aspect-[21/9]',
  fill: 'h-full w-full',
}

export default function CardImage({
  src,
  sources,
  alt = '',
  fallbackSrc,
  aspect = 'video',
  badge,
  subtitle,
  overlay = true,
  overlayClassName = '',
  subtitleClassName = 'mt-1 line-clamp-2 text-sm font-medium text-zinc-100',
  className = '',
  imageClassName = 'object-cover object-top',
}) {
  const allSources = useMemo(() => {
    const list = sources?.length ? sources : [src, fallbackSrc]
    return [...new Set(list.filter(Boolean))]
  }, [sources, src, fallbackSrc])

  const [index, setIndex] = useState(0)

  useEffect(() => {
    setIndex(0)
  }, [allSources.join('|')])

  const currentSrc = allSources[index] ?? null

  return (
    <div
      className={`relative w-full shrink-0 overflow-hidden bg-zinc-900 ${ASPECT[aspect] ?? ASPECT.video} ${className}`}
    >
      {currentSrc ? (
        <img
          key={currentSrc}
          src={currentSrc}
          alt={alt}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onError={() => setIndex((i) => i + 1)}
          className={`h-full w-full ${imageClassName}`}
        />
      ) : (
        <div className="h-full w-full bg-gradient-to-br from-zinc-800 to-zinc-950" />
      )}

      {overlay ? (
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-transparent"
          aria-hidden="true"
        />
      ) : null}

      {(badge || subtitle) && (
        <div className={`absolute inset-x-0 bottom-0 p-4 sm:p-5 ${overlayClassName}`}>
          {badge && (
            <span className="inline-block rounded-md bg-zinc-950/70 px-2 py-0.5 text-xs font-medium tracking-wide text-violet-300 uppercase backdrop-blur-sm">
              {badge}
            </span>
          )}
          {subtitle && (
            <p className={`line-clamp-2 ${subtitleClassName}`}>{subtitle}</p>
          )}
        </div>
      )}
    </div>
  )
}
