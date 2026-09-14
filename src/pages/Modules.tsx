import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Disclaimer } from '../components/Disclaimer'
import { ProgressBar } from '../components/ProgressBar'
import { getModule } from '../data/modules'
import { TOPIC_IDS, TOPICS } from '../data/topics'
import { letterForIndex } from '../lib/quiz'
import type { TopicId } from '../types'
import btn from '../components/Buttons.module.css'
import quizStyles from './QuizPlayer.module.css'
import styles from './Modules.module.css'

const MODULE_VIDEO_NOTE =
  'Videos are third-party YouTube content embedded for study. They are not official FAA training. This app does not download or host the videos.'

function isTopicId(value: string | undefined): value is TopicId {
  return TOPIC_IDS.includes(value as TopicId)
}

export function Modules() {
  const { topicId } = useParams()
  const navigate = useNavigate()
  const selected = isTopicId(topicId) ? topicId : 'regulations'
  const mod = getModule(selected)

  return (
    <div>
      <p className={styles.kicker}>Learn</p>
      <h1 className={styles.title}>Study modules</h1>
      <p className={styles.lede}>
        Pick an ACS topic. Watch the lesson, review key points and vocabulary, then take a short
        three-question check. Module quizzes are separate from the 225-question practice bank.
      </p>
      <div className={styles.stack}>
        <Disclaimer />
        <aside className={styles.note} role="note">
          {MODULE_VIDEO_NOTE}
        </aside>
      </div>

      <label className={styles.picker}>
        <span>Topic</span>
        <select
          value={selected}
          onChange={(event) => navigate(`/modules/${event.target.value}`)}
          aria-label="Select a study module topic"
        >
          {TOPICS.map((topic) => (
            <option key={topic.id} value={topic.id}>
              {topic.label}
            </option>
          ))}
        </select>
      </label>

      {topicId && !isTopicId(topicId) ? (
        <p className={styles.lede}>Unknown topic. Choose one of the nine ACS topics above.</p>
      ) : (
        <article className={styles.module} aria-labelledby="module-heading">
          <h2 id="module-heading">{mod.title}</h2>
          <p className={styles.videoMeta}>
            {mod.youtubeTitle} · {mod.youtubeChannel}
          </p>
          <div className={styles.embedWrap}>
            <iframe
              className={styles.embed}
              title={mod.youtubeTitle}
              src={`https://www.youtube-nocookie.com/embed/${mod.youtubeVideoId}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>

          <section className={styles.section}>
            <h3>Key points</h3>
            <ul>
              {mod.keyPoints.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </section>

          <section className={styles.section}>
            <h3>Vocabulary</h3>
            <dl className={styles.vocab}>
              {mod.vocabulary.map((item) => (
                <div key={item.term}>
                  <dt>{item.term}</dt>
                  <dd>{item.definition}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className={styles.section}>
            <h3>Explanation</h3>
            {mod.explanation.map((paragraph) => (
              <p key={paragraph.slice(0, 48)}>{paragraph}</p>
            ))}
          </section>

          <ModuleQuiz key={mod.topicId} topicId={mod.topicId} />
        </article>
      )}

      <p className={styles.footerLinks}>
        <Link className={btn.ghost} to={`/practice/${selected}`}>
          Practice this topic
        </Link>
        <Link className={btn.ghost} to="/">
          Home
        </Link>
      </p>
    </div>
  )
}

function ModuleQuiz({ topicId }: { topicId: TopicId }) {
  const questions = getModule(topicId).quiz
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<Array<number | null>>([null, null, null])
  const [checked, setChecked] = useState(false)
  const [finished, setFinished] = useState(false)
  const [pending, setPending] = useState<number | null>(null)

  const question = questions[index]
  const saved = answers[index]
  const showFeedback = checked && saved !== null
  const correctCount = questions.filter((item, i) => answers[i] === item.correctIndex).length

  if (!question) return null

  const onCheck = () => {
    if (pending === null) return
    const next = [...answers]
    next[index] = pending
    setAnswers(next)
    setChecked(true)
  }

  const onContinue = () => {
    if (index >= questions.length - 1) {
      setFinished(true)
      return
    }
    setIndex(index + 1)
    setChecked(false)
    setPending(answers[index + 1] ?? null)
  }

  const onRetake = () => {
    setIndex(0)
    setAnswers([null, null, null])
    setChecked(false)
    setFinished(false)
    setPending(null)
  }

  if (finished) {
    return (
      <section className={styles.section} aria-label="Module quiz results">
        <h3>Module quiz</h3>
        <p className={styles.score}>
          {correctCount} of {questions.length} correct
        </p>
        <p className={styles.lede}>
          This check stays on this page and does not change your practice-test scores.
        </p>
        <div className={styles.actions}>
          <button type="button" className={btn.primary} onClick={onRetake}>
            Retake module quiz
          </button>
          <Link className={btn.secondary} to={`/practice/${topicId}`}>
            Drill 25 practice questions
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className={styles.section} aria-label="Module quiz">
      <h3>Module quiz</h3>
      <p className={quizStyles.meta}>
        Question {index + 1} of {questions.length} · not part of the scored practice bank
      </p>
      <ProgressBar value={index + (showFeedback ? 1 : 0)} max={questions.length} />
      <p className={quizStyles.stem}>{question.stem}</p>
      <div className={quizStyles.choices} role="listbox" aria-label="Answer choices">
        {question.choices.map((choice, choiceIndex) => {
          const classes = [quizStyles.choice]
          const selected = pending ?? saved
          if (selected === choiceIndex) classes.push(quizStyles.choiceSelected)
          if (showFeedback && choiceIndex === question.correctIndex) {
            classes.push(quizStyles.choiceCorrect)
          }
          if (showFeedback && saved === choiceIndex && choiceIndex !== question.correctIndex) {
            classes.push(quizStyles.choiceWrong)
          }
          return (
            <button
              key={choice}
              type="button"
              className={classes.join(' ')}
              onClick={() => setPending(choiceIndex)}
              disabled={showFeedback}
            >
              <span className={quizStyles.letter}>{letterForIndex(choiceIndex)}</span>
              <span>{choice}</span>
            </button>
          )
        })}
      </div>
      {showFeedback ? (
        <div
          className={`${quizStyles.feedback} ${saved === question.correctIndex ? quizStyles.ok : quizStyles.no}`}
        >
          <p className={quizStyles.feedbackTitle}>
            {saved === question.correctIndex ? 'Correct' : 'Incorrect'}
          </p>
          <p>{question.explanation}</p>
          <p className={quizStyles.reference}>
            <span>Reference.</span> {question.reference}
          </p>
        </div>
      ) : null}
      <div className={quizStyles.actions}>
        {showFeedback ? (
          <button type="button" className={btn.primary} onClick={onContinue}>
            {index >= questions.length - 1 ? 'See quiz score' : 'Continue'}
          </button>
        ) : (
          <button type="button" className={btn.primary} onClick={onCheck} disabled={pending === null}>
            Check answer
          </button>
        )}
      </div>
    </section>
  )
}
