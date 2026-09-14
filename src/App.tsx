import { Link, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Home } from './pages/Home'
import { Modules } from './pages/Modules'
import { QuizPlayer } from './pages/QuizPlayer'
import { Results } from './pages/Results'
import { TopicPicker } from './pages/TopicPicker'
import btn from './components/Buttons.module.css'

function NotFound() {
  return (
    <div>
      <h1>Page not found</h1>
      <p style={{ color: 'var(--muted)', margin: '0.75rem 0 1rem' }}>
        That route is not part of this study app.
      </p>
      <Link className={btn.primary} to="/">
        Home
      </Link>
    </div>
  )
}

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/practice" element={<TopicPicker />} />
        <Route path="/practice/:topicId" element={<QuizPlayer />} />
        <Route path="/modules" element={<Navigate to="/modules/regulations" replace />} />
        <Route path="/modules/:topicId" element={<Modules />} />
        <Route path="/test" element={<QuizPlayer />} />
        <Route path="/retry" element={<QuizPlayer />} />
        <Route path="/results" element={<Results />} />
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  )
}
