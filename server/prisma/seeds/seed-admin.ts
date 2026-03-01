import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error('ADMIN_EMAIL et ADMIN_PASSWORD doivent être définis dans le .env');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // Upsert : Créer si n'existe pas, Mettre à jour si existe
  const admin = await prisma.admin.upsert({
    where: { email: email },
    update: {
      password: hashedPassword, // On met à jour le mdp au cas où on le change dans le .env
    },
    create: {
      email: email,
      password: hashedPassword,
    },
  });

  console.log(`User Admin créé/mis à jour : ${admin.email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
