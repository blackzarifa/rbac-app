import {
  IsNotEmpty,
  IsOptional,
  MaxLength,
  IsBoolean,
  IsNumber,
} from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @IsNumber()
  @IsNotEmpty()
  projectId: number;

  @IsOptional()
  @IsBoolean()
  completed?: boolean;
}
