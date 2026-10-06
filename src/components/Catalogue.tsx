import { useCallback, useEffect, useId, useRef, useState } from 'react'
import {
  CATALOGUE_CATEGORIES,
  CATALOGUE_PRODUCTS,
  catalogueProduct,
  type CatalogueCategory,
  type CatalogueProduct,
} from '../catalogue'
import { Header } from './Header'

type CatalogueProps = {
  onHome: () => void
  onCatalogue: () => void
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function scrollToShowroom() {
  document.getElementById('showroom')?.scrollIntoView({
    behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    block: 'start',
  })
}

function selectionLabel(count: number) {
  return count === 1 ? '1 piece selected' : `${count} pieces selected`
}

function ProductPhoto({
  product,
  alt = '',
  className = '',
}: {
  product: CatalogueProduct
  alt?: string
  className?: string
}) {
  return (
    <img
      src={product.image}
      alt={alt}
      className={`catalogue-cutout h-full w-full object-contain ${className}`}
    />
  )
}

export function Catalogue({ onHome, onCatalogue }: CatalogueProps) {
  const [featuredId, setFeaturedId] = useState(CATALOGUE_PRODUCTS[0].id)
  const [slideDirection, setSlideDirection] = useState<1 | -1>(1)
  const [category, setCategory] = useState<CatalogueCategory>('All')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [panelOpen, setPanelOpen] = useState(false)
  const featured = catalogueProduct(featuredId)
  const featuredIndex = CATALOGUE_PRODUCTS.findIndex((product) => product.id === featuredId)
  const closePanel = useCallback(() => setPanelOpen(false), [])

  const visible =
    category === 'All'
      ? CATALOGUE_PRODUCTS
      : CATALOGUE_PRODUCTS.filter((product) => product.category === category)

  function showProduct(id: string) {
    const nextIndex = CATALOGUE_PRODUCTS.findIndex((item) => item.id === id)
    if (nextIndex < 0 || nextIndex === featuredIndex) return
    setSlideDirection(nextIndex > featuredIndex ? 1 : -1)
    setFeaturedId(id)
  }

  function stepFeatured(direction: -1 | 1) {
    const count = CATALOGUE_PRODUCTS.length
    const next = (featuredIndex + direction + count) % count
    setSlideDirection(direction)
    setFeaturedId(CATALOGUE_PRODUCTS[next].id)
  }

  function toggleSelected(id: string) {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    )
  }

  function addFeatured() {
    setSelectedIds((current) =>
      current.includes(featuredId) ? current : [...current, featuredId],
    )
  }

  function showCategory(next: CatalogueCategory) {
    setCategory(next)
    scrollToShowroom()
  }

  return (
    <div className="min-h-svh bg-white text-navy">
      <Header
        tone="light"
        active="catalogue"
        onHome={onHome}
        onCatalogue={onCatalogue}
        onEnquire={() => setPanelOpen(true)}
      />

      <FeaturedStage
        product={featured}
        direction={slideDirection}
        onPrevious={() => stepFeatured(-1)}
        onNext={() => stepFeatured(1)}
        onSelect={showProduct}
        onEnquire={addFeatured}
        onAllProducts={() => showCategory('All')}
        onCategory={() => showCategory(featured.category)}
        onAbout={onHome}
      />

      <Showroom
        category={category}
        products={visible}
        selectedIds={selectedIds}
        onCategory={setCategory}
        onToggle={toggleSelected}
      />

      {selectedIds.length > 0 ? (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-navy text-warm">
          <div className="mx-auto flex max-w-[90rem] items-center justify-between gap-4 px-[clamp(1.25rem,4vw,6rem)] py-3">
            <p className="text-[clamp(0.72rem,0.9vw,0.85rem)] font-medium tracking-[0.04em]">
              {selectionLabel(selectedIds.length)}
            </p>
            <button
              type="button"
              className="inline-flex min-h-9 items-center bg-gold px-4 text-[0.72rem] font-semibold tracking-[0.08em] text-navy transition-colors hover:bg-warm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
              onClick={() => setPanelOpen(true)}
            >
              Enquire
            </button>
          </div>
        </div>
      ) : null}

      {panelOpen ? (
        <EnquiryPanel
          selectedIds={selectedIds}
          onRemove={toggleSelected}
          onClose={closePanel}
        />
      ) : null}
    </div>
  )
}

function FeaturedStage({
  product,
  direction,
  onPrevious,
  onNext,
  onSelect,
  onEnquire,
  onAllProducts,
  onCategory,
  onAbout,
}: {
  product: CatalogueProduct
  direction: 1 | -1
  onPrevious: () => void
  onNext: () => void
  onSelect: (id: string) => void
  onEnquire: () => void
  onAllProducts: () => void
  onCategory: () => void
  onAbout: () => void
}) {
  const [slide, setSlide] = useState<{
    id: string
    outgoing: CatalogueProduct | null
    motion: 1 | -1
  }>({ id: product.id, outgoing: null, motion: direction })

  if (product.id !== slide.id) {
    setSlide({
      id: product.id,
      outgoing: prefersReducedMotion() ? null : catalogueProduct(slide.id),
      motion: direction,
    })
  }

  useEffect(() => {
    if (!slide.outgoing) return
    const timer = window.setTimeout(() => {
      setSlide((current) =>
        current.id === slide.id ? { ...current, outgoing: null } : current,
      )
    }, 560)
    return () => window.clearTimeout(timer)
  }, [slide])

  const motion = slide.motion
  const outgoing = slide.outgoing
  const playIn = outgoing !== null
  return (
    <section
      className="px-[clamp(0.75rem,2vw,1.75rem)] py-[clamp(1rem,2.5vw,2rem)]"
      style={{
        background:
          'linear-gradient(165deg, #f97316 0%, #f5b83d 46%, #fb923c 100%)',
      }}
      aria-labelledby="featured-heading"
    >
      <div
        className="catalogue-panel mx-auto max-w-[90rem] rounded-[clamp(1.25rem,2vw,1.85rem)] px-[clamp(1.1rem,2.4vw,2.5rem)] pt-[clamp(1rem,2vw,1.6rem)] pb-[clamp(1.1rem,2vw,1.75rem)] text-warm shadow-[0_28px_70px_rgba(11,31,51,0.28)] transition-colors duration-500"
        style={{ backgroundColor: product.panel }}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-[0.68rem] font-extrabold tracking-[0.22em]">
            UTHKARSH
          </span>
          <div className="flex max-w-full items-center gap-1 overflow-x-auto rounded-full bg-black/25 p-1">
            <button
              type="button"
              className="shrink-0 rounded-full bg-white px-3 py-1.5 text-[0.62rem] font-semibold tracking-[0.06em] text-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              onClick={onCategory}
            >
              {product.category}
            </button>
            <button
              type="button"
              className="shrink-0 rounded-full px-3 py-1.5 text-[0.62rem] font-medium tracking-[0.06em] text-warm/80 transition-colors hover:text-warm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              onClick={onAllProducts}
            >
              All products
            </button>
            <button
              type="button"
              className="shrink-0 rounded-full px-3 py-1.5 text-[0.62rem] font-medium tracking-[0.06em] text-warm/80 transition-colors hover:text-warm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              onClick={onAbout}
            >
              About
            </button>
          </div>
        </div>

        <div className="mt-[clamp(1.25rem,2.5vw,2rem)] grid items-center gap-[clamp(1.25rem,2vw,2rem)] lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.05fr)_minmax(11rem,0.72fr)]">
          <div className="order-2 lg:order-1">
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/25 text-warm transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                aria-label="Previous piece"
                onClick={onPrevious}
              >
                <Chevron direction="left" />
              </button>
              <button
                type="button"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/25 text-warm transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                aria-label="Next piece"
                onClick={onNext}
              >
                <Chevron direction="right" />
              </button>
            </div>
            <h1
              id="featured-heading"
              className="mt-4 text-[clamp(2rem,4.2vw,3.6rem)] leading-[0.95] font-semibold tracking-[-0.03em]"
            >
              <span className="block">{product.headline[0]}</span>
              <span className="block">{product.headline[1]}</span>
            </h1>
            <p className="mt-4 max-w-[28rem] text-[clamp(0.82rem,1vw,0.95rem)] leading-relaxed text-warm/75">
              {product.line}
            </p>
            <button
              type="button"
              className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-5 text-[0.78rem] font-semibold text-navy transition-colors hover:bg-warm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              onClick={onEnquire}
            >
              Enquire
              <Chevron direction="right" />
            </button>
          </div>

          <div className="order-1 lg:order-2">
            <div className="relative mx-auto aspect-[3/4] w-full max-w-[22rem]">
              {outgoing ? (
                <div
                  key={`out-${outgoing.id}`}
                  className={`catalogue-slide-out pointer-events-none absolute inset-0 z-0 ${motion === 1 ? 'is-next' : 'is-prev'}`}
                  aria-hidden="true"
                >
                  <div className="relative h-full w-full overflow-hidden">
                    <ProductPhoto product={outgoing} alt="" />
                  </div>
                </div>
              ) : null}
              <div
                key={product.id}
                className={`catalogue-product absolute inset-0 z-10 ${playIn ? `catalogue-slide-in ${motion === 1 ? 'is-next' : 'is-prev'}` : ''}`}
              >
                <div className="relative h-full w-full">
                    <ProductPhoto product={product} alt={product.name} />
                  </div>
              </div>
            </div>
          </div>

          <div className="order-3 text-left lg:text-right">
            <p className="text-[0.68rem] font-semibold tracking-[0.18em] text-warm/60 uppercase">
              {product.category}
            </p>
            <p className="mt-3 text-[clamp(1.35rem,2vw,1.85rem)] leading-tight font-semibold tracking-[-0.03em]">
              Shown for sourcing
            </p>
            <p className="mt-3 text-[0.82rem] leading-relaxed text-warm/70 lg:ml-auto lg:max-w-[16rem]">
              Not listed for sale. Ask about quantity and supply.
            </p>
          </div>
        </div>

        <ul className="catalogue-thumbs mt-[clamp(1rem,2vw,1.5rem)] flex gap-3 overflow-x-auto pb-1 lg:justify-end">
          {CATALOGUE_PRODUCTS.map((item) => {
            const active = item.id === product.id
            return (
              <li key={item.id} className="shrink-0">
                <button
                  type="button"
                  className={
                    active
                      ? 'block w-16 rounded-xl ring-2 ring-gold ring-offset-2 ring-offset-transparent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white'
                      : 'block w-16 rounded-xl opacity-80 transition-opacity hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white'
                  }
                  aria-label={item.name}
                  aria-current={active ? 'true' : undefined}
                  onClick={() => onSelect(item.id)}
                >
                  <span className="relative block aspect-[3/4] bg-transparent">
                    <ProductPhoto product={item} />
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

function Showroom({
  category,
  products,
  selectedIds,
  onCategory,
  onToggle,
}: {
  category: CatalogueCategory
  products: CatalogueProduct[]
  selectedIds: string[]
  onCategory: (category: CatalogueCategory) => void
  onToggle: (id: string) => void
}) {
  return (
    <section
      id="showroom"
      className="scroll-mt-24 bg-white px-[clamp(1rem,3vw,2.5rem)] pt-[clamp(1.75rem,3vw,2.75rem)] pb-[clamp(5.5rem,8vw,7rem)]"
      aria-labelledby="showroom-heading"
    >
      <div className="mx-auto max-w-[90rem]">
        <h2 id="showroom-heading" className="sr-only">
          Showroom
        </h2>
        <div
          className="flex gap-6 overflow-x-auto border-b border-navy/10"
          role="tablist"
          aria-label="Categories"
        >
          {CATALOGUE_CATEGORIES.map((item) => {
            const selected = item === category
            return (
              <button
                key={item}
                type="button"
                role="tab"
                aria-selected={selected}
                className={
                  selected
                    ? 'shrink-0 border-b-2 border-navy pb-3 text-[0.72rem] font-semibold tracking-[0.14em] text-navy uppercase focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-navy'
                    : 'shrink-0 border-b-2 border-transparent pb-3 text-[0.72rem] font-medium tracking-[0.14em] text-navy/50 uppercase transition-colors hover:text-navy focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-navy'
                }
                onClick={() => onCategory(item)}
              >
                {item}
              </button>
            )
          })}
        </div>

        <ul className="mt-2 grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 lg:grid-cols-6">
          {products.map((product) => {
            const selected = selectedIds.includes(product.id)
            return (
              <li key={product.id}>
                <button
                  type="button"
                  className="w-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-navy"
                  aria-label={product.name}
                  aria-pressed={selected}
                  onClick={() => onToggle(product.id)}
                >
                  <span
                    className={
                      selected
                        ? 'relative block aspect-[3/4] bg-white p-[12%] outline-1 outline-offset-4 outline-solid outline-gold'
                        : 'relative block aspect-[3/4] bg-white p-[12%]'
                    }
                  >
                    <span className="relative block h-full w-full">
                      <ProductPhoto product={product} />
                    </span>
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

function EnquiryPanel({
  selectedIds,
  onRemove,
  onClose,
}: {
  selectedIds: string[]
  onRemove: (id: string) => void
  onClose: () => void
}) {
  const titleId = useId()
  const dialogRef = useRef<HTMLDivElement>(null)
  const [name, setName] = useState('')
  const [company, setCompany] = useState('')
  const [note, setNote] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const pieces = selectedIds.map((id) => catalogueProduct(id))
  const canSubmit = name.trim().length > 0 && pieces.length > 0

  useEffect(() => {
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialogRef.current?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-navy/45"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="relative flex h-full w-full max-w-md flex-col overflow-y-auto bg-warm px-[clamp(1.25rem,3vw,1.75rem)] py-6 text-navy shadow-[-24px_0_60px_rgba(11,31,51,0.18)] focus-visible:outline-none"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <h2 id={titleId} className="text-[1.35rem] font-semibold tracking-[-0.03em]">
            Enquire
          </h2>
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center border border-navy/15 text-navy transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy"
            aria-label="Close enquiry"
            onClick={onClose}
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>

        {submitted ? (
          <div className="mt-8">
            <p className="text-[1.05rem] font-semibold tracking-[-0.02em]">
              Noted on this page
            </p>
            <p className="mt-3 text-[0.9rem] leading-relaxed text-steel">
              This showroom does not send the enquiry yet. The pieces you marked
              stay selected here.
            </p>
            <button
              type="button"
              className="mt-6 inline-flex min-h-10 items-center bg-navy px-4 text-[0.72rem] font-semibold tracking-[0.08em] text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-navy"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        ) : (
          <form
            className="mt-6 flex flex-1 flex-col"
            onSubmit={(event) => {
              event.preventDefault()
              if (!canSubmit) return
              setSubmitted(true)
            }}
          >
            <p className="text-[0.82rem] leading-relaxed text-steel">
              {pieces.length > 0
                ? selectionLabel(pieces.length)
                : 'Select pieces in the showroom, then send a note.'}
            </p>
            {pieces.length > 0 ? (
              <ul className="mt-4 divide-y divide-navy/10 border-y border-navy/10">
                {pieces.map((product) => (
                  <li
                    key={product.id}
                    className="flex items-center justify-between gap-3 py-3"
                  >
                    <span className="text-[0.9rem] font-medium">{product.name}</span>
                    <button
                      type="button"
                      className="text-[0.68rem] font-semibold tracking-[0.08em] text-navy/60 uppercase transition-colors hover:text-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy"
                      onClick={() => onRemove(product.id)}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}

            <label className="mt-6 block text-[0.68rem] font-semibold tracking-[0.12em] text-navy/70 uppercase">
              Name
              <input
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="mt-2 w-full border border-navy/15 bg-white px-3 py-2.5 text-[0.95rem] font-medium tracking-normal text-navy normal-case focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy"
                autoComplete="name"
              />
            </label>
            <label className="mt-4 block text-[0.68rem] font-semibold tracking-[0.12em] text-navy/70 uppercase">
              Company
              <input
                value={company}
                onChange={(event) => setCompany(event.target.value)}
                className="mt-2 w-full border border-navy/15 bg-white px-3 py-2.5 text-[0.95rem] font-medium tracking-normal text-navy normal-case focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy"
                autoComplete="organization"
              />
            </label>
            <label className="mt-4 block text-[0.68rem] font-semibold tracking-[0.12em] text-navy/70 uppercase">
              Note
              <textarea
                value={note}
                onChange={(event) => setNote(event.target.value)}
                rows={4}
                className="mt-2 w-full resize-y border border-navy/15 bg-white px-3 py-2.5 text-[0.95rem] font-medium tracking-normal text-navy normal-case focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy"
              />
            </label>
            <button
              type="submit"
              disabled={!canSubmit}
              className="mt-6 inline-flex min-h-11 items-center justify-center bg-navy px-4 text-[0.72rem] font-semibold tracking-[0.08em] text-white transition-colors hover:bg-deep disabled:cursor-not-allowed disabled:bg-navy/35 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-navy"
            >
              Note this enquiry
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

function Chevron({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className="h-3.5 w-3.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden="true"
    >
      {direction === 'left' ? (
        <path d="M10 3.5 5.5 8 10 12.5" />
      ) : (
        <path d="M6 3.5 10.5 8 6 12.5" />
      )}
    </svg>
  )
}
