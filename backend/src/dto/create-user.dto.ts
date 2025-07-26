import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsOptional,
  IsNumber,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsNumber()
  roleId?: number;
}
