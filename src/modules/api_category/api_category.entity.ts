import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiUnit } from '../api_unit/api_unit.entity';
import { Project } from '../project/project.entity';

@Entity('ApiCategory')
export class ApiCategory {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'varchar' })
  title: string;

  @OneToMany(() => ApiUnit, (unit) => unit.apiCategory, {
    cascade: true,
  })
  apiUnits: ApiUnit[];

  @ManyToOne(() => Project, (project) => project.apiCategories, {
    onDelete: 'CASCADE',
  })
  project: Project;
}
