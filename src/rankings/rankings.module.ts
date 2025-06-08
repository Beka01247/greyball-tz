import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ranking } from './entities/ranking.entity';
import { RankingsService } from './rankings.service';
import { RankingsResolver } from './rankings.resolver';
import { FightersModule } from '../fighters/fighters.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ranking]),
    forwardRef(() => FightersModule),
  ],
  providers: [RankingsResolver, RankingsService],
  exports: [RankingsService],
})
export class RankingsModule {}
