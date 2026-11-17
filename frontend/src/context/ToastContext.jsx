import { createContext, useContext, useState } from 'react'

const ToastContext = createContext(() => {})
export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null)
  function showToast(message, type = 'success') {
    setToast({ message, type })
    window.clearTimeout(showToast.timer)
    showToast.timer = window.setTimeout(() => setToast(null), 3200)
  }
  return <ToastContext.Provider value={showToast}>{children}{toast && <div className={`toast toast-${toast.type}`} role="status">{toast.message}</div>}</ToastContext.Provider>
}
export const useToast = () => useContext(ToastContext)
