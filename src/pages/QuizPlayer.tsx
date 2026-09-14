import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { Disclaimer } from '../components/Disclaimer'
import { ProgressBar } from '../components/ProgressBar'
import { Timer } from '../components/Timer'
import { useQuiz } from '../context/QuizContext'
import { getQuestionsByIds } from '../data/bank'
import { TOPIC_IDS, TOPIC_LABELS } from '../data/topics'
import { letterForIndex } from '../lib/quiz'
import type { TopicId } from '../types'
import btn from '../components/Buttons.module.css'
import styles from './QuizPlayer.module.css'

function isTopicId(value: string | undefined): value is TopicId {
  return TOPIC_IDS.includes(value as TopicId)
}

export function QuizPlayer() {
  const { topicId } = useParams()
  const location = useLocation()
  const {
    session,
    startPractice,
    startTest,
    selectAnswer,
    setCurrentIndex,
    submitQuiz,
  } = useQuiz()

  const isTest = location.pathname === '/test'
  const isRetry = location.pathname === '/retry'
  const [draft, setDraft] = useState<{ questionId: string; choice: number | null }>({
    questionId: '',
    choice: null,
  })

  const sessionMode = session?.mode
  const sessionStatus = session?.status
  const sessionTopic = session?.topicId

  useEffect(() => {
    if (isTest || isRetry) return
    if (isTopicId(topicId)) {
      if (sessionMode !== 'practice' || sessionTopic !== topicId) {
        startPractice(topicId, { resume: true })
      }
    }
  }, [isRetry, isTest, sessionMode, sessionTopic, startPractice, topicId])

  const questions = useMemo(() => {
    if (!session) return []
    try {
      return getQuestionsByIds(session.questionIds)
    } catch {
      return []
    }
  }, [session])

  if (!isTest && !isRetry && topicId && !isTopicId(topicId)) {
    return (
      <EmptyState
        title="Unknown topic"
        body="Choose one of the nine ACS-aligned topics from the practice list."
      />
    )
  }

  if (isTest && (sessionMode !== 'test' || sessionStatus !== 'active')) {
    return (
      <div>
        <h1 className={styles.stem} style={{ marginTop: 0 }}>
          Practice test
        </h1>
        <p className={styles.meta}>
          60 mixed questions, 2-hour countdown, no hints until results. Pass at 70% or better.
          Unanswered items count as incorrect. The timer submits automatically at 0:00.
        </p>
        <div style={{ margin: '1rem 0' }}>
          <Disclaimer />
        </div>
        <div className={styles.actions}>
          <button type="button" className={btn.primary} onClick={() => startTest()}>
            Begin 60-question test
          </button>
          <Link className={btn.ghost} to="/">
            Home
          </Link>
        </div>
      </div>
    )
  }

  if (isRetry && (!session || session.mode !== 'retry')) {
    return (
      <EmptyState
        title="No missed-question session"
        body="Finish a quiz first, then use Retry missed from the results screen."
      />
    )
  }

  if (!session || questions.length === 0) {
    return (
      <EmptyState
        title="Preparing quiz…"
        body="If this stalls, go home and start a new session."
      />
    )
  }

  const activeSession = session
  const index = activeSession.currentIndex
  const question = questions[index]
  if (!question) {
    return <EmptyState title="Question missing" body="Return home and start again." />
  }

  const pendingChoice = draft.questionId === question.id ? draft.choice : null
  const setPendingChoice = (choice: number | null) => {
    setDraft({ questionId: question.id, choice })
  }

  const total = questions.length
  const savedAnswer = activeSession.answers[index] ?? null
  const showFeedback = activeSession.mode !== 'test' && savedAnswer !== null
  const selected = showFeedback ? savedAnswer : (pendingChoice ?? savedAnswer)
  const unanswered = activeSession.answers.filter((answer) => answer === null).length
  const title = isTest
    ? 'Practice test'
    : isRetry
      ? 'Retry missed'
      : TOPIC_LABELS[question.topic]

  function onCheck() {
    if (pendingChoice === null) return
    selectAnswer(pendingChoice)
  }

  function onContinue() {
    if (index >= total - 1) submitQuiz()
    else setCurrentIndex(index + 1)
  }

  function onSubmitTest() {
    if (unanswered > 0) {
      const confirmed = window.confirm(
        `Submit with ${unanswered} unanswered question${unanswered === 1 ? '' : 's'}? Unanswered items count as incorrect.`,
      )
      if (!confirmed) return
    }
    submitQuiz()
  }

  function onSelectChoice(choiceIndex: number) {
    if (activeSession.mode === 'test') {
      selectAnswer(choiceIndex)
      setPendingChoice(choiceIndex)
      return
    }
    if (savedAnswer !== null) return
    setPendingChoice(choiceIndex)
  }

  return (
    <div>
      <div className={styles.top}>
        <div>
          <h1 style={{ fontSize: '1.35rem' }}>{title}</h1>
          <p className={styles.meta}>
            Question {index + 1} of {total}
            {activeSession.mode === 'test' ? ` · ${unanswered} unanswered` : ''}
          </p>
        </div>
        {activeSession.mode === 'test' && activeSession.durationMs ? (
          <Timer startedAt={activeSession.startedAt} durationMs={activeSession.durationMs} onExpire={submitQuiz} />
        ) : null}
      </div>
      <ProgressBar value={index + (showFeedback || activeSession.mode === 'test' ? 1 : 0)} max={total} />
      <p className={styles.stem}>{question.stem}</p>
      <div className={styles.choices} role="listbox" aria-label="Answer choices">
        {question.choices.map((choice, choiceIndex) => {
          const classes = [styles.choice]
          if (selected === choiceIndex) classes.push(styles.choiceSelected)
          if (showFeedback && choiceIndex === question.correctIndex) classes.push(styles.choiceCorrect)
          if (
            showFeedback &&
            savedAnswer === choiceIndex &&
            choiceIndex !== question.correctIndex
          ) {
            classes.push(styles.choiceWrong)
          }
          return (
            <button
              key={choice}
              type="button"
              className={classes.join(' ')}
              onClick={() => onSelectChoice(choiceIndex)}
              disabled={showFeedback}
            >
              <span className={styles.letter}>{letterForIndex(choiceIndex)}</span>
              <span>{choice}</span>
            </button>
          )
        })}
      </div>

      {showFeedback ? (
        <div
          className={`${styles.feedback} ${savedAnswer === question.correctIndex ? styles.ok : styles.no}`}
        >
          <p className={styles.feedbackTitle}>
            {savedAnswer === question.correctIndex ? 'Correct' : 'Incorrect'}
          </p>
          <p>{question.explanation}</p>
        </div>
      ) : null}

      <div className={styles.actions}>
        {activeSession.mode === 'test' ? (
          <>
            <button
              type="button"
              className={btn.secondary}
              onClick={() => setCurrentIndex(index - 1)}
              disabled={index === 0}
            >
              Previous
            </button>
            {index < total - 1 ? (
              <button type="button" className={btn.primary} onClick={() => setCurrentIndex(index + 1)}>
                Next
              </button>
            ) : (
              <button type="button" className={btn.primary} onClick={onSubmitTest}>
                Submit test
              </button>
            )}
            {index < total - 1 ? (
              <button type="button" className={btn.ghost} onClick={onSubmitTest}>
                Submit now
              </button>
            ) : null}
          </>
        ) : showFeedback ? (
          <button type="button" className={btn.primary} onClick={onContinue}>
            {index >= total - 1 ? 'See results' : 'Continue'}
          </button>
        ) : (
          <button
            type="button"
            className={btn.primary}
            onClick={onCheck}
            disabled={pendingChoice === null}
          >
            Check answer
          </button>
        )}
      </div>
      {activeSession.mode === 'test' ? (
        <p className={styles.unanswered}>No feedback until results. Timer auto-submits at 0:00.</p>
      ) : (
        <div style={{ marginTop: '1.25rem' }}>
          <Disclaimer compact />
        </div>
      )}
    </div>
  )
}

function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <h1>{title}</h1>
      <p style={{ color: 'var(--muted)', margin: '0.75rem 0 1rem' }}>{body}</p>
      <Link className={btn.primary} to="/">
        Home
      </Link>
    </div>
  )
}
