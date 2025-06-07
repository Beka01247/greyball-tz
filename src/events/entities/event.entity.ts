import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Fight } from '../../fights/entities/fight.entity';

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 100 })
  location: string;

  @Column({ type: 'timestamp' })
  date: Date;

  @Column({ default: false })
  isFinished: boolean;

  @OneToMany(() => Fight, (fight) => fight.event)
  fights: Fight[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
