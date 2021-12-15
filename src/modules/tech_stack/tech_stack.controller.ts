import { Controller, Get } from '@nestjs/common';
import { TechStackService } from './tech_stack.service';

@Controller('techstack')
export class TechStackController {
  constructor(private techStackService: TechStackService) {}

  @Get()
  async findAll() {
    return await this.techStackService.findAll();
  }
}
