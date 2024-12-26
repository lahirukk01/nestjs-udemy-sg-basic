import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class Report {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  price: number;

  @Column()
  make: string;

  @Column()
  model: string;

  @Column()
  year: number;

  @Column('decimal', { precision: 10, scale: 6 })
  lng: number;

  @Column('decimal', { precision: 10, scale: 6 })
  lat: number;

  @Column()
  miles: number;

  @ManyToOne(() => User, (user) => user.reports)
  user: User;
}
