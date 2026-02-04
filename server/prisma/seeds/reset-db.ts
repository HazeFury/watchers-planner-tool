import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🗑️  Cleaning database...');

  await prisma.registration.deleteMany({});
  
  await prisma.exam.deleteMany({});
  await prisma.room.deleteMany({});
  
  await prisma.user.deleteMany({});

  // await prisma.admin.deleteMany({}); // Décommenter pour virer l'admin aussi

  console.log('✨ Database successfully cleaned (Admin kept safe)');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });