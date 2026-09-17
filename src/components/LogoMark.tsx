import { useId } from 'react'

export const SUNRISE_MARK_VIEWBOX = '30 60 380 382'

export function SunriseSunGradient({ id }: { id: string }) {
  return (
    <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#FFD86B" />
      <stop offset="0.55" stopColor="#F5A623" />
      <stop offset="1" stopColor="#F97316" />
    </linearGradient>
  )
}

const NAVY_HORIZON = '#0B1F33'

/** Existing Uthkarsh sunrise mark — path data from uthkarsh-sunrise-logo.svg */
export function SunriseMarkGraphic({
  sunId,
  horizon = NAVY_HORIZON,
}: {
  sunId: string
  horizon?: string
}) {
  return (
    <>
      <path d="M30 250a190 190 0 0 1 380 0Z" fill={`url(#${sunId})`} />
      <path d="M30 250h380" stroke={horizon} strokeWidth="25" />
      <path
        d="M72 295h296M91 340h258M116 385h208M151 430h138"
        stroke={horizon}
        strokeWidth="24"
        strokeLinecap="round"
      />
    </>
  )
}

type LogoMarkProps = {
  className?: string
  title?: string
  horizon?: string
}

export function LogoMark({ className, title, horizon = NAVY_HORIZON }: LogoMarkProps) {
  const rawId = useId()
  const sunId = `uthkarsh-sun-${rawId.replace(/:/g, '')}`

  return (
    <svg
      viewBox={SUNRISE_MARK_VIEWBOX}
      className={className}
      role={title ? 'img' : 'presentation'}
      aria-hidden={title ? undefined : true}
      aria-labelledby={title ? `${sunId}-title` : undefined}
    >
      {title ? <title id={`${sunId}-title`}>{title}</title> : null}
      <defs>
        <SunriseSunGradient id={sunId} />
      </defs>
      <SunriseMarkGraphic sunId={sunId} horizon={horizon} />
    </svg>
  )
}
