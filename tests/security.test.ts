import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { QUESTION_BANK, getQuestionsByIds } from '../src/data/bank'
import { PROGRESS_STORAGE_KEY, TOPIC_IDS, WAITLIST_STORAGE_KEY } from '../src/data/topics'
import { normalizeEmail } from '../src/lib/email'
import { youtubeNocookieEmbedUrl } from '../src/lib/embed'
import { parseStoredResult, parseStoredSession } from '../src/lib/persistedQuiz'
import { formatAnswer, letterForIndex, scoreSession } from '../src/lib/quiz'
import {
  loadProgress,
  loadWaitlistSignup,
  parseStoredProgress,
  saveWaitlistEmail,
} from '../src/lib/storage'

function installStorage(name: 'localStorage' | 'sessionStorage'): Storage {
  const map = new Map<string, string>()
  const storage: Storage = {
    get length() {
      return map.size
    },
    clear() {
      map.clear()
    },
    getItem(key) {
      return map.get(key) ?? null
    },
    key(index) {
      return [...map.keys()][index] ?? null
    },
    removeItem(key) {
      map.delete(key)
    },
    setItem(key, value) {
      map.set(key, String(value))
    },
  }
  Object.defineProperty(globalThis, name, { configurable: true, value: storage })
  return storage
}

describe('email and progress boundaries', () => {
  it('accepts a normal address and rejects injection or junk', () => {
    expect(normalizeEmail(' A@Example.com ')).toBe('a@example.com')
    expect(normalizeEmail('a@b.com\r\nBcc:evil@example.com')).toBeNull()
    expect(normalizeEmail('not-an-email')).toBeNull()
    expect(normalizeEmail(`${'a'.repeat(250)}@example.com`)).toBeNull()
  })

  it('drops unknown topic keys and out-of-range scores', () => {
    const parsed = parseStoredProgress(
      JSON.parse(
        '{"version":1,"lastPracticeScore":150,"bestTestScore":null,"lastTestScore":-4,"topicStats":{"regulations":{"attempted":4,"correct":3},"nope":{"attempted":1,"correct":1}}}',
      ),
    )
    expect(parsed?.lastPracticeScore).toBe(100)
    expect(parsed?.lastTestScore).toBe(0)
    expect(parsed?.topicStats.regulations).toEqual({ attempted: 4, correct: 3 })
    expect(parsed?.topicStats).not.toHaveProperty('nope')
    expect(parseStoredProgress({ version: 2 })).toBeNull()
  })

  it('removes oversized or invalid local progress and waitlist values', () => {
    const storage = installStorage('localStorage')
    storage.setItem(PROGRESS_STORAGE_KEY, 'x'.repeat(9000))
    expect(loadProgress().lastPracticeScore).toBeNull()
    expect(storage.getItem(PROGRESS_STORAGE_KEY)).toBeNull()

    expect(saveWaitlistEmail('not-an-email')).toBeNull()
    expect(storage.getItem(WAITLIST_STORAGE_KEY)).toBeNull()
    expect(saveWaitlistEmail('Person@Example.com')?.email).toBe('person@example.com')
    storage.setItem(
      WAITLIST_STORAGE_KEY,
      JSON.stringify({ email: 'a@\nb.com', savedAt: Date.now() }),
    )
    expect(loadWaitlistSignup()).toBeNull()
  })
})

describe('stored quiz boundaries', () => {
  const questions = QUESTION_BANK.filter((question) => question.topic === 'weather').slice(0, 2)

  it('accepts a real session and rejects tampered answers or ids', () => {
    const session = {
      mode: 'practice' as const,
      topicId: 'weather' as const,
      questionIds: questions.map((question) => question.id),
      answers: [null, null],
      currentIndex: 0,
      startedAt: Date.now(),
      durationMs: null,
      status: 'active' as const,
    }
    expect(parseStoredSession(session)?.questionIds).toEqual(session.questionIds)
    expect(parseStoredSession({ ...session, currentIndex: 40 })).toBeNull()
    expect(parseStoredSession({ ...session, questionIds: ['<script>alert(1)</script>'] })).toBeNull()
    expect(parseStoredSession({ ...session, answers: [9, null] })).toBeNull()
  })

  it('round-trips a scored result and rejects a forged score', () => {
    const scored = scoreSession(questions, [questions[0].correctIndex, null])
    const result = {
      ...scored,
      mode: 'practice' as const,
      topicId: 'weather' as const,
      submittedAt: Date.now(),
      passed: null,
    }
    expect(parseStoredResult(result)?.scorePercent).toBe(result.scorePercent)
    expect(parseStoredResult({ ...result, scorePercent: 999 })).toBeNull()
  })
})

describe('embed and answer rendering', () => {
  it('builds only nocookie urls for 11-character ids', () => {
    expect(youtubeNocookieEmbedUrl('ey1iT204hh8')).toBe(
      'https://www.youtube-nocookie.com/embed/ey1iT204hh8',
    )
    expect(youtubeNocookieEmbedUrl('-D0bIfoLkCA')).toBe(
      'https://www.youtube-nocookie.com/embed/-D0bIfoLkCA',
    )
    expect(youtubeNocookieEmbedUrl('javascript:alert(1)')).toBeNull()
    expect(youtubeNocookieEmbedUrl('abcd?autoplay=1')).toBeNull()
    expect(youtubeNocookieEmbedUrl('../eviltest')).toBeNull()
  })

  it('does not throw attacker-controlled ids back to the caller', () => {
    const hostile = '<script>alert(1)</script>'
    expect(() => getQuestionsByIds([hostile])).toThrow('Unknown question id')
    try {
      getQuestionsByIds([hostile])
    } catch (error) {
      expect(String(error)).not.toContain(hostile)
    }
  })

  it('does not invent an answer letter for an out-of-range index', () => {
    expect(letterForIndex(99)).toBe('')
    expect(formatAnswer(undefined, 9)).toBe('No answer')
  })
})

describe('deployment headers', () => {
  const vercel = JSON.parse(readFileSync(new URL('../vercel.json', import.meta.url), 'utf8')) as {
    rewrites: Array<{ destination: string }>
    headers: Array<{ headers: Array<{ key: string; value: string }> }>
  }
  const headerMap = Object.fromEntries(vercel.headers[0].headers.map((header) => [header.key, header.value]))
  const csp = headerMap['Content-Security-Policy']

  it('keeps the study shell on a same-origin policy that still allows YouTube and fonts', () => {
    expect(csp).toContain("default-src 'self'")
    expect(csp).toContain("script-src 'self'")
    expect(csp).not.toMatch(/script-src[^;]*unsafe-eval/)
    expect(csp).not.toMatch(/script-src[^;]*unsafe-inline/)
    expect(csp).toContain('https://fonts.googleapis.com')
    expect(csp).toContain('https://fonts.gstatic.com')
    expect(csp).toMatch(/frame-src https:\/\/www\.youtube-nocookie\.com(;|$)/)
    expect(csp).not.toContain('https://www.youtube.com')
    expect(csp).toContain("frame-ancestors 'none'")
    expect(csp).toContain("object-src 'none'")
    expect(csp).toContain("connect-src 'self'")
    expect(headerMap['X-Content-Type-Options']).toBe('nosniff')
    expect(headerMap['X-Frame-Options']).toBe('DENY')
    expect(headerMap['Referrer-Policy']).toBe('strict-origin-when-cross-origin')
    expect(headerMap['Cache-Control']).toBe('private, no-store')
    expect(vercel.rewrites[0].destination).toBe('/index.html')
  })

  it('does not add an application auth provider', () => {
    const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8')) as {
      dependencies: Record<string, string>
      devDependencies: Record<string, string>
    }
    const names = Object.keys({ ...pkg.dependencies, ...pkg.devDependencies })
    expect(names.some((name) => /firebase|clerk|supabase|descope|auth0/i.test(name))).toBe(false)
    const modules = readFileSync(new URL('../src/pages/Modules.tsx', import.meta.url), 'utf8')
    expect(modules).toContain('sandbox="allow-scripts allow-same-origin allow-presentation')
    expect(modules).not.toContain('allow-top-navigation')
    expect(TOPIC_IDS).toHaveLength(9)
  })
})
