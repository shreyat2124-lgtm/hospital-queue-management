import { io } from 'socket.io-client'

// ─── What is this? ──────────────────────────────────────────────────
// This creates a Socket.io client that connects to your Express backend.
// Unlike REST (you ask → server responds), a WebSocket is a 2-way pipe:
// the server can PUSH data to you without you asking.
//
// Your backend's server.js already has Socket.io set up. When a doctor
// calls the next patient or completes a consultation, the backend does:
//   io.emit('queue-updated', { doctorId: 1 })
//
// This socket will HEAR that event in real-time.

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000'

// ─── Create the socket instance ─────────────────────────────────────
// autoConnect: false → we don't connect immediately when the file loads.
// We'll connect only when the user is logged in (from AuthContext).
// This prevents unnecessary connections from unauthenticated users.
const socket = io(SOCKET_URL, {
  autoConnect: false,
})

export default socket
