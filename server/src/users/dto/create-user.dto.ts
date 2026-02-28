import { IsEmail, IsNotEmpty, IsString, IsOptional, IsInt, Min } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  contractHours?: number;
}
