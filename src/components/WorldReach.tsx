import { useRef, useState } from 'react'
import { AU, BR, CA, DE, GB, IN } from 'country-flag-icons/react/3x2'
import { ComposableMap, Geographies, Geography } from 'react-simple-maps'
import { CATALOGUE_PRODUCTS, type ProductOrigin } from '../catalogue'

const GEO_URL = '/maps/countries-110m.json'

const FLAGS = { AU, BR, CA, DE, GB, IN }

/** Ordered markets. Darker fill = stronger presence. */
const MARKETS = [
  { id: '276', name: 'Germany', fill: '#2c2c2c', code: 'DE' },
  { id: '356', name: 'India', fill: '#5c5c5c', code: 'IN' },
  { id: '826', name: 'United Kingdom', fill: '#6a6a6a', code: 'GB' },
  { id: '124', name: 'Canada', fill: '#8a8a8a', code: 'CA' },
  { id: '076', name: 'Brazil', fill: '#8a8a8a', code: 'BR' },
  { id: '036', name: 'Australia', fill: '#9a9a9a', code: 'AU' },
] as const

type MarketId = (typeof MARKETS)[number]['id']
type CursorPoint = { x: number; y: number }

const MARKET_BY_ID = Object.fromEntries(
  MARKETS.map((market) => [market.id, market]),
) as Record<string, (typeof MARKETS)[number]>

const BASE_FILL = '#e6e6e6'
const ACTIVE_FILL = '#1a1a1a'
const ACTIVE_STROKE = '#f97316'

function countryId(geo: { id?: string | number | null }) {
  return String(geo.id ?? '').padStart(3, '0')
}

function catalogueCount(code: ProductOrigin) {
  return CATALOGUE_PRODUCTS.filter((product) => product.origin === code).length
}

function catalogueCountLabel(count: number) {
  return count === 1 ? '1 product' : `${count} products`
}

export function WorldReach() {
  const [pointerId, setPointerId] = useState<MarketId | null>(null)
  const [focusId, setFocusId] = useState<MarketId | null>(null)
  const [cursor, setCursor] = useState<CursorPoint | null>(null)
  const pointerIdRef = useRef<MarketId | null>(null)
  const activeId = pointerId ?? focusId
  const hoveredMarket = pointerId ? MARKET_BY_ID[pointerId] : null

  function place(id: MarketId, event: { clientX: number; clientY: number }) {
    pointerIdRef.current = id
    setPointerId(id)
    setCursor({ x: event.clientX, y: event.clientY })
  }

  function unpoint(id: MarketId) {
    setPointerId((current) => (current === id ? null : current))
    if (pointerIdRef.current === id) {
      pointerIdRef.current = null
      setCursor(null)
    }
  }

  function focusMarket(id: MarketId) {
    setFocusId(id)
  }

  function unfocusMarket(id: MarketId) {
    setFocusId((current) => (current === id ? null : current))
  }

  return (
    <section
      id="reach"
      className="relative border-t border-navy/8 bg-white px-[clamp(1.25rem,4vw,6rem)] py-[clamp(3rem,6vw,5.5rem)]"
      aria-labelledby="reach-heading"
    >
      <div className="mx-auto max-w-[90rem]">
        <div className="mx-auto max-w-[36rem] text-center">
          <p className="text-[clamp(0.58rem,0.9vw,0.72rem)] font-semibold tracking-[0.28em] text-steel">
            GLOBAL REACH
          </p>
          <h2
            id="reach-heading"
            className="mt-4 text-[clamp(1.6rem,3vw,2.6rem)] font-extrabold leading-[1.1] tracking-[0.01em] text-navy"
          >
            Markets we move through
          </h2>
          <p className="mx-auto mt-4 max-w-[32rem] text-[clamp(0.9rem,1.15vw,1.05rem)] leading-relaxed text-steel">
            A quiet map of where Uthkarsh sources and delivers — presence shown
            by depth, not decoration.
          </p>
        </div>

        <div className="mt-10 overflow-hidden rounded-[1.25rem] border border-navy/8 bg-white px-[clamp(0.5rem,2vw,1.5rem)] py-[clamp(1rem,3vw,2rem)] shadow-[0_24px_80px_rgba(11,31,51,0.05)]">
          <div className="mx-auto flex w-full max-w-[72rem] flex-col lg:flex-row lg:items-stretch">
            <div className="min-w-0 flex-1">
              <ComposableMap
              projection="geoEquirectangular"
              projectionConfig={{
                scale: 140,
                center: [0, 0],
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
                    const market = MARKET_BY_ID[id]
                    const isActive = activeId === id

                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        tabIndex={market ? 0 : -1}
                        aria-label={market?.name}
                        fill={isActive ? ACTIVE_FILL : (market?.fill ?? BASE_FILL)}
                        stroke={isActive ? ACTIVE_STROKE : '#ffffff'}
                        strokeWidth={isActive ? 1.25 : 0.4}
                        style={{
                          outline: 'none',
                          cursor: market ? 'pointer' : 'default',
                        }}
                        onMouseEnter={(event) => {
                          if (market) place(market.id, event)
                        }}
                        onMouseMove={(event) => {
                          if (market) place(market.id, event)
                        }}
                        onMouseLeave={() => {
                          if (market) unpoint(market.id)
                        }}
                        onFocus={() => {
                          if (market) focusMarket(market.id)
                        }}
                        onBlur={() => {
                          if (market) unfocusMarket(market.id)
                        }}
                      />
                    )
                  })
                }
              </Geographies>
              </ComposableMap>
            </div>

            <div className="mt-2 flex flex-col justify-center border-t border-navy/8 pt-5 lg:mt-0 lg:w-80 lg:shrink-0 lg:border-t-0 lg:border-l lg:py-2 lg:pl-6">
              <p
                id="main-markets-label"
                className="flex items-center gap-3 text-[clamp(0.58rem,0.9vw,0.72rem)] font-semibold tracking-[0.28em] text-steel"
              >
                <span className="h-px w-7 bg-orange" aria-hidden="true" />
                MAIN MARKETS
              </p>
              <ul
                aria-labelledby="main-markets-label"
                className="mt-4 divide-y divide-navy/8 border-y border-navy/8"
              >
                {MARKETS.map((market) => {
                  const active = activeId === market.id
                  const Flag = FLAGS[market.code]

                  return (
                    <li key={market.id}>
                      <button
                        type="button"
                        aria-pressed={active}
                        className={`flex w-full items-center gap-3 border-l-2 px-3 py-3 text-left text-[clamp(0.82rem,1vw,0.95rem)] font-medium tracking-[0.01em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange ${
                          active
                            ? 'border-orange bg-navy/[0.03] text-navy'
                            : 'border-transparent text-navy/70 hover:bg-navy/[0.03] hover:text-navy'
                        }`}
                        onMouseEnter={(event) => place(market.id, event)}
                        onMouseMove={(event) => place(market.id, event)}
                        onMouseLeave={() => unpoint(market.id)}
                        onFocus={() => focusMarket(market.id)}
                        onBlur={() => unfocusMarket(market.id)}
                      >
                        <Flag
                          className="h-6 w-9 shrink-0 rounded-[3px] ring-1 ring-navy/15"
                          aria-hidden="true"
                        />
                        <span className="min-w-0 whitespace-nowrap">{market.name}</span>
                        {active ? (
                          <span className="ml-auto shrink-0 text-[0.68rem] font-medium tracking-[0.04em] text-steel">
                            {catalogueCountLabel(catalogueCount(market.code))}
                          </span>
                        ) : null}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
      {hoveredMarket && cursor ? (
        <div
          role="tooltip"
          className="pointer-events-none fixed z-50 min-w-[9rem] border border-navy/10 bg-white px-3 py-2 shadow-[0_12px_32px_rgba(11,31,51,0.12)]"
          style={{ left: cursor.x + 14, top: cursor.y + 16 }}
        >
          <p className="text-[0.62rem] font-semibold tracking-[0.16em] text-steel">
            {hoveredMarket.name}
          </p>
          <p className="mt-1 text-[0.95rem] font-semibold text-navy">
            {catalogueCountLabel(catalogueCount(hoveredMarket.code))}
          </p>
        </div>
      ) : null}
    </section>
  )
}
