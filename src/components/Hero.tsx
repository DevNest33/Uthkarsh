import { Header } from './Header'
import { HeroVisual } from './HeroVisual'

type HeroProps = {
  ready?: boolean
}

export function Hero({ ready = false }: HeroProps) {
  return (
    <section
      id="top"
      className={`relative min-h-svh overflow-hidden bg-white ${
        ready ? 'intro-ready' : ''
      }`}
      aria-label="Uthkarsh"
    >
      <div className="hero-corner hero-corner-tr" aria-hidden="true" />
      <div className="hero-corner hero-corner-br" aria-hidden="true" />

      <Header />

      <div className="relative z-10 mx-auto grid min-h-[calc(100svh-clamp(4.25rem,7vw,5.75rem))] w-full max-w-[90rem] grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)] items-center gap-[clamp(1.25rem,3.5vw,5rem)] overflow-x-clip px-[clamp(1.25rem,4vw,6rem)] py-[clamp(1.25rem,3vw,2.5rem)]">
        <div className="hero-in relative z-20 w-full min-w-0 max-w-[34rem]">
          <p className="flex items-center gap-3 text-[clamp(0.58rem,0.9vw,0.72rem)] font-semibold tracking-[0.28em] text-steel">
            <span className="h-px w-7 bg-orange" aria-hidden="true" />
            GLOBAL SOURCING &amp; TRADING
          </p>

          <h1 className="mt-[clamp(0.85rem,1.6vw,1.5rem)] text-[clamp(1.55rem,3.4vw,3.35rem)] font-extrabold leading-[1.08] tracking-[0.015em] text-navy">
            PRODUCTS
            <span className="block">BEYOND BORDERS</span>
          </h1>

          <p className="mt-[clamp(0.85rem,1.5vw,1.75rem)] max-w-[26rem] text-[clamp(0.78rem,1.15vw,1.05rem)] leading-relaxed text-steel">
            Bulk sourcing and trading for businesses that buy across markets —
            connecting origin, specification, and demand.
          </p>

          <div className="mt-[clamp(1.25rem,2.4vw,3rem)] flex flex-row flex-wrap items-center gap-[clamp(0.65rem,1.2vw,1rem)]">
            <a
              href="#start-sourcing"
              className="inline-flex items-center justify-center bg-gold px-[clamp(1rem,1.6vw,1.5rem)] py-[clamp(0.7rem,1.1vw,0.9rem)] text-center text-[clamp(0.68rem,0.95vw,0.82rem)] font-semibold tracking-[0.08em] text-navy transition-[filter] duration-200 hover:brightness-110"
              onClick={(event) => event.preventDefault()}
            >
              Start a sourcing conversation
            </a>
            <a
              href="#what-we-source"
              className="inline-flex items-center justify-center border border-navy px-[clamp(1rem,1.6vw,1.5rem)] py-[clamp(0.7rem,1.1vw,0.9rem)] text-center text-[clamp(0.68rem,0.95vw,0.82rem)] font-semibold tracking-[0.08em] text-navy transition-colors duration-200 hover:bg-navy hover:text-white"
              onClick={(event) => event.preventDefault()}
            >
              What we source
            </a>
          </div>
        </div>

        <div className="relative z-10 h-[clamp(16rem,62vh,46rem)] w-full translate-x-[clamp(0rem,1.5vw,3rem)]">
          <HeroVisual />
        </div>
      </div>
    </section>
  )
}
