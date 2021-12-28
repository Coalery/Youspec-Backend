import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './project.entity';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project) private projectRepository: Repository<Project>,
  ) {}

  async getFilteredProjects(filters: string[]): Promise<Project[]> {
    return await this.projectRepository
      .createQueryBuilder('project')
      .leftJoin('project.projectTechStacks', 'pStacks')
      .leftJoin('pStacks.techStack', 'techStack')
      .where('techStack.name in (:filters)', { filters: filters.join(',') })
      .getMany();
  }
}
