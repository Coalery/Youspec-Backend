import { IsNotEmpty } from 'class-validator';
import { ProjectTechStack } from '../project_tech_stack/project_tech_stack.entity';
import { TechStack } from '../tech_stack/tech_stack.entity';
import { Project } from './project.entity';

export class CreateProjectDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  makers: string;

  @IsNotEmpty()
  platformNames: string;

  techStacks: TechStack[];
}

export class FilterProjectsResultDto {
  id: number;
  name: string;
  coverImageUrl: string;
  projectTechStacks: ProjectTechStack[];

  constructor(project: Project) {
    this.id = project.id;
    this.name = project.name;
    this.coverImageUrl = project.coverImageUrl;
    this.projectTechStacks = project.projectTechStacks;
  }
}
