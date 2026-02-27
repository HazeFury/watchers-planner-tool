import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ExamsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createExamDto: CreateExamDto) {
    return this.prisma.exam.create({
      data: createExamDto,
    });
  }

  findAll() {
    return this.prisma.exam.findMany({
      orderBy: {
        startTime: 'asc',
      },
    });
  }

  async findAllFromToday() {
    const today = new Date();
    
    return this.prisma.exam.findMany({
      where: {
        startTime: { gte: today },
        isArchived: false,
      },
      orderBy: {
        startTime: 'asc',
      },
      include: {
        registrations: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              }
            },
			room: true,
          }
        }
      }
    });
  }

  async findOne(id: number) {
    const exam = await this.prisma.exam.findUnique({
      where: { id },
    });
    if (!exam) {
      throw new NotFoundException(`Examen #${id} introuvable`);
    }
    return exam;
  }

  async update(id: number, updateExamDto: UpdateExamDto) {
    await this.findOne(id); 

    return this.prisma.exam.update({
      where: { id },
      data: updateExamDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.exam.delete({
      where: { id },
    });
  }
}