import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectTechStack } from '../project_tech_stack/project_tech_stack.entity';
import { ProjectUser } from '../project_user/project_user.entity';
import { UserService } from '../user/user.service';
import { CreateProjectDto } from './project.dto';
import { Project } from './project.entity';
import { Platform } from '../platform/platform.entity';
import { User } from '../user/user.entity';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project) private projectRepository: Repository<Project>,
    private userService: UserService,
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

  async getMakersById(id: number): Promise<User[]> {
    const project: Project = await this.projectRepository
      .createQueryBuilder('project')
      .where('`project`.`id`=:id', { id })
      .leftJoinAndSelect('project.projectUsers', 'makers')
      .leftJoinAndSelect('makers.user', 'user')
      .getOne();

    if (!project) {
      throw new HttpException(
        "Can't find project with given id.",
        HttpStatus.NOT_FOUND,
      );
    }

    return project.projectUsers.map((projectUser) => projectUser.user);
  }

  async getFilteredProjects(filters: string[]): Promise<Project[]> {
    return await this.projectRepository
      .createQueryBuilder('project')
      .leftJoin('project.projectTechStacks', 'pStacks')
      .leftJoin('pStacks.techStack', 'techStack')
      .where('techStack.name in (:filters)', { filters: filters.join(',') })
      .getMany();
  }

  async createProject(data: CreateProjectDto): Promise<Project> {
    const newProject: Project = new Project();
    newProject.name = data.name;
    newProject.startDate = new Date(Date.now());

    newProject.projectTechStacks = data.techStacks.map((techStack) => {
      const newProjectTechStack: ProjectTechStack = new ProjectTechStack();
      newProjectTechStack.techStack = techStack;
      return newProjectTechStack;
    });

    const makers = await this.userService.findByNames(
      data.makers
        .trim()
        .split(',')
        .map((v) => v.trim()),
    );
    newProject.projectUsers = makers.map((maker) => {
      const newProjectUser: ProjectUser = new ProjectUser();
      newProjectUser.user = maker;
      return newProjectUser;
    });

    newProject.platforms = data.platformNames
      .trim()
      .split(',')
      .map((platformName) => {
        const newPlatform: Platform = new Platform();
        newPlatform.name = platformName.trim();
        newPlatform.relatedUrl = '';
        return newPlatform;
      });

    return await this.projectRepository.save(newProject);
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

  async removeProject(id: number): Promise<void> {
    const result = await this.projectRepository.delete({ id });

    if (result.affected < 1) {
      throw new HttpException(
        "Can't find project with given id.",
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
