import { useEffect, useState } from 'react'
import api, { getErrorMessage } from '../services/api'
import { useToast } from '../context/ToastContext'

const emptyReminder = { title: '', dueAt: '', completed: false }
const dateInputValue = (value) => {
  const date = value ? new Date(value) : new Date(Date.now() + 60 * 60 * 1000)
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset())
  return date.toISOString().slice(0, 16)
}
export default function Reminders() {
  const toast = useToast()
  const [reminders, setReminders] = useState([])
  const [form, setForm] = useState(emptyReminder)
  const [editing, setEditing] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  async function load() {
    try { setReminders((await api.get('/reminders')).data); setError('') }
    catch (failure) { setError(getErrorMessage(failure)) }
  }
  useEffect(() => { load() }, [])
  function open(reminder) {
    setEditing(reminder?.id ?? null)
    setForm(reminder ? { title: reminder.title, dueAt: dateInputValue(reminder.dueAt), completed: reminder.completed } : { ...emptyReminder, dueAt: dateInputValue() })
    setShowForm(true)
  }
  async function submit(event) {
    event.preventDefault()
    setBusy(true)
    const payload = { ...form, title: form.title.trim(), dueAt: form.dueAt.length === 16 ? `${form.dueAt}:00` : form.dueAt }
    try {
      if (editing) await api.put(`/reminders/${editing}`, payload)
      else await api.post('/reminders', payload)
      toast(editing ? 'Reminder updated.' : 'Your reminder is set.')
      setShowForm(false)
      setEditing(null)
      await load()
    } catch (failure) { toast(getErrorMessage(failure), 'error') }
    finally { setBusy(false) }
  }
  async function remove(item) {
    if (!window.confirm(`Delete the reminder “${item.title}”?`)) return
    try { await api.delete(`/reminders/${item.id}`); toast('Reminder deleted.'); await load() }
    catch (failure) { toast(getErrorMessage(failure), 'error') }
  }
  const now = new Date()
  const overdue = reminders.filter((item) => !item.completed && new Date(item.dueAt) < now)
  const upcoming = reminders.filter((item) => !item.completed && new Date(item.dueAt) >= now)
  const complete = reminders.filter((item) => item.completed)
  return <section className="page-stack">
    <div className="page-intro-row"><div><span className="eyebrow">A KIND LITTLE NUDGE, RIGHT ON TIME</span><h2>Purchase reminders<span className="green-period">.</span></h2><p>Remember the good stuff without keeping it all in your head.</p></div><button className="primary-button" onClick={() => open(null)}>+ Add reminder</button></div>
    {error && <div className="alert alert-error">{error}<button className="text-button" onClick={load}>Try again</button></div>}
    <div className="reminder-summary"><div className="surface-card reminder-summary-card"><span className="summary-bubble pink">◷</span><span>Overdue</span><strong>{overdue.length}</strong><small>Ready when you are</small></div><div className="surface-card reminder-summary-card"><span className="summary-bubble mint">✳</span><span>Coming up</span><strong>{upcoming.length}</strong><small>A little nudge ahead</small></div><div className="surface-card reminder-summary-card"><span className="summary-bubble lilac">✓</span><span>All done</span><strong>{complete.length}</strong><small>Nice and taken care of</small></div></div>
    <div className="reminder-lists">
      <ReminderGroup title="Past due" kicker="WHENEVER YOU GET A CHANCE" entries={overdue} tone="overdue" onEdit={open} onDelete={remove} />
      <ReminderGroup title="Coming up" kicker="ON THE HORIZON" entries={upcoming} tone="upcoming" onEdit={open} onDelete={remove} />
      <ReminderGroup title="All caught up" kicker="THE GOOD STUFF, DONE" entries={complete} tone="complete" onEdit={open} onDelete={remove} />
    </div>
    {showForm && <div className="modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) setShowForm(false) }}><section className="modal-card" role="dialog" aria-modal="true" aria-labelledby="reminder-title"><div className="modal-heading"><div><span className="eyebrow">MAKE A NOTE TO YOUR FUTURE SELF</span><h3 id="reminder-title">{editing ? 'Edit reminder' : 'Add a reminder'}</h3></div><button className="modal-close" onClick={() => setShowForm(false)} aria-label="Close dialog">×</button></div><form className="form-grid" onSubmit={submit}><label className="field-wide">What should you remember?<input autoFocus required maxLength="120" placeholder="Pick up fresh bread…" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></label><label className="field-wide">When should we remind you?<input type="datetime-local" required value={form.dueAt} onChange={(e) => setForm({ ...form, dueAt: e.target.value })} /></label><label className="checkbox-field field-wide"><input type="checkbox" checked={form.completed} onChange={(e) => setForm({ ...form, completed: e.target.checked })} /> Mark as done</label><div className="modal-actions field-wide"><button type="button" className="secondary-button" onClick={() => setShowForm(false)}>Cancel</button><button className="primary-button" disabled={busy}>{busy ? 'Saving…' : 'Save reminder'}</button></div></form></section></div>}
  </section>
}

function ReminderGroup({ title, kicker, entries, tone, onEdit, onDelete }) {
  return <section className="surface-card reminder-group"><div className="card-heading"><div><span className="eyebrow">{kicker}</span><h3>{title}</h3></div><span className="group-count">{entries.length}</span></div>
    {entries.length ? <div className="reminder-rows">{entries.map((item) => <article className={`reminder-row reminder-${tone}`} key={item.id}><span className="reminder-date"><strong>{new Date(item.dueAt).toLocaleDateString('en', { day: '2-digit' })}</strong><small>{new Date(item.dueAt).toLocaleDateString('en', { month: 'short' })}</small></span><div className="reminder-copy"><strong>{item.title}</strong><small>{new Date(item.dueAt).toLocaleString([], { weekday: 'short', hour: 'numeric', minute: '2-digit' })}</small></div><div className="row-actions"><button title="Edit reminder" onClick={() => onEdit(item)}>✎</button><button title="Delete reminder" onClick={() => onDelete(item)}>×</button></div></article>)}</div> : <p className="empty-note">Nothing here right now. Enjoy a little breathing room.</p>}
  </section>
}
