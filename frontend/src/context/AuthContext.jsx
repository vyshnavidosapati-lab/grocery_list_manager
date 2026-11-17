import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('gather_token'))
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('gather_user') || 'null') } catch { return null }
  })
  const [ready, setReady] = useState(!token)

  useEffect(() => {
    if (!token) { setReady(true); return }
    api.get('/users/me')
      .then(({ data }) => { setUser(data); localStorage.setItem('gather_user', JSON.stringify(data)) })
      .catch(() => { localStorage.removeItem('gather_token'); localStorage.removeItem('gather_user'); setToken(null); setUser(null) })
      .finally(() => setReady(true))
  }, [])

  async function authenticate(path, credentials) {
    const { data } = await api.post(path, credentials)
    localStorage.setItem('gather_token', data.token)
    localStorage.setItem('gather_user', JSON.stringify(data.user))
    setToken(data.token)
    setUser(data.user)
    setReady(true)
    return data.user
  }
  const value = useMemo(() => ({
    user, ready, isAuthenticated: Boolean(token),
    login: (credentials) => authenticate('/auth/login', credentials),
    register: (credentials) => authenticate('/auth/register', credentials),
    updateUser: (nextUser) => { setUser(nextUser); localStorage.setItem('gather_user', JSON.stringify(nextUser)) },
    logout: () => { localStorage.removeItem('gather_token'); localStorage.removeItem('gather_user'); setToken(null); setUser(null) },
  }), [user, ready, token])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
