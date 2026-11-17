import { useState } from 'react'
import api, { getErrorMessage } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

export default function Profile() {
  const { user, updateUser } = useAuth()
  const toast = useToast()
  const [details, setDetails] = useState({ username: user?.username || '', email: user?.email || '' })
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '' })
  const [busy, setBusy] = useState(false)
  const [passwordBusy, setPasswordBusy] = useState(false)
  async function saveProfile(event) {
    event.preventDefault()
    setBusy(true)
    try { const { data } = await api.put('/users/me', details); updateUser(data); setDetails({ username: data.username, email: data.email }); toast('Your profile is up to date.') }
    catch (failure) { toast(getErrorMessage(failure), 'error') }
    finally { setBusy(false) }
  }
  async function changePassword(event) {
    event.preventDefault()
    setPasswordBusy(true)
    try { await api.put('/users/me/password', passwords); setPasswords({ currentPassword: '', newPassword: '' }); toast('Your password has been changed.') }
    catch (failure) { toast(getErrorMessage(failure), 'error') }
    finally { setPasswordBusy(false) }
  }
  return <section className="page-stack">
    <div className="page-intro-row"><div><span className="eyebrow">A LITTLE SPACE THAT'S ALL YOURS</span><h2>Your profile<span className="green-period">.</span></h2><p>Keep your account just the way you like it.</p></div></div>
    <div className="profile-layout"><div className="profile-identity surface-card"><span className="profile-big-avatar">{(user?.username || 'U').slice(0, 1).toUpperCase()}</span><h3>{user?.username}</h3><p>{user?.email}</p><span className="profile-badge">✳ Gather member</span></div>
      <form className="surface-card profile-form" onSubmit={saveProfile}><div className="card-heading"><div><span className="eyebrow">THE BASICS</span><h3>Personal details</h3></div></div><label>Your name<input autoComplete="name" required maxLength="60" value={details.username} onChange={(e) => setDetails({ ...details, username: e.target.value })} /></label><label>Email address<input type="email" autoComplete="email" required maxLength="190" value={details.email} onChange={(e) => setDetails({ ...details, email: e.target.value })} /></label><button className="primary-button" disabled={busy}>{busy ? 'Saving…' : 'Save changes'} <span>→</span></button></form>
      <form className="surface-card profile-form password-form" onSubmit={changePassword}><div className="card-heading"><div><span className="eyebrow">KEEP IT PRIVATE</span><h3>Change password</h3></div></div><label>Current password<input type="password" autoComplete="current-password" required value={passwords.currentPassword} onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })} /></label><label>New password<input type="password" autoComplete="new-password" required minLength="8" maxLength="72" value={passwords.newPassword} onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })} /><small className="field-hint">Use at least 8 characters.</small></label><button className="secondary-button" disabled={passwordBusy}>{passwordBusy ? 'Updating…' : 'Update password'}</button></form>
    </div>
  </section>
}
