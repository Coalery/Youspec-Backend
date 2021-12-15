import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../user/user.entity';

export type ContactType =
  | 'email'
  | 'facebook'
  | 'instagram'
  | 'twitter'
  | 'github'
  | 'kakaotalk';

@Entity('Contact')
export class Contact {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'varchar' })
  url: string;

  @Column({ type: 'varchar' })
  type: ContactType;

  @ManyToOne(() => User, (user) => user.contact)
  user: User;
}
