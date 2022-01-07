import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class TokenRequiredGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest();

    if (!request['gfUser']) {
      throw new HttpException('Token is required.', HttpStatus.FORBIDDEN);
    }

    return true;
  }
}
