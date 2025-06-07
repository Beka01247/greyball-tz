import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FightersService } from './fighters.service';
import { FightersResolver } from './fighters.resolver';
import { Fighter } from './entities/fighter.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Fighter])],
  providers: [FightersResolver, FightersService],
})
export class FightersModule {}
