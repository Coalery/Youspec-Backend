import {
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleType } from 'src/decorators/roles.decorator';
import { ProjectService } from 'src/modules/project/project.service';
import { User } from 'src/modules/user/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private projectService: ProjectService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<RoleType[]>('roles', context.getHandler());
    if (!roles) return true;

    const request: Request = context.switchToHttp().getRequest();
    const user: User = request['user'];

    let currentRole: RoleType = 'guest';

    if (user.id !== 'guest') currentRole = 'user';
    // 꼭 `maker`가 필요할 때만 작동되도록
    else if (roles[0] === 'maker' && roles.length === 1) {
      const projectId = request['params'].projectId;
      if (!projectId) {
        throw new InternalServerErrorException('ProjectId params not found.');
      }

      const makers: User[] = await this.projectService.getMakersById(
        Number.parseInt(projectId),
      );
      if (makers.some((maker) => maker.id === user.id)) currentRole = 'maker';
    }

    return roles.some((role) => role === currentRole);
  }
}
