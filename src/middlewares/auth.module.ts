import { Module } from '@nestjs/common';
import { UserModule } from 'src/modules/user/user.module';
import { AuthMiddleware } from './auth.middleware';

@Module({
  imports: [UserModule],
  providers: [AuthMiddleware],
})
export class AuthModule {}
