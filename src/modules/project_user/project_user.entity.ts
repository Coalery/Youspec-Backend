import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Project } from '../project/project.entity';
import { User } from '../user/user.entity';

@Entity('ProjectUser')
export class ProjectUser {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'varchar', default: '[]' })
  contributions: string;

  @ManyToOne(() => User, (user) => user.projectUsers)
  user: User;

  @ManyToOne(() => Project, (project) => project.projectUsers)
  project: Project;
}
