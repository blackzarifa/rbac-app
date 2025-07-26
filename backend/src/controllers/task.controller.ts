import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { TaskService } from '../services/task.service';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PermissionsGuard } from '../guards/permissions.guard';
import { RequirePermissions } from '../decorators/permissions.decorator';

@Controller('tasks')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @RequirePermissions({ resource: 'tasks', action: 'create' })
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.taskService.create(createTaskDto);
  }

  @Get()
  @RequirePermissions({ resource: 'tasks', action: 'read' })
  findAll(@Query('projectId') projectId?: string) {
    return this.taskService.findAll(projectId ? +projectId : undefined);
  }

  @Get(':id')
  @RequirePermissions({ resource: 'tasks', action: 'read' })
  findOne(@Param('id') id: string) {
    return this.taskService.findOne(+id);
  }

  @Patch(':id')
  @RequirePermissions({ resource: 'tasks', action: 'update' })
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.taskService.update(+id, updateTaskDto);
  }

  @Delete(':id')
  @RequirePermissions({ resource: 'tasks', action: 'delete' })
  remove(@Param('id') id: string) {
    return this.taskService.remove(+id);
  }
}
