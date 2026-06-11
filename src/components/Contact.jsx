import { contactContent } from '../data/homeContent'
import ContactFormShowcase from './contact/ContactFormShowcase'
import HomeSection from './home/HomeSection'

export default function Contact() {
  return (
    <HomeSection
      id="contact"
      eyebrow={contactContent.eyebrow}
      title={contactContent.title}
      lead={contactContent.lead}
      align="center"
    >
      <ContactFormShowcase />
    </HomeSection>
  )
}
