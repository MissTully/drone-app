import type { Progress, TopicId } from '../types'
import { PROGRESS_STORAGE_KEY } from '../data/topics'

const emptyProgress = (): Progress => ({
  version: 1,
  lastPracticeScore: null,
  bestTestScore: null,
  lastTestScore: null,
  topicStats: {},
})

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function parseProgress(value: unknown): Progress | null {
  if (!isRecord(value) || value.version !== 1) return null

  const lastPracticeScore =
    value.lastPracticeScore === null || typeof value.lastPracticeScore === 'number'
      ? value.lastPracticeScore
      : null
  const bestTestScore =
    value.bestTestScore === null || typeof value.bestTestScore === 'number'
      ? value.bestTestScore
      : null
  const lastTestScore =
    value.lastTestScore === null || typeof value.lastTestScore === 'number'
      ? value.lastTestScore
      : null

  const topicStats: Progress['topicStats'] = {}
  if (isRecord(value.topicStats)) {
    for (const [key, stat] of Object.entries(value.topicStats)) {
      if (
        isRecord(stat) &&
        typeof stat.attempted === 'number' &&
        typeof stat.correct === 'number'
      ) {
        topicStats[key as TopicId] = {
          attempted: stat.attempted,
          correct: stat.correct,
        }
      }
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
  if (typeof localStorage === 'undefined') return emptyProgress()
  try {
    const raw = localStorage.getItem(PROGRESS_STORAGE_KEY)
    if (!raw) return emptyProgress()
    return parseProgress(JSON.parse(raw)) ?? emptyProgress()
  } catch {
    return emptyProgress()
  }
}

export function saveProgress(progress: Progress): void {
  localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress))
}

export function recordPracticeScore(
  scorePercent: number,
  perTopic: Array<{ topicId: TopicId; asked: number; correct: number }>,
): Progress {
  const progress = loadProgress()
  progress.lastPracticeScore = scorePercent
  applyTopicStats(progress, perTopic)
  saveProgress(progress)
  return progress
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
  saveProgress(progress)
  return progress
}

function applyTopicStats(
  progress: Progress,
  perTopic: Array<{ topicId: TopicId; asked: number; correct: number }>,
): void {
  for (const row of perTopic) {
    const existing = progress.topicStats[row.topicId] ?? { attempted: 0, correct: 0 }
    progress.topicStats[row.topicId] = {
      attempted: existing.attempted + row.asked,
      correct: existing.correct + row.correct,
    }
  }
}
