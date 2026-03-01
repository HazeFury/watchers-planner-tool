import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const rooms = [
    { name: 'Amphi A' },
    { name: 'Amphi B' },
    { name: 'Salle 101' },
    { name: 'Salle 102' },
    { name: 'Salle 204' },
    { name: 'Laboratoire 1' },
    { name: 'Salle TP Réseau' },
    { name: 'Salle Examen 1' },
    { name: 'Bocal' },
    { name: 'Cluster 1' },
  ];

  console.log('🌱 Seeding Rooms...');

  for (const room of rooms) {
    await prisma.room.upsert({
      where: { name: room.name },
      update: {},
      create: room,
    });
  }

  console.log('✅ Rooms seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
