import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { EventsService } from './events.service';
import { EventsResolver } from './events.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Event])],
  providers: [EventsResolver, EventsService],
})
export class EventsModule {}
