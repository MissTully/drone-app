import { Link } from 'react-router-dom'
import { loadProgress } from '../lib/storage'
import btn from '../components/Buttons.module.css'
import styles from './Home.module.css'

const FEATURES = [
  {
    title: 'Study modules',
    body: 'Pick a topic from the dropdown. Watch a training video, hit key points and vocabulary, read the explanation, then take a 3-question check.',
  },
  {
    title: 'Practice by topic',
    body: '25 FAA-style questions per topic (225 total), with rationales and references after each answer.',
  },
  {
    title: 'Timed practice test',
    body: '60 questions. 2 hours. 70% to pass. No mid-test hints, just like test day.',
  },
  {
    title: 'Retry what you missed',
    body: 'Turn wrong answers into your next session.',
  },
]

const TOPICS = [
  'Regulations',
  'Airspace and flight restrictions',
  'Weather',
  'Loading and performance',
  'Operations and emergencies',
  'Airport operations',
  'Radio communications',
  'Maintenance and preflight',
  'Human factors and ADM',
]

const STEPS = [
  'Open a module and learn the topic',
  'Practice that topic until it sticks',
  'Take a full timed practice test',
  'Review misses. Repeat.',
]

function formatScore(value: number | null): string {
  return value === null ? '-' : `${value}%`
}

export function Home() {
  const progress = loadProgress()
  const hasScores =
    progress.lastPracticeScore !== null ||
    progress.lastTestScore !== null ||
    progress.bestTestScore !== null

  return (
    <div className={styles.landing}>
      <section className={styles.hero}>
        <p className={styles.kicker}>FAA Part 107 study aid</p>
        <h1 className={styles.title}>Remote Possibilities</h1>
        <p className={styles.lede}>
          Study smarter. Fly ready. Topic modules, practice quizzes, and timed tests built around
          the ACS, so you walk into the knowledge test prepared.
        </p>
        <div className={styles.ctaRow}>
          <Link className={btn.primary} to="/modules">
            Start studying free
          </Link>
          <Link className={btn.secondary} to="/pricing">
            Get Exam Ready · $29
          </Link>
        </div>
        <p className={styles.micro}>No account. Progress stays on your device.</p>
      </section>

      <p className={styles.trust}>
        Built for the Remote Pilot (small UAS) knowledge test · ACS-aligned topics · Start free
      </p>

      <section className={styles.split}>
        <article className={styles.proseCard}>
          <h2>The Part 107 test shouldn’t feel like a fogged-in approach</h2>
          <p>
            Between airspace charts, METARs, and regs, it’s easy to study hard and still miss what
            the exam actually asks. You need structure, reps, and feedback, not another 200-page PDF
            you won’t finish.
          </p>
        </article>
        <article className={styles.proseCard}>
          <h2>One app. Learn, practice, prove it.</h2>
          <p>
            Remote Possibilities mirrors how good pilots prep: learn the topic, check your
            understanding, then sit a timed practice test when you’re ready.
          </p>
        </article>
      </section>

      <section className={styles.features} aria-label="Features">
        {FEATURES.map((feature, index) => (
          <article className={styles.featureCard} key={feature.title}>
            <span className={styles.featureIndex}>{index + 1}</span>
            <h2>{feature.title}</h2>
            <p>{feature.body}</p>
          </article>
        ))}
      </section>

      <section className={styles.topicsSection} aria-labelledby="topics-heading">
        <h2 id="topics-heading">Topics covered</h2>
        <ul className={styles.topicChips}>
          {TOPICS.map((topic) => (
            <li key={topic}>{topic}</li>
          ))}
        </ul>
      </section>

      <section className={styles.stepsSection} aria-labelledby="steps-heading">
        <h2 id="steps-heading">How it works</h2>
        <ol className={styles.steps}>
          {STEPS.map((step, index) => (
            <li key={step}>
              <span className={styles.stepNum}>{index + 1}</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </section>

      {hasScores ? (
        <section className={styles.scores} aria-label="Recent scores">
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
        </section>
      ) : null}

      <section className={styles.finalCta}>
        <h2>Cleared for study</h2>
        <p>
          Your remote pilot certificate starts with knowing the material. Remote Possibilities is
          here for the reps.
        </p>
        <div className={styles.ctaRow}>
          <Link className={btn.primary} to="/modules">
            Start studying free
          </Link>
          <Link className={btn.secondary} to="/pricing">
            Get Exam Ready · $29
          </Link>
        </div>
      </section>
    </div>
  )
}
