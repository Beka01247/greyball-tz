import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Fighter } from '../../fighters/entities/fighter.entity';

@Entity('rankings')
export class Ranking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Fighter)
  @JoinColumn({ name: 'fighterId' })
  fighter: Fighter;

  @Column()
  fighterId: string;

  @Column({ length: 30 })
  weightClass: string;

  @Column({ type: 'int' })
  position: number;

  @Column({ type: 'float' })
  points: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
