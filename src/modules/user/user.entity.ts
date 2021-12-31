import { Column, Entity, OneToMany, OneToOne, PrimaryColumn } from 'typeorm';
import { Contact } from '../contact/contact.entity';
import { Portfolio } from '../portfolio/portfolio.entity';
import { ProjectUser } from '../project_user/project_user.entity';

@Entity('User')
export class User {
  @PrimaryColumn({ type: 'varchar' })
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  profileUrl?: string;

  @Column({ type: 'varchar', nullable: true })
  description?: string;

  @OneToOne(() => Portfolio, (portfolio) => portfolio.user, {
    cascade: ['insert'],
  })
  portfolio: Portfolio;

  @OneToMany(() => Contact, (contact) => contact.user)
  contacts: Contact[];

  @OneToMany(() => ProjectUser, (projectUser) => projectUser.user)
  projectUsers: ProjectUser[];
}
