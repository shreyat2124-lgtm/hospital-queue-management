import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'
import socket from '../services/socket'

// ─── 1. Create the Context ─────────────────────────────────────────
// Think of a Context as a "global variable" for React. Any component
// wrapped inside <AuthProvider> can access the user, token, and
// login/logout functions without passing props down manually.
const AuthContext = createContext(null)

// ─── 2. The Provider Component ──────────────────────────────────────
// This component wraps your entire app (in App.jsx). It manages:
//   - user: the logged-in user object { id, name, email, role }
//   - token: the JWT string
//   - loading: whether we're still checking if the user is logged in
//   - login(): called when user submits the login form
//   - logout(): called when user clicks logout
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)

  // ─── 3. Check existing token on app load ────────────────────────
  // When the app first opens, we check: is there a token in localStorage?
  // If yes, we call GET /api/auth/me to verify it's still valid and
  // get the user's info. If the token is expired/invalid, the API will
  // return 401 and our interceptor will clear it.
  //
  // This is why you stay logged in after refreshing the page.
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setLoading(false)
        return
      }

      try {
        const { data } = await api.get('/auth/me')
        setUser(data.user || data)
        socket.connect()  // Connect WebSocket once we know user is valid
      } catch (error) {
        // Token is invalid or expired — clean up
        console.error('Token verification failed:', error)
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setToken(null)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    verifyToken()
  }, [token])

  // ─── 4. Login Function ──────────────────────────────────────────
  // Called from Login.jsx when the user submits the form.
  // Sends email + password to backend → receives JWT + user object.
  // Stores both in state AND localStorage (so they persist on refresh).
  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password })

    // Store in localStorage (persists across page refreshes)
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))

    // Store in React state (triggers re-renders)
    setToken(data.token)
    setUser(data.user)

    // Now that user is authenticated, connect the WebSocket
    socket.connect()

    return data.user  // Return user so Login.jsx can redirect by role
  }

  // ─── 5. Logout Function ─────────────────────────────────────────
  // Clears everything: localStorage, React state, WebSocket connection.
  // After this, the user is fully logged out and PrivateRoute will
  // redirect them to /login.
  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
    socket.disconnect()
  }

  // ─── 6. Provide the values to all children ──────────────────────
  // Any component that calls useAuth() will get access to these values.
  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// ─── 7. Custom Hook ─────────────────────────────────────────────────
// Instead of writing useContext(AuthContext) everywhere, we create a
// shortcut: useAuth(). Usage in any component:
//
//   const { user, login, logout } = useAuth()
//
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
