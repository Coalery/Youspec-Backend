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
  async createProject(@Body(ValidationPipe) data: CreateProjectDto) {
    return await this.projectService.createProject(data);
  }

  @Put()
  async saveProject(@Body() project: Project) {
    await this.projectService.saveProject(project);
    return true;
  }

  @Delete(':id')
  async removeProject(@Param('id', ParseIntPipe) id: number) {
    await this.projectService.removeProject(id);
    return true;
  }
}
