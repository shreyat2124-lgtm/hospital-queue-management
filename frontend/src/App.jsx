import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import PrivateRoute from './components/PrivateRoute'
import LandingPage from './components/LandingPage'
import Login from './components/Login'
import Departments from './components/Departments'
import QueueDashboard from './components/QueueDashboard'
import DoctorDashboard from './components/DoctorDashboard'
import AdminDashboard from './components/AdminDashboard'
import BookingScreen from './components/BookingScreen'

function App() {
  return (
    <BrowserRouter>
      {/* AuthProvider wraps EVERYTHING so any component can call useAuth() */}
      <AuthProvider>
        <div className="w-full min-h-screen flex flex-col">
          <Routes>
            {/* ── Public Routes ── */}
            {/* Anyone can see these, even without logging in */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/departments" element={<Departments />} />
            <Route path="/queue" element={<QueueDashboard />} />

            {/* ── Protected Routes ── */}
            {/* These require login. The roles array controls WHO can access. */}
            <Route path="/doctor-dashboard" element={
              <PrivateRoute roles={['DOCTOR']}>
                <DoctorDashboard />
              </PrivateRoute>
            } />
            <Route path="/admin-dashboard" element={
              <PrivateRoute roles={['ADMIN']}>
                <AdminDashboard />
              </PrivateRoute>
            } />
            <Route path="/book-appointment" element={
              <PrivateRoute roles={['PATIENT']}>
                <BookingScreen />
              </PrivateRoute>
            } />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
