import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

import { UserRepository } from '../../domain/repository/user.repository';
import { User } from '../../domain/entity/user.entity';
import { Email } from '../../domain/values-object/email.vo';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(user: User): Promise<User> {
    const createdUser = await this.prisma.users.create({
      data: {
        email: user.email.getValue(),
        name: user.name,
        password: user.password,
        role: user.role, 
      },
    });

    return User.ShowJSON(createdUser
    );
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

    return  User.ShowJSON(foundUser);
  }
}
