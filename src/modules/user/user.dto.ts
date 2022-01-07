import { User } from './user.entity';

export class SignUpResultDto {
  id: string;
  name: string;
  profileUrl?: string;
  portfolio: { customName: string };

  constructor(user: User) {
    this.id = user.id;
    this.name = user.name;
    this.profileUrl = user.profileUrl;
    this.portfolio = { customName: user.portfolio.customName };
  }
}
