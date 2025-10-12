import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/infrastructure/prisma/services/prisma.service';

import { AuthRepository } from '../../domain/repository/auth.repository';
import { UserEntity } from '../../domain/entity/user.entity';
import { Email } from '../../domain/values-object/email.vo';
import type { PasswordEncrypter } from 'src/auth/domain/repository/password-encrypter.repository';
import type { JwtTokenService } from '../security/jwt-token.service';
import { UserRepresentation } from 'src/auth/application/representation/user.representation';
import { SqlServerPrismaService } from 'src/shared/infrastructure/prisma/services/sqlserver-prisma.service';

@Injectable()
export class AuthSqlServerRepository implements AuthRepository {
  constructor(
    private readonly prisma: SqlServerPrismaService,
  ) { }

  login(user: UserEntity) {

    console.log('No hay nada aqui');
  }

  async register(user: UserEntity): Promise<UserEntity> {
    const createdUser = await this.prisma.users.create({
      data: {
        email: user.email.getValue(),
        name: user.name,
        password: user.password,
        role: user.role,
      },
    });
    return UserEntity.toParse(createdUser);
  }

  async findByEmail(email: Email): Promise<UserEntity | null> {
    const found = await this.prisma.users.findUnique({
      where: { email: email.getValue() },
    });
    if (!found) return null;

    return UserEntity.toParse(found);
  }
  
  async findById(id: string): Promise<any> {
    const foundUser = await this.prisma.users.findUnique({ where: { id } });
    if (!foundUser) return null;

    return UserRepresentation.fromUser(foundUser).format();
  }
}
