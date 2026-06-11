import { BLACKFANG_GALAXY_MAP_URL } from '../lib/assetImages'
import KarakTyrMissionMap from '../components/blackfang/KarakTyrMissionMap'

export default function BlackfangAboutPage() {
  return (
    <article className="bf-lore-document-panel bf-panel-elevated p-4 sm:p-8 lg:p-10">
      <header className="bf-lore-document-masthead">
        <p className="bf-lore-document-classification">Classified · Inquisitorial brief</p>
        <h1 className="bf-lore-document-title">Campaign Lore</h1>
        <p className="bf-lore-document-subtitle">
          Blackfang joint-operation · Ghoul Stars sector · Karak-Tyr insertion
        </p>
      </header>

      <div className="bf-lore-document-body">
        <section className="bf-lore-document-section" aria-labelledby="lore-preamble">
          <h2 id="lore-preamble" className="bf-lore-document-section-title">
            I · Imperial preamble
          </h2>

          <p className="bf-lore-document-lead bf-lore-document-lead-dropcap">
            It is the 41st millennium. For more than a hundred centuries the Emperor has sat immobile on
            the Golden Throne of Earth. He is the master of mankind by the will of the gods, and master
            of a million worlds by the might of his inexhaustible armies. He is a rotting carcass writhing
            invisibly with power from the Dark Age of Technology. He is the Carrion Lord of the
            Imperium for whom a thousand souls are sacrificed every day, so that he may never truly die.
          </p>

          <p>
            Yet even in his deathless state, the Emperor continues his eternal vigilance. Mighty
            battlefleets cross the daemon-infested miasma of the warp, the only route between distant
            stars, their way lit by the Astronomican, the psychic manifestation of the Emperor&apos;s will.
            Vast armies give battle in his name on uncounted worlds. Greatest amongst His soldiers are the
            Adeptus Astartes, the Space Marines, bio-engineered super-warriors. Their comrades in arms are
            legion: the Astra Militarum and countless planetary defence forces, the ever-vigilant
            Inquisition and the tech-priests of the Adeptus Mechanicus to name only a few. But for all
            their multitudes, they are barely enough to hold off the ever-present threat from aliens,
            heretics, mutants – and worse.
          </p>

          <p>
            To be a man in such times is to be one amongst untold billions. It is to live in the cruellest
            and most bloody regime imaginable. These are the tales of those times. Forget the power of
            technology and science, for so much has been forgotten, never to be re-learned. Forget the
            promise of progress and understanding,{' '}
            <span className="bf-lore-terminal-emphasis">
              for in the grim dark future there is only war
            </span>
            .
          </p>
        </section>

        <section className="bf-lore-document-section" aria-labelledby="lore-operation">
          <h2 id="lore-operation" className="bf-lore-document-section-title">
            II · Ghoul Stars Operation Brief
          </h2>

          <p className="bf-lore-document-lead bf-lore-document-lead-dropcap">
            There is no peace amongst the stars, only an eternity of carnage and slaughter, and the
            laughter of thirsting gods. Beyond the northern fringes of the galaxy lies a haunted realm 
            of dead suns where the light of the Astronomican grows dim and cold, known as the{' '} 
            <span className="bf-lore-terminal-emphasis">
              Ghoul Stars 
            </span>
            .
            It is a cosmic graveyard where
            ships vanish without a trace, a place where the Warp cannot easily take hold, its chaotic
            currents choked and deadened by the terrifying, reality-thinned echoes a forgotten
            age.
          </p>

          <figure className="bf-lore-document-figure">
            <img
              src={BLACKFANG_GALAXY_MAP_URL}
              alt="Segmentum chart of the Milky Way galaxy with the Ghoul Stars region on the northern galactic fringe"
              className="bf-lore-document-figure-img"
              loading="lazy"
              decoding="async"
            />
            <figcaption className="bf-lore-document-figure-caption">
              Astropathic chart · Ghoul Stars sector · northern galactic fringe
            </figcaption>
          </figure>

          <p>
            Yet, it remains an irresistible siren song for the Imperium and lawless pirates alike, a
            treasure trove of long-lost technology and forbidden relics hidden among the wreckage of dead
            civilizations. To brave its borders is to court extinction, for these dead worlds are a
            shifting front of absolute horror—a realm dominated by the encroaching, silent dread of
            ancient Necron dynasties awakening from the dust, creating a dead-zone so unnatural that even
            the ravenous Tyranid hive fleets actively alter their course, completely flanking the region
            to avoid whatever nameless terrors lurk in the void.
          </p>

          <p>
            Deep within this forbidden sector drifts Karak-Tyr, a hollowed-out Necron research base long
            thought abandoned by its undying masters. Inside its pitch-black corridors a lone Deathwatch
            operative executes a solo dive into the unknown, sent to investigate and claim a forgotten
            alien artifact of terrifying power. He does not seek glory, nor does he expect extraction; he
            hunts for a relic hidden within the Black Siphon, a reality-bending sub-dimensional rift at
            the station&apos;s heart.
          </p>

          <KarakTyrMissionMap />

          <p>
            To walk these metal catacombs alone is to embrace certain doom. It is to move silently past
            dormant mechanical legions that could awaken at a single misstep. It is to feel the
            sanity-draining hum of ancient stasis fields and the unnatural chill of a tomb that has known
            no warmth for sixty million years.
          </p>

          <p>
            This is an anomalous theater of war where the typical rules of engagement fail. It is
            unprecedented for a highly trained Deathwatch veteran to operate entirely stripped of his
            kill-team, sent alone to investigate this hollowed-out moon long thought abandoned and
            scuttled. It is more bizarre still that his deployment was triggered by a rogue Tyranid
            splinter spore cluster, detected drifting straight toward the dead Necron stronghold, two
            mortal enemies converging in a place they should both despise.
          </p>

          <blockquote className="bf-lore-document-pullquote">
            There is no end to the horrors of the Ghoul Stars, for there are threats beyond xenos and
            chaos.
          </blockquote>
        </section>
      </div>

      <footer className="bf-lore-document-footer">
        <p>End of briefing · Distribution limited to authorized operatives</p>
      </footer>
    </article>
  )
}
