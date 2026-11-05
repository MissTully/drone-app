import { describe, expect, it } from 'vitest'
import { QUESTION_BANK } from '../src/data/bank'
import { getModule } from '../src/data/modules'
import { PASS_THRESHOLD, TOPIC_IDS } from '../src/data/topics'
import { ENFORCE_FREE_LIMITS } from '../src/lib/entitlements'
import { youtubeNocookieEmbedUrl } from '../src/lib/embed'
import { pickPracticeQuestions, pickTestQuestions, scoreSession } from '../src/lib/quiz'

describe('study and timed test smoke', () => {
  it('keeps nine modules and the 225-question bank', () => {
    expect(ENFORCE_FREE_LIMITS).toBe(false)
    expect(QUESTION_BANK).toHaveLength(225)
    for (const topicId of TOPIC_IDS) {
      const topicQuestions = QUESTION_BANK.filter((question) => question.topic === topicId)
      expect(topicQuestions).toHaveLength(25)
      const mod = getModule(topicId)
      expect(mod.quiz).toHaveLength(3)
      expect(youtubeNocookieEmbedUrl(mod.youtubeVideoId)).toMatch(
        /^https:\/\/www\.youtube-nocookie\.com\/embed\/[A-Za-z0-9_-]{11}$/,
      )
    }
  })

  it('draws a 60-question timed test across the topics', () => {
    const picked = pickTestQuestions(QUESTION_BANK)
    expect(picked).toHaveLength(60)
    expect(new Set(picked.map((question) => question.id)).size).toBe(60)
    expect(new Set(picked.map((question) => question.topic)).size).toBe(TOPIC_IDS.length)
  })

  it('passes a timed-style score at 70 percent and fails below it', () => {
    const questions = QUESTION_BANK.slice(0, 10)
    const passing = questions.map((question, index) =>
      index < 7 ? question.correctIndex : question.correctIndex === 0 ? 1 : 0,
    )
    const failing = questions.map((question, index) =>
      index < 6 ? question.correctIndex : question.correctIndex === 0 ? 1 : 0,
    )
    expect(scoreSession(questions, passing).passed).toBe(true)
    expect(scoreSession(questions, passing).scorePercent).toBe(70)
    expect(scoreSession(questions, failing).passed).toBe(false)
    expect(PASS_THRESHOLD).toBe(0.7)
    expect(pickPracticeQuestions(QUESTION_BANK, 'regulations')).toHaveLength(25)
  })
})
