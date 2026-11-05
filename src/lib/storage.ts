import { PROGRESS_STORAGE_KEY, TOPIC_IDS, WAITLIST_STORAGE_KEY } from '../data/topics'
import type { Progress, TopicId } from '../types'
import { normalizeEmail } from './email'

const PROGRESS_MAX_BYTES = 8192
const WAITLIST_MAX_BYTES = 512
const STAT_CAP = 1_000_000

const emptyProgress = (): Progress => ({
  version: 1,
  lastPracticeScore: null,
  bestTestScore: null,
  lastTestScore: null,
  topicStats: {},
})

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function browserLocalStorage(): Storage | null {
  try {
    const storage = globalThis.localStorage
    if (!storage || typeof storage.getItem !== 'function') return null
    return storage
  } catch {
    return null
  }
}

function readScore(value: unknown): number | null | undefined {
  if (value === null) return null
  if (typeof value !== 'number' || !Number.isFinite(value)) return undefined
  return Math.min(100, Math.max(0, Math.round(value)))
}

function readStat(value: unknown): { attempted: number; correct: number } | null {
  if (!isRecord(value)) return null
  const { attempted, correct } = value
  if (typeof attempted !== 'number' || typeof correct !== 'number') return null
  if (!Number.isInteger(attempted) || !Number.isInteger(correct)) return null
  if (attempted < 0 || correct < 0 || correct > attempted || attempted > STAT_CAP) return null
  return { attempted, correct }
}

export function parseStoredProgress(value: unknown): Progress | null {
  if (!isRecord(value) || value.version !== 1) return null
  const lastPracticeScore = readScore(value.lastPracticeScore)
  const bestTestScore = readScore(value.bestTestScore)
  const lastTestScore = readScore(value.lastTestScore)
  if (
    lastPracticeScore === undefined ||
    bestTestScore === undefined ||
    lastTestScore === undefined
  ) {
    return null
  }

  const topicStats: Progress['topicStats'] = {}
  if (isRecord(value.topicStats)) {
    for (const topicId of TOPIC_IDS) {
      if (!(topicId in value.topicStats)) continue
      const stat = readStat(value.topicStats[topicId])
      if (stat) topicStats[topicId] = stat
    }
  }

  return {
    version: 1,
    lastPracticeScore,
    bestTestScore,
    lastTestScore,
    topicStats,
  }
}

export function loadProgress(): Progress {
  const storage = browserLocalStorage()
  if (!storage) return emptyProgress()
  try {
    const raw = storage.getItem(PROGRESS_STORAGE_KEY)
    if (!raw) return emptyProgress()
    if (raw.length > PROGRESS_MAX_BYTES) {
      storage.removeItem(PROGRESS_STORAGE_KEY)
      return emptyProgress()
    }
    const parsed = parseStoredProgress(JSON.parse(raw))
    if (!parsed) {
      storage.removeItem(PROGRESS_STORAGE_KEY)
      return emptyProgress()
    }
    return parsed
  } catch {
    try {
      storage.removeItem(PROGRESS_STORAGE_KEY)
    } catch {
      // Ignore a broken storage implementation.
    }
    return emptyProgress()
  }
}

export function saveProgress(progress: Progress): void {
  const storage = browserLocalStorage()
  const clean = parseStoredProgress(progress)
  if (!storage || !clean) return
  try {
    storage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(clean))
  } catch {
    // Ignore quota and privacy-mode write failures.
  }
}

export function recordPracticeScore(
  scorePercent: number,
  perTopic: Array<{ topicId: TopicId; asked: number; correct: number }>,
): Progress {
  const progress = loadProgress()
  progress.lastPracticeScore = scorePercent
  applyTopicStats(progress, perTopic)
  const clean = parseStoredProgress(progress) ?? emptyProgress()
  saveProgress(clean)
  return clean
}

export function recordTestScore(
  scorePercent: number,
  perTopic: Array<{ topicId: TopicId; asked: number; correct: number }>,
): Progress {
  const progress = loadProgress()
  progress.lastTestScore = scorePercent
  progress.bestTestScore =
    progress.bestTestScore === null
      ? scorePercent
      : Math.max(progress.bestTestScore, scorePercent)
  applyTopicStats(progress, perTopic)
  const clean = parseStoredProgress(progress) ?? emptyProgress()
  saveProgress(clean)
  return clean
}

function applyTopicStats(
  progress: Progress,
  perTopic: Array<{ topicId: TopicId; asked: number; correct: number }>,
): void {
  for (const row of perTopic) {
    if (!TOPIC_IDS.includes(row.topicId)) continue
    if (!Number.isInteger(row.asked) || !Number.isInteger(row.correct)) continue
    if (row.asked < 0 || row.correct < 0 || row.correct > row.asked) continue
    const existing = progress.topicStats[row.topicId] ?? { attempted: 0, correct: 0 }
    const attempted = Math.min(STAT_CAP, existing.attempted + row.asked)
    const correct = Math.min(attempted, existing.correct + row.correct)
    progress.topicStats[row.topicId] = { attempted, correct }
  }
}

export type WaitlistSignup = {
  email: string
  savedAt: number
}

export function parseStoredWaitlist(value: unknown): WaitlistSignup | null {
  if (!isRecord(value) || typeof value.email !== 'string' || typeof value.savedAt !== 'number') {
    return null
  }
  const email = normalizeEmail(value.email)
  if (!email || !Number.isFinite(value.savedAt)) return null
  if (value.savedAt < Date.UTC(2020, 0, 1) || value.savedAt > Date.now() + 86_400_000) return null
  return { email, savedAt: value.savedAt }
}

export function loadWaitlistSignup(): WaitlistSignup | null {
  const storage = browserLocalStorage()
  if (!storage) return null
  try {
    const raw = storage.getItem(WAITLIST_STORAGE_KEY)
    if (!raw) return null
    if (raw.length > WAITLIST_MAX_BYTES) {
      storage.removeItem(WAITLIST_STORAGE_KEY)
      return null
    }
    const parsed = parseStoredWaitlist(JSON.parse(raw))
    if (!parsed) storage.removeItem(WAITLIST_STORAGE_KEY)
    return parsed
  } catch {
    try {
      storage.removeItem(WAITLIST_STORAGE_KEY)
    } catch {
      // Ignore a broken storage implementation.
    }
    return null
  }
}

export function saveWaitlistEmail(email: string): WaitlistSignup | null {
  const normalized = normalizeEmail(email)
  if (!normalized) return null
  const signup: WaitlistSignup = { email: normalized, savedAt: Date.now() }
  const storage = browserLocalStorage()
  if (!storage) return null
  try {
    storage.setItem(WAITLIST_STORAGE_KEY, JSON.stringify(signup))
  } catch {
    return null
  }
  return signup
}
