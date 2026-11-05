import { readFileSync } from 'node:fs'

const origin = process.env.PLATFORM_AUTH_URL ?? 'https://drone-app-five.vercel.app'
const questions = JSON.parse(readFileSync(new URL('../src/data/questions.json', import.meta.url), 'utf8'))
const stem = questions[0]?.stem
if (typeof stem !== 'string' || stem.length < 20) {
  console.error('platform_auth=error reason=missing-stem')
  process.exit(1)
}

const paths = ['/', '/modules', '/practice', '/test', '/pricing', '/favicon.svg', '/encountive-logo.png', '/assets/index.js']

function classify(status, locationHost, body) {
  if (body.includes(stem)) return 'leaked'
  const deniedStatus = status === 401 || status === 403
  const deniedRedirect =
    (status === 301 || status === 302 || status === 303 || status === 307 || status === 308) &&
    (locationHost === 'vercel.com' || locationHost.endsWith('.vercel.com'))
  const deniedBody = /Protected by Vercel Authentication|Authentication Required/i.test(body)
  if (deniedStatus || deniedRedirect || deniedBody) return 'denied'
  if (status === 200 && /id="root"|Remote Possibilities/i.test(body)) return 'public'
  return 'unknown'
}

let failed = false
for (const path of paths) {
  const response = await fetch(new URL(path, origin), { redirect: 'manual' })
  const body = await response.text()
  let locationHost = ''
  const location = response.headers.get('location')
  if (location) {
    try {
      locationHost = new URL(location).host
    } catch {
      locationHost = 'invalid'
    }
  }
  const result = classify(response.status, locationHost, body)
  console.log(`${path} status=${response.status} location_host=${locationHost || '-'} result=${result}`)
  if (result !== 'denied') failed = true
}

console.log(failed ? 'platform_auth=public_or_unknown' : 'platform_auth=denied')
process.exit(failed ? 1 : 0)
