import sharp from 'sharp'
import path from 'node:path'

const SRC = path.resolve('public/auapw-logo-raw-black.jpeg')
const OUT = path.resolve('public/auapw-logo.png')

const { data, info } = await sharp(SRC)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true })
const { width, height, channels } = info
console.log('[v0] image', width, height, channels)

const at = (x, y) => (y * width + x) * channels
const lum = (i) => 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]

// The background is pure/near-pure black. The gear ring, chrome "A", and text
// all carry brighter silver shading, so a border-connected flood fill over
// near-black pixels removes only the outer black backdrop and stops at the
// logo silhouette. A low threshold protects the dark gear detail.
const LUM_MAX = 42       // treat only near-black as background
const removable = (i) => lum(i) <= LUM_MAX

const visited = new Uint8Array(width * height)
const stack = []
for (let x = 0; x < width; x++) stack.push(x, (height - 1) * width + x)
for (let y = 0; y < height; y++) stack.push(y * width, y * width + (width - 1))

while (stack.length) {
  const p = stack.pop()
  if (visited[p]) continue
  const i = p * channels
  if (!removable(i)) continue
  visited[p] = 1
  data[i + 3] = 0
  const x = p % width
  const y = (p - x) / width
  if (x > 0) stack.push(p - 1)
  if (x < width - 1) stack.push(p + 1)
  if (y > 0) stack.push(p - width)
  if (y < height - 1) stack.push(p + width)
}

// Feather: soften alpha on kept pixels touching transparency to avoid a hard
// black fringe around the silver edges.
const out = Uint8Array.from(data)
for (let y = 1; y < height - 1; y++) {
  for (let x = 1; x < width - 1; x++) {
    const p = y * width + x
    if (visited[p]) continue
    const i = p * channels
    if (out[i + 3] === 0) continue
    const transparentNeighbors =
      (visited[p - 1] ? 1 : 0) +
      (visited[p + 1] ? 1 : 0) +
      (visited[p - width] ? 1 : 0) +
      (visited[p + width] ? 1 : 0)
    if (transparentNeighbors > 0 && lum(i) <= LUM_MAX + 22) {
      out[i + 3] = Math.max(0, 150 - transparentNeighbors * 32)
    }
  }
}

await sharp(out, { raw: { width, height, channels } }).png().toFile(OUT)

let cleared = 0
for (let p = 0; p < width * height; p++) if (visited[p]) cleared++
console.log('[v0] transparent pixels', cleared, 'of', width * height,
  `(${((cleared / (width * height)) * 100).toFixed(1)}%)`)
console.log('[v0] wrote', OUT)
