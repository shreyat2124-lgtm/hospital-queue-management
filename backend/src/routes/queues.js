// ============================================
// QUEUE ROUTES — Doctor ka queue manage karo
// Yeh file hospital ka CORE hai — yahan se doctor patients ko call karta hai
//
// Endpoints:
//   POST /call-next = Agla patient bulao (DOCTOR only)
//   POST /complete = Consultation khatam karo (DOCTOR only)
//   GET /status/:doctorId = Queue status dekho (koi bhi logged in user)
//   GET /my-queue = Doctor apni queue dekhe (DOCTOR only)
//
// TOKEN STATE MACHINE (har token in states se guzarta hai):
//   WAITING ──→ IN_PROGRESS ──→ COMPLETED
//      │
//      └──→ CANCELLED (agar patient chala gaya)
// ============================================

const express = require('express');
const { PrismaClient } = require('@prisma/client');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

const router = express.Router();
const prisma = new PrismaClient();

// ============================================
// CALL NEXT PATIENT — Doctor agla patient bulaye
// POST /api/queues/call-next
// Body: (kuch nahi chahiye)
// Sirf DOCTOR kar sakta hai
//
// Logic:
// 1. Pehle check karo ki doctor ke paas already koi IN_PROGRESS toh nahi hai
// 2. Priority queue se agla patient uthao (EMERGENCY > URGENT > NORMAL)
// 3. Us token ka status WAITING → IN_PROGRESS karo
// ============================================
router.post('/call-next', auth, roleCheck(['DOCTOR']), async (req, res) => {
  try {
    // Logged-in user ka doctor record dhundho
    const doctor = await prisma.doctor.findUnique({
      where: { userId: req.user.id }
    });

    if (!doctor) {
      return res.status(404).json({ error: 'Doctor profile not found' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // BUSINESS RULE: Ek time pe sirf ek patient dekh sakte ho
    // Pehle current patient complete karo, phir next bulao
    // findFirst = pehla matching record do (findUnique jaisa but unique field zaroori nahi)
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

    // PRIORITY QUEUE — Yeh smart part hai!
    // orderBy se decide hota hai ki kaun pehle aayega:
    // 1. priority: 'desc' = EMERGENCY sabse pehle, phir URGENT, phir NORMAL
    // 2. bookedAt: 'asc' = Same priority mein jo pehle aaya woh pehle
    //
    // Toh order hoga:
    //   1. EMERGENCY patients (jo pehle book hua woh pehle)
    //   2. URGENT patients (jo pehle book hua woh pehle)
    //   3. NORMAL patients (jo pehle book hua woh pehle)
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
      // 3-level deep include: Token → Patient → User → name
      // Token mein patientId hai, Patient mein userId hai, User mein name hai
      include: {
        Patient: {
          include: { User: { select: { name: true } } }
        }
      }
    });

    // Queue khaali hai — koi wait nahi kar raha
    if (!nextToken) {
      return res.json({ message: 'No patients waiting', patient: null });
      // Yeh error nahi hai (200 OK), bas information hai
    }

    // STATE TRANSITION: WAITING → IN_PROGRESS
    // calledAt = abhi ka time record karo (analytics ke liye useful)
    const updated = await prisma.token.update({
      where: { id: nextToken.id },
      data: { status: 'IN_PROGRESS', calledAt: new Date() }
    });

    // Real-time event — display screen pe instantly dikhai dega
    const io = req.app.get('io');
    io.emit('queue-update', { doctorId: doctor.id, event: 'patient-called', tokenNumber: updated.tokenNumber });

    // Doctor ko batao ki kisko bulaaya — naam, symptoms, priority sab
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

// ============================================
// COMPLETE CONSULTATION — Doctor ne patient dekh liya
// POST /api/queues/complete
// Body: { tokenId, consultationMinutes (optional) }
// Sirf DOCTOR kar sakta hai
//
// STATE TRANSITION: IN_PROGRESS → COMPLETED
// ============================================
router.post('/complete', auth, roleCheck(['DOCTOR']), async (req, res) => {
  try {
    const { tokenId, consultationMinutes, notes } = req.body;

    // Token dhundho aur check karo ki woh IN_PROGRESS hai
    // Tum WAITING ya COMPLETED token complete nahi kar sakte
    const token = await prisma.token.findUnique({ where: { id: tokenId } });

    if (!token || token.status !== 'IN_PROGRESS') {
      return res.status(400).json({ error: 'No active consultation found for this token' });
    }

    // STATE TRANSITION: IN_PROGRESS → COMPLETED
    // completedAt = completion ka time (analytics ke liye)
    // actualConsultationMinutes = kitna time laga (future wait time predictions improve karne ke liye)
    const updated = await prisma.token.update({
      where: { id: tokenId },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
        actualConsultationMinutes: consultationMinutes || null
        // || null = agar nahi diya toh NULL store karo
      }
    });

    // Real-time event — queue display update hoga
    const io = req.app.get('io');
    io.emit('queue-update', { doctorId: token.doctorId, event: 'consultation-completed', tokenId: updated.id });

    res.json({ message: 'Consultation completed', tokenId: updated.id });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// ============================================
// QUEUE STATUS — Kisi bhi doctor ki queue dekho
// GET /api/queues/status/:doctorId
//   :doctorId = URL mein variable (route parameter)
//   /status/1 → req.params.doctorId = "1"
//   /status/2 → req.params.doctorId = "2"
// Koi bhi logged in user dekh sakta hai
// Hospital ki lobby mein display screen ke liye perfect hai
// ============================================
router.get('/status/:doctorId', auth, async (req, res) => {
  try {
    // Route parameter = URL ka variable part
    // parseInt = string "1" ko number 1 banao
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

    // Aaj ke saare tokens laao (WAITING + IN_PROGRESS + COMPLETED sab)
    const tokens = await prisma.token.findMany({
      where: { doctorId, queueDate: today },
      orderBy: [{ priority: 'desc' }, { bookedAt: 'asc' }],
      include: {
        Patient: { include: { User: { select: { name: true } } } }
      }
    });

    // JavaScript array methods se tokens ko 3 groups mein baanto:
    // .find() = PEHLA match dhundho (sirf 1 result) — current patient
    // .filter() = SAARE matches dhundho (multiple results) — waiting/completed lists
    const currentPatient = tokens.find(t => t.status === 'IN_PROGRESS');
    const waiting = tokens.filter(t => t.status === 'WAITING');
    const completed = tokens.filter(t => t.status === 'COMPLETED');

    res.json({
      doctor: doctor.User.name,
      department: doctor.Department.name,
      // Ternary operator: condition ? trueValue : falseValue
      // "Agar currentPatient hai toh uska tokenNumber do, nahi toh null do"
      currentToken: currentPatient ? currentPatient.tokenNumber : null,
      totalWaiting: waiting.length,    // .length = array mein kitne items hain
      totalCompleted: completed.length,
      // waiting list ko clean format mein bhejo
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

// ============================================
// MY QUEUE — Doctor apni khud ki queue dekhe
// GET /api/queues/my-queue
// Sirf DOCTOR
//
// /status/:doctorId se farak:
//   - Automatically JWT se pata lagata hai ki kaun sa doctor hai
//   - Zyada detail deta hai (symptoms, current patient info)
//   - Sirf doctor khud dekh sakta hai
// ============================================
router.get('/my-queue', auth, roleCheck(['DOCTOR']), async (req, res) => {
  try {
    const doctor = await prisma.doctor.findUnique({
      where: { userId: req.user.id } // JWT se doctor dhundho, URL se nahi
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
      // Agar current patient hai toh uski details do, nahi toh null
      currentPatient: currentPatient ? {
        tokenId: currentPatient.id,
        tokenNumber: currentPatient.tokenNumber,
        name: currentPatient.Patient.User.name,
        symptoms: currentPatient.symptoms,
        priority: currentPatient.priority
      } : null,
      // Upcoming patients ki list (symptoms bhi dikhao — doctor ko prepare hona hai)
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