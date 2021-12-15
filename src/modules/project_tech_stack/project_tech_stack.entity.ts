import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Project } from '../project/project.entity';
import { TechStack } from '../tech_stack/tech_stack.entity';

@Entity('ProjectTechStack')
export class ProjectTechStack {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @ManyToOne(() => TechStack, (techStack) => techStack.projectTechStack)
  techStack: TechStack;

  @ManyToOne(() => Project, (project) => project.projectTechStack)
  project: Project;
}
