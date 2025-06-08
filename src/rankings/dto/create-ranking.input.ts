import { InputType, Field, ID, Int, Float } from '@nestjs/graphql';

@InputType()
export class CreateRankingInput {
  @Field(() => ID)
  fighterId: string;

  @Field()
  weightClass: string;

  @Field(() => Int)
  position: number;

  @Field(() => Float)
  points: number;
}
