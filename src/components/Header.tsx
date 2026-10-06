import type { MouseEvent } from 'react'
import { BrandLockup } from './BrandLockup'

const NAV_LINKS = [
  { href: '#catalogue', label: 'Catalogue' },
  { href: '#about', label: 'About' },
  { href: '#how-it-works', label: 'How It Works' },
  { href: '#contact', label: 'Contact' },
] as const

type HeaderProps = {
  tone?: 'light' | 'cinematic'
  active?: 'catalogue'
  onHome?: () => void
  onCatalogue?: () => void
  onEnquire?: () => void
}

function go(event: MouseEvent<HTMLAnchorElement>, action?: () => void) {
  event.preventDefault()
  action?.()
}

export function Header({
  tone = 'light',
  active,
  onHome,
  onCatalogue,
  onEnquire,
}: HeaderProps) {
  const cinematic = tone === 'cinematic'

  return (
    <header
      className={
        cinematic
          ? 'border-b border-white/10 bg-transparent'
          : 'sticky top-0 z-40 border-b border-navy/8 bg-white/95 backdrop-blur-xl'
      }
    >
      <div className="mx-auto flex h-[clamp(4.25rem,7vw,5.75rem)] max-w-[90rem] items-center gap-[clamp(1rem,2vw,1.75rem)] px-[clamp(1.25rem,4vw,6rem)]">
        <a
          href="#top"
          className={
            cinematic
              ? 'shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-warm'
              : 'shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-navy'
          }
          onClick={(event) => go(event, onHome)}
          aria-label="Uthkarsh home"
        >
          <BrandLockup size="nav" tone={cinematic ? 'onDark' : 'default'} />
        </a>

        <nav
          className="ml-auto hidden items-center gap-[clamp(0.85rem,1.8vw,2.5rem)] sm:flex"
          aria-label="Primary"
        >
          {NAV_LINKS.map((link) => {
            const current = link.href === '#catalogue' && active === 'catalogue'
            return (
            <a
              key={link.href}
              href={link.href}
              className={
                cinematic
                  ? 'text-[clamp(0.62rem,0.95vw,0.78rem)] font-medium tracking-[0.04em] text-warm/75 transition-colors hover:text-warm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-warm'
                  : current
                    ? 'text-[clamp(0.62rem,0.95vw,0.78rem)] font-semibold tracking-[0.04em] text-navy focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-navy'
                    : 'text-[clamp(0.62rem,0.95vw,0.78rem)] font-medium tracking-[0.04em] text-navy/70 transition-colors hover:text-navy focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-navy'
              }
              aria-current={
                link.href === '#catalogue' && active === 'catalogue'
                  ? 'page'
                  : undefined
              }
              onClick={(event) =>
                go(event, link.href === '#catalogue' ? onCatalogue : undefined)
              }
            >
              {link.label}
            </a>
            )
          })}
        </nav>

        <a
          href="#enquire"
          className={
            cinematic
              ? 'inline-flex min-h-9 shrink-0 items-center border border-gold bg-gold px-[clamp(0.85rem,1.4vw,1.25rem)] py-2 text-[clamp(0.62rem,0.9vw,0.72rem)] font-semibold tracking-[0.08em] text-navy transition-colors duration-200 hover:bg-transparent hover:text-gold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold'
              : 'inline-flex min-h-9 shrink-0 items-center border border-navy bg-navy px-[clamp(0.85rem,1.4vw,1.25rem)] py-2 text-[clamp(0.62rem,0.9vw,0.72rem)] font-semibold tracking-[0.08em] text-white transition-colors duration-200 hover:bg-transparent hover:text-navy focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-navy'
          }
          onClick={(event) => go(event, onEnquire)}
        >
          Enquire
        </a>
      </div>
    </header>
  )
}
