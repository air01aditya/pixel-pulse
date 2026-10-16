// The purple spiral spinner for the desktop app: square pixels inside a circle,
// two spiral arms turning, brightest near the centre. One SVG the app animates itself.

const N = 9
const C = 4
const R = 4.4
const STEP = 4
const PX = 3
const PERIOD = 2.1 // seconds per turn of the arms

const mix = (a: number, b: number, t: number) => Math.round(a + (b - a) * t)
const mod = (a: number, m: number) => ((a % m) + m) % m

const STYLE =
  'rect{animation:sp ' + PERIOD + 's linear infinite}' +
  '@keyframes sp{0%{opacity:.5}25%{opacity:.08}50%{opacity:.5}75%{opacity:1}100%{opacity:.5}}'

let cached: string | null = null

export function spiralSvg(): string {
  if (cached) return cached
  const rects: string[] = []
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      const d = Math.hypot(x - C, y - C)
      if (d > R) continue
      const phase = Math.atan2(y - C, x - C) * 2 + d * 1.1
      // each pixel runs the same pulse, shifted by where it sits on the arms
      const delay = mod((-phase / (2 * Math.PI)) * PERIOD, PERIOD)
      const near = Math.max(0, Math.min(1, 1.3 - d * 0.2))
      const fill = `rgb(${mix(83, 214, near)},${mix(74, 209, near)},${mix(183, 250, near)})`
      rects.push(
        `<rect x="${x * STEP}" y="${y * STEP}" width="${PX}" height="${PX}" fill="${fill}" style="animation-delay:-${delay.toFixed(2)}s"/>`,
      )
    }
  }
  const size = N * STEP
  cached =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">` +
    `<style>${STYLE}</style>${rects.join('')}</svg>`
  return cached
}
