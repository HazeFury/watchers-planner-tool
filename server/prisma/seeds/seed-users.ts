import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const users = [
    { firstName: 'Jean', lastName: 'Dupont', email: 'jean.dupont@ecole.fr', phone: '0612458525', contractHours: 50 },
    { firstName: 'Marie', lastName: 'Curie', email: 'marie.curie@ecole.fr', phone: '0610246589', contractHours: 40 },
    { firstName: 'Thomas', lastName: 'Pesquet', email: 'thomas.pesquet@ecole.fr', phone: '0695630214', contractHours: 80 },
    { firstName: 'Sophie', lastName: 'Germain', email: 'sophie.germain@ecole.fr', phone: '0642136985', contractHours: 120 },
    { firstName: 'Ada', lastName: 'Lovelace', email: 'ada.lovelace@ecole.fr', phone: '0675421236', contractHours: 150 },
    { firstName: 'Alan', lastName: 'Turing', email: 'alan.turing@ecole.fr', phone: '0674963521', contractHours: 60 },
    { firstName: 'Grace', lastName: 'Hopper', email: 'grace.hopper@ecole.fr', phone: '0632359865', contractHours: 170 },
    { firstName: 'Steve', lastName: 'Wozniak', email: 'steve.wozniak@ecole.fr', phone: '0646419987', contractHours: 30 },
    { firstName: 'Margaret', lastName: 'Hamilton', email: 'margaret.hamilton@ecole.fr', phone: '0601020304', contractHours: 90 },
    { firstName: 'Linus', lastName: 'Torvalds', email: 'linus.torvalds@ecole.fr', phone: '0649987521', contractHours: 50 },
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