import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react'
import api from '../api'
import { useNavigate } from 'react-router-dom'

interface AuthCtx {
  token: string | null
  user: { email: string } | null
  login(email: string, password: string): Promise<void>
  register(email: string, password: string): Promise<void>
  logout(): void
}

const Ctx = createContext<AuthCtx>({} as AuthCtx)

export function AuthProvider({ children }: { children: ReactNode }) {
  const nav = useNavigate()
  const [token, setToken] = useState<string|null>(() => localStorage.getItem('token'))
  const [user, setUser]   = useState<{ email: string }|null>(null)

  useEffect(() => {
    const mail = localStorage.getItem('userEmail')
    if (mail) setUser({ email: mail })
  }, [])

  useEffect(() => {
    if (token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    else delete api.defaults.headers.common['Authorization']
  }, [token])

  const login = async (email: string, password: string) => {
    const r = await api.post('/auth/login', { username: email, password })
    setToken(r.data.token)
    setUser({ email })
    localStorage.setItem('token', r.data.token)
    localStorage.setItem('userEmail', email)
    nav('/trainings')
  }

  const register = async (email: string, password: string) => {
    const r = await api.post('/auth/register', { username: email, password })
    setToken(r.data.token)
    setUser({ email })
    localStorage.setItem('token', r.data.token)
    localStorage.setItem('userEmail', email)
    nav('/trainings')
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('userEmail')
    nav('/login')
  }

  return (
    <Ctx.Provider value={{ token, user, login, register, logout }}>
      {children}
    </Ctx.Provider>
  )
}

export const useAuth = () => useContext(Ctx)
