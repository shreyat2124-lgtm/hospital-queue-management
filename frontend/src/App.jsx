import { BrowserRouter, Routes, Route } from 'react-router-dom'
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
      <div className="w-full min-h-screen flex flex-col">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/departments" element={<Departments />} />
          <Route path="/queue" element={<QueueDashboard />} />
          <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/book-appointment" element={<BookingScreen />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
