/**
 * Hero kinetic typography tracks.
 *
 * Captions are synchronized to FRAME INDEX (0..HERO_FRAME_COUNT-1), not to
 * scrub percentage. Each caption has a startFrame / peakFrame / endFrame and
 * start / peak / end poses (x, y, scale, rotate, skewX, skewY, opacity).
 * Poses are interpolated linearly start->peak->end. Outside the window the
 * label is hidden.
 *
 * Frame windows use 1-based hero file numbers (hero-0006.jpg = frameIndex 5)
 * aligned to shot cuts in the 217-frame sequence.
 */

export const HERO_FRAME_COUNT_REF = 217
const LAST_FRAME = HERO_FRAME_COUNT_REF - 1 // 216

/** Convert 1-based hero file number (e.g. 3 for hero-0003.jpg) to 0-based index. */
function fileToIndex(fileNumber: number): number {
  return fileNumber - 1
}

export type LabelPose = {
  x: number
  y: number
  scale: number
  rotate: number
  skewX: number
  skewY: number
  opacity: number
}

export type LabelTrackId =
  | 'source'
  | 'move'
  | 'connect'
  | 'acrossMarkets'
  | 'beyondBorders'

export type LabelTrack = {
  id: LabelTrackId
  startFrame: number
  peakFrame: number
  endFrame: number
  desktop: { start: LabelPose; peak: LabelPose; end: LabelPose }
  mobile: { start: LabelPose; peak: LabelPose; end: LabelPose }
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

function lerpPose(a: LabelPose, b: LabelPose, t: number): LabelPose {
  return {
    x: lerp(a.x, b.x, t),
    y: lerp(a.y, b.y, t),
    scale: lerp(a.scale, b.scale, t),
    rotate: lerp(a.rotate, b.rotate, t),
    skewX: lerp(a.skewX, b.skewX, t),
    skewY: lerp(a.skewY, b.skewY, t),
    opacity: lerp(a.opacity, b.opacity, t),
  }
}

export type LabelSample = LabelPose & { visible: boolean }

/**
 * Sample a label track at a given frame index.
 * Returns null when the label is outside its active window.
 */
export function sampleLabel(
  track: LabelTrack,
  frameIndex: number,
  mobile: boolean,
): LabelSample | null {
  const { startFrame, peakFrame, endFrame } = track
  if (frameIndex < startFrame || frameIndex > endFrame) return null

  const poses = mobile ? track.mobile : track.desktop
  const { start, peak, end } = poses

  if (frameIndex <= peakFrame) {
    const u =
      peakFrame > startFrame
        ? (frameIndex - startFrame) / (peakFrame - startFrame)
        : 1
    const p = lerpPose(start, peak, u)
    return { ...p, visible: p.opacity > 0.01 }
  }
  const u =
    endFrame > peakFrame
      ? (frameIndex - peakFrame) / (endFrame - peakFrame)
      : 0
  const p = lerpPose(peak, end, u)
  return { ...p, visible: p.opacity > 0.01 }
}

export function applyLabelStyle(
  el: HTMLElement | null,
  sample: LabelSample | null,
): void {
  if (!el) return
  if (!sample || !sample.visible) {
    el.style.opacity = '0'
    el.style.visibility = 'hidden'
    return
  }
  el.style.visibility = 'visible'
  el.style.opacity = String(sample.opacity)
  el.style.left = `${sample.x}%`
  el.style.top = `${sample.y}%`
  el.style.transform = [
    'translate(-50%, -50%)',
    `rotate(${sample.rotate}deg)`,
    `skew(${sample.skewX}deg, ${sample.skewY}deg)`,
    `scale(${sample.scale})`,
  ].join(' ')
}

/**
 * Caption windows synced to 217-frame shot cuts (hero file numbers):
 *
 *  SOURCE         006–038  crane / container
 *  MOVE           034–072  truck loading
 *  CONNECT        058–098  route icons on truck, then ship
 *  ACROSS MARKETS 088–116  established aerial ship
 *  BEYOND BORDERS 150–205  plane through fog
 *  FINAL          200–217  last-frame UI
 *
 * Overlaps are intentional for dissolves. Cloud/whiteout 115–148 is a breath.
 */
export const HERO_LABEL_TRACKS: LabelTrack[] = [
  {
    id: 'source',
    startFrame: fileToIndex(6),
    peakFrame: fileToIndex(18),
    endFrame: fileToIndex(38),
    desktop: {
      // Locked to blue container face; planar-tracked feel.
      start: { x: 50, y: 56, scale: 1.05, rotate: -1, skewX: 2, skewY: 0, opacity: 0 },
      peak: { x: 50, y: 54.5, scale: 1.1, rotate: -0.5, skewX: 1.5, skewY: 0, opacity: 1 },
      end: { x: 51, y: 51.5, scale: 1.0, rotate: 0, skewX: 0, skewY: 0, opacity: 0 },
    },
    mobile: {
      start: { x: 50, y: 54, scale: 0.7, rotate: 0, skewX: 1, skewY: 0, opacity: 0 },
      peak: { x: 50, y: 52.5, scale: 0.72, rotate: 0, skewX: 0.5, skewY: 0, opacity: 1 },
      end: { x: 51, y: 51, scale: 0.68, rotate: 0, skewX: 0, skewY: 0, opacity: 0 },
    },
  },
  {
    id: 'move',
    startFrame: fileToIndex(34),
    peakFrame: fileToIndex(50),
    endFrame: fileToIndex(72),
    desktop: {
      // Enters from the left, travels with the truck, exits to the right.
      start: { x: 30, y: 38, scale: 1.2, rotate: -3, skewX: 4, skewY: 0, opacity: 0 },
      peak: { x: 50, y: 34, scale: 1.25, rotate: -1.5, skewX: 2, skewY: 0, opacity: 1 },
      end: { x: 72, y: 46, scale: 0.95, rotate: 1, skewX: 0, skewY: 0, opacity: 0 },
    },
    mobile: {
      start: { x: 28, y: 30, scale: 0.78, rotate: -2, skewX: 2, skewY: 0, opacity: 0 },
      peak: { x: 50, y: 28, scale: 0.82, rotate: -1, skewX: 1, skewY: 0, opacity: 1 },
      end: { x: 72, y: 40, scale: 0.66, rotate: 1, skewX: 0, skewY: 0, opacity: 0 },
    },
  },
  {
    id: 'connect',
    startFrame: fileToIndex(58),
    peakFrame: fileToIndex(80),
    endFrame: fileToIndex(98),
    desktop: {
      // Negative space in the transition beat; subtle horizontal drift.
      start: { x: 24, y: 30, scale: 1.0, rotate: 0, skewX: 0, skewY: 0, opacity: 0 },
      peak: { x: 32, y: 28, scale: 1.05, rotate: 0, skewX: 0, skewY: 0, opacity: 1 },
      end: { x: 44, y: 26, scale: 1.0, rotate: 0, skewX: 0, skewY: 0, opacity: 0 },
    },
    mobile: {
      start: { x: 22, y: 22, scale: 0.7, rotate: 0, skewX: 0, skewY: 0, opacity: 0 },
      peak: { x: 32, y: 20, scale: 0.72, rotate: 0, skewX: 0, skewY: 0, opacity: 1 },
      end: { x: 44, y: 18, scale: 0.68, rotate: 0, skewX: 0, skewY: 0, opacity: 0 },
    },
  },
  {
    id: 'acrossMarkets',
    startFrame: fileToIndex(88),
    peakFrame: fileToIndex(102),
    endFrame: fileToIndex(116),
    desktop: {
      // Two-line composition balancing the ship; soft scale + translateY.
      start: { x: 70, y: 30, scale: 0.98, rotate: 0, skewX: 0, skewY: 0, opacity: 0 },
      peak: { x: 70, y: 32, scale: 1.04, rotate: 0, skewX: 0, skewY: 0, opacity: 1 },
      end: { x: 70, y: 34, scale: 1.0, rotate: 0, skewX: 0, skewY: 0, opacity: 0 },
    },
    mobile: {
      start: { x: 68, y: 24, scale: 0.66, rotate: 0, skewX: 0, skewY: 0, opacity: 0 },
      peak: { x: 68, y: 26, scale: 0.7, rotate: 0, skewX: 0, skewY: 0, opacity: 1 },
      end: { x: 68, y: 28, scale: 0.66, rotate: 0, skewX: 0, skewY: 0, opacity: 0 },
    },
  },
  {
    id: 'beyondBorders',
    startFrame: fileToIndex(150),
    peakFrame: fileToIndex(180),
    endFrame: fileToIndex(205),
    desktop: {
      // Around the aircraft negative space; one word overlaps the scene.
      start: { x: 28, y: 28, scale: 1.0, rotate: 0, skewX: 0, skewY: 0, opacity: 0 },
      peak: { x: 30, y: 30, scale: 1.06, rotate: 0, skewX: 0, skewY: 0, opacity: 1 },
      end: { x: 32, y: 32, scale: 1.0, rotate: 0, skewX: 0, skewY: 0, opacity: 0 },
    },
    mobile: {
      start: { x: 30, y: 22, scale: 0.7, rotate: 0, skewX: 0, skewY: 0, opacity: 0 },
      peak: { x: 32, y: 24, scale: 0.74, rotate: 0, skewX: 0, skewY: 0, opacity: 1 },
      end: { x: 34, y: 26, scale: 0.7, rotate: 0, skewX: 0, skewY: 0, opacity: 0 },
    },
  },
]

export const LABEL_TRACK_IDS: LabelTrackId[] = HERO_LABEL_TRACKS.map(
  (t) => t.id,
)

export function getLabelTrack(id: LabelTrackId): LabelTrack {
  const t = HERO_LABEL_TRACKS.find((tr) => tr.id === id)
  if (!t) throw new Error(`Unknown label track: ${id}`)
  return t
}

/**
 * Scrub progress where tracked labels clear and the final hero statement
 * begins to reveal. Plane shot hold: file 200 = index 199.
 */
export const FINAL_REVEAL_SCRUB = fileToIndex(200) / LAST_FRAME
