import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Portfolio } from '../portfolio/portfolio.entity';
import { TechStack } from '../tech_stack/tech_stack.entity';

@Entity('PortfolioTechStack')
export class PortfolioTechStack {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'varchar' })
  description: string;

  @ManyToOne(() => TechStack, (techStack) => techStack.portfolioTechStacks)
  techStack: TechStack;

  @ManyToOne(() => Portfolio, (portfolio) => portfolio.portfolioTechStacks)
  portfolio: Portfolio;
}
