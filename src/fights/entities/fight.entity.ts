import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ObjectType, Field, ID, Int, registerEnumType } from '@nestjs/graphql';
import { Fighter } from '../../fighters/entities/fighter.entity';
import { Event } from '../../events/entities/event.entity';

export enum FightResult {
  DECISION = 'DECISION',
  KO = 'KO',
  TKO = 'TKO',
  SUBMISSION = 'SUBMISSION',
  DQ = 'DQ',
  NO_CONTEST = 'NO_CONTEST',
}

registerEnumType(FightResult, {
  name: 'FightResult',
});

@Entity('fights')
@ObjectType()
export class Fight {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @ManyToOne(() => Event, (event) => event.fights)
  @JoinColumn({ name: 'eventId' })
  @Field(() => Event)
  event: Event;

  @Column()
  eventId: string;

  @ManyToOne(() => Fighter)
  @JoinColumn({ name: 'fighter1Id' })
  @Field(() => Fighter)
  fighter1: Fighter;

  @Column()
  fighter1Id: string;

  @ManyToOne(() => Fighter)
  @JoinColumn({ name: 'fighter2Id' })
  @Field(() => Fighter)
  fighter2: Fighter;

  @Column()
  fighter2Id: string;

  @Column({ nullable: true })
  winnerId: string;

  @ManyToOne(() => Fighter, { nullable: true })
  @JoinColumn({ name: 'winnerId' })
  @Field(() => Fighter, { nullable: true })
  winner: Fighter;

  @Column({
    type: 'enum',
    enum: FightResult,
    nullable: true,
  })
  @Field(() => FightResult, { nullable: true })
  result: FightResult;

  @Column({ type: 'int', nullable: true })
  @Field(() => Int, { nullable: true })
  roundEnded: number;

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @UpdateDateColumn()
  @Field()
  updatedAt: Date;
}
