import {
  Injectable,
  NotFoundException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFighterInput } from './dto/create-fighter.input';
import { UpdateFighterInput } from './dto/update-fighter.input';
import { Fighter } from './entities/fighter.entity';
import { RankingsService } from '../rankings/rankings.service';

@Injectable()
export class FightersService {
  constructor(
    @InjectRepository(Fighter)
    private readonly fighterRepository: Repository<Fighter>,
    @Inject(forwardRef(() => RankingsService))
    private readonly rankingsService: RankingsService,
  ) {}

  async create(createFighterInput: CreateFighterInput): Promise<Fighter> {
    const fighter = this.fighterRepository.create(createFighterInput);
    const savedFighter = await this.fighterRepository.save(fighter);

    // here we create initial rankings for the fighter
    await this.rankingsService.createOrUpdateRankingForFighter(savedFighter.id);

    return savedFighter;
  }

  findAll(): Promise<Fighter[]> {
    return this.fighterRepository.find();
  }

  async findOne(id: string): Promise<Fighter> {
    const fighter = await this.fighterRepository.findOneBy({ id });
    if (!fighter) {
      throw new NotFoundException(`Fighter #${id} not found`);
    }
    return fighter;
  }

  async update(
    id: string,
    updateFighterInput: UpdateFighterInput,
  ): Promise<Fighter> {
    const fighter = await this.findOne(id);

    if (
      (updateFighterInput.wins !== undefined && updateFighterInput.wins < 0) ||
      (updateFighterInput.losses !== undefined &&
        updateFighterInput.losses < 0) ||
      (updateFighterInput.knockouts !== undefined &&
        updateFighterInput.knockouts < 0) ||
      (updateFighterInput.submissions !== undefined &&
        updateFighterInput.submissions < 0)
    ) {
      throw new Error('Fighter statistics cannot be negative');
    }

    const totalWins = updateFighterInput.wins ?? fighter.wins;
    const knockouts = updateFighterInput.knockouts ?? fighter.knockouts;
    const submissions = updateFighterInput.submissions ?? fighter.submissions;

    if (knockouts + submissions > totalWins) {
      throw new Error('Total KOs and submissions cannot exceed total wins');
    }

    Object.assign(fighter, updateFighterInput);
    const updatedFighter = await this.fighterRepository.save(fighter);

    // updating rankings for the fighter
    await this.rankingsService.createOrUpdateRankingForFighter(
      updatedFighter.id,
    );

    return updatedFighter;
  }

  async remove(id: string): Promise<Fighter> {
    const fighter = await this.findOne(id);
    await this.fighterRepository.remove(fighter);
    return { ...fighter, id };
  }
}
