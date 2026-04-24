require('dotenv').config();

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const seedRoles = require('./seedRoles');

const prisma = new PrismaClient();

async function createUser({ name, email, password, role, department }) {
  return prisma.user.upsert({
    where: { email },
    update: {
      name,
      role,
      department,
      status: 'ACTIVE',
    },
    create: {
      name,
      email,
      password: await bcrypt.hash(password, 10),
      role,
      department,
      status: 'ACTIVE',
    },
  });
}

async function main() {
  console.log('🌱 Seeding database...');

  await seedRoles(prisma);

  const users = [
    {
      name: 'Super Admin',
      email: 'admin@crm.com',
      password: 'Admin@123',
      role: 'SUPER_ADMIN',
      department: 'Management',
    },
    {
      name: 'Sales Rep',
      email: 'sales@crm.com',
      password: 'Sales@123',
      role: 'SALES',
      department: 'Sales',
    },
    {
      name: 'Bish',
      email: 'bish@cai2rus.com',
      password: 'Bish@123',
      role: 'OPERATIONS',
      department: 'Operations / POS',
    },
    {
      name: 'Nour',
      email: 'nour@cai2rus.com',
      password: 'Nour@123',
      role: 'FINANCE',
      department: 'Finance',
    },
    {
      name: 'Rabie',
      email: 'rabie@cai2rus.com',
      password: 'Rabie@123',
      role: 'SUPER_ADMIN',
      department: 'Management',
    },
    {
      name: 'Hussien',
      email: 'hussien@cai2rus.com',
      password: 'Hussien@123',
      role: 'SUPER_ADMIN',
      department: 'Management',
    },
  ];

  for (const user of users) {
    await createUser(user);
  }

  console.log('✅ Seed completed successfully!');
  console.log('');
  console.log('📋 Login credentials:');
  console.log('Super Admin: admin@crm.com / Admin@123');
  console.log('Sales Rep:   sales@crm.com / Sales@123');
  console.log('Bish:        bish@cai2rus.com / Bish@123');
  console.log('Nour:        nour@cai2rus.com / Nour@123');
  console.log('Rabie:       rabie@cai2rus.com / Rabie@123');
  console.log('Hussien:     hussien@cai2rus.com / Hussien@123');
}

main()
  .catch((error) => {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });