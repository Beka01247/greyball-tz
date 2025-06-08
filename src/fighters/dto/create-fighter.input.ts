import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateFighterInput {
  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field({ nullable: true })
  nickname?: string;

  @Field({ nullable: true })
  birthDate?: string;

  @Field({ nullable: true })
  country?: string;

  @Field(() => Int, { nullable: true })
  heightCm?: number;

  @Field(() => Int, { nullable: true })
  reachCm?: number;

  @Field()
  weightClass: string;

  @Field(() => Int, { defaultValue: 0 })
  wins: number;

  @Field(() => Int, { defaultValue: 0 })
  losses: number;

  @Field(() => Int, { defaultValue: 0 })
  knockouts: number;

  @Field(() => Int, { defaultValue: 0 })
  submissions: number;

  @Field({ defaultValue: false })
  isRetired: boolean;
}
