import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { auth } from 'firebase-admin';
import { Repository } from 'typeorm';
import { Portfolio } from '../portfolio/portfolio.entity';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne(id);
    if (!user) {
      throw new HttpException(
        "Can't find user with given id.",
        HttpStatus.NOT_FOUND,
      );
    }
    return user;
  }

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

  async signUp(data: auth.DecodedIdToken): Promise<User> {
    if (!data) {
      throw new HttpException('Token is required.', HttpStatus.BAD_REQUEST);
    }

    const user: User = await this.userRepository
      .createQueryBuilder('user')
      .where('`user`.`id`=:uid', { uid: data.uid })
      .leftJoinAndSelect('user.portfolio', 'portfolio')
      .getOne();
    if (user) return user;

    const newUser: User = new User();
    newUser.id = data.uid;
    newUser.name = data.name;
    newUser.profileUrl = data.picture;

    const portfolio: Portfolio = new Portfolio();
    portfolio.customName = data.uid;
    portfolio.user = newUser;

    await this.userRepository.save(newUser);

    return newUser;
  }
}
