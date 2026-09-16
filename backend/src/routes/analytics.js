// ============================================
// ANALYTICS ROUTES — Hospital ka data analysis
// Admin aur Doctor dono dekh sakte hain
//
// Endpoints:
//   GET /daily       — Aaj ka summary (total patients, avg wait, busiest hour)
//   GET /trends      — Last 7 days ka trend data (charts ke liye)
// ============================================

const express = require('express');
const { PrismaClient } = require('@prisma/client');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

const router = express.Router();
const prisma = new PrismaClient();

// ============================================
// DAILY ANALYTICS — Aaj ka poora summary
// GET /api/analytics/daily?date=2026-08-04
// Agar date nahi di toh aaj ka data deta hai
// ============================================
router.get('/daily', auth, roleCheck(['ADMIN', 'DOCTOR']), async (req, res) => {
  try {
    // Query param se date lo, ya aaj ki date use karo
    const targetDate = req.query.date ? new Date(req.query.date) : new Date();
    targetDate.setHours(0, 0, 0, 0);

    const nextDay = new Date(targetDate);
    nextDay.setDate(nextDay.getDate() + 1);

    // Aaj ke saare tokens ek saath laao
    const tokens = await prisma.token.findMany({
      where: {
        queueDate: {
          gte: targetDate,
          lt: nextDay
        }
      },
      include: {
        Doctor: {
          include: { Department: true, User: { select: { name: true } } }
        }
      }
    });

    const totalPatients = tokens.length;
    const completed = tokens.filter(t => t.status === 'COMPLETED');
    const waiting = tokens.filter(t => t.status === 'WAITING');
    const inProgress = tokens.filter(t => t.status === 'IN_PROGRESS');

    // Average wait time (calledAt - bookedAt for completed/in-progress tokens)
    const tokensWithWait = tokens.filter(t => t.calledAt && t.bookedAt);
    const avgWaitMinutes = tokensWithWait.length > 0
      ? Math.round(tokensWithWait.reduce((sum, t) => {
          return sum + (new Date(t.calledAt) - new Date(t.bookedAt)) / 60000;
        }, 0) / tokensWithWait.length)
      : 0;

    // Average consultation time (completedAt - calledAt for completed tokens)
    const tokensWithConsult = completed.filter(t => t.completedAt && t.calledAt);
    const avgConsultationMinutes = tokensWithConsult.length > 0
      ? Math.round(tokensWithConsult.reduce((sum, t) => {
          return sum + (new Date(t.completedAt) - new Date(t.calledAt)) / 60000;
        }, 0) / tokensWithConsult.length)
      : 0;

    // Busiest hour — group tokens by hour of bookedAt
    const hourCounts = {};
    tokens.forEach(t => {
      const hour = new Date(t.bookedAt).getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });
    const busiestHour = Object.keys(hourCounts).length > 0
      ? parseInt(Object.entries(hourCounts).sort((a, b) => b[1] - a[1])[0][0])
      : null;

    // Department breakdown
    const deptMap = {};
    tokens.forEach(t => {
      const deptName = t.Doctor.Department.name;
      if (!deptMap[deptName]) {
        deptMap[deptName] = { name: deptName, total: 0, completed: 0, waiting: 0 };
      }
      deptMap[deptName].total += 1;
      if (t.status === 'COMPLETED') deptMap[deptName].completed += 1;
      if (t.status === 'WAITING') deptMap[deptName].waiting += 1;
    });

    // Priority breakdown
    const priorityCounts = {
      NORMAL: tokens.filter(t => t.priority === 'NORMAL').length,
      URGENT: tokens.filter(t => t.priority === 'URGENT').length,
      EMERGENCY: tokens.filter(t => t.priority === 'EMERGENCY').length,
    };

    res.json({
      date: targetDate.toISOString().split('T')[0],
      totalPatients,
      completed: completed.length,
      waiting: waiting.length,
      inProgress: inProgress.length,
      avgWaitMinutes,
      avgConsultationMinutes,
      busiestHour: busiestHour !== null ? `${busiestHour}:00 - ${busiestHour + 1}:00` : 'N/A',
      departmentBreakdown: Object.values(deptMap),
      priorityCounts
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// ============================================
// TRENDS — Last 7 days ka data (charts ke liye)
// GET /api/analytics/trends?period=week
// ============================================
router.get('/trends', auth, roleCheck(['ADMIN', 'DOCTOR']), async (req, res) => {
  try {
    const days = 7;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - (days - 1));

    // Last 7 days ke saare tokens laao
    const tokens = await prisma.token.findMany({
      where: {
        queueDate: {
          gte: startDate,
          lte: today
        }
      }
    });

    // Group by date
    const dailyData = [];
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];

      const dayTokens = tokens.filter(t => {
        const tDate = new Date(t.queueDate).toISOString().split('T')[0];
        return tDate === dateStr;
      });

      const completed = dayTokens.filter(t => t.status === 'COMPLETED');
      const tokensWithWait = dayTokens.filter(t => t.calledAt && t.bookedAt);
      const avgWait = tokensWithWait.length > 0
        ? Math.round(tokensWithWait.reduce((sum, t) => {
            return sum + (new Date(t.calledAt) - new Date(t.bookedAt)) / 60000;
          }, 0) / tokensWithWait.length)
        : 0;

      dailyData.push({
        date: dateStr,
        label: date.toLocaleDateString('en-US', { weekday: 'short' }),
        totalPatients: dayTokens.length,
        completed: completed.length,
        avgWaitMinutes: avgWait
      });
    }

    res.json({
      period: `${days} days`,
      startDate: startDate.toISOString().split('T')[0],
      endDate: today.toISOString().split('T')[0],
      dailyData
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to fetch trends' });
  }
});

module.exports = router;
