import { Injectable, NotFoundException, ConflictException} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  // Injection de dépendance : on récupère l'outil pour parler à la BDD
  constructor(private readonly prisma: PrismaService) {}

  // CRÉATION
  async create(createUserDto: CreateUserDto) {
    try {
      return await this.prisma.user.create({
        data: createUserDto,
      });
    } catch (error) {
      // P2002 est le code d'erreur Prisma pour "Unique constraint failed"
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('Cet email est déjà utilisé.');
      }
      // On renvoie tout autre type d'erreur
      throw error;
    }
  }
  // LECTURE (TOUS)
  findAll() {
    return this.prisma.user.findMany();
  }

  // LECTURE (UN SEUL)
 async findOne(id: number) {
  const user = await this.prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw new NotFoundException(`Cette utilisateur n'existe pas`);
  }
  return user;
}

async getProfile(userId: number) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        firstName: true,
        lastName: true,
        email: true,
        contractHours: true,
      }
    });
  }

  // MISE À JOUR
  async update(id: number, updateUserDto: UpdateUserDto) {
  try {
      return await this.prisma.user.update({
		where: { id },
        data: updateUserDto,
      });
    } catch (error) {
      // P2002 est le code d'erreur Prisma pour "Unique constraint failed"
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('Cet email est déjà utilisé.');
      }
      // On renvoie tout autre type d'erreur
      throw error;
    }
  }

  // SUPPRESSION
  remove(id: number) {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}