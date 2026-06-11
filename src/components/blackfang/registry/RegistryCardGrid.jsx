export default function RegistryCardGrid({ children, emptyMessage, isEmpty, columns = 3 }) {
  if (isEmpty) {
    return <p className="bf-muted mt-6 py-10 text-center text-sm">{emptyMessage}</p>
  }

  const gridClass =
    columns === 1 ? 'mt-6 grid grid-cols-1 gap-4' : 'mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3'

  return <ul className={gridClass}>{children}</ul>
}
