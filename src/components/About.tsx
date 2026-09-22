const FRONT_LINKS = [
  { id: 'story', label: 'Our Story' },
  { id: 'link-two', label: 'Placeholder' },
  { id: 'link-three', label: 'Placeholder' },
  { id: 'contact', label: 'Contact' },
] as const

const SIDE_META = [
  { label: 'Office', value: 'Placeholder' },
  { label: 'Production', value: 'Placeholder' },
  { label: 'Date', value: 'Placeholder' },
  { label: 'Contact', value: 'placeholder@email.com' },
] as const

function ImageWell({ label }: { label: string }) {
  return (
    <div
      className="flex aspect-[4/3] items-end bg-soft p-4"
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

            <div className="mt-6 grid gap-3 pb-14 sm:grid-cols-2">
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

            <div className="mt-12 grid gap-6 border-t border-navy/10 pt-8 sm:grid-cols-[7.5rem_1fr]">
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

        <article className="about-sheet about-sheet-side flex h-full flex-col bg-navy text-warm">
          <div className="bg-white px-[clamp(1.15rem,2vw,1.75rem)] py-[clamp(1.35rem,2.2vw,2rem)] text-navy">
            <h3 className="max-w-[12ch] text-[clamp(1.35rem,2vw,1.85rem)] font-extrabold leading-[1.05] tracking-[-0.02em]">
              Impact headline placeholder
            </h3>
            <a
              href="#about"
              className="mt-6 inline-flex min-h-9 items-center gap-2 border border-gold bg-gold px-4 py-2 text-[0.68rem] font-semibold tracking-[0.08em] text-navy transition-colors duration-200 hover:bg-transparent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
            >
              Placeholder
              <span aria-hidden="true">→</span>
            </a>
          </div>

          <p className="px-[clamp(1.15rem,2vw,1.75rem)] pt-10 text-[clamp(2.35rem,3.6vw,3.6rem)] font-extrabold leading-[0.92] tracking-[-0.03em] text-warm">
            Display line,
            <br />
            placeholder
          </p>

          <div className="mt-auto bg-deep px-[clamp(1.15rem,2vw,1.75rem)] py-8">
            <div className="ml-auto grid w-full grid-cols-2 gap-x-5 gap-y-8 lg:w-[68%]">
            {SIDE_META.map((item) => (
              <div key={item.label}>
                <p className="text-[0.62rem] font-semibold tracking-[0.18em] text-warm/45">
                  {item.label.toUpperCase()}
                </p>
                <p className="mt-2 text-[0.8rem] leading-snug text-warm">
                  {item.value}
                </p>
              </div>
            ))}
            </div>
          </div>
        </article>

        <article className="about-sheet about-sheet-back bg-warm text-navy">
          <p className="max-w-[11ch] px-[clamp(1.15rem,2vw,1.75rem)] pt-[clamp(1.15rem,2vw,1.6rem)] text-[clamp(1.35rem,2vw,1.85rem)] font-extrabold leading-[1.05] tracking-[-0.03em]">
            Quote placeholder in view
          </p>
        </article>
      </div>
    </section>
  )
}
