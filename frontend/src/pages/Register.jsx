import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { AuthFrame } from './Login'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { getErrorMessage } from '../services/api'

export default function Register() {
  const { register, isAuthenticated } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  if (isAuthenticated) return <Navigate to="/" replace />
  async function submit(event) {
    event.preventDefault()
    setError('')
    setBusy(true)
    try { await register(form); toast('Your space is ready!'); navigate('/', { replace: true }) }
    catch (failure) { setError(getErrorMessage(failure)) }
    finally { setBusy(false) }
  }
  return <AuthFrame mode="register">
    <div className="auth-kicker"><span className="tiny-spark">✳</span> A FRESH START, ONE LIST AT A TIME</div>
    <h1>Make a little<br />room<span className="green-period">.</span></h1>
    <p className="auth-intro">Your groceries, plans, and budget — all together.</p>
    <form className="auth-form" onSubmit={submit}>
      {error && <div className="form-error" role="alert">{error}</div>}
      <label>Your name<input autoComplete="name" required maxLength="60" placeholder="What should we call you?" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} /></label>
      <label>Email address<input type="email" autoComplete="email" required maxLength="190" placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
      <label>Create password<input type="password" autoComplete="new-password" required minLength="8" maxLength="72" placeholder="At least 8 characters" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></label>
      <button className="primary-button full-button" disabled={busy}>{busy ? 'Creating your account…' : 'Create my account'} <span>→</span></button>
    </form>
    <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>
  </AuthFrame>
}
