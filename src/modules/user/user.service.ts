import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async findByNames(names: string[]): Promise<User[]> {
    const users: User[] = await this.userRepository
      .createQueryBuilder('user')
      .where('name IN (:names)', { names })
      .getMany();

    if (names.length != users.length) {
      throw new HttpException(
        "Can't find user with given username.",
        HttpStatus.NOT_FOUND,
      );
    }

    return users;
  }
}
