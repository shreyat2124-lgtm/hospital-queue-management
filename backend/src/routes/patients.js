const express = require('express');
const { PrismaClient } = require('@prisma/client');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

const router = express.Router();
const prisma = new PrismaClient();

// GET my tokens (PATIENT only)
router.get('/my-tokens', auth, roleCheck(['PATIENT']), async (req, res) => {
  try {
    const patient = await prisma.patient.findUnique({
      where: { userId: req.user.id }
    });

    if (!patient) {
      return res.status(400).json({ error: 'Patient profile not found' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayTokens = await prisma.token.findMany({
      where: { patientId: patient.id, queueDate: today },
      include: {
        Doctor: { include: { User: { select: { name: true } }, Department: true } }
      },
      orderBy: { bookedAt: 'desc' }
    });

    const history = await prisma.token.findMany({
      where: {
        patientId: patient.id,
        queueDate: { lt: today }
      },
      include: {
        Doctor: { include: { User: { select: { name: true } }, Department: true } }
      },
      orderBy: { bookedAt: 'desc' },
      take: 10
    });

    const format = (t) => ({
      tokenNumber: t.tokenNumber,
      doctor: t.Doctor.User.name,
      department: t.Doctor.Department.name,
      status: t.status,
      priority: t.priority,
      estimatedWaitMinutes: t.estimatedWaitMinutes,
      bookedAt: t.bookedAt
    });

    res.json({
      today: todayTokens.map(format),
      history: history.map(format)
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// POST create/update patient profile (PATIENT only)
router.post('/profile', auth, roleCheck(['PATIENT']), async (req, res) => {
  try {
    const { phone, dateOfBirth, bloodGroup } = req.body;

    const patient = await prisma.patient.upsert({
      where: { userId: req.user.id },
      update: { phone, dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined, bloodGroup },
      create: { userId: req.user.id, phone, dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null, bloodGroup }
    });

    res.json({ message: 'Profile updated', patient });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

module.exports = router;