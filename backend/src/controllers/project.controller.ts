import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ProjectService } from '../services/project.service';
import { CreateProjectDto } from '../dto/create-project.dto';
import { UpdateProjectDto } from '../dto/update-project.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PermissionsGuard } from '../guards/permissions.guard';
import { RequirePermissions } from '../decorators/permissions.decorator';
import { CurrentUser } from '../decorators/user.decorator';
import { User } from '../entities/user.entity';

@Controller('projects')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @RequirePermissions({ resource: 'projects', action: 'create' })
  create(
    @Body() createProjectDto: CreateProjectDto,
    @CurrentUser() user: User,
  ) {
    return this.projectService.create(createProjectDto, user);
  }

  @Get()
  @RequirePermissions({ resource: 'projects', action: 'read' })
  findAll(@CurrentUser() user: User) {
    return this.projectService.findAll(user);
  }

  @Get(':id')
  @RequirePermissions({ resource: 'projects', action: 'read' })
  findOne(@Param('id') id: string, @CurrentUser() user: User) {
    return this.projectService.findOne(+id, user);
  }

  @Patch(':id')
  @RequirePermissions({ resource: 'projects', action: 'update' })
  update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
    @CurrentUser() user: User,
  ) {
    return this.projectService.update(+id, updateProjectDto, user);
  }

  @Delete(':id')
  @RequirePermissions({ resource: 'projects', action: 'delete' })
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.projectService.remove(+id, user);
  }
}
