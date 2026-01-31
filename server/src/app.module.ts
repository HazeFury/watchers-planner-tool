import { Global, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ExamsModule } from './exams/exams.module';
import { RegistrationsModule } from './registrations/registrations.module';

@Global()
@Module({
  imports: [ UsersModule, AuthModule, ExamsModule, RegistrationsModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
