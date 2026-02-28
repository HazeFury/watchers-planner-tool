import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, BadRequestException } from '@nestjs/common';
import { RegistrationsService } from './registrations.service';
import { CreateRegistrationDto } from './dto/create-registration.dto';
import { UpdateRegistrationDto } from './dto/update-registration.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Request as ExpressRequest } from 'express';

interface RequestWithUser extends ExpressRequest {
  user: {
    userId: number;
    email: string;
    role: string;
  };
}

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('registrations')
export class RegistrationsController {
  constructor(private readonly registrationsService: RegistrationsService) {}

  @Post()
  create(@Request() req: RequestWithUser, @Body() createRegistrationDto: CreateRegistrationDto) {
    let targetUserId: number;

    if (req.user.role === 'admin') {
      if (!createRegistrationDto.userId) {
        throw new BadRequestException("Tu dois choisir un(e) surveillant(e) à inscrire.");
      }
      targetUserId = createRegistrationDto.userId;
    } else {
      targetUserId = req.user.userId;
    }
	
    return this.registrationsService.create(targetUserId, createRegistrationDto);
  }
  @Get()
  findAll() {
      return this.registrationsService.findAll();
  }

  @Get('mine')
  @UseGuards(JwtAuthGuard)
  findMyRegistrations(@Request() req: RequestWithUser) {
    return this.registrationsService.findUpcomingForUser(req.user.userId);
  }

  @Get(':id')
  @Roles('admin')
  findOne(@Param('id') id: string) {
    return this.registrationsService.findOne(+id);
  }

  @Patch(':id')
  @Roles('admin')
  update(@Param('id') id: string, @Body() updateRegistrationDto: UpdateRegistrationDto) {
    return this.registrationsService.update(+id, updateRegistrationDto);
  }

  @Delete(':id')
  @Roles('admin') 
  remove(@Param('id') id: string) {
    return this.registrationsService.remove(+id);
  }
}