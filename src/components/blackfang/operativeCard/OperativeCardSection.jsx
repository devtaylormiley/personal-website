export default function OperativeCardSection({ title, children, className = '', compact }) {
  return (
      <section className={`${className} w-full min-w-0`}>
      <div
        className={`operative-card-section-head border-b border-amber-800/50 bg-amber-950/50 px-3 ${compact ? 'py-1' : 'py-1.5'}`}
      >
        <h4
          className={`text-left font-semibold tracking-[0.25em] text-amber-100 uppercase ${compact ? 'text-[10px]' : 'text-xs'}`}
        >
          {title}
        </h4>
      </div>
      <div className={`operative-card-section-body bg-zinc-950/60 ${compact ? 'p-2' : 'p-3'}`}>
        {children}
      </div>
    </section>
  )
}
