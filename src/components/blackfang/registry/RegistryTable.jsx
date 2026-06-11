export default function RegistryTable({ columns, rows, emptyMessage = 'No matches.' }) {
  return (
    <div className="bf-panel mt-4 overflow-x-auto rounded-lg">
      <table className="w-full min-w-[32rem] text-left text-xs">
        <thead>
          <tr className="operative-card-table-head border-b border-[var(--bf-border)]">
            {columns.map((column) => (
              <th key={column.key} className={`px-3 py-2 ${column.className ?? ''}`}>
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="bf-muted px-3 py-10 text-center">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr
                key={row.key}
                className="border-t border-[var(--bf-border)]/60 hover:bg-[var(--bf-accent-bg)]"
              >
                {columns.map((column) => (
                  <td key={column.key} className={`px-3 py-2.5 align-top ${column.className ?? ''}`}>
                    {column.render(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
