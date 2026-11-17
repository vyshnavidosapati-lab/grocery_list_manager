import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute() {
  const { ready, isAuthenticated } = useAuth()
  if (!ready) return <div className="loading-screen"><span className="spinner" /> Loading your space…</div>
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}
