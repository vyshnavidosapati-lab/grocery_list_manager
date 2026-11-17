import { useCallback, useEffect, useState } from 'react'
import api, { getErrorMessage } from '../services/api'
import { useToast } from '../context/ToastContext'

const blankItem = () => ({ name: '', category: '', quantity: 1, unit: 'pcs', price: '', priority: 'medium', purchased: false, purchaseDate: '' })
const money = (amount) => `₹${Number(amount || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`
const localDate = () => {
  const date = new Date()
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export default function Items() {
  const toast = useToast()
  const [items, setItems] = useState([])
  const [categories, setCategories] = useState([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [sort, setSort] = useState('')
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(blankItem())
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const load = useCallback(async () => {
    setError('')
    try {
      const [itemsResponse, categoryResponse] = await Promise.all([
        api.get('/items', { params: { search: search || undefined, category: category || undefined, sort: sort || undefined } }),
        api.get('/categories'),
      ])
      setItems(itemsResponse.data)
      setCategories(categoryResponse.data)
    } catch (failure) { setError(getErrorMessage(failure)) }
    finally { setLoading(false) }
  }, [search, category, sort])
  useEffect(() => { load() }, [load])

  function openForm(item = null) {
    setEditing(item?.id ?? null)
    setForm(item ? { ...item, price: String(item.price), purchaseDate: item.purchaseDate || '' } : { ...blankItem(), category: categories[0]?.name || '' })
    setShowModal(true)
  }
  async function submit(event) {
    event.preventDefault()
    setBusy(true)
    try {
      const payload = { ...form, quantity: Number(form.quantity), price: Number(form.price), purchaseDate: form.purchased ? (form.purchaseDate || localDate()) : null }
      if (editing) await api.put(`/items/${editing}`, payload)
      else await api.post('/items', payload)
      toast(editing ? 'Grocery item updated.' : 'Added to your grocery list.')
      setEditing(null)
      setShowModal(false)
      await load()
    } catch (failure) { toast(getErrorMessage(failure), 'error') }
    finally { setBusy(false) }
  }
  async function toggle(item) {
    try { await api.patch(`/items/${item.id}/status`, null, { params: { purchased: !item.purchased } }); toast(item.purchased ? 'Moved back to your list.' : 'Marked as picked up.'); await load() }
    catch (failure) { toast(getErrorMessage(failure), 'error') }
  }
  async function remove(item) {
    if (!window.confirm(`Remove ${item.name} from your list?`)) return
    try { await api.delete(`/items/${item.id}`); toast('Item removed.'); await load() }
    catch (failure) { toast(getErrorMessage(failure), 'error') }
  }
  return <section className="page-stack">
    <div className="page-intro-row"><div><span className="eyebrow">KEEP THE LITTLE THINGS IN ONE PLACE</span><h2>Your grocery list<span className="green-period">.</span></h2><p>{items.length} {items.length === 1 ? 'item' : 'items'} to make your next shop easier.</p></div><button className="primary-button" onClick={() => openForm()}>+ Add grocery</button></div>
    <div className="filter-bar">
      <label className="search-input"><span>⌕</span><input aria-label="Search groceries" placeholder="Find something on your list…" value={search} onChange={(event) => setSearch(event.target.value)} /></label>
      <select aria-label="Filter by category" value={category} onChange={(event) => setCategory(event.target.value)}><option value="">All categories</option>{categories.map((option) => <option key={option.id} value={option.name}>{option.name}</option>)}</select>
      <select aria-label="Sort groceries" value={sort} onChange={(event) => setSort(event.target.value)}><option value="">Recently added</option><option value="name">Name A–Z</option><option value="price">Price: low to high</option></select>
    </div>
    <div className="surface-card table-card">
      {error && <div className="alert alert-error">{error}<button className="text-button" onClick={load}>Try again</button></div>}
      {loading ? <div className="loading-inline"><span className="spinner" /> Loading your list…</div> : items.length ? <div className="table-scroll"><table className="data-table"><thead><tr><th>ITEM</th><th>CATEGORY</th><th>QUANTITY</th><th>PRICE</th><th>PRIORITY</th><th>STATUS</th><th><span className="sr-only">Actions</span></th></tr></thead><tbody>
        {items.map((item) => <tr key={item.id} className={item.purchased ? 'row-purchased' : ''}>
          <td><div className="item-cell"><button className={`check-mark ${item.purchased ? 'checked' : ''}`} onClick={() => toggle(item)} title={item.purchased ? 'Mark pending' : 'Mark purchased'}>{item.purchased ? '✓' : ''}</button><span><strong className={item.purchased ? 'crossed' : ''}>{item.name}</strong>{item.purchased && item.purchaseDate && <small>Picked up {new Date(`${item.purchaseDate}T00:00:00`).toLocaleDateString()}</small>}</span></div></td>
          <td><span className="category-chip">{item.category}</span></td><td>{item.quantity} <span className="muted">{item.unit}</span></td><td className="money-cell">{money(item.price * item.quantity)}</td>
          <td><span className={`priority priority-${item.priority}`}>{item.priority}</span></td><td><span className={`status-pill ${item.purchased ? 'status-done' : 'status-pending'}`}>{item.purchased ? 'Picked up' : 'To get'}</span></td>
          <td><div className="row-actions"><button title="Edit item" aria-label={`Edit ${item.name}`} onClick={() => openForm(item)}>✎</button><button title="Delete item" aria-label={`Delete ${item.name}`} onClick={() => remove(item)}>×</button></div></td>
        </tr>)}
      </tbody></table></div> : <div className="empty-state"><span className="empty-icon">✳</span><h3>{search || category ? 'Nothing matched this time.' : 'Your list is a blank canvas.'}</h3><p>{search || category ? 'Try another search or category.' : 'Add your first grocery and make your next shop a little easier.'}</p>{!search && !category && <button className="primary-button" onClick={() => openForm()}>+ Add your first item</button>}</div>}
    </div>
    {showModal && <ItemModal title={editing !== null ? 'Edit grocery item' : 'Add a grocery item'} form={form} setForm={setForm} categories={categories}
      onClose={() => { setShowModal(false); setEditing(null) }} onSubmit={submit} busy={busy} />}
  </section>
}

function ItemModal({ title, form, setForm, categories, onClose, onSubmit, busy }) {
  const change = (key, value) => setForm((current) => ({ ...current, [key]: value }))
  return <div className="modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}><section className="modal-card" role="dialog" aria-modal="true" aria-labelledby="item-modal-title">
    <div className="modal-heading"><div><span className="eyebrow">MAKE YOUR LIST YOURS</span><h3 id="item-modal-title">{title}</h3></div><button className="modal-close" onClick={onClose} aria-label="Close dialog">×</button></div>
    <form className="form-grid" onSubmit={onSubmit}>
      <label className="field-wide">Item name<input autoFocus required maxLength="100" placeholder="e.g. Ripe avocados" value={form.name} onChange={(e) => change('name', e.target.value)} /></label>
      <label>Category<select required value={form.category} onChange={(e) => change('category', e.target.value)}><option value="" disabled>Choose a category</option>{categories.map((item) => <option key={item.id} value={item.name}>{item.name}</option>)}</select>{!categories.length && <small className="field-hint">Add a category before creating an item.</small>}</label>
      <label>Priority<select value={form.priority} onChange={(e) => change('priority', e.target.value)}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></label>
      <label>Quantity<input type="number" min="1" max="10000" required value={form.quantity} onChange={(e) => change('quantity', e.target.value)} /></label>
      <label>Unit<input required maxLength="20" placeholder="pcs, kg, L…" value={form.unit} onChange={(e) => change('unit', e.target.value)} /></label>
      <label className="field-wide">Price per unit (₹)<input type="number" min="0" step="0.01" required value={form.price} onChange={(e) => change('price', e.target.value)} /></label>
      <label className="checkbox-field field-wide"><input type="checkbox" checked={form.purchased} onChange={(e) => change('purchased', e.target.checked)} /> I've already picked this up</label>
      {form.purchased && <label className="field-wide">Purchase date<input type="date" value={form.purchaseDate || ''} onChange={(e) => change('purchaseDate', e.target.value)} /></label>}
      <div className="modal-actions field-wide"><button type="button" className="secondary-button" onClick={onClose}>Cancel</button><button className="primary-button" disabled={busy || !categories.length}>{busy ? 'Saving…' : 'Save item'}</button></div>
    </form>
  </section></div>
}
