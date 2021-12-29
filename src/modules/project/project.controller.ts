import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Put,
} from '@nestjs/common';
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

  @Put()
  async saveProject(@Body() project: Project) {
    await this.projectService.saveProject(project);
    return {};
  }
}
