import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Hero from '../components/Hero'
import ResumeDocument from '../components/ResumeDocument'
import About from '../components/About'
import Projects from '../components/Projects'
import Contact from '../components/Contact'

const RESUME_DOCUMENT_TITLE = 'Taylor Miley — Resume'
const HOME_DOCUMENT_TITLE = 'Taylor Miley — Portfolio'

export default function HomePage() {
  const { hash } = useLocation()
  const navigate = useNavigate()
  const showResume = hash === '#resume'

  useEffect(() => {
    document.title = showResume ? RESUME_DOCUMENT_TITLE : HOME_DOCUMENT_TITLE
  }, [showResume])

  function openResume() {
    navigate({ pathname: '/', hash: '#resume' })
  }

  function closeResume() {
    navigate('/')
  }

  return (
    <div className="home-page">
      {showResume ? (
        <ResumeDocument variant="embed" id="resume" onBack={closeResume} />
      ) : (
        <Hero onViewResume={openResume} />
      )}
      <About />
      <Projects />
      <Contact />
    </div>
  )
}
