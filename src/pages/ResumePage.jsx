import { Navigate } from 'react-router-dom'

/** Legacy /resume URL — resume lives inline on the home scroll flow. */
export default function ResumePage() {
  return <Navigate to={{ pathname: '/', hash: '#resume' }} replace />
}
