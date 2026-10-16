// The purple pixel flow as one SVG for the desktop app, which animates it natively:
// squares densest and deepest on the right, a light band drifting right to left,
// soft twinkle, and a glow that lights the columns under the mouse and fades after it.

const PX = 3
const GAP = 2
const STEP = PX + GAP
const ROWS = 4

const seed = (n: number) => {
  const v = Math.sin(n * 12.9898) * 43758.5453
  return v - Math.floor(v)
}

const mix = (a: number, b: number, t: number) => Math.round(a + (b - a) * t)

const STYLE = `
rect{opacity:var(--o,.07);transition:fill 1.2s ease-out,opacity 1.2s ease-out}
.h{fill:transparent;opacity:1}
.c:hover rect:not(.h),.c:hover+.c rect:not(.h),.c:has(+.c:hover) rect:not(.h){fill:#d6d1fa;opacity:1;transition:fill .15s,opacity .15s}
.c:hover .n{filter:drop-shadow(0 0 2px #afa9ec)}
.t1{animation:tw 2.8s ease-in-out infinite}
.t2{animation:tw 3.4s ease-in-out .9s infinite}
.t3{animation:tw 2.2s ease-in-out 1.7s infinite}
@keyframes fl{0%,100%{opacity:.6}50%{opacity:1}}
.c{animation:fl 5s ease-in-out infinite}
@keyframes tw{0%,100%{opacity:var(--o)}50%{opacity:calc(var(--o) * .45)}}
`

const cache = new Map<number, string>()

export function flowSvg(width: number): string {
  const w = Math.min(1500, Math.max(STEP * 10, Math.round(width)))
  const hit = cache.get(w)
  if (hit) return hit

  const cols = Math.floor(w / STEP)
  const h = ROWS * STEP
  const parts: string[] = []

  for (let i = 0; i < cols; i++) {
    const p = cols > 1 ? i / (cols - 1) : 1
    const base = Math.pow(p, 1.6)
    // lighter lavender on the left, deep purple on the right
    const fill = `rgb(${mix(160, 94, base)},${mix(152, 83, base)},${mix(236, 203, base)})`
    const rects: string[] = []
    for (let j = 0; j < ROWS; j++) {
      const k = seed(i * ROWS + j + 1)
      const isOn = k < 0.06 + base * 0.88
      const x = i * STEP
      const y = j * STEP
      if (!isOn) {
        rects.push(`<rect x="${x}" y="${y}" width="3" height="3"/>`)
        continue
      }
      const twinkle = 1 + Math.floor(seed(i * 31 + j) * 3)
      rects.push(`<rect class="n t${twinkle}" x="${x}" y="${y}" width="3" height="3" style="--o:${(0.5 + 0.5 * base).toFixed(2)}"/>`)
    }
    const delay = -(((i * STEP) % 320) / 320) * 5
    parts.push(`<g class="c" fill="${fill}" style="animation-delay:${delay.toFixed(2)}s"><rect class="h" x="${i * STEP - 1}" y="0" width="5" height="20"/>${rects.join('')}</g>`)
  }

  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${cols * STEP}" height="${h}" viewBox="0 0 ${cols * STEP} ${h}">` +
    `<style>${STYLE}</style>` +
    `${parts.join('')}</svg>`

  cache.set(w, svg)
  return svg
}
