import { Link } from 'react-router-dom'
import { Disclaimer } from '../components/Disclaimer'
import { useQuiz } from '../context/QuizContext'
import { QUESTION_BANK } from '../data/bank'
import { TOPICS, TOPIC_LABELS } from '../data/topics'
import { loadProgress } from '../lib/storage'
import type { TopicId } from '../types'
import btn from '../components/Buttons.module.css'
import styles from './Home.module.css'

function formatScore(value: number | null): string {
  return value === null ? '—' : `${value}%`
}

export function Home() {
  const { startTest } = useQuiz()
  const progress = loadProgress()
  const topicRows = TOPICS.map((topic) => {
    const stat = progress.topicStats[topic.id]
    const accuracy =
      stat && stat.attempted > 0 ? Math.round((stat.correct / stat.attempted) * 100) : null
    return { ...topic, attempted: stat?.attempted ?? 0, accuracy }
  })

  return (
    <div>
      <section className={styles.hero}>
        <p className={styles.kicker}>FAA Part 107 · Commercial sUAS</p>
        <h1 className={styles.title}>Remote Possibilities</h1>
        <p className={styles.lede}>
          Study with topic drills and full-length practice tests. Learn with topic modules, drill
          the 225-question bank, then sit a 60-question timed exam with a 70% pass line. Progress
          stays on this device.
        </p>
        <Disclaimer />
      </section>

      <section className={styles.modes} aria-label="Study modes">
        <article className={styles.card}>
          <h2>Study modules</h2>
          <p className={`${styles.meta} ${styles.grow}`}>
            Open the Modules section and pick a topic from the dropdown. Video, notes, and a
            3-question check — separate from Practice.
          </p>
          <Link className={btn.primary} to="/modules">
            Open modules
          </Link>
        </article>
        <article className={styles.card}>
          <h2>Practice by topic</h2>
          <p className={`${styles.meta} ${styles.grow}`}>
            Pick one of nine ACS-aligned topics. Each session uses all 25 questions for that topic,
            with feedback after every answer.
          </p>
          <Link className={btn.primary} to="/practice">
            Choose a topic
          </Link>
        </article>
        <article className={styles.card}>
          <h2>Practice test</h2>
          <p className={`${styles.meta} ${styles.grow}`}>
            60 mixed questions, 2-hour countdown, no hints until the end. Pass at 70% or better.
            Bank size: {QUESTION_BANK.length} unique items.
          </p>
          <button type="button" className={btn.primary} onClick={() => startTest()}>
            Start 60-question test
          </button>
        </article>
      </section>

      <h2>Scores</h2>
      <div className={styles.scores}>
        <div className={styles.stat}>
          <div className={styles.statLabel}>Last practice</div>
          <div className={styles.statValue}>{formatScore(progress.lastPracticeScore)}</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statLabel}>Last test</div>
          <div className={styles.statValue}>{formatScore(progress.lastTestScore)}</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statLabel}>Best test</div>
          <div className={styles.statValue}>{formatScore(progress.bestTestScore)}</div>
        </div>
      </div>

      <h2>Topic progress</h2>
      <div className={styles.topics}>
        {topicRows.map((row) => (
          <div className={styles.topicRow} key={row.id}>
            <span>{TOPIC_LABELS[row.id as TopicId]}</span>
            <span className={styles.muted}>
              {row.attempted === 0 ? 'No attempts yet' : `${row.accuracy}% · ${row.attempted} answered`}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
