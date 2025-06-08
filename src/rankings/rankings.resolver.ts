import {
  Resolver,
  Query,
  Mutation,
  Args,
  ID,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { RankingsService } from './rankings.service';
import { Ranking } from './entities/ranking.entity';
import { CreateRankingInput } from './dto/create-ranking.input';
import { UpdateRankingInput } from './dto/update-ranking.input';
import { Fighter } from '../fighters/entities/fighter.entity';

@Resolver(() => Ranking)
export class RankingsResolver {
  constructor(private readonly rankingsService: RankingsService) {}

  @Mutation(() => Ranking)
  createRanking(
    @Args('createRankingInput') createRankingInput: CreateRankingInput,
  ) {
    return this.rankingsService.create(createRankingInput);
  }

  @Query(() => [Ranking], { name: 'rankings' })
  findAll() {
    return this.rankingsService.findAll();
  }

  @Query(() => [Ranking], { name: 'rankingsByWeightClass' })
  findByWeightClass(
    @Args('weightClass', { type: () => String }) weightClass: string,
  ) {
    return this.rankingsService.findByWeightClass(weightClass);
  }

  @Query(() => Ranking, { name: 'ranking' })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.rankingsService.findOne(id);
  }

  @Mutation(() => Ranking)
  updateRanking(
    @Args('updateRankingInput') updateRankingInput: UpdateRankingInput,
  ) {
    return this.rankingsService.update(
      updateRankingInput.id,
      updateRankingInput,
    );
  }

  @Mutation(() => Ranking)
  removeRanking(@Args('id', { type: () => ID }) id: string) {
    return this.rankingsService.remove(id);
  }

  @ResolveField('fighter', () => Fighter)
  async fighter(@Parent() ranking: Ranking) {
    return (
      ranking.fighter || this.rankingsService.getFighter(ranking.fighterId)
    );
  }
}
