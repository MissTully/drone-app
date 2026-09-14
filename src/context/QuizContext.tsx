import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useNavigate } from 'react-router-dom'
import { QUESTION_BANK, getQuestionsByIds } from '../data/bank'
import {
  RESULT_STORAGE_KEY,
  SESSION_STORAGE_KEY,
  TEST_DURATION_MS,
} from '../data/topics'
import { pickPracticeQuestions, pickTestQuestions, scoreSession } from '../lib/quiz'
import { recordPracticeScore, recordTestScore } from '../lib/storage'
import type { QuizMode, QuizResult, QuizSession, TopicId } from '../types'

type QuizContextValue = {
  session: QuizSession | null
  result: QuizResult | null
  startPractice: (topicId: TopicId, options?: { resume?: boolean }) => void
  startTest: (options?: { resume?: boolean }) => void
  startRetry: (questionIds: string[]) => void
  retake: () => void
  setCurrentIndex: (index: number) => void
  selectAnswer: (choiceIndex: number) => void
  submitQuiz: () => void
}

const QuizContext = createContext<QuizContextValue | null>(null)

function isSession(value: unknown): value is QuizSession {
  if (typeof value !== 'object' || value === null) return false
  const session = value as QuizSession
  return (
    Array.isArray(session.questionIds) &&
    Array.isArray(session.answers) &&
    typeof session.currentIndex === 'number' &&
    typeof session.startedAt === 'number' &&
    (session.mode === 'practice' || session.mode === 'test' || session.mode === 'retry')
  )
}

function isResult(value: unknown): value is QuizResult {
  if (typeof value !== 'object' || value === null) return false
  const result = value as QuizResult
  return Array.isArray(result.questionIds) && typeof result.scorePercent === 'number'
}

function readSession(): QuizSession | null {
  try {
    const raw = sessionStorage.getItem(SESSION_STORAGE_KEY)
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    return isSession(parsed) ? parsed : null
  } catch {
    return null
  }
}

function readResult(): QuizResult | null {
  try {
    const raw = sessionStorage.getItem(RESULT_STORAGE_KEY)
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    return isResult(parsed) ? parsed : null
  } catch {
    return null
  }
}

function persistSession(session: QuizSession | null) {
  if (!session) sessionStorage.removeItem(SESSION_STORAGE_KEY)
  else sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session))
}

function persistResult(result: QuizResult | null) {
  if (!result) sessionStorage.removeItem(RESULT_STORAGE_KEY)
  else sessionStorage.setItem(RESULT_STORAGE_KEY, JSON.stringify(result))
}

function makeSession(
  mode: QuizMode,
  questionIds: string[],
  topicId?: TopicId,
): QuizSession {
  return {
    mode,
    topicId,
    questionIds,
    answers: questionIds.map(() => null),
    currentIndex: 0,
    startedAt: Date.now(),
    durationMs: mode === 'test' ? TEST_DURATION_MS : null,
    status: 'active',
  }
}

export function QuizProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const [session, setSession] = useState<QuizSession | null>(() => readSession())
  const [result, setResult] = useState<QuizResult | null>(() => readResult())

  const updateSession = useCallback((next: QuizSession | null) => {
    setSession(next)
    persistSession(next)
  }, [])

  const startPractice = useCallback(
    (topicId: TopicId, options?: { resume?: boolean }) => {
      if (options?.resume) {
        const existing = readSession()
        if (
          existing?.status === 'active' &&
          existing.mode === 'practice' &&
          existing.topicId === topicId
        ) {
          updateSession(existing)
          void navigate(`/practice/${topicId}`)
          return
        }
      }
      const questions = pickPracticeQuestions(QUESTION_BANK, topicId)
      const next = makeSession('practice', questions.map((q) => q.id), topicId)
      updateSession(next)
      persistResult(null)
      setResult(null)
      void navigate(`/practice/${topicId}`)
    },
    [navigate, updateSession],
  )

  const startTest = useCallback(
    (options?: { resume?: boolean }) => {
      if (options?.resume) {
        const existing = readSession()
        if (existing?.status === 'active' && existing.mode === 'test') {
          updateSession(existing)
          void navigate('/test')
          return
        }
      }
      const questions = pickTestQuestions(QUESTION_BANK)
      const next = makeSession(
        'test',
        questions.map((q) => q.id),
      )
      updateSession(next)
      persistResult(null)
      setResult(null)
      void navigate('/test')
    },
    [navigate, updateSession],
  )

  const startRetry = useCallback(
    (questionIds: string[]) => {
      const next = makeSession('retry', questionIds)
      updateSession(next)
      persistResult(null)
      setResult(null)
      void navigate('/retry')
    },
    [navigate, updateSession],
  )

  const retake = useCallback(() => {
    if (!session && !result) return
    const mode = session?.mode ?? result?.mode
    const topicId = session?.topicId ?? result?.topicId
    if (mode === 'test') startTest()
    else if (mode === 'retry' && (session?.questionIds ?? result?.questionIds)) {
      startRetry(session?.questionIds ?? result?.questionIds ?? [])
    } else if (topicId) startPractice(topicId)
  }, [result, session, startPractice, startRetry, startTest])

  const setCurrentIndex = useCallback(
    (index: number) => {
      if (!session) return
      const clamped = Math.max(0, Math.min(index, session.questionIds.length - 1))
      updateSession({ ...session, currentIndex: clamped })
    },
    [session, updateSession],
  )

  const selectAnswer = useCallback(
    (choiceIndex: number) => {
      if (!session || session.status !== 'active') return
      const answers = [...session.answers]
      answers[session.currentIndex] = choiceIndex
      updateSession({ ...session, answers })
    },
    [session, updateSession],
  )

  const submitQuiz = useCallback(() => {
    const active = session
    if (!active) return
    const questions = getQuestionsByIds(active.questionIds)
    const scored = scoreSession(questions, active.answers)
    const nextResult: QuizResult = {
      ...scored,
      mode: active.mode,
      topicId: active.topicId,
      submittedAt: Date.now(),
      passed: active.mode === 'test' ? scored.passed : null,
    }

    if (active.mode === 'test') {
      recordTestScore(nextResult.scorePercent, nextResult.breakdown)
    } else {
      recordPracticeScore(nextResult.scorePercent, nextResult.breakdown)
    }

    const submitted: QuizSession = { ...active, status: 'submitted' }
    updateSession(submitted)
    setResult(nextResult)
    persistResult(nextResult)
    void navigate('/results')
  }, [navigate, session, updateSession])

  const value = useMemo(
    () => ({
      session,
      result,
      startPractice,
      startTest,
      startRetry,
      retake,
      setCurrentIndex,
      selectAnswer,
      submitQuiz,
    }),
    [
      result,
      retake,
      selectAnswer,
      session,
      setCurrentIndex,
      startPractice,
      startRetry,
      startTest,
      submitQuiz,
    ],
  )

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>
}

export function useQuiz() {
  const ctx = useContext(QuizContext)
  if (!ctx) throw new Error('useQuiz must be used within QuizProvider')
  return ctx
}
