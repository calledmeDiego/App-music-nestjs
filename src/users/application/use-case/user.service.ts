import { Inject, Injectable } from '@nestjs/common';
import { User } from 'src/users/domain/entity/user.entity';
import type { UserRepository } from 'src/users/domain/repository/user.repository';
import { Email } from 'src/users/domain/values-object/email.vo';


@Injectable()
export class UserService {

  /**
   *
   */
  constructor(@Inject('UserRepository') private readonly userRepository: UserRepository) {
  }

  async create(email: string, name: string | null, password: string) {
    const emailVO = Email.create(email);

    const existing = await this.userRepository.findByEmail(emailVO);

    if (existing) throw new Error('Email already exists');

    const user = new User(
      '',
      emailVO,
      name,
      password,
      'user',
      new Date(),
      new Date()
    );

    return this.userRepository.create(user);
  }

  findAll() {
    return `This action returns all users`;
  }

  async findById(id: string) {
    return this.userRepository.findById(id);
  }

  update(id: number, updateUserDto: any) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
