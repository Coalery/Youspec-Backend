import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiCategory } from '../api_category/api_category.entity';

type MethodType = 'GET' | 'POST' | 'PUT' | 'DELETE';

@Entity('ApiUnit')
export class ApiUnit {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'varchar', nullable: true })
  description?: string;

  @Column({ type: 'varchar' })
  method: MethodType;

  @Column({ type: 'varchar' })
  requestUrl: string;

  @Column({ type: 'varchar' })
  requestValues: string;

  @Column({ type: 'varchar' })
  requestExample: string;

  @Column({ type: 'varchar' })
  responseValues: string;

  @Column({ type: 'varchar' })
  responseExample: string;

  @ManyToOne(() => ApiCategory, (category) => category.apiUnits)
  apiCategory: ApiCategory;
}
