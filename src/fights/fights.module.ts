import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Fight } from './entities/fight.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Fight])],
})
export class FightsModule {}
