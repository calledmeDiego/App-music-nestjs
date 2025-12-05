import { Injectable } from '@nestjs/common';

import { AuthRepository } from '../../domain/repository/auth.repository';
import { UserEntity } from '../../domain/entities/user.entity';
import { Email } from '../../domain/value-objects/email.vo';
import { UserRepresentation } from 'src/auth/application/representation/user.representation';
import { MongoPrismaService } from 'src/shared/infrastructure/prisma/services/mongo-prisma.service';
import { Role } from 'prisma/mongodb/generated';

@Injectable()
export class AuthMongoRepository implements AuthRepository {
  constructor(
    private readonly prisma: MongoPrismaService,
  ) { }

  login(user: UserEntity) {
    console.log('No hay nada aqui');
  }

  async register(user: UserEntity): Promise<UserEntity> {
    const createdUser = await this.prisma.users.create({
      data: {
        id: <string>user.id,
        email: user.email.value,
        name: user.name,
        password: user.password,
        role: user.role.value as Role,
      },
    });
    return UserEntity.FromDbToEntityParse(createdUser);
  }

  async findByEmail(email: Email): Promise<UserEntity | null> {
    const found = await this.prisma.users.findUnique({
      where: { email: email.value },
    });
    if (!found) return null;

    return UserEntity.FromDbToEntityParse(found);
  }

  async findById(id: string): Promise<any> {
    const foundUser = await this.prisma.users.findUnique({ where: { id } });
    if (!foundUser) return null;

    return UserRepresentation.fromUser(UserEntity.FromDbToEntityParse(foundUser)).format();
  }
}
