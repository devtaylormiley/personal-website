import { useState } from 'react'
import { portfolioImageUrl } from '../../lib/assetImages'
import { projectCardArtUrl } from '../../lib/cardImages'

const heroImage = portfolioImageUrl('project-schema-bridge-new.png')
const heroFallback = projectCardArtUrl({
  title: 'Schema Bridge',
  subtitle: 'Human-in-the-loop migration',
  accent: '#14b8a6',
})

/** Native dimensions — prevents layout shift while the graphic loads. */
const IMAGE_WIDTH = 1154
const IMAGE_HEIGHT = 414

export default function SchemaBridgeHero({ subtitle, title, intro }) {
  const [src, setSrc] = useState(heroImage)

  return (
    <header className="schema-bridge-hero">
      <div className="schema-bridge-hero__content">
        <p className="schema-bridge-hero__eyebrow">{subtitle}</p>
        <h1 className="schema-bridge-hero__title">{title}</h1>
        <p className="schema-bridge-hero__intro">{intro}</p>
      </div>

      <figure className="schema-bridge-hero__figure">
        <div className="schema-bridge-hero__frame">
          <img
            src={src}
            alt="Diagram: three legacy data exports flow through a pipeline bridge into one normalized schema table"
            className="schema-bridge-hero__image"
            width={IMAGE_WIDTH}
            height={IMAGE_HEIGHT}
            loading="eager"
            decoding="async"
            onError={() => setSrc(heroFallback)}
          />
        </div>
        <figcaption className="schema-bridge-hero__caption">
          Legacy exports converge through the pipeline into a single target schema.
        </figcaption>
      </figure>
    </header>
  )
}
