import { useEffect, useRef, useState } from 'react'
import { formatClock, remainingMs } from '../lib/quiz'
import styles from './Timer.module.css'

export function Timer({
  startedAt,
  durationMs,
  onExpire,
}: {
  startedAt: number
  durationMs: number
  onExpire: () => void
}) {
  const [ms, setMs] = useState(() => remainingMs(startedAt, durationMs))
  const expired = useRef(false)
  const onExpireRef = useRef(onExpire)

  useEffect(() => {
    onExpireRef.current = onExpire
  }, [onExpire])

  useEffect(() => {
    const tick = () => {
      const next = remainingMs(startedAt, durationMs)
      setMs(next)
      if (next <= 0 && !expired.current) {
        expired.current = true
        onExpireRef.current()
      }
    }
    tick()
    const id = window.setInterval(tick, 250)
    return () => window.clearInterval(id)
  }, [durationMs, startedAt])

  const className =
    ms <= 5 * 60 * 1000
      ? `${styles.timer} ${styles.danger}`
      : ms <= 15 * 60 * 1000
        ? `${styles.timer} ${styles.warn}`
        : styles.timer

  return (
    <div className={className} aria-live="polite" aria-label="Time remaining">
      {formatClock(ms)}
    </div>
  )
}
