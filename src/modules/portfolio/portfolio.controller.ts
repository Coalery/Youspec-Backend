import { Controller, Get, Param } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';

@Controller('portfolio')
export class PortfolioController {
  constructor(private portfolioService: PortfolioService) {}

  @Get(':name')
  async getPortfolioByName(@Param('name') customName: string) {
    return await this.portfolioService.getPortfolioByName(customName);
  }
}
