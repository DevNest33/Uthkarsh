import { LogoMark } from './LogoMark'

type BrandLockupProps = {
  size?: 'nav' | 'hero'
  tone?: 'default' | 'onDark'
}

export function BrandLockup({ size = 'nav', tone = 'default' }: BrandLockupProps) {
  const isNav = size === 'nav'
  const onDark = tone === 'onDark'

  return (
    <div className="flex items-center gap-[clamp(0.65rem,1.2vw,1rem)]">
      <LogoMark
        className={
          isNav
            ? 'h-[clamp(2.25rem,3.6vw,2.75rem)] w-auto'
            : 'h-[clamp(3rem,4.5vw,4rem)] w-auto'
        }
        title="Uthkarsh"
        horizon={onDark ? '#FAFAF7' : undefined}
      />

      {onDark ? (
        <span
          className={
            isNav
              ? 'text-[clamp(0.95rem,1.5vw,1.2rem)] font-extrabold tracking-[0.18em] text-warm'
              : 'text-[clamp(1.15rem,1.8vw,1.45rem)] font-extrabold tracking-[0.18em] text-warm'
          }
          aria-hidden="true"
        >
          UTHKARSH
        </span>
      ) : (
        <img
          src="/brand/uthkarsh-wordmark.png"
          alt="UTHKARSH"
          className={
            isNav
              ? 'h-[clamp(1.25rem,2vw,1.75rem)] w-auto'
              : 'h-[clamp(1.75rem,2.6vw,2.25rem)] w-auto'
          }
        />
      )}
    </div>
  )
}
