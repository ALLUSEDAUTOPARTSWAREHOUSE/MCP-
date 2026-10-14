import sharp from 'sharp'
import { readdirSync } from 'node:fs'
import path from 'node:path'

const LOGOS_DIR = path.resolve(process.cwd(), 'public/logos')
// Pixels within HARD distance of the detected background color become fully
// transparent; between HARD and SOFT they are feathered.
const HARD = 60
const SOFT = 110

const files = readdirSync(LOGOS_DIR).filter(
  (f) => f.endsWith('.jpg') || f.endsWith('.png'),
)
// Prefer jpg originals when both exist (pngs may be earlier conversions).
const seen = new Set()
const inputs = []
for (const f of files.filter((f) => f.endsWith('.jpg'))) {
  seen.add(f.replace(/\.jpg$/, ''))
  inputs.push(f)
}
for (const f of files.filter((f) => f.endsWith('.png'))) {
  if (!seen.has(f.replace(/\.png$/, ''))) inputs.push(f)
}

for (const file of inputs) {
  const src = path.join(LOGOS_DIR, file)
  const out = path.join(LOGOS_DIR, file.replace(/\.(jpg|png)$/, '.png'))

  const { data, info } = await sharp(src)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  const { width, height } = info
  const px = (x, y) => {
    const i = (y * width + x) * 4
    return [data[i], data[i + 1], data[i + 2]]
  }

  // Detect background color by averaging the four corners.
  const corners = [
    px(1, 1),
    px(width - 2, 1),
    px(1, height - 2),
    px(width - 2, height - 2),
  ]
  const bg = [0, 1, 2].map((c) =>
    Math.round(corners.reduce((s, p) => s + p[c], 0) / corners.length),
  )

  for (let i = 0; i < data.length; i += 4) {
    const dr = data[i] - bg[0]
    const dg = data[i + 1] - bg[1]
    const db = data[i + 2] - bg[2]
    const dist = Math.sqrt(dr * dr + dg * dg + db * db)

    if (dist <= HARD) {
      data[i + 3] = 0
    } else if (dist <= SOFT) {
      const t = (dist - HARD) / (SOFT - HARD)
      data[i + 3] = Math.min(data[i + 3], Math.round(255 * t))
    }
  }

  await sharp(data, {
    raw: { width, height, channels: 4 },
  })
    .png()
    .toFile(out + '.tmp')

  // Atomic-ish replace to avoid sharp reading and writing the same file.
  const { renameSync } = await import('node:fs')
  renameSync(out + '.tmp', out)

  console.log(`[v0] ${file}: bg rgb(${bg.join(',')}) -> ${path.basename(out)}`)
}

console.log(`[v0] done: ${inputs.length} logos processed`)
