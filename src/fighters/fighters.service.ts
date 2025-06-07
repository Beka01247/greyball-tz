import { Injectable } from '@nestjs/common';
import { CreateFighterInput } from './dto/create-fighter.input';
import { UpdateFighterInput } from './dto/update-fighter.input';

@Injectable()
export class FightersService {
  create(createFighterInput: CreateFighterInput) {
    return 'This action adds a new fighter';
  }

  findAll() {
    return `This action returns all fighters`;
  }

  findOne(id: number) {
    return `This action returns a #${id} fighter`;
  }

  update(id: number, updateFighterInput: UpdateFighterInput) {
    return `This action updates a #${id} fighter`;
  }

  remove(id: number) {
    return `This action removes a #${id} fighter`;
  }
}
