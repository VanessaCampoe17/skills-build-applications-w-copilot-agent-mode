import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom'
import logo from '../../../docs/octofitapp-small.png'
import './App.css'

const sections = [
  { path: '/activity', label: 'Activity' },
  { path: '/teams', label: 'Teams' },
  { path: '/leaderboard', label: 'Leaderboard' },
  { path: '/workouts', label: 'Workouts' },
]

function EmptySection({ title, message }) {
  return (
    <section className="section-view" aria-labelledby="section-title">
      <p className="section-kicker">OCTOFIT / TRACKER</p>
      <h1 id="section-title">{title}</h1>
      <p className="section-message">{message}</p>
    </section>
  )
}

function Overview() {
  return (
    <section className="overview" aria-labelledby="overview-title">
      <div className="overview-copy">
        <p className="section-kicker">OCTOFIT / TRACKER</p>
        <h1 id="overview-title">Make your next move count.</h1>
        <p className="section-message">
          A fresh start for your training, your team, and the goals ahead.
        </p>
      </div>
      <div className="overview-links" aria-label="Tracker sections">
        {sections.map((section, index) => (
          <NavLink className="overview-link" key={section.path} to={section.path}>
            <span className="link-index">0{index + 1}</span>
            <span>{section.label}</span>
            <span aria-hidden="true">↗</span>
          </NavLink>
        ))}
      </div>
    </section>
  )
}

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <header className="app-header">
          <NavLink className="brand" to="/" aria-label="OctoFit Tracker home">
            <img src={logo} alt="" />
            <span>OctoFit <strong>Tracker</strong></span>
          </NavLink>
          <nav className="nav app-nav" aria-label="Main navigation">
            <NavLink className="nav-link" end to="/">Overview</NavLink>
            {sections.map((section) => (
              <NavLink className="nav-link" key={section.path} to={section.path}>
                {section.label}
              </NavLink>
            ))}
          </nav>
        </header>
        <main className="container-fluid app-main">
          <Routes>
            <Route element={<Overview />} path="/" />
            <Route element={<EmptySection message="Your logged sessions will appear here." title="Activity" />} path="/activity" />
            <Route element={<EmptySection message="Your training crew will take shape here." title="Teams" />} path="/teams" />
            <Route element={<EmptySection message="Team standings will appear here." title="Leaderboard" />} path="/leaderboard" />
            <Route element={<EmptySection message="Your workout suggestions will appear here." title="Workouts" />} path="/workouts" />
            <Route element={<Overview />} path="*" />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
