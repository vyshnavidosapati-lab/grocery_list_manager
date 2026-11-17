import { useEffect, useState } from 'react'
import { Bar, Doughnut, Line } from 'react-chartjs-2'
import { ArcElement, BarElement, CategoryScale, Chart as ChartJS, Filler, Legend, LinearScale, LineElement, PointElement, Tooltip } from 'chart.js'
import api, { getErrorMessage } from '../services/api'

ChartJS.register(ArcElement, BarElement, CategoryScale, Filler, Legend, LinearScale, LineElement, PointElement, Tooltip)
const money = (value) => `₹${Number(value || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`
const palette = ['#7d9d75', '#e9a98b', '#e8c86b', '#9c92bd', '#79a7a5', '#d98e9a', '#b9c898', '#d5a77e']
const baseOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: '#81877e', padding: 18, usePointStyle: true, boxWidth: 7, font: { family: 'DM Sans', size: 11 } } } } }
export default function Analytics() {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  useEffect(() => { api.get('/analytics').then(({ data: result }) => setData(result)).catch((failure) => setError(getErrorMessage(failure))) }, [])
  if (error) return <div className="alert alert-error">{error}</div>
  if (!data) return <div className="loading-inline"><span className="spinner" /> Finding your patterns…</div>
  const spent = Number(data.totalSpent || 0)
  const budget = Number(data.monthlyBudget || 0)
  const categories = Object.entries(data.categorySpending || {})
  const monthly = Object.entries(data.monthlySpending || {})
  const today = new Date()
  const currentMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`
  const currentMonthSpending = Number(data.monthlySpending?.[currentMonth] || 0)
  const utilization = budget > 0 ? currentMonthSpending / budget * 100 : 0
  const monthLabels = monthly.map(([month]) => new Date(`${month}-01T00:00:00`).toLocaleDateString('en', { month: 'short' }))
  const commonOptions = { ...baseOptions, scales: { x: { grid: { display: false }, ticks: { color: '#8b9087' } }, y: { grid: { color: 'rgba(126,139,117,.12)' }, ticks: { color: '#8b9087', callback: (v) => `₹${v}` }, beginAtZero: true } } }
  return <section className="page-stack">
    <div className="page-intro-row"><div><span className="eyebrow">YOUR HABITS, AT A GLANCE</span><h2>A little perspective<span className="green-period">.</span></h2><p>Your grocery patterns, gathered in one place.</p></div><div className="insight-range"><span className="range-dot" /> All time · recent months</div></div>
    <div className="insight-stat-grid"><article className="surface-card insight-stat"><span className="eyebrow">GROCERY ITEMS</span><strong>{data.totalItems}</strong><small>on your list</small></article><article className="surface-card insight-stat"><span className="eyebrow">PICKED UP</span><strong>{data.purchasedItems}</strong><small>ready to enjoy</small></article><article className="surface-card insight-stat"><span className="eyebrow">SPENT SO FAR</span><strong>{money(spent)}</strong><small>on picked-up items</small></article><article className="surface-card insight-stat"><span className="eyebrow">TO PICK UP</span><strong>{data.pendingItems}</strong><small>whenever you're ready</small></article></div>
    <div className="charts-grid">
      <article className="surface-card chart-card chart-wide"><div className="card-heading"><div><span className="eyebrow">A LOOK BACK</span><h3>Monthly spending</h3></div><span className="chart-caption">Last 6 months</span></div><div className="chart-area"><Line data={{ labels: monthLabels, datasets: [{ label: 'Spending', data: monthly.map(([, value]) => Number(value)), borderColor: '#78916d', backgroundColor: 'rgba(120,145,109,.12)', fill: true, tension: .38, pointRadius: 4, pointBackgroundColor: '#78916d' }] }} options={commonOptions} /></div></article>
      <article className="surface-card chart-card"><div className="card-heading"><div><span className="eyebrow">WHAT MAKES THE LIST</span><h3>By category</h3></div></div>{categories.length ? <div className="chart-area chart-doughnut"><Doughnut data={{ labels: categories.map(([label]) => label), datasets: [{ data: categories.map(([, value]) => Number(value)), backgroundColor: categories.map((_, i) => palette[i % palette.length]), borderWidth: 0, hoverOffset: 5 }] }} options={{ ...baseOptions, cutout: '68%' }} /></div> : <div className="chart-empty">Pick up a few groceries to see spending by category.</div>}</article>
      <article className="surface-card chart-card"><div className="card-heading"><div><span className="eyebrow">YOUR MONTHLY PLAN</span><h3>Budget check-in</h3></div></div><div className="chart-area chart-doughnut budget-doughnut">{budget > 0 ? <><Doughnut data={{ labels: ['Used', 'Remaining'], datasets: [{ data: [Math.min(currentMonthSpending, budget), Math.max(0, budget - currentMonthSpending)], backgroundColor: ['#7d9d75', '#edf0e9'], borderWidth: 0, hoverOffset: 4 }] }} options={{ ...baseOptions, cutout: '76%', plugins: { ...baseOptions.plugins, legend: { display: false } } }} /><div className="doughnut-center"><strong>{Math.round(utilization)}%</strong><small>of budget</small></div></> : <div className="chart-empty">Set a monthly budget to see your progress.</div>}</div><div className="chart-footnote"><span><i className="legend-dot green-dot" />Spent {money(currentMonthSpending)}</span><span>Limit {money(budget)}</span></div></article>
      <article className="surface-card chart-card chart-wide"><div className="card-heading"><div><span className="eyebrow">THE CHECKLIST VIEW</span><h3>Picked up vs. still to get</h3></div><span className="chart-caption">All items</span></div><div className="chart-area chart-short"><Bar data={{ labels: ['Your list'], datasets: [{ label: 'Picked up', data: [data.purchasedItems], backgroundColor: '#7d9d75', borderRadius: 6 }, { label: 'Still to get', data: [data.pendingItems], backgroundColor: '#e9a98b', borderRadius: 6 }] }} options={{ ...commonOptions, indexAxis: 'y', scales: { x: { ...commonOptions.scales.x, stacked: true, ticks: { precision: 0, color: '#8b9087' } }, y: { ...commonOptions.scales.y, stacked: true, grid: { display: false } } } }} /></div></article>
    </div>
  </section>
}
