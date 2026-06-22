import { useEffect, useMemo, useRef, useState } from 'react'
import ActionButton from '../ui/ActionButton'
import { parseAbilities } from '../../lib/parseAbilities'
import { dataslateToneClass } from '../../lib/ruleChipTones'

const EMPTY_ABILITY = { name: '', body: '' }

const inputClass = 'bf-field-input w-full min-w-0 px-1.5 py-1 text-sm'

function isEmptyAbility(entry) {
  return !entry?.name?.trim() && !entry?.body?.trim()
}

function AbilityName({ entry, compact }) {
  const nameClass = `font-medium text-[var(--bf-item,var(--bf-accent))] uppercase ${
    compact ? 'font-mono text-xs' : 'font-mono text-sm'
  }`

  if (entry.name?.trim()) {
    return <span className={nameClass}>{entry.name}</span>
  }

  return <span className="bf-muted text-sm">Untitled ability</span>
}

function AbilityBody({ body, compact }) {
  if (!body?.trim()) {
    return <span className="bf-muted text-sm">—</span>
  }

  return (
    <p className={`bf-body whitespace-pre-wrap text-sm ${compact ? 'text-xs' : ''}`}>{body}</p>
  )
}

export default function OperativeAbilitiesTable({
  abilitiesText,
  operativeId,
  compact = false,
  editable = false,
  onAbilityChange,
  onAddAbility,
  onRemoveAbility,
}) {
  const entries = useMemo(() => parseAbilities(abilitiesText ?? ''), [abilitiesText])
  const [editingRows, setEditingRows] = useState(() => new Set())
  const prevLength = useRef(entries.length)
  const prevEntries = useRef(entries)

  useEffect(() => {
    const prev = prevEntries.current
    const prevLen = prevLength.current
    const len = entries.length

    if (len === prevLen + 1 && isEmptyAbility(entries[len - 1])) {
      setEditingRows((rows) => new Set(rows).add(len - 1))
    } else if (len !== prevLen) {
      setEditingRows(new Set())
    } else {
      let changed = 0
      for (let i = 0; i < len; i += 1) {
        if (entries[i] !== prev[i]) changed += 1
      }
      if (changed > 1) {
        setEditingRows(new Set())
      }
    }

    prevLength.current = len
    prevEntries.current = entries
  }, [entries])

  function toggleEdit(index) {
    setEditingRows((prev) => {
      const next = new Set(prev)
      if (next.has(index)) next.delete(index)
      else next.add(index)
      return next
    })
  }

  function handleRemove(index) {
    onRemoveAbility(index)
    setEditingRows((prev) => {
      const next = new Set()
      for (const row of prev) {
        if (row < index) next.add(row)
        else if (row > index) next.add(row - 1)
      }
      return next
    })
  }

  const cellPad = compact ? 'px-2 py-1.5 align-top' : 'px-3 py-2.5 align-top'
  const headClass = compact ? 'px-2 py-1 text-[10px]' : 'px-3 py-2 text-xs'
  const tableClass = `operative-card-table w-full min-w-0 text-left ${compact ? 'text-xs' : 'text-sm'}`

  return (
    <div>
      <div className="operative-card-table-wrap overflow-x-auto">
        <table className={tableClass}>
          <thead>
            <tr className="operative-card-table-head">
              <th className={`font-medium ${headClass}`}>Ability</th>
              <th className={`font-medium ${headClass}`}>Description</th>
              {editable ? <th className={`font-medium ${headClass} w-24`}> </th> : null}
            </tr>
          </thead>
          <tbody>
            {entries.length === 0 ? (
              <tr>
                <td colSpan={editable ? 3 : 2} className={`${cellPad} bf-muted text-left`}>
                  No abilities yet.
                </td>
              </tr>
            ) : (
              entries.map((entry, index) => {
                const editing = editable && editingRows.has(index)
                const toneClass = dataslateToneClass(entry.name ?? entry.body, index)
                const rowClass = editable
                  ? 'border-b border-zinc-800/80 last:border-0 operative-card-weapon-row'
                  : `bf-dataslate-row border-t border-[var(--bf-border)]/60 ${toneClass}`

                return (
                  <tr key={`${operativeId}-ability-${index}`} className={rowClass}>
                    {editing ? (
                      <>
                        <td className="px-2 py-1.5 align-top">
                          <input
                            value={entry.name ?? ''}
                            onChange={(e) => onAbilityChange(index, 'name', e.target.value)}
                            placeholder="Ability name"
                            className={inputClass}
                            aria-label="Ability name"
                          />
                        </td>
                        <td className="px-2 py-1.5 align-top">
                          <textarea
                            value={entry.body ?? ''}
                            onChange={(e) => onAbilityChange(index, 'body', e.target.value)}
                            placeholder="Ability rules and description…"
                            rows={compact ? 2 : 3}
                            className={`${inputClass} min-h-[3rem] resize-y`}
                            aria-label="Ability description"
                          />
                        </td>
                        <td className={`${cellPad} align-top`}>
                          <div className="flex items-center gap-1">
                            <ActionButton
                              iconOnly
                              label={editing ? 'Done' : 'Edit'}
                              onClick={() => toggleEdit(index)}
                              className="rounded border border-zinc-700 p-1 text-zinc-300 hover:border-zinc-500 hover:text-zinc-100"
                            />
                            <ActionButton
                              iconOnly
                              label="Delete"
                              onClick={() => handleRemove(index)}
                              className="rounded border border-red-900/50 p-1 text-red-300 hover:border-red-700"
                            />
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className={cellPad}>
                          <AbilityName entry={entry} compact={compact} />
                        </td>
                        <td className={cellPad}>
                          <AbilityBody body={entry.body} compact={compact} />
                        </td>
                        {editable ? (
                          <td className={`${cellPad} align-top`}>
                            <div className="flex items-center gap-1">
                              <ActionButton
                                iconOnly
                                label="Edit"
                                onClick={() => toggleEdit(index)}
                                className="rounded border border-zinc-700 p-1 text-zinc-300 hover:border-zinc-500 hover:text-zinc-100"
                              />
                              <ActionButton
                                iconOnly
                                label="Delete"
                                onClick={() => handleRemove(index)}
                                className="rounded border border-red-900/50 p-1 text-red-300 hover:border-red-700"
                              />
                            </div>
                          </td>
                        ) : null}
                      </>
                    )}
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {editable ? (
        <ActionButton
          label="Add ability"
          onClick={() => onAddAbility({ ...EMPTY_ABILITY })}
          className="bf-btn-ghost mt-2 rounded-lg px-3 py-1.5 text-xs font-medium"
        />
      ) : null}
    </div>
  )
}
