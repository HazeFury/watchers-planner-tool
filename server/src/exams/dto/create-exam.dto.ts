import { IsBoolean, IsDateString, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';
import { Cycle } from '@prisma/client';

export class CreateExamDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsDateString()
  @IsNotEmpty()
  startTime: string;

  @IsDateString()
  @IsNotEmpty()
  endTime: string;

  @IsEnum(Cycle)
  @IsNotEmpty()
  cycle: Cycle;

  @IsInt()
  @Min(1)
  @IsOptional()
  maxWatchers?: number;
}