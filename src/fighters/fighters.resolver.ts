import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { FightersService } from './fighters.service';
import { Fighter } from './entities/fighter.entity';
import { CreateFighterInput } from './dto/create-fighter.input';
import { UpdateFighterInput } from './dto/update-fighter.input';

@Resolver(() => Fighter)
export class FightersResolver {
  constructor(private readonly fightersService: FightersService) {}

  @Mutation(() => Fighter)
  createFighter(@Args('createFighterInput') createFighterInput: CreateFighterInput) {
    return this.fightersService.create(createFighterInput);
  }

  @Query(() => [Fighter], { name: 'fighters' })
  findAll() {
    return this.fightersService.findAll();
  }

  @Query(() => Fighter, { name: 'fighter' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.fightersService.findOne(id);
  }

  @Mutation(() => Fighter)
  updateFighter(@Args('updateFighterInput') updateFighterInput: UpdateFighterInput) {
    return this.fightersService.update(updateFighterInput.id, updateFighterInput);
  }

  @Mutation(() => Fighter)
  removeFighter(@Args('id', { type: () => Int }) id: number) {
    return this.fightersService.remove(id);
  }
}
