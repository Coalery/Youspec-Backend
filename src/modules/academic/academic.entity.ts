import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Portfolio } from '../portfolio/portfolio.entity';

@Entity('Academic')
export class Academic {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  description?: string;

  @Column({ type: 'datetime' })
  startDate: Date;

  @Column({ type: 'datetime', nullable: true })
  endDate?: Date;

  @ManyToOne(() => Portfolio, (portfolio) => portfolio.academics)
  portfolio: Portfolio;
}
