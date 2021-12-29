import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './project.entity';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project) private projectRepository: Repository<Project>,
  ) {}

  async getProjectById(id: number): Promise<Project> {
    const project: Project = await this.projectRepository
      .createQueryBuilder('project')
      .where('`project`.`id`=:id', { id })
      .leftJoinAndSelect('project.projectTechStacks', 'pTechStacks')
      .leftJoinAndSelect('pTechStacks.techStack', 'techStacks')
      .leftJoinAndSelect('project.projectUsers', 'makers')
      .leftJoinAndSelect('makers.user', 'user')
      .leftJoinAndSelect('project.platforms', 'platforms')
      .leftJoinAndSelect('platforms.troubleshootings', 'troubleshootings')
      .leftJoinAndSelect('project.apiCategories', 'apiCategories')
      .leftJoinAndSelect('apiCategories.apiUnits', 'apiUnits')
      .getOne();

    if (!project) {
      throw new HttpException(
        "Can't find project with given id.",
        HttpStatus.NOT_FOUND,
      );
    }

    project.featureImageUrls = JSON.parse(project.featureImageUrls);
    project.featureStrings = JSON.parse(project.featureStrings);
    project.results = JSON.parse(project.results);

    project.projectUsers.forEach((projectUser) => {
      projectUser.contributions = JSON.parse(projectUser.contributions);
    });

    project.apiCategories.forEach((apiCategory) =>
      apiCategory.apiUnits.forEach((apiUnit) => {
        apiUnit.requestValues = JSON.parse(apiUnit.requestValues);
        apiUnit.responseValues = JSON.parse(apiUnit.responseValues);
      }),
    );

    return project;
  }

  async getFilteredProjects(filters: string[]): Promise<Project[]> {
    return await this.projectRepository
      .createQueryBuilder('project')
      .leftJoin('project.projectTechStacks', 'pStacks')
      .leftJoin('pStacks.techStack', 'techStack')
      .where('techStack.name in (:filters)', { filters: filters.join(',') })
      .getMany();
  }

  async saveProject(project: Project): Promise<void> {
    project.projectTechStacks.forEach((stack) => {
      if (typeof stack.id === 'string') delete stack.id;
    });
    project.projectTechStacks = project.projectTechStacks.filter(
      (stack) => stack.techStack.name !== '선택',
    );

    project.apiCategories.forEach((apiCategory) => {
      if (typeof apiCategory.id === 'string') delete apiCategory.id;
      apiCategory.apiUnits.forEach((apiUnit) => {
        if (typeof apiUnit.id === 'string') delete apiUnit.id;
        apiUnit.requestValues = JSON.stringify(apiUnit.requestValues);
        apiUnit.responseValues = JSON.stringify(apiUnit.responseValues);
      });
    });

    project.platforms.forEach((platform) =>
      platform.troubleshootings.forEach((troubleshooting) => {
        if (typeof troubleshooting.id === 'string') delete troubleshooting.id;
        if (troubleshooting.platform) delete troubleshooting.platform;
      }),
    );

    project.featureImageUrls = JSON.stringify(project.featureImageUrls);
    project.featureStrings = JSON.stringify(project.featureStrings);
    project.results = JSON.stringify(project.results);

    project.projectUsers.forEach((projectUser) => {
      projectUser.contributions = JSON.stringify(projectUser.contributions);
    });

    await this.projectRepository.save(project);
  }
}
