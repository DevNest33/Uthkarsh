import { useCallback, useEffect, useRef } from 'react'
import { HERO_FRAME_COUNT, heroFrameSrc } from '../heroFrames'
import {
  applyLabelStyle,
  FINAL_REVEAL_SCRUB,
  HERO_LABEL_TRACKS,
  sampleLabel,
  type LabelTrackId,
} from '../heroLabelTracks'
import { Header } from './Header'

const LAST_INDEX = HERO_FRAME_COUNT - 1
/** ~15s cinematic scrub at a moderate continuous scroll pace (~100vh/s). */
const SCRUB_VH = 1500
const HOLD_VH = 90
const TOTAL_VH = SCRUB_VH + HOLD_VH
const REVEAL_START = SCRUB_VH / TOTAL_VH
const CINEMATIC_SCROLLBAR_CLASS = 'hero-cinematic-scrubbing'

function clampVal(val: number, min: number, max: number): number {
  return Math.min(Math.max(val, min), max)
}

function remap(val: number, inMin: number, inMax: number): number {
  if (inMax <= inMin) return 0
  return clampVal((val - inMin) / (inMax - inMin), 0, 1)
}

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

function isMobileViewport() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(max-width: 768px)').matches
  )
}

type HeroProps = {
  ready?: boolean
}

/**
 * Editorial kinetic typography for the hero. Each caption is a large visual
 * statement, not a UI label. Sizes are desktop-first; mobile is reduced
 * substantially via responsive classes (max-md:).
 *
 * Color tones:
 *  - warm: #FAFAF7 (primary)
 *  - gold: #F5B83D (accent)
 */
const LABEL_COPY: Record<
  LabelTrackId,
  {
    lines: string[]
    tone: 'gold' | 'warm' | 'split'
    /** base (mobile) size in px; desktop uses clamp via inline style */
    desktopClamp: string
    mobileClamp: string
    weight: number
    tracking: string
    leading: string
  }
> = {
  source: {
    lines: ['SOURCE'],
    tone: 'gold',
    desktopClamp: 'clamp(72px, 10vw, 160px)',
    mobileClamp: 'clamp(40px, 11vw, 72px)',
    weight: 700,
    tracking: '-0.02em',
    leading: '0.9',
  },
  move: {
    lines: ['MOVE'],
    tone: 'warm',
    desktopClamp: 'clamp(80px, 12vw, 180px)',
    mobileClamp: 'clamp(44px, 12vw, 88px)',
    weight: 700,
    tracking: '-0.03em',
    leading: '0.9',
  },
  connect: {
    lines: ['CONNECT'],
    tone: 'warm',
    desktopClamp: 'clamp(72px, 10vw, 150px)',
    mobileClamp: 'clamp(40px, 10.5vw, 76px)',
    weight: 600,
    tracking: '-0.02em',
    leading: '0.9',
  },
  acrossMarkets: {
    lines: ['ACROSS', 'MARKETS'],
    tone: 'warm',
    desktopClamp: 'clamp(60px, 8vw, 130px)',
    mobileClamp: 'clamp(32px, 8.5vw, 64px)',
    weight: 600,
    tracking: '-0.02em',
    leading: '0.88',
  },
  beyondBorders: {
    lines: ['BEYOND', 'BORDERS'],
    tone: 'split',
    desktopClamp: 'clamp(70px, 10vw, 170px)',
    mobileClamp: 'clamp(36px, 9.5vw, 72px)',
    weight: 700,
    tracking: '-0.03em',
    leading: '0.88',
  },
}

function toneClass(tone: 'gold' | 'warm' | 'split'): string {
  if (tone === 'gold') return 'text-gold'
  return 'text-warm'
}

/** Render the lines of a caption. For split tone (BEYOND/BORDERS), the first
 *  word is warm and the second is gold accent. */
function renderLines(id: LabelTrackId): React.ReactNode {
  const copy = LABEL_COPY[id]
  if (copy.tone !== 'split') {
    return copy.lines.map((line, i) => (
      <span key={i} className="block" style={{ lineHeight: copy.leading }}>
        {line}
      </span>
    ))
  }
  // split: alternate warm / gold per line
  return copy.lines.map((line, i) => (
    <span
      key={i}
      className="block"
      style={{
        lineHeight: copy.leading,
        color: i === 1 ? 'var(--color-gold)' : 'var(--color-warm)',
      }}
    >
      {line}
    </span>
  ))
}

export function Hero({ ready = false }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const uiRef = useRef<HTMLDivElement>(null)
  const vignetteRef = useRef<HTMLDivElement>(null)
  const labelsLayerRef = useRef<HTMLDivElement>(null)
  const labelRefs = useRef<
    Partial<Record<LabelTrackId, HTMLSpanElement | null>>
  >({})
  const mobileRef = useRef(false)
  const rafRef = useRef(0)
  const framesRef = useRef<(HTMLImageElement | null)[]>([])
  const loadedRef = useRef<boolean[]>([])
  const scrollProgressRef = useRef(0)
  const lastPaintedRef = useRef(-1)
  const reduced = prefersReducedMotion()

  const paintIndex = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const loaded = loadedRef.current
    let index = -1
    if (loaded[frameIndex]) {
      index = frameIndex
    } else {
      for (let d = 1; d < HERO_FRAME_COUNT; d++) {
        if (frameIndex - d >= 0 && loaded[frameIndex - d]) {
          index = frameIndex - d
          break
        }
        if (frameIndex + d < HERO_FRAME_COUNT && loaded[frameIndex + d]) {
          index = frameIndex + d
          break
        }
      }
    }

    const img = index >= 0 ? framesRef.current[index] : null
    if (!img || !img.naturalWidth) return

    const W = canvas.offsetWidth
    const H = canvas.offsetHeight
    if (W === 0 || H === 0) return

    const iw = img.naturalWidth
    const ih = img.naturalHeight
    const scale = Math.max(W / iw, H / ih)
    const sw = iw * scale
    const sh = ih * scale
    const sx = (W - sw) / 2
    const sy = (H - sh) / 2

    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'
    ctx.drawImage(img, sx, sy, sw, sh)
    lastPaintedRef.current = index
  }, [])

  const applyLabels = useCallback(
    (progress: number) => {
      if (reduced) {
        const layer = labelsLayerRef.current
        if (layer) layer.style.opacity = '0'
        for (const track of HERO_LABEL_TRACKS) {
          applyLabelStyle(labelRefs.current[track.id] ?? null, null)
        }
        return
      }

      const scrubT = remap(progress, 0, REVEAL_START)
      const frameIndex = Math.round(scrubT * LAST_INDEX)
      const layer = labelsLayerRef.current
      if (layer) {
        const fade =
          1 -
          remap(scrubT, FINAL_REVEAL_SCRUB - 0.02, FINAL_REVEAL_SCRUB + 0.02)
        layer.style.opacity = String(fade)
      }

      const mobile = mobileRef.current
      for (const track of HERO_LABEL_TRACKS) {
        applyLabelStyle(
          labelRefs.current[track.id] ?? null,
          sampleLabel(track, frameIndex, mobile),
        )
      }
    },
    [reduced],
  )

  const applyReveal = useCallback(
    (progress: number) => {
      const scrubT = remap(progress, 0, REVEAL_START)
      const reveal = reduced ? 1 : remap(scrubT, FINAL_REVEAL_SCRUB, 1)
      const ui = uiRef.current
      const vignette = vignetteRef.current
      if (ui) {
        ui.style.opacity = String(reveal)
        ui.style.transform = `translateY(${(1 - reveal) * 18}px)`
        ui.style.pointerEvents = reveal > 0.2 ? 'auto' : 'none'
        if (reveal > 0.2) ui.removeAttribute('aria-hidden')
        else ui.setAttribute('aria-hidden', 'true')
      }
      if (vignette) vignette.style.opacity = String(reveal)
      applyLabels(progress)
    },
    [applyLabels, reduced],
  )

  const frameForProgress = useCallback(
    (progress: number) => {
      if (reduced) return LAST_INDEX
      const scrub = remap(progress, 0, REVEAL_START)
      return Math.round(scrub * LAST_INDEX)
    },
    [reduced],
  )

  useEffect(() => {
    mobileRef.current = isMobileViewport()
    const mq = window.matchMedia('(max-width: 768px)')
    const onChange = () => {
      mobileRef.current = mq.matches
      applyLabels(scrollProgressRef.current)
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [applyLabels])

  useEffect(() => {
    if (!ready) return

    const loaded = new Array(HERO_FRAME_COUNT).fill(false) as boolean[]
    const imgs = new Array(HERO_FRAME_COUNT).fill(null) as (
      | HTMLImageElement
      | null
    )[]
    loadedRef.current = loaded
    framesRef.current = imgs
    let cancelled = false
    const timers: number[] = []

    function loadFrame(i: number) {
      if (cancelled || imgs[i]) return
      const img = new Image()
      img.decoding = 'async'
      img.src = heroFrameSrc(i)
      img.onload = () => {
        loaded[i] = true
        if (cancelled) return
        const target = frameForProgress(scrollProgressRef.current)
        if (i === target || lastPaintedRef.current < 0) paintIndex(target)
      }
      imgs[i] = img
    }

    loadFrame(0)
    loadFrame(LAST_INDEX)
    for (let i = 1; i < LAST_INDEX; i++) {
      const delay = Math.floor(i / 8) * 12
      timers.push(window.setTimeout(() => loadFrame(i), delay))
    }

    return () => {
      cancelled = true
      for (const timer of timers) window.clearTimeout(timer)
    }
  }, [ready, frameForProgress, paintIndex])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    function resize() {
      if (!canvas) return
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const cssW = canvas.offsetWidth
      const cssH = canvas.offsetHeight
      canvas.width = Math.round(cssW * dpr)
      canvas.height = Math.round(cssH * dpr)
      const ctx = canvas.getContext('2d')
      if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      lastPaintedRef.current = -1
      paintIndex(frameForProgress(scrollProgressRef.current))
      applyLabels(scrollProgressRef.current)
    }

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    resize()
    return () => ro.disconnect()
  }, [applyLabels, frameForProgress, paintIndex])

  useEffect(() => {
    function setCinematicScrollbar(active: boolean) {
      document.documentElement.classList.toggle(
        CINEMATIC_SCROLLBAR_CLASS,
        active,
      )
    }

    function onScroll() {
      const section = sectionRef.current
      if (!section) return
      const viewH = window.innerHeight
      const maxScroll = section.offsetHeight - viewH
      const scrolled = -section.getBoundingClientRect().top
      const progress =
        maxScroll <= 0 ? 1 : clampVal(scrolled / maxScroll, 0, 1)
      scrollProgressRef.current = progress
      // Hide scrollbar while the cinematic sticky section is still in play.
      setCinematicScrollbar(!reduced && progress < 1)
      applyReveal(progress)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    applyReveal(scrollProgressRef.current)
    return () => {
      window.removeEventListener('scroll', onScroll)
      setCinematicScrollbar(false)
    }
  }, [applyReveal, reduced])

  useEffect(() => {
    if (!ready || reduced) {
      if (reduced) {
        paintIndex(LAST_INDEX)
        applyReveal(1)
      }
      return
    }

    const section = sectionRef.current
    if (!section) return
    let running = false

    const tick = () => {
      if (!running) return
      const progress = scrollProgressRef.current
      const frameIndex = frameForProgress(progress)
      if (frameIndex !== lastPaintedRef.current) paintIndex(frameIndex)
      applyReveal(progress)
      rafRef.current = requestAnimationFrame(tick)
    }

    const start = () => {
      if (running) return
      running = true
      rafRef.current = requestAnimationFrame(tick)
    }

    const stop = () => {
      running = false
      cancelAnimationFrame(rafRef.current)
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) start()
        else stop()
      },
      { threshold: 0 },
    )
    io.observe(section)
    start()

    return () => {
      stop()
      io.disconnect()
    }
  }, [applyReveal, frameForProgress, paintIndex, ready, reduced])

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative bg-navy"
      style={{ height: reduced ? '100svh' : `${TOTAL_VH}vh` }}
      aria-label="Uthkarsh — Products Beyond Borders"
    >
      <div className="sticky top-0 h-svh w-full overflow-hidden bg-navy">
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="absolute inset-0 block h-full w-full bg-navy"
        />

        <div
          ref={labelsLayerRef}
          className="hero-tracked-labels pointer-events-none absolute inset-0 z-[15]"
          aria-hidden="true"
          style={{ opacity: reduced ? 0 : 1 }}
        >
          {HERO_LABEL_TRACKS.map((track) => {
            const copy = LABEL_COPY[track.id]
            return (
              <span
                key={track.id}
                ref={(el) => {
                  labelRefs.current[track.id] = el
                }}
                className={`hero-tracked-label absolute left-0 top-0 select-none font-semibold uppercase will-change-[transform,opacity] ${toneClass(
                  copy.tone,
                )}`}
                style={{
                  opacity: 0,
                  visibility: 'hidden',
                  fontWeight: copy.weight,
                  letterSpacing: copy.tracking,
                  lineHeight: copy.leading,
                  fontSize: `var(--hero-type-${track.id}, ${copy.desktopClamp})`,
                  textAlign: 'left',
                }}
              >
                {renderLines(track.id)}
              </span>
            )
          })}
        </div>

        <div
          ref={vignetteRef}
          aria-hidden="true"
          className="hero-vignette pointer-events-none absolute inset-0 z-10"
          style={{
            opacity: reduced ? 1 : 0,
            background: `
              radial-gradient(ellipse 140% 80% at 50% 110%, rgba(11,31,51,0.78) 0%, transparent 58%),
              linear-gradient(to bottom, rgba(11,31,51,0.55) 0%, transparent 28%, transparent 55%, rgba(11,31,51,0.72) 100%)
            `,
          }}
        />

        <div
          ref={uiRef}
          className="hero-end-ui absolute inset-0 z-20"
          style={{
            opacity: reduced ? 1 : 0,
            transform: reduced ? undefined : 'translateY(18px)',
            pointerEvents: reduced ? 'auto' : 'none',
          }}
          aria-hidden={reduced ? undefined : true}
        >
          <div className="absolute inset-x-0 top-0 z-50">
            <Header tone="cinematic" />
          </div>

          <div className="absolute bottom-[clamp(1.5rem,4.5vh,3.25rem)] left-[clamp(1.25rem,5vw,7rem)] right-[clamp(1.25rem,5vw,7rem)] max-w-[44rem]">
            <p className="flex items-center gap-3 text-[clamp(0.58rem,0.9vw,0.72rem)] font-semibold tracking-[0.28em] text-gold">
              <span className="h-px w-7 bg-gold" aria-hidden="true" />
              GLOBAL SOURCING &amp; TRADING
            </p>
            <h1
              className="mt-[clamp(0.55rem,1.2vw,1rem)] text-[clamp(2rem,7vw,6.875rem)] font-semibold leading-[0.88] tracking-[-0.04em] text-warm uppercase sm:font-bold"
              style={{ fontWeight: 700 }}
            >
              <span className="block">Products</span>
              <span className="block">Beyond</span>
              <span className="block">Borders</span>
            </h1>
            <p className="mt-[clamp(0.65rem,1.3vw,1.1rem)] max-w-[28rem] text-[clamp(1rem,1.15vw,1.25rem)] leading-relaxed text-[rgba(250,250,247,0.72)]">
              Curated sourcing for businesses looking beyond one market.
            </p>
            <div className="mt-[clamp(0.95rem,2vw,1.5rem)] flex flex-wrap items-center gap-[clamp(0.6rem,1.2vw,1rem)]">
              <a
                href="#enquire"
                className="inline-flex items-center justify-center bg-orange px-[clamp(1rem,1.7vw,1.6rem)] py-[clamp(0.75rem,1.15vw,0.95rem)] text-center text-[clamp(0.62rem,0.85vw,0.75rem)] font-bold tracking-[0.1em] text-white uppercase transition-[filter] duration-200 hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange"
              >
                Start a Sourcing Conversation
              </a>
              <a
                href="#catalogue"
                className="inline-flex items-center justify-center border border-warm/50 bg-transparent px-[clamp(1rem,1.7vw,1.6rem)] py-[clamp(0.75rem,1.15vw,0.95rem)] text-center text-[clamp(0.62rem,0.85vw,0.75rem)] font-bold tracking-[0.1em] text-warm uppercase transition-colors duration-200 hover:border-warm hover:bg-warm/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-warm"
              >
                Explore Products
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
