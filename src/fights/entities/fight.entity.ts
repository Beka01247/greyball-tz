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
import { Event } from '../../events/entities/event.entity';

@Entity('fights')
export class Fight {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Event, (event) => event.fights)
  @JoinColumn({ name: 'eventId' })
  event: Event;

  @Column()
  eventId: string;

  @ManyToOne(() => Fighter)
  @JoinColumn({ name: 'fighter1Id' })
  fighter1: Fighter;

  @Column()
  fighter1Id: string;

  @ManyToOne(() => Fighter)
  @JoinColumn({ name: 'fighter2Id' })
  fighter2: Fighter;

  @Column()
  fighter2Id: string;

  @Column({ nullable: true })
  winnerId: string;

  @ManyToOne(() => Fighter, { nullable: true })
  @JoinColumn({ name: 'winnerId' })
  winner: Fighter;

  @Column({
    type: 'enum',
    enum: ['DECISION', 'KO', 'TKO', 'SUBMISSION', 'DQ', 'NO_CONTEST'],
    nullable: true,
  })
  result: string;

  @Column({ type: 'int', nullable: true })
  roundEnded: number;

  @Column({ type: 'interval', nullable: true })
  timeInRound: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
