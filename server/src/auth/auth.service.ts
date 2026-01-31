import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signIn(loginDto: LoginDto) {
    const admin = await this.prisma.admin.findUnique({
      where: { email: loginDto.email },
    });

    if (!admin) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    const isMatch = await bcrypt.compare(loginDto.password, admin.password);

    if (!isMatch) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    const payload = { sub: admin.id, email: admin.email, role: 'admin' };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}