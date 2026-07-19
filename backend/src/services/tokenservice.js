// ============================================
// TOKEN SERVICE — Token generation ka main business logic
// Yeh file "service layer" hai — pure logic, koi HTTP request/response nahi
// Route file bole: "Token book karo" → yeh file bole: "Yeh lo, number 3, 30 min wait"
//
// Kyun alag file? = Separation of Concerns
//   Route file = "Kya URL hai? Kya bhejein client ko?" (HTTP handling)
//   Service file = "Kaise kaam hoga?" (Business logic)
// ============================================

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ============================================
// GENERATE TOKEN — Naya token banao (auto number, wait time calculate karo)
// Parameters:
//   patientId = konsa patient
//   doctorId = konse doctor ke paas
//   departmentId = konsa department
//   symptoms = kya problem hai
//   priority = NORMAL / URGENT / EMERGENCY
// ============================================
async function generateToken(patientId, doctorId, departmentId, symptoms, priority) {
  // Step 1: Aaj ki date nikalo (sirf date, time nahi)
  // new Date() = "2026-07-20T14:30:00" (date + time dono)
  // setHours(0,0,0,0) = "2026-07-20T00:00:00" (midnight — sirf date)
  // Kyun? Kyunki hum "aaj ke tokens" dhundna chahte hain
  // Agar time include karein toh 2 PM ka token 3 PM ke query mein nahi milega
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Step 2: Aaj is doctor ke kitne tokens hain? = Token number calculate karo
  // count() = matching records ki ginti (SQL: SELECT COUNT(*) FROM ...)
  // Har doctor ka numbering alag hai, aur har din reset hota hai
  const tokenCount = await prisma.token.count({
    where: {
      doctorId: doctorId,
      queueDate: today
    }
  });

  // Naya token number = total + 1
  // Dr. Shah ke 3 tokens hain → naya token = #4
  const tokenNumber = tokenCount + 1;

  // Step 3: Estimated wait time calculate karo
  // Formula: (aage kitne WAITING hain) × (doctor ka avg consultation time)
  // Example: 3 log wait kar rahe, doctor 15 min leta hai → 3 × 15 = 45 min wait
  const doctor = await prisma.doctor.findUnique({ where: { id: doctorId } });
  const waitingAhead = await prisma.token.count({
    where: {
      doctorId: doctorId,
      queueDate: today,
      status: 'WAITING'  // Sirf WAITING count karo, COMPLETED ya IN_PROGRESS nahi
    }
  });

  const estimatedWaitMinutes = waitingAhead * doctor.avgConsultationMinutes;

  // Step 4: Token record database mein banao
  const token = await prisma.token.create({
    data: {
      tokenNumber,
      patientId,
      doctorId,
      departmentId,
      symptoms,
      priority: priority || 'NORMAL', // Agar priority nahi di toh NORMAL lagao
      // || = "pehla value lo agar exist kare, nahi toh doosra lo"
      estimatedWaitMinutes,
      queueDate: today
    }
  });

  // Route handler ko result do — woh client ko bhejega
  return {
    tokenNumber: token.tokenNumber,
    estimatedWaitMinutes,
    position: waitingAhead + 1,  // 3 log aage hain → teri position = 4
    status: token.status,
    id: token.id
  };
}

// { } mein export karo = future mein aur functions bhi add kar sakte hain
// Example: module.exports = { generateToken, cancelToken, updateWaitTime };
module.exports = { generateToken };