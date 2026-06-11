import { RegistryDataslateCloseButton } from './RegistryDataslateActions'

export default function RegistryDataslatePlaceholder({ onClose, message, error = false }) {
  return (
    <article className="operative-card w-full min-w-0 overflow-hidden rounded-xl border-2 border-amber-800/60 bg-gradient-to-b from-zinc-900 via-zinc-950 to-black shadow-lg shadow-black/40">
      <header className="operative-card-name relative border-b border-zinc-600/50 px-4 py-3 pr-24 text-left">
        <div className="absolute top-2 right-2 z-10">
          <RegistryDataslateCloseButton onClick={onClose} />
        </div>
        <p className={error ? 'bf-error text-sm' : 'bf-muted text-sm'}>{message}</p>
      </header>
    </article>
  )
}
