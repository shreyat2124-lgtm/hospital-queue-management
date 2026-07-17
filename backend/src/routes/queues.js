const express = require('express');
const { PrismaClient } = require('@prisma/client');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

const router = express.Router();
const prisma = new PrismaClient();

// POST call next patient (DOCTOR only)
router.post('/call-next', auth, roleCheck(['DOCTOR']), async (req, res) => {
  try {
    const doctor = await prisma.doctor.findUnique({
      where: { userId: req.user.id }
    });

    if (!doctor) {
      return res.status(404).json({ error: 'Doctor profile not found' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if doctor already has a patient IN_PROGRESS
    const currentPatient = await prisma.token.findFirst({
      where: {
        doctorId: doctor.id,
        queueDate: today,
        status: 'IN_PROGRESS'
      }
    });

    if (currentPatient) {
      return res.status(400).json({ error: 'You already have a patient in progress. Complete them first.' });
    }

    // Get the next WAITING patient (priority DESC, then booked time ASC)
    const nextToken = await prisma.token.findFirst({
      where: {
        doctorId: doctor.id,
        queueDate: today,
        status: 'WAITING'
      },
      orderBy: [
        { priority: 'desc' },
        { bookedAt: 'asc' }
      ],
      include: {
        Patient: {
          include: { User: { select: { name: true } } }
        }
      }
    });

    if (!nextToken) {
      return res.json({ message: 'No patients waiting', patient: null });
    }

    // Update token status to IN_PROGRESS
    const updated = await prisma.token.update({
      where: { id: nextToken.id },
      data: { status: 'IN_PROGRESS', calledAt: new Date() }
    });

    res.json({
      message: 'Patient called',
      token: {
        id: updated.id,
        tokenNumber: updated.tokenNumber,
        patientName: nextToken.Patient.User.name,
        symptoms: updated.symptoms,
        priority: updated.priority,
        status: updated.status
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// POST complete consultation (DOCTOR only)
router.post('/complete', auth, roleCheck(['DOCTOR']), async (req, res) => {
  try {
    const { tokenId, consultationMinutes, notes } = req.body;

    const token = await prisma.token.findUnique({ where: { id: tokenId } });

    if (!token || token.status !== 'IN_PROGRESS') {
      return res.status(400).json({ error: 'No active consultation found for this token' });
    }

    // Mark as completed
    const updated = await prisma.token.update({
      where: { id: tokenId },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
        actualConsultationMinutes: consultationMinutes || null
      }
    });

    res.json({ message: 'Consultation completed', tokenId: updated.id });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// GET queue status for a specific doctor (any logged in user)
router.get('/status/:doctorId', auth, async (req, res) => {
  try {
    const doctorId = parseInt(req.params.doctorId);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const doctor = await prisma.doctor.findUnique({
      where: { id: doctorId },
      include: { User: { select: { name: true } }, Department: true }
    });

    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    const tokens = await prisma.token.findMany({
      where: { doctorId, queueDate: today },
      orderBy: [{ priority: 'desc' }, { bookedAt: 'asc' }],
      include: {
        Patient: { include: { User: { select: { name: true } } } }
      }
    });

    const currentPatient = tokens.find(t => t.status === 'IN_PROGRESS');
    const waiting = tokens.filter(t => t.status === 'WAITING');
    const completed = tokens.filter(t => t.status === 'COMPLETED');

    res.json({
      doctor: doctor.User.name,
      department: doctor.Department.name,
      currentToken: currentPatient ? currentPatient.tokenNumber : null,
      totalWaiting: waiting.length,
      totalCompleted: completed.length,
      queue: waiting.map(t => ({
        tokenNumber: t.tokenNumber,
        patientName: t.Patient.User.name,
        priority: t.priority,
        estimatedWaitMinutes: t.estimatedWaitMinutes
      }))
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// GET doctor's own queue (DOCTOR only)
router.get('/my-queue', auth, roleCheck(['DOCTOR']), async (req, res) => {
  try {
    const doctor = await prisma.doctor.findUnique({
      where: { userId: req.user.id }
    });

    if (!doctor) {
      return res.status(404).json({ error: 'Doctor profile not found' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tokens = await prisma.token.findMany({
      where: { doctorId: doctor.id, queueDate: today },
      orderBy: [{ priority: 'desc' }, { bookedAt: 'asc' }],
      include: {
        Patient: { include: { User: { select: { name: true } } } }
      }
    });

    const currentPatient = tokens.find(t => t.status === 'IN_PROGRESS');
    const upcoming = tokens.filter(t => t.status === 'WAITING');
    const completed = tokens.filter(t => t.status === 'COMPLETED');

    res.json({
      currentPatient: currentPatient ? {
        tokenId: currentPatient.id,
        tokenNumber: currentPatient.tokenNumber,
        name: currentPatient.Patient.User.name,
        symptoms: currentPatient.symptoms,
        priority: currentPatient.priority
      } : null,
      upcoming: upcoming.map(t => ({
        tokenNumber: t.tokenNumber,
        name: t.Patient.User.name,
        symptoms: t.symptoms,
        priority: t.priority
      })),
      completedCount: completed.length,
      remainingCount: upcoming.length
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

module.exports = router;