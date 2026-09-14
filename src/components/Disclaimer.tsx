import { DISCLAIMER } from '../data/topics'
import styles from './Disclaimer.module.css'

export function Disclaimer({ compact = false }: { compact?: boolean }) {
  return (
    <aside className={styles.banner} role="note">
      {!compact && <span className={styles.label}>Disclaimer</span>}
      <p>{DISCLAIMER}</p>
    </aside>
  )
}
