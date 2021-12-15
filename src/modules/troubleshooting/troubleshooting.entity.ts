import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Platform } from '../platform/platform.entity';

@Entity('Troubleshooting')
export class Troubleshooting {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'varchar' })
  contents: string;

  @ManyToOne(() => Platform, (platform) => platform.troubleshooting)
  platform: Platform;
}
