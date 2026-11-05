import { getQuestionMap, questionsForIds } from '../data/bank'
import { RESULT_STORAGE_KEY, SESSION_STORAGE_KEY, TEST_DURATION_MS, TOPIC_IDS } from '../data/topics'
import type { QuizResult, QuizSession, TopicId } from '../types'

const SESSION_MAX_BYTES = 16_384
const RESULT_MAX_BYTES = 32_768
const CLOCK_SKEW_MS = 60_000

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function browserSessionStorage(): Storage | null {
  try {
    const storage = globalThis.sessionStorage
    if (!storage || typeof storage.getItem !== 'function') return null
    return storage
  } catch {
    return null
  }
}

function isTopicId(value: unknown): value is TopicId {
  return typeof value === 'string' && TOPIC_IDS.includes(value as TopicId)
}

function readAnswers(value: unknown, count: number): Array<number | null> | null {
  if (!Array.isArray(value) || value.length !== count) return null
  const answers: Array<number | null> = []
  for (const answer of value) {
    if (answer === null) {
      answers.push(null)
      continue
    }
    if (typeof answer !== 'number' || !Number.isInteger(answer) || answer < 0 || answer > 3) {
      return null
    }
    answers.push(answer)
  }
  return answers
}

export function parseStoredSession(value: unknown, now = Date.now()): QuizSession | null {
  if (!isRecord(value)) return null
  if (value.mode !== 'practice' && value.mode !== 'test' && value.mode !== 'retry') return null
  if (!Array.isArray(value.questionIds) || value.questionIds.some((id) => typeof id !== 'string')) {
    return null
  }
  const questionIds = value.questionIds
  if (questionIds.length === 0 || questionIds.length > 60) return null
  if (new Set(questionIds).size !== questionIds.length) return null
  if (!questionsForIds(questionIds)) return null

  const answers = readAnswers(value.answers, questionIds.length)
  if (!answers) return null
  if (
    typeof value.currentIndex !== 'number' ||
    !Number.isInteger(value.currentIndex) ||
    value.currentIndex < 0 ||
    value.currentIndex >= questionIds.length
  ) {
    return null
  }
  if (typeof value.startedAt !== 'number' || !Number.isFinite(value.startedAt)) return null
  if (value.startedAt > now + CLOCK_SKEW_MS) return null
  if (value.status !== 'active' && value.status !== 'submitted') return null

  let topicId: TopicId | undefined
  if (value.topicId !== undefined) {
    if (!isTopicId(value.topicId)) return null
    topicId = value.topicId
  }
  if (value.mode === 'practice' && !topicId) return null
  if (value.mode === 'test') {
    if (value.durationMs !== TEST_DURATION_MS) return null
  } else if (value.durationMs !== null) {
    return null
  }

  return {
    mode: value.mode,
    topicId,
    questionIds,
    answers,
    currentIndex: value.currentIndex,
    startedAt: value.startedAt,
    durationMs: value.mode === 'test' ? TEST_DURATION_MS : null,
    status: value.status,
  }
}

export function parseStoredResult(value: unknown, now = Date.now()): QuizResult | null {
  if (!isRecord(value)) return null
  if (value.mode !== 'practice' && value.mode !== 'test' && value.mode !== 'retry') return null
  if (!Array.isArray(value.questionIds) || value.questionIds.some((id) => typeof id !== 'string')) {
    return null
  }
  const questionIds = value.questionIds
  if (questionIds.length === 0 || questionIds.length > 60) return null
  if (new Set(questionIds).size !== questionIds.length) return null
  const questions = questionsForIds(questionIds)
  if (!questions) return null
  const answers = readAnswers(value.answers, questionIds.length)
  if (!answers) return null
  if (
    typeof value.correctCount !== 'number' ||
    typeof value.total !== 'number' ||
    !Number.isInteger(value.correctCount) ||
    !Number.isInteger(value.total) ||
    value.total !== questionIds.length ||
    value.correctCount < 0 ||
    value.correctCount > value.total
  ) {
    return null
  }

  let correct = 0
  questions.forEach((question, index) => {
    if (answers[index] === question.correctIndex) correct += 1
  })
  const scorePercent = value.total === 0 ? 0 : Math.round((correct / value.total) * 100)
  if (correct !== value.correctCount || value.scorePercent !== scorePercent) return null
  if (value.passed !== null && typeof value.passed !== 'boolean') return null
  if (typeof value.submittedAt !== 'number' || !Number.isFinite(value.submittedAt)) return null
  if (value.submittedAt < Date.UTC(2020, 0, 1) || value.submittedAt > now + 86_400_000) return null

  let topicId: TopicId | undefined
  if (value.topicId !== undefined) {
    if (!isTopicId(value.topicId)) return null
    topicId = value.topicId
  }

  if (!Array.isArray(value.breakdown) || value.breakdown.length > TOPIC_IDS.length) return null
  const breakdown: QuizResult['breakdown'] = []
  for (const row of value.breakdown) {
    if (!isRecord(row) || !isTopicId(row.topicId)) return null
    if (typeof row.asked !== 'number' || typeof row.correct !== 'number') return null
    if (!Number.isInteger(row.asked) || !Number.isInteger(row.correct)) return null
    if (row.asked < 0 || row.correct < 0 || row.correct > row.asked || row.asked > 60) return null
    breakdown.push({ topicId: row.topicId, asked: row.asked, correct: row.correct })
  }

  if (!Array.isArray(value.missed) || value.missed.length > questionIds.length) return null
  const allowedIds = new Set(questionIds)
  const missed: QuizResult['missed'] = []
  for (const item of value.missed) {
    if (!isRecord(item) || typeof item.questionId !== 'string' || !allowedIds.has(item.questionId)) {
      return null
    }
    if (item.selectedIndex === null) {
      missed.push({ questionId: item.questionId, selectedIndex: null })
      continue
    }
    if (
      typeof item.selectedIndex !== 'number' ||
      !Number.isInteger(item.selectedIndex) ||
      item.selectedIndex < 0 ||
      item.selectedIndex > 3
    ) {
      return null
    }
    missed.push({ questionId: item.questionId, selectedIndex: item.selectedIndex })
  }

  const map = getQuestionMap()
  if (questionIds.some((id) => !map.has(id))) return null

  return {
    mode: value.mode,
    topicId,
    questionIds,
    answers,
    correctCount: correct,
    total: value.total,
    scorePercent,
    passed: value.passed,
    breakdown,
    missed,
    submittedAt: value.submittedAt,
  }
}

function readRaw(storage: Storage, key: string, maxBytes: number): unknown {
  const raw = storage.getItem(key)
  if (!raw) return undefined
  if (raw.length > maxBytes) {
    storage.removeItem(key)
    return undefined
  }
  try {
    return JSON.parse(raw)
  } catch {
    storage.removeItem(key)
    return undefined
  }
}

export function loadSession(): QuizSession | null {
  const storage = browserSessionStorage()
  if (!storage) return null
  try {
    const parsed = readRaw(storage, SESSION_STORAGE_KEY, SESSION_MAX_BYTES)
    if (parsed === undefined) return null
    const session = parseStoredSession(parsed)
    if (!session) storage.removeItem(SESSION_STORAGE_KEY)
    return session
  } catch {
    return null
  }
}

export function loadResult(): QuizResult | null {
  const storage = browserSessionStorage()
  if (!storage) return null
  try {
    const parsed = readRaw(storage, RESULT_STORAGE_KEY, RESULT_MAX_BYTES)
    if (parsed === undefined) return null
    const result = parseStoredResult(parsed)
    if (!result) storage.removeItem(RESULT_STORAGE_KEY)
    return result
  } catch {
    return null
  }
}

export function writeSession(session: QuizSession | null): void {
  const storage = browserSessionStorage()
  if (!storage) return
  try {
    if (!session || !parseStoredSession(session)) {
      storage.removeItem(SESSION_STORAGE_KEY)
      return
    }
    storage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session))
  } catch {
    // Ignore quota failures.
  }
}

export function writeResult(result: QuizResult | null): void {
  const storage = browserSessionStorage()
  if (!storage) return
  try {
    if (!result || !parseStoredResult(result)) {
      storage.removeItem(RESULT_STORAGE_KEY)
      return
    }
    storage.setItem(RESULT_STORAGE_KEY, JSON.stringify(result))
  } catch {
    // Ignore quota failures.
  }
}
