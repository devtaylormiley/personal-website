import { useEffect, useMemo, useRef, useState } from 'react'

function findWeaponMatch(name, options) {
  const trimmed = name.trim()
  if (!trimmed) return null
  return options.find((w) => w.name.toLowerCase() === trimmed.toLowerCase()) ?? null
}

function formatWeaponStats(weapon) {
  const parts = [
    weapon.atk !== '' && weapon.atk != null ? `ATK ${weapon.atk}` : null,
    weapon.hit ? `HIT ${weapon.hit}` : null,
    weapon.dmg ? `DMG ${weapon.dmg}` : null,
  ].filter(Boolean)
  return parts.join(' · ')
}

export default function WeaponNameCombobox({
  value,
  options,
  onChange,
  onSelectWeapon,
  onOpenChange,
  className = '',
  placeholder = 'Weapon name',
}) {
  const [open, setOpen] = useState(false)
  const [highlightIndex, setHighlightIndex] = useState(0)
  const containerRef = useRef(null)
  const optionRefs = useRef([])

  function setDropdownOpen(next) {
    setOpen(next)
    onOpenChange?.(next)
  }

  const filtered = useMemo(() => {
    const query = value.trim().toLowerCase()
    const list = query
      ? options.filter((weapon) => weapon.name.toLowerCase().includes(query))
      : options
    return list
  }, [value, options])

  const highlighted = filtered[highlightIndex] ?? null

  useEffect(() => {
    setHighlightIndex(0)
  }, [value, options.length])

  useEffect(() => {
    optionRefs.current = optionRefs.current.slice(0, filtered.length)
  }, [filtered.length])

  useEffect(() => {
    if (!open) return
    const option = optionRefs.current[highlightIndex]
    option?.scrollIntoView({ block: 'nearest' })
  }, [highlightIndex, open, filtered.length])

  function selectWeapon(weapon) {
    onSelectWeapon({ ...weapon, name: weapon.name })
    setDropdownOpen(false)
  }

  function handleInputChange(event) {
    onChange(event.target.value)
    setDropdownOpen(true)
  }

  function handleBlur() {
    window.setTimeout(() => {
      setDropdownOpen(false)
      const match = findWeaponMatch(value, options)
      if (match) selectWeapon(match)
    }, 150)
  }

  function handleKeyDown(event) {
    if (!open && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
      setDropdownOpen(true)
      return
    }

    if (!open || filtered.length === 0) return

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setHighlightIndex((index) => (index + 1) % filtered.length)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setHighlightIndex((index) => (index - 1 + filtered.length) % filtered.length)
    } else if (event.key === 'Enter' && highlighted) {
      event.preventDefault()
      selectWeapon(highlighted)
    } else if (event.key === 'Escape') {
      setDropdownOpen(false)
    }
  }

  return (
    <div ref={containerRef} className="relative w-full min-w-0">
      <input
        value={value}
        placeholder={placeholder}
        onChange={handleInputChange}
        onFocus={() => setDropdownOpen(true)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        autoComplete="off"
        role="combobox"
        aria-expanded={open}
        aria-autocomplete="list"
        className={`w-full min-w-0 ${className}`}
      />

      {open && filtered.length > 0 && (
        <div className="bf-weapon-combobox absolute z-30 mt-1 w-max min-w-full max-w-[min(100vw-2rem,28rem)] overflow-hidden rounded-md">
          <ul className="max-h-72 overflow-y-auto py-1" role="listbox">
            {filtered.map((weapon, index) => {
              const active = index === highlightIndex
              return (
                <li
                  key={`${weapon.name}-${index}`}
                  ref={(node) => {
                    optionRefs.current[index] = node
                  }}
                  role="option"
                  aria-selected={active}
                >
                  <button
                    type="button"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => selectWeapon(weapon)}
                    onMouseEnter={() => setHighlightIndex(index)}
                    className={`bf-weapon-combobox-item block w-full px-3 py-2 text-left transition-colors ${
                      active ? 'bf-weapon-combobox-item--active' : ''
                    }`}
                  >
                    <p className="text-sm font-medium text-[var(--bf-field)]">{weapon.name}</p>
                    <p className="bf-muted mt-0.5 text-xs">{formatWeaponStats(weapon)}</p>
                    {weapon.rules ? (
                      <p className="mt-0.5 line-clamp-2 text-xs text-[var(--bf-field-muted)]">{weapon.rules}</p>
                    ) : null}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}
