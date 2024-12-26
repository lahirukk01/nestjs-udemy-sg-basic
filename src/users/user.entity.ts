import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Unique,
  OneToMany,
} from 'typeorm';
import { Report } from '../reports/report.entity';

export enum UserRole {
  ADMIN = 'admin',
  OWNER = 'owner',
  ALL = 'all',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Unique(['email'])
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'varchar',
    length: 10,
    default: UserRole.OWNER,
  })
  role: UserRole;

  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];
}
