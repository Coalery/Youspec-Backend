import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Project } from '../project/project.entity';
import { Troubleshooting } from '../troubleshooting/troubleshooting.entity';

@Entity('Platform')
export class Platform {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  relatedUrl: string;

  @OneToMany(() => Troubleshooting, (tShot) => tShot.platform)
  troubleshootings: Troubleshooting;

  @ManyToOne(() => Project, (project) => project.platforms)
  project: Project;
}
