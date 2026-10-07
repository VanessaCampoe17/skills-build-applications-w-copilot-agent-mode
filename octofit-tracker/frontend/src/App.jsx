import { NavLink, Route, Routes } from 'react-router-dom'
import Activities from './components/Activities.jsx'
import Leaderboard from './components/Leaderboard.jsx'
import Teams from './components/Teams.jsx'
import Users from './components/Users.jsx'
import Workouts from './components/Workouts.jsx'
import logo from '../../../docs/octofitapp-small.png'
import './App.css'

const sections = [
  { path: '/activities', label: 'Activities', Component: Activities },
  { path: '/leaderboard', label: 'Leaderboard', Component: Leaderboard },
  { path: '/teams', label: 'Teams', Component: Teams },
  { path: '/users', label: 'Users', Component: Users },
  { path: '/workouts', label: 'Workouts', Component: Workouts },
]

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
          {sections.map(({ path, Component }) => (
            <Route element={<Component />} key={path} path={path} />
          ))}
          <Route element={<Overview />} path="*" />
        </Routes>
      </main>
    </div>
  )
}

export default App
