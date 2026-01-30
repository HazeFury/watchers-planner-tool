import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Permet d'utiliser Prisma partout sans devoir l'importer 50 fois
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // On autorise les autres modules à utiliser le Service
})
export class PrismaModule {}