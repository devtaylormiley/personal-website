import { cloneElement, isValidElement } from 'react'
import CardImage from '../../ui/CardImage'
import RegistryDataslatePlaceholder from './RegistryDataslatePlaceholder'

export default function RegistryExpandableCard({
  title,
  subtitle,
  meta,
  badge,
  imageSrc,
  imageFallback,
  imageAlt,
  showImage = false,
  isExpanded,
  onToggle,
  loading = false,
  error = '',
  expandedContent,
  actions,
  summary,
  headerInlineSummary = false,
  headerInlineContent,
  expandedLayout = 'inline',
  footer,
}) {
  if (isExpanded && expandedLayout === 'replace') {
    return (
      <article className="bf-team-card overflow-hidden rounded-2xl ring-1 ring-[var(--bf-accent)]/35">
        {loading ? (
          <RegistryDataslatePlaceholder onClose={onToggle} message="Loading dataslate…" />
        ) : null}
        {error && !loading ? (
          <RegistryDataslatePlaceholder onClose={onToggle} message={error} error />
        ) : null}
        {!loading && !error && expandedContent
          ? isValidElement(expandedContent)
            ? cloneElement(expandedContent, { onClose: onToggle })
            : expandedContent
          : null}
      </article>
    )
  }

  if (headerInlineContent) {
    return (
      <article
        className={`bf-team-card overflow-hidden rounded-2xl p-4 md:p-6 ${
          isExpanded ? 'ring-1 ring-[var(--bf-accent)]/35' : ''
        }`}
      >
        <div className="p-4 md:p-6">{headerInlineContent}</div>
        {footer && !isExpanded ? (
          <div className="flex flex-wrap items-center gap-2 border-t border-[var(--bf-border)]/60 bg-zinc-950/40 px-4 py-3 md:px-6">
            {footer}
          </div>
        ) : null}
      </article>
    )
  }

  if (headerInlineSummary && summary) {
    return (
      <article
        className={`bf-team-card flex flex-col overflow-hidden rounded-2xl ${
          isExpanded ? 'ring-1 ring-[var(--bf-accent)]/35' : ''
        }`}
      >
        <button
          type="button"
          onClick={onToggle}
          className="group flex flex-1 p-4 text-left md:p-6"
          aria-expanded={isExpanded}
        >
          <div className="flex w-full flex-col gap-4 md:flex-row md:items-center md:gap-8">
            <h3 className="min-w-0 shrink-0 text-left text-lg font-medium text-[var(--bf-accent-bright)] group-hover:text-[var(--bf-accent)] md:max-w-[38%] md:text-xl">
              {title}
            </h3>
            <div className="min-w-0 w-full flex-1 md:w-auto">{summary}</div>
          </div>
        </button>

        {actions ? (
          <div className="flex flex-wrap items-center gap-2 border-t border-[var(--bf-border)]/60 bg-zinc-950/40 px-4 py-3">
            {actions}
          </div>
        ) : null}
      </article>
    )
  }

  return (
    <article
      className={`bf-team-card flex flex-col overflow-hidden rounded-2xl ${
        isExpanded ? 'ring-1 ring-[var(--bf-accent)]/35' : ''
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        className="group flex flex-col overflow-hidden text-left"
        aria-expanded={isExpanded}
      >
        {showImage ? (
          <CardImage
            src={imageSrc}
            fallbackSrc={imageFallback}
            alt={imageAlt ?? title}
            aspect="video"
            badge={badge}
          />
        ) : null}
        <div className="flex flex-1 flex-col p-4 sm:p-5">
          <h3 className="text-base font-medium text-[var(--bf-text-bright)] group-hover:text-[var(--bf-accent-bright)] sm:text-lg">
            {title}
          </h3>
          {subtitle ? <p className="bf-muted mt-1 text-sm">{subtitle}</p> : null}
          {meta ? (
            <p className="bf-accent-text mt-3 text-xs font-medium uppercase tracking-wider">{meta}</p>
          ) : null}
        </div>
      </button>

      {summary ? (
        <div className="border-t border-[var(--bf-border)]/60 bg-zinc-950/60 px-3 py-2 sm:px-4">{summary}</div>
      ) : null}

      {actions ? (
        <div className="flex flex-wrap items-center gap-2 border-t border-[var(--bf-border)]/60 bg-zinc-950/40 px-3 py-2.5">
          {actions}
        </div>
      ) : null}

      {isExpanded && expandedLayout === 'inline' ? (
        <div className="border-t border-[var(--bf-border)]/60 bg-[var(--bf-bg-elevated)]/80 px-3 py-4 sm:px-4">
          {loading ? (
            <p className="bf-muted py-4 text-center text-sm">Loading dataslate…</p>
          ) : null}
          {error && !loading ? <p className="bf-error text-xs">{error}</p> : null}
          {!loading && !error && expandedContent ? expandedContent : null}
        </div>
      ) : null}
    </article>
  )
}
