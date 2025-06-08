import { InputType, Field, ID, PartialType } from '@nestjs/graphql';
import { CreateRankingInput } from './create-ranking.input';

@InputType()
export class UpdateRankingInput extends PartialType(CreateRankingInput) {
  @Field(() => ID)
  id: string;
}
