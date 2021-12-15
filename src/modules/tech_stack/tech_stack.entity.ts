import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PortfolioTechStack } from '../portfolio_tech_stack/portfolio_tech_stack.entity';
import { ProjectTechStack } from '../project_tech_stack/project_tech_stack.entity';

@Entity('TechStack')
export class TechStack {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  iconUrl: string;

  @OneToMany(() => PortfolioTechStack, (pStack) => pStack.techStack)
  portfolioTechStacks: PortfolioTechStack[];

  @OneToMany(() => ProjectTechStack, (pStack) => pStack.techStack)
  projectTechStack: ProjectTechStack[];
}
