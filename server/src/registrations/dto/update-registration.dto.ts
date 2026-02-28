import { PartialType } from '@nestjs/mapped-types';
import { CreateRegistrationDto } from './create-registration.dto';
import { IsDateString, IsEnum, IsInt, IsOptional } from 'class-validator';
import { RegStatus } from '@prisma/client';

export class UpdateRegistrationDto extends PartialType(CreateRegistrationDto) {
  @IsInt()
  @IsOptional()
  roomId?: number;

  @IsEnum(RegStatus)
  @IsOptional()
  status?: RegStatus;

  @IsDateString()
  @IsOptional()
  specificStart?: string;

  @IsDateString()
  @IsOptional()
  specificEnd?: string;
}
