import { Link } from 'react-router-dom'
import { Disclaimer } from '../components/Disclaimer'
import { useQuiz } from '../context/QuizContext'
import { getQuestionsByIds } from '../data/bank'
import { PASS_THRESHOLD, TOPIC_LABELS } from '../data/topics'
import { letterForIndex } from '../lib/quiz'
import btn from '../components/Buttons.module.css'
import styles from './Results.module.css'

export function Results() {
  const { result, startRetry, retake } = useQuiz()

  if (!result) {
    return (
      <div>
        <h1>No results yet</h1>
        <p className={styles.sub} style={{ margin: '0.75rem 0 1rem' }}>
          Finish a practice session or practice test to see your score here.
        </p>
        <Link className={btn.primary} to="/">
          Home
        </Link>
      </div>
    )
  }

  const questions = getQuestionsByIds(result.questionIds)
  const questionMap = new Map(questions.map((question) => [question.id, question]))
  const passLine = Math.round(PASS_THRESHOLD * 100)
  const modeLabel =
    result.mode === 'test' ? 'Practice test' : result.mode === 'retry' ? 'Retry missed' : 'Practice'

  return (
    <div>
      <p className={styles.sub}>{modeLabel}</p>
      <div className={styles.scoreHero}>
        <div>
          <div className={styles.big}>{result.scorePercent}%</div>
          <p className={styles.sub}>
            {result.correctCount} of {result.total} correct
          </p>
        </div>
        {result.mode === 'test' && result.passed !== null ? (
          <span className={`${styles.badge} ${result.passed ? styles.pass : styles.fail}`}>
            {result.passed ? `Pass · ${passLine}% required` : `Fail · ${passLine}% required`}
          </span>
        ) : null}
      </div>
      <Disclaimer />

      <section className={styles.section}>
        <h2>Breakdown by topic</h2>
        {result.breakdown.map((row) => {
          const pct = row.asked === 0 ? 0 : Math.round((row.correct / row.asked) * 100)
          return (
            <div className={styles.row} key={row.topicId}>
              <span>{TOPIC_LABELS[row.topicId]}</span>
              <span>
                {row.correct}/{row.asked} · {pct}%
              </span>
              <div className={styles.barWrap}>
                <div className={styles.bar} style={{ width: `${pct}%` }} />
              </div>
            </div>
          )
        })}
      </section>

      <section className={styles.section}>
        <h2>Missed questions ({result.missed.length})</h2>
        {result.missed.length === 0 ? (
          <p className={styles.sub}>Nice work. Nothing missed in this session.</p>
        ) : (
          <div className={styles.missed}>
            {result.missed.map((item) => {
              const question = questionMap.get(item.questionId)
              if (!question) return null
              const selected =
                item.selectedIndex === null
                  ? 'No answer'
                  : `${letterForIndex(item.selectedIndex)}. ${question.choices[item.selectedIndex]}`
              const correct = `${letterForIndex(question.correctIndex)}. ${question.choices[question.correctIndex]}`
              return (
                <article className={styles.missedCard} key={item.questionId}>
                  <p className={styles.missedStem}>{question.stem}</p>
                  <p className={styles.you}>Your answer: {selected}</p>
                  <p className={styles.correct}>Correct: {correct}</p>
                  <p className={styles.explain}>{question.explanation}</p>
                  <p className={styles.reference}>
                    <span>Reference.</span> {question.reference}
                  </p>
                </article>
              )
            })}
          </div>
        )}
      </section>

      <div className={styles.actions}>
        {result.missed.length > 0 ? (
          <button
            type="button"
            className={btn.primary}
            onClick={() => startRetry(result.missed.map((item) => item.questionId))}
          >
            Retry missed
          </button>
        ) : null}
        <button type="button" className={btn.secondary} onClick={retake}>
          Retake
        </button>
        <Link className={btn.ghost} to="/">
          Home
        </Link>
      </div>
    </div>
  )
}
