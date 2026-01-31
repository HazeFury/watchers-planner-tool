import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const users = [
    { firstName: 'Jean', lastName: 'Dupont', email: 'jean.dupont@ecole.fr' },
    { firstName: 'Marie', lastName: 'Curie', email: 'marie.curie@ecole.fr' },
    { firstName: 'Thomas', lastName: 'Pesquet', email: 'thomas.pesquet@ecole.fr' },
    { firstName: 'Sophie', lastName: 'Germain', email: 'sophie.germain@ecole.fr' },
    { firstName: 'Ada', lastName: 'Lovelace', email: 'ada.lovelace@ecole.fr' },
    { firstName: 'Alan', lastName: 'Turing', email: 'alan.turing@ecole.fr' },
    { firstName: 'Grace', lastName: 'Hopper', email: 'grace.hopper@ecole.fr' },
    { firstName: 'Steve', lastName: 'Wozniak', email: 'steve.wozniak@ecole.fr' },
    { firstName: 'Margaret', lastName: 'Hamilton', email: 'margaret.hamilton@ecole.fr' },
    { firstName: 'Linus', lastName: 'Torvalds', email: 'linus.torvalds@ecole.fr' },
  ];

  console.log('🌱 Seeding Users...');

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: user,
    });
  }

  console.log('✅ Users seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });