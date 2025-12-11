import { Injectable } from '@nestjs/common';

import { UserEntity } from '../../domain/entities/user.entity';
import { Email } from '../../domain/value-objects/email.vo';

import { AuthRepository } from '../../domain/repository/auth.repository';

import { Role } from 'prisma/mongodb/generated';

import { MongoPrismaService } from 'src/shared/infrastructure/prisma/services/mongo-prisma.service';

@Injectable()
export class AuthMongoRepository implements AuthRepository {
  constructor(
    private readonly prisma: MongoPrismaService,
  ) { }

  async register(user: UserEntity): Promise<UserEntity> {
    try {
      const createdUser = await this.prisma.users.create({
      data: {
        id: user.id.value,
        email: user.email.value,
        name: user.name,
        password: user.password,
        role: user.role.value as Role,
      },
    });
    return UserEntity.FromDbToEntityParse(createdUser);
    } catch (error) {
      throw new Error(`No se puede registrar al usuario: ${error.message}`)
    }
    
  }

  async findByEmail(email: Email): Promise<UserEntity | null> {
    const found = await this.prisma.users.findUnique({
      where: { email: email.value },
    });
    if (!found) return null;

    return UserEntity.FromDbToEntityParse(found);
  }

  async findById(id: string): Promise<any> {
    const found = await this.prisma.users.findUnique({ where: { id } });
    if (!found) return null;

    return UserEntity.FromDbToEntityParse(found);
  }
}
