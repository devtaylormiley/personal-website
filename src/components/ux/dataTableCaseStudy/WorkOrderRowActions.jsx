import ActionButton from '../../ui/ActionButton'

const iconButtonClass =
  'rounded border border-zinc-700 p-1 text-zinc-400 transition-colors hover:border-violet-500 hover:bg-violet-950/40 hover:text-zinc-100'

export default function WorkOrderRowActions({
  row,
  onComplete,
  onRestart,
  onEdit,
  onDownload,
}) {
  const isClosed = row.status === 'Closed'

  return (
    <div className="flex flex-nowrap items-center justify-end gap-0.5">
      {isClosed ? (
        <ActionButton
          label="Restart"
          iconOnly
          iconClassName="h-3 w-3"
          className={iconButtonClass}
          onClick={() => onRestart(row)}
        />
      ) : (
        <ActionButton
          label="Complete Order"
          iconOnly
          iconClassName="h-3 w-3"
          className={iconButtonClass}
          onClick={() => onComplete(row)}
        />
      )}
      <ActionButton
        label="Edit"
        iconOnly
        iconClassName="h-3 w-3"
        className={iconButtonClass}
        onClick={() => onEdit(row)}
      />
      <ActionButton
        label="Download"
        iconOnly
        iconClassName="h-3 w-3"
        className={iconButtonClass}
        onClick={() => onDownload(row)}
      />
    </div>
  )
}
