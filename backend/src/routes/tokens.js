const express = require('express');
const { PrismaClient } = require('@prisma/client');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const { generateToken } = require('../services/tokenService');

const router = express.Router();
const prisma = new PrismaClient();

// POST book a token (PATIENT only)
router.post('/book', auth, roleCheck(['PATIENT']), async (req, res) => {
  try {
    const { doctorId, symptoms, priority } = req.body;

    // Find the patient record linked to this user
    const patient = await prisma.patient.findUnique({
      where: { userId: req.user.id }
    });

    if (!patient) {
      return res.status(400).json({ error: 'Patient profile not found. Please create your profile first.' });
    }

    // Check if doctor exists and is available
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

    // Generate the token
    const token = await generateToken(patient.id, doctorId, doctor.departmentId, symptoms, priority);

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
    console.log(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

module.exports = router;