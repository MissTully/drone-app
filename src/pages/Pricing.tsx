import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Disclaimer } from '../components/Disclaimer'
import {
  EXAM_READY_BANK_SIZE,
  EXAM_READY_PRICE_USD,
  EXAM_READY_QUESTIONS_PER_TOPIC,
  FREE_PRACTICE_QUESTIONS_PER_TOPIC,
  FREE_TIMED_TESTS,
} from '../lib/entitlements'
import { loadWaitlistSignup, saveWaitlistEmail } from '../lib/storage'
import btn from '../components/Buttons.module.css'
import styles from './Pricing.module.css'

const FREE_INCLUDES = [
  'All 9 study modules',
  'Module 3-question checks',
  `${FREE_PRACTICE_QUESTIONS_PER_TOPIC} practice questions per topic`,
  `${FREE_TIMED_TESTS} timed practice test`,
  'Score and topic breakdown',
  'Progress saved on this device',
]

const EXAM_READY_INCLUDES = [
  `Full bank: ${EXAM_READY_QUESTIONS_PER_TOPIC} questions per topic (${EXAM_READY_BANK_SIZE} total)`,
  'Unlimited timed practice tests',
  'Full rationales and references on every question',
  'Unlimited retry on missed questions',
  'Built for ACS-aligned Part 107 prep',
]

const STEPS = [
  'Learn with free modules',
  'Practice a sample of each topic',
  'Unlock Exam Ready for full reps and unlimited timed tests',
  'Review misses until you’re solid',
]

const FAQS = [
  {
    question: 'Is this official FAA content?',
    answer:
      'No. Remote Possibilities is a study aid. Questions are not official FAA test items.',
  },
  {
    question: 'Do I need an account?',
    answer:
      'Not for Free. Exam Ready checkout may ask for email for purchase receipt and future sync.',
  },
  {
    question: 'Is $29 recurring?',
    answer: 'No. It is a one-time prep purchase.',
  },
]

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function scrollToWaitlist(event: { preventDefault: () => void }) {
  event.preventDefault()
  document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export function Pricing() {
  const existing = loadWaitlistSignup()
  const [email, setEmail] = useState(existing?.email ?? '')
  const [status, setStatus] = useState<'idle' | 'saved' | 'error'>(existing ? 'saved' : 'idle')
  const [error, setError] = useState('')

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const next = email.trim()
    if (!next) {
      setStatus('error')
      setError('Enter an email to get notified.')
      return
    }
    if (!EMAIL_PATTERN.test(next)) {
      setStatus('error')
      setError('Enter a valid email address.')
      return
    }
    saveWaitlistEmail(next)
    setEmail(next)
    setStatus('saved')
    setError('')
  }

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.kicker}>Pricing</p>
        <h1 className={styles.title}>Exam Ready</h1>
        <p className={styles.lede}>
          Start free. Unlock the full Part 107 practice system when you want real exam reps.
        </p>
      </section>

      <div className={styles.plans}>
        <article className={styles.card}>
          <div className={styles.cardTop}>
            <p className={styles.planName}>Free</p>
            <span className={styles.badge}>Start here</span>
          </div>
          <p className={styles.price}>
            $0
            <span className={styles.priceNote}>to start</span>
          </p>
          <ul className={styles.includes}>
            {FREE_INCLUDES.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <Link className={btn.secondary} to="/modules">
            Start studying free
          </Link>
        </article>

        <article className={`${styles.card} ${styles.featured}`}>
          <div className={styles.cardTop}>
            <p className={styles.planName}>Exam Ready</p>
            <span className={`${styles.badge} ${styles.badgeGold}`}>Best for test week</span>
          </div>
          <p className={styles.price}>
            ${EXAM_READY_PRICE_USD}
            <span className={styles.priceNote}>one-time</span>
          </p>
          <p className={styles.keepNote}>One-time purchase. Keep access while you prep.</p>
          <p className={styles.plusLabel}>Includes everything in Free, plus:</p>
          <ul className={styles.includes}>
            {EXAM_READY_INCLUDES.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <a className={btn.primary} href="#waitlist" onClick={scrollToWaitlist}>
            Get Exam Ready
          </a>
        </article>
      </div>

      <p className={styles.compare}>
        Free helps you learn the topics. Exam Ready helps you train like it’s test day.
      </p>

      <section className={styles.section} aria-labelledby="how-heading">
        <h2 id="how-heading">How it works</h2>
        <ol className={styles.steps}>
          {STEPS.map((step, index) => (
            <li key={step}>
              <span className={styles.stepNum}>{index + 1}</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className={styles.waitlist} id="waitlist" aria-labelledby="waitlist-heading">
        <h2 id="waitlist-heading">Get Exam Ready</h2>
        <p className={styles.waitlistNote}>
          Checkout coming soon. Leave your email to get notified.
        </p>
        <form className={styles.form} onSubmit={onSubmit} noValidate>
          <label className={styles.field}>
            <span>Email</span>
            <input
              type="email"
              name="email"
              autoComplete="email"
              inputMode="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value)
                if (status !== 'idle') setStatus('idle')
              }}
              placeholder="you@email.com"
              aria-invalid={status === 'error'}
              aria-describedby={status === 'error' ? 'waitlist-error' : status === 'saved' ? 'waitlist-success' : undefined}
            />
          </label>
          <button className={btn.primary} type="submit">
            Notify me
          </button>
        </form>
        {status === 'error' ? (
          <p className={styles.formError} id="waitlist-error" role="alert">
            {error}
          </p>
        ) : null}
        {status === 'saved' ? (
          <p className={styles.formSuccess} id="waitlist-success" role="status">
            You’re on the list. We’ll email you when checkout is ready.
          </p>
        ) : null}
      </section>

      <section className={styles.section} aria-labelledby="faq-heading">
        <h2 id="faq-heading">FAQ</h2>
        <dl className={styles.faq}>
          {FAQS.map((item) => (
            <div className={styles.faqItem} key={item.question}>
              <dt>{item.question}</dt>
              <dd>{item.answer}</dd>
            </div>
          ))}
        </dl>
      </section>

      <Disclaimer />
    </div>
  )
}
