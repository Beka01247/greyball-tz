import { CreateEventInput } from './create-event.input';
import { InputType, Field, ID, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateEventInput extends PartialType(CreateEventInput) {
  @Field(() => ID)
  id: string;
}
