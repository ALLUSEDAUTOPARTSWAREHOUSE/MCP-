import { removeBackground } from '@imgly/background-removal-node'
import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

const SRC = path.resolve('public/auapw-logo-raw.jpeg')
const OUT = path.resolve('public/auapw-logo.png')

const inputBuffer = await readFile(SRC)
// pass as data URL / blob
const blob = new Blob([inputBuffer], { type: 'image/jpeg' })

console.log('[v0] running background removal model...')
const resultBlob = await removeBackground(blob, {
  output: { format: 'image/png', quality: 1 },
})

const arrayBuffer = await resultBlob.arrayBuffer()
await writeFile(OUT, Buffer.from(arrayBuffer))
console.log('[v0] wrote', OUT)
