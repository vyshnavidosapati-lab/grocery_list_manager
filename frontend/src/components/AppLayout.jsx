import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'

const links = [
  { to: '/', label: 'Overview', icon: '◫', end: true },
  { to: '/items', label: 'My groceries', icon: '▤' },
  { to: '/categories', label: 'Categories', icon: '◈' },
  { to: '/budget', label: 'Budget', icon: '＄' },
  { to: '/reminders', label: 'Reminders', icon: '◷' },
  { to: '/analytics', label: 'Insights', icon: '▥' },
]
const pageNames = { '/': 'Overview', '/items': 'My groceries', '/categories': 'Categories', '/budget': 'Budget', '/reminders': 'Reminders', '/analytics': 'Insights', '/profile': 'Your profile' }

export default function AppLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [dark, setDark] = useState(() => localStorage.getItem('gather_theme') === 'dark')
  const [menuOpen, setMenuOpen] = useState(false)
  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light'
    localStorage.setItem('gather_theme', dark ? 'dark' : 'light')
  }, [dark])
  function signOut() { logout(); navigate('/login', { replace: true }) }
  return (
    <div className="app-shell">
      <aside className={`sidebar ${menuOpen ? 'sidebar-open' : ''}`}>
        <NavLink to="/" className="brand" onClick={() => setMenuOpen(false)}><span className="brand-mark">g</span><span>gather<span className="brand-period">.</span></span></NavLink>
        <p className="nav-caption">WORKSPACE</p>
        <nav className="nav-list">
          {links.map(({ to, label, icon, end }) => <NavLink key={to} to={to} end={end} onClick={() => setMenuOpen(false)} className={({ isActive }) => `nav-link ${isActive ? 'nav-active' : ''}`}><span className="nav-icon">{icon}</span>{label}{label === 'Reminders' && <span className="nav-dot" />}</NavLink>)}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-tip"><div className="tip-icon">✳</div><strong>Small steps, big savings.</strong><p>A little planning makes every grocery run count.</p></div>
          <NavLink to="/profile" onClick={() => setMenuOpen(false)} className="profile-link">
            <span className="avatar">{(user?.username || 'U').slice(0, 1).toUpperCase()}</span>
            <span className="profile-meta"><strong>{user?.username || 'My account'}</strong><small>Personal space</small></span><span className="profile-arrow">↗</span>
          </NavLink>
          <button className="sidebar-signout" onClick={signOut}>Sign out <span>↗</span></button>
        </div>
      </aside>
      {menuOpen && <button aria-label="Close menu" className="mobile-backdrop" onClick={() => setMenuOpen(false)} />}
      <main className="main-area">
        <header className="topbar">
          <button className="mobile-menu icon-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">☰</button>
          <div><span className="eyebrow">YOUR LITTLE GROCERY COMPANION</span><h1>{pageNames[pathname] || 'Your space'}</h1></div>
          <div className="topbar-actions"><button className="icon-button theme-toggle" onClick={() => setDark(!dark)} title="Toggle theme" aria-label="Toggle theme">{dark ? '☼' : '☾'}</button><button className="top-avatar" onClick={() => navigate('/profile')} title="Your profile">{(user?.username || 'U').slice(0, 1).toUpperCase()}</button></div>
        </header>
        <div className="page-content"><Outlet /></div>
      </main>
    </div>
  )
}
