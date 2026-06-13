import { useRef, useState } from 'react'
import { portfolioImageUrl } from '../../lib/assetImages'
import { projectCardArtUrl } from '../../lib/cardImages'

const heroImage = portfolioImageUrl('project-schema-bridge-new.png')
const heroFallback = projectCardArtUrl({
  title: 'Schema Bridge',
  subtitle: 'Human-in-the-loop migration',
  accent: '#14b8a6',
})

const DIAGRAM_ALT =
  'Diagram: three legacy data exports flow through a pipeline bridge into one normalized schema table'

/** Native dimensions — prevents layout shift while the graphic loads. */
const IMAGE_WIDTH = 1154
const IMAGE_HEIGHT = 414

export default function SchemaBridgeHero({ subtitle, title, intro }) {
  const [src, setSrc] = useState(heroImage)
  const zoomDialogRef = useRef(null)

  function openZoom() {
    zoomDialogRef.current?.showModal()
  }

  function closeZoom() {
    zoomDialogRef.current?.close()
  }

  return (
    <header className="schema-bridge-hero">
      <div className="schema-bridge-hero__content">
        <p className="schema-bridge-hero__eyebrow">{subtitle}</p>
        <h1 className="schema-bridge-hero__title">{title}</h1>
        <p className="schema-bridge-hero__intro">{intro}</p>
      </div>

      <figure className="schema-bridge-hero__figure">
        <button
          type="button"
          className="schema-bridge-hero__frame schema-bridge-hero__zoom-hit"
          onClick={openZoom}
          aria-label="View pipeline diagram full size"
        >
          <img
            src={src}
            alt=""
            className="schema-bridge-hero__image"
            width={IMAGE_WIDTH}
            height={IMAGE_HEIGHT}
            loading="eager"
            decoding="async"
            onError={() => setSrc(heroFallback)}
          />
        </button>
        <figcaption className="schema-bridge-hero__caption">
          Legacy exports converge through the pipeline into a single target schema.
        </figcaption>
      </figure>

      <dialog ref={zoomDialogRef} className="schema-bridge-hero__zoom-dialog" aria-label="Pipeline diagram full size">
        <div className="schema-bridge-hero__zoom-toolbar">
          <p className="schema-bridge-hero__zoom-title">Pipeline diagram</p>
          <button
            type="button"
            className="schema-bridge-hero__zoom-close"
            onClick={closeZoom}
            aria-label="Close full size diagram"
          >
            Close
          </button>
        </div>
        <div className="schema-bridge-hero__zoom-scroll">
          <img
            src={src}
            alt={DIAGRAM_ALT}
            className="schema-bridge-hero__zoom-image"
            width={IMAGE_WIDTH}
            height={IMAGE_HEIGHT}
            decoding="async"
          />
        </div>
      </dialog>
    </header>
  )
}
