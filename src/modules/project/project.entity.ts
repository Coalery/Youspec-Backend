import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiCategory } from '../api_category/api_category.entity';
import { Platform } from '../platform/platform.entity';
import { Portfolio } from '../portfolio/portfolio.entity';
import { ProjectTechStack } from '../project_tech_stack/project_tech_stack.entity';
import { ProjectUser } from '../project_user/project_user.entity';

@Entity('Project')
export class Project {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'datetime' })
  startDate: Date;

  @Column({ type: 'datetime', nullable: true })
  endDate?: Date;

  @Column({ type: 'varchar', nullable: true })
  description?: string;

  @Column({ type: 'varchar', default: '[]' })
  featureImageUrls: string;

  @Column({ type: 'varchar', default: '[]' })
  featureStrings: string;

  @Column({ type: 'varchar', default: '[]' })
  results: string;

  @OneToMany(() => ProjectTechStack, (pStack) => pStack.project)
  projectTechStacks: ProjectTechStack[];

  @OneToMany(() => ProjectUser, (projectUser) => projectUser.project)
  projectUsers: ProjectUser[];

  @OneToMany(() => Platform, (platform) => platform.project)
  platforms: Platform[];

  @OneToMany(() => ApiCategory, (category) => category.project)
  apiCategories: ApiCategory[];

  @ManyToOne(() => Portfolio, (portfolio) => portfolio.projects)
  portfolio: Portfolio;
}
