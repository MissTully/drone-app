import type { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import styles from './Layout.module.css'

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <NavLink to="/" className={styles.brand} aria-label="Part 107 Study home">
          <svg className={styles.mark} viewBox="0 0 32 32" aria-hidden="true">
            <rect width="32" height="32" rx="8" fill="#141b2f" />
            <circle cx="8" cy="8" r="3" stroke="#f0b429" strokeWidth="2" fill="none" />
            <circle cx="24" cy="8" r="3" stroke="#f0b429" strokeWidth="2" fill="none" />
            <circle cx="8" cy="24" r="3" stroke="#f0b429" strokeWidth="2" fill="none" />
            <circle cx="24" cy="24" r="3" stroke="#f0b429" strokeWidth="2" fill="none" />
            <rect x="12" y="12" width="8" height="8" rx="2" fill="#e8eef8" />
          </svg>
          <span className={styles.brandText}>
            <span className={styles.brandName}>Part 107 Study</span>
            <span className={styles.brandTag}>Quiz & practice tests</span>
          </span>
        </NavLink>
        <nav className={styles.nav} aria-label="Primary">
          <NavLink
            to="/practice"
            className={({ isActive }) =>
              isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink
            }
          >
            Practice
          </NavLink>
          <NavLink
            to="/test"
            className={({ isActive }) =>
              isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink
            }
          >
            Test
          </NavLink>
        </nav>
      </header>
      <main className={styles.main}>{children}</main>
      <footer className={styles.footer}>
        Study aid only · Not affiliated with the FAA · Questions are not official test items
      </footer>
    </div>
  )
}
