import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import * as admin from 'firebase-admin';
import { User } from 'src/modules/user/user.entity';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  createGuestUser() {
    const guestUser: User = new User();
    guestUser.id = 'guest';
    guestUser.name = '게스트';
    return guestUser;
  }

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
          req['user'] = this.createGuestUser();
          next();
        });
    } else {
      req['user'] = this.createGuestUser();
      next();
    }
  }
}
