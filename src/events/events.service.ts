import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { CreateEventInput } from './dto/create-event.input';
import { UpdateEventInput } from './dto/update-event.input';
import { Event } from './entities/event.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {}

  create(createEventInput: CreateEventInput): Promise<Event> {
    const event = this.eventRepository.create(createEventInput);
    return this.eventRepository.save(event);
  }

  findAll(): Promise<Event[]> {
    return this.eventRepository.find({
      relations: ['fights'],
    });
  }

  async findOne(id: string): Promise<Event> {
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: ['fights'],
    });

    if (!event) {
      throw new NotFoundException(`Event #${id} not found`);
    }

    return event;
  }

  async update(id: string, updateEventInput: UpdateEventInput): Promise<Event> {
    const event = await this.findOne(id);
    Object.assign(event, updateEventInput);
    return this.eventRepository.save(event);
  }

  async remove(id: string): Promise<Event> {
    const event = await this.findOne(id);
    await this.eventRepository.remove(event);
    return { ...event, id };
  }

  findUpcoming(): Promise<Event[]> {
    return this.eventRepository.find({
      where: {
        date: MoreThan(new Date()),
        isFinished: false,
      },
      relations: ['fights'],
      order: {
        date: 'ASC',
      },
    });
  }
}
