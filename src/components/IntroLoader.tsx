import { useEffect, useRef } from 'react'

export const INTRO_SESSION_KEY = 'uthkarsh-intro-played'

const FADE_MS = 700
const FAILSAFE_MS = 30000

type IntroLoaderProps = {
  onComplete: () => void
}

export function shouldSkipIntro() {
  if (typeof window === 'undefined') return false
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true
  try {
    return sessionStorage.getItem(INTRO_SESSION_KEY) === '1'
  } catch {
    return false
  }
}

function markIntroPlayed() {
  try {
    sessionStorage.setItem(INTRO_SESSION_KEY, '1')
  } catch {
    /* private mode */
  }
}

export function IntroLoader({ onComplete }: IntroLoaderProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const veilRef = useRef<HTMLDivElement>(null)
  const finishedRef = useRef(false)

  useEffect(() => {
    const signal = { cancelled: false }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.body.setAttribute('aria-busy', 'true')

    const finish = () => {
      if (finishedRef.current || signal.cancelled) return
      finishedRef.current = true
      markIntroPlayed()
      document.body.style.overflow = previousOverflow
      document.body.removeAttribute('aria-busy')
      onComplete()
    }

    const fadeOut = () => {
      if (finishedRef.current || signal.cancelled) return
      const veil = veilRef.current
      if (!veil) {
        finish()
        return
      }

      const animation = veil.animate([{ opacity: 1 }, { opacity: 0 }], {
        duration: FADE_MS,
        easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
        fill: 'forwards',
      })

      animation.finished
        .then(() => {
          if (!signal.cancelled) finish()
        })
        .catch(() => {
          if (!signal.cancelled) finish()
        })
    }

    const failsafe = window.setTimeout(fadeOut, FAILSAFE_MS)
    const video = videoRef.current

    if (!video) {
      fadeOut()
      return () => {
        signal.cancelled = true
        window.clearTimeout(failsafe)
        document.body.style.overflow = previousOverflow
        document.body.removeAttribute('aria-busy')
      }
    }

    const onEnded = () => fadeOut()
    const onError = () => fadeOut()
    const startPlayback = () => {
      void video.play().catch(() => fadeOut())
    }

    video.addEventListener('ended', onEnded)
    video.addEventListener('error', onError)

    if (video.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
      startPlayback()
    } else {
      video.addEventListener('canplay', startPlayback, { once: true })
    }

    return () => {
      signal.cancelled = true
      window.clearTimeout(failsafe)
      video.removeEventListener('ended', onEnded)
      video.removeEventListener('error', onError)
      video.removeEventListener('canplay', startPlayback)
      document.body.style.overflow = previousOverflow
      document.body.removeAttribute('aria-busy')
    }
  }, [onComplete])

  return (
    <div
      ref={veilRef}
      className="fixed inset-0 z-50 overflow-hidden bg-navy"
      role="status"
      aria-label="Loading Uthkarsh"
    >
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        src="/intro/loading.mp4"
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
      />
    </div>
  )
}
