import { PrismaClient, Cycle } from '@prisma/client'; // Assure-toi que l'enum Cycle est bien importé

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Exams...');
  const exams = [];
  const now = new Date();

  for (let i = 0; i < 15; i++) {
    // Dates aléatoires entre J+0 et J+35
    const daysToAdd = Math.floor(Math.random() * 35);
    // Heure de début aléatoire entre 8h et 15h
    const startHour = 8 + Math.floor(Math.random() * 8); 
    // Durée de l'examen (entre 2 et 4 heures)
    const durationHours = 2 + Math.floor(Math.random() * 3);

    const startTime = new Date(now);
    startTime.setDate(now.getDate() + daysToAdd);
    startTime.setHours(startHour, 0, 0, 0);

    const endTime = new Date(startTime);
    endTime.setHours(startHour + durationHours, 0, 0, 0);

    exams.push({
      title: `Examen ${i + 1} - ${daysToAdd < 15 ? 'Partiel' : 'Session Finale'}`,
      startTime,
      endTime,
      cycle: Math.random() > 0.5 ? Cycle.ING : Cycle.PREPA,
      maxWatchers: Math.floor(Math.random() * 6) + 1, // Entre 1 et 6 surveillants
    });
  }

  // On insère tout
  for (const exam of exams) {
    await prisma.exam.create({ data: exam });
  }

  console.log('✅ Exams seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });