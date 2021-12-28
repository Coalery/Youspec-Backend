import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
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
}
