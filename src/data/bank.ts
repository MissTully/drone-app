import type { Question } from '../types'
import { TOPIC_IDS } from './topics'
import rawQuestions from './questions.json' with { type: 'json' }

function isQuestion(value: unknown): value is Question {
  if (typeof value !== 'object' || value === null) return false
  const q = value as Record<string, unknown>
  return (
    typeof q.id === 'string' &&
    TOPIC_IDS.includes(q.topic as Question['topic']) &&
    typeof q.stem === 'string' &&
    Array.isArray(q.choices) &&
    q.choices.length === 4 &&
    q.choices.every((choice) => typeof choice === 'string') &&
    typeof q.correctIndex === 'number' &&
    q.correctIndex >= 0 &&
    q.correctIndex <= 3 &&
    typeof q.explanation === 'string' &&
    typeof q.reference === 'string' &&
    q.reference.trim().length > 0 &&
    (q.difficulty === 'easy' || q.difficulty === 'medium' || q.difficulty === 'hard')
  )
}

function loadBank(): Question[] {
  if (!Array.isArray(rawQuestions)) {
    throw new Error('Question bank must be an array')
  }
  const questions = rawQuestions.map((item, index) => {
    if (!isQuestion(item)) {
      throw new Error(`Invalid question at index ${index}`)
    }
    return item
  })

  if (questions.length !== 225) {
    throw new Error(`Question bank has ${questions.length} items; need 225`)
  }

  const ids = new Set<string>()
  for (const question of questions) {
    if (ids.has(question.id)) {
      throw new Error(`Duplicate question id: ${question.id}`)
    }
    ids.add(question.id)
  }

  for (const topicId of TOPIC_IDS) {
    const count = questions.filter((question) => question.topic === topicId).length
    if (count !== 25) {
      throw new Error(`Topic ${topicId} has ${count} questions; need exactly 25`)
    }
  }

  return questions
}

export const QUESTION_BANK: Question[] = loadBank()

export function getQuestionMap(): Map<string, Question> {
  return new Map(QUESTION_BANK.map((question) => [question.id, question]))
}

export function getQuestionsByIds(ids: string[]): Question[] {
  const map = getQuestionMap()
  return ids.map((id) => {
    const question = map.get(id)
    if (!question) throw new Error(`Unknown question id: ${id}`)
    return question
  })
}
