import { IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateRegistrationDto {
  @IsInt()
  @IsNotEmpty()
  examId: number;

  @IsInt()
  @IsOptional()
  userId?: number;
}
