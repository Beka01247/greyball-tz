import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FightersService } from './fighters.service';
import { FightersResolver } from './fighters.resolver';
import { Fighter } from './entities/fighter.entity';
import { RankingsModule } from '../rankings/rankings.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Fighter]),
    forwardRef(() => RankingsModule),
  ],
  providers: [FightersResolver, FightersService],
  exports: [FightersService, TypeOrmModule],
})
export class FightersModule {}
