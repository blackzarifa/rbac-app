import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class CreateProjectDto {
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @IsOptional()
  @MaxLength(1000)
  description?: string;
}
