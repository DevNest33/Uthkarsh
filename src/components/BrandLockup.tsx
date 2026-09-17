import { LogoMark } from './LogoMark'

type BrandLockupProps = {
  size?: 'nav' | 'hero'
}

export function BrandLockup({ size = 'nav' }: BrandLockupProps) {
  const isNav = size === 'nav'

  return (
    <div className="flex items-center gap-[clamp(0.65rem,1.2vw,1rem)]">
      <LogoMark
        className={
          isNav
            ? 'h-[clamp(2.25rem,3.6vw,2.75rem)] w-auto'
            : 'h-[clamp(3rem,4.5vw,4rem)] w-auto'
        }
        title="Uthkarsh"
      />

      <img
        src="/brand/uthkarsh-wordmark.png"
        alt="UTHKARSH"
        className={
          isNav
            ? 'h-[clamp(1.25rem,2vw,1.75rem)] w-auto'
            : 'h-[clamp(1.75rem,2.6vw,2.25rem)] w-auto'
        }
      />
    </div>
  )
}
