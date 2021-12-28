import { Controller, Get, Param } from '@nestjs/common';
import { ProjectService } from './project.service';

@Controller('project')
export class ProjectController {
  constructor(private projectService: ProjectService) {}

  @Get(':filter')
  async getFilteredProjects(@Param('filter') filters: string) {
    return await this.projectService.getFilteredProjects(filters.split(','));
  }
}
