import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Fight } from './entities/fight.entity';
import { FightsService } from './fights.service';
import { FightsResolver } from './fights.resolver';
import { Fighter } from '../fighters/entities/fighter.entity';
import { Event } from '../events/entities/event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Fight, Fighter, Event])],
  providers: [FightsResolver, FightsService],
  exports: [FightsService],
})
export class FightsModule {}
