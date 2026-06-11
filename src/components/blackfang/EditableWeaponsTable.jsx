import { useEffect, useRef, useState } from 'react'
import ActionButton from '../ui/ActionButton'
import { describeWeaponRule, splitWeaponRules } from '../../lib/weaponRules'
import {
  OperativeCardTableColgroup,
  operativeCardTableAlignedClass,
} from './operativeCard/operativeCardTableColumns'
import WeaponNameCombobox from './WeaponNameCombobox'

const EMPTY_WEAPON = { name: '', atk: '', hit: '', dmg: '', rules: '' }

const inputClass =
  'bf-field-input w-full min-w-0 px-1.5 py-1 text-sm'

export default function EditableWeaponsTable({
  weapons,
  weaponOptions,
  compact,
  operativeId,
  onWeaponChange,
  onReplaceWeapon,
  onAddWeapon,
  onRemoveWeapon,
  onTypeaheadOpenChange,
  tableClassName,
  headerClassName = 'operative-card-table-head',
  ruleChipClassName = 'bf-chip cursor-help',
  wrapperClassName = 'operative-card-table-wrap overflow-x-auto',
  alignedColumns = false,
}) {
  const [editingRows, setEditingRows] = useState(() => new Set())
  const [typeaheadOpen, setTypeaheadOpen] = useState(false)
  const prevLength = useRef(weapons.length)
  const prevWeapons = useRef(weapons)

  function isEmptyWeapon(weapon) {
    return (
      !weapon?.name &&
      !weapon?.atk &&
      !weapon?.hit &&
      !weapon?.dmg &&
      !weapon?.rules
    )
  }

  function handleTypeaheadOpenChange(open) {
    setTypeaheadOpen(open)
    onTypeaheadOpenChange?.(open)
  }

  useEffect(() => {
    const prev = prevWeapons.current
    const prevLen = prevLength.current
    const len = weapons.length

    if (len === prevLen + 1 && isEmptyWeapon(weapons[len - 1])) {
      setEditingRows((rows) => new Set(rows).add(len - 1))
    } else if (len !== prevLen) {
      setEditingRows(new Set())
    } else {
      let changed = 0
      for (let i = 0; i < len; i += 1) {
        if (weapons[i] !== prev[i]) changed += 1
      }
      if (changed > 1) {
        setEditingRows(new Set())
      }
    }

    prevLength.current = len
    prevWeapons.current = weapons
  }, [weapons])

  function toggleEdit(index) {
    setEditingRows((prev) => {
      const next = new Set(prev)
      if (next.has(index)) next.delete(index)
      else next.add(index)
      return next
    })
  }

  function handleRemove(index) {
    onRemoveWeapon(index)
    setEditingRows((prev) => {
      const next = new Set()
      for (const row of prev) {
        if (row < index) next.add(row)
        else if (row > index) next.add(row - 1)
      }
      return next
    })
  }

  const cellPad = compact ? 'px-2 py-1' : 'px-3 py-2'
  const statCellPad = `${cellPad} operative-card-col-stat-cell`
  const headClass = compact ? 'px-2 py-1 text-[10px]' : 'px-3 py-2 text-xs'
  const resolvedTableClass =
    tableClassName ??
    (alignedColumns
      ? `${operativeCardTableAlignedClass} ${compact ? 'text-xs' : 'text-sm'}`
      : `operative-card-table w-full min-w-0 text-left ${compact ? 'text-xs' : 'text-sm'}`)

  const table = (
    <table className={resolvedTableClass}>
          {alignedColumns ? <OperativeCardTableColgroup actionsColumn /> : null}
          <thead>
            <tr className={headerClassName}>
              <th className={`font-medium ${headClass}`}>Weapons</th>
              <th className={`font-medium ${headClass} ${alignedColumns ? 'operative-card-col-stat-cell' : ''}`}>ATK</th>
              <th className={`font-medium ${headClass} ${alignedColumns ? 'operative-card-col-stat-cell' : ''}`}>HIT</th>
              <th className={`font-medium ${headClass} ${alignedColumns ? 'operative-card-col-stat-cell' : ''}`}>DMG</th>
              <th className={`font-medium ${headClass}`}>Rules</th>
              <th className={`font-medium ${headClass} ${alignedColumns ? '' : 'w-24'}`}> </th>
            </tr>
          </thead>
          <tbody>
            {weapons.length === 0 ? (
              <tr>
                <td colSpan={6} className={`${cellPad} bf-muted text-left`}>
                  No weapons yet.
                </td>
              </tr>
            ) : (
              weapons.map((weapon, index) => {
                const editing = editingRows.has(index)
                return (
                  <tr
                    key={`${operativeId}-w-${index}`}
                    className="border-b border-zinc-800/80 last:border-0 operative-card-weapon-row"
                  >
                    {editing ? (
                      <>
                        <td className="px-2 py-1.5 align-top">
                          <WeaponNameCombobox
                            value={String(weapon.name ?? '')}
                            options={weaponOptions}
                            onChange={(name) => onWeaponChange(index, 'name', name)}
                            onSelectWeapon={(template) => onReplaceWeapon(index, template)}
                            onOpenChange={handleTypeaheadOpenChange}
                            className={inputClass}
                          />
                        </td>
                        {['atk', 'hit', 'dmg', 'rules'].map((field) => (
                          <td
                            key={field}
                            className={`px-2 py-1.5 align-top ${field !== 'rules' && alignedColumns ? 'operative-card-col-stat-cell' : ''}`}
                          >
                            <input
                              value={String(weapon[field] ?? '')}
                              onChange={(e) =>
                                onWeaponChange(
                                  index,
                                  field,
                                  field === 'atk' ? e.target.value : e.target.value,
                                )
                              }
                              className={inputClass}
                            />
                          </td>
                        ))}
                      </>
                    ) : (
                      <>
                        <td className={`text-[var(--bf-field)] ${cellPad}`}>{weapon.name || '—'}</td>
                        <td className={`text-[var(--bf-field)] tabular-nums ${alignedColumns ? statCellPad : cellPad}`}>
                          {weapon.atk ?? '—'}
                        </td>
                        <td className={`text-[var(--bf-field)] tabular-nums ${alignedColumns ? statCellPad : cellPad}`}>
                          {weapon.hit || '—'}
                        </td>
                        <td className={`text-[var(--bf-field)] tabular-nums ${alignedColumns ? statCellPad : cellPad}`}>
                          {weapon.dmg || '—'}
                        </td>
                        <td className={cellPad}>
                          <div className="flex flex-wrap gap-1">
                            {splitWeaponRules(weapon.rules).map((rule) => (
                              <span
                                key={`${operativeId}-${index}-${rule}`}
                                title={describeWeaponRule(rule)}
                                className={`${ruleChipClassName} ${compact ? 'px-1.5 py-px text-[10px]' : 'px-2 py-0.5 text-xs'}`}
                              >
                                {rule}
                              </span>
                            ))}
                            {!weapon.rules && <span className="bf-muted">—</span>}
                          </div>
                        </td>
                      </>
                    )}
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
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
  )

  return (
    <div>
      {wrapperClassName ? (
        <div
          className={`${wrapperClassName} ${
            typeaheadOpen ? 'overflow-visible' : 'overflow-x-auto'
          }`}
        >
          {table}
        </div>
      ) : (
        table
      )}
      <ActionButton
        label="Add weapon"
        onClick={() => onAddWeapon({ ...EMPTY_WEAPON })}
        className="bf-btn-ghost mt-2 rounded-lg px-3 py-1.5 text-xs font-medium"
      />
    </div>
  )
}
