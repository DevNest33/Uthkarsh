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

    const fadeOut = (reason = 'unspecified') => {
      // #region agent log
      fetch('http://127.0.0.1:7414/ingest/4ce1830f-3346-470a-9de3-c0ea43d0a4e8', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': 'db4ee1' },
        body: JSON.stringify({
          sessionId: 'db4ee1',
          runId: 'pre-fix',
          hypothesisId: 'H4',
          location: 'IntroLoader.tsx',
          message: 'fadeOut',
          data: {
            reason,
            finished: finishedRef.current,
            cancelled: signal.cancelled,
            currentTime: videoRef.current?.currentTime ?? null,
            readyState: videoRef.current?.readyState ?? null,
            paused: videoRef.current?.paused ?? null,
            ended: videoRef.current?.ended ?? null,
            errorCode: videoRef.current?.error?.code ?? null,
          },
          timestamp: Date.now(),
        }),
      }).catch(() => {})
      // #endregion
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

    const failsafe = window.setTimeout(() => fadeOut('failsafe'), FAILSAFE_MS)
    const video = videoRef.current

    // #region agent log
    const dbg = (hypothesisId: string, message: string, data: Record<string, unknown>) => {
      fetch('http://127.0.0.1:7414/ingest/4ce1830f-3346-470a-9de3-c0ea43d0a4e8', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': 'db4ee1' },
        body: JSON.stringify({
          sessionId: 'db4ee1',
          runId: 'pre-fix',
          hypothesisId,
          location: 'IntroLoader.tsx',
          message,
          data,
          timestamp: Date.now(),
        }),
      }).catch(() => {})
    }
    const mediaSnap = () => {
      const el = videoRef.current
      const ranges: string[] = []
      const buffered = el?.buffered
      if (buffered) {
        for (let i = 0; i < buffered.length; i++) {
          ranges.push(`${buffered.start(i).toFixed(2)}-${buffered.end(i).toFixed(2)}`)
        }
      }
      const resource = performance
        .getEntriesByType('resource')
        .filter((entry) => entry.name.includes('loading.mp4'))
        .at(-1) as PerformanceResourceTiming | undefined
      return {
        readyState: el?.readyState ?? null,
        networkState: el?.networkState ?? null,
        currentTime: el ? Number(el.currentTime.toFixed(3)) : null,
        duration: el?.duration ?? null,
        paused: el?.paused ?? null,
        ended: el?.ended ?? null,
        videoWidth: el?.videoWidth ?? null,
        videoHeight: el?.videoHeight ?? null,
        buffered: ranges.join(','),
        errorCode: el?.error?.code ?? null,
        transferSize: resource?.transferSize ?? null,
        encodedBodySize: resource?.encodedBodySize ?? null,
        resourceMs: resource ? Math.round(resource.duration) : null,
      }
    }
    dbg('H2', 'effect-start', { hasVideo: Boolean(video), href: location.href, ...mediaSnap() })
    // #endregion

    if (!video) {
      // #region agent log
      dbg('H2', 'missing-video', mediaSnap())
      // #endregion
      fadeOut('missing-video')
      return () => {
        signal.cancelled = true
        window.clearTimeout(failsafe)
        document.body.style.overflow = previousOverflow
        document.body.removeAttribute('aria-busy')
      }
    }

    const onEnded = () => fadeOut('ended')
    const onError = () => fadeOut('error')
    const startPlayback = () => {
      // #region agent log
      dbg('H1', 'startPlayback', mediaSnap())
      // #endregion
      void video
        .play()
        .then(() => {
          // #region agent log
          dbg('H2', 'play-resolved', mediaSnap())
          // #endregion
        })
        .catch((err: unknown) => {
          // #region agent log
          dbg('H2', 'play-rejected', {
            ...mediaSnap(),
            errorName: err instanceof Error ? err.name : 'unknown',
            errorMessage: err instanceof Error ? err.message : String(err),
          })
          // #endregion
          fadeOut('play-rejected')
        })
    }

    // #region agent log
    const onMedia = (event: Event) => {
      const hypothesisId =
        event.type === 'waiting' || event.type === 'stalled' || event.type === 'suspend'
          ? 'H1'
          : event.type === 'error'
            ? 'H3'
            : event.type === 'ended'
              ? 'H4'
              : 'H2'
      dbg(hypothesisId, `media:${event.type}`, mediaSnap())
    }
    const mediaEvents = [
      'loadedmetadata',
      'loadeddata',
      'canplay',
      'canplaythrough',
      'playing',
      'waiting',
      'stalled',
      'suspend',
      'pause',
      'ended',
      'error',
    ]
    for (const name of mediaEvents) video.addEventListener(name, onMedia)

    let samples = 0
    let lastTime = -1
    const sampler = window.setInterval(() => {
      samples += 1
      const snap = mediaSnap()
      const currentTime = typeof snap.currentTime === 'number' ? snap.currentTime : -1
      const frozen = lastTime >= 0 && currentTime === lastTime && snap.ended !== true && snap.paused === false
      lastTime = currentTime
      dbg(frozen ? 'H1' : 'H4', frozen ? 'time-frozen' : 'sample', { ...snap, samples, frozen })
      if (samples >= 24 || snap.ended === true) window.clearInterval(sampler)
    }, 400)
    // #endregion

    video.addEventListener('ended', onEnded)
    video.addEventListener('error', onError)

    if (video.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
      startPlayback()
    } else {
      video.addEventListener('canplay', startPlayback, { once: true })
    }

    return () => {
      // #region agent log
      dbg('H5', 'effect-cleanup', { finished: finishedRef.current, ...mediaSnap() })
      window.clearInterval(sampler)
      for (const name of mediaEvents) video.removeEventListener(name, onMedia)
      // #endregion
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
