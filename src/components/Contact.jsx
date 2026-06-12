import { contactContent } from '../data/homeContent'
import ContactFormShowcase from './contact/ContactFormShowcase'
import HomeSection from './home/HomeSection'
import SocialLinkButtons from './SocialLinkButtons'

export default function Contact() {
  return (
    <HomeSection
      id="contact"
      eyebrow={contactContent.eyebrow}
      title={contactContent.title}
      lead={contactContent.lead}
      align="center"
      headerAfterTitle={<SocialLinkButtons className="home-section__social" />}
    >
      <p className="contact-layout__showcase-note">{contactContent.showcaseNote}</p>
      <ContactFormShowcase />
    </HomeSection>
  )
}
