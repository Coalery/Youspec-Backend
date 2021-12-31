import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  ValidationPipe,
} from '@nestjs/common';
import { Roles } from 'src/decorators/roles.decorator';
import { CreateProjectDto } from './project.dto';
import { Project } from './project.entity';
import { ProjectService } from './project.service';

@Controller('project')
export class ProjectController {
  constructor(private projectService: ProjectService) {}

  @Get('/filter/:filter')
  async getFilteredProjects(@Param('filter') filters: string) {
    return await this.projectService.getFilteredProjects(filters.split(','));
  }

  @Get(':id')
  async getProjectById(@Param('id', ParseIntPipe) id: number) {
    return await this.projectService.getProjectById(id);
  }

  @Post()
  @Roles('user')
  async createProject(@Body(ValidationPipe) data: CreateProjectDto) {
    return await this.projectService.createProject(data);
  }

  @Put(':projectId')
  @Roles('maker')
  async saveProject(@Body() project: Project) {
    await this.projectService.saveProject(project);
    return true;
  }

  @Delete(':projectId')
  @Roles('maker')
  async removeProject(@Param('projectId', ParseIntPipe) id: number) {
    await this.projectService.removeProject(id);
    return true;
  }
}
