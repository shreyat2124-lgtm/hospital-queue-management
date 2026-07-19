// ============================================
// SERVER.JS — Yeh file poore backend ka entry point hai
// Jab "npm run dev" chalate ho, yeh file sabse pehle run hoti hai
// Yeh Express server ko start karti hai aur saari routes ko register karti hai
// ============================================

const express = require('express');       // Express framework — HTTP server banane ke liye
const http = require('http');             // Node.js ka built-in HTTP module — Socket.io ke liye zaroori hai
const { Server } = require('socket.io'); // Socket.io — real-time updates ke liye (jaise WhatsApp messages instantly aate hain)
const cors = require('cors');             // CORS — frontend (port 5173) ko backend (port 3000) se baat karne deta hai
require('dotenv').config();               // .env file se secrets load karta hai (DB password, JWT secret)

// ============================================
// ROUTE FILES IMPORT — har route file ek alag kaam karti hai
// ============================================
const authRoutes = require('./routes/auth');             // Login, Register, Get current user
const departmentRoutes = require('./routes/department'); // Departments create/list karna
const doctorRoutes = require('./routes/doctors');         // Doctors list/availability toggle
const tokenRoutes = require('./routes/tokens');           // Token book karna (patient ka appointment)
const queueRoutes = require('./routes/queues');           // Queue manage karna (doctor calls next patient)
const patientRoutes = require('./routes/patients');       // Patient apne tokens dekh sakta hai

// ============================================
// SERVER SETUP
// ============================================
const app = express(); // Express app banao — yeh hai tumhara server object

// Socket.io ke liye Express app ko HTTP server mein wrap karna padta hai
// Kyunki Socket.io raw HTTP server pe kaam karta hai, Express pe nahi
const server = http.createServer(app);

// Socket.io server banao — real-time communication ke liye
// cors: { origin: '*' } matlab koi bhi frontend connect kar sakta hai
const io = new Server(server, {
  cors: { origin: '*' }
});

// io ko Express app mein store karo taaki routes mein access kar sakein
// app.set('key', value) — Express ka built-in storage hai
// Routes mein req.app.get('io') se access karenge
app.set('io', io);

// Jab koi client (browser) Socket.io se connect karta hai
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id); // socket.id = unique ID har connection ke liye
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// ============================================
// MIDDLEWARES — Ye har request pe automatically chalte hain
// Jaise building ke gate pe security guards — har visitor ko check karte hain
// ============================================
app.use(cors());          // "Doosre ports/domains se requests allow karo"
app.use(express.json());  // "JSON body ko parse karke req.body mein daalo"
                          // Bina iske req.body undefined hoga!

// ============================================
// ROUTES REGISTER — Har route file ko ek URL prefix pe mount karo
// Jaise building mein floors: Floor 1 = auth, Floor 2 = departments...
// ============================================
app.use('/api/auth', authRoutes);             // /api/auth/register, /api/auth/login
app.use('/api/departments', departmentRoutes); // /api/departments (GET/POST)
app.use('/api/doctors', doctorRoutes);         // /api/doctors (GET), /api/doctors/availability (PATCH)
app.use('/api/tokens', tokenRoutes);           // /api/tokens/book, /api/tokens/emergency
app.use('/api/queues', queueRoutes);           // /api/queues/call-next, /api/queues/complete, etc.
app.use('/api/patients', patientRoutes);       // /api/patients/my-tokens, /api/patients/profile

// Health check — server alive hai ya nahi check karne ke liye
// Production mein monitoring tools isse har 30 seconds ping karte hain
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Hospital Queue API is running!' });
});

// ============================================
// SERVER START — Ab server ko chalu karo!
// ============================================
const PORT = process.env.PORT || 3000; // Production mein Railway apna port deta hai, locally 3000 use karo
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});