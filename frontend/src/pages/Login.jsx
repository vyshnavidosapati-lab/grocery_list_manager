import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { getErrorMessage } from '../services/api'

export default function Login() {
  const { login, isAuthenticated } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  if (isAuthenticated) return <Navigate to="/" replace />
  async function submit(event) {
    event.preventDefault()
    setError('')
    setBusy(true)
    try { await login(form); toast('Welcome back!'); navigate('/', { replace: true }) }
    catch (failure) { setError(getErrorMessage(failure)) }
    finally { setBusy(false) }
  }
  return <AuthFrame mode="login">
    <div className="auth-kicker"><span className="tiny-spark">✳</span> YOUR PANTRY, A LITTLE MORE PEACEFUL</div>
    <h1>Welcome<br />back<span className="green-period">.</span></h1>
    <p className="auth-intro">A calmer grocery run starts right here.</p>
    <form className="auth-form" onSubmit={submit}>
      {error && <div className="form-error" role="alert">{error}</div>}
      <label>Email address<input type="email" autoComplete="email" required maxLength="190" placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
      <label>Password<input type="password" autoComplete="current-password" required placeholder="Your password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></label>
      <button className="primary-button full-button" disabled={busy}>{busy ? 'Signing you in…' : 'Sign in'} <span>→</span></button>
    </form>
    <p className="auth-switch">New to Gather? <Link to="/register">Create an account</Link></p>
  </AuthFrame>
}

export function AuthFrame({ children, mode }) {
  return <div className="auth-shell">
    <section className="auth-panel"><Link to="/login" className="brand auth-brand"><span className="brand-mark">g</span><span>gather<span className="brand-period">.</span></span></Link>{children}<div className="auth-footer">© 2026 Gather · Shop mindfully, live lightly</div></section>
    <section className={`auth-art ${mode === 'register' ? 'auth-art-register' : ''}`}>
      <div className="art-glow" /><div className="art-kicker">A LITTLE MORE INTENTION, EVERY DAY</div>
      <div className="art-copy"><span>Make room for</span><br /><em>good things.</em></div>
      <div className="art-produce"><span>🍊</span><span>🥑</span><span>🍋</span><span>🥬</span></div>
      <div className="art-note"><span className="note-star">✳</span><div><strong>Good food. Good plans.</strong><small>Everything you need, all in one little place.</small></div></div>
      <div className="art-bottom">THOUGHTFUL SHOPPING STARTS AT HOME</div>
    </section>
  </div>
}
