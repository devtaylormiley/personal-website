import { PROFESSIONAL_TITLE } from './siteProfile'

export const resumeContent = {
  name: 'Taylor Miley',
  title: PROFESSIONAL_TITLE,
  contact: {
    website: 'taylormiley.net',
    email: 'devtaylormiley@gmail.com',
    phone: '(615) 517-6348',
    location: 'Nashville, TN',
  },
  summary:
    'Results-oriented Full Stack Engineer with 7+ years of experience in modernizing web applications and enhancing user interfaces. Proven ability to upgrade frameworks (Vue2 to Vue3), standardize UI elements, and implement robust permission systems. Expertise includes Vue, .NET, Angular, SQL, and accessibility standards. Eager to leverage front-end development skills and a user-centric approach to contribute to innovative AI-driven frontend solutions.',
  experience: [
    {
      id: 'precise-systems',
      role: 'Full Stack Engineer (Computer Systems Analyst, Sr.)',
      company: 'Precise Systems',
      location: 'Nashville',
      dates: '01/2024 – Present',
      intro:
        'Serving as the front-end specialist on a team supporting a Department of Defense web application.',
      highlights: [
        'Engineered the web application\'s second major epic, successfully replacing a legacy contract processing tool while concurrently upgrading the modern web app from Vue2 to Vue3, utilizing Pinia for state management and introducing composables for shared functionality across predominantly Vuetify-based components.',
        'Collaborated closely with UI/UX designers to standardize UI forms and tables, ensuring a consistent user experience and repeatedly enhancing accessibility to meet Section 508 mandated WCAG 2.0 guidelines.',
        'Implemented a sophisticated permission system for the entire modern web app, alongside developing numerous administrative pages.',
      ],
    },
    {
      id: 'healthtrust',
      role: 'Full Stack Engineer (Web App Engineer II)',
      company: 'Healthtrust',
      location: 'Nashville',
      dates: '11/2018 – 01/2024',
      highlights: [
        'Initially contributed to constructing an Angular component library with Storybook, then transitioned to full-stack development, maintaining and evolving dozens of applications.',
        'Played a key role in replacing a monolithic legacy application with a new infrastructure and suite of microservices, leveraging .Net, Angular, Vue, Python, and SQL.',
        'Fostered the creation of a new team by spearheading a successful project that integrated news and downloads pages into an existing portal using micro frontends.',
        'Selected to join a newly formed guild to address a high-visibility issue, successfully versioning three distinct APIs and implementing associated UI changes to accommodate new geographic data within weeks.',
      ],
    },
    {
      id: 'edgenet',
      role: 'Product Knowledge Engineer',
      company: 'Edgenet',
      location: 'Nashville',
      dates: '08/2016 – 08/2018',
      highlights: [
        'Engaged directly with stakeholders to design intuitive electronic catalogs by collecting, analyzing, and structuring complex product offering data for made-to-order and customizable item taxonomies, while concurrently managing multiple development initiatives.',
        'Operated within a proprietary platform and utilized a C-based rules language for development.',
      ],
    },
    {
      id: 'nss',
      role: 'Apprentice Software Developer',
      company: 'Nashville Software School',
      location: 'Nashville',
      dates: '07/2015 – 01/2016',
      highlights: [
        'Completed an intensive six-month software development bootcamp, acquiring proficiency in front-end, back-end, and mobile technologies while building database-driven web applications.',
        'Applied Git for collaborative team projects, produced individual capstone projects, and cultivated test-driven development skills.',
      ],
    },
  ],
  education: [
    {
      degree: 'A.S., Communication',
      school: 'Volunteer State Community College',
      location: 'Gallatin, TN',
      dates: '2012 – 2014',
    },
    {
      degree: 'A.S., University Studies',
      school: 'Volunteer State Community College',
      location: 'Gallatin, TN',
      dates: '2012 – 2014',
    },
  ],
  skills: ['Vue', 'Git', 'Accessibility', 'C#', 'Azure', 'SQL', '.NET', 'Angular'],
}
