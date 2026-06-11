export default function CaseStudyDemoChrome({ variant, title, children }) {
  const isBefore = variant === 'before'

  return (
    <div
      className={`overflow-hidden rounded-lg bg-zinc-950 shadow-inner ${
        isBefore ? 'border border-red-900/30' : 'border border-emerald-900/40'
      }`}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900 px-3 py-2">
        <p className="text-xs font-medium text-zinc-500">{title}</p>
        <span
          className={`rounded px-2 py-0.5 text-[10px] font-medium uppercase ${
            isBefore ? 'bg-red-950/80 text-red-300' : 'bg-emerald-950/80 text-emerald-300'
          }`}
        >
          {isBefore ? 'Before' : 'After'}
        </span>
      </div>
      {children}
    </div>
  )
}
