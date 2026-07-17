const express = require('express');
const { PrismaClient } = require('@prisma/client');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

const router = express.Router();
const prisma = new PrismaClient();

// GET all doctors (any logged in user)
router.get('/', auth, async (req, res) => {
  try {
    const { departmentId } = req.query;

    const where = {};
    if (departmentId) {
      where.departmentId = parseInt(departmentId);
    }

    const doctors = await prisma.doctor.findMany({
      where,
      include: {
        User: { select: { name: true, email: true } },
        Department: { select: { name: true } }
      }
    });

    const formatted = doctors.map(doc => ({
      id: doc.id,
      name: doc.User.name,
      email: doc.User.email,
      department: doc.Department.name,
      specialization: doc.specialization,
      avgConsultationMinutes: doc.avgConsultationMinutes,
      isAvailable: doc.isAvailable
    }));

    res.json({ doctors: formatted });
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// PATCH toggle availability (DOCTOR only)
router.patch('/availability', auth, roleCheck(['DOCTOR']), async (req, res) => {
  try {
    const doctor = await prisma.doctor.findUnique({
      where: { userId: req.user.id }
    });

    if (!doctor) {
      return res.status(404).json({ error: 'Doctor profile not found' });
    }

    const updated = await prisma.doctor.update({
      where: { id: doctor.id },
      data: { isAvailable: req.body.isAvailable }
    });

    res.json({ message: 'Availability updated', isAvailable: updated.isAvailable });
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

module.exports = router;