import { PROFESSIONAL_TITLE } from './siteProfile'

export const heroContent = {
  eyebrow: "Hello, I'm",
  name: 'Taylor Miley',
  role: PROFESSIONAL_TITLE,
  tagline:
    'I build clear, accessible interfaces—and ship agentic tools where humans stay in the loop on the decisions that matter.',
  primaryCta: { label: 'View my resume', to: '/resume' },
  scrollCue: { label: 'Scroll for more', href: '#about' },
  socialLinks: [
    { label: 'GitHub', href: 'https://github.com/devtaylormiley' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/taylor-miley-136620108/' },
    { label: 'Email', href: 'mailto:devtaylormiley@gmail.com' },
  ],
}

export const aboutContent = {
  eyebrow: 'About',
  title: 'Building with clarity',
  lead: 'Developer, designer, and builder of journeys people can actually follow.',
  paragraphs: [
    "I’m a software developer with over a decade of professional experience, but my path to building tech wasn’t typical. Before diving into code, I earned a degree in communication and spent years as a swim coach. That background heavily shapes my philosophy today. Coaching taught me how to break down complex, technical mechanics into clear, actionable steps, while my communication roots instilled a deep empathy for the audience. In the tech world, this translates to a relentless focus on the person on the other side of the screen. I don’t build software to show off complex architecture; I build it to solve real problems for real people.",
    "When it comes to product development, my guiding principle is radical simplicity. I believe the best user journey is the one that requires the least amount of cognitive friction. I focus on creating intuitive user flows and highly accessible designs, ensuring that applications are inclusive and effortless to navigate from the very first click. By stripping away unnecessary noise and focusing on core user goals, I build digital experiences that feel natural, predictable, and clean.",
  ],
  pillars: [
    {
      title: 'Product UX',
      description: 'Before/after case studies across checkout, onboarding, data density, errors, and accessibility.',
      href: '/projects/ux',
    },
    {
      title: 'Agentic tooling',
      description: 'Schema Bridge: Python ETL, Pydantic schemas, and a review workbench for low-confidence AI mappings.',
      href: '/projects/schema-bridge',
    },
    {
      title: 'Creative builds',
      description: 'Blackfang Campaign—a Kill Team homebrew repository and dataslate UI, built fast with Cursor.',
      href: '/projects/blackfang-campaign',
    },
  ],
  highlights: [
    { label: 'Focus', value: 'Frontend & UI, Agentic Development, Accessibility' },
    { label: 'Tools', value: 'Vue, Angular, React, TypeScript, Tailwind, .NET, SQL, Python' },
    { label: 'Availability', value: 'Available for Remote Work' },
  ],
}

export const projectsContent = {
  eyebrow: 'Work',
  title: 'Skills showcase',
  lead: 'AI-assisted pipelines, migration tooling, campaign resources, and UI/UX wins from product work.',
}

export const contactContent = {
  eyebrow: 'Contact',
  title: "Let's work together",
  lead: 'Have a product challenge, a role in mind, or a collaboration idea? Send a note below—I read every message personally.',
  showcaseNote:
    'The form below is a live demo of four visual treatments. Pick a style, send a real message, and it lands in my inbox queue.',
}
