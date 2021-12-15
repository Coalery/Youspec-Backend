import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Portfolio } from '../portfolio/portfolio.entity';

@Entity('Philosophy')
export class Philosophy {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'varchar' })
  content: string;

  @ManyToOne(() => Portfolio, (portfolio) => portfolio.philosophy)
  portfolio: Portfolio;
}
