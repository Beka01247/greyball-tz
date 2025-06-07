import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Fight } from '../../fights/entities/fight.entity';

@Entity('events')
@ObjectType()
export class Event {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column({ length: 100 })
  @Field()
  name: string;

  @Column({ length: 100 })
  @Field()
  location: string;

  @Column({ type: 'timestamp' })
  @Field()
  date: Date;

  @Column({ default: false })
  @Field()
  isFinished: boolean;

  @OneToMany(() => Fight, (fight) => fight.event)
  @Field(() => [Fight], { nullable: true })
  fights: Fight[];

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @UpdateDateColumn()
  @Field()
  updatedAt: Date;
}
