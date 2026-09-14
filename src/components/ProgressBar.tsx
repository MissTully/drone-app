import styles from './ProgressBar.module.css'

export function ProgressBar({ value, max }: { value: number; max: number }) {
  const pct = max === 0 ? 0 : Math.min(100, Math.round((value / max) * 100))
  return (
    <div
      className={styles.track}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-label="Question progress"
    >
      <div className={styles.fill} style={{ width: `${pct}%` }} />
    </div>
  )
}
