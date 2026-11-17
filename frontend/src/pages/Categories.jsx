import { useEffect, useState } from 'react'
import api, { getErrorMessage } from '../services/api'
import { useToast } from '../context/ToastContext'

const colors = ['mint', 'peach', 'butter', 'lilac', 'blue', 'pink', 'sage', 'sand']
export default function Categories() {
  const toast = useToast()
  const [categories, setCategories] = useState([])
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  async function load() {
    try { setCategories((await api.get('/categories')).data); setError('') }
    catch (failure) { setError(getErrorMessage(failure)) }
  }
  useEffect(() => { load() }, [])
  async function addCategory(event) {
    event.preventDefault()
    setBusy(true)
    try { await api.post('/categories', { name }); setName(''); toast('Category added to your collection.'); await load() }
    catch (failure) { toast(getErrorMessage(failure), 'error') }
    finally { setBusy(false) }
  }
  return <section className="page-stack">
    <div className="page-intro-row"><div><span className="eyebrow">YOUR OWN LITTLE WAY TO ORGANIZE</span><h2>Categories<span className="green-period">.</span></h2><p>Keep your list tidy, your way.</p></div></div>
    <form className="surface-card category-create" onSubmit={addCategory}><div><span className="eyebrow">MAKE IT PERSONAL</span><h3>Add a category</h3><p>Create a category that fits your shopping habits.</p></div><div className="category-add-fields"><input aria-label="New category name" required maxLength="60" placeholder="e.g. Weekend treats" value={name} onChange={(e) => setName(e.target.value)} /><button className="primary-button" disabled={busy || !name.trim()}>{busy ? 'Adding…' : '＋ Add category'}</button></div></form>
    {error && <div className="alert alert-error">{error}<button onClick={load} className="text-button">Try again</button></div>}
    <div className="category-grid">{categories.map((category, index) => <article key={category.id} className="surface-card category-card"><span className={`category-art ${colors[index % colors.length]}`}>{category.name.toLowerCase().includes('fruit') ? '◉' : category.name.toLowerCase().includes('dairy') ? '◌' : category.name.toLowerCase().includes('household') ? '⌂' : ['✳', '◍', '◌', '⌑', '◉'][index % 5]}</span><div><h3>{category.name}</h3><p>Ready to fill with favorites</p></div><span className="category-arrow">↗</span></article>)}</div>
  </section>
}
