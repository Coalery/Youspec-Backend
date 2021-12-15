import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TechStack } from './tech_stack.entity';

@Injectable()
export class TechStackService {
  constructor(
    @InjectRepository(TechStack)
    private techStackRepository: Repository<TechStack>,
  ) {}

  async findAll(): Promise<TechStack[]> {
    return await this.techStackRepository.find();
  }
}
