import Hero from '../components/Hero'
import About from '../components/About'
import Projects from '../components/Projects'
import Contact from '../components/Contact'

export default function HomePage() {
  return (
    <div className="home-page">
      <Hero />
      <About />
      <Projects />
      <Contact />
    </div>
  )
}
