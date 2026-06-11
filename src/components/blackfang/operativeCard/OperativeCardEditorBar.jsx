import EditableField from '../EditableField'

export default function OperativeCardEditorBar({
  operative,
  officialOperatives,
  onCopyFromOperative,
  copyLoading,
  onFieldChange,
  compact,
}) {
  return (
    <div
      className={`operative-card-editor rounded-t-xl border border-b-0 px-3 py-2 sm:px-4 sm:py-3 ${compact ? '' : ''}`}
    >
      <p className="bf-mono-label mb-2">Dataslate editor</p>
      <div className={`grid w-full gap-3 ${compact ? '' : 'sm:grid-cols-2'}`}>
        {officialOperatives?.length > 0 && onCopyFromOperative ? (
          <label className="block w-full min-w-0 sm:col-span-2">
            <span className="bf-mono-label mb-1 block">Copy from existing operative</span>
            <select
              value=""
              onChange={(e) => {
                const key = e.target.value
                if (key) onCopyFromOperative(key)
              }}
              disabled={copyLoading}
              className="bf-field-input w-full text-sm disabled:opacity-50"
            >
              <option value="">
                {copyLoading ? 'Loading…' : 'Select an operative…'}
              </option>
              {officialOperatives.map((entry) => (
                <option key={entry.key} value={entry.key}>
                  {entry.teamName} — {entry.name}
                </option>
              ))}
            </select>
          </label>
        ) : null}
        <div className="flex w-full min-w-0 flex-wrap items-end gap-2 sm:col-span-2">
          <label className="block">
            <span className="bf-mono-label mb-1 block">Category</span>
            <select
              value={operative.category}
              onChange={(e) => onFieldChange('category', e.target.value)}
              className="bf-field-input text-sm"
            >
              <option value="po">PO</option>
              <option value="npo">NPO</option>
            </select>
          </label>
          <EditableField
            label="Role"
            value={operative.role}
            onChange={(v) => onFieldChange('role', v)}
            className="min-w-[8rem] flex-1"
          />
        </div>
      </div>
    </div>
  )
}
