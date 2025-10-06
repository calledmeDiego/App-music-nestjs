import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/infrastructure/prisma/services/prisma.service';

import { AuthRepository } from '../../domain/repository/auth.repository';
import { UserEntity } from '../../domain/entity/user.entity';
import { Email } from '../../domain/values-object/email.vo';
import type { PasswordEncrypter } from 'src/auth/domain/repository/password-encrypter.repository';
import type { JwtTokenService } from '../security/jwt-token.service';

@Injectable()
export class AuthSqlServerRepository implements AuthRepository {
  constructor(
    private readonly prisma: PrismaService,
    @Inject('PasswordEncrypter') private readonly passwordEncrypter: PasswordEncrypter,
    @Inject('JwtToken') private readonly jwtService: JwtTokenService,
  ) { }

  async login(user: UserEntity): Promise<any> {

    const userFounded = await this.findByEmail(user.email);
    if (!userFounded) throw new Error('No se encontro');

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

  async register(user: UserEntity): Promise<any> {

    const hashed = await this.passwordEncrypter.encrypt(user.password);

    const createdUser = await this.prisma.sql.users.create({
      data: {
        email: user.email.getValue(),
        name: user.name,
        password: hashed,
        role: user.role,
      },
    });
    user = UserEntity.ShowJSON(createdUser);

    return user.toPrimitives()
  }

  async findByEmail(email: Email): Promise<UserEntity | null> {
    const found = await this.prisma.sql.users.findUnique({
      where: { email: email.getValue() },
    });
    if (!found) return null;

    return new UserEntity(
      found.id,
      Email.create(found.email),
      found.name,
      found.password,
      found.role === 'admin' ? 'admin' : 'user',
      found.createdAt,
      found.updatedAt
    );
  }
  async findById(id: string): Promise<UserEntity | null> {
    const foundUser = await this.prisma.sql.users.findUnique({ where: { id } });
    if (!foundUser) return null;

    return UserEntity.ShowJSON(foundUser);
  }
}
