import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

import { UserRepository } from '../../domain/repository/user.repository';
import { User } from '../../domain/entity/user.entity';
import { Email } from '../../domain/values-object/email.vo';
import type { PasswordEncrypter } from 'src/users/domain/repository/password-encrypter.repository';
import type { JwtTokenService } from '../security/jwt-token.service';

@Injectable()
export class UserPrismaRepository implements UserRepository {
  constructor(
    private readonly prisma: PrismaService,
    @Inject('PasswordEncrypter')  private readonly passwordEncrypter: PasswordEncrypter, 
    @Inject('JwtToken') private readonly jwtService: JwtTokenService,
  ) { }

  async login(user: User): Promise<any> {
    console.log('Estoy en userprisma repository:');

    const userFounded = await this.findByEmail(user.email);
    if(!userFounded) throw new Error('No se encontro');
    console.log('userFounded:', userFounded);

    const isValid = await this.passwordEncrypter.compare(user.password, userFounded.password);

    if (!isValid) throw new Error('Invalid credentials');

    const token = this.jwtService.sign({
      id: userFounded.id,
      role: userFounded.role
    });

    const dataUser = {
      token: token,
      user: userFounded
    };
    
    return dataUser;
  }

  async register(user: User): Promise<any> {

    const hashed = await this.passwordEncrypter.encrypt(user.password);

    const createdUser = await this.prisma.users.create({
      data: {
        email: user.email.getValue(),
        name: user.name,
        password: hashed,
        role: user.role,
      },
    });
    user = User.ShowJSON(createdUser);

    return user.toPrimitives()
  }

  async findByEmail(email: Email): Promise<User | null> {
    const found = await this.prisma.users.findUnique({
      where: { email: email.getValue() },
    });
    if (!found) return null;

    return new User(
      found.id,
      Email.create(found.email),
      found.name,
      found.password,
      found.role,
      found.createdAt,
      found.updatedAt
    );
  }

  async findById(id: string): Promise<User | null> {
    const foundUser = await this.prisma.users.findUnique({ where: { id } });
    if (!foundUser) return null;

    return User.ShowJSON(foundUser);
  }
}
