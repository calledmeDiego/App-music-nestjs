import { Inject, Injectable } from '@nestjs/common';
import { User } from 'src/users/domain/entity/user.entity';
import type { UserRepository } from 'src/users/domain/repository/user.repository';
import { Email } from 'src/users/domain/values-object/email.vo';
import { RegisterUserDTO } from '../dto/register-user.dto';
import type { PasswordEncrypter } from 'src/users/domain/repository/password-encrypter.repository';
import { LoginUserDTO } from '../dto/login-user.dto';
import { JwtTokenService } from 'src/users/infrastructure/security/jwt-token.service';


@Injectable()
export class UserService {
  constructor(
    @Inject('UserRepository') private readonly userRepository: UserRepository
) {}

  async registerUser(data: RegisterUserDTO) {
    const emailVO = Email.create(data.email);

    const user = await this.userRepository.findByEmail(emailVO);

    if (user) throw new Error('Email already exists');

    const userForm = User.CreateForm({
      email: emailVO,
      name: data.name,
      password: data.password,
      role: data.role
    });

    return this.userRepository.register(userForm);
  }

  async loginUser(data: LoginUserDTO){
    const emailVO = Email.create(data.email);
    const user = await this.userRepository.findByEmail(emailVO);

    
    if(!user) throw new Error('Invalid credentials');
    
    const userForm = User.CreateForm({
      email: emailVO,
      name: user.name!,
      password: data.password,
      role: user.role
    });
    
    
    return await this.userRepository.login(userForm);
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
