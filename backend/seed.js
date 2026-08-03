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

    const pediatrics = await prisma.department.upsert({
    where: { name: 'Pediatrics' },
    update: {},
    create: { name: 'Pediatrics', description: 'Specialized care for infants, children, and adolescents' }
  });

  const dermatology = await prisma.department.upsert({
    where: { name: 'Dermatology' },
    update: {},
    create: { name: 'Dermatology', description: 'Expert treatment for skin, hair, and nail conditions' }
  });

  const ophthalmology = await prisma.department.upsert({
    where: { name: 'Ophthalmology' },
    update: {},
    create: { name: 'Ophthalmology', description: 'Complete eye care from vision testing to complex surgeries' }
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

    const doc3User = await prisma.user.upsert({
    where: { email: 'dr.gupta@hospital.com' },
    update: {},
    create: { name: 'Dr. Gupta', email: 'dr.gupta@hospital.com', passwordHash: doc1Hash, role: 'DOCTOR' }
  });

  await prisma.doctor.upsert({
    where: { userId: doc3User.id },
    update: {},
    create: { userId: doc3User.id, departmentId: orthopedics.id, specialization: 'Orthopedic Surgeon', avgConsultationMinutes: 20 }
  });

  const doc4User = await prisma.user.upsert({
    where: { email: 'dr.patel@hospital.com' },
    update: {},
    create: { name: 'Dr. Patel', email: 'dr.patel@hospital.com', passwordHash: doc1Hash, role: 'DOCTOR' }
  });

  await prisma.doctor.upsert({
    where: { userId: doc4User.id },
    update: {},
    create: { userId: doc4User.id, departmentId: pediatrics.id, specialization: 'Pediatrician', avgConsultationMinutes: 15 }
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