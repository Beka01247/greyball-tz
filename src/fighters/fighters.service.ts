import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFighterInput } from './dto/create-fighter.input';
import { UpdateFighterInput } from './dto/update-fighter.input';
import { Fighter } from './entities/fighter.entity';

@Injectable()
export class FightersService {
  constructor(
    @InjectRepository(Fighter)
    private readonly fighterRepository: Repository<Fighter>,
  ) {}

  create(createFighterInput: CreateFighterInput): Promise<Fighter> {
    const fighter = this.fighterRepository.create(createFighterInput);
    return this.fighterRepository.save(fighter);
  }

  findAll(): Promise<Fighter[]> {
    return this.fighterRepository.find();
  }

  async findOne(id: string): Promise<Fighter> {
    const fighter = await this.fighterRepository.findOneBy({ id });
    if (!fighter) {
      throw new NotFoundException(`Fighter #${id} not found`);
    }
    return fighter;
  }

  async update(
    id: string,
    updateFighterInput: UpdateFighterInput,
  ): Promise<Fighter> {
    const fighter = await this.findOne(id);
    Object.assign(fighter, updateFighterInput);
    return this.fighterRepository.save(fighter);
  }

  async remove(id: string): Promise<Fighter> {
    const fighter = await this.findOne(id);
    await this.fighterRepository.remove(fighter);
    return { ...fighter, id };
  }
}
