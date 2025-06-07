import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

@Entity('fighters')
@ObjectType()
export class Fighter {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column({ length: 60 })
  @Field()
  firstName: string;

  @Column({ length: 60 })
  @Field()
  lastName: string;

  @Column({ length: 60, nullable: true })
  @Field({ nullable: true })
  nickname?: string;

  @Column({ type: 'date', nullable: true })
  @Field({ nullable: true })
  birthDate?: string;

  @Column({ length: 60, nullable: true })
  @Field({ nullable: true })
  country?: string;

  @Column({ type: 'int', nullable: true })
  @Field(() => Int, { nullable: true })
  heightCm?: number;

  @Column({ type: 'int', nullable: true })
  @Field(() => Int, { nullable: true })
  reachCm?: number;

  @Column({ length: 30 })
  @Field()
  weightClass: string;

  @Column({ default: false })
  @Field()
  isRetired: boolean;

  @Column({ type: 'int', default: 0 })
  @Field(() => Int)
  wins: number;

  @Column({ type: 'int', default: 0 })
  @Field(() => Int)
  losses: number;

  @Column({ type: 'int', default: 0 })
  @Field(() => Int)
  draws: number;

  @Column({ type: 'int', default: 0 })
  @Field(() => Int)
  knockouts: number;

  @Column({ type: 'int', default: 0 })
  @Field(() => Int)
  submissions: number;

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @UpdateDateColumn()
  @Field()
  updatedAt: Date;
}
