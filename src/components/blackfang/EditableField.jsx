import { useEffect, useRef } from 'react'

function adjustTextareaHeight(textarea) {
  if (!textarea) return
  textarea.style.height = 'auto'
  textarea.style.height = `${textarea.scrollHeight}px`
}

export default function EditableField({
  label,
  value,
  onChange,
  multiline = false,
  type = 'text',
  className = '',
  inputClassName = '',
}) {
  const textareaRef = useRef(null)

  useEffect(() => {
    if (multiline) adjustTextareaHeight(textareaRef.current)
  }, [value, multiline])

  function handleTextareaChange(event) {
    onChange(event.target.value)
    adjustTextareaHeight(event.target)
  }

  return (
    <label className={`block w-full min-w-0 ${className}`}>
      {label ? <span className="bf-field-label mb-1 block">{label}</span> : null}
      {multiline ? (
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleTextareaChange}
          rows={1}
          className={`bf-field-input w-full min-h-[2.75rem] resize-none overflow-hidden ${inputClassName}`}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`bf-field-input w-full ${inputClassName}`}
        />
      )}
    </label>
  )
}
