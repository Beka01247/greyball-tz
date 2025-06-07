import { InputType, Field, ID, Int } from '@nestjs/graphql';
import { FightResult } from '../entities/fight.entity';

@InputType()
export class CreateFightInput {
  @Field(() => ID)
  eventId: string;

  @Field(() => ID)
  fighter1Id: string;

  @Field(() => ID)
  fighter2Id: string;

  @Field(() => ID, { nullable: true })
  winnerId?: string;

  @Field(() => FightResult, { nullable: true })
  result?: FightResult;

  @Field(() => Int, { nullable: true })
  roundEnded?: number;
}
