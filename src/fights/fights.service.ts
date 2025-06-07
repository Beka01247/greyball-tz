import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFightInput } from './dto/create-fight.input';
import { UpdateFightInput } from './dto/update-fight.input';
import { Fight } from './entities/fight.entity';
import { Fighter } from '../fighters/entities/fighter.entity';
import { Event } from '../events/entities/event.entity';

@Injectable()
export class FightsService {
  constructor(
    @InjectRepository(Fight)
    private readonly fightRepository: Repository<Fight>,
    @InjectRepository(Fighter)
    private readonly fighterRepository: Repository<Fighter>,
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
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
    Object.assign(fight, updateFightInput);
    return this.fightRepository.save(fight);
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
