import { CreateFighterInput } from './create-fighter.input';
import { InputType, Field, ID, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateFighterInput extends PartialType(CreateFighterInput) {
  @Field(() => ID)
  id: string;
}
