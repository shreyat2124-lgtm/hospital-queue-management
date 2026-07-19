// ============================================
// PATIENT ROUTES — Patient apne tokens aur profile manage kare
// GET /my-tokens = Aaj ke tokens + past history dekho
// POST /profile = Apna profile banao ya update karo (phone, blood group, etc.)
// ============================================

const express = require('express');
const { PrismaClient } = require('@prisma/client');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

const router = express.Router();
const prisma = new PrismaClient();

// ============================================
// MY TOKENS — Patient apne saare tokens dekhe
// GET /api/patients/my-tokens
// Sirf PATIENT dekh sakta hai
//
// Response do parts mein:
//   today = aaj ke tokens (WAITING/IN_PROGRESS/COMPLETED)
//   history = pichle dino ke tokens (last 10)
// ============================================
router.get('/my-tokens', auth, roleCheck(['PATIENT']), async (req, res) => {
  try {
    // Logged-in user ka Patient record dhundho
    const patient = await prisma.patient.findUnique({
      where: { userId: req.user.id }
    });

    if (!patient) {
      return res.status(400).json({ error: 'Patient profile not found' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Aaj ke tokens — queueDate = aaj
    // orderBy: { bookedAt: 'desc' } = newest pehle (descending = bada se chhota)
    const todayTokens = await prisma.token.findMany({
      where: { patientId: patient.id, queueDate: today },
      include: {
        // Token → Doctor → User (doctor ka naam) + Department (department ka naam)
        Doctor: { include: { User: { select: { name: true } }, Department: true } }
      },
      orderBy: { bookedAt: 'desc' }
    });

    // Past history — purane tokens (aaj se pehle ke)
    const history = await prisma.token.findMany({
      where: {
        patientId: patient.id,
        queueDate: { lt: today }
        // lt = "less than" = aaj se pehle ke saare dates
        // Prisma ke comparison operators:
        //   lt = less than (<)
        //   lte = less than or equal (<=)
        //   gt = greater than (>)
        //   gte = greater than or equal (>=)
      },
      include: {
        Doctor: { include: { User: { select: { name: true } }, Department: true } }
      },
      orderBy: { bookedAt: 'desc' },
      take: 10
      // take = sirf 10 results laao (SQL: LIMIT 10)
      // Hazaaron purane tokens load karne ki zaroorat nahi
    });

    // Reusable formatter function — DRY principle (Don't Repeat Yourself)
    // Ek hi format function banao, dono arrays pe use karo
    // Bina iske same .map() code do baar likhna padta
    const format = (t) => ({
      tokenNumber: t.tokenNumber,
      doctor: t.Doctor.User.name,        // 3-level deep: Token → Doctor → User → name
      department: t.Doctor.Department.name, // Token → Doctor → Department → name
      status: t.status,
      priority: t.priority,
      estimatedWaitMinutes: t.estimatedWaitMinutes,
      bookedAt: t.bookedAt
    });

    res.json({
      today: todayTokens.map(format),   // Aaj ke tokens formatted
      history: history.map(format)       // Purane tokens formatted
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// ============================================
// UPDATE PROFILE — Patient apna profile banaye/update kare
// POST /api/patients/profile
// Body: { phone, dateOfBirth, bloodGroup }
// Sirf PATIENT
//
// upsert = update + insert
//   Agar profile exist karti hai → UPDATE karo
//   Agar nahi hai → CREATE karo
// Ek endpoint dono kaam karti hai — smart!
// ============================================
router.post('/profile', auth, roleCheck(['PATIENT']), async (req, res) => {
  try {
    const { phone, dateOfBirth, bloodGroup } = req.body;

    const patient = await prisma.patient.upsert({
      where: { userId: req.user.id },
      // UPDATE case: sirf wahi fields update karo jo bheje hain
      update: {
        phone,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
        // undefined = "is field ko mat chhuo" (Prisma skip kar dega)
        bloodGroup
      },
      // CREATE case: naya record banao
      create: {
        userId: req.user.id,
        phone,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        // null = "is field ko khaali chhodo" (database mein NULL store hoga)
        // undefined vs null:
        //   undefined (update mein) = "field ko touch mat karo"
        //   null (create mein) = "field empty hai"
        bloodGroup
      }
    });

    res.json({ message: 'Profile updated', patient });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

module.exports = router;