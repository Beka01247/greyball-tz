import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFightInput } from './dto/create-fight.input';
import { UpdateFightInput } from './dto/update-fight.input';
import { Fight, FightResult } from './entities/fight.entity';
import { Fighter } from '../fighters/entities/fighter.entity';
import { Event } from '../events/entities/event.entity';
import { RankingsService } from '../rankings/rankings.service';

@Injectable()
export class FightsService {
  constructor(
    @InjectRepository(Fight)
    private readonly fightRepository: Repository<Fight>,
    @InjectRepository(Fighter)
    private readonly fighterRepository: Repository<Fighter>,
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    private readonly rankingsService: RankingsService,
  ) {}

  create(createFightInput: CreateFightInput): Promise<Fight> {
    const fight = this.fightRepository.create(createFightInput);
    return this.fightRepository.save(fight);
  }

  findAll(): Promise<Fight[]> {
    return this.fightRepository.find();
  }

  async findOne(id: string): Promise<Fight> {
    const fight = await this.fightRepository.findOne({
      where: { id },
    });

    if (!fight) {
      throw new NotFoundException(`Fight #${id} not found`);
    }

    return fight;
  }

  async update(id: string, updateFightInput: UpdateFightInput): Promise<Fight> {
    const fight = await this.findOne(id);
    const oldFight = { ...fight };
    Object.assign(fight, updateFightInput);

    const savedFight = await this.fightRepository.save(fight);

    // after winner is set, update fighter stats and rankings
    if (
      updateFightInput.result &&
      updateFightInput.winnerId &&
      (!oldFight.result || !oldFight.winnerId)
    ) {
      const loserId =
        updateFightInput.winnerId === fight.fighter1Id
          ? fight.fighter2Id
          : fight.fighter1Id;

      const winner = await this.getFighter(updateFightInput.winnerId);
      const loser = await this.getFighter(loserId);

      // updating stats
      await this.updateFighterStats(winner, loser, updateFightInput.result);

      // updating rankings
      await this.rankingsService.calculateAndUpdateRankings(
        updateFightInput.winnerId,
        loserId,
        updateFightInput.result,
        winner.weightClass,
      );
    }

    return savedFight;
  }

  private async updateFighterStats(
    winner: Fighter,
    loser: Fighter,
    result: FightResult,
  ): Promise<void> {
    winner.wins += 1;
    if (result === FightResult.KO || result === FightResult.TKO) {
      winner.knockouts += 1;
    } else if (result === FightResult.SUBMISSION) {
      winner.submissions += 1;
    }
    await this.fighterRepository.save(winner);

    loser.losses += 1;
    await this.fighterRepository.save(loser);
  }

  async remove(id: string): Promise<Fight> {
    const fight = await this.findOne(id);
    await this.fightRepository.remove(fight);
    return { ...fight, id };
  }

  async findByEvent(eventId: string): Promise<Fight[]> {
    return this.fightRepository.find({
      where: { eventId },
    });
  }

  async getFighter(fighterId: string): Promise<Fighter> {
    const fighter = await this.fighterRepository.findOne({
      where: { id: fighterId },
    });

    if (!fighter) {
      throw new NotFoundException(`Fighter #${fighterId} not found`);
    }

    return fighter;
  }

  async getEvent(eventId: string): Promise<Event> {
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
    });

    if (!event) {
      throw new NotFoundException(`Event #${eventId} not found`);
    }

    return event;
  }
}
