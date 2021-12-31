import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { Roles } from 'src/decorators/roles.decorator';
import { Portfolio } from './portfolio.entity';
import { PortfolioService } from './portfolio.service';

@Controller('portfolio')
export class PortfolioController {
  constructor(private portfolioService: PortfolioService) {}

  @Get(':name')
  async getPortfolioByName(@Param('name') customName: string) {
    return await this.portfolioService.getPortfolioByName(customName);
  }

  @Put(':name')
  @Roles('me')
  async savePortfolio(@Body() data: Portfolio) {
    await this.portfolioService.savePortfolio(data);
    return true;
  }
}
