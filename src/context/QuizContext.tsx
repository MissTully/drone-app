import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useNavigate } from 'react-router-dom'
import { QUESTION_BANK, knownQuestionIds, questionsForIds } from '../data/bank'
import { TEST_DURATION_MS } from '../data/topics'
import { loadResult, loadSession, writeResult, writeSession } from '../lib/persistedQuiz'
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
  const [session, setSession] = useState<QuizSession | null>(() => loadSession())
  const [result, setResult] = useState<QuizResult | null>(() => loadResult())

  const updateSession = useCallback((next: QuizSession | null) => {
    setSession(next)
    writeSession(next)
  }, [])

  const startPractice = useCallback(
    (topicId: TopicId, options?: { resume?: boolean }) => {
      if (options?.resume) {
        const existing = loadSession()
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
      writeResult(null)
      setResult(null)
      void navigate(`/practice/${topicId}`)
    },
    [navigate, updateSession],
  )

  const startTest = useCallback(
    (options?: { resume?: boolean }) => {
      if (options?.resume) {
        const existing = loadSession()
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
      writeResult(null)
      setResult(null)
      void navigate('/test')
    },
    [navigate, updateSession],
  )

  const startRetry = useCallback(
    (questionIds: string[]) => {
      const ids = knownQuestionIds(questionIds)
      if (ids.length === 0) return
      const next = makeSession('retry', ids)
      updateSession(next)
      writeResult(null)
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
      if (!Number.isInteger(choiceIndex) || choiceIndex < 0 || choiceIndex > 3) return
      const answers = [...session.answers]
      answers[session.currentIndex] = choiceIndex
      updateSession({ ...session, answers })
    },
    [session, updateSession],
  )

  const submitQuiz = useCallback(() => {
    const active = session
    if (!active) return
    const questions = questionsForIds(active.questionIds)
    if (!questions) {
      updateSession(null)
      writeResult(null)
      setResult(null)
      return
    }
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
    writeResult(nextResult)
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
