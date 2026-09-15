import { Link } from 'react-router-dom'
import { Disclaimer } from '../components/Disclaimer'
import { ExamReadyBanner } from '../components/ExamReadyBanner'
import { useQuiz } from '../context/QuizContext'
import { QUESTION_BANK } from '../data/bank'
import { TOPICS } from '../data/topics'
import { loadProgress } from '../lib/storage'
import btn from '../components/Buttons.module.css'
import styles from './TopicPicker.module.css'

export function TopicPicker() {
  const { startPractice } = useQuiz()
  const progress = loadProgress()

  return (
    <div>
      <h1 className={styles.title}>Practice by topic</h1>
      <p className={styles.lede}>
        Questions are shuffled. Each session uses all 25 items from the selected topic, with
        feedback after each answer.
      </p>
      <div style={{ margin: '1rem 0', display: 'grid', gap: '0.75rem' }}>
        <Disclaimer compact />
        <ExamReadyBanner>
          Exam Ready unlocks the full 225-question bank, full rationales, and unlimited retry of
          missed questions.
        </ExamReadyBanner>
      </div>
      <div className={styles.grid}>
        {TOPICS.map((topic) => {
          const count = QUESTION_BANK.filter((q) => q.topic === topic.id).length
          const stat = progress.topicStats[topic.id]
          const accuracy =
            stat && stat.attempted > 0 ? Math.round((stat.correct / stat.attempted) * 100) : null
          return (
            <button
              key={topic.id}
              type="button"
              className={styles.card}
              onClick={() => startPractice(topic.id)}
            >
              <span className={styles.label}>{topic.label}</span>
              <span className={styles.blurb}>{topic.blurb}</span>
              <span className={styles.meta}>
                {count} questions
                {accuracy !== null ? ` · ${accuracy}% so far` : ''}
              </span>
            </button>
          )
        })}
      </div>
      <p style={{ marginTop: '1.25rem' }}>
        <Link className={btn.ghost} to="/">
          Back home
        </Link>
      </p>
    </div>
  )
}
