import {
  Injectable,
  NotFoundException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ranking } from './entities/ranking.entity';
import { CreateRankingInput } from './dto/create-ranking.input';
import { UpdateRankingInput } from './dto/update-ranking.input';
import { Fighter } from '../fighters/entities/fighter.entity';
import { FightResult } from '../fights/entities/fight.entity';
import { FightersService } from '../fighters/fighters.service';

@Injectable()
export class RankingsService {
  /**
   * ranking system:
   *
   * init fighter: 1000
   * for wins: +800
   * for losses: -400
   *
   * bonuses:
   * - KO: +200
   * - TKO: +150
   * - SUBMISSION: +150
   * - Beating fighter with higher ranking: +100
   */
  private readonly BASE_POINTS = {
    INITIAL: 1000,
    WIN: 800,
    LOSS: -400,
    BONUS: {
      KO: 200,
      TKO: 150,
      SUBMISSION: 150,
      HIGHER_RANKED_OPPONENT: 100,
    },
  };

  /**
   * init ranking for fighter:
   * 1. base points: 1000
   * 2. add points for each win: +800
   * 3. subtract points for each loss: -400
   * 4. add bonus points for each KO: +200
   * 5. add bonus points for each submission: +150
   * 6. ensure total points never go below 0
   *
   * @param fighter the fighter to calculate points for
   * @returns the calculated points value
   */
  private calculateInitialPoints(fighter: Fighter): number {
    let points = this.BASE_POINTS.INITIAL;

    points += fighter.wins * this.BASE_POINTS.WIN;

    points += fighter.losses * this.BASE_POINTS.LOSS;

    points += fighter.knockouts * this.BASE_POINTS.BONUS.KO;
    points += fighter.submissions * this.BASE_POINTS.BONUS.SUBMISSION;

    return Math.max(points, 0);
  }

  constructor(
    @InjectRepository(Ranking)
    private readonly rankingRepository: Repository<Ranking>,
    @Inject(forwardRef(() => FightersService))
    private readonly fightersService: FightersService,
  ) {}

  async create(createRankingInput: CreateRankingInput): Promise<Ranking> {
    const ranking = this.rankingRepository.create(createRankingInput);
    return this.rankingRepository.save(ranking);
  }

  findAll(): Promise<Ranking[]> {
    return this.rankingRepository.find({
      relations: ['fighter'],
    });
  }

  findByWeightClass(weightClass: string): Promise<Ranking[]> {
    return this.rankingRepository.find({
      where: { weightClass },
      relations: ['fighter'],
      order: { position: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Ranking> {
    const ranking = await this.rankingRepository.findOne({
      where: { id },
      relations: ['fighter'],
    });

    if (!ranking) {
      throw new NotFoundException(`Ranking #${id} not found`);
    }

    return ranking;
  }

  async update(
    id: string,
    updateRankingInput: UpdateRankingInput,
  ): Promise<Ranking> {
    const ranking = await this.findOne(id);
    Object.assign(ranking, updateRankingInput);
    return this.rankingRepository.save(ranking);
  }

  async remove(id: string): Promise<Ranking> {
    const ranking = await this.findOne(id);
    await this.rankingRepository.remove(ranking);
    return { ...ranking, id };
  }

  /**
   * updates rankings after a fight:
   * 1. find or create rankings for both fighters
   * 2. update winner's points:
   *    - add win points
   *    - add bonus points based on finish type
   *    - add bonus if opponent was higher ranked
   * 3. update loser's points (deduct)
   * 4. save updated rankings
   * 5. reorder all rankings in the weight class
   *
   * @param winnerId ID of the winning fighter
   * @param loserId ID of the losing fighter
   * @param result type of victory (KO, TKO, SUB, etc)
   * @param weightClass weight class of the fight
   */
  async calculateAndUpdateRankings(
    winnerId: string,
    loserId: string,
    result: FightResult,
    weightClass: string,
  ): Promise<void> {
    let winnerRanking = await this.rankingRepository.findOne({
      where: { fighterId: winnerId, weightClass },
    });

    let loserRanking = await this.rankingRepository.findOne({
      where: { fighterId: loserId, weightClass },
    });

    if (!winnerRanking) {
      winnerRanking = this.rankingRepository.create({
        fighterId: winnerId,
        weightClass,
        points: 1000,
        position: 999,
      });
    }

    if (!loserRanking) {
      loserRanking = this.rankingRepository.create({
        fighterId: loserId,
        weightClass,
        points: 1000,
        position: 999,
      });
    }

    winnerRanking.points += this.BASE_POINTS.WIN;
    loserRanking.points += this.BASE_POINTS.LOSS;

    if (result === FightResult.KO) {
      winnerRanking.points += this.BASE_POINTS.BONUS.KO;
    } else if (result === FightResult.TKO) {
      winnerRanking.points += this.BASE_POINTS.BONUS.TKO;
    } else if (result === FightResult.SUBMISSION) {
      winnerRanking.points += this.BASE_POINTS.BONUS.SUBMISSION;
    }

    if (loserRanking.position < winnerRanking.position) {
      winnerRanking.points += this.BASE_POINTS.BONUS.HIGHER_RANKED_OPPONENT;
    }

    await this.rankingRepository.save([winnerRanking, loserRanking]);

    await this.reorderRankings(weightClass);
  }

  /**
   * reorders all rankings within a weight class based on points
   * updates positions to reflect new order (1 = highest points)
   *
   * @param weightClass weight class to reorder rankings for
   */
  private async reorderRankings(weightClass: string): Promise<void> {
    const rankings = await this.rankingRepository.find({
      where: { weightClass },
      order: { points: 'DESC' },
    });

    const updatedRankings = rankings.map((ranking, index) => ({
      ...ranking,
      position: index + 1,
    }));

    await this.rankingRepository.save(updatedRankings);
  }

  async getFighter(fighterId: string): Promise<Fighter> {
    return this.fightersService.findOne(fighterId);
  }

  async createOrUpdateRankingForFighter(fighterId: string): Promise<Ranking> {
    const fighter = await this.fightersService.findOne(fighterId);

    let ranking = await this.rankingRepository.findOne({
      where: { fighterId, weightClass: fighter.weightClass },
    });

    if (!ranking) {
      ranking = this.rankingRepository.create({
        fighterId,
        weightClass: fighter.weightClass,
        points: this.calculateInitialPoints(fighter),
        position: 999,
      });
    } else {
      ranking.points = this.calculateInitialPoints(fighter);
    }

    await this.rankingRepository.save(ranking);

    await this.reorderRankings(fighter.weightClass);

    return this.findOne(ranking.id);
  }
}
