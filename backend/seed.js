const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create Departments
  const cardiology = await prisma.department.upsert({
    where: { name: 'Cardiology' },
    update: {},
    create: { name: 'Cardiology', description: 'Heart and cardiovascular system' }
  });

  const neurology = await prisma.department.upsert({
    where: { name: 'Neurology' },
    update: {},
    create: { name: 'Neurology', description: 'Brain and nervous system' }
  });

  const orthopedics = await prisma.department.upsert({
    where: { name: 'Orthopedics' },
    update: {},
    create: { name: 'Orthopedics', description: 'Bones and joints' }
  });

  console.log('✅ Departments created');

  // Create Admin
  const adminHash = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@hospital.com' },
    update: {},
    create: { name: 'Admin User', email: 'admin@hospital.com', passwordHash: adminHash, role: 'ADMIN' }
  });

  // Create Doctors
  const doc1Hash = await bcrypt.hash('doctor123', 10);
  const doc1User = await prisma.user.upsert({
    where: { email: 'dr.shah@hospital.com' },
    update: {},
    create: { name: 'Dr. Shah', email: 'dr.shah@hospital.com', passwordHash: doc1Hash, role: 'DOCTOR' }
  });

  await prisma.doctor.upsert({
    where: { userId: doc1User.id },
    update: {},
    create: { userId: doc1User.id, departmentId: cardiology.id, specialization: 'Cardiologist', avgConsultationMinutes: 15 }
  });

  const doc2User = await prisma.user.upsert({
    where: { email: 'dr.mehta@hospital.com' },
    update: {},
    create: { name: 'Dr. Mehta', email: 'dr.mehta@hospital.com', passwordHash: doc1Hash, role: 'DOCTOR' }
  });

  await prisma.doctor.upsert({
    where: { userId: doc2User.id },
    update: {},
    create: { userId: doc2User.id, departmentId: neurology.id, specialization: 'Neurologist', avgConsultationMinutes: 20 }
  });

  console.log('✅ Doctors created');

  // Create Patient
  const patHash = await bcrypt.hash('patient123', 10);
  const patUser = await prisma.user.upsert({
    where: { email: 'patient@gmail.com' },
    update: {},
    create: { name: 'Rahul Sharma', email: 'patient@gmail.com', passwordHash: patHash, role: 'PATIENT' }
  });

  await prisma.patient.upsert({
    where: { userId: patUser.id },
    update: {},
    create: { userId: patUser.id, phone: '9876543210', bloodGroup: 'O+' }
  });

  console.log('✅ Patients created');
  console.log('🎉 Seeding complete!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());