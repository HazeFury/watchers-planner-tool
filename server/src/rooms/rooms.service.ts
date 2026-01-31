import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { PrismaService } from 'src/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class RoomsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createRoomDto: CreateRoomDto) {
    try {
      return await this.prisma.room.create({
        data: createRoomDto,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException(`La salle "${createRoomDto.name}" existe déjà.`);
      }
      throw error;
    }
  }

  findAll() {
    return this.prisma.room.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: number) {
    const room = await this.prisma.room.findUnique({ where: { id } });
    if (!room) throw new NotFoundException(`Cette salle n'existe pas.`);
    return room;
  }

  async update(id: number, updateRoomDto: UpdateRoomDto) {
    await this.findOne(id);

    try {
      return await this.prisma.room.update({
        where: { id },
        data: updateRoomDto,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException(`Le nom "${updateRoomDto.name}" est déjà utilisé par une autre salle.`);
      }
      throw error;
    }
  }

  async remove(id: number) {
    await this.findOne(id); // Vérif existence
    return this.prisma.room.delete({ where: { id } });
  }
}