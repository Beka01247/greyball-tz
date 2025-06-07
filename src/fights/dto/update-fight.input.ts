import { CreateFightInput } from './create-fight.input';
import { InputType, Field, ID, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateFightInput extends PartialType(CreateFightInput) {
  @Field(() => ID)
  id: string;
}
