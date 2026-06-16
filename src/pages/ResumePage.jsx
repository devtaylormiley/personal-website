import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function ResumePage() {
  const navigate = useNavigate()

  useEffect(() => {
    navigate({ pathname: '/', hash: 'resume' }, { replace: true })
  }, [navigate])

  return null
}
