import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import * as admin from 'firebase-admin';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization;
    if (token) {
      admin
        .auth()
        .verifyIdToken(token.replace('Bearer', ''))
        .then(async (decodedToken) => {
          req['gfUser'] = decodedToken;
          req['user'] = await this.userService.findById(decodedToken.uid);
          next();
        })
        .catch(() => {
          res.status(403).json({
            code: 403,
            data: 'Not a valid id token.',
            timestamp: new Date().toISOString(),
          });
        });
    } else {
      throw new HttpException('Token is required.', HttpStatus.FORBIDDEN);
    }
  }
}
