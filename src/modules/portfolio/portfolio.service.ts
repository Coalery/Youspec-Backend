import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Portfolio } from './portfolio.entity';

@Injectable()
export class PortfolioService {
  constructor(
    @InjectRepository(Portfolio)
    private portfolioRepository: Repository<Portfolio>,
  ) {}

  async getPortfolioByName(customName: string): Promise<Portfolio> {
    const portfolio: Portfolio = await this.portfolioRepository
      .createQueryBuilder('portfolio')
      .where('`customName`=:customName', { customName })
      .leftJoinAndSelect('portfolio.user', 'user')
      .leftJoinAndSelect('portfolio.philosophies', 'philosophies')
      .leftJoinAndSelect('portfolio.portfolioTechStacks', 'techStacks')
      .leftJoinAndSelect('techStacks.techStack', 'techStack')
      .leftJoinAndSelect('portfolio.projects', 'projects')
      .leftJoinAndSelect('portfolio.activities', 'activities')
      .leftJoinAndSelect('portfolio.academics', 'academics')
      .getOne();

    if (!portfolio) {
      throw new HttpException(
        "Can't find portfolio with given name.",
        HttpStatus.NOT_FOUND,
      );
    }

    portfolio.projects.forEach((project) => {
      project.featureImageUrls = JSON.parse(project.featureImageUrls);
      project.featureStrings = JSON.parse(project.featureStrings);
      project.results = JSON.parse(project.results);
    });

    return portfolio;
  }
}
