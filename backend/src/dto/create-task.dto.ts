export class CreateTaskDto {
  title: string;

  projectId: number;

  completed?: boolean;
}
