import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Portfolio } from '../portfolio/portfolio.entity';

@Entity('Activity')
export class Activity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'varchar', nullable: true })
  description?: string;

  @Column({ type: 'datetime' })
  startDate: Date;

  @Column({ type: 'datetime', nullable: true })
  endDate?: Date;

  @ManyToOne(() => Portfolio, (portfolio) => portfolio.activities)
  portfolio: Portfolio;
}
