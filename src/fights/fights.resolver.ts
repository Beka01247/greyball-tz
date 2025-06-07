import {
  Resolver,
  Query,
  Mutation,
  Args,
  ID,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { FightsService } from './fights.service';
import { Fight } from './entities/fight.entity';
import { CreateFightInput } from './dto/create-fight.input';
import { UpdateFightInput } from './dto/update-fight.input';
import { Fighter } from '../fighters/entities/fighter.entity';
import { Event } from '../events/entities/event.entity';

@Resolver(() => Fight)
export class FightsResolver {
  constructor(private readonly fightsService: FightsService) {}

  @Mutation(() => Fight)
  createFight(@Args('createFightInput') createFightInput: CreateFightInput) {
    return this.fightsService.create(createFightInput);
  }

  @Query(() => [Fight], { name: 'fights' })
  findAll() {
    return this.fightsService.findAll();
  }

  @Query(() => Fight, { name: 'fight' })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.fightsService.findOne(id);
  }

  @Mutation(() => Fight)
  updateFight(@Args('updateFightInput') updateFightInput: UpdateFightInput) {
    return this.fightsService.update(updateFightInput.id, updateFightInput);
  }

  @Mutation(() => Fight)
  removeFight(@Args('id', { type: () => ID }) id: string) {
    return this.fightsService.remove(id);
  }

  @ResolveField('event', () => Event)
  event(@Parent() fight: Fight) {
    return this.fightsService.getEvent(fight.eventId);
  }

  @ResolveField('fighter1', () => Fighter)
  fighter1(@Parent() fight: Fight) {
    return this.fightsService.getFighter(fight.fighter1Id);
  }

  @ResolveField('fighter2', () => Fighter)
  fighter2(@Parent() fight: Fight) {
    return this.fightsService.getFighter(fight.fighter2Id);
  }

  @ResolveField('winner', () => Fighter, { nullable: true })
  winner(@Parent() fight: Fight) {
    if (!fight.winnerId) return null;
    return this.fightsService.getFighter(fight.winnerId);
  }
}
