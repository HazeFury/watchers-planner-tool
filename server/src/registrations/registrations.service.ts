import {
  ConflictException,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateRegistrationDto } from './dto/create-registration.dto';
import { UpdateRegistrationDto } from './dto/update-registration.dto';
import { PrismaService } from 'src/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class RegistrationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, createRegistrationDto: CreateRegistrationDto) {
    const { examId } = createRegistrationDto;

    const exam = await this.prisma.exam.findUnique({
      where: { id: examId },
      include: {
        _count: {
          select: { registrations: true },
        },
      },
    });

    if (!exam) {
      throw new NotFoundException(`Cet examen n'existe pas.`);
    }

    if (exam._count.registrations >= exam.maxWatchers) {
      throw new ConflictException("Il n'y a plus de place pour cet examen.");
    }

    if (exam.isClosed || exam.isArchived) {
      throw new BadRequestException('Les inscriptions pour cet examen sont closes.');
    }

    const userExists = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!userExists) {
      throw new NotFoundException(`Cet utilisateur n'existe pas.`);
    }

    try {
      return await this.prisma.registration.create({
        data: {
          userId: userId,
          examId: examId,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('Vous êtes déjà inscrit à cet examen !');
      }
      throw error;
    }
  }

  findAll() {
    return this.prisma.registration.findMany({
      include: {
        user: { select: { firstName: true, lastName: true, email: true } },
        exam: true,
      },
    });
  }

  async findUpcomingForUser(userId: number) {
    const today = new Date();

    return this.prisma.registration.findMany({
      where: {
        userId: userId,
        exam: {
          startTime: { gte: today },
          isArchived: false,
        },
      },
      include: {
        exam: true,
        room: true,
      },
      orderBy: {
        exam: {
          startTime: 'asc',
        },
      },
    });
  }

  async findOne(id: number) {
    const registration = await this.prisma.registration.findUnique({
      where: { id },
      include: { user: true, exam: true },
    });
    if (!registration) throw new NotFoundException('Inscription introuvable');
    return registration;
  }

  async update(id: number, updateRegistrationDto: UpdateRegistrationDto) {
    return this.prisma.registration.update({
      where: { id },
      data: updateRegistrationDto,
    });
  }

  remove(id: number) {
    return this.prisma.registration.delete({
      where: { id },
    });
  }
}
