import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// ─── PrivateRoute ───────────────────────────────────────────────────
// Wraps around any route that should only be accessible to logged-in
// users. Optionally checks for a specific role.
//
// Usage in App.jsx:
//   <Route path="/admin-dashboard" element={
//     <PrivateRoute roles={['ADMIN']}>
//       <AdminDashboard />
//     </PrivateRoute>
//   } />
//
// How it works:
//   1. If still checking the token (loading) → show nothing (prevents flash)
//   2. If no user is logged in → redirect to /login
//   3. If roles are specified and user's role doesn't match → redirect to /
//   4. Otherwise → render the protected page

export default function PrivateRoute({ children, roles }) {
  const { user, loading } = useAuth()

  // Still verifying the token from localStorage — don't render anything
  // yet. This prevents the login page from flashing briefly before
  // the token verification completes.
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
      </div>
    )
  }

  // Not logged in → go to login page
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Logged in but wrong role → go to home page
  // Example: a PATIENT trying to access /admin-dashboard
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />
  }

  // All checks passed → render the protected component
  return children
}
