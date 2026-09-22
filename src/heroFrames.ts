export const HERO_FRAME_COUNT = 217
export const HERO_FRAME_PAD = 4
export const HERO_FRAME_VERSION = '1080p'

export function heroFrameSrc(index: number): string {
  const n = String(index + 1).padStart(HERO_FRAME_PAD, '0')
  return `/frames/hero-${n}.jpg?v=${HERO_FRAME_VERSION}`
}
