import { IsString, IsNumber, IsOptional, IsBoolean } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsNumber()
  projectId: number;

  @IsOptional()
  @IsBoolean()
  completed?: boolean;
}
