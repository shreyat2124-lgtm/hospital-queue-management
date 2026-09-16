// ============================================
// DOCTOR ROUTES — Doctors ki list dekho aur availability toggle karo
// GET / = saare doctors (filter by department bhi kar sakte ho)
// PATCH /availability = doctor apni availability on/off kar sakta hai
// ============================================

const express = require('express');
const { PrismaClient } = require('@prisma/client');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const bcrypt = require('bcryptjs');

const router = express.Router();
const prisma = new PrismaClient();

// ============================================
// GET ALL DOCTORS — Saare doctors ki list
// GET /api/doctors
// Optional filter: GET /api/doctors?departmentId=1 (sirf Cardiology ke doctors)
// Koi bhi logged in user dekh sakta hai
// ============================================
router.get('/', auth, async (req, res) => {
  try {
    // req.query = URL ke baad ? ke saath jo aata hai
    // /api/doctors?departmentId=1 → req.query = { departmentId: "1" }
    const { departmentId } = req.query;

    // Dynamic filter banao — agar departmentId diya toh filter karo, nahi toh sab laao
    const where = {};
    if (departmentId) {
      // parseInt() = string "1" ko number 1 mein convert karo
      // Query params hamesha strings hote hain, database ko number chahiye
      where.departmentId = parseInt(departmentId);
    }

    // findMany = saare matching records laao
    const doctors = await prisma.doctor.findMany({
      where,
      // include = related tables ka data bhi laao
      // Doctor table mein sirf userId hai — actual naam User table mein hai
      include: {
        // select = sirf yeh specific fields laao (password hash mat laao!)
        User: { select: { name: true, email: true } },
        Department: { select: { name: true } }
      }
    });

    // Response ko clean format mein bhejo
    // Raw Prisma response nested hota hai: doc.User.name
    // Frontend ke liye flat format better hai: doc.name
    // .map() = har element ko transform karo nayi array mein
    const formatted = doctors.map(doc => ({
      id: doc.id,
      name: doc.User.name,         // User table se naam
      email: doc.User.email,       // User table se email
      department: doc.Department.name, // Department table se department naam
      specialization: doc.specialization,
      avgConsultationMinutes: doc.avgConsultationMinutes,
      isAvailable: doc.isAvailable
    }));
    // NOTE: (doc => ({...})) mein extra () zaroori hai
    // Bina () ke JS {  } ko code block samjhega, object nahi

    res.json({ doctors: formatted });
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// ============================================
// TOGGLE AVAILABILITY — Doctor apni availability on/off kare
// PATCH /api/doctors/availability
// Body: { isAvailable: true/false }
// Sirf DOCTOR kar sakta hai
// ============================================
router.patch('/availability', auth, roleCheck(['DOCTOR']), async (req, res) => {
  try {
    // Logged-in user ka doctor record dhundho
    // req.user.id = JWT se aaya hai (auth middleware ne set kiya)
    // userId se Doctor table mein search karo
    const doctor = await prisma.doctor.findUnique({
      where: { userId: req.user.id }
    });

    if (!doctor) {
      return res.status(404).json({ error: 'Doctor profile not found' });
    }

    // Doctor ka isAvailable field update karo
    // update() = existing record modify karo (SQL: UPDATE ... SET ... WHERE ...)
    const updated = await prisma.doctor.update({
      where: { id: doctor.id },
      data: { isAvailable: req.body.isAvailable }
    });

    res.json({ message: 'Availability updated', isAvailable: updated.isAvailable });
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// ============================================
// CREATE DOCTOR — Naya doctor add karo
// POST /api/doctors
// Body: { name, email, password, departmentId, specialization, avgConsultationMinutes }
// Sirf ADMIN kar sakta hai
// ============================================
router.post('/', auth, roleCheck(['ADMIN']), async (req, res) => {
  try {
    const { name, email, password, departmentId, specialization, avgConsultationMinutes } = req.body;
    
    // Check if email already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // Use transaction to create both User and Doctor atomically
    const newDoctor = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: { name, email, passwordHash, role: 'DOCTOR' }
      });
      
      const doctor = await tx.doctor.create({
        data: {
          userId: user.id,
          departmentId: parseInt(departmentId),
          specialization,
          avgConsultationMinutes: parseInt(avgConsultationMinutes || 15)
        }
      });
      
      return doctor;
    });

    res.status(201).json({ message: 'Doctor created successfully', doctorId: newDoctor.id });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to create doctor' });
  }
});

// ============================================
// DELETE DOCTOR — Doctor delete karo
// DELETE /api/doctors/:id
// Sirf ADMIN kar sakta hai
// ============================================
router.delete('/:id', auth, roleCheck(['ADMIN']), async (req, res) => {
  try {
    const doctorId = parseInt(req.params.id);
    
    const doctor = await prisma.doctor.findUnique({ where: { id: doctorId } });
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    // Delete doctor and user in transaction
    await prisma.$transaction([
      prisma.doctor.delete({ where: { id: doctorId } }),
      prisma.user.delete({ where: { id: doctor.userId } })
    ]);

    res.json({ message: 'Doctor deleted successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to delete doctor (might have tokens assigned)' });
  }
});

module.exports = router;