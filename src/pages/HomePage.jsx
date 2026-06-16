import { useCallback, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Hero from '../components/Hero'
import About from '../components/About'
import Projects from '../components/Projects'
import Contact from '../components/Contact'
import ResumeDocument from '../components/ResumeDocument'

export default function HomePage() {
  const location = useLocation()
  const navigate = useNavigate()
  const [resumeOpen, setResumeOpen] = useState(() => location.hash === '#resume')
  const [resumePlaced, setResumePlaced] = useState(() => location.hash === '#resume')

  const openResume = useCallback(() => {
    setResumePlaced(false)
    setResumeOpen(true)
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setResumePlaced(true)
    }
    if (location.hash !== '#resume') {
      navigate({ pathname: '/', hash: 'resume' }, { replace: true })
    }
  }, [location.hash, navigate])

  const closeResume = useCallback(() => {
    setResumeOpen(false)
    if (location.hash === '#resume') {
      navigate({ pathname: '/', hash: '' }, { replace: true })
    }
  }, [location.hash, navigate])

  const toggleResume = useCallback(() => {
    if (resumeOpen) closeResume()
    else openResume()
  }, [closeResume, openResume, resumeOpen])

  useEffect(() => {
    const shouldOpen = location.hash === '#resume'
    setResumeOpen(shouldOpen)
    setResumePlaced(shouldOpen)
  }, [location.hash])

  function handleResumeTransitionEnd(event) {
    if (event.propertyName !== 'transform') return
    if (resumeOpen) setResumePlaced(true)
    else setResumePlaced(false)
  }

  return (
    <div
      className={`home-page${resumeOpen ? ' home-page--resume-open' : ''}${
        resumePlaced ? ' home-page--resume-placed' : ''
      }`}
    >
      <div className="home-intro">
        <Hero resumeOpen={resumeOpen} onToggleResume={toggleResume} />
        <div
          id="resume"
          className={`home-intro__resume${resumeOpen ? ' home-intro__resume--open' : ''}${
            resumePlaced ? ' home-intro__resume--placed' : ''
          }`}
          aria-hidden={!resumeOpen}
          inert={!resumeOpen}
          onTransitionEnd={handleResumeTransitionEnd}
        >
          <ResumeDocument variant="embed" onBack={closeResume} />
        </div>
      </div>
      <About />
      <Projects />
      <Contact />
    </div>
  )
}
