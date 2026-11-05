import { Component, type ReactNode } from 'react'
import styles from './ErrorBoundary.module.css'

type Props = { children: ReactNode }
type State = { failed: boolean }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { failed: false }

  static getDerivedStateFromError(): State {
    return { failed: true }
  }

  componentDidCatch(error: unknown) {
    if (import.meta.env.DEV) console.error(error)
  }

  render() {
    if (!this.state.failed) return this.props.children
    return (
      <main className={styles.wrap}>
        <h1>Something went wrong</h1>
        <p>Reload the page to keep studying. Saved progress stays in this browser.</p>
        <a href="/">Home</a>
      </main>
    )
  }
}
