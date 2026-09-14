import type { Question, QuizResult, TopicBreakdown, TopicId } from '../types'
import {
  PASS_THRESHOLD,
  PRACTICE_SESSION_SIZE,
  TEST_QUESTION_COUNT,
  TOPIC_IDS,
} from '../data/topics'

export function shuffle<T>(items: T[]): T[] {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    const current = copy[i]
    const swap = copy[j]
    if (current === undefined || swap === undefined) continue
    copy[i] = swap
    copy[j] = current
  }
  return copy
}

export function questionsByTopic(bank: Question[]): Record<TopicId, Question[]> {
  const grouped = Object.fromEntries(TOPIC_IDS.map((id) => [id, [] as Question[]])) as Record<
    TopicId,
    Question[]
  >
  for (const question of bank) {
    grouped[question.topic].push(question)
  }
  return grouped
}

export function pickPracticeQuestions(bank: Question[], topicId: TopicId): Question[] {
  const pool = bank.filter((question) => question.topic === topicId)
  return shuffle(pool).slice(0, PRACTICE_SESSION_SIZE)
}

export function pickTestQuestions(
  bank: Question[],
  target = TEST_QUESTION_COUNT,
): Question[] {
  if (bank.length <= target) return shuffle(bank)

  const grouped = questionsByTopic(bank)
  const topics = TOPIC_IDS.filter((id) => grouped[id].length > 0)
  const total = topics.reduce((sum, id) => sum + grouped[id].length, 0)

  const rows = topics.map((id) => {
    const count = grouped[id].length
    const exact = (target * count) / total
    const take = Math.floor(exact)
    return { id, count, exact, take, frac: exact - take }
  })

  let allocated = rows.reduce((sum, row) => sum + row.take, 0)
  const sorted = [...rows].sort((a, b) => b.frac - a.frac || b.count - a.count)

  for (const row of sorted) {
    if (allocated >= target) break
    if (row.take < row.count) {
      row.take += 1
      allocated += 1
    }
  }

  const selected: Question[] = []
  for (const row of rows) {
    selected.push(...shuffle(grouped[row.id]).slice(0, row.take))
  }

  return shuffle(selected)
}

export function scoreSession(
  questions: Question[],
  answers: Array<number | null>,
): Omit<QuizResult, 'mode' | 'topicId' | 'submittedAt'> {
  const missed: QuizResult['missed'] = []
  const byTopic = new Map<TopicId, { asked: number; correct: number }>()

  let correctCount = 0
  questions.forEach((question, index) => {
    const selected = answers[index] ?? null
    const isCorrect = selected === question.correctIndex
    if (isCorrect) correctCount += 1
    else missed.push({ questionId: question.id, selectedIndex: selected })

    const current = byTopic.get(question.topic) ?? { asked: 0, correct: 0 }
    current.asked += 1
    if (isCorrect) current.correct += 1
    byTopic.set(question.topic, current)
  })

  const total = questions.length
  const scorePercent = total === 0 ? 0 : Math.round((correctCount / total) * 100)
  const breakdown: TopicBreakdown[] = TOPIC_IDS.filter((id) => byTopic.has(id)).map((id) => {
    const row = byTopic.get(id) ?? { asked: 0, correct: 0 }
    return { topicId: id, asked: row.asked, correct: row.correct }
  })

  return {
    questionIds: questions.map((question) => question.id),
    answers,
    correctCount,
    total,
    scorePercent,
    passed: total === 0 ? false : correctCount / total >= PASS_THRESHOLD,
    breakdown,
    missed,
  }
}

export function remainingMs(startedAt: number, durationMs: number, now = Date.now()): number {
  return Math.max(0, startedAt + durationMs - now)
}

export function formatClock(ms: number): string {
  const totalSeconds = Math.ceil(ms / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  const pad = (value: number) => String(value).padStart(2, '0')
  if (hours > 0) return `${hours}:${pad(minutes)}:${pad(seconds)}`
  return `${pad(minutes)}:${pad(seconds)}`
}

export function letterForIndex(index: number): string {
  return String.fromCharCode(65 + index)
}
