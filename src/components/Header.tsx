import { BrandLockup } from './BrandLockup'

const NAV_LINKS = [
  { href: '#catalogue', label: 'Catalogue' },
  { href: '#about', label: 'About' },
  { href: '#how-it-works', label: 'How It Works' },
  { href: '#contact', label: 'Contact' },
] as const

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-navy/5 bg-white/25 backdrop-blur-xl supports-[backdrop-filter]:bg-white/20">
      <div className="mx-auto flex h-[clamp(4.25rem,7vw,5.75rem)] max-w-[90rem] items-center gap-[clamp(1rem,2vw,1.75rem)] px-[clamp(1.25rem,4vw,6rem)]">
        <a
          href="#top"
          className="shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-navy"
          onClick={(event) => event.preventDefault()}
          aria-label="Uthkarsh home"
        >
          <BrandLockup size="nav" />
        </a>

        <nav
          className="ml-auto flex items-center gap-[clamp(0.85rem,1.8vw,2.5rem)]"
          aria-label="Primary"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[clamp(0.62rem,0.95vw,0.78rem)] font-medium tracking-[0.04em] text-navy/70 transition-colors hover:text-navy focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-navy"
              onClick={(event) => event.preventDefault()}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a
          href="#enquire"
          className="inline-flex min-h-9 shrink-0 items-center border border-navy bg-navy px-[clamp(0.85rem,1.4vw,1.25rem)] py-2 text-[clamp(0.62rem,0.9vw,0.72rem)] font-semibold tracking-[0.08em] text-white transition-colors duration-200 hover:bg-transparent hover:text-navy focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-navy"
          onClick={(event) => event.preventDefault()}
        >
          Enquire
        </a>
      </div>
    </header>
  )
}
