import { schemaBridge } from '../../data/schemaBridge'

export default function PipelineSteps() {
  const { pipelineSteps } = schemaBridge

  return (
    <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {pipelineSteps.map((step, index) => (
        <li
          key={step.id}
          className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5"
        >
          <span
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-teal-500/30 bg-teal-500/10 font-mono text-xs font-medium text-teal-300"
            aria-hidden="true"
          >
            {String(index + 1).padStart(2, '0')}
          </span>
          <h3 className="mt-3 text-base font-medium text-zinc-100">{step.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-zinc-400">{step.detail}</p>
        </li>
      ))}
    </ol>
  )
}
