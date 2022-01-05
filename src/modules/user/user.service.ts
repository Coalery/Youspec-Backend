import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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

  private createNewUser(uid: string, name: string, picture?: string): User {
    const newUser: User = new User();
    newUser.id = uid;
    newUser.name = name;
    newUser.profileUrl = picture;

    const portfolio: Portfolio = new Portfolio();
    portfolio.customName = uid;
    portfolio.user = newUser;

    return newUser;
  }

  async signUp(uid: string, name: string, picture?: string): Promise<User> {
    const user: User = await this.userRepository
      .createQueryBuilder('user')
      .where('`user`.`id`=:uid', { uid })
      .leftJoinAndSelect('user.portfolio', 'portfolio')
      .getOne();
    if (user) return user;

    const newUser: User = this.createNewUser(uid, name, picture);
    await this.userRepository.save(newUser);

    return newUser;
  }
}
