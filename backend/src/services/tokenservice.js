const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function generateToken(patientId, doctorId, departmentId, symptoms, priority) {
  // Get today's date (just the date, no time)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Count how many tokens this doctor already has today
  const tokenCount = await prisma.token.count({
    where: {
      doctorId: doctorId,
      queueDate: today
    }
  });

  // New token number = count + 1
  const tokenNumber = tokenCount + 1;

  // Calculate estimated wait time
  const doctor = await prisma.doctor.findUnique({ where: { id: doctorId } });
  const waitingAhead = await prisma.token.count({
    where: {
      doctorId: doctorId,
      queueDate: today,
      status: 'WAITING'
    }
  });

  const estimatedWaitMinutes = waitingAhead * doctor.avgConsultationMinutes;

  // Create the token
  const token = await prisma.token.create({
    data: {
      tokenNumber,
      patientId,
      doctorId,
      departmentId,
      symptoms,
      priority: priority || 'NORMAL',
      estimatedWaitMinutes,
      queueDate: today
    }
  });

  return {
    tokenNumber: token.tokenNumber,
    estimatedWaitMinutes,
    position: waitingAhead + 1,
    status: token.status,
    id: token.id
  };
}

module.exports = { generateToken };