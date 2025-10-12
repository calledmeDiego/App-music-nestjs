
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient as MongoPrismaClient } from '../../../../../prisma/mongodb/generated';

@Injectable()
export class MongoPrismaService extends MongoPrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
    console.log('✅ Conectado a MongoDB');
  }

  async onModuleDestroy() {
    await this.$disconnect()
  }
}

