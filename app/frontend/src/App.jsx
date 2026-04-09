import { Link, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Learn from './pages/Learn'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <div className="app-shell">
      <header className="site-header">
        <Link to="/" className="brand">Korf Rubik&apos;s Solver</Link>
        <nav>
          <Link to="/">Solver</Link>
          <Link to="/learn">Learn</Link>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <footer className="site-footer">
        Built with React + FastAPI + C++ integration hooks
      </footer>
    </div>
  )
}
