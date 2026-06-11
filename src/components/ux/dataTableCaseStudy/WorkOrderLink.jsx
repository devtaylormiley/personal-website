export default function WorkOrderLink({ workOrderId, onOpen }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="font-medium text-violet-400 hover:text-violet-300 hover:underline"
    >
      {workOrderId}
    </button>
  )
}
