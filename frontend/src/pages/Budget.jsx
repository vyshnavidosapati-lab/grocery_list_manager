import { useEffect, useState } from 'react'
import api, { getErrorMessage } from '../services/api'
import { useToast } from '../context/ToastContext'

const currentMonth = () => {
  const date = new Date()
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}
const money = (value) => `₹${Number(value || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`
export default function Budget() {
  const toast = useToast()
  const [month, setMonth] = useState(currentMonth())
  const [budget, setBudget] = useState(null)
  const [amount, setAmount] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  async function load(selectedMonth = month) {
    try {
      const { data } = await api.get('/budget', { params: { month: selectedMonth } })
      setBudget(data)
      setAmount(data.monthlyLimit ? String(data.monthlyLimit) : '')
      setError('')
    } catch (failure) { setError(getErrorMessage(failure)) }
  }
  useEffect(() => { load(month) }, [month])
  async function save(event) {
    event.preventDefault()
    setBusy(true)
    try {
      const { data } = await api.put('/budget', { month, monthlyLimit: Number(amount) })
      setBudget(data)
      toast('Your monthly budget is saved.')
    } catch (failure) { toast(getErrorMessage(failure), 'error') }
    finally { setBusy(false) }
  }
  const percent = budget?.monthlyLimit > 0 ? budget.spent / budget.monthlyLimit * 100 : 0
  const safePercent = Math.min(100, Math.max(0, percent))
  return <section className="page-stack">
    <div className="page-intro-row"><div><span className="eyebrow">A GENTLER WAY TO KEEP TRACK</span><h2>Budget & spending<span className="green-period">.</span></h2><p>Your plan, made to feel good.</p></div><label className="month-picker">MONTH<select value={month} onChange={(e) => setMonth(e.target.value)}><MonthOptions /></select></label></div>
    {error && <div className="alert alert-error">{error}<button onClick={() => load()} className="text-button">Try again</button></div>}
    {!budget ? <div className="loading-inline"><span className="spinner" /> Finding your budget…</div> : <div className="budget-page-grid">
      <article className="surface-card budget-hero"><span className="eyebrow">A LITTLE CHECK-IN</span><h3>{budget.monthlyLimit ? 'You’re finding your rhythm.' : 'Give yourself a monthly guide.'}</h3><p>Every thoughtful shop adds up. Set a comfortable limit, then keep an eye on where it goes.</p>
        <div className="budget-page-summary"><div><strong>{money(budget.spent)}</strong><small>spent so far</small></div><span className="summary-divider" /><div><strong>{money(budget.remaining)}</strong><small>left to spend</small></div></div>
        <div className="progress-track budget-large"><span className={percent > 100 ? 'progress-over' : ''} style={{ width: `${safePercent}%` }} /></div>
        <div className="budget-foot"><span>{budget.monthlyLimit ? `${Math.round(percent)}% used` : 'No budget set yet'}</span><span>{money(budget.monthlyLimit)} monthly limit</span></div>
        {percent > 100 && <div className="budget-warning">You're {money(Math.abs(budget.remaining))} over this month's plan.</div>}
      </article>
      <form className="surface-card budget-form" onSubmit={save}><span className="eyebrow">YOUR MONTHLY PLAN</span><h3>{budget.monthlyLimit ? 'Adjust your budget' : 'Set your budget'}</h3><p>A number that feels comfortable is a good place to start. You can change it anytime.</p><label>Monthly grocery budget<input type="number" min="0.01" step="0.01" required value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="e.g. 12000" /><span className="input-prefix">₹</span></label><button className="primary-button full-button" disabled={busy}>{busy ? 'Saving…' : 'Save monthly budget'} <span>→</span></button><small>Your purchases count towards the month they were marked as picked up.</small></form>
      <div className="surface-card budget-note"><span className="note-icon">✳</span><div><strong>A friendly reminder</strong><p>Budget progress is based on the item price multiplied by its quantity. Mark items as picked up to include them.</p></div></div>
    </div>}
  </section>
}

function MonthOptions() {
  return Array.from({ length: 18 }, (_, offset) => {
    const date = new Date()
    date.setDate(1)
    date.setMonth(date.getMonth() - offset)
    const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    return <option key={value} value={value}>{date.toLocaleDateString('en', { month: 'long', year: 'numeric' })}</option>
  })
}
