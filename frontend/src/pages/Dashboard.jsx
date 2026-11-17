import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api, { getErrorMessage } from '../services/api'

const money = (value) => `₹${Number(value || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`
export default function Dashboard() {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  useEffect(() => { api.get('/dashboard').then(({ data: result }) => setData(result)).catch((failure) => setError(getErrorMessage(failure))) }, [])
  if (error) return <div className="alert alert-error">{error} <button className="text-button" onClick={() => location.reload()}>Retry</button></div>
  if (!data) return <div className="loading-inline"><span className="spinner" /> Gathering your groceries…</div>
  const percent = data.monthlyBudget > 0 ? Math.min(100, Math.max(0, data.totalSpent / data.monthlyBudget * 100)) : 0
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' })
  return <div className="dashboard-page">
    <section className="welcome-row"><div><span className="eyebrow">A FRESH LOOK AT YOUR LIST</span><h2>Your week, well gathered<span className="green-period">.</span></h2><p>{today} · A little planning goes a long way.</p></div><Link to="/items" className="primary-button">+ Add an item</Link></section>
    <section className="stats-grid">
      <Stat icon="▤" label="On your list" value={data.totalItems} note="all your essentials" tint="mint" />
      <Stat icon="✓" label="Picked up" value={data.purchasedItems} note="all-time items" tint="peach" />
      <Stat icon="◷" label="Still to get" value={data.pendingItems} note="whenever you're ready" tint="lilac" />
      <Stat icon="↗" label="Spent this month" value={money(data.totalSpent)} note="on your groceries" tint="butter" />
    </section>
    <section className="dashboard-grid">
      <div className="surface-card budget-card">
        <div className="card-heading"><div><span className="eyebrow">YOUR MONTHLY PLAN</span><h3>Budget check-in</h3></div><Link to="/budget" className="subtle-link">Manage budget <span>↗</span></Link></div>
        <div className="budget-numbers"><div><strong>{money(data.totalSpent)}</strong><span>spent</span></div><div className="budget-limit">of {money(data.monthlyBudget)}</div></div>
        <div className="progress-track"><span className={percent > 100 ? 'progress-over' : ''} style={{ width: `${percent}%` }} /></div>
        {data.monthlyBudget > 0 ? <div className="budget-foot"><span>{Math.round(percent)}% of your budget</span><span>{money(data.remainingBudget)} left</span></div> : <p className="empty-note">Set a monthly budget to keep your plans on track.</p>}
        {percent > 100 && <div className="budget-warning">You've gone over your monthly budget. Take a look at your spending.</div>}
      </div>
      <div className="surface-card reminders-card">
        <div className="card-heading"><div><span className="eyebrow">A GENTLE NUDGE</span><h3>Coming up</h3></div><Link to="/reminders" className="subtle-link">All reminders <span>↗</span></Link></div>
        {data.upcomingReminders.length ? <div className="mini-reminders">{data.upcomingReminders.map((item) => <div key={item.id} className="mini-reminder"><span className="reminder-spark">◷</span><div><strong>{item.title}</strong><small>{new Date(item.dueAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</small></div></div>)}</div> : <div className="empty-state compact-empty"><span className="empty-icon">◷</span><p>No upcoming reminders.</p><Link to="/reminders">Add a reminder <span>→</span></Link></div>}
      </div>
    </section>
    <section className="surface-card recent-card">
      <div className="card-heading"><div><span className="eyebrow">THE LATEST</span><h3>On your grocery list</h3></div><Link to="/items" className="subtle-link">View everything <span>↗</span></Link></div>
      {data.recentItems.length ? <div className="recent-list">{data.recentItems.map((item) => <div key={item.id} className="recent-row"><span className={`check-mark ${item.purchased ? 'checked' : ''}`}>{item.purchased ? '✓' : ''}</span><span className={`recent-name ${item.purchased ? 'crossed' : ''}`}>{item.name}</span><span className="category-chip">{item.category}</span><span className="recent-quantity">{item.quantity} {item.unit}</span><strong>{money(item.price * item.quantity)}</strong></div>)}</div> : <div className="empty-state"><span className="empty-icon">✳</span><p>Your list is ready when you are.</p><Link to="/items">Add your first grocery <span>→</span></Link></div>}
    </section>
  </div>
}

function Stat({ icon, label, value, note, tint }) {
  return <article className="stat-card"><div className={`stat-icon ${tint}`}>{icon}</div><span className="stat-label">{label}</span><strong className="stat-value">{value}</strong><small>{note}</small></article>
}
