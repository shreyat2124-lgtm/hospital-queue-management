// ============================================
// AUTH ROUTES — Login, Register, aur "Main kaun hoon?" (Get current user)
// Yeh public routes hain (register/login pe auth middleware nahi lagta)
// /me route protected hai — token chahiye
// ============================================

const express = require('express');
const bcrypt = require('bcryptjs');               // Password hashing — plain text mein save nahi karte
const jwt = require('jsonwebtoken');              // JWT tokens banane ke liye
const { PrismaClient } = require('@prisma/client'); // Database se baat karne ke liye
const auth = require('../middleware/auth');         // Protected routes ke liye middleware

const router = express.Router();  // Mini Express app — yeh /api/auth ke neeche mount hoga
const prisma = new PrismaClient(); // Database connection

// ============================================
// REGISTER — Naya user account banao
// POST /api/auth/register
// Body: { name, email, password, role }
// ============================================
router.post('/register', async (req, res) => {
  // req.body se data nikalo (express.json() middleware ne JSON parse karke yahan daala hai)
  // Destructuring — ek line mein 4 variables bana diye
  const { name, email, password, role } = req.body;

  try {
    // Step 1: Pehle check karo ki yeh email already registered toh nahi hai
    // findUnique = ek hi record dhundho (email @unique hai schema mein)
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
      // 400 = Bad Request = "Tera input galat hai"
    }

    // Step 2: Password ko hash karo
    // "admin123" → "$2a$10$N9qo8uLOickgx2ZMRZoMy..." (irreversible!)
    // 10 = salt rounds — zyada rounds = zyada secure but slow
    // Hash one-way hai — paper shredder jaisa — wapas nahi aa sakta
    const passwordHash = await bcrypt.hash(password, 10);

    // Step 3: User ko database mein save karo
    // prisma.user.create() internally yeh SQL chalata hai:
    // INSERT INTO "User" (name, email, "passwordHash", role) VALUES (...)
    const user = await prisma.user.create({
      data: { name, email, passwordHash, role }
    });

    // Step 4: Response bhejo — password hash KABHI mat bhejo response mein!
    // 201 = Created = "Naya resource successfully bana diya"
    res.status(201).json({ message: 'Registration successful', user: { id: user.id, name: user.name, role: user.role } });
  } catch (error) {
    // Kuch bhi galat ho toh generic error bhejo
    // Internal error details client ko mat dikhao — security risk hai
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// ============================================
// LOGIN — Email + password se JWT token lo
// POST /api/auth/login
// Body: { email, password }
// ============================================
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Step 1: Email se user dhundho
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
      // SECURITY: "Email not found" mat bolo — hacker ko pata chal jayega ki kaunse emails exist karte hain
      // Dono cases mein same vague message do
    }

    // Step 2: Password compare karo
    // bcrypt.compare() kya karta hai:
    // 1. Plain password ("admin123") ko hash karta hai same method se
    // 2. Naye hash ko stored hash se compare karta hai
    // 3. Match → true, No match → false
    // Yeh password ko "unhash" NAHI karta — sirf compare karta hai
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
      // Same vague message — attacker ko clue mat do
    }

    // Step 3: JWT token banao
    // jwt.sign(payload, secret, options)
    // payload = yeh data token ke andar store hoga (readable hai, encrypted nahi!)
    // secret = server ka private key — isse signature banta hai
    // expiresIn = 24 ghante baad token expire ho jayega
    const token = jwt.sign(
      { id: user.id, name: user.name, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Token aur user info bhejo — frontend isko store karega
    // Har future request mein yeh token Authorization header mein bhejega
    res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// ============================================
// GET ME — "Main kaun hoon?" (Protected route)
// GET /api/auth/me
// Headers: Authorization: Bearer <token>
// ============================================
router.get('/me', auth, (req, res) => {
  // auth middleware pehle chalta hai:
  //   1. Token verify karta hai
  //   2. req.user mein decoded data daalta hai
  // Agar yahan tak pahunche toh matlab token valid hai
  // Bas req.user return kar do — frontend ko user ki info mil jayegi
  res.json({ user: req.user });
});

module.exports = router;