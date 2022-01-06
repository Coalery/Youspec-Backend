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

  async getPortfolioByUserId(userId: string): Promise<Portfolio> {
    const portfolio: Portfolio = await this.portfolioRepository
      .createQueryBuilder('portfolio')
      .leftJoin('portfolio.user', 'user')
      .where('user.id = :userId', { userId })
      .getOne();

    if (!portfolio) {
      throw new HttpException(
        "Can't find portfolio with given user id.",
        HttpStatus.NOT_FOUND,
      );
    }

    return portfolio;
  }

  async getPortfolioByName(customName: string): Promise<Portfolio> {
    const portfolio: Portfolio = await this.portfolioRepository
      .createQueryBuilder('portfolio')
      .where('`customName`=:customName', { customName })
      .leftJoinAndSelect('portfolio.user', 'user')
      .leftJoinAndSelect('user.contacts', 'contacts')
      .leftJoinAndSelect('portfolio.philosophies', 'philosophies')
      .leftJoinAndSelect('portfolio.portfolioTechStacks', 'techStacks')
      .leftJoinAndSelect('techStacks.techStack', 'techStack')
      .leftJoinAndSelect('portfolio.projects', 'projects')
      .leftJoinAndSelect('projects.projectTechStacks', 'pStacks')
      .leftJoinAndSelect('pStacks.techStack', 'pTechStack')
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

  async savePortfolio(portfolio: Portfolio): Promise<void> {
    const beforePortfolio = await this.portfolioRepository.findOne(
      portfolio.id,
    );

    if (!beforePortfolio) {
      throw new HttpException(
        "Can't find portfolio with given id.",
        HttpStatus.NOT_FOUND,
      );
    }

    portfolio.projects.forEach((project) => {
      project.featureImageUrls = JSON.stringify(project.featureImageUrls);
      project.featureStrings = JSON.stringify(project.featureStrings);
      project.results = JSON.stringify(project.results);
    });

    await this.portfolioRepository.save(portfolio);
  }
}
