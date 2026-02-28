import { Global, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ExamsModule } from './exams/exams.module';
import { RegistrationsModule } from './registrations/registrations.module';
import { RoomsModule } from './rooms/rooms.module';

@Global()
@Module({
  imports: [UsersModule, AuthModule, ExamsModule, RegistrationsModule, RoomsModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
