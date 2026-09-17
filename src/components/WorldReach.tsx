import { useState } from 'react'
import { ComposableMap, Geographies, Geography } from 'react-simple-maps'

const GEO_URL = '/maps/countries-110m.json'

/** ISO 3166-1 numeric ids → fill (darker = stronger presence) */
const HIGHLIGHTS: Record<string, string> = {
  '276': '#2c2c2c', // Germany
  '356': '#5c5c5c', // India
  '826': '#6a6a6a', // United Kingdom
  '124': '#8a8a8a', // Canada
  '076': '#8a8a8a', // Brazil
  '036': '#9a9a9a', // Australia
}

const BASE_FILL = '#e6e6e6'
const HOVER_LIFT = '#1a1a1a'

function countryId(geo: { id?: string | number | null }) {
  return String(geo.id ?? '').padStart(3, '0')
}

export function WorldReach() {
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <section
      id="reach"
      className="relative border-t border-navy/8 bg-white px-[clamp(1.25rem,4vw,6rem)] py-[clamp(3rem,6vw,5.5rem)]"
      aria-labelledby="reach-heading"
    >
      <div className="mx-auto max-w-[90rem]">
        <div className="max-w-[36rem]">
          <p className="flex items-center gap-3 text-[clamp(0.58rem,0.9vw,0.72rem)] font-semibold tracking-[0.28em] text-steel">
            <span className="h-px w-7 bg-orange" aria-hidden="true" />
            GLOBAL REACH
          </p>
          <h2
            id="reach-heading"
            className="mt-4 text-[clamp(1.6rem,3vw,2.6rem)] font-extrabold leading-[1.1] tracking-[0.01em] text-navy"
          >
            Markets we move through
          </h2>
          <p className="mt-4 max-w-[32rem] text-[clamp(0.9rem,1.15vw,1.05rem)] leading-relaxed text-steel">
            A quiet map of where Uthkarsh sources and delivers — presence shown
            by depth, not decoration.
          </p>
        </div>

        <div className="mt-10 overflow-hidden rounded-[1.25rem] border border-navy/8 bg-white px-[clamp(0.5rem,2vw,1.5rem)] py-[clamp(1rem,3vw,2rem)] shadow-[0_24px_80px_rgba(11,31,51,0.05)]">
          <div className="mx-auto w-full max-w-[72rem]">
            <ComposableMap
              projection="geoEqualEarth"
              projectionConfig={{
                scale: 165,
                center: [10, 8],
              }}
              width={980}
              height={460}
              className="h-auto w-full"
              aria-label="World map highlighting key Uthkarsh markets"
            >
              <Geographies geography={GEO_URL}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const id = countryId(geo)
                    const isHighlight = id in HIGHLIGHTS
                    const base = HIGHLIGHTS[id] ?? BASE_FILL
                    const fill =
                      hovered === id
                        ? isHighlight
                          ? HOVER_LIFT
                          : '#d9d9d9'
                        : base

                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        tabIndex={isHighlight ? 0 : -1}
                        fill={fill}
                        stroke="#ffffff"
                        strokeWidth={0.4}
                        style={{ outline: 'none', cursor: isHighlight ? 'pointer' : 'default' }}
                        onMouseEnter={() => setHovered(id)}
                        onMouseLeave={() => setHovered(null)}
                        onFocus={() => setHovered(id)}
                        onBlur={() => setHovered(null)}
                      />
                    )
                  })
                }
              </Geographies>
            </ComposableMap>
          </div>
        </div>
      </div>
    </section>
  )
}
