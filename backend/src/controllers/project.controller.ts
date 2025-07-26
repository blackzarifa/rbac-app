import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ProjectService } from '../services/project.service';
import { CreateProjectDto } from '../dto/create-project.dto';
import { UpdateProjectDto } from '../dto/update-project.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PermissionsGuard } from '../guards/permissions.guard';
import { RequirePermissions } from '../decorators/permissions.decorator';

@Controller('projects')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @RequirePermissions({ resource: 'projects', action: 'create' })
  create(@Body() createProjectDto: CreateProjectDto, @Request() req) {
    return this.projectService.create(createProjectDto, req.user);
  }

  @Get()
  @RequirePermissions({ resource: 'projects', action: 'read' })
  findAll(@Request() req) {
    return this.projectService.findAll(req.user);
  }

  @Get(':id')
  @RequirePermissions({ resource: 'projects', action: 'read' })
  findOne(@Param('id') id: string, @Request() req) {
    return this.projectService.findOne(+id, req.user);
  }

  @Patch(':id')
  @RequirePermissions({ resource: 'projects', action: 'update' })
  update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
    @Request() req,
  ) {
    return this.projectService.update(+id, updateProjectDto, req.user);
  }

  @Delete(':id')
  @RequirePermissions({ resource: 'projects', action: 'delete' })
  remove(@Param('id') id: string, @Request() req) {
    return this.projectService.remove(+id, req.user);
  }
}
