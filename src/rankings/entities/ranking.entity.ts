import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ObjectType, Field, ID, Int, Float } from '@nestjs/graphql';
import { Fighter } from '../../fighters/entities/fighter.entity';

@Entity('rankings')
@ObjectType()
export class Ranking {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @ManyToOne(() => Fighter, { eager: true })
  @JoinColumn({ name: 'fighterId' })
  @Field(() => Fighter)
  fighter: Fighter;

  @Column()
  @Field(() => ID)
  fighterId: string;

  @Column({ length: 30 })
  @Field()
  weightClass: string;

  @Column({ type: 'int' })
  @Field(() => Int)
  position: number;

  @Column({ type: 'float' })
  @Field(() => Float)
  points: number;

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @UpdateDateColumn()
  @Field()
  updatedAt: Date;
}
