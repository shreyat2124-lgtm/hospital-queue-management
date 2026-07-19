// ============================================
// TOKEN ROUTES — Patient token book karta hai (appointment lena)
// POST /book = Normal token book karo (PATIENT only)
// POST /emergency = Emergency token banao (ADMIN/DOCTOR only)
// ============================================

const express = require('express');
const { PrismaClient } = require('@prisma/client');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const { generateToken } = require('../services/tokenService');
// ↑ Business logic alag file mein hai — route file clean rahti hai

const router = express.Router();
const prisma = new PrismaClient();

// ============================================
// BOOK TOKEN — Patient apna token book kare
// POST /api/tokens/book
// Body: { doctorId, symptoms, priority (optional) }
// Sirf PATIENT kar sakta hai
//
// Flow: Patient bhejta hai → validate karo → tokenService se token banao → response do
// ============================================
router.post('/book', auth, roleCheck(['PATIENT']), async (req, res) => {
  try {
    const { doctorId, symptoms, priority } = req.body;

    // Step 1: Logged-in user ka Patient record dhundho
    // User table aur Patient table alag hain
    // User = login info, Patient = medical info (phone, blood group)
    // req.user.id JWT se aata hai
    const patient = await prisma.patient.findUnique({
      where: { userId: req.user.id }
    });

    // Agar patient profile nahi mili — shayad register kiya but profile nahi banaya
    if (!patient) {
      return res.status(400).json({ error: 'Patient profile not found. Please create your profile first.' });
    }

    // Step 2: Doctor exist karta hai aur available hai?
    // Defensive programming — kabhi bhi client ka input blindly trust mat karo
    // include se doctor ka naam aur department bhi laao (response mein bhejne ke liye)
    const doctor = await prisma.doctor.findUnique({
      where: { id: doctorId },
      include: { User: { select: { name: true } }, Department: true }
    });

    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    if (!doctor.isAvailable) {
      return res.status(400).json({ error: 'Doctor is not available right now' });
    }

    // Step 3: Token generate karo — business logic service file mein hai
    // Service file token number calculate karegi, wait time estimate karegi, DB mein save karegi
    const token = await generateToken(patient.id, doctorId, doctor.departmentId, symptoms, priority);

    // Step 4: Real-time event bhejo — connected clients ko instantly pata chal jayega
    // io.emit() = SAARE connected clients ko message bhejo
    const io = req.app.get('io');
    io.emit('queue-update', { doctorId, event: 'token-booked', tokenNumber: token.tokenNumber });

    // Step 5: Patient ko response do — sab kuch batao
    res.status(201).json({
      message: 'Token booked successfully',
      tokenNumber: token.tokenNumber,
      estimatedWaitMinutes: token.estimatedWaitMinutes,
      position: token.position,
      doctor: doctor.User.name,
      department: doctor.Department.name,
      status: token.status
    });
  } catch (error) {
    console.log(error); // Terminal mein actual error print karo (debugging ke liye)
    res.status(500).json({ error: 'Something went wrong' });
    // Client ko generic message do — internal errors mat dikhao
  }
});

// ============================================
// EMERGENCY TOKEN — Admin ya Doctor emergency patient ka token banaye
// POST /api/tokens/emergency
// Body: { patientEmail, doctorId, symptoms }
// ADMIN aur DOCTOR dono kar sakte hain
//
// Normal se farak: priority automatically EMERGENCY set hoti hai
// Queue mein sabse pehle aayega (priority DESC ordering ki wajah se)
// ============================================
router.post('/emergency', auth, roleCheck(['ADMIN', 'DOCTOR']), async (req, res) => {
  try {
    // Emergency mein patient khud book nahi karta — admin/doctor uska email deta hai
    const { patientEmail, doctorId, symptoms } = req.body;

    // Email se patient dhundho (2 step process: User → Patient)
    const user = await prisma.user.findUnique({ where: { email: patientEmail } });
    if (!user) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    const patient = await prisma.patient.findUnique({ where: { userId: user.id } });
    if (!patient) {
      return res.status(400).json({ error: 'Patient profile not found' });
    }

    const doctor = await prisma.doctor.findUnique({
      where: { id: doctorId },
      include: { User: { select: { name: true } }, Department: true }
    });

    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    // Priority hardcoded 'EMERGENCY' hai — yeh normal booking se farak hai
    const token = await generateToken(patient.id, doctorId, doctor.departmentId, symptoms, 'EMERGENCY');

    // Real-time event — emergency alag event hai taaki frontend red alert dikha sake
    const io = req.app.get('io');
    io.emit('queue-update', { doctorId, event: 'emergency-token', tokenNumber: token.tokenNumber });

    res.status(201).json({
      message: 'EMERGENCY token created',
      tokenNumber: token.tokenNumber,
      estimatedWaitMinutes: 0, // Emergency = turant (queue skip)
      position: 1,
      doctor: doctor.User.name,
      department: doctor.Department.name,
      priority: 'EMERGENCY',
      status: token.status
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

module.exports = router;