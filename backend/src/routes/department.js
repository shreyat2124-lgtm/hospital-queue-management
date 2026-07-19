// ============================================
// DEPARTMENT ROUTES — Hospital ke departments manage karna
// Jaise Cardiology, Neurology, Orthopedics
// GET = saare departments dekho (koi bhi logged in user)
// POST = naya department banao (sirf ADMIN)
// ============================================

const express = require('express');
const { PrismaClient } = require('@prisma/client');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

const router = express.Router();
const prisma = new PrismaClient();

// ============================================
// GET ALL DEPARTMENTS — Saare departments ki list do
// GET /api/departments
// Koi bhi logged in user dekh sakta hai (patient, doctor, admin)
// ============================================
router.get('/', auth, async (req, res) => {
  try {
    // findMany() = saare records laao (SQL: SELECT * FROM "Department")
    const departments = await prisma.department.findMany();
    res.json({ departments });
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// ============================================
// CREATE DEPARTMENT — Naya department banao
// POST /api/departments
// Body: { name, description }
// Sirf ADMIN kar sakta hai — roleCheck(['ADMIN']) check karta hai
// ============================================
router.post('/', auth, roleCheck(['ADMIN']), async (req, res) => {
  const { name, description } = req.body;
  try {
    // Department create karo database mein
    // name @unique hai schema mein — duplicate department nahi ban sakta
    const department = await prisma.department.create({
      data: { name, description }
    });
    // 201 = Created successfully
    res.status(201).json({ department });
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

module.exports = router;