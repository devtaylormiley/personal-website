import { ButtonIcon } from './buttonIcons'

export default function ActionButton({
  label,
  children,
  iconOnly = false,
  iconClassName,
  className = '',
  type = 'button',
  ...props
}) {
  const text = label ?? children
  const iconSize = iconOnly ? iconClassName ?? 'h-3.5 w-3.5' : iconClassName ?? 'h-4 w-4 shrink-0'

  if (iconOnly) {
    return (
      <button
        type={type}
        title={text}
        aria-label={text}
        className={`inline-flex cursor-pointer items-center justify-center disabled:cursor-not-allowed ${className}`}
        {...props}
      >
        <ButtonIcon label={text} className={iconSize} />
      </button>
    )
  }

  return (
    <button
      type={type}
      className={`inline-flex cursor-pointer items-center justify-center gap-1.5 disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      <ButtonIcon label={text} className={iconSize} />
      <span>{text}</span>
    </button>
  )
}
