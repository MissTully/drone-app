import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import styles from './ExamReadyBanner.module.css'

export function ExamReadyBanner({ children }: { children: ReactNode }) {
  return (
    <aside className={styles.banner} role="note">
      <p className={styles.copy}>{children}</p>
      <Link className={styles.link} to="/pricing">
        Get Exam Ready
      </Link>
    </aside>
  )
}
