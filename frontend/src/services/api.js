import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

// ─── 1. Create the Axios instance ───────────────────────────────────
// Think of this as a "customized fetch" that remembers your settings.
// Every API call you make in the entire app will go through this.
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',   // We're always sending JSON
  },
})

// ─── 2. Request Interceptor ─────────────────────────────────────────
// This runs BEFORE every request leaves the browser.
// It grabs the JWT token from localStorage and attaches it to the
// Authorization header. Without this, your backend's auth middleware
// would reject every request with "401 Unauthorized".
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// ─── 3. Response Interceptor ────────────────────────────────────────
// This runs AFTER every response comes back from the server.
// If the server says "401 Unauthorized" (meaning the token is expired
// or invalid), we automatically clear the stored token and redirect
// the user to the login page. This prevents the app from being stuck
// in a broken state where the user thinks they're logged in but
// every API call is silently failing.
api.interceptors.response.use(
  (response) => response,  // If response is OK (200), just pass it through
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'  // Force redirect to login
    }
    return Promise.reject(error)
  }
)

export default api
