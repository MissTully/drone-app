export const TOPIC_IDS = [
  'regulations',
  'airspace',
  'weather',
  'loading-performance',
  'operations-emergency',
  'airport-operations',
  'radio',
  'maintenance-preflight',
  'human-factors-adm',
] as const

export type TopicId = (typeof TOPIC_IDS)[number]

export type Difficulty = 'easy' | 'medium' | 'hard'

export type Question = {
  id: string
  topic: TopicId
  stem: string
  choices: [string, string, string, string]
  correctIndex: 0 | 1 | 2 | 3
  explanation: string
  difficulty: Difficulty
}

export type TopicStat = {
  attempted: number
  correct: number
}

export type Progress = {
  version: 1
  lastPracticeScore: number | null
  bestTestScore: number | null
  lastTestScore: number | null
  topicStats: Partial<Record<TopicId, TopicStat>>
}

export type QuizMode = 'practice' | 'test' | 'retry'

export type QuizSession = {
  mode: QuizMode
  topicId?: TopicId
  questionIds: string[]
  answers: Array<number | null>
  currentIndex: number
  startedAt: number
  durationMs: number | null
  status: 'active' | 'submitted'
}

export type TopicBreakdown = {
  topicId: TopicId
  asked: number
  correct: number
}

export type MissedQuestion = {
  questionId: string
  selectedIndex: number | null
}

export type QuizResult = {
  mode: QuizMode
  topicId?: TopicId
  questionIds: string[]
  answers: Array<number | null>
  correctCount: number
  total: number
  scorePercent: number
  passed: boolean | null
  breakdown: TopicBreakdown[]
  missed: MissedQuestion[]
  submittedAt: number
}
