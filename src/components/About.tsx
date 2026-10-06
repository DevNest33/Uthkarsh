import type { ReactNode } from 'react'

const FRONT_LINKS = [
  { id: 'story', label: 'Our Story' },
  { id: 'link-two', label: 'Placeholder' },
  { id: 'link-three', label: 'Placeholder' },
  { id: 'contact', label: 'Contact' },
] as const

type ValueFeature = {
  title: string
  description: string
  icon: 'box' | 'truck' | 'enquiry' | 'globe'
}

const VALUE_FEATURES: ValueFeature[] = [
  {
    title: 'Curated Catalogue',
    description: 'Products selected for business sourcing.',
    icon: 'box',
  },
  {
    title: 'Bulk Supply',
    description: 'Built around wholesale and business requirements.',
    icon: 'truck',
  },
  {
    title: 'Direct Enquiry',
    description: 'Discuss quantities and requirements directly.',
    icon: 'enquiry',
  },
  {
    title: 'Global Sourcing',
    description: 'Access products beyond a single market.',
    icon: 'globe',
  },
]

function FeatureIcon({ icon }: { icon: ValueFeature['icon'] }) {
  const paths: Record<ValueFeature['icon'], ReactNode> = {
    box: (
      <>
        <path d="M12 3.5 19 7v10l-7 3.5L5 17V7l7-3.5Z" />
        <path d="M5 7l7 3.5L19 7" />
        <path d="M12 10.5V20.5" />
      </>
    ),
    truck: (
      <>
        <path d="M3 7h10v9H3z" />
        <path d="M13 10h4l3 3v3h-7" />
        <circle cx="7" cy="17.5" r="1.6" />
        <circle cx="16.5" cy="17.5" r="1.6" />
      </>
    ),
    enquiry: (
      <>
        <path d="M7 3.5h7l3 3V17a1.5 1.5 0 0 1-1.5 1.5H10" />
        <path d="M14 3.5V7h3.5" />
        <circle cx="8" cy="15" r="3.2" />
        <path d="m10.4 17.4 2.6 2.6" />
      </>
    ),
    globe: (
      <>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M3.5 12h17" />
        <path d="M12 3.5c2.6 2.4 2.6 14.6 0 17" />
        <path d="M12 3.5c-2.6 2.4-2.6 14.6 0 17" />
      </>
    ),
  }

  return (
    <span
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold/60"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5 stroke-gold"
        fill="none"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {paths[icon]}
      </svg>
    </span>
  )
}

function ImageWell({ label }: { label: string }) {
  return (
    <div
      className="flex aspect-[16/10] items-end bg-soft p-4"
      role="img"
      aria-label={label}
    >
      <span className="text-[0.62rem] font-semibold tracking-[0.22em] text-steel">
        {label}
      </span>
    </div>
  )
}

export function About() {
  return (
    <section
      id="about"
      className="relative border-t border-navy/8 bg-white px-[clamp(1.25rem,4vw,6rem)] py-[clamp(4rem,8vw,7.5rem)]"
      aria-labelledby="about-heading"
    >
      <div className="about-stage mx-auto max-w-[90rem]">
        <article className="about-sheet about-sheet-front bg-white text-navy">
          <header className="flex items-stretch justify-between border-b border-navy/10">
            <div className="flex items-center px-[clamp(1rem,2vw,1.75rem)]">
              <span className="text-[0.68rem] font-extrabold tracking-[0.22em] text-navy">
                UTHKARSH
              </span>
            </div>
            <nav
              aria-label="Placeholder"
              className="flex items-stretch overflow-x-auto"
            >
              {FRONT_LINKS.map((link) => (
                <a
                  key={link.id}
                  href="#about"
                  className="flex items-center border-l border-navy/10 px-[clamp(0.7rem,1.2vw,1.15rem)] text-[clamp(0.58rem,0.75vw,0.7rem)] font-medium tracking-[0.04em] whitespace-nowrap text-navy/70 transition-colors hover:text-navy focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-navy"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </header>

          <div className="px-[clamp(1.1rem,2.2vw,2.4rem)] pt-[clamp(1.35rem,2.4vw,2.25rem)] pb-[clamp(1.5rem,3vw,2.75rem)]">
            <div className="grid items-end gap-6 lg:grid-cols-[1.35fr_0.8fr]">
              <h2
                id="about-heading"
                className="max-w-[16ch] text-[clamp(1.85rem,3.1vw,3.15rem)] font-extrabold leading-[1.02] tracking-[-0.03em] text-navy"
              >
                Headline placeholder for the longer line
              </h2>
              <p className="max-w-[28rem] text-[clamp(0.78rem,0.95vw,0.9rem)] leading-relaxed text-steel">
                Supporting paragraph placeholder. This line sits beside the
                headline until the real story is written.
              </p>
            </div>

            <div className="mt-5 grid gap-3 pb-10 sm:grid-cols-2">
              <div className="relative">
                <ImageWell label="IMAGE 01" />
                <p className="absolute bottom-3 left-3 w-[min(16rem,84%)] translate-y-1/2 bg-white p-4 text-[0.75rem] leading-relaxed text-steel shadow-[0_16px_40px_rgba(11,31,51,0.08)]">
                  Caption placeholder. A short line that sits over the image.
                </p>
              </div>
              <ImageWell label="IMAGE 02" />
            </div>

            <a
              href="#about"
              className="inline-flex items-center gap-2 text-[0.78rem] font-semibold text-navy focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-navy"
            >
              Placeholder link
              <span className="text-orange" aria-hidden="true">
                →
              </span>
            </a>

            <div className="mt-8 grid gap-6 border-t border-navy/10 pt-6 sm:grid-cols-[7.5rem_1fr]">
              <p className="pt-1 text-[0.62rem] font-semibold tracking-[0.22em] text-steel">
                PLACEHOLDER
              </p>
              <div className="sm:border-l sm:border-navy/10 sm:pl-8">
                <h3 className="max-w-[18ch] text-[clamp(1.45rem,2.4vw,2.15rem)] font-extrabold leading-[1.08] tracking-[-0.02em] text-navy">
                  Second headline placeholder
                </h3>
                <p className="mt-4 max-w-[34rem] text-[clamp(0.8rem,0.95vw,0.92rem)] leading-relaxed text-steel">
                  Body placeholder. A few sentences will sit here once the
                  story is written. This block holds the length and measure of
                  the final paragraph.
                </p>
              </div>
            </div>
          </div>
        </article>

        <div className="about-side-column">
        <article className="about-sheet about-sheet-side relative flex flex-col bg-navy text-warm">
          <img
            src="/about/globe-network.jpg"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover object-right"
          />
          <div
            className="absolute inset-0 bg-gradient-to-r from-navy via-navy/85 to-navy/30"
            aria-hidden="true"
          />

          <div className="relative flex flex-col px-[clamp(1.15rem,2vw,1.75rem)] py-[clamp(1.25rem,2vw,1.75rem)]">
            <div className="flex items-start justify-between gap-4">
              <p className="flex items-center gap-3 text-[0.62rem] font-semibold tracking-[0.22em] text-warm/70">
                03
                <span className="h-px w-7 bg-orange" aria-hidden="true" />
                OUR VALUE
              </p>
              <p className="text-right text-[0.58rem] font-semibold leading-relaxed tracking-[0.22em] text-warm/45">
                GLOBAL MARKETS
                <br />
                REAL OPPORTUNITIES
              </p>
            </div>

            <h3 className="mt-[clamp(1.25rem,2.4vw,2rem)] text-[clamp(1.85rem,2.8vw,2.8rem)] font-extrabold uppercase leading-[1.02] tracking-[-0.01em]">
              Source
              <br />
              Without
              <br />
              <span className="text-orange">Borders.</span>
            </h3>

            <div className="mt-[clamp(1.5rem,3vw,2.25rem)] grid grid-cols-1 gap-x-5 gap-y-6 min-[26rem]:grid-cols-2">
              {VALUE_FEATURES.map((feature) => (
                <div key={feature.title} className="flex items-start gap-3">
                  <FeatureIcon icon={feature.icon} />
                  <div>
                    <p className="text-[0.72rem] font-bold tracking-[0.06em] text-warm">
                      {feature.title.toUpperCase()}
                    </p>
                    <p className="mt-1 text-[0.72rem] leading-relaxed text-warm/60">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </article>

        <article className="about-sheet about-sheet-follow flex bg-white text-navy">
          <div className="flex min-w-0 flex-1 flex-col px-[clamp(1.15rem,2vw,1.75rem)] py-[clamp(1.25rem,2vw,1.75rem)]">
            <div className="flex items-start justify-between gap-4">
              <p className="flex items-center gap-3 text-[0.62rem] font-semibold tracking-[0.22em] text-steel">
                04
                <span className="h-px w-7 bg-orange" aria-hidden="true" />
                GET IN TOUCH
              </p>
              <p className="text-right text-[0.58rem] font-semibold leading-relaxed tracking-[0.18em] text-steel/70">
                IDEAS TODAY
                <br />
                OPPORTUNITIES TOMORROW
              </p>
            </div>

            <h3 className="mt-[clamp(1.15rem,2vw,1.75rem)] max-w-[12ch] text-[clamp(1.45rem,2.2vw,2rem)] font-extrabold uppercase leading-[1.02] tracking-[-0.02em]">
              Looking for something else?
            </h3>
            <p className="mt-3 max-w-[28ch] text-[0.8rem] leading-relaxed text-steel">
              Tell us what you're looking for. Our sourcing network may be able
              to help.
            </p>
            <a
              href="#enquire"
              className="mt-6 inline-flex min-h-9 w-fit items-center gap-2 border border-gold bg-gold px-4 py-2 text-[0.68rem] font-semibold tracking-[0.08em] text-navy transition-colors duration-200 hover:bg-transparent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
            >
              Start a sourcing conversation
              <span aria-hidden="true">→</span>
            </a>
          </div>

          <div className="flex w-[4.75rem] shrink-0 flex-col items-center justify-between bg-soft px-2 py-4">
            <span className="text-[0.58rem] font-semibold tracking-[0.18em] text-steel">
              IMAGE
            </span>
            <p className="text-[0.58rem] font-semibold tracking-[0.16em] text-navy [writing-mode:vertical-rl]">
              MORE MARKETS / BRIGHTER BUSINESSES
            </p>
          </div>
        </article>
        </div>

        <article className="about-sheet about-sheet-back bg-warm text-navy">
          <p className="max-w-[11ch] px-[clamp(1.15rem,2vw,1.75rem)] pt-[clamp(1.15rem,2vw,1.6rem)] text-[clamp(1.35rem,2vw,1.85rem)] font-extrabold leading-[1.05] tracking-[-0.03em]">
            Quote placeholder in view
          </p>
        </article>
      </div>
    </section>
  )
}
