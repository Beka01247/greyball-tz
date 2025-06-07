import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateEventInput {
  @Field()
  name: string;

  @Field()
  location: string;

  @Field()
  date: Date;

  @Field({ defaultValue: false })
  isFinished: boolean;
}
