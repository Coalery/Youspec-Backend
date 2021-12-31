import { Controller, Post } from '@nestjs/common';
import { auth } from 'firebase-admin';
import { GetFirebaseUser } from 'src/decorators/get_user.decorator';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('signup')
  async signUp(@GetFirebaseUser() firebaseUser: auth.DecodedIdToken) {
    return await this.userService.signUp(firebaseUser);
  }
}
