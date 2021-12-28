import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Academic } from '../academic/academic.entity';
import { Activity } from '../activity/activity.entity';
import { Philosophy } from '../philosophy/philosophy.entity';
import { PortfolioTechStack } from '../portfolio_tech_stack/portfolio_tech_stack.entity';
import { Project } from '../project/project.entity';
import { User } from '../user/user.entity';

@Entity('Portfolio')
export class Portfolio {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'varchar', unique: true })
  customName: string;

  @Column({ type: 'varchar', nullable: true })
  backgroundImageUrl?: string;

  @OneToOne(() => User, (user) => user.portfolio)
  @JoinColumn()
  user: User;

  @OneToMany(() => Activity, (activity) => activity.portfolio)
  activities: Activity[];

  @OneToMany(() => Academic, (academic) => academic.portfolio)
  academics: Academic[];

  @OneToMany(() => Philosophy, (philosophy) => philosophy.portfolio)
  philosophies: Philosophy[];

  @OneToMany(() => PortfolioTechStack, (pStack) => pStack.portfolio)
  portfolioTechStacks: PortfolioTechStack[];

  @OneToMany(() => Project, (project) => project.portfolio)
  projects: Project[];
}
