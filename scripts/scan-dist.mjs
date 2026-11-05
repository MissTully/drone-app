import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const dist = fileURLToPath(new URL('../dist/', import.meta.url))
const patterns = [
  /AKIA[0-9A-Z]{16}/,
  /-----BEGIN [A-Z ]*PRIVATE KEY-----/,
  /sk_live_[0-9A-Za-z]+/,
  /SUPABASE_SERVICE_ROLE/,
  /PREVIEW_SESSION_SECRET\s*=\s*\S+/,
  /NEXT_PUBLIC_[A-Z0-9_]*(SECRET|KEY|TOKEN)/,
]

function filesIn(dir) {
  const found = []
  for (const name of readdirSync(dir)) {
    const path = join(dir, name)
    const stat = statSync(path)
    if (stat.isDirectory()) found.push(...filesIn(path))
    else found.push(path)
  }
  return found
}

let failed = false
for (const file of filesIn(dist)) {
  const text = readFileSync(file)
  const source = text.toString('utf8')
  for (const pattern of patterns) {
    if (pattern.test(source)) {
      console.error(`secret-like pattern ${pattern} in ${file}`)
      failed = true
    }
  }
}

if (failed) process.exit(1)
console.log('bundle_scan=clean')
