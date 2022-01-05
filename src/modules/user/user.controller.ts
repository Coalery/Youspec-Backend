import { Controller, Post, UseGuards } from '@nestjs/common';
import { auth } from 'firebase-admin';
import { GetFirebaseUser } from 'src/decorators/get_user.decorator';
import { TokenRequiredGuard } from 'src/guards/token_required.guard';
import { SignUpResultDto } from './user.dto';
import { User } from './user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('signup')
  @UseGuards(TokenRequiredGuard)
  async signUp(@GetFirebaseUser() firebaseUser: auth.DecodedIdToken) {
    const { uid, name, picture } = firebaseUser;
    const user: User = await this.userService.signUp(uid, name, picture);
    return new SignUpResultDto(user);
  }
}
