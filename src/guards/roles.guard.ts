import {
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { RoleType } from 'src/decorators/roles.decorator';
import { Portfolio } from 'src/modules/portfolio/portfolio.entity';
import { PortfolioService } from 'src/modules/portfolio/portfolio.service';
import { ProjectService } from 'src/modules/project/project.service';
import { User } from 'src/modules/user/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private projectService: ProjectService,
    private portfolioService: PortfolioService,
  ) {}

  isUser(user: User): boolean {
    return user.id !== 'guest';
  }

  async isMaker(request: Request, user: User): Promise<boolean> {
    const projectId = request['params'].projectId;
    if (!projectId) {
      throw new InternalServerErrorException('ProjectId params not found.');
    }

    const makers: User[] = await this.projectService.getMakersById(
      Number.parseInt(projectId),
    );
    return makers.some((maker) => maker.id === user.id);
  }

  async isMe(request: Request, user: User): Promise<boolean> {
    const portfolioName = request['params'].name;
    if (!portfolioName) {
      throw new InternalServerErrorException(
        'Portfolio custom name params not found.',
      );
    }
    const portfolio: Portfolio =
      await this.portfolioService.getPortfolioByUserId(user.id);

    return portfolio.customName === portfolioName;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<RoleType[]>('roles', context.getHandler());
    if (!roles) return true;

    const request: Request = context.switchToHttp().getRequest();
    const user: User = request['user'];

    let currentRole: RoleType = 'guest';

    if (this.isUser(user)) currentRole = 'user';
    else if (
      roles[0] === 'maker' &&
      roles.length === 1 &&
      this.isMaker(request, user)
    ) {
      currentRole = 'maker';
    } else if (
      roles[0] === 'me' &&
      roles.length === 1 &&
      this.isMe(request, user)
    ) {
      currentRole = 'me';
    }

    return roles.some((role) => role === currentRole);
  }
}
